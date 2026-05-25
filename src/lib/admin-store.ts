// Admin store — Supabase Auth + content overrides.
// Real auth: admin signs in with email + password via Supabase Auth.
// The `admin_users` table whitelists which emails get admin privileges, and
// RLS policies use the `is_admin()` SQL function to gate writes.
import { supabase } from "./supabase";

const OVERRIDES_KEY = "mab:content_overrides";

/** Sign in via Supabase Auth. Resolves true if credentials valid AND email is in admin_users. */
export async function adminLogin(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) {
    return { ok: false, error: "Supabase não configurado. Configure VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY." };
  }
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  if (error) return { ok: false, error: "Email ou senha incorretos." };

  // Verify the email is whitelisted as admin
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { ok: false, error: "Esta conta não tem permissão de admin." };
  }
  return { ok: true };
}

export async function adminLogout(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/** Synchronous check based on cached session (auth.persistSession=true). */
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined" || !supabase) return false;
  // supabase-js caches the session in localStorage under our custom storageKey
  try {
    const raw = localStorage.getItem("mab:auth");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.access_token;
  } catch {
    return false;
  }
}

/** Async authoritative check: validates the session AND that email is admin. */
export async function verifyAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return false;
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return !!isAdmin;
}

// ── Content overrides ─────────────────────────────────────────────────────────

export interface ContentOverrides {
  recipes: Record<string, { imagem?: string; titulo?: string; titulo_es?: string }>;
  fundamentos: {
    items?: Array<{ titulo?: string; titulo_es?: string; texto?: string; texto_es?: string }>;
  };
  global: { appName?: string; tagline_es?: string; tagline_pt?: string };
}

const DEFAULT_OVERRIDES: ContentOverrides = { recipes: {}, fundamentos: { items: [] }, global: {} };

export function loadOverrides(): ContentOverrides {
  if (typeof window === "undefined") return DEFAULT_OVERRIDES;
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_OVERRIDES;
  } catch {
    return DEFAULT_OVERRIDES;
  }
}

export function saveOverrides(o: ContentOverrides): { ok: boolean; error?: string } {
  if (typeof window === "undefined") return { ok: false };
  try {
    // Strip base64 images — they live in IndexedDB, not localStorage.
    // URL overrides (https://...) are small and can stay.
    const stripped: ContentOverrides = {
      ...o,
      recipes: Object.fromEntries(
        Object.entries(o.recipes).map(([id, ov]) => {
          const { imagem, ...rest } = ov;
          const keep = imagem && !imagem.startsWith("data:") ? { imagem } : {};
          return [id, { ...rest, ...keep }];
        }),
      ),
    };
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(stripped));
    window.dispatchEvent(new CustomEvent("mab:overrides"));
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao salvar";
    console.error("[Admin] saveOverrides failed:", msg);
    return { ok: false, error: `Erro ao salvar: ${msg}` };
  }
}

export function exportOverrides(): string {
  return JSON.stringify(loadOverrides(), null, 2);
}

export function clearOverrides() {
  if (typeof window !== "undefined") localStorage.removeItem(OVERRIDES_KEY);
  window.dispatchEvent(new CustomEvent("mab:overrides"));
}

// ── User snapshot from localStorage (single-device) ──────────────────────────

export interface UserSnapshot {
  nome: string;
  email: string;
  createdAt: string;
  onboarded: boolean;
  jornadaDia: number;
  sequencia: number;
  favoritos: string[];
  ultimaReceita?: string;
  aguaMl: number;
  lang: string;
}

export function getUserSnapshot(): UserSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const user = JSON.parse(localStorage.getItem("mab:user") ?? "null");
    const daily = JSON.parse(localStorage.getItem("mab:daily") ?? "null");
    const lang = localStorage.getItem("mab:lang") ?? "es";
    if (!user) return null;
    return {
      nome: user.nome ?? "—",
      email: user.email ?? "—",
      createdAt: user.createdAt ?? "—",
      onboarded: !!user.onboarded,
      jornadaDia: daily?.jornadaDia ?? 0,
      sequencia: daily?.sequencia ?? 0,
      favoritos: daily?.favoritos ?? [],
      ultimaReceita: daily?.ultimaReceita,
      aguaMl: daily?.aguaMl ?? 0,
      lang,
    };
  } catch {
    return null;
  }
}
