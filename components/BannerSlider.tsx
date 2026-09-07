"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Banner } from "@/types";
import { cn } from "@/lib/utils";
import { Thumb } from "./Thumb";

export function BannerSlider({
  banners,
  showDots = false,
  fit = "cover",
}: {
  banners: Banner[];
  showDots?: boolean;
  /** Promo artwork carries its own lettering, so "contain" keeps it whole. */
  fit?: "cover" | "contain";
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {banners.map((b, i) => {
        const slide = (
          <Thumb
            src={b.image_url}
            alt={b.title}
            seed={b.id}
            icon={null}
            fill
            priority={i === 0}
            className={fit === "contain" ? "object-contain" : "object-cover"}
          />
        );
        return (
          <div
            key={b.id}
            aria-hidden={i !== current}
            className="absolute inset-0 transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(${(i - current) * 100}%)` }}
          >
            {b.link_url ? (
              <Link href={b.link_url} className="block h-full w-full" tabIndex={i === current ? 0 : -1}>
                {slide}
              </Link>
            ) : (
              slide
            )}
          </div>
        );
      })}

      {showDots && banners.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show banner ${i + 1}: ${b.title}`}
              aria-current={i === current}
              className={cn(
                "h-2 rounded-full border border-white/50 transition-all",
                i === current ? "w-6 bg-saffron-400" : "w-2 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
