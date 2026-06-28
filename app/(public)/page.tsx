import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { Thumb } from "@/components/Thumb";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { ShopCard } from "@/components/ShopCard";
import { BannerSlider } from "@/components/BannerSlider";
import {
  getBanners,
  getCategories,
  getFeaturedProducts,
  getFeaturedShops,
} from "@/lib/data/queries";

export default async function HomePage() {
  const [banners, categories, products, shops] = await Promise.all([
    getBanners(),
    getCategories(),
    getFeaturedProducts(),
    getFeaturedShops(),
  ]);

  const hero = banners[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[420px] overflow-hidden sm:h-[480px]">
        <div className="absolute inset-0">
          <BannerSlider banners={banners} />
          <div className="absolute inset-0 bg-gradient-to-r from-clay-900/85 to-clay-900/40" />
        </div>
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            {hero?.title ?? "Handcrafted Murti, Direct from Artisans"}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            {hero?.subtitle ?? "Search statues by material, deity and city, then send an inquiry."}
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/80">
            <span>Popular:</span>
            {["Ganesh", "Buddha", "Marble", "Brass", "Radha Krishna"].map((t) => (
              <Link
                key={t}
                href={`/search?q=${encodeURIComponent(t)}`}
                className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeading title="Shop by Category" href="/categories" linkText="View all" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeading title="Featured Statues" href="/search" linkText="Browse all" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Featured shops */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeading title="Featured Vendors" href="/vendors" linkText="All vendors" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((s) => (
            <ShopCard key={s.id} shop={s} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold">How MoortiBazaar Works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { n: "1", t: "Search & Discover", d: "Browse statues by material, deity, size and city from verified artisans." },
              { n: "2", t: "Send an Inquiry", d: "Found something? Send the vendor your requirement — no payment needed." },
              { n: "3", t: "Get a Quotation", d: "The vendor contacts you with pricing, customisation and delivery details." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-clay-100 p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-saffron-600 font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
                <p className="mt-1 text-clay-700">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ title, href, linkText }: { title: string; href: string; linkText: string }) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Link href={href} className="text-sm font-medium text-saffron-700 hover:underline">
        {linkText} →
      </Link>
    </div>
  );
}
