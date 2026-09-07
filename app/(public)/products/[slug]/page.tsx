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

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 pb-28 sm:py-8">
      {/* Breadcrumb */}
      <nav className="overflow-x-auto whitespace-nowrap text-xs text-clay-600 sm:text-sm">
        <Link href="/" className="hover:text-saffron-700">
          MoortiBazaar
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
      <div className="mt-4 grid gap-6 sm:mt-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[360px_minmax(0,1fr)] xl:gap-10">
        <div className="h-fit lg:sticky lg:top-20">
          <ProductGallery
            images={product.images}
            name={product.name}
            videoUrl={product.video_url}
            badge={product.in_stock ? "In stock" : "Made to order"}
          />
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold leading-snug text-clay-900 sm:text-2xl">
              {product.name}
            </h1>

            {location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-clay-600">
                <svg className="h-4 w-4 text-clay-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </p>
            )}

            <p className="mt-3 text-2xl font-bold tracking-tight text-clay-900 sm:text-3xl">
              {priceLabel(product)}
              <span className="ml-1 text-base font-normal text-clay-500">/Piece</span>
            </p>
          </div>

          <a
            href="#inquiry"
            className="flex w-full max-w-sm items-center justify-center rounded-lg bg-saffron-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-saffron-700 hover:shadow sm:text-base"
          >
            Get Latest Price
          </a>

          {/* Specification table */}
          {visibleSpecs.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-clay-200">
              <table className="w-full text-left text-sm">
                <tbody>
                  {visibleSpecs.map((s, i) => (
                    <tr key={s.label} className={i % 2 === 0 ? "bg-clay-50" : "bg-white"}>
                      <th
                        scope="row"
                        className="w-40 px-3 py-2.5 font-normal text-clay-600 sm:w-56 sm:px-4"
                      >
                        {s.label}
                      </th>
                      <td className="px-3 py-2.5 font-semibold text-clay-900 sm:px-4">
                        {s.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.description && (
            <p className="text-sm leading-relaxed text-clay-700">{product.description}</p>
          )}

          <div>
            <h2 className="text-sm font-bold text-clay-900">Key Features:</h2>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-clay-700">
              {features.map((f) => (
                <li key={f.label}>
                  <span className="font-semibold text-clay-900">{f.label}:</span> {f.text}
                </li>
              ))}
            </ul>
          </div>

          {product.shop && (
            <div className="max-w-md">
              <ProductActions
                productName={product.name}
                productUrl={`https://moortibazaar.com/products/${product.slug}`}
                phone={product.shop.phone}
                whatsapp={product.shop.whatsapp}
              />
            </div>
          )}

          {/* Seller */}
          {product.shop && (
            <Link
              href={`/shop/${product.shop.slug}`}
              className="flex max-w-2xl items-center gap-3 rounded-xl border border-clay-200 bg-white p-4 transition hover:border-saffron-300 hover:shadow-sm"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-clay-100">
                <Thumb
                  src={product.shop.logo_url}
                  alt={product.shop.name}
                  seed={product.shop.slug}
                  icon="🏪"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-clay-900">{product.shop.name}</p>
                <p className="truncate text-sm text-clay-600">
                  {product.shop.city}
                  {product.shop.state ? `, ${product.shop.state}` : ""}
                </p>
              </div>
              <div className="shrink-0">
                <StarRating rating={product.shop.rating} />
              </div>
            </Link>
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

          <div className="rounded-xl border border-clay-200 bg-white p-4 sm:p-5">
            {product.shop && (
              <InquiryForm
                shopId={product.shop.id}
                productId={product.id}
                productName={product.name}
              />
            )}
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
        rating={product.shop?.rating}
        reviewCount={product.shop?.review_count}
      />
    </div>
  );
}
