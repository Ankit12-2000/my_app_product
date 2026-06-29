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
  return { title: shop?.name ?? "Vendor", description: shop?.tagline ?? undefined };
}

export default async function VendorPage({
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

  return (
    <div className="bg-clay-50">
      {/* Hero Banner */}
      <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
        <Thumb
          src={shop.banner_url}
          alt=""
          seed={`${shop.slug}-banner`}
          icon={null}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg sm:text-5xl">{shop.name}</h1>
            {shop.tagline && <p className="mt-2 max-w-xl text-base text-white/90 sm:text-lg">{shop.tagline}</p>}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* Profile Header Card */}
        <div className="relative z-10 -mt-16 rounded-3xl border border-clay-100 bg-white p-6 shadow-xl sm:-mt-24 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Logo */}
            <div className="relative shrink-0 self-center sm:self-auto">
              <span className="grid h-28 w-28 place-items-center overflow-hidden rounded-3xl border-4 border-white bg-clay-100 shadow-lg sm:h-32 sm:w-32">
                <Thumb src={shop.logo_url} alt={shop.name} seed={shop.slug} icon="🏪" width={128} height={128} className="object-cover" />
              </span>
              {shop.is_approved && (
                <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-3 border-white bg-green-500 text-sm text-white shadow-lg">
                  ✓
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-2xl font-extrabold text-clay-900 sm:text-3xl">{shop.name}</h2>
                {shop.is_approved && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    ✓ Verified
                  </span>
                )}
              </div>
              {shop.tagline && <p className="mt-1 text-sm text-clay-500 sm:text-base">{shop.tagline}</p>}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-clay-500 sm:justify-start">
                <span className="flex items-center gap-1">📍 {shop.city}{shop.state ? `, ${shop.state}` : ""}</span>
                <span className="text-clay-300">•</span>
                <StarRating rating={shop.rating} count={shop.review_count} size="md" />
              </div>

              {/* Stats */}
              <div className="mt-5 flex justify-center gap-3 sm:justify-start">
                <div className="rounded-2xl border border-clay-100 bg-white px-5 py-3 text-center shadow-sm">
                  <p className="text-xl font-extrabold text-saffron-700">{products.length}</p>
                  <p className="text-xs font-medium text-clay-500">Products</p>
                </div>
                <div className="rounded-2xl border border-clay-100 bg-white px-5 py-3 text-center shadow-sm">
                  <p className="text-xl font-extrabold text-saffron-700">{reviews.length}</p>
                  <p className="text-xs font-medium text-clay-500">Reviews</p>
                </div>
                <div className="rounded-2xl border border-clay-100 bg-white px-5 py-3 text-center shadow-sm">
                  <p className="text-xl font-extrabold text-saffron-700">{shop.rating.toFixed(1)}</p>
                  <p className="text-xs font-medium text-clay-500">Rating</p>
                </div>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="flex shrink-0 flex-col gap-2.5 self-center sm:self-auto">
              {shop.phone && (
                <a
                  href={`tel:${shop.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-blue-200 bg-white px-5 py-2.5 text-sm font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {shop.phone}
                </a>
              )}
              {shop.whatsapp && (
                <a
                  href={`https://wa.me/${shop.whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-green-700 hover:shadow-lg"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid gap-8 pb-16 lg:grid-cols-[1fr_380px]">
          {/* Left Column */}
          <div className="space-y-8">
            {/* About */}
            {shop.description && (
              <section className="rounded-3xl border border-clay-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-clay-900">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-100 text-sm">📝</span>
                  About
                </h2>
                <p className="mt-4 leading-relaxed text-clay-600">{shop.description}</p>
              </section>
            )}

            {/* Products */}
            <section className="rounded-3xl border border-clay-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-clay-900">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-100 text-sm">🛍️</span>
                  Products
                </h2>
                <span className="rounded-full bg-saffron-100 px-3 py-1 text-xs font-bold text-saffron-700">{products.length}</span>
              </div>
              {products.length === 0 ? (
                <div className="mt-6 rounded-2xl border-2 border-dashed border-clay-200 py-12 text-center">
                  <p className="text-3xl">📦</p>
                  <p className="mt-2 text-clay-500">No products listed yet.</p>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>

            {/* Reviews */}
            <section className="rounded-3xl border border-clay-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-clay-900">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-100 text-sm">⭐</span>
                  Reviews
                </h2>
                <span className="rounded-full bg-saffron-100 px-3 py-1 text-xs font-bold text-saffron-700">{reviews.length}</span>
              </div>

              {reviews.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-2xl bg-clay-50 p-5">
                      <div className="flex items-start gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 text-sm font-bold text-white shadow">
                          {r.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-clay-900">{r.author_name}</span>
                            <StarRating rating={r.rating} />
                          </div>
                          {r.comment && <p className="mt-2 text-sm leading-relaxed text-clay-600">{r.comment}</p>}
                          <p className="mt-1.5 text-xs text-clay-400">{new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border-2 border-dashed border-clay-200 py-10 text-center">
                  <p className="text-3xl">💬</p>
                  <p className="mt-2 text-clay-500">No reviews yet. Be the first to review!</p>
                </div>
              )}

              <div className="mt-6 border-t border-clay-100 pt-6">
                <h3 className="font-bold text-clay-900">Write a Review</h3>
                <ReviewForm shopId={shop.id} />
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-3xl border border-clay-100 bg-white p-6 shadow-lg">
              <div className="text-center">
                <h2 className="text-lg font-extrabold text-clay-900">Contact this vendor</h2>
                <p className="mt-1 text-sm text-clay-500">
                  Send your requirement and get a personalised quotation.
                </p>
              </div>
              <div className="mt-5">
                <InquiryForm shopId={shop.id} />
              </div>
              <p className="mt-4 text-center text-xs text-clay-400">
                No payment required. The vendor will contact you with a quotation.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
