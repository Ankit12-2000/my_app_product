import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { getVendorStats, listRecentInquiries } from "@/lib/data/vendor";
import { StatusBadge } from "@/components/vendor/StatusBadge";
import { StatTile } from "@/components/admin/ui";
import { IconBox, IconChat, IconClipboard, IconInbox, IconPlus } from "@/components/admin/icons";

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

export default async function VendorDashboard() {
  const { shop } = await requireVendorShop();
  const [stats, recent] = await Promise.all([
    getVendorStats(shop.id),
    listRecentInquiries(shop.id, 6),
  ]);

  const cards = [
    {
      label: "New inquiries",
      value: stats.inquiriesNew,
      href: "/vendor/inquiries?status=new",
      icon: <IconInbox className="h-[18px] w-[18px]" />,
      tone: "urgent" as const,
    },
    {
      label: "Open inquiries",
      value: stats.inquiriesOpen,
      href: "/vendor/inquiries",
      icon: <IconChat className="h-[18px] w-[18px]" />,
      hint: `${stats.inquiriesTotal} all time`,
    },
    {
      label: "Products",
      value: stats.products,
      href: "/vendor/products",
      icon: <IconBox className="h-[18px] w-[18px]" />,
    },
    {
      label: "Quotations",
      value: stats.quotations,
      href: "/vendor/quotations",
      icon: <IconClipboard className="h-[18px] w-[18px]" />,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold text-clay-900 sm:text-3xl">Welcome back 👋</h1>
          <p className="mt-1 text-sm text-clay-600 sm:text-base">
            Here&apos;s what&apos;s happening with{" "}
            <span className="font-semibold text-clay-900">{shop.name}</span>
          </p>
          {!shop.is_approved && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              Your shop is pending admin approval
            </div>
          )}
        </div>
        <Link
          href="/vendor/products/new"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-saffron-600 px-5 text-sm font-bold text-white shadow-sm transition hover:shadow-md sm:w-auto"
        >
          <IconPlus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <StatTile key={c.label} {...c} />
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-clay-900">Recent Inquiries</h2>
          <Link
            href="/vendor/inquiries"
            className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-saffron-700 transition hover:bg-saffron-50"
          >
            View all →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-clay-100">
          {recent.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-4xl">📭</p>
              <p className="mt-3 text-base font-semibold text-clay-600">No inquiries yet</p>
              <p className="mt-1 text-sm text-clay-400">Inquiries from customers will appear here</p>
            </div>
          ) : (
            <>
              {/* Table on desktop… */}
              <div className="admin-scroll hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-clay-100 bg-clay-50/80">
                      <Th>Customer</Th>
                      <Th>Product</Th>
                      <Th className="hidden md:table-cell">Date</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-clay-100">
                    {recent.map((i) => (
                      <tr key={i.id} className="transition hover:bg-clay-50/50">
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/vendor/inquiries/${i.id}`}
                            className="font-semibold text-clay-900 transition hover:text-saffron-700"
                          >
                            {i.name}
                          </Link>
                          <div className="tabular text-xs text-clay-500">{i.phone}</div>
                        </td>
                        <td className="max-w-[220px] truncate px-5 py-3.5 text-clay-600">
                          {i.product?.name ?? "General inquiry"}
                        </td>
                        <td className="hidden whitespace-nowrap px-5 py-3.5 text-clay-500 md:table-cell">
                          {dateFmt.format(new Date(i.created_at))}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={i.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* …cards on a phone, where four columns had nowhere to go. */}
              <ul className="divide-y divide-clay-100 sm:hidden">
                {recent.map((i) => (
                  <li key={i.id}>
                    <Link href={`/vendor/inquiries/${i.id}`} className="block p-4 transition active:bg-clay-50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-clay-900">{i.name}</p>
                          <p className="tabular mt-0.5 text-xs text-clay-500">{i.phone}</p>
                        </div>
                        <StatusBadge status={i.status} />
                      </div>
                      <p className="mt-2 truncate text-sm text-clay-600">
                        {i.product?.name ?? "General inquiry"}
                        <span className="text-clay-400"> · {dateFmt.format(new Date(i.created_at))}</span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500 ${className}`}
    >
      {children}
    </th>
  );
}
