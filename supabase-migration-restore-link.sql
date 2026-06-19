-- Restore-link + log deletion. Run once in the Supabase SQL editor.

-- 1) Track the purchase email when access was granted by restoring on a different
--    login email (so the admin can see the divergence).
alter table public.entitlements add column if not exists restored_from text;

-- 2) Let the admin delete individual webhook log rows from the panel.
drop policy if exists "webhook_logs admin delete" on public.webhook_logs;
create policy "webhook_logs admin delete"
  on public.webhook_logs for delete using (public.is_admin());
