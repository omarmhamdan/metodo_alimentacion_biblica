-- Migration: lock recipe_photos + storage writes behind Supabase Auth admins.
-- Run in SQL Editor → New query → paste → Run.
-- After this, create your admin user via Authentication → Users → "Add user"
-- (email + password), then insert that email into admin_users (see bottom).

-- ── Admin whitelist ─────────────────────────────────────────────────────────
create table if not exists admin_users (
  email      text primary key,
  created_at timestamptz default now()
);

-- Function: true when the current authenticated user is an admin.
-- SECURITY DEFINER lets the function read admin_users even though anon can't.
create or replace function is_admin() returns boolean
  language sql
  stable
  security definer
  set search_path = public
as $$
  select coalesce(
    (select true from admin_users where email = (select auth.email())),
    false
  );
$$;

-- ── Lock recipe_photos writes ───────────────────────────────────────────────
drop policy if exists "anon all photos" on recipe_photos;

create policy "anyone read photos" on recipe_photos
  for select using (true);
create policy "admin insert photos" on recipe_photos
  for insert with check (is_admin());
create policy "admin update photos" on recipe_photos
  for update using (is_admin()) with check (is_admin());
create policy "admin delete photos" on recipe_photos
  for delete using (is_admin());

-- ── Lock recipe_overrides writes ────────────────────────────────────────────
drop policy if exists "anon all overrides" on recipe_overrides;

create policy "anyone read overrides" on recipe_overrides
  for select using (true);
create policy "admin insert overrides" on recipe_overrides
  for insert with check (is_admin());
create policy "admin update overrides" on recipe_overrides
  for update using (is_admin()) with check (is_admin());
create policy "admin delete overrides" on recipe_overrides
  for delete using (is_admin());

-- ── Storage bucket: read public, write admin-only ───────────────────────────
drop policy if exists "anon read photos" on storage.objects;
drop policy if exists "anon upload photos" on storage.objects;
drop policy if exists "anon update photos" on storage.objects;
drop policy if exists "anon delete photos" on storage.objects;

create policy "public read photos" on storage.objects
  for select using (bucket_id = 'recipe-photos');
create policy "admin upload photos" on storage.objects
  for insert with check (bucket_id = 'recipe-photos' and is_admin());
create policy "admin update photos" on storage.objects
  for update using (bucket_id = 'recipe-photos' and is_admin());
create policy "admin delete photos" on storage.objects
  for delete using (bucket_id = 'recipe-photos' and is_admin());

-- ── After running this SQL ──────────────────────────────────────────────────
-- 1. Go to Authentication → Users → "Add user" → Create User (email + password)
--    Email: omar.mhamdan@hotmail.com
--    Password: pick something strong
-- 2. Run THIS to mark that email as admin (replace with the email you used):
--
--    insert into admin_users (email) values ('omar.mhamdan@hotmail.com')
--      on conflict do nothing;
