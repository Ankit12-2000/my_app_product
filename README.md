# Murti Market Online — Statue Marketplace (Public Website)

Inquiry-based marketplace for Moorti / statue businesses, built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Supabase**. There is no online payment — customers browse products and send **inquiries**; vendors respond with quotations.

This repository currently implements **Phase 1: the public website**. It runs immediately on built-in mock data, and switches to live Supabase data the moment you add your project keys.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no `.env.local` the site uses the bundled mock catalog, and the inquiry form runs in "demo mode" (validates + confirms, but doesn't persist).

## Connecting Supabase (optional)

1. Create a project at https://supabase.com.
2. In the Supabase **SQL editor**, run [`supabase/schema.sql`](supabase/schema.sql), then optionally [`supabase/seed.sql`](supabase/seed.sql).
3. Copy `.env.local.example` to `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # server-only, for later admin/vendor work
   ```

4. Restart `npm run dev`. The data layer automatically uses Supabase instead of mock data — no code changes needed.

## What's implemented

- **Home** — hero/banners, category grid, featured products, featured vendors, how-it-works, vendor CTA.
- **Search** (`/search`) — full-text-ish search + filters (category, material, city, deity, finish, price, sort).
- **Categories** (`/categories`, `/categories/[slug]`).
- **Product detail** (`/products/[slug]`) — image gallery, specifications, seller card, **inquiry form**.
- **Vendor profile** (`/vendors`, `/vendors/[slug]`) — banner, about, products, reviews, contact/WhatsApp, inquiry form.
- **Inquiry flow** — server action with validation; writes to `inquiries` when Supabase is connected.
- **Content pages** — Blog (`/blog`, `/blog/[slug]`), FAQ, About, Contact.
- **Vendor onboarding / login** — landing + stubs (full portal is the next phase).

## Project structure

```
app/
  (public)/          # public website route group (Header + Footer layout)
    page.tsx         # home
    search/          # search + filters
    categories/      # listing + [slug]
    products/[slug]/ # product detail + inquiry
    vendors/         # listing + [slug] profile
    blog/  faq/  about/  contact/  vendor/  login/
  actions/inquiry.ts # "use server" inquiry submission
  layout.tsx         # root layout (fonts, metadata)
components/           # Header, Footer, cards, gallery, search, inquiry form
lib/
  supabase/          # browser + server clients, config/feature flag
  data/              # queries.ts (Supabase|mock switch), mock.ts
  utils.ts
types/               # domain types mirroring the DB
supabase/            # schema.sql + seed.sql
```

## Vendor portal (Phase 2 — implemented)

Authenticated vendor area at **`/vendor`**, protected by middleware + Supabase Auth and isolated per-shop by Row Level Security.

- **Auth** — `/signup`, `/login`, logout. Session refreshed in [middleware.ts](middleware.ts).
- **Onboarding** — `/vendor/onboarding` creates the vendor's shop (pending admin approval).
- **Dashboard** — stat cards + recent inquiries.
- **Inquiries** — list with status-filter tabs, detail page with status updates, internal notes, call/WhatsApp, and "create quotation".
- **Products** — list, add, edit, delete (category/material/specs/images).
- **Quotations** — builder with line items, discount, GST, live totals, status, and print-to-PDF.
- **Shop profile** — editable shop details, logo/banner.

Run [`supabase/vendor_schema.sql`](supabase/vendor_schema.sql) (after `schema.sql`) to add `profiles`, vendor RLS policies, `inquiry_messages`, `quotations`, and `quotation_items`.

### Demo vendor login (this project's live DB)

```
URL:      /login
Email:    vendor@moorti.test
Password: Vendor@12345
```

This account owns the **Jaipur Marble Arts** shop and has sample inquiries to explore.

> Vendor signup uses Supabase email confirmation by default. To let new signups
> log in immediately in development, disable "Confirm email" in
> Supabase → Authentication → Providers → Email.

## Admin panel (Phase 3 — implemented)

Super-admin area at **`/admin`**, protected by middleware + an `admin` role on `profiles`, with marketplace-wide access via an `is_admin()` RLS helper.

- **Dashboard** — pending vendors/products, totals, attention list.
- **Vendors** — approve/unapprove shops, toggle featured.
- **Products** — approve/unapprove, toggle featured (across all vendors).
- **Categories & Materials** — add/delete taxonomy.
- **Blog / CMS** — create, edit, publish/unpublish, delete posts.
- **Banners** — manage homepage banners.

Run [`supabase/admin_schema.sql`](supabase/admin_schema.sql) (after the others) to add `is_admin()` and admin RLS policies. Promote a user to admin by setting `profiles.role = 'admin'`.

### Super-admin login (this project's live DB)

```
URL:      /admin
Email:    badayajai123@gmail.com
Password: Admin@12345
```

## Image upload

Product images and shop logo/banner upload directly to the Supabase Storage
bucket `product-images` (public read, authenticated write). Run
[`supabase/storage.sql`](supabase/storage.sql) to create the bucket + policies.

## Next phases (per the master spec)

- Vendor extras: gallery, staff management, analytics, SEO settings, realtime notifications.
- Admin extras: reports/exports, audit logs, subscription plans, system settings.
