import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getProductAdmin } from "@/lib/data/admin";
import { setProductApproval, setProductFeatured } from "@/app/actions/admin";
import { Thumb } from "@/components/Thumb";
import { ProductGallery } from "@/components/ProductGallery";
import { priceLabel } from "@/lib/utils";
import { isRealImage } from "@/lib/images";
import {
  ActionButton,
  Avatar,
  Badge,
  Card,
  CardHeader,
  PageHeader,
} from "@/components/admin/ui";
import { IconCheck, IconExternal, IconStar, IconUndo } from "@/components/admin/icons";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const product = await getProductAdmin(id);
  if (!product) notFound();

  const specs: { label: string; value: string | null }[] = [
    { label: "Deity", value: product.deity },
    { label: "Material", value: product.material?.name ?? null },
    { label: "Finish", value: product.finish },
    { label: "Size", value: product.size },
    { label: "Height", value: product.height_cm ? `${product.height_cm} cm` : null },
    { label: "Weight", value: product.weight_kg ? `${product.weight_kg} kg` : null },
    { label: "City", value: product.city },
    { label: "Category", value: product.category?.name ?? null },
  ];
  const filledSpecs = specs.filter((s) => s.value);

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description={`/${product.slug}`}
        backHref="/admin/products"
        backLabel="Back to products"
        actions={
          <>
            <ActionButton
              action={setProductFeatured}
              fields={{ id: product.id, featured: (!product.is_featured).toString() }}
              variant="secondary"
              size="md"
              className={product.is_featured ? "text-saffron-700" : undefined}
            >
              <IconStar className="h-4 w-4" filled={product.is_featured} />
              {product.is_featured ? "Featured" : "Feature"}
            </ActionButton>
            <ActionButton
              action={setProductApproval}
              fields={{ id: product.id, approve: (!product.is_approved).toString() }}
              variant={product.is_approved ? "secondary" : "success"}
              size="md"
            >
              {product.is_approved ? (
                <IconUndo className="h-4 w-4" />
              ) : (
                <IconCheck className="h-4 w-4" />
              )}
              {product.is_approved ? "Unapprove" : "Approve"}
            </ActionButton>
            {product.is_approved && (
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-clay-500 transition hover:bg-clay-100 hover:text-clay-900"
              >
                View public page
              </Link>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4 lg:sticky lg:top-[76px] lg:h-fit">
          <ProductGallery images={product.images} name={product.name} />
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={product.is_approved ? "success" : "warning"} dot>
                {product.is_approved ? "Live" : "Pending"}
              </Badge>
              {product.is_featured && <Badge tone="brand">Featured</Badge>}
              <Badge tone={product.in_stock ? "info" : "neutral"}>
                {product.in_stock ? "In stock · ready to ship" : "Made to order"}
              </Badge>
            </div>
            <p className="mt-4 text-[28px] font-semibold leading-none tracking-tight text-saffron-700 tabular">
              {priceLabel(product)}
            </p>
          </Card>

          {product.description && (
            <Card>
              <CardHeader title="Description" />
              <p className="whitespace-pre-wrap p-5 text-sm leading-relaxed text-clay-600">
                {product.description}
              </p>
            </Card>
          )}

          {filledSpecs.length > 0 && (
            <Card>
              <CardHeader title="Specifications" />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 p-5">
                {filledSpecs.map((s) => (
                  <div key={s.label} className="min-w-0">
                    <dt className="text-xs text-clay-400">{s.label}</dt>
                    <dd className="mt-0.5 truncate text-sm font-medium text-clay-900">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}

          {product.video_url && (
            <a
              href={product.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-700 hover:underline"
            >
              Watch product video
              <IconExternal className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {product.shop && (
        <Card>
          <CardHeader title="Vendor" />
          <Link
            href={`/admin/vendors/${product.shop_id}`}
            className="flex items-center gap-3 p-5 transition hover:bg-clay-50/70"
          >
            {isRealImage(product.shop.logo_url) ? (
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-clay-100 ring-1 ring-clay-200/70">
                <Thumb
                  src={product.shop.logo_url}
                  alt={product.shop.name}
                  seed={product.shop.slug}
                  width={44}
                  height={44}
                  className="h-11 w-11 object-cover"
                />
              </span>
            ) : (
              <Avatar name={product.shop.name} className="h-11 w-11 text-sm" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-clay-900">{product.shop.name}</p>
              <p className="truncate text-sm text-clay-500">
                {[product.shop.city, product.shop.state].filter(Boolean).join(", ") || "—"}
              </p>
              <p className="truncate text-xs text-clay-400">
                {[product.shop.email, product.shop.phone].filter(Boolean).join(" · ") || "No contact"}
              </p>
            </div>
            <Badge tone={product.shop.is_approved ? "success" : "warning"} className="ml-auto shrink-0">
              {product.shop.is_approved ? "Approved" : "Pending"}
            </Badge>
          </Link>
        </Card>
      )}

      <Card>
        <CardHeader title="Metadata" />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 p-5 md:grid-cols-4">
          <div className="min-w-0">
            <dt className="text-xs text-clay-400">Product ID</dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-clay-700">{product.id}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-clay-400">Shop ID</dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-clay-700">{product.shop_id}</dd>
          </div>
          <div>
            <dt className="text-xs text-clay-400">Images</dt>
            <dd className="mt-0.5 text-sm font-medium text-clay-900">
              {product.images.length} uploaded
            </dd>
          </div>
          <div>
            <dt className="text-xs text-clay-400">Video</dt>
            <dd className="mt-0.5 text-sm font-medium text-clay-900">
              {product.video_url ? "Yes" : "None"}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
