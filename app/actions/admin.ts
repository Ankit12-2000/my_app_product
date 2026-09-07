"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
