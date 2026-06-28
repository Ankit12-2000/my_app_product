-- =====================================================================
-- Moorti Marketplace - Admin schema (Phase 3)
-- Adds an is_admin() helper and admin-wide RLS so an admin can manage
-- every shop, product, taxonomy, blog and banner across the marketplace.
-- Run AFTER schema.sql + vendor_schema.sql.
-- =====================================================================

-- True when the current auth user has the 'admin' role.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Admin can do anything on these tables (adds to existing public/vendor policies).
drop policy if exists "admin all shops" on shops;
create policy "admin all shops" on shops for all using (is_admin()) with check (is_admin());

drop policy if exists "admin all products" on products;
create policy "admin all products" on products for all using (is_admin()) with check (is_admin());

drop policy if exists "admin all product images" on product_images;
create policy "admin all product images" on product_images for all using (is_admin()) with check (is_admin());

drop policy if exists "admin all categories" on categories;
create policy "admin all categories" on categories for all using (is_admin()) with check (is_admin());

drop policy if exists "admin all materials" on materials;
create policy "admin all materials" on materials for all using (is_admin()) with check (is_admin());

drop policy if exists "admin all blogs" on blogs;
create policy "admin all blogs" on blogs for all using (is_admin()) with check (is_admin());

drop policy if exists "admin all banners" on banners;
create policy "admin all banners" on banners for all using (is_admin()) with check (is_admin());

drop policy if exists "admin all reviews" on reviews;
create policy "admin all reviews" on reviews for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read inquiries" on inquiries;
create policy "admin read inquiries" on inquiries for select using (is_admin());

drop policy if exists "admin read profiles" on profiles;
create policy "admin read profiles" on profiles for select using (is_admin());
