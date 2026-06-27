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
//   BREVO_API_KEY              — Brevo transactional email API key (access email)

type Produto = "anti-inflamacao" | "mesa-unica";

export type HotmartEnv = {
  HOTMART_HOTTOK?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  HOTMART_PRODUCT_MAP?: string;
  BREVO_API_KEY?: string;
};

// ── Access email (Brevo) ───────────────────────────────────────────────────────
// Sent once per buyer (idempotent by transaction) when the MAIN product is approved.
const APP_URL = "https://app.metodoalimentacionbiblica.online";
const EMAIL_FROM = { name: "Método Alimentación Bíblica", email: "acceso@metodoalimentacionbiblica.online" };
// Reply-To on the same domain as From (more aligned/trusted than an external Gmail).
// Replies to acceso@ still land in the Gmail via the Cloudflare Email Routing catch-all.
const EMAIL_REPLY_TO = { name: "Método Alimentación Bíblica", email: "acceso@metodoalimentacionbiblica.online" };
// Hidden BCC archive: a copy of every access email lands in this inbox, so the
// owner has a "sent items" feed on their phone (Gmail filter can auto-label it).
const EMAIL_ARCHIVE_BCC = "metodoalimentacionbiblica@gmail.com";
const EMAIL_SUBJECT = "Tu acceso al Método Alimentación Bíblica";
// Delay the access email a few minutes after the webhook (purchase moment) via
// Brevo's `scheduledAt`. Brevo holds and delivers it — no extra infra needed.
const SEND_DELAY_MS = 3 * 60 * 1000;

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

// Human-readable reason shown next to the lead in the admin blacklist (per event).
const REVOKE_REASON: Record<string, string> = {
  PURCHASE_PROTEST: "Solicitou reembolso / abriu disputa (PURCHASE_PROTEST)",
  PURCHASE_REFUNDED: "Compra reembolsada (PURCHASE_REFUNDED)",
  PURCHASE_CHARGEBACK: "Chargeback (PURCHASE_CHARGEBACK)",
  PURCHASE_CANCELED: "Compra cancelada (PURCHASE_CANCELED)",
};

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
      map = {
        ...DEFAULT_PRODUCT_MAP,
        ...(JSON.parse(env.HOTMART_PRODUCT_MAP) as Record<string, string>),
      };
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

/**
 * Add (active=true) or lift (active=false) a blacklist block for an email via the
 * Supabase REST API (service role bypasses RLS). Used for MAIN-product refunds.
 */
async function setBlacklist(
  env: HotmartEnv,
  email: string,
  active: boolean,
  opts: { reason?: string; event?: string } = {},
): Promise<{ ok: boolean; error?: string }> {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, error: "supabase not configured" };
  try {
    if (active) {
      const res = await fetch(`${url}/rest/v1/blacklist?on_conflict=email`, {
        method: "POST",
        headers: {
          apikey: key,
          authorization: `Bearer ${key}`,
          "content-type": "application/json",
          prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          email,
          reason: opts.reason ?? null,
          source: "hotmart",
          event: opts.event ?? null,
          created_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) return { ok: false, error: `supabase ${res.status}: ${await res.text()}` };
    } else {
      const res = await fetch(`${url}/rest/v1/blacklist?email=eq.${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: { apikey: key, authorization: `Bearer ${key}`, prefer: "return=minimal" },
      });
      if (!res.ok) return { ok: false, error: `supabase ${res.status}: ${await res.text()}` };
    }
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

/** Spanish, responsive, image-free HTML body for the access email. */
function accessEmailHtml(saludo: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${EMAIL_SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f1ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#3a3a3a;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">Tu compra fue aprobada y tu acceso ya está activo. Entra con tu correo.</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ea;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
          <tr>
            <td style="background-color:#5a7247;padding:28px 32px;text-align:center;">
              <div style="color:#ffffff;font-size:18px;font-weight:600;letter-spacing:0.3px;">Método Alimentación Bíblica</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <p style="margin:0 0 18px 0;font-size:18px;font-weight:600;color:#2f3a25;">${saludo}</p>
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;">
                Tu compra fue aprobada y <strong>tu acceso ya está activo</strong>. ✨
                Gracias por dar este paso hacia una alimentación más sana, sencilla y llena de sentido.
              </p>
              <p style="margin:0 0 8px 0;font-size:16px;line-height:1.6;">
                Para entrar es muy simple: <strong>tu usuario es este mismo correo electrónico</strong>.
                No necesitas crear ninguna contraseña — solo ingresa con tu email y empieza.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px 32px;text-align:center;">
              <a href="${APP_URL}" style="display:inline-block;background-color:#5a7247;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:14px 34px;border-radius:10px;">
                Entrar al Método
              </a>
              <p style="margin:14px 0 0 0;font-size:13px;color:#7a7a72;">
                o copia este enlace: <br>
                <a href="${APP_URL}" style="color:#5a7247;">${APP_URL}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 8px 32px;">
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#555;">
                Funciona en cualquier dispositivo — celular, tablet o computadora — y puedes
                guardarlo en la pantalla de inicio para abrirlo como una app.
              </p>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#555;">
                Si también compraste el <strong>Protocolo Antiinflamación de 7 Días</strong> o la
                <strong>Guía Mesa Única</strong>, ya quedaron liberados para tu acceso en este mismo enlace.
              </p>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#555;">
                ¿Tienes alguna duda? Solo <strong>responde a este correo</strong> y con gusto te ayudamos.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 32px 32px;border-top:1px solid #eee;">
              <p style="margin:18px 0 4px 0;font-size:15px;line-height:1.5;color:#3a3a3a;">
                Con cariño,<br>
                <strong>Beatriz Morales</strong>
              </p>
              <p style="margin:0;font-size:13px;color:#8a8a82;">Método Alimentación Bíblica</p>
            </td>
          </tr>
        </table>
        <p style="max-width:560px;margin:18px auto 0 auto;font-size:11px;line-height:1.5;color:#a8a8a0;text-align:center;">
          Recibiste este correo porque realizaste una compra del Método Alimentación Bíblica.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Plain-text alternative of the access email (multipart → better deliverability). */
function accessEmailText(saludo: string): string {
  return `${saludo}

Tu compra fue aprobada y tu acceso ya está activo. Gracias por dar este paso hacia una alimentación más sana, sencilla y llena de sentido.

Para entrar es muy simple: tu usuario es este mismo correo electrónico. No necesitas crear ninguna contraseña — solo ingresa con tu email y empieza.

Entra al Método: ${APP_URL}

Funciona en cualquier dispositivo (celular, tablet o computadora) y puedes guardarlo en la pantalla de inicio para abrirlo como una app.

Si también compraste el Protocolo Antiinflamación de 7 Días o la Guía Mesa Única, ya quedaron liberados para tu acceso en este mismo enlace.

¿Tienes alguna duda? Solo responde a este correo y con gusto te ayudamos.

Con cariño,
Beatriz Morales
Método Alimentación Bíblica`;
}

/** Send the access email via Brevo. Returns ok/error; never throws. */
async function sendAccessEmail(
  env: HotmartEnv,
  opts: { email: string; name?: string },
): Promise<{ ok: boolean; error?: string }> {
  const key = env.BREVO_API_KEY;
  if (!key) return { ok: false, error: "brevo not configured" };
  const firstName = (opts.name ?? "").trim().split(/\s+/)[0] ?? "";
  const saludo = firstName ? `¡Hola, ${firstName}!` : "¡Hola!";
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": key,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: EMAIL_FROM,
        to: [{ email: opts.email, ...(opts.name ? { name: opts.name } : {}) }],
        bcc: [{ email: EMAIL_ARCHIVE_BCC }],
        replyTo: EMAIL_REPLY_TO,
        subject: EMAIL_SUBJECT,
        htmlContent: accessEmailHtml(saludo),
        textContent: accessEmailText(saludo),
        scheduledAt: new Date(Date.now() + SEND_DELAY_MS).toISOString(),
      }),
    });
    if (!res.ok) return { ok: false, error: `brevo ${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Atomically claim the right to send the access email for this transaction.
 * Inserts the row only if absent (on_conflict do nothing). Returns true if WE
 * inserted it (first delivery) → caller should send; false if it already existed
 * (Hotmart retry) or the write failed → caller must NOT send.
 */
async function claimAccessEmail(
  env: HotmartEnv,
  transactionId: string,
  email: string,
): Promise<boolean> {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  try {
    const res = await fetch(`${url}/rest/v1/access_emails?on_conflict=transaction_id`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "resolution=ignore-duplicates,return=representation",
      },
      body: JSON.stringify({ transaction_id: transactionId, email }),
    });
    if (!res.ok) return false;
    const rows = (await res.json()) as unknown[];
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

/** Release a previously claimed transaction so a Hotmart retry can resend (used on send failure). */
async function releaseAccessEmail(env: HotmartEnv, transactionId: string): Promise<void> {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    await fetch(
      `${url}/rest/v1/access_emails?transaction_id=eq.${encodeURIComponent(transactionId)}`,
      { method: "DELETE", headers: { apikey: key, authorization: `Bearer ${key}`, prefer: "return=minimal" } },
    );
  } catch {
    /* best-effort */
  }
}

/**
 * Fully isolated access-email step. NEVER throws and NEVER affects the access
 * provisioning that ran before it. Idempotent across Hotmart webhook retries.
 */
async function maybeSendAccessEmail(
  env: HotmartEnv,
  opts: { email: string; name?: string; transactionId: string; base: Partial<LogRow> },
): Promise<void> {
  try {
    if (!env.BREVO_API_KEY) return; // not configured — skip silently
    const claimed = await claimAccessEmail(env, opts.transactionId, opts.email);
    if (!claimed) return; // already sent for this transaction, or claim write failed
    const r = await sendAccessEmail(env, { email: opts.email, name: opts.name });
    if (!r.ok) {
      console.error(`[hotmart] access email failed: ${r.error}`);
      await releaseAccessEmail(env, opts.transactionId); // allow a retry to resend
      await logWebhook(env, { ...opts.base, mapped_product: null, result: "email_error", detail: r.error });
      return;
    }
    await logWebhook(env, { ...opts.base, mapped_product: null, result: "email_sent", detail: opts.email });
  } catch (err) {
    console.error("[hotmart] access email unexpected error", err);
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
  const data = (body.data ?? {}) as {
    buyer?: { email?: unknown; name?: unknown };
    product?: unknown;
    purchase?: { transaction?: unknown };
  };
  const p = (data.product ?? {}) as { id?: unknown; name?: unknown };
  const email = norm(data.buyer?.email);
  const buyerName = typeof data.buyer?.name === "string" ? data.buyer.name : undefined;
  const transaction =
    typeof data.purchase?.transaction === "string" && data.purchase.transaction
      ? data.purchase.transaction
      : `noTx:${email}`; // fallback: dedupe per buyer when Hotmart omits the transaction
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
  const grant = GRANT_EVENTS.has(event);
  const revoke = REVOKE_EVENTS.has(event);

  // ── MAIN product (not one of the two upsells) ────────────────────────────────
  // Refund/chargeback/protest/cancel → blacklist the buyer (blocks ALL app access).
  // A later approved purchase lifts the block. Other events are ignored.
  if (!product) {
    if (revoke) {
      const r = await setBlacklist(env, email, true, {
        reason: REVOKE_REASON[event] ?? `Reembolso/cancelamento (${event})`,
        event,
      });
      if (!r.ok) {
        await logWebhook(env, { ...base, mapped_product: null, result: "error", detail: r.error });
        console.error(`[hotmart] blacklist failed: ${r.error}`);
        return json({ error: r.error }, 502);
      }
      await logWebhook(env, {
        ...base,
        mapped_product: null,
        result: "blacklisted",
        detail: REVOKE_REASON[event] ?? event,
      });
      return json({ ok: true, email, blacklisted: true });
    }
    if (grant) {
      // New approved purchase of the main product → lift any existing block.
      const r = await setBlacklist(env, email, false, { event });
      await logWebhook(env, {
        ...base,
        mapped_product: null,
        result: r.ok ? "unblacklisted" : "skipped",
        detail: r.ok ? "main product approved — block lifted" : (r.error ?? "main product"),
      });
      // Access provisioning is done. The email below is fully isolated: it can
      // never throw into, block, or undo the access we just granted.
      await maybeSendAccessEmail(env, { email, name: buyerName, transactionId: transaction, base });
      return json({ ok: true, email, blacklisted: false });
    }
    await logWebhook(env, {
      ...base,
      mapped_product: null,
      result: "skipped",
      detail: "main product — event ignored",
    });
    return json({ ok: true, skipped: "not an upsell" });
  }

  // ── Upsell product ───────────────────────────────────────────────────────────
  if (!grant && !revoke) {
    await logWebhook(env, {
      ...base,
      mapped_product: product,
      result: "skipped",
      detail: `event ignored`,
    });
    return json({ ok: true, skipped: `event ${event} ignored` });
  }

  const r = await writeEntitlement(env, email, product, grant);
  if (!r.ok) {
    await logWebhook(env, { ...base, mapped_product: product, result: "error", detail: r.error });
    console.error(`[hotmart] write failed: ${r.error}`);
    return json({ error: r.error }, 502);
  }
  await logWebhook(env, {
    ...base,
    mapped_product: product,
    result: grant ? "granted" : "revoked",
  });
  return json({ ok: true, email, product, active: grant });
}
