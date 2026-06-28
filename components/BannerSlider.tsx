"use client";

import { useEffect, useState } from "react";
import type { Banner } from "@/types";
import { Thumb } from "./Thumb";

export function BannerSlider({ banners }: { banners: Banner[] }) {
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
      {banners.map((b, i) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(${(i - current) * 100}%)` }}
        >
          <Thumb
            src={b.image_url}
            alt={b.title}
            seed={b.id}
            icon={null}
            fill
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
