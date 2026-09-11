import type {
  Banner,
  BlogPost,
  Category,
  Material,
  Product,
  Review,
  Shop,
} from "@/types";

// Built-in sample data used when Supabase isn't configured yet.
// Mirrors the real schema so swapping to live data is a drop-in change.

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

export const categories: Category[] = [
  { id: "c1", name: "Hindu Deities", slug: "hindu-deities", description: "Statues of Gods & Goddesses", image_url: img("ganesh") },
  { id: "c2", name: "Buddha Statues", slug: "buddha-statues", description: "Buddha in many poses & finishes", image_url: img("buddha") },
  { id: "c3", name: "Temple Idols", slug: "temple-idols", description: "Large idols for temples", image_url: img("temple") },
  { id: "c4", name: "Home Decor", slug: "home-decor", description: "Decorative statues for home", image_url: img("decor") },
  { id: "c5", name: "Garden Statues", slug: "garden-statues", description: "Weatherproof outdoor pieces", image_url: img("garden") },
  { id: "c6", name: "Marble Murti", slug: "marble-murti", description: "Premium marble craftsmanship", image_url: img("marble") },
];

export const materials: Material[] = [
  { id: "m1", name: "Marble", slug: "marble" },
  { id: "m2", name: "Brass", slug: "brass" },
  { id: "m3", name: "Bronze", slug: "bronze" },
  { id: "m4", name: "Panchdhatu", slug: "panchdhatu" },
  { id: "m5", name: "Sandstone", slug: "sandstone" },
  { id: "m6", name: "Fiber", slug: "fiber" },
  { id: "m7", name: "Wood", slug: "wood" },
];

export const shops: Shop[] = [
  {
    id: "s1", vendor_id: "v1", name: "Jaipur Marble Arts", slug: "jaipur-marble-arts",
    tagline: "Handcrafted marble murti since 1985", description:
      "Three generations of master craftsmen creating exquisite marble statues from the finest Makrana marble. Every piece is hand-carved and individually finished.",
    logo_url: img("logo1"), banner_url: img("banner1"), city: "Jaipur", state: "Rajasthan",
    phone: "+91 98290 00001", email: "sales@jaipurmarble.example", whatsapp: "+919829000001",
    is_featured: true, is_approved: true, rating: 4.8, review_count: 124,
  },
  {
    id: "s2", vendor_id: "v2", name: "Moradabad Brass House", slug: "moradabad-brass-house",
    tagline: "The brass city's finest idols", description:
      "Specialists in brass and panchdhatu deities, exported worldwide. Custom sizes and antique finishes available.",
    logo_url: img("logo2"), banner_url: img("banner2"), city: "Moradabad", state: "Uttar Pradesh",
    phone: "+91 99270 00002", email: "info@moradabadbrass.example", whatsapp: "+919927000002",
    is_featured: true, is_approved: true, rating: 4.6, review_count: 89,
  },
  {
    id: "s3", vendor_id: "v3", name: "Mahabalipuram Stone Craft", slug: "mahabalipuram-stone-craft",
    tagline: "Temple sculptors of the south", description:
      "Traditional stone sculptors carving temple idols and garden statues in granite and sandstone for over 40 years.",
    logo_url: img("logo3"), banner_url: img("banner3"), city: "Mahabalipuram", state: "Tamil Nadu",
    phone: "+91 90030 00003", email: "contact@mahabalistone.example", whatsapp: "+919003000003",
    is_featured: false, is_approved: true, rating: 4.9, review_count: 67,
  },
];

function makeImages(productId: string, seed: string): Product["images"] {
  return [0, 1, 2].map((i) => ({
    id: `${productId}-img${i}`,
    product_id: productId,
    url: img(`${seed}-${i}`),
    alt: null,
    sort_order: i,
  }));
}

export const products: Product[] = [
  {
    id: "p1", shop_id: "s1", category_id: "c6", material_id: "m1",
    name: "Makrana Marble Ganesh - 24 inch", slug: "makrana-marble-ganesh-24",
    description: "Intricately hand-carved Lord Ganesha in pure white Makrana marble with delicate gold detailing on the crown and ornaments.",
    deity: "Ganesha", finish: "Polished White", size: "24 inch", height_cm: 61, weight_kg: 18,
    price_min: 22000, price_max: 28000, city: "Jaipur", video_url: null,
    is_featured: true, is_approved: true, in_stock: true, images: makeImages("p1", "ganesh"),
  },
  {
    id: "p2", shop_id: "s1", category_id: "c1", material_id: "m1",
    name: "Radha Krishna Marble Set - 18 inch", slug: "radha-krishna-marble-18",
    description: "Beautiful Radha Krishna pair in white marble with hand-painted features and colored stone inlay work.",
    deity: "Radha Krishna", finish: "Hand Painted", size: "18 inch", height_cm: 46, weight_kg: 12,
    price_min: 35000, price_max: 42000, city: "Jaipur", video_url: null,
    is_featured: true, is_approved: true, in_stock: true, images: makeImages("p2", "radhakrishna"),
  },
  {
    id: "p3", shop_id: "s2", category_id: "c1", material_id: "m2",
    name: "Brass Lakshmi Idol - 12 inch", slug: "brass-lakshmi-12",
    description: "Goddess Lakshmi in solid brass with an antique finish. Ideal for home temples and gifting.",
    deity: "Lakshmi", finish: "Antique Brass", size: "12 inch", height_cm: 30, weight_kg: 4,
    price_min: 6500, price_max: 8000, city: "Moradabad", video_url: null,
    is_featured: true, is_approved: true, in_stock: true, images: makeImages("p3", "lakshmi"),
  },
  {
    id: "p4", shop_id: "s2", category_id: "c2", material_id: "m4",
    name: "Panchdhatu Meditating Buddha - 15 inch", slug: "panchdhatu-buddha-15",
    description: "Serene meditating Buddha cast in panchdhatu (five-metal alloy) with a warm golden patina.",
    deity: "Buddha", finish: "Golden Patina", size: "15 inch", height_cm: 38, weight_kg: 6,
    price_min: 14000, price_max: 17000, city: "Moradabad", video_url: null,
    is_featured: false, is_approved: true, in_stock: true, images: makeImages("p4", "buddha"),
  },
  {
    id: "p5", shop_id: "s3", category_id: "c3", material_id: "m5",
    name: "Sandstone Temple Nandi - 36 inch", slug: "sandstone-nandi-36",
    description: "Majestic Nandi bull hand-carved in pink sandstone, suitable for temple entrances and courtyards.",
    deity: "Nandi", finish: "Natural Stone", size: "36 inch", height_cm: 91, weight_kg: 120,
    price_min: 48000, price_max: 60000, city: "Mahabalipuram", video_url: null,
    is_featured: true, is_approved: true, in_stock: false, images: makeImages("p5", "nandi"),
  },
  {
    id: "p6", shop_id: "s3", category_id: "c5", material_id: "m5",
    name: "Garden Buddha Granite - 30 inch", slug: "garden-buddha-granite-30",
    description: "Weatherproof granite Buddha for gardens and landscapes, finished to withstand the elements.",
    deity: "Buddha", finish: "Matte Granite", size: "30 inch", height_cm: 76, weight_kg: 85,
    price_min: 32000, price_max: 38000, city: "Mahabalipuram", video_url: null,
    is_featured: false, is_approved: true, in_stock: true, images: makeImages("p6", "gardenbuddha"),
  },
  {
    id: "p7", shop_id: "s1", category_id: "c1", material_id: "m1",
    name: "Marble Durga Mata - 20 inch", slug: "marble-durga-20",
    description: "Goddess Durga riding her lion, carved in marble with intricate hand-painted detailing.",
    deity: "Durga", finish: "Hand Painted", size: "20 inch", height_cm: 51, weight_kg: 15,
    price_min: 28000, price_max: 34000, city: "Jaipur", video_url: null,
    is_featured: false, is_approved: true, in_stock: true, images: makeImages("p7", "durga"),
  },
  {
    id: "p8", shop_id: "s2", category_id: "c1", material_id: "m3",
    name: "Bronze Nataraja - 14 inch", slug: "bronze-nataraja-14",
    description: "Classic dancing Shiva (Nataraja) in lost-wax cast bronze, a timeless South Indian masterpiece.",
    deity: "Shiva", finish: "Oxidised Bronze", size: "14 inch", height_cm: 36, weight_kg: 5,
    price_min: 11000, price_max: 13500, city: "Moradabad", video_url: null,
    is_featured: true, is_approved: true, in_stock: true, images: makeImages("p8", "nataraja"),
  },
];

export const reviews: Review[] = [
  { id: "r1", shop_id: "s1", product_id: "p1", author_name: "Anil Sharma", rating: 5, comment: "Stunning craftsmanship, exactly as shown. Delivery was careful and on time.", created_at: "2026-05-12T10:00:00Z" },
  { id: "r2", shop_id: "s1", product_id: null, author_name: "Priya Mehta", rating: 5, comment: "Bought a Radha Krishna set for our home temple. Beautiful finish.", created_at: "2026-04-28T10:00:00Z" },
  { id: "r3", shop_id: "s2", product_id: "p3", author_name: "Ramesh Gupta", rating: 4, comment: "Good quality brass, slightly smaller than I expected but lovely.", created_at: "2026-06-01T10:00:00Z" },
  { id: "r4", shop_id: "s3", product_id: "p5", author_name: "Lakshmi Iyer", rating: 5, comment: "The Nandi is a showpiece. Master craftsmanship.", created_at: "2026-03-15T10:00:00Z" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "b1", title: "How to Choose the Right Marble Murti for Your Home Temple",
    slug: "choose-right-marble-murti", excerpt: "A practical guide to size, deity, finish and placement for your puja room.",
    body: "Choosing a murti for your home temple is a deeply personal decision...\n\nConsider the size of your mandir, the deity you connect with, and the finish that suits your decor. Marble offers timeless elegance, while brass brings warmth and tradition.",
    cover_url: img("blog1"), author: "Murti Market Team", published_at: "2026-06-10T10:00:00Z",
  },
  {
    id: "b2", title: "Marble vs Brass vs Panchdhatu: Which Material Is Right for You?",
    slug: "marble-brass-panchdhatu", excerpt: "Understand the differences in look, durability, cost and care.",
    body: "Each material tells its own story...\n\nMarble is prized for purity and detail, brass for its golden glow, and panchdhatu for its auspicious five-metal composition.",
    cover_url: img("blog2"), author: "Murti Market Team", published_at: "2026-05-22T10:00:00Z",
  },
];

export const banners: Banner[] = [
  { id: "bn1", title: "Handcrafted Murti, Direct from Artisans", subtitle: "Connect with verified statue makers across India", image_url: img("hero1"), link_url: "/search", sort_order: 0 },
  { id: "bn2", title: "Temple-Grade Idols & Custom Orders", subtitle: "Send an inquiry, get a personalised quotation", image_url: img("hero2"), link_url: "/categories", sort_order: 1 },
];
