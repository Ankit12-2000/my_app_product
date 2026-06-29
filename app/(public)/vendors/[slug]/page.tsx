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
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[35vh] items-end overflow-hidden sm:min-h-[45vh]">
        <Thumb
          src={shop.banner_url}
          alt=""
          seed={`${shop.slug}-banner`}
          icon={null}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

        <div className="relative z-10 w-full px-4 pb-8 pt-24 sm:px-8 sm:pb-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-8">
              {/* Logo */}
              <div className="relative shrink-0">
                <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm sm:h-36 sm:w-36 sm:rounded-3xl">
                  <Thumb src={shop.logo_url} alt={shop.name} seed={shop.slug} icon="🏪" width={144} height={144} className="object-cover" />
                </span>
                {shop.is_approved && (
                  <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-green-500 text-xs text-white shadow-lg sm:-bottom-2 sm:-right-2 sm:h-8 sm:w-8">
                    ✓
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 text-white">
                {shop.is_approved && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm sm:mb-3 sm:px-3 sm:text-xs">
                    <span className="h-1 w-1 rounded-full bg-green-400 sm:h-1.5 sm:w-1.5" />
                    Verified Artisan
                  </span>
                )}
                <h1 className="text-2xl font-extrabold drop-shadow-lg sm:text-5xl">{shop.name}</h1>
                {shop.tagline && (
                  <p className="mt-2 max-w-lg text-sm text-white/80 sm:mt-3 sm:text-lg">{shop.tagline}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70 sm:mt-3 sm:gap-4 sm:text-sm">
                  <span className="flex items-center gap-1">
                    📍 {shop.city}{shop.state ? `, ${shop.state}` : ""}
                  </span>
                  <span className="text-white/30">•</span>
                  <StarRating rating={shop.rating} count={shop.review_count} size="md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="border-b border-clay-100 bg-white">
        <div className="mx-auto grid grid-cols-2 gap-3 px-4 py-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-5 lg:px-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-saffron-100 text-base sm:h-11 sm:w-11 sm:rounded-2xl sm:text-xl">🏺</span>
            <div>
              <p className="text-base font-extrabold text-clay-900 sm:text-lg">{products.length}+</p>
              <p className="text-[10px] text-clay-500 sm:text-xs">Products</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-saffron-100 text-base sm:h-11 sm:w-11 sm:rounded-2xl sm:text-xl">⭐</span>
            <div>
              <p className="text-base font-extrabold text-clay-900 sm:text-lg">{shop.rating.toFixed(1)}</p>
              <p className="text-[10px] text-clay-500 sm:text-xs">Rating</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-saffron-100 text-base sm:h-11 sm:w-11 sm:rounded-2xl sm:text-xl">💬</span>
            <div>
              <p className="text-base font-extrabold text-clay-900 sm:text-lg">{reviews.length}</p>
              <p className="text-[10px] text-clay-500 sm:text-xs">Reviews</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-saffron-100 text-base sm:h-11 sm:w-11 sm:rounded-2xl sm:text-xl">🚚</span>
            <div>
              <p className="text-base font-extrabold text-clay-900 sm:text-lg">All India</p>
              <p className="text-[10px] text-clay-500 sm:text-xs">Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Left */}
            <div className="space-y-10 sm:space-y-14">
              {/* About */}
              {shop.description && (
                <section>
                  <h2 className="flex items-center gap-2 text-lg font-extrabold text-clay-900 sm:items-center sm:gap-3 sm:text-2xl">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-100 text-sm sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg">🙏</span>
                    About Us
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-clay-600 sm:mt-5 sm:text-base">{shop.description}</p>
                </section>
              )}

              {/* Products */}
              <section>
                <div className="flex items-end justify-between border-b border-clay-100 pb-3 sm:pb-4">
                  <h2 className="flex items-center gap-2 text-lg font-extrabold text-clay-900 sm:gap-3 sm:text-2xl">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-100 text-sm sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg">🕉️</span>
                    Our Collection
                  </h2>
                  <span className="rounded-full bg-saffron-100 px-2.5 py-1 text-xs font-bold text-saffron-700 sm:px-4 sm:text-sm">{products.length} items</span>
                </div>
                {products.length === 0 ? (
                  <div className="mt-8 rounded-2xl border-2 border-dashed border-clay-200 py-12 text-center sm:mt-10 sm:rounded-3xl sm:py-16">
                    <p className="text-4xl sm:text-5xl">📦</p>
                    <p className="mt-2 text-base font-semibold text-clay-400 sm:text-lg">Products coming soon</p>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5">
                    {products.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </section>

              {/* Inquiry Form - Mobile only (after products) */}
              <div className="lg:hidden">
                <div className="overflow-hidden rounded-2xl border border-clay-100 bg-white shadow-lg">
                  <div className="bg-gradient-to-r from-saffron-600 to-saffron-700 p-4 text-center text-white">
                    <h2 className="text-lg font-extrabold">Get a Free Quote</h2>
                    <p className="mt-0.5 text-xs text-white/80">Tell us your requirement</p>
                  </div>
                  <div className="p-4">
                    <InquiryForm shopId={shop.id} />
                    <p className="mt-3 text-center text-[10px] text-clay-400">
                      ✅ No payment required · ✅ Vendor will call you
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {shop.phone && (
                    <a href={`tel:${shop.phone}`} className="flex items-center justify-center gap-2 rounded-xl border-2 border-blue-100 bg-blue-50 py-3 text-center transition hover:bg-blue-100">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-sm text-white">📞</span>
                      <span className="text-xs font-bold text-blue-700">Call Now</span>
                    </a>
                  )}
                  {shop.whatsapp && (
                    <a href={`https://wa.me/${shop.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border-2 border-green-100 bg-green-50 py-3 text-center transition hover:bg-green-100">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-green-600 text-sm text-white">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      </span>
                      <span className="text-xs font-bold text-green-700">WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <section>
                <div className="flex items-end justify-between border-b border-clay-100 pb-3 sm:pb-4">
                  <h2 className="flex items-center gap-2 text-lg font-extrabold text-clay-900 sm:gap-3 sm:text-2xl">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-100 text-sm sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg">❤️</span>
                    Customer Reviews
                  </h2>
                  <span className="rounded-full bg-saffron-100 px-2.5 py-1 text-xs font-bold text-saffron-700 sm:px-4 sm:text-sm">{reviews.length}</span>
                </div>

                {reviews.length > 0 ? (
                  <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="flex gap-3 rounded-xl border border-clay-100 p-3 sm:gap-4 sm:rounded-2xl sm:p-5">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 text-sm font-bold text-white shadow-md sm:h-12 sm:w-12 sm:text-base">
                          {r.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate font-bold text-clay-900">{r.author_name}</span>
                            <StarRating rating={r.rating} />
                          </div>
                          {r.comment && <p className="mt-1.5 text-xs leading-relaxed text-clay-600 sm:mt-2 sm:text-sm">{r.comment}</p>}
                          <p className="mt-1 text-[10px] text-clay-400 sm:mt-2 sm:text-xs">{new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border-2 border-dashed border-clay-200 py-10 text-center sm:mt-6 sm:rounded-3xl sm:py-12">
                    <p className="text-4xl sm:text-5xl">💬</p>
                    <p className="mt-2 text-base font-semibold text-clay-400 sm:text-lg">No reviews yet</p>
                    <p className="mt-0.5 text-xs text-clay-400 sm:mt-1 sm:text-sm">Be the first to share your experience!</p>
                  </div>
                )}

                <div className="mt-6 rounded-2xl bg-clay-50 p-4 sm:mt-8 sm:rounded-3xl sm:p-6">
                  <h3 className="text-base font-extrabold text-clay-900 sm:text-lg">Write a Review</h3>
                  <ReviewForm shopId={shop.id} />
                </div>
              </section>
            </div>

            {/* Sidebar - Desktop only */}
            <aside className="hidden lg:sticky lg:top-8 lg:block lg:h-fit">
              <div className="overflow-hidden rounded-3xl border border-clay-100 bg-white shadow-xl">
                <div className="bg-gradient-to-r from-saffron-600 to-saffron-700 p-6 text-center text-white">
                  <h2 className="text-xl font-extrabold">Get a Free Quote</h2>
                  <p className="mt-1 text-sm text-white/80">Tell us your requirement</p>
                </div>
                <div className="p-6">
                  <InquiryForm shopId={shop.id} />
                  <p className="mt-4 text-center text-xs text-clay-400">
                    ✅ No payment required · ✅ Vendor will call you · ✅ Free quotation
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {shop.phone && (
                  <a href={`tel:${shop.phone}`} className="flex flex-col items-center gap-2 rounded-2xl border-2 border-blue-100 bg-blue-50 py-4 text-center transition hover:border-blue-200 hover:bg-blue-100">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white">📞</span>
                    <span className="text-xs font-bold text-blue-700">Call Now</span>
                  </a>
                )}
                {shop.whatsapp && (
                  <a href={`https://wa.me/${shop.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 rounded-2xl border-2 border-green-100 bg-green-50 py-4 text-center transition hover:border-green-200 hover:bg-green-100">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-green-600 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </span>
                    <span className="text-xs font-bold text-green-700">WhatsApp</span>
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
