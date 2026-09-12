import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { ProductActions } from "@/components/ProductActions";
import { ProductStickyBar } from "@/components/ProductStickyBar";
import { SellerProductCard } from "@/components/SellerProductCard";
import { Thumb } from "@/components/Thumb";
import { StarRating } from "@/components/StarRating";
import {
  getProductBySlug,
  getProductsByShop,
  getRelatedProducts,
} from "@/lib/data/queries";
import { priceLabel } from "@/lib/utils";
import type { Product } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description ?? undefined,
  };
}

const inquiryAssurances = [
  "Direct contact with the artisan who carved it",
  "Custom sizes, finishes and inscriptions available",
  "Free to inquire — no obligation, no online payment",
];

// The listing form does not collect a bullet list, so the highlights block is
// derived from whatever specification fields the vendor did fill in. Anything
// missing simply drops out instead of rendering an empty bullet.
function keyFeatures(product: Product): { label: string; text: string }[] {
  const out: { label: string; text: string }[] = [];

  if (product.material) {
    out.push({
      label: `Premium ${product.material.name}`,
      text: `Carved from high-grade ${product.material.name.toLowerCase()} for a lasting finish and a pristine look.`,
    });
  }
  if (product.size || product.height_cm) {
    const dims = [product.size, product.height_cm ? `${product.height_cm} cm height` : null]
      .filter(Boolean)
      .join(" · ");
    out.push({
      label: "Dimensions",
      text: `${dims}${product.weight_kg ? `, approx. ${product.weight_kg} kg` : ""}.`,
    });
  }
  if (product.finish) {
    out.push({
      label: `${product.finish} finish`,
      text: `Hand-finished to a ${product.finish.toLowerCase()} surface by the vendor's own karigars.`,
    });
  }
  if (product.deity) {
    out.push({
      label: `${product.deity} iconography`,
      text: `Sculpted to traditional ${product.deity} proportions and attributes for daily worship or temple installation.`,
    });
  }
  out.push({
    label: "Artisanal quality",
    text: `Intricately handcrafted${product.city ? ` in ${product.city}` : ""}, with refined detailing in expression, attire and adornments.`,
  });
  if (!product.in_stock) {
    out.push({
      label: "Made to order",
      text: "Produced after confirmation — sizes, finishes and inscriptions can be customised.",
    });
  }

  return out;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [relatedProducts, shopProducts] = await Promise.all([
    getRelatedProducts(product),
    product.shop ? getProductsByShop(product.shop.id) : Promise.resolve([]),
  ]);

  const moreFromSeller = shopProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const location = [product.city ?? product.shop?.city, product.shop?.state]
    .filter(Boolean)
    .join(", ");

  const specs: { label: string; value: string | null }[] = [
    { label: "Deity", value: product.deity },
    { label: "Material", value: product.material?.name ?? null },
    { label: "Size", value: product.size },
    { label: "Height", value: product.height_cm ? `${product.height_cm} cm` : null },
    { label: "Weight", value: product.weight_kg ? `${product.weight_kg} kg` : null },
    { label: "Finish", value: product.finish },
    { label: "Category", value: product.category?.name ?? null },
    { label: "Availability", value: product.in_stock ? "In stock · ready to ship" : "Made to order" },
    { label: "Origin", value: product.city },
  ];
  const visibleSpecs = specs.filter((s) => s.value);
  const features = keyFeatures(product);

  const phoneClean = (product.shop?.phone || "").replace(/[^0-9+]/g, "");
  const waNumber = (product.shop?.whatsapp || product.shop?.phone || "").replace(/[^0-9]/g, "");
  const inquiryWaLink = waNumber
    ? `https://wa.me/${waNumber.startsWith("91") ? waNumber : `91${waNumber}`}?text=${encodeURIComponent(
        `Hi, I'm interested in ${product.name} (https://murtimarket.online/products/${product.slug}). Please share the price and more details.`
      )}`
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 pb-28 sm:py-8">
      {/* Breadcrumb */}
      <nav className="overflow-x-auto whitespace-nowrap text-xs text-clay-600 sm:text-sm">
        <Link href="/" className="hover:text-saffron-700">
          Murti Market Online
        </Link>
        <span className="px-1.5 text-clay-400">›</span>
        <Link href="/search" className="hover:text-saffron-700">
          Products
        </Link>
        {product.category && (
          <>
            <span className="px-1.5 text-clay-400">›</span>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-saffron-700"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="px-1.5 text-clay-400">›</span>
        <span className="text-clay-900">{product.name}</span>
      </nav>

      {/* Main grid: photo wall on the left, the buying panel on the right. */}
      <div className="mt-4 grid gap-6 sm:mt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-8 xl:gap-10">
        <div className="h-fit lg:sticky lg:top-20">
          <ProductGallery
            images={product.images}
            name={product.name}
            videoUrl={product.video_url}
            badge={product.in_stock ? "In stock" : "Made to order"}
          />
        </div>

        <div className="space-y-5">
          {/* Status + category chips */}
          <div className="flex flex-wrap items-center gap-2">
            {product.in_stock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
                Made to Order
              </span>
            )}
            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="rounded-full bg-clay-100 px-3 py-1 text-xs font-semibold text-clay-700 transition hover:bg-clay-200"
              >
                {product.category.name}
              </Link>
            )}
          </div>

          {/* Title, rating, location */}
          <div>
            <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-clay-900 sm:text-[28px]">
              {product.name}
            </h1>

            {product.shop && (
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <StarRating rating={product.shop.rating} count={product.shop.review_count} size="md" />
                <Link
                  href={`/shop/${product.shop.slug}#reviews`}
                  className="text-sm font-semibold text-saffron-700 hover:underline"
                >
                  Seller reviews
                </Link>
              </div>
            )}

            {location && (
              <p className="mt-2.5 flex items-center gap-1.5 text-sm text-clay-600">
                <svg className="h-4 w-4 text-clay-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </p>
            )}
          </div>

          {/* Price card */}
          <div className="rounded-2xl border border-saffron-200 bg-gradient-to-br from-saffron-50 to-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-clay-500">Price</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-clay-900 sm:text-4xl">
                  {priceLabel(product)}
                  <span className="ml-1 text-base font-medium text-clay-500">/Piece</span>
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-clay-800 shadow-sm ring-1 ring-clay-200">
                {product.in_stock ? "Verified Artisan" : "Made on Request"}
              </span>
            </div>
            <p className="mt-3 border-t border-saffron-100 pt-2.5 text-xs leading-relaxed text-clay-500">
              Price is quoted after inquiry — custom sizes, finishes &amp; inscriptions available.
            </p>
          </div>

          {/* Quick contact actions */}
          {product.shop && (
            <ProductActions
              productName={product.name}
              productUrl={`https://murtimarket.online/products/${product.slug}`}
              phone={product.shop.phone}
              whatsapp={product.shop.whatsapp}
            />
          )}

          {/* Assurance pills */}
          <ul className="grid gap-2 sm:grid-cols-3">
            {inquiryAssurances.map((a) => (
              <li
                key={a}
                className="flex items-start gap-1.5 rounded-xl bg-clay-50 px-3 py-2.5 text-[11px] font-medium leading-snug text-clay-700"
              >
                <span aria-hidden className="mt-px text-sm text-emerald-600">
                  ✓
                </span>
                {a}
              </li>
            ))}
          </ul>

          {/* Specifications */}
          {visibleSpecs.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-clay-900">Product Details</h2>
              <dl className="mt-2.5 grid grid-cols-2 gap-2">
                {visibleSpecs.map((s) => (
                  <div key={s.label} className="rounded-xl border border-clay-100 bg-white px-3 py-2.5">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-clay-500">{s.label}</dt>
                    <dd className="mt-0.5 text-sm font-bold text-clay-900">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {product.description && (
            <div>
              <h2 className="text-sm font-bold text-clay-900">About this Statue</h2>
              <p className="mt-2 text-sm leading-relaxed text-clay-700">{product.description}</p>
            </div>
          )}

          {features.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-clay-900">Key Features</h2>
              <ul className="mt-2.5 space-y-2">
                {features.map((f) => (
                  <li key={f.label} className="flex gap-2.5 rounded-xl border border-clay-100 bg-white p-3">
                    <span
                      aria-hidden
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-saffron-100 text-[11px] font-bold text-saffron-700"
                    >
                      ✓
                    </span>
                    <p className="text-sm leading-relaxed text-clay-700">
                      <span className="font-bold text-clay-900">{f.label}:</span> {f.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Seller */}
          {product.shop && (
            <div className="rounded-2xl border border-clay-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-clay-500">Sold By</p>
              <Link
                href={`/shop/${product.shop.slug}`}
                className="mt-2.5 flex items-center gap-3 rounded-xl transition hover:bg-clay-50"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-clay-100 ring-1 ring-clay-200">
                  <Thumb
                    src={product.shop.logo_url}
                    alt={product.shop.name}
                    seed={product.shop.slug}
                    icon="🏪"
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-clay-900">{product.shop.name}</span>
                  <span className="block truncate text-sm text-clay-600">
                    {product.shop.city}
                    {product.shop.state ? `, ${product.shop.state}` : ""}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-saffron-700">
                    ★ {product.shop.rating.toFixed(1)} · Visit shop →
                  </span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* More from this seller */}
      {product.shop && moreFromSeller.length > 0 && (
        <section className="mt-10 sm:mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-bold text-clay-900 sm:text-xl">
              More Products From This Seller
            </h2>
            <Link
              href={`/shop/${product.shop.slug}`}
              className="shrink-0 text-sm font-semibold text-saffron-700 hover:underline"
            >
              View All +
            </Link>
          </div>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {moreFromSeller.map((p) => (
              <SellerProductCard key={p.id} product={p} phone={product.shop?.phone} />
            ))}
          </div>
        </section>
      )}

      {/* Inquiry */}
      <section id="inquiry" className="mt-10 scroll-mt-24 sm:mt-12">
        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 className="text-xl font-bold text-clay-900 sm:text-2xl">
              Interested in this statue?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-clay-600 sm:text-base">
              Send the vendor your requirement and they&apos;ll get back to you with a personalised
              quotation including pricing, customisation and delivery. There is no online payment —
              this marketplace is inquiry based.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-clay-700 sm:text-base">
              {inquiryAssurances.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span aria-hidden className="mt-0.5 text-emerald-600">
                    ✓
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-xl border border-clay-200 bg-white">
            <div className="grid gap-2 border-b border-clay-100 p-4 sm:grid-cols-2 sm:p-5">
              {phoneClean && (
                <a
                  href={`tel:${phoneClean}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
                >
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
              )}
              {inquiryWaLink && (
                <a
                  href={inquiryWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#1faa53] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#189347] hover:shadow"
                >
                  <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Inquiry
                </a>
              )}
            </div>
            <div className="p-4 sm:p-5">
              {product.shop && (
                <InquiryForm
                  shopId={product.shop.id}
                  productId={product.id}
                  productName={product.name}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="mt-10 sm:mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-bold text-clay-900 sm:text-xl">
              Top Sellers For{" "}
              <span className="text-saffron-700">
                {product.category?.name ?? product.deity ?? "Similar Statues"}
              </span>
            </h2>
            <Link
              href="/search"
              className="shrink-0 text-sm font-semibold text-saffron-700 hover:underline"
            >
              Browse all →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <ProductStickyBar
        productName={product.name}
        price={priceLabel(product)}
        phone={product.shop?.phone}
        whatsapp={product.shop?.whatsapp}
        rating={product.shop?.rating}
        reviewCount={product.shop?.review_count}
      />
    </div>
  );
}
