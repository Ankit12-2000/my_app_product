"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/config";
import { generateTempPassword, resolveLoginEmail } from "@/lib/vendor-credentials";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export interface ShopState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

// ---------- Vendors ----------

export async function createVendor(_prev: ShopState, formData: FormData): Promise<ShopState> {
  await requireAdmin();
  const sb = createSupabaseAdminClient();

  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (full_name.length < 2) return { ok: false, message: "Name is required." };
  if (!email) return { ok: false, message: "Email is required." };
  if (password.length < 6) return { ok: false, message: "Password must be at least 6 characters." };

  const { error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone },
  });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/vendors");
  return { ok: true, message: "Vendor account created! They can now login." };
}

export async function setShopApproval(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  const approve = formData.get("approve") === "true";
  await sb.from("shops").update({ is_approved: approve }).eq("id", id);
  revalidatePath("/admin/vendors");
}

export async function setShopFeatured(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  const featured = formData.get("featured") === "true";
  await sb.from("shops").update({ is_featured: featured }).eq("id", id);
  revalidatePath("/admin/vendors");
}

// ---------- Products ----------

export async function setProductApproval(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  const approve = formData.get("approve") === "true";
  await sb.from("products").update({ is_approved: approve }).eq("id", id);
  revalidatePath("/admin/products");
}

export async function setProductFeatured(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  const featured = formData.get("featured") === "true";
  await sb.from("products").update({ is_featured: featured }).eq("id", id);
  revalidatePath("/admin/products");
}

// ---------- Categories ----------

export interface CategoryState {
  ok?: boolean;
  message?: string;
}

export async function createCategory(_prev: CategoryState, formData: FormData): Promise<CategoryState> {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, message: "Category name is required." };
  const { error } = await sb.from("categories").insert({
    name,
    slug: slugify(name),
    description: String(formData.get("description") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
  });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/taxonomy");
  return { ok: true, message: "Category added." };
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  await sb.from("categories").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin/taxonomy");
}

// ---------- Materials ----------

export async function createMaterial(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await sb.from("materials").insert({ name, slug: slugify(name) });
  revalidatePath("/admin/taxonomy");
}

export async function deleteMaterial(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  await sb.from("materials").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin/taxonomy");
}

// ---------- Blogs ----------

export async function createBlog(_prev: { error?: string }, formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 3) return { error: "Title is required." };
  const body = String(formData.get("body") ?? "").trim();

  let slug = slugify(title);
  const { data: existing } = await sb.from("blogs").select("id").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  const { error } = await sb.from("blogs").insert({
    title,
    slug,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    body,
    cover_url: String(formData.get("cover_url") ?? "").trim() || null,
    author: String(formData.get("author") ?? "").trim() || "Admin",
    is_published: formData.get("is_published") === "on",
  });
  if (error) return { error: error.message };
  redirect("/admin/blogs");
}

export async function updateBlog(_prev: { error?: string }, formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 3) return { error: "Title is required." };

  const { error } = await sb.from("blogs").update({
    title,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    body: String(formData.get("body") ?? "").trim(),
    cover_url: String(formData.get("cover_url") ?? "").trim() || null,
    author: String(formData.get("author") ?? "").trim() || "Admin",
    is_published: formData.get("is_published") === "on",
  }).eq("id", id);
  if (error) return { error: error.message };
  redirect("/admin/blogs");
}

export async function deleteBlog(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  await sb.from("blogs").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin/blogs");
}

// ---------- Banners ----------

export async function createBanner(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const title = String(formData.get("title") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  if (!title || !image_url) return;
  await sb.from("banners").insert({
    title,
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    image_url,
    link_url: String(formData.get("link_url") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  });
  revalidatePath("/admin/banners");
}

export async function deleteBanner(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  await sb.from("banners").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin/banners");
}

// ---------- Vendor Leads ----------

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

function requireServiceRole(): AdminClient {
  if (!isServiceRoleConfigured) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set in .env.local, so vendor logins cannot be created. " +
        "Copy the service_role key from Supabase → Settings → API and restart the dev server."
    );
  }
  return createSupabaseAdminClient();
}

/**
 * The admin auth API has no lookup-by-email, so we page through users. Only
 * reached when createUser reports a duplicate, which is rare — a vendor who
 * submitted the lead form twice, or one who already signed up themselves.
 */
async function findUserIdByEmail(sb: AdminClient, email: string): Promise<string | null> {
  const target = email.toLowerCase();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data.users.length) return null;
    const hit = data.users.find((u) => u.email?.toLowerCase() === target);
    if (hit) return hit.id;
    if (data.users.length < 1000) return null;
  }
  return null;
}

/**
 * Approve a lead and provision the vendor's login in one step.
 *
 * The generated password is stored on the lead so the admin can pass it to the
 * vendor (over WhatsApp, usually) after the fact; it is cleared the moment the
 * vendor first signs in — see clearVendorTempPassword in app/actions/auth.ts.
 * Only admins can read vendor_leads, so it is never exposed to the vendor or
 * the public.
 */
export async function approveVendorLead(formData: FormData) {
  await requireAdmin();
  const sb = requireServiceRole();
  const id = String(formData.get("id") ?? "");

  const { data: lead, error: leadErr } = await sb
    .from("vendor_leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (leadErr) throw new Error(`Could not load the lead: ${leadErr.message}`);
  if (!lead) throw new Error("That lead no longer exists.");

  // Already provisioned — just make sure the status reflects it.
  if (lead.vendor_id) {
    await sb.from("vendor_leads").update({ status: "approved" }).eq("id", id);
    revalidatePath("/admin/vendor-leads");
    return;
  }

  const { email } = resolveLoginEmail(lead);
  const password = generateTempPassword();
  const fullName = String(lead.full_name ?? "").trim();
  const phone = String(lead.phone ?? "").trim();

  const { data: created, error: createErr } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone },
  });

  let vendorId = created?.user?.id ?? null;

  if (createErr) {
    // A duplicate is expected when the same vendor submitted the form twice.
    // Reuse their account and reset the password rather than failing the approval.
    const existingId = await findUserIdByEmail(sb, email);
    if (!existingId) throw new Error(`Could not create the vendor login: ${createErr.message}`);
    const { error: pwErr } = await sb.auth.admin.updateUserById(existingId, { password });
    if (pwErr) throw new Error(`Could not reset the existing account password: ${pwErr.message}`);
    vendorId = existingId;
  }

  if (!vendorId) throw new Error("Supabase returned no user id for the new vendor login.");

  // The on_auth_user_created trigger inserts the profile; make sure the role is
  // right even when we linked an account that already existed.
  await sb.from("profiles").upsert(
    { id: vendorId, full_name: fullName, phone, role: "vendor" },
    { onConflict: "id" }
  );

  const { error: updErr } = await sb
    .from("vendor_leads")
    .update({
      status: "approved",
      vendor_id: vendorId,
      login_email: email,
      temp_password: password,
      account_created_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (updErr) throw new Error(`Account created, but saving the credentials failed: ${updErr.message}`);

  revalidatePath("/admin/vendor-leads");
  revalidatePath("/admin/vendors");
}

/** Issue a fresh password — used when the vendor lost or never received it. */
export async function resetVendorLeadPassword(formData: FormData) {
  await requireAdmin();
  const sb = requireServiceRole();
  const id = String(formData.get("id") ?? "");

  const { data: lead } = await sb
    .from("vendor_leads")
    .select("id, vendor_id")
    .eq("id", id)
    .maybeSingle();
  if (!lead?.vendor_id) throw new Error("This lead has no vendor account yet — approve it first.");

  const password = generateTempPassword();
  const { error } = await sb.auth.admin.updateUserById(lead.vendor_id, { password });
  if (error) throw new Error(`Password reset failed: ${error.message}`);

  await sb.from("vendor_leads").update({ temp_password: password }).eq("id", id);
  revalidatePath("/admin/vendor-leads");
}

export async function setVendorLeadStatus(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "pending");
  const { error } = await sb.from("vendor_leads").update({ status }).eq("id", id);
  // Without this the write fails silently under RLS and the row just never moves.
  if (error) throw new Error(`vendor_leads status update failed: ${error.message}`);
  revalidatePath("/admin/vendor-leads");
}

export async function deleteVendorLead(formData: FormData) {
  await requireAdmin();
  const sb = await createSupabaseServerClient();
  const { error } = await sb
    .from("vendor_leads")
    .delete()
    .eq("id", String(formData.get("id") ?? ""));
  if (error) throw new Error(`vendor_leads delete failed: ${error.message}`);
  revalidatePath("/admin/vendor-leads");
}
