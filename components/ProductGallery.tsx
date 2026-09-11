"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProductImage } from "@/types";
import { cn } from "@/lib/utils";
import { Thumb } from "./Thumb";

type Tile =
  | { kind: "image"; key: string; url?: string | null; alt: string }
  | { kind: "video"; key: string; url?: string | null; alt: string; href: string };

// Turns a YouTube/Vimeo watch link into an embeddable one so the video can play
// inside the lightbox. Anything else falls back to opening in a new tab.
function embedUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

// How many small thumbnails sit under the lead tiles before the rest are
// folded behind "View More Photos".
const THUMB_ROW = 4;

export function ProductGallery({
  images,
  name,
  videoUrl,
  badge,
}: {
  images: ProductImage[];
  name: string;
  videoUrl?: string | null;
  /** Small chip shown over the first tile, e.g. stock status. */
  badge?: string | null;
}) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  const tiles: Tile[] = sorted.map((img, i) => ({
    kind: "image",
    key: img.id ?? `img-${i}`,
    url: img.url,
    alt: img.alt ?? name,
  }));

  // The video sits second, exactly where IndiaMART puts it, using the next
  // photograph as its poster frame.
  if (videoUrl) {
    tiles.splice(1, 0, {
      kind: "video",
      key: "video",
      url: sorted[1]?.url ?? sorted[0]?.url,
      alt: `${name} video`,
      href: videoUrl,
    });
  }
  if (tiles.length === 0) {
    tiles.push({ kind: "image", key: "empty", url: null, alt: name });
  }

  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // A lone photo fills the whole frame. From two upwards the leading tiles stay
  // large and everything after them drops into a small thumbnail strip, so a
  // listing with four photos reads as "one big + three small" rather than four
  // half-empty boxes.
  const heroCount = tiles.length === 1 ? 1 : 2;
  const heroes = tiles.slice(0, heroCount);
  const rest = tiles.slice(heroCount);
  const visibleRest = expanded ? rest : rest.slice(0, THUMB_ROW);
  const hidden = rest.length - visibleRest.length;

  const step = useCallback(
    (delta: number) =>
      setLightbox((i) => (i == null ? i : (i + delta + tiles.length) % tiles.length)),
    [tiles.length]
  );

  useEffect(() => {
    if (lightbox == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, step]);

  const active = lightbox == null ? null : tiles[lightbox];
  const activeEmbed = active?.kind === "video" ? embedUrl(active.href) : null;

  const renderTile = (tile: Tile, index: number, variant: "hero" | "thumb") => (
    <button
      key={tile.key}
      type="button"
      onClick={() => setLightbox(index)}
      aria-label={tile.kind === "video" ? "Play product video" : `View photo ${index + 1}`}
      className={cn(
        "group relative aspect-square overflow-hidden border border-clay-200 bg-white transition",
        "hover:border-saffron-300 hover:shadow-sm",
        variant === "hero" ? "rounded-xl" : "rounded-lg"
      )}
    >
      <Thumb
        src={tile.url}
        alt={tile.alt}
        seed={`${name}-${tile.key}`}
        icon="🕉️"
        caption={variant === "hero" && index === 0 ? name : null}
        fill
        priority={index === 0}
        sizes={
          variant === "hero"
            ? heroCount === 1
              ? "(max-width: 1024px) 100vw, 640px"
              : "(max-width: 1024px) 50vw, 320px"
            : "110px"
        }
        className="object-cover"
      />

      {index === 0 && badge && (
        <span className="absolute left-2 top-2 rounded-md border border-clay-200 bg-white/95 px-2 py-1 text-[11px] font-semibold text-clay-700 shadow-sm backdrop-blur">
          {badge}
        </span>
      )}

      {tile.kind === "video" && (
        <span className="absolute inset-0 grid place-items-center bg-clay-950/10 transition group-hover:bg-clay-950/20">
          <span
            className={cn(
              "grid place-items-center rounded-full bg-white/85 shadow-md ring-1 ring-clay-200 transition group-hover:scale-105",
              variant === "hero" ? "h-14 w-14" : "h-8 w-8"
            )}
          >
            <svg
              className={cn("ml-0.5 text-clay-900", variant === "hero" ? "h-6 w-6" : "h-3.5 w-3.5")}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      )}
    </button>
  );

  return (
    <div>
      <div
        className={cn(
          "grid gap-2 sm:gap-3",
          heroCount === 1 ? "grid-cols-1" : "grid-cols-2"
        )}
      >
        {heroes.map((tile, i) => renderTile(tile, i, "hero"))}
      </div>

      {rest.length > 0 && (
        <div className="relative mt-2 sm:mt-3">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {visibleRest.map((tile, i) => renderTile(tile, heroCount + i, "thumb"))}
          </div>

          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-lg border border-saffron-300 bg-white/95 px-3 py-2 text-xs font-semibold text-saffron-700 shadow-md backdrop-blur transition hover:bg-saffron-50 sm:px-4 sm:text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              View More Photos
              <span className="text-saffron-500">({hidden})</span>
            </button>
          )}
        </div>
      )}

      {expanded && rest.length > THUMB_ROW && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mx-auto mt-3 flex items-center gap-1.5 rounded-lg border border-clay-200 bg-white px-4 py-2 text-sm font-semibold text-clay-700 transition hover:bg-clay-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          Show fewer photos
        </button>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-clay-950/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-medium">
              {(lightbox ?? 0) + 1} / {tiles.length}
            </span>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="rounded-full p-2 text-2xl leading-none transition hover:bg-white/10"
            >
              ×
            </button>
          </div>

          <div
            className="relative mx-auto flex w-full max-w-4xl flex-1 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeEmbed ? (
              <iframe
                src={activeEmbed}
                title={active.alt}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full rounded-xl bg-black"
              />
            ) : active.kind === "video" ? (
              <a
                href={active.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-clay-900"
              >
                ▶ Open product video
              </a>
            ) : (
              <div className="relative aspect-square w-full max-h-full">
                <Thumb
                  src={active.url}
                  alt={active.alt}
                  seed={`${name}-${active.key}`}
                  icon="🕉️"
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            )}

            {tiles.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous"
                  className="absolute left-0 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-clay-900 shadow transition hover:bg-white"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next"
                  className="absolute right-0 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-clay-900 shadow transition hover:bg-white"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
