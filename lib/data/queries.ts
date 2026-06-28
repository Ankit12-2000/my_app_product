import "server-only";
import type {
  Banner,
  BlogPost,
  Category,
  Material,
  Product,
  ProductSearchFilters,
  Review,
  Shop,
} from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import * as mock from "./mock";

// Data-access layer for the public website.
//
// Every function returns mock data until Supabase is configured (env vars set),
// then transparently switches to live queries. Components never need to know
// which source is active.

function applyFilters(list: Product[], f: ProductSearchFilters): Product[] {
  let out = list.filter((p) => p.is_approved);

  if (f.q) {
    const q = f.q.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.deity ?? "").toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
    );
  }
  if (f.category) out = out.filter((p) => p.category?.slug === f.category || categorySlug(p.category_id) === f.category);
  if (f.material) out = out.filter((p) => materialSlug(p.material_id) === f.material);
  if (f.city) out = out.filter((p) => (p.city ?? "").toLowerCase() === f.city!.toLowerCase());
  if (f.deity) out = out.filter((p) => (p.deity ?? "").toLowerCase().includes(f.deity!.toLowerCase()));
  if (f.finish) out = out.filter((p) => (p.finish ?? "").toLowerCase().includes(f.finish!.toLowerCase()));
  if (f.priceMin != null) out = out.filter((p) => (p.price_max ?? p.price_min ?? 0) >= f.priceMin!);
  if (f.priceMax != null) out = out.filter((p) => (p.price_min ?? p.price_max ?? 0) <= f.priceMax!);
  if (f.sizeMin != null) out = out.filter((p) => (p.height_cm ?? 0) >= f.sizeMin!);
  if (f.sizeMax != null) out = out.filter((p) => (p.height_cm ?? Infinity) <= f.sizeMax!);

  if (f.sort === "price_asc") out = [...out].sort((a, b) => (a.price_min ?? 0) - (b.price_min ?? 0));
  else if (f.sort === "price_desc") out = [...out].sort((a, b) => (b.price_min ?? 0) - (a.price_min ?? 0));

  return out;
}

function categorySlug(id: string | null) {
  return mock.categories.find((c) => c.id === id)?.slug;
}
function materialSlug(id: string | null) {
  return mock.materials.find((m) => m.id === id)?.slug;
}

function hydrate(p: Product): Product {
  return {
    ...p,
    shop: mock.shops.find((s) => s.id === p.shop_id),
    category: mock.categories.find((c) => c.id === p.category_id),
    material: mock.materials.find((m) => m.id === p.material_id),
  };
}

// ---- Public reads ----

export async function getBanners(): Promise<Banner[]> {
  if (!isSupabaseConfigured) return mock.banners;
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("banners").select("*").order("sort_order");
  return (data as Banner[]) ?? [];
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return mock.categories;
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("categories").select("*").order("name");
  return (data as Category[]) ?? [];
}

export async function getMaterials(): Promise<Material[]> {
  if (!isSupabaseConfigured) return mock.materials;
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("materials").select("*").order("name");
  return (data as Material[]) ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured) return mock.categories.find((c) => c.slug === slug) ?? null;
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("categories").select("*").eq("slug", slug).maybeSingle();
  return (data as Category) ?? null;
}

export async function getShops(): Promise<Shop[]> {
  if (!isSupabaseConfigured) return mock.shops.filter((s) => s.is_approved);
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("shops").select("*").eq("is_approved", true).order("name");
  return (data as Shop[]) ?? [];
}

export async function getFeaturedShops(): Promise<Shop[]> {
  if (!isSupabaseConfigured) return mock.shops.filter((s) => s.is_featured && s.is_approved);
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("shops").select("*").eq("is_featured", true).eq("is_approved", true);
  return (data as Shop[]) ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured)
    return mock.products.filter((p) => p.is_featured && p.is_approved).map(hydrate);
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("products")
    .select("*, images:product_images(*), shop:shops(*), category:categories(*), material:materials(*)")
    .eq("is_featured", true)
    .eq("is_approved", true)
    .limit(8);
  return (data as Product[]) ?? [];
}

export async function searchProducts(filters: ProductSearchFilters): Promise<Product[]> {
  if (!isSupabaseConfigured) return applyFilters(mock.products.map(hydrate), filters);

  const sb = await createSupabaseServerClient();
  let query = sb
    .from("products")
    .select("*, images:product_images(*), shop:shops(*), category:categories(*), material:materials(*)")
    .eq("is_approved", true);

  if (filters.city) query = query.ilike("city", filters.city);
  if (filters.deity) query = query.ilike("deity", `%${filters.deity}%`);
  if (filters.finish) query = query.ilike("finish", `%${filters.finish}%`);
  if (filters.priceMax != null) query = query.lte("price_min", filters.priceMax);
  if (filters.priceMin != null) query = query.gte("price_max", filters.priceMin);
  if (filters.q) query = query.ilike("name", `%${filters.q}%`);

  const { data } = await query;
  return (data as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) {
    const p = mock.products.find((x) => x.slug === slug);
    return p ? hydrate(p) : null;
  }
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("products")
    .select("*, images:product_images(*), shop:shops(*), category:categories(*), material:materials(*)")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Product) ?? null;
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  if (!isSupabaseConfigured) return mock.shops.find((s) => s.slug === slug) ?? null;
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("shops").select("*").eq("slug", slug).maybeSingle();
  return (data as Shop) ?? null;
}

export async function getProductsByShop(shopId: string): Promise<Product[]> {
  if (!isSupabaseConfigured)
    return mock.products.filter((p) => p.shop_id === shopId && p.is_approved).map(hydrate);
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("products")
    .select("*, images:product_images(*), category:categories(*), material:materials(*)")
    .eq("shop_id", shopId)
    .eq("is_approved", true);
  return (data as Product[]) ?? [];
}

export async function getReviewsByShop(shopId: string): Promise<Review[]> {
  if (!isSupabaseConfigured) return mock.reviews.filter((r) => r.shop_id === shopId);
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("reviews").select("*").eq("shop_id", shopId).order("created_at", { ascending: false });
  return (data as Review[]) ?? [];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return mock.blogPosts;
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("blogs").select("*").order("published_at", { ascending: false });
  return (data as BlogPost[]) ?? [];
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) return mock.blogPosts.find((b) => b.slug === slug) ?? null;
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("blogs").select("*").eq("slug", slug).maybeSingle();
  return (data as BlogPost) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 6): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return mock.products
      .filter((p) => p.is_approved && p.id !== product.id && (p.category_id === product.category_id || p.deity === product.deity))
      .map(hydrate)
      .slice(0, limit);
  }
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("products")
    .select("*, images:product_images(*), shop:shops(*), category:categories(*), material:materials(*)")
    .eq("is_approved", true)
    .neq("id", product.id)
    .or(`category_id.eq.${product.category_id},deity.eq.${product.deity}`)
    .limit(limit);
  return (data as Product[]) ?? [];
}
