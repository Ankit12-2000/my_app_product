-- =====================================================================
-- Storage bucket for product images.
-- Public read (so images show on the site); authenticated vendors upload.
-- Run after schema.sql / vendor_schema.sql.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "product images public read" on storage.objects;
create policy "product images public read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product images auth insert" on storage.objects;
create policy "product images auth insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists "product images auth update" on storage.objects;
create policy "product images auth update" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

drop policy if exists "product images auth delete" on storage.objects;
create policy "product images auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');
