"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireVendor, requireVendorShop } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InquiryStatus } from "@/types";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// ---------- Onboarding: create the vendor's shop ----------

export async function createShop(_prev: { error?: string }, formData: FormData) {
  const { userId } = await requireVendor();
  const sb = await createSupabaseServerClient();

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return { error: "Shop name is required." };

  let slug = slugify(name);
  // Ensure unique slug.
  const { data: existing } = await sb.from("shops").select("id").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  const { error } = await sb.from("shops").insert({
    vendor_id: userId,
    name,
    slug,
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    logo_url: String(formData.get("logo_url") ?? "").trim() || null,
    banner_url: String(formData.get("banner_url") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    state: String(formData.get("state") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    is_approved: false,
  });
  if (error) return { error: error.message };

  redirect("/vendor");
}

// ---------- Shop profile update ----------

export async function updateShop(_prev: { error?: string; ok?: boolean }, formData: FormData) {
  const { shop } = await requireVendorShop();
  const sb = await createSupabaseServerClient();

  const { error } = await sb
    .from("shops")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      city: String(formData.get("city") ?? "").trim() || null,
      state: String(formData.get("state") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      logo_url: String(formData.get("logo_url") ?? "").trim() || null,
      banner_url: String(formData.get("banner_url") ?? "").trim() || null,
    })
    .eq("id", shop.id);
  if (error) return { error: error.message };

  revalidatePath("/vendor/profile");
  return { ok: true };
}

// ---------- Inquiry status + notes ----------

const STATUSES: InquiryStatus[] = [
  "new", "contacted", "quotation_sent", "negotiation", "confirmed", "closed", "rejected",
];

export async function updateInquiryStatus(formData: FormData) {
  const { shop } = await requireVendorShop();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as InquiryStatus;
  if (!STATUSES.includes(status)) return;

  await sb.from("inquiries").update({ status }).eq("id", id).eq("shop_id", shop.id);
  revalidatePath(`/vendor/inquiries/${id}`);
  revalidatePath("/vendor/inquiries");
}

export async function addInquiryNote(formData: FormData) {
  await requireVendorShop();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await sb.from("inquiry_messages").insert({
    inquiry_id: id,
    sender: "vendor",
    body,
    is_internal: true,
  });
  revalidatePath(`/vendor/inquiries/${id}`);
}

// ---------- Products ----------

function productFields(formData: FormData) {
  const numOrNull = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // Height is entered in cm or feet; we always store cm.
  const heightRaw = numOrNull("height");
  const heightUnit = String(formData.get("height_unit") ?? "cm");
  const height_cm =
    heightRaw == null ? null : heightUnit === "feet" ? Math.round(heightRaw * 30.48 * 10) / 10 : heightRaw;

  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    category_id: String(formData.get("category_id") ?? "") || null,
    material_id: String(formData.get("material_id") ?? "") || null,
    deity: String(formData.get("deity") ?? "").trim() || null,
    finish: String(formData.get("finish") ?? "").trim() || null,
    size: String(formData.get("size") ?? "").trim() || null,
    height_cm,
    price_min: numOrNull("price_min"),
    price_max: numOrNull("price_max"),
    city: String(formData.get("city") ?? "").trim() || null,
    in_stock: formData.get("in_stock") === "on",
  };
}

export async function createProduct(_prev: { error?: string }, formData: FormData) {
  const { shop } = await requireVendorShop();
  const sb = await createSupabaseServerClient();
  const fields = productFields(formData);
  if (fields.name.length < 2) return { error: "Product name is required." };

  let slug = slugify(fields.name);
  const { data: existing } = await sb.from("products").select("id").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  const { data, error } = await sb
    .from("products")
    .insert({ ...fields, slug, shop_id: shop.id, city: fields.city ?? shop.city, is_approved: false })
    .select("id")
    .single();
  if (error) return { error: error.message };

  // Optional images (comma/newline separated URLs).
  await saveImages(data.id, formData);

  redirect("/vendor/products");
}

export async function updateProduct(_prev: { error?: string }, formData: FormData) {
  const { shop } = await requireVendorShop();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  const fields = productFields(formData);
  if (fields.name.length < 2) return { error: "Product name is required." };

  const { error } = await sb.from("products").update(fields).eq("id", id).eq("shop_id", shop.id);
  if (error) return { error: error.message };

  await sb.from("product_images").delete().eq("product_id", id);
  await saveImages(id, formData);

  redirect("/vendor/products");
}

async function saveImages(productId: string, formData: FormData) {
  const raw = String(formData.get("images") ?? "");
  const urls = raw
    .split(/[\n,]/)
    .map((u) => u.trim())
    .filter(Boolean);
  if (urls.length === 0) return;
  const sb = await createSupabaseServerClient();
  await sb.from("product_images").insert(
    urls.map((url, i) => ({ product_id: productId, url, sort_order: i }))
  );
}

export async function deleteProduct(formData: FormData) {
  const { shop } = await requireVendorShop();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  await sb.from("products").delete().eq("id", id).eq("shop_id", shop.id);
  revalidatePath("/vendor/products");
}

// ---------- Quotations ----------

export async function createQuotationFromInquiry(formData: FormData) {
  const { shop } = await requireVendorShop();
  const sb = await createSupabaseServerClient();
  const inquiryId = String(formData.get("inquiry_id") ?? "") || null;

  let customer = { name: "", phone: "", email: "", city: "" };
  if (inquiryId) {
    const { data: inq } = await sb
      .from("inquiries")
      .select("name, phone, email, city")
      .eq("id", inquiryId)
      .eq("shop_id", shop.id)
      .maybeSingle();
    if (inq) customer = { name: inq.name, phone: inq.phone, email: inq.email ?? "", city: inq.city ?? "" };
  }

  const number = `Q-${Date.now().toString().slice(-6)}`;
  const { data, error } = await sb
    .from("quotations")
    .insert({
      shop_id: shop.id,
      inquiry_id: inquiryId,
      number,
      customer_name: customer.name || null,
      customer_phone: customer.phone || null,
      customer_email: customer.email || null,
      customer_city: customer.city || null,
      gst_percent: 18,
      status: "draft",
    })
    .select("id")
    .single();
  if (error) return;

  redirect(`/vendor/quotations/${data.id}`);
}

export async function saveQuotation(formData: FormData) {
  const { shop } = await requireVendorShop();
  const sb = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");

  await sb
    .from("quotations")
    .update({
      customer_name: String(formData.get("customer_name") ?? "").trim() || null,
      customer_phone: String(formData.get("customer_phone") ?? "").trim() || null,
      customer_email: String(formData.get("customer_email") ?? "").trim() || null,
      customer_city: String(formData.get("customer_city") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      terms: String(formData.get("terms") ?? "").trim() || null,
      gst_percent: Number(formData.get("gst_percent") ?? 0) || 0,
      discount: Number(formData.get("discount") ?? 0) || 0,
      status: String(formData.get("status") ?? "draft"),
    })
    .eq("id", id)
    .eq("shop_id", shop.id);

  // Replace items.
  await sb.from("quotation_items").delete().eq("quotation_id", id);
  const descriptions = formData.getAll("item_description").map(String);
  const qtys = formData.getAll("item_quantity").map(String);
  const prices = formData.getAll("item_price").map(String);
  const rows = descriptions
    .map((description, i) => ({
      quotation_id: id,
      description: description.trim(),
      quantity: Number(qtys[i] ?? 1) || 1,
      unit_price: Number(prices[i] ?? 0) || 0,
      sort_order: i,
    }))
    .filter((r) => r.description.length > 0);
  if (rows.length) await sb.from("quotation_items").insert(rows);

  revalidatePath(`/vendor/quotations/${id}`);
}
