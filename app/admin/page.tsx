import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats } from "@/lib/data/admin";
import { Card, PageHeader, SectionLabel } from "@/components/admin/ui";
import {
  IconAlert,
  IconArticle,
  IconBox,
  IconChat,
  IconChevronRight,
  IconInbox,
  IconStore,
} from "@/components/admin/icons";

type Metric = {
  label: string;
  value: number;
  href: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  hint?: string;
  urgent?: boolean;
};

function MetricCard({ metric }: { metric: Metric }) {
  const { label, value, href, Icon, hint, urgent } = metric;
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between rounded-xl border border-clay-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(46,40,32,0.04)] transition hover:-translate-y-0.5 hover:border-clay-300 hover:shadow-[0_6px_16px_rgba(46,40,32,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-clay-500">{label}</span>
        <span
          className={
            urgent && value > 0
              ? "grid h-8 w-8 place-items-center rounded-lg bg-saffron-50 text-saffron-600"
              : "grid h-8 w-8 place-items-center rounded-lg bg-clay-100 text-clay-500"
          }
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <span
          className={`tabular text-[32px] font-semibold leading-none tracking-tight ${
            urgent && value > 0 ? "text-saffron-700" : "text-clay-900"
          }`}
        >
          {value}
        </span>
        {hint && <span className="pb-1 text-xs text-clay-400">{hint}</span>}
      </div>
      <IconChevronRight className="absolute bottom-4 right-4 h-4 w-4 text-clay-300 opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
}

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getAdminStats();

  const needsAction: Metric[] = [
    {
      label: "New vendor leads",
      value: stats.vendorLeadsPending,
      href: "/admin/vendor-leads?status=pending",
      Icon: IconInbox,
      hint: "awaiting review",
      urgent: true,
    },
    {
      label: "Pending vendors",
      value: stats.vendorsPending,
      href: "/admin/vendors",
      Icon: IconStore,
      hint: "awaiting approval",
      urgent: true,
    },
    {
      label: "Pending products",
      value: stats.productsPending,
      href: "/admin/products",
      Icon: IconBox,
      hint: "awaiting approval",
      urgent: true,
    },
  ];

  const overview: Metric[] = [
    { label: "Total vendors", value: stats.vendorsTotal, href: "/admin/vendors", Icon: IconStore },
    { label: "Total products", value: stats.productsTotal, href: "/admin/products", Icon: IconBox },
    { label: "Inquiries", value: stats.inquiriesTotal, href: "/admin/vendors", Icon: IconChat },
    { label: "Blog posts", value: stats.blogs, href: "/admin/blogs", Icon: IconArticle },
  ];

  const queue = [
    {
      count: stats.vendorLeadsPending,
      href: "/admin/vendor-leads?status=pending",
      noun: stats.vendorLeadsPending === 1 ? "vendor lead" : "vendor leads",
      verb: "waiting for review",
    },
    {
      count: stats.vendorsPending,
      href: "/admin/vendors",
      noun: stats.vendorsPending === 1 ? "vendor" : "vendors",
      verb: "waiting for approval",
    },
    {
      count: stats.productsPending,
      href: "/admin/products",
      noun: stats.productsPending === 1 ? "product" : "products",
      verb: "waiting for approval",
    },
  ].filter((q) => q.count > 0);

  return (
    <div className="space-y-7">
      <PageHeader
        title="Dashboard"
        description="A snapshot of everything moving through the MoortiBazaar marketplace."
      />

      {queue.length > 0 && (
        <Card className="border-saffron-200/80 bg-gradient-to-r from-saffron-50 to-white">
          <div className="flex gap-4 p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-saffron-100 text-saffron-700">
              <IconAlert className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-clay-900">Needs your attention</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-clay-700">
                {queue.map((q) => (
                  <li key={q.href} className="flex items-center gap-2">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-saffron-500" />
                    <Link
                      href={q.href}
                      className="font-semibold text-saffron-700 underline-offset-2 hover:underline"
                    >
                      {q.count} {q.noun}
                    </Link>
                    <span className="text-clay-500">{q.verb}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <section className="space-y-3">
        <SectionLabel>Approval queue</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {needsAction.map((m) => (
            <MetricCard key={m.label} metric={m} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionLabel>Marketplace overview</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overview.map((m) => (
            <MetricCard key={m.label} metric={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
