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

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : shop.rating.toFixed(1);

  return (
    <div className="min-h-screen bg-white">
      {/* ===== SHOP NAVBAR ===== */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-clay-900/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/10">
              <Thumb src={shop.logo_url} alt={shop.name} seed={shop.slug} icon="🏪" width={36} height={36} className="object-cover" />
            </span>
            <span className="text-base font-extrabold text-white">{shop.name}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <a href="#products" className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white sm:text-sm">
              Products
            </a>
            <a href="#about" className="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white sm:inline sm:text-sm">
              About
            </a>
            <a href="#reviews" className="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white sm:inline sm:text-sm">
              Reviews
            </a>
            <a href="#contact" className="rounded-lg bg-saffron-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-saffron-600 sm:px-4 sm:text-sm">
              Get Quote
            </a>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[70vh] overflow-hidden bg-clay-900 sm:min-h-[80vh]">
        {/* Banner image */}
        {shop.banner_url && (
          <div className="absolute inset-0">
            <Thumb
              src={shop.banner_url}
              alt=""
              seed={`${shop.slug}-banner`}
              icon={null}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-clay-900 via-clay-900/60 to-clay-900/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-clay-900/40 to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 flex min-h-[70vh] items-end pb-16 sm:min-h-[80vh] sm:items-center sm:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              {/* Verified badge */}
              {shop.is_approved && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-1.5 text-xs font-bold text-green-400 ring-1 ring-green-500/30 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Verified Artisan
                </div>
              )}

              {/* Shop name */}
              <h1 className="text-4xl font-extrabold text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">
                {shop.name}
              </h1>

              {/* Tagline */}
              {shop.tagline && (
                <p className="mt-4 max-w-lg text-lg text-white/70 sm:text-xl">
                  {shop.tagline}
                </p>
              )}

              {/* Location & rating */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {shop.city}{shop.state ? `, ${shop.state}` : ""}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <StarRating rating={shop.rating} count={shop.review_count} size="md" />
              </div>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                {shop.phone && (
                  <a
                    href={`tel:${shop.phone}`}
                    className="group inline-flex items-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-clay-900 shadow-2xl transition hover:bg-clay-50 hover:shadow-3xl"
                  >
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    Call Now
                  </a>
                )}
                {shop.whatsapp && (
                  <a
                    href={`https://wa.me/${shop.whatsapp.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 rounded-2xl bg-green-500 px-6 py-3.5 text-sm font-bold text-white shadow-2xl shadow-green-500/30 transition hover:bg-green-600 hover:shadow-3xl"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                )}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  Send Inquiry
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating logo badge */}
        <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2 sm:left-8 sm:translate-x-0">
          <div className="relative">
            <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl sm:h-32 sm:w-32">
              <Thumb src={shop.logo_url} alt={shop.name} seed={shop.slug} icon="🏪" width={128} height={128} className="object-cover" />
            </span>
            {shop.is_approved && (
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-green-500 text-xs text-white shadow-lg sm:h-8 sm:w-8">
                ✓
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-b border-clay-100 bg-white pt-16 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron-50 text-2xl">
                🏺
              </div>
              <p className="mt-3 text-2xl font-extrabold text-clay-900">{products.length}+</p>
              <p className="text-sm text-clay-500">Handcrafted Products</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron-50 text-2xl">
                ⭐
              </div>
              <p className="mt-3 text-2xl font-extrabold text-clay-900">{avgRating}</p>
              <p className="text-sm text-clay-500">Customer Rating</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron-50 text-2xl">
                💬
              </div>
              <p className="mt-3 text-2xl font-extrabold text-clay-900">{reviews.length}</p>
              <p className="text-sm text-clay-500">Happy Reviews</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl">
                🚚
              </div>
              <p className="mt-3 text-2xl font-extrabold text-green-600">Pan India</p>
              <p className="text-sm text-clay-500">Delivery Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS SECTION ===== */}
      <section id="products" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-100 px-3 py-1 text-xs font-bold text-saffron-700">
              🕉️ Our Collection
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-clay-900 sm:text-4xl">
              Explore Our Handcrafted Statues
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-clay-500">
              Each piece is meticulously crafted by skilled artisans, preserving centuries-old traditions
            </p>
          </div>

          {products.length === 0 ? (
            <div className="mt-16 rounded-3xl border-2 border-dashed border-clay-200 py-20 text-center">
              <p className="text-6xl">📦</p>
              <p className="mt-4 text-xl font-bold text-clay-400">Products coming soon</p>
              <p className="mt-2 text-sm text-clay-400">Check back later for our handcrafted collection</p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-14 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      {shop.description && (
        <section id="about" className="bg-clay-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-100 px-3 py-1 text-xs font-bold text-saffron-700">
                  🙏 Our Story
                </span>
                <h2 className="mt-3 text-3xl font-extrabold text-clay-900 sm:text-4xl">
                  About {shop.name}
                </h2>
                <p className="mt-6 leading-relaxed text-clay-600">
                  {shop.description}
                </p>
                {shop.city && (
                  <div className="mt-6 flex items-center gap-2 text-clay-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    Based in {shop.city}{shop.state ? `, ${shop.state}` : ""} · Serving customers across India
                  </div>
                )}
              </div>
              <div className="relative">
                {shop.banner_url ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                    <Thumb src={shop.banner_url} alt={shop.name} seed={`${shop.slug}-about`} icon={null} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-saffron-50 text-6xl shadow-2xl">
                    🏪
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== REVIEWS SECTION ===== */}
      {reviews.length > 0 && (
        <section id="reviews" className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-100 px-3 py-1 text-xs font-bold text-saffron-700">
                ❤️ Testimonials
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-clay-900 sm:text-4xl">
                What Our Customers Say
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 6).map((r) => (
                <div key={r.id} className="rounded-2xl bg-clay-50 p-6 transition hover:shadow-lg">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`h-4 w-4 ${i < r.rating ? "fill-amber-400" : "fill-clay-200"}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-clay-600">{r.comment}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 text-xs font-bold text-white">
                      {r.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-clay-900">{r.author_name}</p>
                      <p className="text-xs text-clay-400">
                        {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CONTACT / INQUIRY SECTION ===== */}
      <section id="contact" className="bg-clay-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Left - info */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-saffron-400">
                ✉️ Get In Touch
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Have a Requirement?
              </h2>
              <p className="mt-4 max-w-lg text-lg text-white/60">
                Tell us what you need and we&apos;ll get back to you with a personalized quote. No obligation, completely free.
              </p>

              <div className="mt-8 space-y-4">
                {shop.phone && (
                  <a href={`tel:${shop.phone}`} className="flex items-center gap-4 text-white/80 transition hover:text-white">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl">📞</span>
                    <div>
                      <p className="text-xs text-white/50">Call us directly</p>
                      <p className="font-bold">{shop.phone}</p>
                    </div>
                  </a>
                )}
                {shop.whatsapp && (
                  <a href={`https://wa.me/${shop.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/80 transition hover:text-white">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-xl">💬</span>
                    <div>
                      <p className="text-xs text-white/50">Chat on WhatsApp</p>
                      <p className="font-bold">{shop.whatsapp}</p>
                    </div>
                  </a>
                )}
                {shop.email && (
                  <a href={`mailto:${shop.email}`} className="flex items-center gap-4 text-white/80 transition hover:text-white">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl">✉️</span>
                    <div>
                      <p className="text-xs text-white/50">Email us</p>
                      <p className="font-bold">{shop.email}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Right - form */}
            <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <h3 className="text-xl font-extrabold text-clay-900">Send us an Inquiry</h3>
              <p className="mt-1 text-sm text-clay-500">We&apos;ll respond within 24 hours</p>
              <div className="mt-6">
                <InquiryForm shopId={shop.id} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WRITE A REVIEW ===== */}
      <section className="bg-clay-50 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold text-clay-900">Share Your Experience</h2>
          <p className="mt-2 text-clay-500">Your review helps other customers find the best artisans</p>
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <ReviewForm shopId={shop.id} />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-clay-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-clay-100">
                <Thumb src={shop.logo_url} alt={shop.name} seed={shop.slug} icon="🏪" width={32} height={32} className="object-cover" />
              </span>
              <div>
                <p className="text-sm font-bold text-clay-900">{shop.name}</p>
                <p className="text-xs text-clay-400">© {new Date().getFullYear()} All rights reserved</p>
              </div>
            </div>
            <Link href="/" className="text-xs font-medium text-saffron-600 transition hover:text-saffron-700">
              Powered by MoortiBazaar →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
