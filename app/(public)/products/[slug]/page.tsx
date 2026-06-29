import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { ProductActions } from "@/components/ProductActions";
import { Thumb } from "@/components/Thumb";
import { StarRating } from "@/components/StarRating";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/queries";
import { priceLabel } from "@/lib/utils";

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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product);

  const specs: { label: string; value: string | null }[] = [
    { label: "Deity", value: product.deity },
    { label: "Material", value: product.material?.name ?? null },
    { label: "Finish", value: product.finish },
    { label: "Size", value: product.size },
    { label: "Height", value: product.height_cm ? `${product.height_cm} cm` : null },
    { label: "Weight", value: product.weight_kg ? `${product.weight_kg} kg` : null },
    { label: "City", value: product.city },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <nav className="overflow-x-auto text-xs text-clay-600 sm:text-sm">
        <Link href="/search" className="hover:text-saffron-600">Products</Link>
        {product.category && (
          <>
            {" / "}
            <Link href={`/categories/${product.category.slug}`} className="hover:text-saffron-600">
              {product.category.name}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-clay-900">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="mt-4 grid gap-6 sm:mt-6 sm:gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Details */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
            <p className="mt-2 text-xl font-semibold text-saffron-700 sm:text-2xl">{priceLabel(product)}</p>
            <p className="mt-1 text-sm text-clay-600">
              {product.in_stock ? "In stock · ready to ship" : "Made to order"}
            </p>
          </div>

          {/* Action buttons - top */}
          {product.shop && (
            <ProductActions
              productName={product.name}
              productUrl={`https://moortibazaar.com/products/${product.slug}`}
              phone={product.shop.phone}
              whatsapp={product.shop.whatsapp}
            />
          )}

          {product.description && (
            <p className="text-sm leading-relaxed text-clay-600 sm:text-base">{product.description}</p>
          )}

          {/* Specifications */}
          <div className="rounded-2xl border border-clay-100 bg-white p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-clay-500">Specifications</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-6">
              {specs
                .filter((s) => s.value)
                .map((s) => (
                  <div key={s.label}>
                    <dt className="text-[11px] uppercase tracking-wide text-clay-500 sm:text-xs">{s.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-clay-900">{s.value}</dd>
                  </div>
                ))}
            </dl>
          </div>

          {product.video_url && (
            <a
              href={product.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-saffron-700 hover:underline"
            >
              ▶ Watch product video
            </a>
          )}

          {/* Seller card */}
          {product.shop && (
            <Link
              href={`/vendors/${product.shop.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-clay-100 bg-white p-4 transition hover:shadow"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-clay-100 text-lg sm:h-12 sm:w-12 sm:text-xl">
                <Thumb src={product.shop.logo_url} alt={product.shop.name} seed={product.shop.slug} icon="🏪" width={48} height={48} className="object-cover" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold">{product.shop.name}</p>
                <p className="text-xs text-clay-600 sm:text-sm">
                  {product.shop.city}{product.shop.state ? `, ${product.shop.state}` : ""}
                </p>
              </div>
              <StarRating rating={product.shop.rating} />
            </Link>
          )}
        </div>
      </div>

      {/* Inquiry section */}
      <section id="inquiry" className="mt-10 sm:mt-12">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Interested in this statue?</h2>
            <p className="mt-2 text-sm text-clay-600 sm:text-base">
              Send the vendor your requirement and they&apos;ll get back to you with a personalised
              quotation including pricing, customisation and delivery. There is no online payment —
              this marketplace is inquiry based.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-clay-600 sm:text-base">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Direct contact with the artisan
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Custom sizes &amp; finishes available
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Free to inquire, no obligation
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-clay-100 bg-white p-4 sm:p-5">
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

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-10 sm:mt-12">
          <h2 className="text-xl font-bold sm:text-2xl">Related Products</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
