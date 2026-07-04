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
      <section className="relative min-h-[55vh] overflow-hidden bg-clay-900 sm:min-h-[65vh]">
        {/* Banner image */}
        {shop.banner_url && (
          <div className="absolute inset-0">
            <Thumb src={shop.banner_url} alt="" seed={`${shop.slug}-banner`} icon={null} fill priority className="object-cover" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-clay-900 via-clay-900/50 to-clay-900/20" />

        {/* Hero content — centered */}
        <div className="relative z-10 flex min-h-[55vh] items-center sm:min-h-[65vh]">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
              {/* Logo */}
              <div className="shrink-0">
                <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm sm:h-28 sm:w-28 sm:rounded-3xl">
                  <Thumb src={shop.logo_url} alt={shop.name} seed={shop.slug} icon="🏪" width={112} height={112} className="object-cover" />
                </span>
              </div>

              {/* Text */}
              <div>
                {shop.is_approved && (
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-bold text-green-400 ring-1 ring-green-500/30 backdrop-blur-sm sm:text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Verified Artisan
                  </div>
                )}
                <h1 className="text-3xl font-extrabold text-white drop-shadow-2xl sm:text-5xl lg:text-6xl">
                  {shop.name}
                </h1>
                {shop.tagline && (
                  <p className="mt-2 max-w-lg text-base text-white/70 sm:mt-3 sm:text-lg">
                    {shop.tagline}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60 sm:justify-start sm:text-sm">
                  <span className="flex items-center gap-1">
                    📍 {shop.city}{shop.state ? `, ${shop.state}` : ""}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <StarRating rating={shop.rating} count={shop.review_count} size="md" />
                </div>

                {/* CTA buttons */}
                <div className="mt-5 flex flex-wrap justify-center gap-2.5 sm:justify-start">
                  {shop.phone && (
                    <a href={`tel:${shop.phone}`} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-clay-900 shadow-lg transition hover:bg-clay-50">
                      📞 Call Now
                    </a>
                  )}
                  {shop.whatsapp && (
                    <a href={`https://wa.me/${shop.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition hover:bg-green-600">
                      💬 WhatsApp
                    </a>
                  )}
                  <a href="#contact" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/25 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
                    ✉️ Send Inquiry
                  </a>
                </div>
              </div>
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

      {/* ===== TRUST BAR ===== */}
      <section className="border-y border-clay-100 bg-clay-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">🏺</div>
              <p className="mt-3 text-2xl font-extrabold text-clay-900">{products.length}+</p>
              <p className="text-sm text-clay-500">Handcrafted Products</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">⭐</div>
              <p className="mt-3 text-2xl font-extrabold text-clay-900">{avgRating}</p>
              <p className="text-sm text-clay-500">Customer Rating</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">💬</div>
              <p className="mt-3 text-2xl font-extrabold text-clay-900">{reviews.length}</p>
              <p className="text-sm text-clay-500">Happy Reviews</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">🚚</div>
              <p className="mt-3 text-2xl font-extrabold text-green-600">Pan India</p>
              <p className="text-sm text-clay-500">Delivery Available</p>
            </div>
          </div>
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
