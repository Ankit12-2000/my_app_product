import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { listInquiriesPage, vendorInquiryStatusCounts, type VendorInquiry } from "@/lib/data/vendor";
import { parsePage } from "@/lib/data/paging";
import { STATUS_META, STATUS_ORDER, StatusBadge } from "@/components/vendor/StatusBadge";
import { FilterTabs, SearchInput, Toolbar } from "@/components/admin/Toolbar";
import { PageNav } from "@/components/admin/PageNav";
import { Avatar } from "@/components/admin/ui";
import { IconChevronRight } from "@/components/admin/icons";
import type { InquiryStatus } from "@/types";

// IndiaMART-style Lead Manager: an inbox of rich lead cards with the buyer's
// details up front and Call / WhatsApp / View actions on every card.

function relativeTime(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const digits = (s: string) => s.replace(/[^0-9]/g, "");

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const { shop } = await requireVendorShop();
  const sp = await searchParams;
  const status = STATUS_ORDER.includes(sp.status as InquiryStatus)
    ? (sp.status as InquiryStatus)
    : undefined;

  const [{ rows, total, page, pageCount, pageSize }, counts] = await Promise.all([
    listInquiriesPage({ shopId: shop.id, page: parsePage(sp.page), q: sp.q, status }),
    vendorInquiryStatusCounts(shop.id),
  ]);

  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const tabs = [
    { value: "all", label: "All", count: allCount },
    ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].label, count: counts[s] ?? 0 })),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-clay-900">Lead Manager</h1>
          <p className="mt-1 text-sm text-clay-500">
            {allCount} total lead{allCount !== 1 ? "s" : ""}
            {(counts.new ?? 0) > 0 && (
              <span className="ml-1 font-medium text-saffron-700">· {counts.new} new</span>
            )}
          </p>
        </div>
      </div>

      <Toolbar>
        <SearchInput placeholder="Search buyer, phone, email or city…" />
        <div className="w-full sm:w-auto">
          <FilterTabs tabs={tabs} />
        </div>
      </Toolbar>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-clay-200/80 bg-white px-6 py-16 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-3 text-base font-semibold text-clay-700">
            {sp.q ? `Nothing matches “${sp.q}”` : "No leads in this view"}
          </p>
          <p className="mt-1 text-sm text-clay-400">New buyer inquiries will land here.</p>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {rows.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </ul>
          <div className="overflow-hidden rounded-2xl border border-clay-200/80 bg-white">
            <PageNav page={page} pageCount={pageCount} total={total} pageSize={pageSize} label="leads" />
          </div>
        </>
      )}
    </div>
  );
}

function LeadCard({ lead }: { lead: VendorInquiry }) {
  const isNew = lead.status === "new";
  const phone = digits(lead.phone);
  const meta = [lead.city, `Qty ${lead.quantity}`].filter(Boolean);

  return (
    <li
      className={`relative overflow-hidden rounded-2xl border bg-white transition hover:border-clay-300 ${
        isNew ? "border-saffron-200" : "border-clay-200/80"
      }`}
    >
      {/* New-lead accent rail */}
      {isNew && <span className="absolute inset-y-0 left-0 w-1 bg-saffron-500" />}

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Avatar name={lead.name} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link
                href={`/vendor/inquiries/${lead.id}`}
                className="text-[15px] font-semibold text-clay-900 transition hover:text-saffron-700"
              >
                {lead.name}
              </Link>
              {isNew ? (
                <span className="rounded-full bg-saffron-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  New
                </span>
              ) : (
                <StatusBadge status={lead.status} />
              )}
              <span className="ml-auto shrink-0 text-xs text-clay-400">{relativeTime(lead.created_at)}</span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-clay-500">
              {meta.map((m) => (
                <span key={m} className="inline-flex items-center gap-1">
                  {m}
                </span>
              ))}
              {lead.product?.name && (
                <span className="inline-flex items-center gap-1 rounded-md bg-clay-100 px-2 py-0.5 font-medium text-clay-600">
                  {lead.product.name}
                </span>
              )}
            </div>

            <p className="clamp-2 mt-2 text-sm leading-relaxed text-clay-700">{lead.requirement}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-clay-100 pt-3.5">
          <a
            href={`tel:${phone}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-clay-900 px-3.5 text-[13px] font-semibold text-white transition hover:bg-clay-800"
          >
            <IconPhone /> Call
          </a>
          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-[13px] font-semibold text-white transition hover:bg-emerald-700"
          >
            <IconWhatsApp /> WhatsApp
          </a>
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-clay-200 bg-white px-3.5 text-[13px] font-semibold text-clay-700 transition hover:bg-clay-50"
            >
              <IconMail /> Email
            </a>
          )}
          <Link
            href={`/vendor/inquiries/${lead.id}`}
            className="ml-auto inline-flex h-9 items-center gap-1 rounded-lg px-3 text-[13px] font-semibold text-saffron-700 transition hover:bg-saffron-50"
          >
            View details
            <IconChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </li>
  );
}

/* Small inline glyphs so the action buttons read at a glance. */
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 3.5h-.9A2.5 2.5 0 0 0 4 6.1C4 14 10 20 17.9 20a2.5 2.5 0 0 0 2.6-2.5v-.9a1.2 1.2 0 0 0-.86-1.15l-3-.9a1.2 1.2 0 0 0-1.28.42l-.86 1.1a12.4 12.4 0 0 1-5.5-5.5l1.1-.86a1.2 1.2 0 0 0 .42-1.28l-.9-3A1.2 1.2 0 0 0 7 3.5Z" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.6 6.5 7.3 5.3a2 2 0 0 0 2.2 0l7.3-5.3" />
    </svg>
  );
}
