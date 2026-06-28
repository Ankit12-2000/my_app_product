import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  {
    q: "How do I buy a statue on MoortiBazaar?",
    a: "MoortiBazaar is an inquiry-based marketplace — there is no online checkout. Find a statue you like, send an inquiry to the vendor, and they will contact you with a quotation covering price, customisation and delivery.",
  },
  {
    q: "Is there any payment on the website?",
    a: "No. You never pay through the website. All pricing and payment is handled directly between you and the vendor after they respond to your inquiry.",
  },
  {
    q: "Can I request a custom size or finish?",
    a: "Yes. Mention your requirement in the inquiry form — most vendors offer custom sizes, finishes and deities.",
  },
  {
    q: "Are the vendors verified?",
    a: "Vendors marked “Verified” have had their business documents reviewed by our team before being approved on the marketplace.",
  },
  {
    q: "How do I become a vendor?",
    a: "Click “Become a Vendor”, register your business and upload your documents. Once approved you get your own mini-website to showcase products and receive inquiries.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
      <div className="mt-6 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-clay-100 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium marker:hidden">
              <span className="flex items-center justify-between">
                {f.q}
                <span className="text-saffron-600 transition group-open:rotate-45">＋</span>
              </span>
            </summary>
            <p className="mt-2 text-clay-700">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
