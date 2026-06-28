import Link from "next/link";
import type { Product } from "@/types";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon } from "@/lib/images";
import { Thumb } from "./Thumb";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-clay-100 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-clay-100">
        <Thumb
          src={primaryImage(product)}
          alt={product.name}
          seed={product.slug}
          icon={deityIcon(product.deity)}
          caption={product.deity}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {!product.in_stock && (
          <span className="absolute left-2 top-2 rounded-full bg-clay-900/80 px-2 py-1 text-xs font-medium text-white">
            Made to order
          </span>
        )}
        {product.material && (
          <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-clay-700">
            {product.material.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="clamp-2 font-medium leading-snug text-clay-900 group-hover:text-saffron-700">
          {product.name}
        </h3>
        {product.shop && (
          <p className="text-xs text-clay-700">
            {product.shop.name} · {product.city}
          </p>
        )}
        <p className="mt-auto pt-1 font-semibold text-saffron-700">{priceLabel(product)}</p>
      </div>
    </Link>
  );
}
