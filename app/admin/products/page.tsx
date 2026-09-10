import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  getAdminStats,
  listProductsPage,
  type ProductSort,
  type ProductStatusFilter,
} from "@/lib/data/admin";
import { parsePage } from "@/lib/data/paging";
import { setProductApproval, setProductFeatured } from "@/app/actions/admin";
import { Thumb } from "@/components/Thumb";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon } from "@/lib/images";
import { FilterTabs, SearchInput, SortSelect, Toolbar } from "@/components/admin/Toolbar";
import { PageNav } from "@/components/admin/PageNav";
import {
  ActionButton,
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
import { IconBox, IconCheck, IconStar, IconUndo } from "@/components/admin/icons";

const STATUSES: ProductStatusFilter[] = ["all", "pending", "live", "featured"];
const SORTS: ProductSort[] = ["newest", "oldest", "name", "price_desc"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name A–Z" },
  { value: "price_desc", label: "Highest price" },
];

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string; page?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;

  const status = (STATUSES as string[]).includes(sp.status ?? "") ? (sp.status as ProductStatusFilter) : "all";
  const sort = (SORTS as string[]).includes(sp.sort ?? "") ? (sp.sort as ProductSort) : "newest";

  const [{ rows, total, page, pageCount, pageSize }, stats] = await Promise.all([
    listProductsPage({ page: parsePage(sp.page), q: sp.q, status, sort }),
    getAdminStats(),
  ]);

  const tabs = [
    { value: "all", label: "All", count: stats.productsTotal },
    { value: "pending", label: "Pending", count: stats.productsPending },
    { value: "live", label: "Live", count: stats.productsTotal - stats.productsPending },
    { value: "featured", label: "Featured", count: stats.productsFeatured },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products"
        description="Approve products to list them publicly, and feature the standouts on the homepage."
      />

      <Toolbar>
        <SearchInput placeholder="Search by name, deity or city…" />
        <SortSelect options={SORT_OPTIONS} />
        <div className="w-full sm:w-auto">
          <FilterTabs tabs={tabs} />
        </div>
      </Toolbar>

      <Card>
        {rows.length === 0 ? (
          <EmptyState
            icon={<IconBox className="h-5 w-5" />}
            title={sp.q ? `No products match “${sp.q}”` : "No products here"}
            description={
              sp.q
                ? "Try a different search term or clear the filters."
                : "Products added by vendors will show up here for approval."
            }
          />
        ) : (
          <>
            <DesktopOnly>
              <Table>
                <thead>
                  <tr>
                    <Th>Product</Th>
                    <Th className="hidden lg:table-cell">Vendor</Th>
                    <Th>Price</Th>
                    <Th>Status</Th>
                    <Th className="w-16 text-center">Featured</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <Tr key={p.id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <ProductThumb product={p} />
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="block min-w-0 truncate font-medium text-clay-900 transition hover:text-saffron-700"
                          >
                            {p.name}
                          </Link>
                        </div>
                      </Td>
                      <Td className="hidden max-w-[180px] truncate text-clay-600 lg:table-cell">
                        {p.shop?.name ?? "—"}
                      </Td>
                      <Td className="tabular whitespace-nowrap text-clay-600">{priceLabel(p)}</Td>
                      <Td>
                        <Badge tone={p.is_approved ? "success" : "warning"} dot>
                          {p.is_approved ? "Live" : "Pending"}
                        </Badge>
                      </Td>
                      <Td className="text-center">
                        <FeatureButton product={p} />
                      </Td>
                      <Td>
                        <div className="flex items-center justify-end gap-1.5">
                          <ApproveButton product={p} />
                          <Link
                            href={`/admin/products/${p.id}`}
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
                {rows.map((p) => (
                  <CardListItem
                    key={p.id}
                    media={<ProductThumb product={p} size="lg" />}
                    title={
                      <Link href={`/admin/products/${p.id}`} className="hover:text-saffron-700">
                        {p.name}
                      </Link>
                    }
                    meta={
                      <>
                        <p className="tabular font-medium text-clay-700">{priceLabel(p)}</p>
                        {p.shop?.name && <p className="truncate">{p.shop.name}</p>}
                      </>
                    }
                    badges={
                      <>
                        <Badge tone={p.is_approved ? "success" : "warning"} dot>
                          {p.is_approved ? "Live" : "Pending"}
                        </Badge>
                        {p.is_featured && <Badge tone="brand">Featured</Badge>}
                      </>
                    }
                    actions={
                      <>
                        <ApproveButton product={p} />
                        <FeatureButton product={p} />
                        <Link
                          href={`/admin/products/${p.id}`}
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

            <PageNav
              page={page}
              pageCount={pageCount}
              total={total}
              pageSize={pageSize}
              label="products"
            />
          </>
        )}
      </Card>
    </div>
  );
}

type ListProduct = Awaited<ReturnType<typeof listProductsPage>>["rows"][number];

function ProductThumb({ product, size = "sm" }: { product: ListProduct; size?: "sm" | "lg" }) {
  const box = size === "lg" ? "h-14 w-14" : "h-10 w-10";
  return (
    <div className={`relative ${box} shrink-0 overflow-hidden rounded-lg bg-clay-100 ring-1 ring-clay-200/70`}>
      <Thumb
        src={primaryImage(product)}
        alt={product.name}
        seed={product.slug}
        icon={deityIcon(product.deity)}
        fill
        sizes="56px"
        className="object-cover"
      />
    </div>
  );
}

function ApproveButton({ product }: { product: ListProduct }) {
  return (
    <ActionButton
      action={setProductApproval}
      fields={{ id: product.id, approve: (!product.is_approved).toString() }}
      variant={product.is_approved ? "secondary" : "success"}
    >
      {product.is_approved ? <IconUndo className="h-3.5 w-3.5" /> : <IconCheck className="h-3.5 w-3.5" />}
      {product.is_approved ? "Unapprove" : "Approve"}
    </ActionButton>
  );
}

function FeatureButton({ product }: { product: ListProduct }) {
  return (
    <ActionButton
      action={setProductFeatured}
      fields={{ id: product.id, featured: (!product.is_featured).toString() }}
      variant="ghost"
      size="icon"
      title={product.is_featured ? "Remove from featured" : "Mark as featured"}
      className={product.is_featured ? "text-saffron-500 hover:text-saffron-600" : "text-clay-300"}
    >
      <IconStar className="h-[18px] w-[18px]" filled={product.is_featured} />
      <span className="sr-only">{product.is_featured ? "Unfeature" : "Feature"}</span>
    </ActionButton>
  );
}
