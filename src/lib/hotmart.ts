// Hotmart purchase webhook (server-side, runs in the Cloudflare Worker).
// Grants/revokes the per-product entitlement automatically on payment events.
//
// Wiring: src/server.ts routes POST /api/hotmart here. The webhook is configured
// in Hotmart → "Todos os produtos", so it fires for the MAIN product (ignored)
// and the two upsells (granted). Auth is the hottok secret.
//
// Required Worker secrets/vars (set via `wrangler secret put` or the CF dashboard):
//   HOTMART_HOTTOK              — webhook verification token from Hotmart
//   SUPABASE_URL               — e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  — service role key (bypasses RLS to write entitlements)
//   HOTMART_PRODUCT_MAP        — optional JSON: {"<productId>":"mesa-unica", ...}
//                                 (hardens mapping once you know the numeric IDs)

type Produto = "anti-inflamacao" | "mesa-unica";

export type HotmartEnv = {
  HOTMART_HOTTOK?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  HOTMART_PRODUCT_MAP?: string;
};

// Events that unlock the bonus, and events that lock it back.
// Known Hotmart product IDs → our upsell keys. HOTMART_PRODUCT_MAP env can extend/override.
const DEFAULT_PRODUCT_MAP: Record<string, Produto> = {
  "7909761": "anti-inflamacao", // Protocolo Antiinflamación de 7 Días
  "7909787": "mesa-unica", // Guía Mesa Única
};

const GRANT_EVENTS = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const REVOKE_EVENTS = new Set([
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_PROTEST",
  "PURCHASE_CANCELED",
]);

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function norm(email: unknown): string {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

/** Map a Hotmart product (id/ucode/name) to one of our upsells, or null if it's the main product. */
function mapProduct(product: unknown, env: HotmartEnv): Produto | null {
  if (!product || typeof product !== "object") return null;
  const p = product as { id?: unknown; ucode?: unknown; name?: unknown };

  // 1) Explicit id map (preferred). Defaults baked in; HOTMART_PRODUCT_MAP env can extend.
  let map: Record<string, string> = DEFAULT_PRODUCT_MAP;
  if (env.HOTMART_PRODUCT_MAP) {
    try {
      map = { ...DEFAULT_PRODUCT_MAP, ...(JSON.parse(env.HOTMART_PRODUCT_MAP) as Record<string, string>) };
    } catch {
      /* bad JSON — keep defaults */
    }
  }
  const hit = map[String(p.id)] ?? map[String(p.ucode)];
  if (hit === "mesa-unica" || hit === "anti-inflamacao") return hit;

  // 2) Name heuristic fallback.
  const name = String(p.name ?? "").toLowerCase();
  if (name.includes("mesa")) return "mesa-unica";
  if (name.includes("inflam")) return "anti-inflamacao";
  return null;
}

/** Upsert the entitlement row in Supabase via the REST API (service role bypasses RLS). */
async function writeEntitlement(
  env: HotmartEnv,
  email: string,
  product: Produto,
  active: boolean,
  opts: { source?: string; restoredFrom?: string } = {},
): Promise<{ ok: boolean; error?: string }> {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, error: "supabase not configured" };
  try {
    const row: Record<string, unknown> = {
      email,
      product,
      active,
      source: opts.source ?? "hotmart",
      updated_at: new Date().toISOString(),
    };
    if (opts.restoredFrom !== undefined) row.restored_from = opts.restoredFrom;
    const res = await fetch(`${url}/rest/v1/entitlements?on_conflict=email,product`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) return { ok: false, error: `supabase ${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/** Read the active upsell products for an email (service role). */
async function readActiveProducts(env: HotmartEnv, email: string): Promise<Produto[]> {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !email) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/entitlements?select=product&active=eq.true&email=eq.${encodeURIComponent(email)}`,
      { headers: { apikey: key, authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as { product: string }[];
    return rows
      .map((r) => r.product)
      .filter((p): p is Produto => p === "anti-inflamacao" || p === "mesa-unica");
  } catch {
    return [];
  }
}

/**
 * Restore-link: a user logged in with one email but bought with another.
 * Verify the purchase email has active access and copy it onto the LOGIN email so
 * the unlock is permanent, cross-device and visible in the admin (with the source
 * purchase email recorded in restored_from).
 */
export async function handleRestoreLink(request: Request, env: HotmartEnv): Promise<Response> {
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);
  let body: { loginEmail?: unknown; purchaseEmail?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  const loginEmail = norm(body.loginEmail);
  const purchaseEmail = norm(body.purchaseEmail);
  if (!purchaseEmail) return json({ granted: [] });

  const granted = await readActiveProducts(env, purchaseEmail);
  // Persist onto the login email only when it differs (divergent purchase email).
  if (loginEmail && loginEmail !== purchaseEmail && granted.length > 0) {
    for (const product of granted) {
      await writeEntitlement(env, loginEmail, product, true, {
        source: "restore",
        restoredFrom: purchaseEmail,
      });
    }
  }
  return json({ granted });
}

type LogRow = {
  event?: string;
  product_id?: string;
  product_name?: string;
  mapped_product?: string | null;
  email?: string;
  result: string; // granted | revoked | skipped | unauthorized | error
  detail?: string;
};

/** Best-effort: record every received webhook so the admin can audit deliveries. */
async function logWebhook(env: HotmartEnv, row: LogRow): Promise<void> {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    await fetch(`${url}/rest/v1/webhook_logs`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "return=minimal",
      },
      body: JSON.stringify({ ...row, received_at: new Date().toISOString() }),
    });
  } catch {
    /* never let logging break the webhook response */
  }
}

export async function handleHotmartWebhook(request: Request, env: HotmartEnv): Promise<Response> {
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!env.HOTMART_HOTTOK) return json({ error: "webhook not configured" }, 503);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const event = typeof body.event === "string" ? body.event : "";
  const data = (body.data ?? {}) as { buyer?: { email?: unknown }; product?: unknown };
  const p = (data.product ?? {}) as { id?: unknown; name?: unknown };
  const email = norm(data.buyer?.email);
  const base = {
    event,
    product_id: p.id != null ? String(p.id) : undefined,
    product_name: typeof p.name === "string" ? p.name : undefined,
    email: email || undefined,
  };

  // Hotmart 2.0 sends the token in the X-HOTMART-HOTTOK header; older payloads carry body.hottok.
  const headerTok = request.headers.get("x-hotmart-hottok") ?? "";
  const bodyTok = typeof body.hottok === "string" ? body.hottok : "";
  if (headerTok !== env.HOTMART_HOTTOK && bodyTok !== env.HOTMART_HOTTOK) {
    await logWebhook(env, { ...base, result: "unauthorized" });
    return json({ error: "unauthorized" }, 401);
  }

  if (!email) {
    await logWebhook(env, { ...base, result: "skipped", detail: "no buyer email" });
    return json({ ok: true, skipped: "no buyer email" });
  }

  const product = mapProduct(data.product, env);
  if (!product) {
    await logWebhook(env, { ...base, mapped_product: null, result: "skipped", detail: "not an upsell" });
    return json({ ok: true, skipped: "not an upsell" });
  }

  const grant = GRANT_EVENTS.has(event);
  const revoke = REVOKE_EVENTS.has(event);
  if (!grant && !revoke) {
    await logWebhook(env, { ...base, mapped_product: product, result: "skipped", detail: `event ignored` });
    return json({ ok: true, skipped: `event ${event} ignored` });
  }

  const r = await writeEntitlement(env, email, product, grant);
  if (!r.ok) {
    await logWebhook(env, { ...base, mapped_product: product, result: "error", detail: r.error });
    console.error(`[hotmart] write failed: ${r.error}`);
    return json({ error: r.error }, 502);
  }
  await logWebhook(env, { ...base, mapped_product: product, result: grant ? "granted" : "revoked" });
  return json({ ok: true, email, product, active: grant });
}
