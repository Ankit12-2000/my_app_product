// Domain types for the Murti Market Online public website.
// These mirror the Supabase tables defined in supabase/schema.sql.

export type InquiryStatus =
  | "new"
  | "contacted"
  | "quotation_sent"
  | "negotiation"
  | "confirmed"
  | "closed"
  | "rejected";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

export interface Material {
  id: string;
  name: string;
  slug: string;
}

export interface Shop {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  is_featured: boolean;
  is_approved: boolean;
  rating: number;
  review_count: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  shop_id: string;
  category_id: string | null;
  material_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  deity: string | null;
  finish: string | null;
  size: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  price_min: number | null;
  price_max: number | null;
  city: string | null;
  video_url: string | null;
  is_featured: boolean;
  is_approved: boolean;
  in_stock: boolean;
  images: ProductImage[];
  // Joined data (optional, populated by queries)
  shop?: Shop;
  category?: Category;
  material?: Material;
}

export interface Review {
  id: string;
  shop_id: string;
  product_id: string | null;
  author_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_url: string | null;
  author: string | null;
  published_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
}

export interface InquiryInput {
  product_id: string | null;
  shop_id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  quantity: number;
  requirement: string;
}

export interface ProductSearchFilters {
  q?: string;
  category?: string;
  material?: string;
  city?: string;
  deity?: string;
  finish?: string;
  priceMin?: number;
  priceMax?: number;
  sizeMin?: number;
  sizeMax?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}
