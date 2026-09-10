-- =====================================================================
-- Moorti Marketplace - Vendor lead → account provisioning (Phase 4)
-- Approving a vendor lead now creates the vendor's login account and
-- records the credentials on the lead so the admin can pass them on.
-- Run AFTER schema.sql + vendor_schema.sql + admin_schema.sql. Idempotent.
-- =====================================================================

alter table vendor_leads
  add column if not exists vendor_id uuid references auth.users(id) on delete set null,
  add column if not exists login_email text,
  add column if not exists temp_password text,
  add column if not exists account_created_at timestamptz;

comment on column vendor_leads.temp_password is
  'One-time password shown to the admin until the vendor first logs in, then nulled. Never expose outside admin-only reads.';

create index if not exists vendor_leads_vendor_id_idx on vendor_leads(vendor_id);

-- Only an admin may read or write leads. The public "submit vendor lead"
-- policy in schema.sql stays insert-only, so temp_password is never
-- readable by anonymous visitors or by vendors themselves.
drop policy if exists "admin all vendor leads" on vendor_leads;
create policy "admin all vendor leads" on vendor_leads
  for all using (is_admin()) with check (is_admin());
