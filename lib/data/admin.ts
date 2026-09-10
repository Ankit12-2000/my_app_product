import "server-only";
import { cache } from "react";
import type { Banner, BlogPost, Category, InquiryStatus, Material, Product, Review, Shop } from "@/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PAGE_SIZE, type Page, pageRange, searchTerm, toPage } from "@/lib/data/paging";

// Admin-scoped reads. These run as the authenticated admin; the admin RLS
// policies (is_admin()) grant marketplace-wide visibility.

export interface AdminStats {
  vendorsTotal: number;
  vendorsPending: number;
  productsTotal: number;
  productsPending: number;
  productsFeatured: number;
  inquiriesTotal: number;
  inquiriesNew: number;
  blogs: number;
  vendorLeadsPending: number;
}

// cache() so the layout's sidebar badges and the dashboard body share one
// round of counts instead of running all of them twice.
export const getAdminStats = cache(async (): Promise<AdminStats> => {
  const sb = await createSupabaseServerClient();
  const head = { count: "exact" as const, head: true };
  const [vAll, vPend, pAll, pPend, pFeat, inq, inqNew, blogs, leadsPend] = await Promise.all([
    sb.from("shops").select("id", head),
    sb.from("shops").select("id", head).eq("is_approved", false),
    sb.from("products").select("id", head),
    sb.from("products").select("id", head).eq("is_approved", false),
    sb.from("products").select("id", head).eq("is_featured", true),
    sb.from("inquiries").select("id", head),
    sb.from("inquiries").select("id", head).eq("status", "new"),
    sb.from("blogs").select("id", head),
    sb.from("vendor_leads").select("id", head).eq("status", "pending"),
  ]);
  return {
    vendorsTotal: vAll.count ?? 0,
    vendorsPending: vPend.count ?? 0,
    productsTotal: pAll.count ?? 0,
    productsPending: pPend.count ?? 0,
    productsFeatured: pFeat.count ?? 0,
    inquiriesTotal: inq.count ?? 0,
    inquiriesNew: inqNew.count ?? 0,
    blogs: blogs.count ?? 0,
    vendorLeadsPending: leadsPend.count ?? 0,
  };
});

// ---------- Vendors / shops ----------

export type ShopStatusFilter = "all" | "approved" | "pending" | "featured";

export interface ShopQuery {
  page?: number;
  q?: string;
  status?: ShopStatusFilter;
}

export async function listShopsPage({ page = 1, q, status = "all" }: ShopQuery = {}): Promise<Page<Shop>> {
  const sb = await createSupabaseServerClient();
  const [from, to] = pageRange(page);

  let query = sb.from("shops").select("*", { count: "exact" });
  if (status === "approved") query = query.eq("is_approved", true);
  if (status === "pending") query = query.eq("is_approved", false);
  if (status === "featured") query = query.eq("is_featured", true);

  const term = searchTerm(q);
  if (term) {
    query = query.or(
      `name.ilike.%${term}%,city.ilike.%${term}%,state.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`
    );
  }

  const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);
  return toPage(data as Shop[] | null, count, page);
}

export async function getShopAdmin(
  id: string
): Promise<{ shop: Shop; products: Product[]; reviews: Review[] } | null> {
  const sb = await createSupabaseServerClient();
  const { data: shop } = await sb.from("shops").select("*").eq("id", id).maybeSingle();
  if (!shop) return null;
  const [{ data: products }, { data: reviews }] = await Promise.all([
    sb
      .from("products")
      .select("*, images:product_images(*), category:categories(*), material:materials(*)")
      .eq("shop_id", id)
      .order("created_at", { ascending: false })
      .limit(60),
    sb.from("reviews").select("*").eq("shop_id", id).order("created_at", { ascending: false }).limit(30),
  ]);
  return {
    shop: shop as Shop,
    products: (products as Product[]) ?? [],
    reviews: (reviews as Review[]) ?? [],
  };
}

// ---------- Products ----------

export type ProductStatusFilter = "all" | "live" | "pending" | "featured";
export type ProductSort = "newest" | "oldest" | "name" | "price_desc";

export interface ProductQuery {
  page?: number;
  q?: string;
  status?: ProductStatusFilter;
  sort?: ProductSort;
}

// Only the columns the list actually paints. The old query pulled every image
// row and the full shop/category/material records for every product.
const PRODUCT_LIST_SELECT =
  "id, slug, name, deity, price_min, price_max, is_approved, is_featured, created_at, images:product_images(url, sort_order), shop:shops(name, slug)";

const PRODUCT_SORTS: Record<ProductSort, { column: string; ascending: boolean }> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  name: { column: "name", ascending: true },
  price_desc: { column: "price_max", ascending: false },
};

export async function listProductsPage({
  page = 1,
  q,
  status = "all",
  sort = "newest",
}: ProductQuery = {}): Promise<Page<Product>> {
  const sb = await createSupabaseServerClient();
  const [from, to] = pageRange(page);

  let query = sb.from("products").select(PRODUCT_LIST_SELECT, { count: "exact" });
  if (status === "live") query = query.eq("is_approved", true);
  if (status === "pending") query = query.eq("is_approved", false);
  if (status === "featured") query = query.eq("is_featured", true);

  const term = searchTerm(q);
  if (term) {
    query = query.or(`name.ilike.%${term}%,deity.ilike.%${term}%,city.ilike.%${term}%,slug.ilike.%${term}%`);
  }

  const order = PRODUCT_SORTS[sort] ?? PRODUCT_SORTS.newest;
  const { data, count } = await query
    .order(order.column, { ascending: order.ascending, nullsFirst: false })
    .range(from, to);
  return toPage(data as unknown as Product[] | null, count, page);
}

export async function getProductAdmin(id: string): Promise<Product | null> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("products")
    .select("*, images:product_images(*), shop:shops(*), category:categories(*), material:materials(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as Product) ?? null;
}

// ---------- Taxonomy / content ----------

export const listCategoriesAdmin = cache(async (): Promise<Category[]> => {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("categories").select("*").order("name");
  return (data as Category[]) ?? [];
});

export const listMaterialsAdmin = cache(async (): Promise<Material[]> => {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("materials").select("*").order("name");
  return (data as Material[]) ?? [];
});

export async function listBlogsAdmin(): Promise<BlogPost[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("blogs").select("*").order("published_at", { ascending: false }).limit(100);
  return (data as BlogPost[]) ?? [];
}

export async function getBlogAdmin(id: string): Promise<BlogPost | null> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("blogs").select("*").eq("id", id).maybeSingle();
  return (data as BlogPost) ?? null;
}

export async function listBannersAdmin(): Promise<Banner[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("banners").select("*").order("sort_order");
  return (data as Banner[]) ?? [];
}

// ---------- Inquiries (marketplace-wide) ----------

export interface AdminInquiry {
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
  shop?: { name: string; slug: string } | null;
  product?: { name: string; slug: string } | null;
}

export interface InquiryQuery {
  page?: number;
  q?: string;
  status?: string;
}

export async function listInquiriesPage({
  page = 1,
  q,
  status,
}: InquiryQuery = {}): Promise<Page<AdminInquiry>> {
  const sb = await createSupabaseServerClient();
  const [from, to] = pageRange(page);

  let query = sb
    .from("inquiries")
    .select("*, shop:shops(name, slug), product:products(name, slug)", { count: "exact" });
  if (status && status !== "all") query = query.eq("status", status);

  const term = searchTerm(q);
  if (term) {
    query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%,city.ilike.%${term}%`);
  }

  const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);
  return toPage(data as unknown as AdminInquiry[] | null, count, page);
}

/** Per-status totals for the inquiry filter tabs, in one round trip. */
export async function inquiryStatusCounts(): Promise<Record<string, number>> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("inquiries").select("status").limit(5000);
  const counts: Record<string, number> = {};
  for (const row of (data as { status: string }[]) ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

// ---------- Vendor Leads ----------

export interface VendorLead {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  state: string | null;
  business_name: string | null;
  business_type: string | null;
  message: string | null;
  status: "pending" | "contacted" | "approved" | "rejected";
  created_at: string;
  /** Set once the lead is approved and the vendor's login has been created. */
  vendor_id: string | null;
  login_email: string | null;
  /** Cleared as soon as the vendor signs in for the first time. */
  temp_password: string | null;
  account_created_at: string | null;
}

export interface VendorLeadQuery {
  page?: number;
  q?: string;
  status?: string;
}

export async function listVendorLeadsPage({
  page = 1,
  q,
  status,
}: VendorLeadQuery = {}): Promise<Page<VendorLead>> {
  const sb = await createSupabaseServerClient();
  const [from, to] = pageRange(page);

  let query = sb.from("vendor_leads").select("*", { count: "exact" });
  if (status && status !== "all") query = query.eq("status", status);

  const term = searchTerm(q);
  if (term) {
    query = query.or(
      `full_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%,business_name.ilike.%${term}%,city.ilike.%${term}%`
    );
  }

  const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);
  return toPage(data as VendorLead[] | null, count, page);
}

/** Per-status totals for the lead filter tabs. */
export async function vendorLeadStatusCounts(): Promise<Record<string, number>> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("vendor_leads").select("status").limit(5000);
  const counts: Record<string, number> = {};
  for (const row of (data as { status: string }[]) ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export { PAGE_SIZE };
