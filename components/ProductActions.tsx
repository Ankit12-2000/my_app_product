"use client";

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
    <div className="rounded-2xl border border-clay-100 bg-white p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {phoneClean && (
          <a
            href={`tel:${phoneClean}`}
            className="group flex flex-col items-center gap-1.5 rounded-xl border border-clay-100 bg-clay-50 px-3 py-3 text-center transition hover:border-blue-200 hover:bg-blue-50"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-lg transition group-hover:bg-blue-200">
              📞
            </span>
            <span className="text-xs font-semibold text-clay-900">Call Now</span>
          </a>
        )}

        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-1.5 rounded-xl border border-clay-100 bg-clay-50 px-3 py-3 text-center transition hover:border-green-200 hover:bg-green-50"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-green-100 text-lg transition group-hover:bg-green-200">
              💬
            </span>
            <span className="text-xs font-semibold text-clay-900">WhatsApp</span>
          </a>
        )}

        <a
          href="#inquiry"
          className="group flex flex-col items-center gap-1.5 rounded-xl border border-clay-100 bg-clay-50 px-3 py-3 text-center transition hover:border-saffron-200 hover:bg-saffron-50"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-saffron-100 text-lg transition group-hover:bg-saffron-200">
            ✉️
          </span>
          <span className="text-xs font-semibold text-clay-900">Inquiry</span>
        </a>

        <button
          onClick={handleShare}
          className="group flex flex-col items-center gap-1.5 rounded-xl border border-clay-100 bg-clay-50 px-3 py-3 text-center transition hover:border-purple-200 hover:bg-purple-50"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-purple-100 text-lg transition group-hover:bg-purple-200">
            🔗
          </span>
          <span className="text-xs font-semibold text-clay-900">Share</span>
        </button>
      </div>
    </div>
  );
}
