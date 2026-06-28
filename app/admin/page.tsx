import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats } from "@/lib/data/admin";

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getAdminStats();

  const cards = [
    { label: "New vendor leads", value: stats.vendorLeadsPending, href: "/admin/vendor-leads", accent: "text-blue-600" },
    { label: "Pending vendors", value: stats.vendorsPending, href: "/admin/vendors", accent: "text-amber-600" },
    { label: "Pending products", value: stats.productsPending, href: "/admin/products", accent: "text-amber-600" },
    { label: "Total vendors", value: stats.vendorsTotal, href: "/admin/vendors", accent: "text-clay-900" },
    { label: "Total products", value: stats.productsTotal, href: "/admin/products", accent: "text-clay-900" },
    { label: "Inquiries", value: stats.inquiriesTotal, href: "/admin/vendors", accent: "text-clay-900" },
    { label: "Blog posts", value: stats.blogs, href: "/admin/blogs", accent: "text-clay-900" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-clay-100 bg-white p-5 transition hover:shadow">
            <p className="text-sm text-clay-700">{c.label}</p>
            <p className={`mt-1 text-3xl font-bold ${c.accent}`}>{c.value}</p>
          </Link>
        ))}
      </div>

      {(stats.vendorLeadsPending > 0 || stats.vendorsPending > 0 || stats.productsPending > 0) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-800">Needs your attention</h2>
          <ul className="mt-2 space-y-1 text-sm text-amber-800">
            {stats.vendorLeadsPending > 0 && (
              <li>
                <Link href="/admin/vendor-leads" className="font-medium underline">
                  {stats.vendorLeadsPending} vendor lead(s)
                </Link>{" "}
                waiting for review.
              </li>
            )}
            {stats.vendorsPending > 0 && (
              <li>
                <Link href="/admin/vendors" className="font-medium underline">
                  {stats.vendorsPending} vendor(s)
                </Link>{" "}
                waiting for approval.
              </li>
            )}
            {stats.productsPending > 0 && (
              <li>
                <Link href="/admin/products" className="font-medium underline">
                  {stats.productsPending} product(s)
                </Link>{" "}
                waiting for approval.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
