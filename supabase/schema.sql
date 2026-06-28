-- =====================================================================
-- Moorti Marketplace - Public website schema (Phase 1)
-- Run this in the Supabase SQL editor on a fresh project.
-- Covers the tables the public site reads + the inquiries it writes.
-- Vendor/admin tables from the master spec can be layered on later.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Reference tables ----------

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

-- ---------- Vendors / shops ----------
-- vendor_id will reference auth.users once vendor auth is added.

create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid,
  name text not null,
  slug text not null unique,
  tagline text,
  description text,
  logo_url text,
  banner_url text,
  city text,
  state text,
  phone text,
  email text,
  whatsapp text,
  is_featured boolean not null default false,
  is_approved boolean not null default false,
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Products ----------

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  material_id uuid references materials(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  deity text,
  finish text,
  size text,
  height_cm numeric,
  weight_kg numeric,
  price_min numeric,
  price_max numeric,
  city text,
  video_url text,
  is_featured boolean not null default false,
  is_approved boolean not null default false,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_shop_idx on products(shop_id);
create index if not exists products_category_idx on products(category_id);
create index if not exists products_approved_idx on products(is_approved);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer not null default 0
);
create index if not exists product_images_product_idx on product_images(product_id);

-- ---------- Reviews ----------

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Blog / CMS ----------

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null,
  cover_url text,
  author text,
  is_published boolean not null default true,
  published_at timestamptz not null default now()
);

-- ---------- Banners ----------

create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  link_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

-- ---------- Inquiries (written by the public site) ----------

create type inquiry_status as enum (
  'new', 'contacted', 'quotation_sent', 'negotiation', 'confirmed', 'closed', 'rejected'
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  city text,
  quantity integer not null default 1,
  requirement text not null,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);
create index if not exists inquiries_shop_idx on inquiries(shop_id);

-- ---------- Vendor leads (public registration requests) ----------

create type vendor_lead_status as enum (
  'pending', 'contacted', 'approved', 'rejected'
);

create table if not exists vendor_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  city text,
  state text,
  business_name text,
  business_type text,
  message text,
  status vendor_lead_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists vendor_leads_status_idx on vendor_leads(status);

-- =====================================================================
-- Row Level Security
-- Public read for catalog content; public insert (only) for inquiries.
-- =====================================================================

alter table categories     enable row level security;
alter table materials      enable row level security;
alter table shops          enable row level security;
alter table products       enable row level security;
alter table product_images enable row level security;
alter table reviews        enable row level security;
alter table blogs          enable row level security;
alter table banners        enable row level security;
alter table inquiries      enable row level security;
alter table vendor_leads   enable row level security;

-- Public catalog: anyone may read approved/active rows.
create policy "public read categories"  on categories     for select using (true);
create policy "public read materials"   on materials      for select using (true);
create policy "public read shops"       on shops          for select using (is_approved);
create policy "public read products"    on products       for select using (is_approved);
create policy "public read images"      on product_images for select using (true);
create policy "public read reviews"     on reviews        for select using (is_approved);
create policy "public submit review"    on reviews        for insert with check (true);
create policy "public read blogs"       on blogs          for select using (is_published);
create policy "public read banners"     on banners        for select using (is_active);

-- Inquiries: anyone may submit; nobody may read via the public anon role.
-- (Vendors/admin will read through authenticated policies added later.)
create policy "public submit inquiry" on inquiries for insert with check (true);

-- Vendor leads: anyone may submit a registration request.
create policy "public submit vendor lead" on vendor_leads for insert with check (true);
