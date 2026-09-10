import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import {
  getVendorStats,
  listVendorProductsPage,
  type VendorProductStatus,
} from "@/lib/data/vendor";
import { parsePage } from "@/lib/data/paging";
import { deleteProduct } from "@/app/actions/vendor";
import { Thumb } from "@/components/Thumb";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon } from "@/lib/images";
import { FilterTabs, SearchInput, Toolbar } from "@/components/admin/Toolbar";
import { PageNav } from "@/components/admin/PageNav";
import {
  ActionButton,
  Badge,
  ButtonLink,
  Card,
  DesktopOnly,
  EmptyState,
  MobileOnly,
  Table,
  Td,
  Th,
  Tr,
} from "@/components/admin/ui";
import { IconBox, IconPlus, IconStar } from "@/components/admin/icons";

const STATUSES: VendorProductStatus[] = ["all", "live", "pending"];
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function VendorProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { shop } = await requireVendorShop();
  const sp = await searchParams;
  const status = (STATUSES as string[]).includes(sp.status ?? "")
    ? (sp.status as VendorProductStatus)
    : "all";

  const [{ rows, total, page, pageCount, pageSize }, stats] = await Promise.all([
    listVendorProductsPage({ shopId: shop.id, page: parsePage(sp.page), q: sp.q, status }),
    getVendorStats(shop.id),
  ]);

  const tabs = [
    { value: "all", label: "All", count: stats.products },
    { value: "live", label: "Live" },
    { value: "pending", label: "Pending" },
  ];
  const filtered = Boolean(sp.q) || status !== "all";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-clay-900">Products</h1>
          <p className="mt-1 text-sm text-clay-500">
            {stats.products} product{stats.products !== 1 ? "s" : ""} in your shop
          </p>
        </div>
        <ButtonLink href="/vendor/products/new" variant="brand" size="md">
          <IconPlus className="h-4 w-4" />
          Add product
        </ButtonLink>
      </div>

      {stats.products > 0 && (
        <Toolbar>
          <SearchInput placeholder="Search products…" />
          <div className="w-full sm:w-auto">
            <FilterTabs tabs={tabs} />
          </div>
        </Toolbar>
      )}

      <Card>
        {rows.length === 0 ? (
          <EmptyState
            icon={<IconBox className="h-5 w-5" />}
            title={filtered ? "Nothing matches these filters" : "No products yet"}
            description={
              filtered
                ? "Try a different search or switch back to All."
                : "Add your first murti to start receiving inquiries."
            }
            action={
              !filtered && (
                <ButtonLink href="/vendor/products/new" variant="brand" size="md">
                  <IconPlus className="h-4 w-4" />
                  Add your first product
                </ButtonLink>
              )
            }
          />
        ) : (
          <>
            {/* WordPress-style products table on desktop */}
            <DesktopOnly>
              <Table minWidth="min-w-[760px]">
                <thead>
                  <tr>
                    <Th className="w-14">Image</Th>
                    <Th>Name</Th>
                    <Th>Price</Th>
                    <Th>Stock</Th>
                    <Th className="w-20 text-center">Featured</Th>
                    <Th className="whitespace-nowrap">Date</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <Tr key={p.id}>
                      <Td>
                        <div className="relative h-11 w-11 overflow-hidden rounded-md bg-clay-100 ring-1 ring-clay-200/70">
                          <Thumb src={primaryImage(p)} alt={p.name} seed={p.slug} icon={deityIcon(p.deity)} fill sizes="44px" className="object-cover" />
                        </div>
                      </Td>
                      <Td>
                        <div className="group/name min-w-0">
                          <Link
                            href={`/vendor/products/${p.id}/edit`}
                            className="block truncate font-semibold text-saffron-700 transition hover:text-saffron-800"
                          >
                            {p.name}
                          </Link>
                          {/* WP-style row actions */}
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-clay-400 transition-opacity md:opacity-0 md:group-hover/name:opacity-100">
                            <Link href={`/vendor/products/${p.id}/edit`} className="hover:text-clay-700">Edit</Link>
                            {p.is_approved && (
                              <>
                                <span aria-hidden>|</span>
                                <Link href={`/products/${p.slug}`} className="hover:text-clay-700" target="_blank">View</Link>
                              </>
                            )}
                            <span aria-hidden>|</span>
                            <ActionButton
                              action={deleteProduct}
                              fields={{ id: p.id }}
                              variant="ghost"
                              size="sm"
                              confirm={`Delete “${p.name}”? This cannot be undone.`}
                              className="h-auto p-0 text-xs font-normal text-rose-500 hover:bg-transparent hover:text-rose-700"
                            >
                              Delete
                            </ActionButton>
                          </div>
                        </div>
                      </Td>
                      <Td className="tabular whitespace-nowrap text-clay-700">{priceLabel(p)}</Td>
                      <Td>
                        {p.in_stock ? (
                          <span className="font-medium text-emerald-600">In stock</span>
                        ) : (
                          <span className="text-clay-400">Out of stock</span>
                        )}
                      </Td>
                      <Td className="text-center">
                        <IconStar
                          className={`mx-auto h-[18px] w-[18px] ${p.is_featured ? "text-saffron-500" : "text-clay-200"}`}
                          filled={p.is_featured}
                        />
                      </Td>
                      <Td className="whitespace-nowrap text-clay-500">
                        <Badge tone={p.is_approved ? "success" : "warning"} dot className="mb-1">
                          {p.is_approved ? "Live" : "Pending"}
                        </Badge>
                        <div className="text-xs">{dateFmt.format(new Date((p as unknown as { created_at: string }).created_at))}</div>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </DesktopOnly>

            {/* Compact rows on mobile */}
            <MobileOnly>
              <ul className="divide-y divide-clay-100">
                {rows.map((p) => (
                  <li key={p.id} className="flex gap-3 p-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-clay-100 ring-1 ring-clay-200/70">
                      <Thumb src={primaryImage(p)} alt={p.name} seed={p.slug} icon={deityIcon(p.deity)} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/vendor/products/${p.id}/edit`} className="truncate font-semibold text-clay-900">
                          {p.name}
                        </Link>
                        {p.is_featured && <IconStar className="h-4 w-4 shrink-0 text-saffron-500" filled />}
                      </div>
                      <p className="tabular mt-0.5 text-sm font-medium text-saffron-700">{priceLabel(p)}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge tone={p.is_approved ? "success" : "warning"} dot>
                          {p.is_approved ? "Live" : "Pending"}
                        </Badge>
                        <span className={p.in_stock ? "text-xs font-medium text-emerald-600" : "text-xs text-clay-400"}>
                          {p.in_stock ? "In stock" : "Out of stock"}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <Link
                          href={`/vendor/products/${p.id}/edit`}
                          className="inline-flex h-8 items-center rounded-lg border border-clay-200 bg-white px-3 text-xs font-semibold text-clay-700"
                        >
                          Edit
                        </Link>
                        <ActionButton
                          action={deleteProduct}
                          fields={{ id: p.id }}
                          variant="secondary"
                          size="sm"
                          confirm={`Delete “${p.name}”? This cannot be undone.`}
                          className="border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          Delete
                        </ActionButton>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </MobileOnly>

            <PageNav page={page} pageCount={pageCount} total={total} pageSize={pageSize} label="products" />
          </>
        )}
      </Card>
    </div>
  );
}
