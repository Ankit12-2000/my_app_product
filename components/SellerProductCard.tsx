import Link from "next/link";
import type { Product } from "@/types";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon } from "@/lib/images";
import { Thumb } from "./Thumb";

// Compact card used in the "More Products From This Seller" rail: photo, name,
// price and the two contact actions inline, so a buyer can jump straight to a
// sibling product without leaving the page first.
export function SellerProductCard({ product, phone }: { product: Product; phone?: string | null }) {
  const phoneClean = (phone || "").replace(/[^0-9+]/g, "");

  return (
    <div className="flex w-[240px] shrink-0 flex-col rounded-xl border border-clay-200 bg-white p-3 transition hover:border-saffron-300 hover:shadow-sm sm:w-auto">
      <Link href={`/products/${product.slug}`} className="group">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-clay-50">
          <Thumb
            src={primaryImage(product)}
            alt={product.name}
            seed={product.slug}
            icon={deityIcon(product.deity)}
            fill
            sizes="(max-width: 640px) 45vw, 240px"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <h3 className="clamp-2 mt-3 min-h-[2.6em] text-sm font-medium leading-snug text-clay-900 group-hover:text-saffron-700">
          {product.name}
        </h3>
      </Link>

      <p className="mt-2 text-[15px] font-bold text-clay-900">
        {priceLabel(product)}
        <span className="ml-1 text-xs font-normal text-clay-500">/Piece</span>
      </p>

      <div className="mt-3 space-y-2">
        <Link
          href={`/products/${product.slug}#inquiry`}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-saffron-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-saffron-700"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
          Contact Supplier
        </Link>
        {phoneClean && (
          <a
            href={`tel:${phoneClean}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-clay-200 px-3 py-2 text-xs font-bold text-clay-800 transition hover:border-clay-300 hover:bg-clay-50"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now
          </a>
        )}
      </div>
    </div>
  );
}
