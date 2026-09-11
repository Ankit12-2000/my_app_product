import Link from "next/link";
import { Thumb } from "@/components/Thumb";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { ShopCard } from "@/components/ShopCard";
import { BannerSlider } from "@/components/BannerSlider";
import { deityIcon } from "@/lib/images";
import { primaryImage } from "@/lib/utils";
import type { Product } from "@/types";
import {
  getBanners,
  getCategoryShelves,
  getFeaturedShops,
  getHomeProducts,
} from "@/lib/data/queries";

const stats = [
  { n: "500+", l: "Verified vendors" },
  { n: "10,000+", l: "Statues listed" },
  { n: "50+", l: "Cities covered" },
  { n: "100%", l: "Free to inquire" },
];

const popularSearches = [
  "Ganesh",
  "Buddha",
  "Marble",
  "Brass",
  "Radha Krishna",
  "Nataraj",
  "Durga",
  "Hanuman",
];

const steps = [
  {
    n: "1",
    t: "Search & Discover",
    d: "Browse statues by material, deity, size and city from verified artisans across India.",
  },
  {
    n: "2",
    t: "Send an Inquiry",
    d: "Send the vendor your requirement — no payment needed at any point.",
  },
  {
    n: "3",
    t: "Get a Quotation",
    d: "The vendor replies with pricing, customisation and delivery details, directly to you.",
  },
];

export default async function HomePage() {
  const [banners, products, shelves, shops] = await Promise.all([
    getBanners(),
    getHomeProducts(18),
    getCategoryShelves(6),
    getFeaturedShops(),
  ]);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Masthead — the pitch, the primary actions and search in one band  */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-clay-900 via-clay-800 to-saffron-900 text-white">
        {/* Faint concentric arcs, the only decoration on the band. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-64 h-[560px] w-[560px] text-white/[0.07]"
          viewBox="-150 -150 300 300"
          fill="none"
          stroke="currentColor"
        >
          <circle r="70" />
          <circle r="105" />
          <circle r="140" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                India&apos;s Online{" "}
                <span className="text-saffron-300">Murti &amp; Idol Marketplace</span>
              </h1>
              <p className="mt-2 text-sm text-white/75 sm:text-base">
                Connecting devotees and temples with trusted artisans
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-clay-900 shadow-sm transition hover:bg-clay-50"
              >
                Post Requirement <span aria-hidden>→</span>
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-clay-50"
              >
                Start Selling <span aria-hidden>→</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-saffron-700 shadow-sm transition hover:bg-clay-50"
              >
                Sign In <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <div className="mt-7 max-w-3xl">
            <SearchBar />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70 sm:text-sm">
              <span>Popular:</span>
              {popularSearches.map((t) => (
                <Link
                  key={t}
                  href={`/search?q=${encodeURIComponent(t)}`}
                  className="rounded-full bg-white/10 px-3 py-1 transition hover:bg-white/20 hover:text-white"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats rail */}
        <div className="relative border-t border-white/15 bg-black/15">
          <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-4 px-4 py-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="flex flex-wrap items-baseline gap-x-2">
                <dt className="text-lg font-bold text-saffron-300 sm:text-xl">{s.n}</dt>
                <dd className="text-[11px] uppercase tracking-wide text-white/70 sm:text-xs">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Promotional banners                                               */}
      {/* ---------------------------------------------------------------- */}
      {banners.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="relative mx-auto h-[240px] max-w-5xl overflow-hidden rounded-xl bg-clay-200 sm:h-[300px]">
            <BannerSlider banners={banners} showDots fit="contain" />
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Category shelves                                                  */}
      {/* ---------------------------------------------------------------- */}
      {shelves.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-4">
          <h2 className="text-xl font-bold text-clay-900 sm:text-2xl">Explore by Category</h2>

          <div className="mt-5 space-y-8">
            {shelves.map(({ category, products: shelfProducts }) => (
              <div key={category.id}>
                <SectionBar
                  title={category.name}
                  href={`/categories/${category.slug}`}
                  linkText="View all"
                  small
                />
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {shelfProducts.map((p) => (
                    <CompactProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Latest listings                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionBar title="Latest Murtis" href="/search" linkText="Browse all" />
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Vendors                                                           */}
      {/* ---------------------------------------------------------------- */}
      {shops.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <SectionBar title="Top Vendors" href="/vendors" linkText="All vendors" />
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((s) => (
                <ShopCard key={s.id} shop={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* How it works + seller CTA                                         */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-clay-100 bg-clay-100/70"
      >
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-xl font-bold text-clay-900 sm:text-2xl">How Murti Market Online Works</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border border-clay-200 bg-white p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-saffron-600 text-sm font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-3 font-semibold text-clay-900">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-clay-600">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl bg-clay-900 px-6 py-6 text-white sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold">Are you a murti artisan or dealer?</h3>
              <p className="mt-1 text-sm text-white/70">
                List your workshop free, receive inquiries directly and quote your own price.
              </p>
            </div>
            <Link
              href="/sell"
              className="shrink-0 rounded-full bg-saffron-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-saffron-700"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page-local pieces                                                   */
/* ------------------------------------------------------------------ */

/** Heading with a "view all" link pinned to the right of the row. */
function SectionBar({
  title,
  href,
  linkText,
  small,
}: {
  title: string;
  href: string;
  linkText: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2
        className={
          small
            ? "text-base font-semibold text-clay-900 sm:text-lg"
            : "text-lg font-bold text-clay-900 sm:text-xl"
        }
      >
        {title}
      </h2>
      <Link href={href} className="shrink-0 text-sm font-medium text-saffron-700 hover:underline">
        {linkText} →
      </Link>
    </div>
  );
}

/** Denser than ProductCard — used inside the six-across category shelves. */
function CompactProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-lg border border-clay-200 bg-white transition hover:border-saffron-300 hover:shadow-sm"
    >
      <span className="relative block aspect-square overflow-hidden bg-clay-50">
        <Thumb
          src={primaryImage(product)}
          alt={product.name}
          seed={product.slug}
          icon={deityIcon(product.deity)}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </span>
      <span className="block p-2.5">
        <span className="clamp-2 block text-xs font-medium leading-snug text-clay-800 transition group-hover:text-saffron-700">
          {product.name}
        </span>
        {product.city && (
          <span className="mt-1 block truncate text-[11px] text-clay-500">{product.city}</span>
        )}
      </span>
    </Link>
  );
}
