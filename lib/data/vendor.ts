import "server-only";
import type { InquiryStatus, Product } from "@/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export async function getVendorStats(shopId: string): Promise<VendorStats> {
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
}

export async function listInquiries(
  shopId: string,
  status?: InquiryStatus
): Promise<VendorInquiry[]> {
  const sb = await createSupabaseServerClient();
  let q = sb
    .from("inquiries")
    .select("*, product:products(name, slug)")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data } = await q;
  return (data as VendorInquiry[]) ?? [];
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

export async function listVendorProducts(shopId: string): Promise<Product[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("products")
    .select("*, images:product_images(*), category:categories(*), material:materials(*)")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
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

export async function listQuotations(shopId: string): Promise<QuotationRow[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("quotations")
    .select("*, items:quotation_items(*)")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });
  return (data as QuotationRow[]) ?? [];
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
