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

  // 1) Explicit id map (preferred — set HOTMART_PRODUCT_MAP once you know the IDs).
  if (env.HOTMART_PRODUCT_MAP) {
    try {
      const m = JSON.parse(env.HOTMART_PRODUCT_MAP) as Record<string, string>;
      const hit = m[String(p.id)] ?? m[String(p.ucode)];
      if (hit === "mesa-unica" || hit === "anti-inflamacao") return hit;
    } catch {
      /* bad JSON — fall through to name heuristic */
    }
  }

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
): Promise<{ ok: boolean; error?: string }> {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, error: "supabase not configured" };
  try {
    const res = await fetch(`${url}/rest/v1/entitlements?on_conflict=email,product`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        email,
        product,
        active,
        source: "hotmart",
        updated_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) return { ok: false, error: `supabase ${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
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

  // Hotmart 2.0 sends the token in the X-HOTMART-HOTTOK header; older payloads carry body.hottok.
  const headerTok = request.headers.get("x-hotmart-hottok") ?? "";
  const bodyTok = typeof body.hottok === "string" ? body.hottok : "";
  if (headerTok !== env.HOTMART_HOTTOK && bodyTok !== env.HOTMART_HOTTOK) {
    return json({ error: "unauthorized" }, 401);
  }

  const event = typeof body.event === "string" ? body.event : "";
  const data = (body.data ?? {}) as {
    buyer?: { email?: unknown };
    product?: unknown;
  };

  const email = norm(data.buyer?.email);
  if (!email) return json({ ok: true, skipped: "no buyer email" });

  const product = mapProduct(data.product, env);
  if (!product) {
    // Main product or unknown — log id/name so you can fill HOTMART_PRODUCT_MAP if needed.
    const p = data.product as { id?: unknown; name?: unknown } | undefined;
    console.log(`[hotmart] ignored event=${event} productId=${p?.id} name=${p?.name}`);
    return json({ ok: true, skipped: "not an upsell" });
  }

  const grant = GRANT_EVENTS.has(event);
  const revoke = REVOKE_EVENTS.has(event);
  if (!grant && !revoke) return json({ ok: true, skipped: `event ${event} ignored` });

  const r = await writeEntitlement(env, email, product, grant);
  if (!r.ok) {
    console.error(`[hotmart] write failed: ${r.error}`);
    return json({ error: r.error }, 502);
  }
  console.log(`[hotmart] ${grant ? "granted" : "revoked"} ${product} for ${email} (event=${event})`);
  return json({ ok: true, email, product, active: grant });
}
