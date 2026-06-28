import "server-only";
import type { Banner, BlogPost, Category, Material, Product, Review, Shop } from "@/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin-scoped reads. These run as the authenticated admin; the admin RLS
// policies (is_admin()) grant marketplace-wide visibility.

export interface AdminStats {
  vendorsTotal: number;
  vendorsPending: number;
  productsTotal: number;
  productsPending: number;
  inquiriesTotal: number;
  blogs: number;
  vendorLeadsPending: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const sb = await createSupabaseServerClient();
  const head = { count: "exact" as const, head: true };
  const [vAll, vPend, pAll, pPend, inq, blogs, leadsPend] = await Promise.all([
    sb.from("shops").select("id", head),
    sb.from("shops").select("id", head).eq("is_approved", false),
    sb.from("products").select("id", head),
    sb.from("products").select("id", head).eq("is_approved", false),
    sb.from("inquiries").select("id", head),
    sb.from("blogs").select("id", head),
    sb.from("vendor_leads").select("id", head).eq("status", "pending"),
  ]);
  return {
    vendorsTotal: vAll.count ?? 0,
    vendorsPending: vPend.count ?? 0,
    productsTotal: pAll.count ?? 0,
    productsPending: pPend.count ?? 0,
    inquiriesTotal: inq.count ?? 0,
    blogs: blogs.count ?? 0,
    vendorLeadsPending: leadsPend.count ?? 0,
  };
}

export async function listAllShops(): Promise<Shop[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("shops").select("*").order("created_at", { ascending: false });
  return (data as Shop[]) ?? [];
}

export async function getShopAdmin(id: string): Promise<{ shop: Shop; products: Product[]; reviews: Review[] } | null> {
  const sb = await createSupabaseServerClient();
  const { data: shop } = await sb.from("shops").select("*").eq("id", id).maybeSingle();
  if (!shop) return null;
  const [{ data: products }, { data: reviews }] = await Promise.all([
    sb.from("products").select("*, images:product_images(*), category:categories(*), material:materials(*)").eq("shop_id", id).order("created_at", { ascending: false }),
    sb.from("reviews").select("*").eq("shop_id", id).order("created_at", { ascending: false }),
  ]);
  return {
    shop: shop as Shop,
    products: (products as Product[]) ?? [],
    reviews: (reviews as Review[]) ?? [],
  };
}

export async function listAllProducts(): Promise<Product[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("products")
    .select("*, images:product_images(*), shop:shops(*), category:categories(*), material:materials(*)")
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
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

export async function listCategoriesAdmin(): Promise<Category[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("categories").select("*").order("name");
  return (data as Category[]) ?? [];
}

export async function listMaterialsAdmin(): Promise<Material[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("materials").select("*").order("name");
  return (data as Material[]) ?? [];
}

export async function listBlogsAdmin(): Promise<BlogPost[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("blogs").select("*").order("published_at", { ascending: false });
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
}

export async function listVendorLeads(): Promise<VendorLead[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("vendor_leads").select("*").order("created_at", { ascending: false });
  return (data as VendorLead[]) ?? [];
}
