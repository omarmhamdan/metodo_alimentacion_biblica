import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Credentials come from .env.local — created by you after creating the Supabase
// project. See README at the bottom for setup.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseEnabled = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "mab:auth",
      },
    })
  : null;

if (typeof window !== "undefined" && !supabaseEnabled) {
  console.warn(
    "[Supabase] Credentials missing. Falling back to local-only storage. " +
      "Add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to .env.local.",
  );
}
