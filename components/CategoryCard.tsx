import Link from "next/link";
import type { Category } from "@/types";
import { Thumb } from "./Thumb";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-clay-100"
    >
      <Thumb
        src={category.image_url}
        alt={category.name}
        seed={category.slug}
        icon="🛕"
        fill
        sizes="(max-width: 768px) 50vw, 16vw"
        className="object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-clay-900/80 via-clay-900/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-3 text-white">
        <h3 className="font-semibold leading-tight">{category.name}</h3>
        {category.description && <p className="clamp-2 text-xs text-white/80">{category.description}</p>}
      </div>
    </Link>
  );
}
