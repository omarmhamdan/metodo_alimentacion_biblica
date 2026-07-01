// Cloud sync layer — keeps profile + daily + photos in sync with Supabase.
// Gracefully no-ops when Supabase isn't configured (falls back to localStorage).

import { supabase, supabaseEnabled } from "./supabase";
import type { UserProfile, DailyState } from "./store";

const PHOTOS_BUCKET = "recipe-photos";

// ── Profile + daily ──────────────────────────────────────────────────────────
// These go through the Worker data API (/api/profile/*) instead of hitting the
// `profiles` table directly with the public anon key. The table is RLS-locked;
// the Worker uses the service_role key and only ever touches a single email.

/** POST JSON to a same-origin Worker endpoint. Returns parsed body or null. */
async function postApi<T>(path: string, body: unknown): Promise<T | null> {
  if (typeof window === "undefined") return null; // browser-only (relative URL)
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Pull profile + daily from cloud by email. Returns null if not found. */
export async function fetchProfileByEmail(
  email: string,
): Promise<{ user: UserProfile; daily?: DailyState } | null> {
  const key = email.trim().toLowerCase();
  if (!key) return null;
  const out = await postApi<{ profile: Record<string, unknown> | null }>("/api/profile/get", {
    email: key,
  });
  const data = out?.profile;
  if (!data) return null;
  const user: UserProfile = {
    nome: (data.nome as string) ?? "",
    email: data.email as string,
    idade: (data.idade as number) ?? undefined,
    pesoAtual: (data.peso_atual as number) ?? undefined,
    objetivo: (data.objetivo as string) ?? undefined,
    energia: (data.energia as number) ?? undefined,
    aguaMeta: (data.agua_meta as number) ?? 2000,
    restricoes: (data.restricoes as string) ?? undefined,
    onboarded: !!data.onboarded,
    createdAt: data.created_at as string,
  };
  return { user, daily: (data.daily as DailyState) ?? undefined };
}

/** Upsert profile + daily into cloud (idempotent, fire-and-forget). */
export async function upsertProfile(user: UserProfile, daily?: DailyState): Promise<void> {
  const key = (user.email ?? "").trim().toLowerCase();
  if (!key) return;
  const row: Record<string, unknown> = {
    email: key,
    nome: user.nome ?? "",
    idade: user.idade ?? null,
    peso_atual: user.pesoAtual ?? null,
    objetivo: user.objetivo ?? null,
    energia: user.energia ?? null,
    agua_meta: user.aguaMeta ?? 2000,
    restricoes: user.restricoes ?? null,
    onboarded: !!user.onboarded,
  };
  if (daily) row.daily = daily;
  await postApi("/api/profile/upsert", { row });
}

/** Push only the daily snapshot (smaller write). */
export async function upsertDaily(email: string, daily: DailyState): Promise<void> {
  const key = email.trim().toLowerCase();
  if (!key) return;
  await postApi("/api/profile/upsert", { row: { email: key, daily } });
}

// ── Recipe photos (GLOBAL — admin uploads visible to all users) ─────────────

/** Upload a recipe photo (data URL or Blob). Returns public URL. */
export async function uploadRecipePhoto(recipeId: string, dataUrl: string): Promise<string | null> {
  if (!supabase) return null;

  // dataUrl → Blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const ext = blob.type.includes("webp") ? "webp" : "jpg";
  // Cache-bust path so HTTP caches refresh
  const path = `${recipeId}-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, blob, { upsert: true, contentType: blob.type, cacheControl: "3600" });
  if (upErr) {
    console.warn("[Sync] photo upload failed", upErr.message);
    throw new Error(`Falha ao enviar a foto para o Storage do Supabase: ${upErr.message}`);
  }
  const { data: pub } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  const url = pub.publicUrl;
  // Save mapping in DB. This row is what makes the photo visible to everyone
  // (fetchRecipePhotos reads it), so a failure here must NOT look like success.
  const { error: dbErr } = await supabase
    .from("recipe_photos")
    .upsert({ recipe_id: recipeId, url });
  if (dbErr) {
    console.warn("[Sync] photo db upsert failed", dbErr.message);
    throw new Error(`Falha ao registrar a foto no Supabase: ${dbErr.message}`);
  }
  return url;
}

/** Fetch ALL global recipe photos. */
export async function fetchRecipePhotos(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data, error } = await supabase.from("recipe_photos").select("recipe_id, url");
  if (error || !data) return {};
  const out: Record<string, string> = {};
  for (const row of data) out[row.recipe_id] = row.url;
  return out;
}

/** Delete a photo override. */
export async function deleteRecipePhoto(recipeId: string): Promise<void> {
  if (!supabase) return;
  // Get URL to extract storage path before deleting the row
  const { data } = await supabase
    .from("recipe_photos")
    .select("url")
    .eq("recipe_id", recipeId)
    .maybeSingle();
  await supabase.from("recipe_photos").delete().eq("recipe_id", recipeId);
  // Best-effort delete from storage — extract filename from URL
  if (data?.url) {
    const match = data.url.match(/\/recipe-photos\/(.+)$/);
    if (match) await supabase.storage.from(PHOTOS_BUCKET).remove([match[1]]);
  }
}

// ── Admin queries ────────────────────────────────────────────────────────────

export type AdminUserRow = {
  email: string;
  nome: string;
  idade: number | null;
  peso_atual: number | null;
  objetivo: string | null;
  agua_meta: number;
  onboarded: boolean;
  lang: string;
  daily: DailyState | null;
  created_at: string;
  updated_at: string;
};

/** List all profiles. Use for the admin "Usuários" tab. */
export async function adminListUsers(): Promise<AdminUserRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as AdminUserRow[];
}

/** Aggregate stats for the admin dashboard. */
export async function adminStats(): Promise<{
  totalUsers: number;
  onboardedUsers: number;
  totalPhotos: number;
  byLang: Record<string, number>;
}> {
  if (!supabase) return { totalUsers: 0, onboardedUsers: 0, totalPhotos: 0, byLang: {} };
  const [u, p] = await Promise.all([
    supabase.from("profiles").select("lang, onboarded"),
    supabase.from("recipe_photos").select("recipe_id", { count: "exact", head: true }),
  ]);
  const rows = (u.data ?? []) as { lang: string; onboarded: boolean }[];
  const byLang: Record<string, number> = {};
  let onboardedUsers = 0;
  for (const r of rows) {
    byLang[r.lang ?? "es"] = (byLang[r.lang ?? "es"] ?? 0) + 1;
    if (r.onboarded) onboardedUsers++;
  }
  return {
    totalUsers: rows.length,
    onboardedUsers,
    totalPhotos: p.count ?? 0,
    byLang,
  };
}

/** Delete a user (cascade removes their photos + overrides too). */
export async function adminDeleteUser(email: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("profiles").delete().eq("email", email.toLowerCase());
  return !error;
}

export { supabaseEnabled };
