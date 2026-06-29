"use client";

import { useRef } from "react";

export function ProductActions({
  productName,
  productUrl,
  phone,
  whatsapp,
}: {
  productName: string;
  productUrl: string;
  phone?: string | null;
  whatsapp?: string | null;
}) {
  const shareText = `Check out this product on MoortiBazaar: ${productName}\n${productUrl}`;

  const waNumber = (whatsapp || phone || "").replace(/[^0-9]/g, "");
  const waLink = waNumber
    ? `https://wa.me/${waNumber.startsWith("91") ? waNumber : `91${waNumber}`}?text=${encodeURIComponent(shareText)}`
    : null;

  const phoneClean = (phone || "").replace(/[^0-9+]/g, "");

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: productName, text: shareText, url: productUrl });
      } catch {}
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Link copied to clipboard!");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {phoneClean && (
        <a
          href={`tel:${phoneClean}`}
          className="flex items-center gap-2 rounded-full border border-clay-200 px-4 py-2.5 text-sm font-semibold text-clay-900 transition hover:bg-clay-50"
        >
          📞 Call Now
        </a>
      )}

      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
        >
          💬 WhatsApp
        </a>
      )}

      <a
        href="#inquiry"
        className="flex items-center gap-2 rounded-full bg-saffron-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-saffron-700"
      >
        ✉️ Send Inquiry
      </a>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 rounded-full border border-clay-200 px-4 py-2.5 text-sm font-semibold text-clay-900 transition hover:bg-clay-50"
      >
        🔗 Share
      </button>
    </div>
  );
}
