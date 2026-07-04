import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { listQuotations } from "@/lib/data/vendor";
import { createQuotationFromInquiry } from "@/app/actions/vendor";
import { formatPrice } from "@/lib/utils";
import { rowTotal } from "@/lib/quotation";

const STATUS_CLS: Record<string, string> = {
  draft: "bg-clay-100 text-clay-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function QuotationsPage() {
  const { shop } = await requireVendorShop();
  const quotations = await listQuotations(shop.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-clay-900">Quotations</h1>
          <p className="mt-1 text-sm text-clay-500">{quotations.length} quotation{quotations.length !== 1 ? "s" : ""} created</p>
        </div>
        <form action={createQuotationFromInquiry}>
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-saffron-200 transition hover:shadow-xl">
            <span className="text-lg">+</span> New Quotation
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-clay-100">
        {quotations.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl">🧾</p>
            <p className="mt-3 text-base font-semibold text-clay-500">No quotations yet</p>
            <p className="mt-1 text-sm text-clay-400">Create one from an inquiry or start a blank one</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-clay-100 bg-clay-50/80">
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500">Number</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500">Customer</th>
                <th className="hidden px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500 sm:table-cell">Date</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500">Total</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-100">
              {quotations.map((q) => (
                <tr key={q.id} className="transition hover:bg-clay-50/50">
                  <td className="px-5 py-3.5">
                    <Link href={`/vendor/quotations/${q.id}`} className="font-bold text-saffron-700 transition hover:underline">
                      {q.number ?? q.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-clay-900">{q.customer_name ?? "—"}</td>
                  <td className="hidden px-5 py-3.5 text-clay-500 sm:table-cell">
                    {new Date(q.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-clay-900">{formatPrice(rowTotal(q))}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize ${STATUS_CLS[q.status] ?? STATUS_CLS.draft}`}>
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
