import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { listQuotationsPage, quotationStatusCounts } from "@/lib/data/vendor";
import { parsePage } from "@/lib/data/paging";
import { createQuotationFromInquiry } from "@/app/actions/vendor";
import { formatPrice } from "@/lib/utils";
import { rowTotal } from "@/lib/quotation";
import { FilterTabs, SearchInput, Toolbar } from "@/components/admin/Toolbar";
import { PageNav } from "@/components/admin/PageNav";
import { SubmitButton } from "@/components/admin/ActionButton";
import { IconChevronRight, IconPlus } from "@/components/admin/icons";

const STATUS_CLS: Record<string, string> = {
  draft: "bg-clay-100 text-clay-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const STATUSES = ["draft", "sent", "accepted", "rejected"];

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function QuotationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { shop } = await requireVendorShop();
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status ?? "") ? sp.status : "all";

  const [{ rows, total, page, pageCount, pageSize }, counts] = await Promise.all([
    listQuotationsPage({ shopId: shop.id, page: parsePage(sp.page), q: sp.q, status }),
    quotationStatusCounts(shop.id),
  ]);

  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const tabs = [
    { value: "all", label: "All", count: allCount },
    ...STATUSES.map((s) => ({
      value: s,
      label: s[0].toUpperCase() + s.slice(1),
      count: counts[s] ?? 0,
    })),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold text-clay-900">Quotations</h1>
          <p className="mt-1 text-sm text-clay-500">
            {allCount} quotation{allCount !== 1 ? "s" : ""} created
          </p>
        </div>
        <form action={createQuotationFromInquiry} className="w-full sm:w-auto">
          <SubmitButton
            variant="brand"
            size="lg"
            pendingLabel="Creating…"
            className="w-full justify-center rounded-xl bg-saffron-600 shadow-sm hover:shadow-md sm:w-auto"
          >
            <IconPlus className="h-4 w-4" />
            New Quotation
          </SubmitButton>
        </form>
      </div>

      {allCount > 0 && (
        <Toolbar>
          <SearchInput placeholder="Search number, customer or city…" />
          <div className="w-full sm:w-auto">
            <FilterTabs tabs={tabs} />
          </div>
        </Toolbar>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-clay-100">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-4xl">🧾</p>
            <p className="mt-3 text-base font-semibold text-clay-600">
              {sp.q ? `Nothing matches “${sp.q}”` : "No quotations yet"}
            </p>
            <p className="mt-1 text-sm text-clay-400">
              Create one from an inquiry or start a blank one
            </p>
          </div>
        ) : (
          <>
            <div className="admin-scroll hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-b border-clay-100 bg-clay-50/80">
                    <Th>Number</Th>
                    <Th>Customer</Th>
                    <Th className="hidden md:table-cell">Date</Th>
                    <Th>Total</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-clay-100">
                  {rows.map((q) => (
                    <tr key={q.id} className="transition hover:bg-clay-50/50">
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/vendor/quotations/${q.id}`}
                          className="font-bold text-saffron-700 transition hover:underline"
                        >
                          {q.number ?? q.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="max-w-[200px] truncate px-5 py-3.5 font-medium text-clay-900">
                        {q.customer_name ?? "—"}
                      </td>
                      <td className="hidden whitespace-nowrap px-5 py-3.5 text-clay-500 md:table-cell">
                        {dateFmt.format(new Date(q.created_at))}
                      </td>
                      <td className="tabular whitespace-nowrap px-5 py-3.5 font-bold text-clay-900">
                        {formatPrice(rowTotal(q))}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={q.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-clay-100 sm:hidden">
              {rows.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/vendor/quotations/${q.id}`}
                    className="flex items-center gap-3 p-4 transition active:bg-clay-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-saffron-700">
                          {q.number ?? q.id.slice(0, 8)}
                        </span>
                        <StatusPill status={q.status} />
                      </div>
                      <p className="mt-1 truncate text-sm font-medium text-clay-800">
                        {q.customer_name ?? "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-clay-400">
                        {dateFmt.format(new Date(q.created_at))}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="tabular font-bold text-clay-900">{formatPrice(rowTotal(q))}</p>
                      <IconChevronRight className="ml-auto mt-1 h-4 w-4 text-clay-300" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <PageNav
              page={page}
              pageCount={pageCount}
              total={total}
              pageSize={pageSize}
              label="quotations"
            />
          </>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold capitalize ${
        STATUS_CLS[status] ?? STATUS_CLS.draft
      }`}
    >
      {status}
    </span>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-clay-500 ${className}`}
    >
      {children}
    </th>
  );
}
