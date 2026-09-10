import "server-only";
import { cache } from "react";
import type { InquiryStatus, Product } from "@/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type Page, pageRange, searchTerm, toPage } from "@/lib/data/paging";

// Vendor-scoped reads. All run as the authenticated vendor, so RLS guarantees
// they only ever see their own shop's data.

export interface VendorInquiry {
  id: string;
  shop_id: string;
  product_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  quantity: number;
  requirement: string;
  status: InquiryStatus;
  created_at: string;
  product?: { name: string; slug: string } | null;
}

export interface VendorStats {
  products: number;
  inquiriesTotal: number;
  inquiriesNew: number;
  inquiriesOpen: number;
  quotations: number;
}

// cache()d so the layout badges and the dashboard body share one round of counts.
export const getVendorStats = cache(async (shopId: string): Promise<VendorStats> => {
  const sb = await createSupabaseServerClient();
  const [products, inqAll, inqNew, inqOpen, quotes] = await Promise.all([
    sb.from("products").select("id", { count: "exact", head: true }).eq("shop_id", shopId),
    sb.from("inquiries").select("id", { count: "exact", head: true }).eq("shop_id", shopId),
    sb.from("inquiries").select("id", { count: "exact", head: true }).eq("shop_id", shopId).eq("status", "new"),
    sb.from("inquiries").select("id", { count: "exact", head: true }).eq("shop_id", shopId)
      .not("status", "in", "(closed,rejected,confirmed)"),
    sb.from("quotations").select("id", { count: "exact", head: true }).eq("shop_id", shopId),
  ]);
  return {
    products: products.count ?? 0,
    inquiriesTotal: inqAll.count ?? 0,
    inquiriesNew: inqNew.count ?? 0,
    inquiriesOpen: inqOpen.count ?? 0,
    quotations: quotes.count ?? 0,
  };
});

/** The handful of newest inquiries the dashboard shows. */
export async function listRecentInquiries(shopId: string, limit = 6): Promise<VendorInquiry[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("inquiries")
    .select("*, product:products(name, slug)")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as VendorInquiry[]) ?? [];
}

export interface VendorInquiryQuery {
  shopId: string;
  page?: number;
  q?: string;
  status?: InquiryStatus;
}

export async function listInquiriesPage({
  shopId,
  page = 1,
  q,
  status,
}: VendorInquiryQuery): Promise<Page<VendorInquiry>> {
  const sb = await createSupabaseServerClient();
  const [from, to] = pageRange(page);

  let query = sb
    .from("inquiries")
    .select("*, product:products(name, slug)", { count: "exact" })
    .eq("shop_id", shopId);
  if (status) query = query.eq("status", status);

  const term = searchTerm(q);
  if (term) {
    query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%,city.ilike.%${term}%`);
  }

  const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);
  return toPage(data as VendorInquiry[] | null, count, page);
}

/** Per-status totals for the inquiry filter tabs. */
export async function vendorInquiryStatusCounts(shopId: string): Promise<Record<string, number>> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("inquiries").select("status").eq("shop_id", shopId).limit(5000);
  const counts: Record<string, number> = {};
  for (const row of (data as { status: string }[]) ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export interface InquiryMessage {
  id: string;
  inquiry_id: string;
  sender: string;
  body: string;
  is_internal: boolean;
  created_at: string;
}

export async function getInquiry(
  shopId: string,
  id: string
): Promise<{ inquiry: VendorInquiry; messages: InquiryMessage[] } | null> {
  const sb = await createSupabaseServerClient();
  const { data: inquiry } = await sb
    .from("inquiries")
    .select("*, product:products(name, slug)")
    .eq("shop_id", shopId)
    .eq("id", id)
    .maybeSingle();
  if (!inquiry) return null;

  const { data: messages } = await sb
    .from("inquiry_messages")
    .select("*")
    .eq("inquiry_id", id)
    .order("created_at", { ascending: true });

  return { inquiry: inquiry as VendorInquiry, messages: (messages as InquiryMessage[]) ?? [] };
}

export type VendorProductStatus = "all" | "live" | "pending";

export interface VendorProductQuery {
  shopId: string;
  page?: number;
  q?: string;
  status?: VendorProductStatus;
}

// Only the columns the product grid paints — the old query pulled every image
// row plus the full category and material records for each card.
const VENDOR_PRODUCT_SELECT =
  "id, slug, name, deity, price_min, price_max, is_approved, is_featured, in_stock, created_at, images:product_images(url, sort_order)";

export async function listVendorProductsPage({
  shopId,
  page = 1,
  q,
  status = "all",
}: VendorProductQuery): Promise<Page<Product>> {
  const sb = await createSupabaseServerClient();
  const [from, to] = pageRange(page);

  let query = sb
    .from("products")
    .select(VENDOR_PRODUCT_SELECT, { count: "exact" })
    .eq("shop_id", shopId);
  if (status === "live") query = query.eq("is_approved", true);
  if (status === "pending") query = query.eq("is_approved", false);

  const term = searchTerm(q);
  if (term) {
    query = query.or(`name.ilike.%${term}%,deity.ilike.%${term}%,slug.ilike.%${term}%`);
  }

  const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);
  return toPage(data as unknown as Product[] | null, count, page);
}

export async function getVendorProduct(shopId: string, id: string): Promise<Product | null> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("products")
    .select("*, images:product_images(*)")
    .eq("shop_id", shopId)
    .eq("id", id)
    .maybeSingle();
  return (data as Product) ?? null;
}

export interface QuotationRow {
  id: string;
  shop_id: string;
  inquiry_id: string | null;
  number: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  customer_city: string | null;
  notes: string | null;
  terms: string | null;
  status: string;
  gst_percent: number;
  discount: number;
  created_at: string;
  items?: QuotationItem[];
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  product_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
}

export interface QuotationQuery {
  shopId: string;
  page?: number;
  q?: string;
  status?: string;
}

export async function listQuotationsPage({
  shopId,
  page = 1,
  q,
  status,
}: QuotationQuery): Promise<Page<QuotationRow>> {
  const sb = await createSupabaseServerClient();
  const [from, to] = pageRange(page);

  let query = sb
    .from("quotations")
    .select("*, items:quotation_items(*)", { count: "exact" })
    .eq("shop_id", shopId);
  if (status && status !== "all") query = query.eq("status", status);

  const term = searchTerm(q);
  if (term) {
    query = query.or(
      `number.ilike.%${term}%,customer_name.ilike.%${term}%,customer_phone.ilike.%${term}%,customer_city.ilike.%${term}%`
    );
  }

  const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);
  return toPage(data as QuotationRow[] | null, count, page);
}

/** Per-status totals for the quotation filter tabs. */
export async function quotationStatusCounts(shopId: string): Promise<Record<string, number>> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("quotations").select("status").eq("shop_id", shopId).limit(5000);
  const counts: Record<string, number> = {};
  for (const row of (data as { status: string }[]) ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export async function getQuotation(shopId: string, id: string): Promise<QuotationRow | null> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("quotations")
    .select("*, items:quotation_items(*)")
    .eq("shop_id", shopId)
    .eq("id", id)
    .maybeSingle();
  return (data as QuotationRow) ?? null;
}
