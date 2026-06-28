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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quotations</h1>
        <form action={createQuotationFromInquiry}>
          <button className="rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700">
            + New quotation
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-clay-100 bg-white">
        {quotations.length === 0 ? (
          <p className="p-8 text-center text-clay-700">
            No quotations yet. Create one from an inquiry or start a blank one.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-clay-50 text-left text-clay-700">
              <tr>
                <th className="px-4 py-2 font-medium">Number</th>
                <th className="px-4 py-2 font-medium">Customer</th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">Date</th>
                <th className="px-4 py-2 font-medium">Total</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="border-t border-clay-100 hover:bg-clay-50">
                  <td className="px-4 py-3">
                    <Link href={`/vendor/quotations/${q.id}`} className="font-medium text-saffron-700 hover:underline">
                      {q.number ?? q.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-clay-900">{q.customer_name ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-clay-700 sm:table-cell">
                    {new Date(q.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(rowTotal(q))}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_CLS[q.status] ?? STATUS_CLS.draft}`}>
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
