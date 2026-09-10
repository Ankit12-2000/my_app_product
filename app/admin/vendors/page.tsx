import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats, listShopsPage, type ShopStatusFilter } from "@/lib/data/admin";
import { parsePage } from "@/lib/data/paging";
import { setShopApproval, setShopFeatured } from "@/app/actions/admin";
import { VendorForm } from "@/components/admin/VendorForm";
import { Thumb } from "@/components/Thumb";
import { isRealImage } from "@/lib/images";
import { FilterTabs, SearchInput, Toolbar } from "@/components/admin/Toolbar";
import { PageNav } from "@/components/admin/PageNav";
import {
  ActionButton,
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
} from "@/components/admin/ui";
import { IconCheck, IconStar, IconStore, IconUndo } from "@/components/admin/icons";
import type { Shop } from "@/types";

const STATUSES: ShopStatusFilter[] = ["all", "pending", "approved", "featured"];

export default async function AdminVendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const status = (STATUSES as string[]).includes(sp.status ?? "") ? (sp.status as ShopStatusFilter) : "all";

  const [{ rows, total, page, pageCount, pageSize }, stats] = await Promise.all([
    listShopsPage({ page: parsePage(sp.page), q: sp.q, status }),
    getAdminStats(),
  ]);

  const tabs = [
    { value: "all", label: "All", count: stats.vendorsTotal },
    { value: "pending", label: "Pending", count: stats.vendorsPending },
    { value: "approved", label: "Approved", count: stats.vendorsTotal - stats.vendorsPending },
    { value: "featured", label: "Featured" },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vendors"
        description="Create new vendors, approve shops to make them public, and feature the best ones."
      />

      <VendorForm />

      <Toolbar>
        <SearchInput placeholder="Search name, city, phone or email…" />
        <div className="w-full sm:w-auto">
          <FilterTabs tabs={tabs} />
        </div>
      </Toolbar>

      <Card>
        {rows.length === 0 ? (
          <EmptyState
            icon={<IconStore className="h-5 w-5" />}
            title={sp.q ? `No vendors match “${sp.q}”` : "No vendors here"}
            description={
              sp.q
                ? "Try a different search term or clear the filters."
                : "Create your first vendor with the form above."
            }
          />
        ) : (
          <>
            <DesktopOnly>
              <Table>
                <thead>
                  <tr>
                    <Th>Shop</Th>
                    <Th className="hidden lg:table-cell">Location</Th>
                    <Th>Status</Th>
                    <Th className="w-16 text-center">Featured</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <Tr key={s.id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <ShopAvatar shop={s} />
                          <div className="min-w-0">
                            <Link
                              href={`/admin/vendors/${s.id}`}
                              className="block truncate font-medium text-clay-900 transition hover:text-saffron-700"
                            >
                              {s.name}
                            </Link>
                            <span className="block truncate text-xs text-clay-400">
                              {s.phone ?? s.email ?? "No contact"}
                            </span>
                          </div>
                        </div>
                      </Td>
                      <Td className="hidden text-clay-600 lg:table-cell">{location(s) || "—"}</Td>
                      <Td>
                        <Badge tone={s.is_approved ? "success" : "warning"} dot>
                          {s.is_approved ? "Approved" : "Pending"}
                        </Badge>
                      </Td>
                      <Td className="text-center">
                        <FeatureButton shop={s} />
                      </Td>
                      <Td>
                        <div className="flex items-center justify-end gap-1.5">
                          <ApproveButton shop={s} />
                          <Link
                            href={`/admin/vendors/${s.id}`}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-clay-500 transition hover:bg-clay-100 hover:text-clay-900"
                          >
                            Detail
                          </Link>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </DesktopOnly>

            <MobileOnly>
              <CardList>
                {rows.map((s) => (
                  <CardListItem
                    key={s.id}
                    media={<ShopAvatar shop={s} />}
                    title={
                      <Link href={`/admin/vendors/${s.id}`} className="hover:text-saffron-700">
                        {s.name}
                      </Link>
                    }
                    meta={
                      <>
                        <p>{s.phone ?? s.email ?? "No contact"}</p>
                        {location(s) && <p>{location(s)}</p>}
                      </>
                    }
                    badges={
                      <>
                        <Badge tone={s.is_approved ? "success" : "warning"} dot>
                          {s.is_approved ? "Approved" : "Pending"}
                        </Badge>
                        {s.is_featured && <Badge tone="brand">Featured</Badge>}
                      </>
                    }
                    actions={
                      <>
                        <ApproveButton shop={s} />
                        <FeatureButton shop={s} />
                        <Link
                          href={`/admin/vendors/${s.id}`}
                          className="ml-auto rounded-lg px-2.5 py-1.5 text-xs font-semibold text-clay-500 transition hover:bg-clay-100 hover:text-clay-900"
                        >
                          Detail →
                        </Link>
                      </>
                    }
                  />
                ))}
              </CardList>
            </MobileOnly>

            <PageNav page={page} pageCount={pageCount} total={total} pageSize={pageSize} label="vendors" />
          </>
        )}
      </Card>
    </div>
  );
}

const location = (s: Shop) => [s.city, s.state].filter(Boolean).join(", ");

function ShopAvatar({ shop }: { shop: Shop }) {
  if (!isRealImage(shop.logo_url)) return <Avatar name={shop.name} />;
  return (
    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-clay-100 ring-1 ring-clay-200/70">
      <Thumb
        src={shop.logo_url}
        alt={shop.name}
        seed={shop.slug}
        width={36}
        height={36}
        className="h-9 w-9 object-cover"
      />
    </span>
  );
}

function ApproveButton({ shop }: { shop: Shop }) {
  return (
    <ActionButton
      action={setShopApproval}
      fields={{ id: shop.id, approve: (!shop.is_approved).toString() }}
      variant={shop.is_approved ? "secondary" : "success"}
    >
      {shop.is_approved ? <IconUndo className="h-3.5 w-3.5" /> : <IconCheck className="h-3.5 w-3.5" />}
      {shop.is_approved ? "Unapprove" : "Approve"}
    </ActionButton>
  );
}

function FeatureButton({ shop }: { shop: Shop }) {
  return (
    <ActionButton
      action={setShopFeatured}
      fields={{ id: shop.id, featured: (!shop.is_featured).toString() }}
      variant="ghost"
      size="icon"
      title={shop.is_featured ? "Remove from featured" : "Mark as featured"}
      className={shop.is_featured ? "text-saffron-500 hover:text-saffron-600" : "text-clay-300"}
    >
      <IconStar className="h-[18px] w-[18px]" filled={shop.is_featured} />
      <span className="sr-only">{shop.is_featured ? "Unfeature" : "Feature"}</span>
    </ActionButton>
  );
}
