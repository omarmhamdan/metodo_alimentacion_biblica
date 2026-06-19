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

let _access: Record<string, boolean> = {};
let _emails: string[] = [];

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
  if (typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent("mab:entitlements"));
}

function norm(e: string | undefined | null): string {
  return (e ?? "").trim().toLowerCase();
}

/**
 * Resolve access AUTHORITATIVELY from Supabase for a set of emails.
 * On a successful fetch we REPLACE the cache (products not returned active = locked),
 * so a revoke in admin actually re-locks the device. On failure (offline) we keep
 * the existing cache, so a flaky network never wrongly blocks a paid user.
 */
async function pullFromCloud(emails: string[]): Promise<void> {
  if (!supabase || emails.length === 0) return;
  try {
    const { data, error } = await supabase
      .from("entitlements")
      .select("product, active")
      .in("email", emails)
      .eq("active", true);
    if (error || !data) return; // keep cache on failure
    const next: Record<string, boolean> = {};
    for (const row of data as { product: string; active: boolean }[]) {
      if (row.active) next[row.product] = true;
    }
    _access = next; // authoritative — anything missing is now locked
    writeLS(LS_KEY, _access);
    emit();
  } catch {
    /* offline — keep local */
  }
}

/** Load cached access + refresh from cloud for the logged-in email. Call at startup. */
export async function initEntitlements(loginEmail?: string): Promise<void> {
  _access = readLS<Record<string, boolean>>(LS_KEY, {});
  _emails = readLS<string[]>(LS_EMAILS, []);
  const le = norm(loginEmail);
  if (le && !_emails.includes(le)) {
    _emails.push(le);
    writeLS(LS_EMAILS, _emails);
  }
  emit();
  await pullFromCloud(_emails);
}

/** Wipe entitlement cache + tracked emails (call on logout — prevents access
 * leaking to the next user on a shared device; re-login refetches from the DB). */
export function clearEntitlements(): void {
  _access = {};
  _emails = [];
  if (typeof window !== "undefined") {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_EMAILS);
  }
  emit();
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

  // Fallback: direct read (device-local only) if the endpoint gave nothing.
  if (granted.length === 0 && supabase) {
    try {
      const { data } = await supabase
        .from("entitlements")
        .select("product, active")
        .eq("email", e)
        .eq("active", true);
      granted = ((data ?? []) as { product: string; active: boolean }[])
        .filter((r) => r.active)
        .map((r) => r.product as Produto);
    } catch {
      /* offline */
    }
  }

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
        out[e][row.product as Produto] = { active: row.active, restoredFrom: row.restored_from ?? null };
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
  return (data as (Omit<EntitlementRow, "restored_from"> & { restored_from?: string | null })[]).map(
    (r) => ({ ...r, restored_from: r.restored_from ?? null }),
  );
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
