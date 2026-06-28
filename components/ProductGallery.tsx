"use client";

import { useState } from "react";
import type { ProductImage } from "@/types";
import { cn } from "@/lib/utils";
import { Thumb } from "./Thumb";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(0);
  const current = sorted[active] ?? sorted[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-clay-100">
        {current && (
          <Thumb
            src={current.url}
            alt={current.alt ?? name}
            seed={`${name}-${active}`}
            icon="🕉️"
            caption={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        )}
        {sorted.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-clay-900/60 px-2.5 py-1 text-xs font-medium text-white">
            {active + 1} / {sorted.length}
          </div>
        )}
      </div>
      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 sm:h-20 sm:w-20",
                i === active ? "border-saffron-500" : "border-transparent"
              )}
            >
              <Thumb src={img.url} alt="" seed={`${name}-${i}`} icon="🕉️" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
