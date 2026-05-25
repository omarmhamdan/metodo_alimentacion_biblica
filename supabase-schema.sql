-- ── MAB Schema ───────────────────────────────────────────────────────────────
-- Run this in Supabase: SQL Editor → New query → paste → Run

-- 1) Profiles (one row per user, keyed by email — no auth needed for MVP)
create table if not exists profiles (
  email          text primary key,
  nome           text default '',
  idade          int,
  peso_atual     numeric,
  objetivo       text,
  agua_meta      int default 2000,
  energia        int,
  restricoes     text,
  onboarded      bool default false,
  daily          jsonb default '{}'::jsonb,
  lang           text default 'es',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- 2) Recipe photo overrides per user (stored as public URL from Storage)
create table if not exists recipe_photos (
  email          text references profiles(email) on delete cascade,
  recipe_id      text not null,
  url            text not null,
  updated_at     timestamptz default now(),
  primary key (email, recipe_id)
);

-- 3) Recipe text overrides (titles in PT/ES) — small, fits in profile or separate
create table if not exists recipe_overrides (
  email          text references profiles(email) on delete cascade,
  recipe_id      text not null,
  titulo_pt      text,
  titulo_es      text,
  primary key (email, recipe_id)
);

-- ── Updated-at trigger ──────────────────────────────────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────────────
-- For MVP (email-only, no auth), we allow anon to do everything on these tables.
-- When you add real auth later, lock these down with auth.email() = email.
alter table profiles enable row level security;
alter table recipe_photos enable row level security;
alter table recipe_overrides enable row level security;

drop policy if exists "anon all profiles" on profiles;
create policy "anon all profiles" on profiles for all to anon using (true) with check (true);

drop policy if exists "anon all photos" on recipe_photos;
create policy "anon all photos" on recipe_photos for all to anon using (true) with check (true);

drop policy if exists "anon all overrides" on recipe_overrides;
create policy "anon all overrides" on recipe_overrides for all to anon using (true) with check (true);

-- ── Storage bucket + policies ───────────────────────────────────────────────
-- Run after creating the bucket "recipe-photos" via Storage UI (public on).
-- These policies let anon upload + read photos. Lock down later with auth.

insert into storage.buckets (id, name, public)
  values ('recipe-photos', 'recipe-photos', true)
  on conflict (id) do update set public = true;

drop policy if exists "anon read photos" on storage.objects;
create policy "anon read photos" on storage.objects for select to anon
  using (bucket_id = 'recipe-photos');

drop policy if exists "anon upload photos" on storage.objects;
create policy "anon upload photos" on storage.objects for insert to anon
  with check (bucket_id = 'recipe-photos');

drop policy if exists "anon update photos" on storage.objects;
create policy "anon update photos" on storage.objects for update to anon
  using (bucket_id = 'recipe-photos');

drop policy if exists "anon delete photos" on storage.objects;
create policy "anon delete photos" on storage.objects for delete to anon
  using (bucket_id = 'recipe-photos');
