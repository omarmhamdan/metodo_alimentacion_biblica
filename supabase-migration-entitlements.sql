-- Entitlements — per-product access for the two upsells (Anti-Inflamação, Mesa Única).
-- Run once in the Supabase SQL editor.
--
-- Writes happen from two places:
--   1) Admin panel ("Acessos" tab / per-user toggle) — authenticated admin, gated by is_admin().
--   2) Hotmart webhook (Worker) — uses the service_role key, which BYPASSES RLS.
-- Reads are public (anon) so the app can resolve access by email on any device.

create table if not exists public.entitlements (
  email text not null,
  product text not null,           -- 'anti-inflamacao' | 'mesa-unica'
  active boolean not null default true,
  source text,                     -- 'admin' | 'hotmart'
  updated_at timestamptz default now(),
  primary key (email, product)
);

alter table public.entitlements enable row level security;

drop policy if exists "entitlements public read" on public.entitlements;
create policy "entitlements public read"
  on public.entitlements for select using (true);

drop policy if exists "entitlements admin write" on public.entitlements;
create policy "entitlements admin write"
  on public.entitlements for all
  using (public.is_admin()) with check (public.is_admin());
