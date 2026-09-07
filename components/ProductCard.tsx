import Link from "next/link";
import type { Product } from "@/types";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon } from "@/lib/images";
import { Thumb } from "./Thumb";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-clay-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-saffron-200 hover:shadow-[0_16px_40px_-16px_rgba(46,40,32,0.28)]"
    >
      <div className="relative aspect-square overflow-hidden bg-clay-50">
        <Thumb
          src={primaryImage(product)}
          alt={product.name}
          seed={product.slug}
          icon={deityIcon(product.deity)}
          caption={product.deity}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.06]"
        />

        {/* Bottom scrim keeps overlay chips legible on light and dark photos. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-clay-950/25 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
          {!product.in_stock ? (
            <span className="rounded-full bg-clay-900/85 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              Made to order
            </span>
          ) : (
            <span />
          )}
          {product.material && (
            <span className="rounded-full border border-white/60 bg-white/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-clay-700 backdrop-blur">
              {product.material.name}
            </span>
          )}
        </div>

        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-clay-900 opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View details
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h3 className="clamp-2 min-h-[2.6em] text-[15px] font-medium leading-snug text-clay-900 transition group-hover:text-saffron-700">
          {product.name}
        </h3>
        {product.shop && (
          <p className="flex items-center gap-1 overflow-hidden text-xs text-clay-500">
            <span className="truncate">{product.shop.name}</span>
            {product.city && (
              <>
                <span aria-hidden className="text-clay-300">
                  •
                </span>
                <span className="shrink-0 truncate">{product.city}</span>
              </>
            )}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="text-[15px] font-semibold tracking-tight text-saffron-700">
            {priceLabel(product)}
          </p>
          <span
            aria-hidden
            className="translate-x-1 text-saffron-600 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
