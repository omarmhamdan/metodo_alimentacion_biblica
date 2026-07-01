-- Lockdown — remove ALL anon (public) access to user data. After this, the
-- public/anon key can no longer read or write these tables; only:
--   • the Cloudflare Worker via the service_role key (bypasses RLS) — user app, and
--   • authenticated admins via is_admin() — the admin panel.
--
-- The app reads/writes profiles, entitlements and blacklist through the Worker
-- endpoints (/api/profile/*, /api/access/resolve, /api/restore) instead of the
-- anon supabase-js client. Run once in the Supabase SQL editor.
--
-- ⚠️  Only POLICIES change here — no user rows are touched or deleted.

-- ── profiles ────────────────────────────────────────────────────────────────
-- Drop every policy we've ever created on profiles (idempotent across versions).
drop policy if exists "anon all profiles"     on profiles;
drop policy if exists "public read profiles"  on profiles;
drop policy if exists "public insert profiles" on profiles;
drop policy if exists "public update profiles" on profiles;
drop policy if exists "public delete profiles" on profiles;
drop policy if exists "admin read profiles"   on profiles;
drop policy if exists "admin delete profiles" on profiles;

-- Admin-only read + delete. NO insert/update policy → the anon/authenticated
-- (non-admin) client cannot write; the Worker's service_role bypasses RLS.
create policy "admin read profiles"   on profiles for select using (is_admin());
create policy "admin delete profiles" on profiles for delete using (is_admin());

-- ── entitlements ────────────────────────────────────────────────────────────
drop policy if exists "entitlements public read" on public.entitlements;
drop policy if exists "entitlements admin read"  on public.entitlements;
create policy "entitlements admin read"
  on public.entitlements for select using (public.is_admin());

drop policy if exists "entitlements admin write" on public.entitlements;
create policy "entitlements admin write"
  on public.entitlements for all
  using (public.is_admin()) with check (public.is_admin());

-- ── blacklist ───────────────────────────────────────────────────────────────
drop policy if exists "blacklist public read" on public.blacklist;
drop policy if exists "blacklist admin read"  on public.blacklist;
create policy "blacklist admin read"
  on public.blacklist for select using (public.is_admin());

drop policy if exists "blacklist admin write" on public.blacklist;
create policy "blacklist admin write"
  on public.blacklist for all
  using (public.is_admin()) with check (public.is_admin());

-- recipe_photos: intentionally unchanged — public read (global recipe photos),
-- admin-only writes. No user PII lives there.

-- ── Pending security-lints (safe to re-run) ────────────────────────────────
-- is_admin() must be callable by authenticated (admin panel) but NOT anon.
revoke execute on function public.is_admin() from anon, public;
grant  execute on function public.is_admin() to authenticated;

-- Harden the updated-at trigger's search_path.
create or replace function set_updated_at() returns trigger
  language plpgsql
  security invoker
  set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
