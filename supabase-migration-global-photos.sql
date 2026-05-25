-- Migration: make recipe_photos global (admin uploads visible to all users)
-- Run in SQL Editor → New query → paste → Run

drop table if exists recipe_photos cascade;

create table recipe_photos (
  recipe_id   text primary key,
  url         text not null,
  updated_at  timestamptz default now()
);

-- Reusing the trigger from base schema
drop trigger if exists recipe_photos_updated_at on recipe_photos;
create trigger recipe_photos_updated_at before update on recipe_photos
  for each row execute function set_updated_at();

alter table recipe_photos enable row level security;
drop policy if exists "anon all photos" on recipe_photos;
create policy "anon all photos" on recipe_photos for all to anon using (true) with check (true);
