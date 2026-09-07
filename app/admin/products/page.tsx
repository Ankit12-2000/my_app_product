import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listAllProducts } from "@/lib/data/admin";
import { setProductApproval, setProductFeatured } from "@/app/actions/admin";
import { Thumb } from "@/components/Thumb";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon } from "@/lib/images";
import {
  ActionButton,
  Badge,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  Table,
  Td,
  Th,
  Tr,
} from "@/components/admin/ui";
import { IconBox, IconCheck, IconStar, IconUndo } from "@/components/admin/icons";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await listAllProducts();

  const live = products.filter((p) => p.is_approved).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Approve products to list them publicly, and feature the standouts on the homepage."
      />

      <Card>
        <CardHeader
          title="All products"
          description={`${products.length} total · ${live} live · ${products.length - live} pending`}
        />
        {products.length === 0 ? (
          <EmptyState
            icon={<IconBox className="h-5 w-5" />}
            title="No products yet"
            description="Products added by vendors will show up here for approval."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th className="hidden md:table-cell">Vendor</Th>
                <Th className="hidden sm:table-cell">Price</Th>
                <Th>Status</Th>
                <Th className="w-16 text-center">Featured</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <Tr key={p.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-clay-100 ring-1 ring-clay-200/70">
                        <Thumb
                          src={primaryImage(p)}
                          alt={p.name}
                          seed={p.slug}
                          icon={deityIcon(p.deity)}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="block truncate font-medium text-clay-900 transition hover:text-saffron-700"
                        >
                          {p.name}
                        </Link>
                        <span className="block truncate text-xs text-clay-400 sm:hidden">
                          {priceLabel(p)}
                        </span>
                      </div>
                    </div>
                  </Td>
                  <Td className="hidden text-clay-600 md:table-cell">{p.shop?.name ?? "—"}</Td>
                  <Td className="hidden whitespace-nowrap tabular text-clay-600 sm:table-cell">
                    {priceLabel(p)}
                  </Td>
                  <Td>
                    <Badge tone={p.is_approved ? "success" : "warning"} dot>
                      {p.is_approved ? "Live" : "Pending"}
                    </Badge>
                  </Td>
                  <Td className="text-center">
                    <ActionButton
                      action={setProductFeatured}
                      fields={{ id: p.id, featured: (!p.is_featured).toString() }}
                      variant="ghost"
                      size="icon"
                      title={p.is_featured ? "Remove from featured" : "Mark as featured"}
                      className={p.is_featured ? "text-saffron-500 hover:text-saffron-600" : "text-clay-300"}
                    >
                      <IconStar className="h-[18px] w-[18px]" filled={p.is_featured} />
                      <span className="sr-only">{p.is_featured ? "Unfeature" : "Feature"}</span>
                    </ActionButton>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1.5">
                      <ActionButton
                        action={setProductApproval}
                        fields={{ id: p.id, approve: (!p.is_approved).toString() }}
                        variant={p.is_approved ? "secondary" : "success"}
                      >
                        {p.is_approved ? (
                          <IconUndo className="h-3.5 w-3.5" />
                        ) : (
                          <IconCheck className="h-3.5 w-3.5" />
                        )}
                        {p.is_approved ? "Unapprove" : "Approve"}
                      </ActionButton>
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
        )}
      </Card>
    </div>
  );
}
