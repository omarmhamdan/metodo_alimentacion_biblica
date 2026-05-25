// Cloud sync layer — keeps profile + daily + photos in sync with Supabase.
// Gracefully no-ops when Supabase isn't configured (falls back to localStorage).

import { supabase, supabaseEnabled } from "./supabase";
import type { UserProfile, DailyState } from "./store";

const PHOTOS_BUCKET = "recipe-photos";

// ── Profile + daily ──────────────────────────────────────────────────────────

/** Pull profile + daily from cloud by email. Returns null if not found. */
export async function fetchProfileByEmail(
  email: string,
): Promise<{ user: UserProfile; daily?: DailyState } | null> {
  if (!supabase) return null;
  const key = email.trim().toLowerCase();
  if (!key) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", key)
    .maybeSingle();
  if (error || !data) return null;
  const user: UserProfile = {
    nome: data.nome ?? "",
    email: data.email,
    idade: data.idade ?? undefined,
    pesoAtual: data.peso_atual ?? undefined,
    objetivo: data.objetivo ?? undefined,
    energia: data.energia ?? undefined,
    aguaMeta: data.agua_meta ?? 2000,
    restricoes: data.restricoes ?? undefined,
    onboarded: !!data.onboarded,
    createdAt: data.created_at,
  };
  return { user, daily: data.daily ?? undefined };
}

/** Upsert profile + daily into cloud (idempotent, fire-and-forget). */
export async function upsertProfile(user: UserProfile, daily?: DailyState): Promise<void> {
  if (!supabase) return;
  const key = (user.email ?? "").trim().toLowerCase();
  if (!key) return;
  const payload: Record<string, unknown> = {
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
  if (daily) payload.daily = daily;
  const { error } = await supabase.from("profiles").upsert(payload);
  if (error) console.warn("[Sync] upsertProfile failed", error.message);
}

/** Push only the daily snapshot (smaller write). */
export async function upsertDaily(email: string, daily: DailyState): Promise<void> {
  if (!supabase) return;
  const key = email.trim().toLowerCase();
  if (!key) return;
  const { error } = await supabase.from("profiles").update({ daily }).eq("email", key);
  if (error) console.warn("[Sync] upsertDaily failed", error.message);
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
    return null;
  }
  const { data: pub } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  const url = pub.publicUrl;
  // Save mapping in DB
  const { error: dbErr } = await supabase
    .from("recipe_photos")
    .upsert({ recipe_id: recipeId, url });
  if (dbErr) console.warn("[Sync] photo db upsert failed", dbErr.message);
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
