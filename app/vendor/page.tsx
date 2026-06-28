import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { getVendorStats, listInquiries } from "@/lib/data/vendor";
import { StatusBadge } from "@/components/vendor/StatusBadge";

export default async function VendorDashboard() {
  const { shop } = await requireVendorShop();
  const [stats, recent] = await Promise.all([
    getVendorStats(shop.id),
    listInquiries(shop.id),
  ]);

  const cards = [
    { label: "New inquiries", value: stats.inquiriesNew, href: "/vendor/inquiries?status=new", accent: "text-blue-600" },
    { label: "Open inquiries", value: stats.inquiriesOpen, href: "/vendor/inquiries", accent: "text-amber-600" },
    { label: "Products", value: stats.products, href: "/vendor/products", accent: "text-saffron-700" },
    { label: "Quotations", value: stats.quotations, href: "/vendor/quotations", accent: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-clay-700">
            Welcome back, {shop.name}.{" "}
            {!shop.is_approved && (
              <span className="text-amber-700">Your shop is pending admin approval.</span>
            )}
          </p>
        </div>
        <Link
          href="/vendor/products/new"
          className="rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700"
        >
          + Add product
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-clay-100 bg-white p-5 transition hover:shadow"
          >
            <p className="text-sm text-clay-700">{c.label}</p>
            <p className={`mt-1 text-3xl font-bold ${c.accent}`}>{c.value}</p>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent inquiries</h2>
          <Link href="/vendor/inquiries" className="text-sm font-medium text-saffron-700 hover:underline">
            View all →
          </Link>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-clay-100 bg-white">
          {recent.length === 0 ? (
            <p className="p-6 text-center text-clay-700">No inquiries yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-clay-50 text-left text-clay-700">
                <tr>
                  <th className="px-4 py-2 font-medium">Customer</th>
                  <th className="px-4 py-2 font-medium">Product</th>
                  <th className="hidden px-4 py-2 font-medium sm:table-cell">Date</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.slice(0, 6).map((i) => (
                  <tr key={i.id} className="border-t border-clay-100 hover:bg-clay-50">
                    <td className="px-4 py-3">
                      <Link href={`/vendor/inquiries/${i.id}`} className="font-medium text-clay-900 hover:text-saffron-700">
                        {i.name}
                      </Link>
                      <div className="text-xs text-clay-700">{i.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-clay-700">{i.product?.name ?? "General inquiry"}</td>
                    <td className="hidden px-4 py-3 text-clay-700 sm:table-cell">
                      {new Date(i.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={i.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
