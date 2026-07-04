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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-clay-900">Inquiries</h1>
        <p className="mt-1 text-sm text-clay-500">Manage customer inquiries and track their status</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <Tab href="/vendor/inquiries" label="All" count={inquiries.length} active={!active} />
        {STATUS_ORDER.map((s) => (
          <Tab
            key={s}
            href={`/vendor/inquiries?status=${s}`}
            label={STATUS_META[s].label}
            active={active === s}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-clay-100">
        {inquiries.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl">📭</p>
            <p className="mt-3 text-base font-semibold text-clay-500">No inquiries in this view</p>
            <p className="mt-1 text-sm text-clay-400">Try selecting a different filter</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-clay-100 bg-clay-50/80">
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500">Customer</th>
                <th className="hidden px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500 md:table-cell">Product</th>
                <th className="hidden px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500 sm:table-cell">Qty</th>
                <th className="hidden px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500 lg:table-cell">Date</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-100">
              {inquiries.map((i) => (
                <tr key={i.id} className="transition hover:bg-clay-50/50">
                  <td className="px-5 py-3.5">
                    <Link href={`/vendor/inquiries/${i.id}`} className="font-semibold text-clay-900 transition hover:text-saffron-700">
                      {i.name}
                    </Link>
                    <div className="text-xs text-clay-500">{i.phone}{i.city ? ` · ${i.city}` : ""}</div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-clay-600 md:table-cell">
                    {i.product?.name ?? "General inquiry"}
                  </td>
                  <td className="hidden px-5 py-3.5 text-clay-500 sm:table-cell">{i.quantity}</td>
                  <td className="hidden px-5 py-3.5 text-clay-500 lg:table-cell">
                    {new Date(i.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={i.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Tab({ href, label, active, count }: { href: string; label: string; active: boolean; count?: number }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "bg-saffron-600 text-white shadow-md shadow-saffron-200"
          : "bg-white text-clay-600 ring-1 ring-clay-200 hover:bg-clay-50 hover:text-clay-900"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
          active ? "bg-white/20 text-white" : "bg-clay-100 text-clay-500"
        )}>
          {count}
        </span>
      )}
    </Link>
  );
}
