import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { ReviewForm } from "@/components/ReviewForm";
import { Thumb } from "@/components/Thumb";
import { ProductCard } from "@/components/ProductCard";
import { StarRating } from "@/components/StarRating";
import {
  getProductsByShop,
  getReviewsByShop,
  getShopBySlug,
} from "@/lib/data/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  if (!shop) return { title: "Shop Not Found" };
  return {
    title: `${shop.name} — ${shop.tagline || "Premium Moorti & Statue Shop"}`,
    description: shop.description?.slice(0, 160) ?? `${shop.name} — handcrafted moorti and murti from ${shop.city || "India"}. Shop on MoortiBazaar.`,
    openGraph: {
      title: shop.name,
      description: shop.tagline ?? shop.description?.slice(0, 160) ?? "",
      images: shop.banner_url ? [shop.banner_url] : [],
    },
  };
}

export default async function PersonalShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  if (!shop) notFound();

  const [products, reviews] = await Promise.all([
    getProductsByShop(shop.id),
    getReviewsByShop(shop.id),
  ]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : shop.rating.toFixed(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-clay-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
          <Link href="/" className="text-xs text-clay-500 hover:text-saffron-600">
            ← Powered by MoortiBazaar
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-clay-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Open for business
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-clay-900 via-clay-800 to-clay-900">
        {shop.banner_url && (
          <div className="absolute inset-0">
            <Thumb src={shop.banner_url} alt="" seed={`${shop.slug}-banner`} icon={null} fill className="object-cover opacity-30" />
          </div>
        )}
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="relative shrink-0">
              <span className="grid h-28 w-28 place-items-center overflow-hidden rounded-3xl border-4 border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm sm:h-36 sm:w-36">
                <Thumb src={shop.logo_url} alt={shop.name} seed={shop.slug} icon="🏪" width={144} height={144} className="object-cover" />
              </span>
              {shop.is_approved && (
                <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-green-500 text-xs text-white shadow-lg">
                  ✓
                </span>
              )}
            </div>
            <div className="text-white">
              {shop.is_approved && (
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-sm">
                  <span className="h-1 w-1 rounded-full bg-green-400" />
                  Verified Artisan
                </span>
              )}
              <h1 className="text-3xl font-extrabold sm:text-5xl">{shop.name}</h1>
              {shop.tagline && <p className="mt-2 text-sm text-white/70 sm:text-lg">{shop.tagline}</p>}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60 sm:justify-start sm:text-sm">
                <span>📍 {shop.city}{shop.state ? `, ${shop.state}` : ""}</span>
                <span>•</span>
                <StarRating rating={shop.rating} count={shop.review_count} size="md" />
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                {shop.phone && (
                  <a href={`tel:${shop.phone}`} className="flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/30">
                    📞 Call Now
                  </a>
                )}
                {shop.whatsapp && (
                  <a href={`https://wa.me/${shop.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-green-600">
                    💬 WhatsApp
                  </a>
                )}
                <a href="#contact" className="flex items-center gap-1.5 rounded-lg border-2 border-white/30 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
                  ✉️ Send Inquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-b border-clay-100">
        <div className="mx-auto grid grid-cols-3 divide-x divide-clay-100 max-w-6xl">
          <div className="px-4 py-5 text-center">
            <p className="text-xl font-extrabold text-clay-900">{products.length}</p>
            <p className="text-xs text-clay-500">Products</p>
          </div>
          <div className="px-4 py-5 text-center">
            <p className="text-xl font-extrabold text-clay-900">{avgRating} ⭐</p>
            <p className="text-xs text-clay-500">Rating ({reviews.length})</p>
          </div>
          <div className="px-4 py-5 text-center">
            <p className="text-xl font-extrabold text-green-600">All India</p>
            <p className="text-xs text-clay-500">Delivery</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="flex items-end justify-between border-b border-clay-100 pb-4">
          <h2 className="text-xl font-extrabold text-clay-900 sm:text-2xl">Our Collection</h2>
          <span className="rounded-full bg-saffron-100 px-3 py-1 text-xs font-bold text-saffron-700">{products.length} items</span>
        </div>
        {products.length === 0 ? (
          <div className="mt-10 rounded-3xl border-2 border-dashed border-clay-200 py-16 text-center">
            <p className="text-5xl">📦</p>
            <p className="mt-3 text-lg font-semibold text-clay-400">Products coming soon</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* About + Contact */}
      <div className="bg-clay-50" id="contact">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {shop.description && (
              <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-extrabold text-clay-900 sm:text-2xl">About {shop.name}</h2>
                <p className="mt-4 text-sm leading-relaxed text-clay-600 sm:text-base">{shop.description}</p>
              </div>
            )}

            <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
              <h2 className="text-xl font-extrabold text-clay-900 sm:text-2xl">Contact Us</h2>
              <p className="mt-1 text-sm text-clay-500">Get a free quote for your requirement</p>
              <div className="mt-5">
                <InquiryForm shopId={shop.id} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {shop.phone && (
                  <a href={`tel:${shop.phone}`} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                    📞 Call Now
                  </a>
                )}
                {shop.whatsapp && (
                  <a href={`https://wa.me/${shop.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition hover:bg-green-700">
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
          <h2 className="text-xl font-extrabold text-clay-900 sm:text-2xl">Customer Reviews</h2>
          <div className="mt-6 space-y-4">
            {reviews.slice(0, 6).map((r) => (
              <div key={r.id} className="flex gap-4 rounded-2xl border border-clay-100 bg-white p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 text-sm font-bold text-white shadow">
                  {r.author_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-clay-900">{r.author_name}</span>
                    <StarRating rating={r.rating} />
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-clay-600">{r.comment}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-3xl bg-clay-50 p-6">
            <h3 className="text-lg font-extrabold text-clay-900">Write a Review</h3>
            <ReviewForm shopId={shop.id} />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-clay-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-clay-400">© {new Date().getFullYear()} {shop.name}. All rights reserved.</p>
            <Link href="/" className="text-xs font-medium text-saffron-600 hover:underline">
              Powered by MoortiBazaar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
