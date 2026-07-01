// Data API — server-side (Cloudflare Worker) proxy for user-facing data access.
//
// Moves profile / entitlement / blacklist reads+writes off the PUBLIC anon key
// and behind the Worker's service_role key. The tables are RLS-locked (anon has
// no access; see supabase-migration-lockdown.sql) — only this Worker
// (service_role) and authenticated admins (is_admin) can touch them.
//
// Security model: login is email-only by product decision, so identity is NOT
// cryptographically verified. To make that safe, every endpoint here operates on
// a SINGLE email from the request body and NEVER returns a list — so the public
// surface can't be used to dump or enumerate the customer base. Abuse of a known
// email is bounded by a Cloudflare rate-limit rule on /api/profile/* and
// /api/restore (configured in the CF dashboard, not in code).

export type DataEnv = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

type Produto = "anti-inflamacao" | "mesa-unica";

// Columns the client is allowed to write to `profiles`. Anything else in the
// payload is dropped defensively (client can't inject arbitrary columns).
const PROFILE_WRITE_COLUMNS = new Set([
  "email",
  "nome",
  "idade",
  "peso_atual",
  "objetivo",
  "energia",
  "agua_meta",
  "restricoes",
  "onboarded",
  "daily",
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

// A permissive but sane email check — just enough to reject junk before a query.
function isEmail(e: string): boolean {
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function creds(env: DataEnv): { url: string; key: string } | null {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

function sbHeaders(key: string, extra: Record<string, string> = {}): Record<string, string> {
  return { apikey: key, authorization: `Bearer ${key}`, ...extra };
}

// ── /api/profile/get ──────────────────────────────────────────────────────────
// Body: { email }. Returns { profile: <row>|null } for that single email.
export async function handleProfileGet(request: Request, env: DataEnv): Promise<Response> {
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);
  const c = creds(env);
  if (!c) return json({ error: "not configured" }, 503);

  let body: { email?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  const email = norm(body.email);
  if (!isEmail(email)) return json({ error: "invalid email" }, 400);

  try {
    const res = await fetch(
      `${c.url}/rest/v1/profiles?select=*&limit=1&email=eq.${encodeURIComponent(email)}`,
      { headers: sbHeaders(c.key) },
    );
    if (!res.ok) return json({ error: `supabase ${res.status}` }, 502);
    const rows = (await res.json()) as unknown[];
    return json({ profile: Array.isArray(rows) && rows.length > 0 ? rows[0] : null });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 502);
  }
}

// ── /api/profile/upsert ───────────────────────────────────────────────────────
// Body: { row } — a snake_case profiles row (must include `email`). Only
// whitelisted columns are written; the row is keyed/forced to its own email.
export async function handleProfileUpsert(request: Request, env: DataEnv): Promise<Response> {
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);
  const c = creds(env);
  if (!c) return json({ error: "not configured" }, 503);

  let body: { row?: Record<string, unknown> };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  const raw = body.row ?? {};
  const email = norm(raw.email);
  if (!isEmail(email)) return json({ error: "invalid email" }, 400);

  // Whitelist columns; force the normalized email.
  const row: Record<string, unknown> = { email };
  for (const [k, v] of Object.entries(raw)) {
    if (k !== "email" && PROFILE_WRITE_COLUMNS.has(k)) row[k] = v;
  }

  try {
    const res = await fetch(`${c.url}/rest/v1/profiles?on_conflict=email`, {
      method: "POST",
      headers: sbHeaders(c.key, {
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates,return=minimal",
      }),
      body: JSON.stringify(row),
    });
    if (!res.ok) return json({ error: `supabase ${res.status}: ${await res.text()}` }, 502);
    return json({ ok: true });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 502);
  }
}

// ── /api/access/resolve ───────────────────────────────────────────────────────
// Body: { emails: string[], loginEmail?: string }.
// Returns { products: Produto[], blacklist: {email,reason}|null }.
//  - products: active upsell products across the tracked emails (login + restored).
//  - blacklist: refund/chargeback block for the LOGIN email only (never the
//    restored/typed emails), matching the previous client-side rule.
export async function handleAccessResolve(request: Request, env: DataEnv): Promise<Response> {
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);
  const c = creds(env);
  if (!c) return json({ error: "not configured" }, 503);

  let body: { emails?: unknown; loginEmail?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  const emails = Array.from(
    new Set((Array.isArray(body.emails) ? body.emails : []).map(norm).filter(isEmail)),
  ).slice(0, 20); // bound the IN() list
  const loginEmail = norm(body.loginEmail);

  let products: Produto[] = [];
  let blacklist: { email: string; reason: string | null } | null = null;

  try {
    if (emails.length > 0) {
      const inList = emails.map((e) => `"${e.replace(/"/g, "")}"`).join(",");
      const res = await fetch(
        `${c.url}/rest/v1/entitlements?select=product&active=eq.true&email=in.(${encodeURIComponent(inList)})`,
        { headers: sbHeaders(c.key) },
      );
      if (res.ok) {
        const rows = (await res.json()) as { product: string }[];
        products = Array.from(
          new Set(
            rows
              .map((r) => r.product)
              .filter((p): p is Produto => p === "anti-inflamacao" || p === "mesa-unica"),
          ),
        );
      }
    }

    if (isEmail(loginEmail)) {
      const res = await fetch(
        `${c.url}/rest/v1/blacklist?select=email,reason&limit=1&email=eq.${encodeURIComponent(loginEmail)}`,
        { headers: sbHeaders(c.key) },
      );
      if (res.ok) {
        const rows = (await res.json()) as { email: string; reason: string | null }[];
        if (Array.isArray(rows) && rows.length > 0) {
          blacklist = { email: loginEmail, reason: rows[0].reason ?? null };
        }
      }
    }
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 502);
  }

  return json({ products, blacklist });
}
