-- =====================================================================
-- Moorti Marketplace - Vendor portal schema (Phase 2)
-- Adds auth-linked profiles, vendor RLS, conversation + quotation tables.
-- Run AFTER schema.sql on the same Supabase project. Idempotent-ish.
-- =====================================================================

-- ---------- Profiles (1:1 with auth.users) ----------

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'vendor',       -- vendor | admin | support | customer
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "own profile read" on profiles;
drop policy if exists "own profile update" on profiles;
drop policy if exists "own profile insert" on profiles;
create policy "own profile read"   on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);
create policy "own profile insert" on profiles for insert with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Vendor ownership policies ----------
-- shops.vendor_id holds the owning auth user id.

drop policy if exists "vendor manage own shop" on shops;
create policy "vendor manage own shop" on shops
  for all using (vendor_id = auth.uid()) with check (vendor_id = auth.uid());

drop policy if exists "vendor manage own products" on products;
create policy "vendor manage own products" on products
  for all
  using (shop_id in (select id from shops where vendor_id = auth.uid()))
  with check (shop_id in (select id from shops where vendor_id = auth.uid()));

drop policy if exists "vendor manage own product images" on product_images;
create policy "vendor manage own product images" on product_images
  for all
  using (product_id in (
    select p.id from products p join shops s on s.id = p.shop_id
    where s.vendor_id = auth.uid()))
  with check (product_id in (
    select p.id from products p join shops s on s.id = p.shop_id
    where s.vendor_id = auth.uid()));

drop policy if exists "vendor read own inquiries" on inquiries;
create policy "vendor read own inquiries" on inquiries
  for select using (shop_id in (select id from shops where vendor_id = auth.uid()));

drop policy if exists "vendor update own inquiries" on inquiries;
create policy "vendor update own inquiries" on inquiries
  for update using (shop_id in (select id from shops where vendor_id = auth.uid()));

drop policy if exists "vendor manage own reviews" on reviews;
create policy "vendor manage own reviews" on reviews
  for select using (shop_id in (select id from shops where vendor_id = auth.uid()));

-- ---------- Inquiry conversation / internal notes ----------

create table if not exists inquiry_messages (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references inquiries(id) on delete cascade,
  sender text not null default 'vendor',     -- vendor | customer | system
  body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists inquiry_messages_inquiry_idx on inquiry_messages(inquiry_id);

alter table inquiry_messages enable row level security;
drop policy if exists "vendor manage own inquiry messages" on inquiry_messages;
create policy "vendor manage own inquiry messages" on inquiry_messages
  for all
  using (inquiry_id in (
    select i.id from inquiries i join shops s on s.id = i.shop_id
    where s.vendor_id = auth.uid()))
  with check (inquiry_id in (
    select i.id from inquiries i join shops s on s.id = i.shop_id
    where s.vendor_id = auth.uid()));

-- ---------- Quotations ----------

create table if not exists quotations (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  inquiry_id uuid references inquiries(id) on delete set null,
  number text,
  customer_name text,
  customer_phone text,
  customer_email text,
  customer_city text,
  notes text,
  terms text,
  gst_percent numeric not null default 0,
  discount numeric not null default 0,
  status text not null default 'draft',       -- draft | sent | accepted | rejected
  created_at timestamptz not null default now()
);
create index if not exists quotations_shop_idx on quotations(shop_id);

create table if not exists quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references quotations(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  description text not null,
  quantity numeric not null default 1,
  unit_price numeric not null default 0,
  sort_order integer not null default 0
);
create index if not exists quotation_items_quotation_idx on quotation_items(quotation_id);

alter table quotations enable row level security;
alter table quotation_items enable row level security;

drop policy if exists "vendor manage own quotations" on quotations;
create policy "vendor manage own quotations" on quotations
  for all
  using (shop_id in (select id from shops where vendor_id = auth.uid()))
  with check (shop_id in (select id from shops where vendor_id = auth.uid()));

drop policy if exists "vendor manage own quotation items" on quotation_items;
create policy "vendor manage own quotation items" on quotation_items
  for all
  using (quotation_id in (
    select q.id from quotations q join shops s on s.id = q.shop_id
    where s.vendor_id = auth.uid()))
  with check (quotation_id in (
    select q.id from quotations q join shops s on s.id = q.shop_id
    where s.vendor_id = auth.uid()));
