import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { listInquiries } from "@/lib/data/vendor";
import { STATUS_META, STATUS_ORDER, StatusBadge } from "@/components/vendor/StatusBadge";
import type { InquiryStatus } from "@/types";
import { cn } from "@/lib/utils";

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { shop } = await requireVendorShop();
  const { status } = await searchParams;
  const active = STATUS_ORDER.includes(status as InquiryStatus) ? (status as InquiryStatus) : undefined;
  const inquiries = await listInquiries(shop.id, active);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Inquiries</h1>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <Tab href="/vendor/inquiries" label="All" active={!active} />
        {STATUS_ORDER.map((s) => (
          <Tab
            key={s}
            href={`/vendor/inquiries?status=${s}`}
            label={STATUS_META[s].label}
            active={active === s}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-clay-100 bg-white">
        {inquiries.length === 0 ? (
          <p className="p-8 text-center text-clay-700">No inquiries in this view.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-clay-50 text-left text-clay-700">
              <tr>
                <th className="px-4 py-2 font-medium">Customer</th>
                <th className="hidden px-4 py-2 font-medium md:table-cell">Product</th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">Qty</th>
                <th className="hidden px-4 py-2 font-medium lg:table-cell">Date</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((i) => (
                <tr key={i.id} className="border-t border-clay-100 hover:bg-clay-50">
                  <td className="px-4 py-3">
                    <Link href={`/vendor/inquiries/${i.id}`} className="font-medium text-clay-900 hover:text-saffron-700">
                      {i.name}
                    </Link>
                    <div className="text-xs text-clay-700">{i.phone}{i.city ? ` · ${i.city}` : ""}</div>
                  </td>
                  <td className="hidden px-4 py-3 text-clay-700 md:table-cell">
                    {i.product?.name ?? "General inquiry"}
                  </td>
                  <td className="hidden px-4 py-3 text-clay-700 sm:table-cell">{i.quantity}</td>
                  <td className="hidden px-4 py-3 text-clay-700 lg:table-cell">
                    {new Date(i.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Tab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-medium transition",
        active ? "bg-saffron-600 text-white" : "bg-white text-clay-700 ring-1 ring-clay-100 hover:bg-saffron-50"
      )}
    >
      {label}
    </Link>
  );
}
