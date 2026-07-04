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
    { label: "New Inquiries", value: stats.inquiriesNew, href: "/vendor/inquiries?status=new", icon: "📨", gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-200" },
    { label: "Open Inquiries", value: stats.inquiriesOpen, href: "/vendor/inquiries", icon: "📬", gradient: "from-amber-500 to-amber-600", shadow: "shadow-amber-200" },
    { label: "Products", value: stats.products, href: "/vendor/products", icon: "🧱", gradient: "from-saffron-500 to-saffron-600", shadow: "shadow-saffron-200" },
    { label: "Quotations", value: stats.quotations, href: "/vendor/quotations", icon: "🧾", gradient: "from-purple-500 to-purple-600", shadow: "shadow-purple-200" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-clay-900 sm:text-3xl">
            Welcome back 👋
          </h1>
          <p className="mt-1 text-clay-600">
            Here&apos;s what&apos;s happening with <span className="font-semibold text-clay-900">{shop.name}</span>
          </p>
          {!shop.is_approved && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Your shop is pending admin approval
            </div>
          )}
        </div>
        <Link
          href="/vendor/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-saffron-200 transition hover:shadow-xl hover:shadow-saffron-300"
        >
          <span className="text-lg">+</span> Add Product
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-clay-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className={`absolute -right -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${c.gradient} opacity-10 transition group-hover:scale-125`} />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-clay-50 text-lg transition group-hover:bg-clay-100">
              {c.icon}
            </span>
            <p className="mt-3 text-3xl font-extrabold text-clay-900">{c.value}</p>
            <p className="mt-0.5 text-sm text-clay-500">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent inquiries */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-clay-900">Recent Inquiries</h2>
          <Link
            href="/vendor/inquiries"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-saffron-700 transition hover:bg-saffron-50"
          >
            View all →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-clay-100">
          {recent.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl">📭</p>
              <p className="mt-3 text-base font-semibold text-clay-500">No inquiries yet</p>
              <p className="mt-1 text-sm text-clay-400">Inquiries from customers will appear here</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-clay-100 bg-clay-50/80">
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500">Product</th>
                  <th className="hidden px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500 sm:table-cell">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay-100">
                {recent.slice(0, 6).map((i) => (
                  <tr key={i.id} className="transition hover:bg-clay-50/50">
                    <td className="px-5 py-3.5">
                      <Link href={`/vendor/inquiries/${i.id}`} className="font-semibold text-clay-900 transition hover:text-saffron-700">
                        {i.name}
                      </Link>
                      <div className="text-xs text-clay-500">{i.phone}</div>
                    </td>
                    <td className="px-5 py-3.5 text-clay-600">{i.product?.name ?? "General inquiry"}</td>
                    <td className="hidden px-5 py-3.5 text-clay-500 sm:table-cell">
                      {new Date(i.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
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
