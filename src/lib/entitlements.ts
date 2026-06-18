// Entitlements — controla acesso pago por produto (upsell).
// Fonte de verdade: tabela Supabase `entitlements(email, product, active)`.
// Liberação manual hoje (admin); webhook Hotmart numa 2ª fase grava na mesma tabela.
//
// Identidade: o acesso é resolvido para o email do usuário logado + quaisquer
// emails "restaurados" no dispositivo (botão "Já comprei"). Cache local espelha
// o estado pra funcionar offline e sem flash.

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

/** Pull active products for a set of emails from Supabase and merge into cache. */
async function pullFromCloud(emails: string[]): Promise<void> {
  if (!supabase || emails.length === 0) return;
  try {
    const { data, error } = await supabase
      .from("entitlements")
      .select("product, active")
      .in("email", emails)
      .eq("active", true);
    if (error || !data) return;
    for (const row of data as { product: string; active: boolean }[]) {
      if (row.active) _access[row.product] = true;
    }
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

/** True if the product is unlocked (admin bypass, else entitlement). */
export function hasAccess(product: Produto): boolean {
  if (isAdminLoggedIn()) return true;
  return _access[product] === true;
}

/** Restore a purchase by typing the email used at checkout. Returns granted products. */
export async function restoreByEmail(email: string): Promise<Produto[]> {
  const e = norm(email);
  if (!e) return [];
  if (!_emails.includes(e)) {
    _emails.push(e);
    writeLS(LS_EMAILS, _emails);
  }
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("entitlements")
      .select("product, active")
      .eq("email", e)
      .eq("active", true);
    if (error || !data) return [];
    const granted: Produto[] = [];
    for (const row of data as { product: string; active: boolean }[]) {
      if (row.active) {
        _access[row.product] = true;
        granted.push(row.product as Produto);
      }
    }
    writeLS(LS_KEY, _access);
    emit();
    return granted;
  } catch {
    return [];
  }
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

/** Admin: fetch entitlement state (active per product) for a set of emails. */
export async function adminFetchEntitlements(
  emails: string[],
): Promise<Record<string, Record<Produto, boolean>>> {
  const out: Record<string, Record<Produto, boolean>> = {};
  if (!supabase || emails.length === 0) return out;
  const norms = Array.from(new Set(emails.map(norm).filter(Boolean)));
  if (norms.length === 0) return out;
  try {
    const { data, error } = await supabase
      .from("entitlements")
      .select("email, product, active")
      .in("email", norms);
    if (error || !data) return out;
    for (const row of data as { email: string; product: string; active: boolean }[]) {
      const e = norm(row.email);
      if (!out[e]) out[e] = { "anti-inflamacao": false, "mesa-unica": false };
      if (row.product === "anti-inflamacao" || row.product === "mesa-unica") {
        out[e][row.product as Produto] = row.active;
      }
    }
    return out;
  } catch {
    return out;
  }
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
