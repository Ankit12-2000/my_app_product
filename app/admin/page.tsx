import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats } from "@/lib/data/admin";
import { Card, PageHeader, SectionLabel, StatTile } from "@/components/admin/ui";
import {
  IconAlert,
  IconArticle,
  IconBox,
  IconChat,
  IconChevronRight,
  IconInbox,
  IconStar,
  IconStore,
  IconTags,
} from "@/components/admin/icons";

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getAdminStats();

  const approvalQueue = [
    {
      label: "New vendor leads",
      value: stats.vendorLeadsPending,
      href: "/admin/vendor-leads?status=pending",
      icon: <IconInbox className="h-[18px] w-[18px]" />,
      hint: "awaiting review",
    },
    {
      label: "Pending vendors",
      value: stats.vendorsPending,
      href: "/admin/vendors?status=pending",
      icon: <IconStore className="h-[18px] w-[18px]" />,
      hint: "awaiting approval",
    },
    {
      label: "Pending products",
      value: stats.productsPending,
      href: "/admin/products?status=pending",
      icon: <IconBox className="h-[18px] w-[18px]" />,
      hint: "awaiting approval",
    },
    {
      label: "New inquiries",
      value: stats.inquiriesNew,
      href: "/admin/inquiries?status=new",
      icon: <IconChat className="h-[18px] w-[18px]" />,
      hint: "not yet actioned",
    },
  ];

  const overview = [
    {
      label: "Total vendors",
      value: stats.vendorsTotal,
      href: "/admin/vendors",
      icon: <IconStore className="h-[18px] w-[18px]" />,
      hint: `${stats.vendorsTotal - stats.vendorsPending} approved`,
    },
    {
      label: "Total products",
      value: stats.productsTotal,
      href: "/admin/products",
      icon: <IconBox className="h-[18px] w-[18px]" />,
      hint: `${stats.productsTotal - stats.productsPending} live`,
    },
    {
      label: "Featured products",
      value: stats.productsFeatured,
      href: "/admin/products?status=featured",
      icon: <IconStar className="h-[18px] w-[18px]" />,
      hint: "on the homepage",
    },
    {
      label: "All inquiries",
      value: stats.inquiriesTotal,
      href: "/admin/inquiries",
      icon: <IconChat className="h-[18px] w-[18px]" />,
    },
    {
      label: "Blog posts",
      value: stats.blogs,
      href: "/admin/blogs",
      icon: <IconArticle className="h-[18px] w-[18px]" />,
    },
  ];

  // Only the queues that actually have something in them get called out.
  const attention = approvalQueue.filter((q) => q.value > 0);

  const shortcuts = [
    { label: "Add a blog post", href: "/admin/blogs/new", icon: <IconArticle className="h-4 w-4" /> },
    { label: "Manage banners", href: "/admin/banners", icon: <IconTags className="h-4 w-4" /> },
    { label: "Categories & materials", href: "/admin/taxonomy", icon: <IconTags className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 sm:space-y-7">
      <PageHeader
        title="Dashboard"
        description="A snapshot of everything moving through the MoortiBazaar marketplace."
      />

      {attention.length > 0 ? (
        <Card className="border-saffron-200/80 bg-gradient-to-r from-saffron-50 to-white">
          <div className="flex gap-3 p-4 sm:gap-4 sm:p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-saffron-100 text-saffron-700">
              <IconAlert className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-clay-900">Needs your attention</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-clay-700">
                {attention.map((q) => (
                  <li key={q.href} className="flex items-center gap-2">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-saffron-500" />
                    <Link
                      href={q.href}
                      className="font-semibold text-saffron-700 underline-offset-2 hover:underline"
                    >
                      {q.value}
                    </Link>
                    <span className="min-w-0 truncate text-clay-500">
                      {q.label.toLowerCase()} {q.hint}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3 p-4 sm:p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
              <IconChevronRight className="h-[18px] w-[18px]" />
            </span>
            <p className="text-sm font-medium text-clay-800">
              Every queue is clear — nothing is waiting on you right now.
            </p>
          </div>
        </Card>
      )}

      <section className="space-y-3">
        <SectionLabel>Approval queue</SectionLabel>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {approvalQueue.map((m) => (
            <StatTile key={m.label} {...m} tone="urgent" />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionLabel>Marketplace overview</SectionLabel>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {overview.map((m) => (
            <StatTile key={m.label} {...m} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionLabel>Shortcuts</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {shortcuts.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-clay-200 bg-white px-3.5 text-sm font-medium text-clay-700 transition hover:border-clay-300 hover:bg-clay-50 hover:text-clay-900"
            >
              <span className="text-clay-400">{s.icon}</span>
              {s.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
