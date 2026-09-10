import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { inquiryStatusCounts, listInquiriesPage } from "@/lib/data/admin";
import { parsePage } from "@/lib/data/paging";
import { STATUS_META, STATUS_ORDER } from "@/components/vendor/StatusBadge";
import { FilterTabs, SearchInput, Toolbar } from "@/components/admin/Toolbar";
import { PageNav } from "@/components/admin/PageNav";
import {
  Avatar,
  Badge,
  Card,
  CardList,
  CardListItem,
  DesktopOnly,
  EmptyState,
  MobileOnly,
  PageHeader,
  Table,
  Td,
  Th,
  Tr,
  type Tone,
} from "@/components/admin/ui";
import { IconChat, IconMail, IconPhone } from "@/components/admin/icons";
import type { InquiryStatus } from "@/types";

// The marketplace-wide inquiry feed. Vendors see only their own; an admin
// needs the whole pipeline to spot shops letting leads go cold.

const TONES: Record<InquiryStatus, Tone> = {
  new: "info",
  contacted: "info",
  quotation_sent: "brand",
  negotiation: "warning",
  confirmed: "success",
  closed: "neutral",
  rejected: "danger",
};

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const status = (STATUS_ORDER as string[]).includes(sp.status ?? "") ? sp.status : "all";

  const [{ rows, total, page, pageCount, pageSize }, counts] = await Promise.all([
    listInquiriesPage({ page: parsePage(sp.page), q: sp.q, status }),
    inquiryStatusCounts(),
  ]);

  const tabs = [
    { value: "all", label: "All", count: Object.values(counts).reduce((a, b) => a + b, 0) },
    ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].label, count: counts[s] ?? 0 })),
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inquiries"
        description="Every customer inquiry across the marketplace, newest first. Use it to see which vendors are responding."
      />

      <Toolbar>
        <SearchInput placeholder="Search customer, phone, email or city…" />
        <div className="w-full sm:w-auto">
          <FilterTabs tabs={tabs} />
        </div>
      </Toolbar>

      <Card>
        {rows.length === 0 ? (
          <EmptyState
            icon={<IconChat className="h-5 w-5" />}
            title={sp.q ? `No inquiries match “${sp.q}”` : "No inquiries here"}
            description={
              sp.q
                ? "Try a different search term or clear the filters."
                : "Customer inquiries sent to any vendor will appear here."
            }
          />
        ) : (
          <>
            <DesktopOnly>
              <Table minWidth="min-w-[820px]">
                <thead>
                  <tr>
                    <Th>Customer</Th>
                    <Th>Vendor</Th>
                    <Th className="hidden lg:table-cell">Product</Th>
                    <Th className="w-16 text-center">Qty</Th>
                    <Th className="whitespace-nowrap">Received</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((i) => (
                    <Tr key={i.id}>
                      <Td>
                        <p className="font-medium text-clay-900">{i.name}</p>
                        <p className="tabular text-xs text-clay-400">
                          {i.phone}
                          {i.city ? ` · ${i.city}` : ""}
                        </p>
                      </Td>
                      <Td className="max-w-[180px] truncate text-clay-600">
                        {i.shop?.slug ? (
                          <Link href={`/shop/${i.shop.slug}`} className="transition hover:text-saffron-700">
                            {i.shop.name}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </Td>
                      <Td className="hidden max-w-[200px] truncate text-clay-600 lg:table-cell">
                        {i.product?.name ?? "General inquiry"}
                      </Td>
                      <Td className="tabular text-center text-clay-600">{i.quantity}</Td>
                      <Td className="whitespace-nowrap text-clay-500">
                        {dateFmt.format(new Date(i.created_at))}
                      </Td>
                      <Td>
                        <Badge tone={TONES[i.status] ?? "neutral"} dot>
                          {STATUS_META[i.status]?.label ?? i.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </DesktopOnly>

            <MobileOnly>
              <CardList>
                {rows.map((i) => (
                  <CardListItem
                    key={i.id}
                    media={<Avatar name={i.name} />}
                    title={i.name}
                    meta={
                      <>
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <a
                            href={`tel:${i.phone.replace(/\s/g, "")}`}
                            className="tabular inline-flex items-center gap-1.5 hover:text-saffron-700"
                          >
                            <IconPhone className="h-3.5 w-3.5 text-clay-400" />
                            {i.phone}
                          </a>
                          {i.email && (
                            <a
                              href={`mailto:${i.email}`}
                              className="inline-flex min-w-0 items-center gap-1.5 hover:text-saffron-700"
                            >
                              <IconMail className="h-3.5 w-3.5 shrink-0 text-clay-400" />
                              <span className="truncate">{i.email}</span>
                            </a>
                          )}
                        </span>
                        <p className="truncate">
                          {i.product?.name ?? "General inquiry"} · qty {i.quantity}
                        </p>
                        <p className="truncate text-clay-400">
                          {i.shop?.name ?? "—"} · {dateFmt.format(new Date(i.created_at))}
                        </p>
                      </>
                    }
                    badges={
                      <Badge tone={TONES[i.status] ?? "neutral"} dot>
                        {STATUS_META[i.status]?.label ?? i.status}
                      </Badge>
                    }
                  />
                ))}
              </CardList>
            </MobileOnly>

            <PageNav page={page} pageCount={pageCount} total={total} pageSize={pageSize} label="inquiries" />
          </>
        )}
      </Card>
    </div>
  );
}
