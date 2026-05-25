-- Fix: profiles RLS was set "to anon" only. After we added Supabase Auth for
-- admins, regular app requests still need anon access. But the admin's
-- supabase-js client now sends JWTs → role becomes "authenticated" → old
-- policies don't match → 403 "new row violates row-level security policy".
--
-- Fix: switch profile policies to "public" (covers anon AND authenticated).

drop policy if exists "anon all profiles" on profiles;
create policy "public read profiles"   on profiles for select using (true);
create policy "public insert profiles" on profiles for insert with check (true);
create policy "public update profiles" on profiles for update using (true) with check (true);
create policy "public delete profiles" on profiles for delete using (is_admin());

-- recipe_photos: reads stay public, writes still admin-only (no change in intent,
-- but the existing policies are fine — already permissive on select)

-- ── One-shot: rebuild recipe_photos from existing Storage files ─────────────
-- Reads every object in the recipe-photos bucket, derives the recipe_id from
-- the filename (everything before "-<timestamp>" or before ".<ext>"), and
-- upserts a public URL into recipe_photos so old uploads come back online.

with derived as (
  select
    -- "lentilhas-esau-1716643200.webp" → "lentilhas-esau"
    -- "lentilhas-esau.webp"            → "lentilhas-esau"
    -- "omar@example.com/frango-ervas.webp" → "frango-ervas" (legacy per-user path)
    regexp_replace(
      regexp_replace(
        split_part(name, '/', greatest(1, array_length(string_to_array(name, '/'), 1))),
        '\.(webp|jpg|jpeg|png)$', ''
      ),
      '-\d{10,}$', ''
    ) as recipe_id,
    'https://qtzuozoekomauymnbwhy.supabase.co/storage/v1/object/public/recipe-photos/' || name as url,
    coalesce(updated_at, created_at) as ts
  from storage.objects
  where bucket_id = 'recipe-photos'
    and name not like '.%'
),
latest as (
  -- Keep only the most recent file per recipe_id (so multiple uploads of the
  -- same recipe don't break ON CONFLICT)
  select distinct on (recipe_id) recipe_id, url
  from derived
  where recipe_id <> ''
  order by recipe_id, ts desc
)
insert into recipe_photos (recipe_id, url)
select recipe_id, url from latest
on conflict (recipe_id) do update
  set url = excluded.url,
      updated_at = now();
