import Link from "next/link";
import type { Shop } from "@/types";
import { StarRating } from "./StarRating";
import { Thumb } from "./Thumb";

export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link
      href={`/shop/${shop.slug}`}
      className="group overflow-hidden rounded-2xl border border-clay-100 bg-white transition hover:shadow-lg"
    >
      <div className="relative h-28 overflow-hidden bg-clay-100">
        <Thumb src={shop.banner_url} alt="" seed={`${shop.slug}-banner`} icon={null} fill sizes="33vw" className="object-cover" />
      </div>
      <div className="px-4 pb-4">
        <div className="relative -mt-8 mb-2 inline-grid h-16 w-16 place-items-center overflow-hidden rounded-full border-4 border-white bg-clay-100">
          <Thumb src={shop.logo_url} alt={shop.name} seed={shop.slug} icon="🏪" width={64} height={64} className="object-cover" />
        </div>
        <h3 className="font-semibold text-clay-900 group-hover:text-saffron-700">{shop.name}</h3>
        <p className="text-sm text-clay-700">
          {shop.city}, {shop.state}
        </p>
        {shop.tagline && <p className="clamp-2 mt-1 text-sm text-clay-700/80">{shop.tagline}</p>}
        <div className="mt-2">
          <StarRating rating={shop.rating} count={shop.review_count} />
        </div>
      </div>
    </Link>
  );
}
