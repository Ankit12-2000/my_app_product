"use client";

import { useEffect, useState } from "react";

// IndiaMART keeps the price and the two contact actions permanently reachable.
// On phones the bar is always there; on desktop it slides in once the buyer has
// scrolled past the main call-to-action block.
export function ProductStickyBar({
  productName,
  price,
  unit = "Piece",
  phone,
  rating,
  reviewCount,
}: {
  productName: string;
  price: string;
  unit?: string;
  phone?: string | null;
  rating?: number;
  reviewCount?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 520);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phoneClean = (phone || "").replace(/[^0-9+]/g, "");

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-clay-200 bg-white/95 backdrop-blur transition-transform duration-300 lg:shadow-[0_-8px_24px_-16px_rgba(var(--shadow-tint),0.4)] ${
        visible ? "translate-y-0" : "translate-y-full lg:translate-y-full"
      }`}
    >
      {/* pb-[env(safe-area-inset-bottom)] keeps the buttons clear of the iOS
          home indicator, which otherwise sat on top of them. */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:gap-4 sm:py-3">
        <div className="min-w-0 flex-1">
          <p className="clamp-2 text-[13px] font-semibold leading-snug text-clay-900 sm:truncate sm:text-sm">
            {productName}
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm">
            <span className="font-bold text-saffron-700">{price}</span>
            <span className="text-xs text-clay-500">/ {unit}</span>
            {rating != null && reviewCount ? (
              <span className="text-xs text-clay-500">
                <span className="text-saffron-500">★</span> {rating.toFixed(1)} ({reviewCount})
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {phoneClean && (
            <a
              href={`tel:${phoneClean}`}
              className="rounded-lg border-2 border-blue-600 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-50 sm:px-5 sm:text-sm"
            >
              Call Now
            </a>
          )}
          <a
            href="#inquiry"
            className="rounded-lg bg-saffron-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-saffron-700 sm:px-6 sm:text-sm"
          >
            Send Enquiry
          </a>
        </div>
      </div>
    </div>
  );
}
