// Entitlements — controla acesso pago por produto (upsell).
// Fonte de verdade: tabela Supabase `entitlements(email, product, active, restored_from)`.
// Grava: webhook Hotmart (compra/reembolso), admin (manual) e "Já comprei"
// (restore-link via /api/restore, que copia o acesso do email da compra para o
// email de login — desbloqueio permanente e cross-device).
//
// Identidade: o acesso é resolvido para o email do usuário logado + quaisquer
// emails "restaurados" no dispositivo. Cache local espelha o estado pra funcionar
// offline e sem flash.

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { isAdminLoggedIn } from "./admin-store";

export type Produto = "anti-inflamacao" | "mesa-unica";

export const PRODUTOS: { id: Produto; pt: string; es: string }[] = [
  { id: "anti-inflamacao", pt: "Anti-Inflamação 7 Dias", es: "Antiinflamación 7 Días" },
  { id: "mesa-unica", pt: "Guia Mesa Única", es: "Guía Mesa Única" },
];

// Links de checkout da Hotmart.
export const CHECKOUT_URLS: Record<Produto, string> = {
  "anti-inflamacao": "https://pay.hotmart.com/A106251023T",
  "mesa-unica": "https://pay.hotmart.com/I106251089R",
};

const LS_KEY = "mab:entitlements"; // Record<Produto, boolean> resolvido neste dispositivo
const LS_EMAILS = "mab:entitlement_emails"; // emails já verificados (login + restaurados)
const LS_BLACKLIST = "mab:blacklist"; // BlacklistInfo | null — bloqueio por reembolso do produto principal

export type BlacklistInfo = { email: string; reason: string | null };

let _access: Record<string, boolean> = {};
let _emails: string[] = [];
let _loginEmail = ""; // the current account email — blacklist is keyed ONLY to this
let _blacklist: BlacklistInfo | null = null;

function readLS<T>(k: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try {
    return JSON.parse(localStorage.getItem(k) ?? "null") ?? fb;
  } catch {
    return fb;
  }
}
function writeLS(k: string, v: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
}

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("mab:entitlements"));
}

function norm(e: string | undefined | null): string {
  return (e ?? "").trim().toLowerCase();
}

type ResolveResult = {
  products: Produto[];
  blacklist: { email: string; reason: string | null } | null;
};

/**
 * Resolve access (active products) + blacklist via the Worker data API.
 * Returns null on failure (offline) so callers can keep their cached state.
 * The `profiles`/`entitlements`/`blacklist` tables are RLS-locked — the anon
 * client can't read them; only this same-origin endpoint (service_role) can.
 */
async function resolveAccess(emails: string[], loginEmail: string): Promise<ResolveResult | null> {
  if (typeof window === "undefined") return null; // browser-only (relative URL)
  try {
    const res = await fetch("/api/access/resolve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ emails, loginEmail }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ResolveResult;
    return {
      products: (data.products ?? []).filter(
        (p): p is Produto => p === "anti-inflamacao" || p === "mesa-unica",
      ),
      blacklist: data.blacklist ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Resolve access AUTHORITATIVELY from Supabase for a set of emails.
 * On a successful fetch we REPLACE the cache (products not returned active = locked),
 * so a revoke in admin actually re-locks the device. On failure (offline) we keep
 * the existing cache, so a flaky network never wrongly blocks a paid user.
 */
async function pullFromCloud(emails: string[]): Promise<void> {
  // No verified email on this device → this is a plain visitor. Drop any stale
  // cache so a browser previously used for a purchase/restore/admin test doesn't
  // keep leaking paid access. (A flaky network never reaches here — emails empty
  // means there's genuinely nobody to resolve access for.)
  if (emails.length === 0) {
    if (Object.keys(_access).length > 0) {
      _access = {};
      writeLS(LS_KEY, _access);
      emit();
    }
    return;
  }
  const result = await resolveAccess(emails, _loginEmail);
  if (!result) return; // offline / failure — keep cache so a paid user stays unlocked
  const next: Record<string, boolean> = {};
  for (const product of result.products) next[product] = true;
  _access = next; // authoritative — anything missing is now locked
  writeLS(LS_KEY, _access);
  emit();
}

/**
 * Resolve the blacklist (refund/chargeback on the MAIN product) for the tracked
 * emails. Authoritative on success: a removed block actually unblocks. On
 * failure (offline) we keep the cached state so a refunded user can't dodge the
 * block by going offline. No emails → never blacklisted (plain visitor).
 */
async function refreshBlacklist(): Promise<void> {
  // Keyed to the LOGIN email only — never to restored/typed purchase emails, so a
  // user can't be blocked by a refunded email they merely typed in "Já comprei",
  // nor inherit a previous user's block on a shared device.
  if (!_loginEmail) {
    if (_blacklist) {
      _blacklist = null;
      writeLS(LS_BLACKLIST, null);
      emit();
    }
    return;
  }
  const result = await resolveAccess([], _loginEmail);
  if (!result) return; // offline / failure — keep cached block
  _blacklist = result.blacklist;
  writeLS(LS_BLACKLIST, _blacklist);
  emit();
}

/** Load cached access + refresh from cloud for the logged-in email. Call at startup. */
export async function initEntitlements(loginEmail?: string): Promise<void> {
  _access = readLS<Record<string, boolean>>(LS_KEY, {});
  _emails = readLS<string[]>(LS_EMAILS, []);
  _blacklist = readLS<BlacklistInfo | null>(LS_BLACKLIST, null);
  const le = norm(loginEmail);
  _loginEmail = le;
  // Drop a cached block that isn't for the current account (e.g. previous user on
  // a shared device) so it never flashes before the authoritative re-check.
  if (_blacklist && norm(_blacklist.email) !== le) {
    _blacklist = null;
    writeLS(LS_BLACKLIST, null);
  }
  if (le && !_emails.includes(le)) {
    _emails.push(le);
    writeLS(LS_EMAILS, _emails);
  }
  emit();
  await pullFromCloud(_emails);
  await refreshBlacklist();
}

/** Wipe entitlement cache + tracked emails (call on logout — prevents access
 * leaking to the next user on a shared device; re-login refetches from the DB). */
export function clearEntitlements(): void {
  _access = {};
  _emails = [];
  _loginEmail = "";
  _blacklist = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_EMAILS);
    localStorage.removeItem(LS_BLACKLIST);
  }
  emit();
}

/** Current blacklist block for this device, or null. Admin login bypasses it. */
export function blacklistInfo(): BlacklistInfo | null {
  if (isAdminLoggedIn()) return null;
  return _blacklist;
}

/**
 * One-off authoritative blacklist check for a single email (used at login before
 * a profile is loaded). Returns the block info or null. Null on offline (the
 * AppShell gate re-checks once the email is tracked and the network is back).
 */
export async function checkBlacklist(email: string): Promise<BlacklistInfo | null> {
  const e = norm(email);
  if (!e) return null;
  const result = await resolveAccess([], e);
  return result?.blacklist ?? null;
}

/** Reactive blacklist gate for components (null = not blocked). */
export function useBlacklist(): BlacklistInfo | null {
  const [bl, setBl] = useState<BlacklistInfo | null>(() => blacklistInfo());
  useEffect(() => {
    const fn = () => setBl(blacklistInfo());
    fn();
    window.addEventListener("mab:entitlements", fn);
    window.addEventListener("mab:editmode", fn); // admin login state may change
    return () => {
      window.removeEventListener("mab:entitlements", fn);
      window.removeEventListener("mab:editmode", fn);
    };
  }, []);
  return bl;
}

/** True if the product is unlocked (admin bypass, else entitlement). */
export function hasAccess(product: Produto): boolean {
  if (isAdminLoggedIn()) return true;
  return _access[product] === true;
}

/** Current login email (from local profile), used to make a restore permanent. */
function loginEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    const u = JSON.parse(localStorage.getItem("mab:user") ?? "null") as { email?: string } | null;
    return norm(u?.email);
  } catch {
    return "";
  }
}

/**
 * Restore a purchase by typing the email used at checkout. Returns granted products.
 * Calls /api/restore so the unlock is LINKED to the login email (permanent +
 * cross-device + visible in admin). Falls back to a direct read if the endpoint
 * isn't reachable (e.g. local dev without the Worker).
 */
export async function restoreByEmail(email: string): Promise<Produto[]> {
  const e = norm(email);
  if (!e) return [];
  if (!_emails.includes(e)) {
    _emails.push(e);
    writeLS(LS_EMAILS, _emails);
  }

  let granted: Produto[] = [];
  try {
    const res = await fetch("/api/restore", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ loginEmail: loginEmail(), purchaseEmail: e }),
    });
    if (res.ok) {
      const data = (await res.json()) as { granted?: string[] };
      granted = (data.granted ?? []).filter(
        (p): p is Produto => p === "anti-inflamacao" || p === "mesa-unica",
      );
    }
  } catch {
    /* fall through to direct read */
  }

  // No direct-read fallback: the entitlements table is RLS-locked to the anon
  // client. /api/restore (service_role, behind the Worker) is the source of truth.

  for (const p of granted) _access[p] = true;
  writeLS(LS_KEY, _access);
  emit();
  return granted;
}

/** Admin: grant/revoke a product for an email (writes to Supabase). */
export async function setEntitlement(
  email: string,
  product: Produto,
  active: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const e = norm(email);
  if (!e) return { ok: false, error: "Email vazio." };
  if (!supabase) return { ok: false, error: "Supabase não configurado." };
  try {
    const { error } = await supabase
      .from("entitlements")
      .upsert({ email: e, product, active, updated_at: new Date().toISOString() });
    if (error) return { ok: false, error: error.message };
    // If this email is one we track on this device, reflect immediately.
    if (_emails.includes(e)) {
      _access[product] = active;
      writeLS(LS_KEY, _access);
      emit();
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export type EntState = { active: boolean; restoredFrom: string | null };

/** Admin: fetch entitlement state per product (active + purchase email) for a set of emails. */
export async function adminFetchEntitlements(
  emails: string[],
): Promise<Record<string, Partial<Record<Produto, EntState>>>> {
  const out: Record<string, Partial<Record<Produto, EntState>>> = {};
  if (!supabase || emails.length === 0) return out;
  const norms = Array.from(new Set(emails.map(norm).filter(Boolean)));
  if (norms.length === 0) return out;
  try {
    // select("*") tolerates the restored_from column not existing yet (pre-migration).
    const { data, error } = await supabase.from("entitlements").select("*").in("email", norms);
    if (error || !data) return out;
    for (const row of data as {
      email: string;
      product: string;
      active: boolean;
      restored_from?: string | null;
    }[]) {
      const e = norm(row.email);
      if (!out[e]) out[e] = {};
      if (row.product === "anti-inflamacao" || row.product === "mesa-unica") {
        out[e][row.product as Produto] = {
          active: row.active,
          restoredFrom: row.restored_from ?? null,
        };
      }
    }
    return out;
  } catch {
    return out;
  }
}

export type EntitlementRow = {
  email: string;
  product: string;
  active: boolean;
  source: string | null;
  restored_from: string | null;
  updated_at: string;
};

/** Admin: list ALL entitlement rows (the source of truth, independent of profiles). */
export async function adminListAllEntitlements(): Promise<EntitlementRow[]> {
  if (!supabase) return [];
  // select("*") tolerates the restored_from column not existing yet (pre-migration).
  const { data, error } = await supabase
    .from("entitlements")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return (
    data as (Omit<EntitlementRow, "restored_from"> & { restored_from?: string | null })[]
  ).map((r) => ({ ...r, restored_from: r.restored_from ?? null }));
}

export type WebhookLogRow = {
  id: number;
  received_at: string;
  event: string | null;
  product_id: string | null;
  product_name: string | null;
  mapped_product: string | null;
  email: string | null;
  result: string | null;
  detail: string | null;
};

/** Admin: recent webhook deliveries (requires is_admin via RLS). */
export async function adminListWebhookLogs(limit = 50): Promise<WebhookLogRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("webhook_logs")
    .select("*")
    .order("received_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as WebhookLogRow[];
}

/** Admin: delete one webhook log row. */
export async function adminDeleteWebhookLog(id: number): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("webhook_logs").delete().eq("id", id);
  return !error;
}

export type BlacklistRow = {
  email: string;
  reason: string | null;
  source: string | null;
  event: string | null;
  created_at: string;
};

/** Admin/app: fetch all blacklist rows. Public read (RLS), used to flag leads in red. */
export async function adminListBlacklist(): Promise<BlacklistRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blacklist")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as BlacklistRow[];
}

/** Admin: remove a block (lifts the refund blacklist for an email). Requires is_admin via RLS. */
export async function adminRemoveBlacklist(email: string): Promise<boolean> {
  const e = norm(email);
  if (!supabase || !e) return false;
  const { error } = await supabase.from("blacklist").delete().eq("email", e);
  if (error) return false;
  // Reflect immediately if it's an email tracked on this device.
  if (_blacklist && norm(_blacklist.email) === e) {
    _blacklist = null;
    writeLS(LS_BLACKLIST, null);
    emit();
  }
  return true;
}

/** Admin: manually blacklist an email with a reason. Requires is_admin via RLS. */
export async function adminAddBlacklist(email: string, reason: string): Promise<boolean> {
  const e = norm(email);
  if (!supabase || !e) return false;
  const { error } = await supabase.from("blacklist").upsert({
    email: e,
    reason: reason || null,
    source: "admin",
    created_at: new Date().toISOString(),
  });
  return !error;
}

/** Reactive access check for a product. */
export function useEntitlement(product: Produto): boolean {
  const [ok, setOk] = useState<boolean>(() => hasAccess(product));
  useEffect(() => {
    const fn = () => setOk(hasAccess(product));
    fn();
    window.addEventListener("mab:entitlements", fn);
    window.addEventListener("mab:editmode", fn); // admin login state may change
    return () => {
      window.removeEventListener("mab:entitlements", fn);
      window.removeEventListener("mab:editmode", fn);
    };
  }, [product]);
  return ok;
}
