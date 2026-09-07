import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getShopAdmin } from "@/lib/data/admin";
import { setShopApproval, setShopFeatured } from "@/app/actions/admin";
import { Thumb } from "@/components/Thumb";
import { StarRating } from "@/components/StarRating";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon, isRealImage } from "@/lib/images";
import {
  ActionButton,
  Avatar,
  Badge,
  Card,
  CardHeader,
  PageHeader,
} from "@/components/admin/ui";
import { IconBox, IconCheck, IconStar, IconUndo } from "@/components/admin/icons";

function DefItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-clay-400">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-clay-900">{children}</dd>
    </div>
  );
}

export default async function AdminVendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const result = await getShopAdmin(id);
  if (!result) notFound();
  const { shop, products, reviews } = result;

  const liveProducts = products.filter((p) => p.is_approved).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={shop.name}
        description={shop.tagline ?? undefined}
        backHref="/admin/vendors"
        backLabel="Back to vendors"
        actions={
          <>
            <ActionButton
              action={setShopFeatured}
              fields={{ id: shop.id, featured: (!shop.is_featured).toString() }}
              variant="secondary"
              size="md"
              className={shop.is_featured ? "text-saffron-700" : undefined}
            >
              <IconStar className="h-4 w-4" filled={shop.is_featured} />
              {shop.is_featured ? "Featured" : "Feature"}
            </ActionButton>
            <ActionButton
              action={setShopApproval}
              fields={{ id: shop.id, approve: (!shop.is_approved).toString() }}
              variant={shop.is_approved ? "secondary" : "success"}
              size="md"
            >
              {shop.is_approved ? <IconUndo className="h-4 w-4" /> : <IconCheck className="h-4 w-4" />}
              {shop.is_approved ? "Unapprove" : "Approve"}
            </ActionButton>
            {shop.is_approved && (
              <Link
                href={`/shop/${shop.slug}`}
                className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-clay-500 transition hover:bg-clay-100 hover:text-clay-900"
              >
                View public page
              </Link>
            )}
          </>
        }
      />

      {shop.banner_url && (
        <div className="relative h-44 overflow-hidden rounded-xl border border-clay-200/70 bg-clay-100">
          <Thumb
            src={shop.banner_url}
            alt={`${shop.name} banner`}
            seed={shop.slug}
            icon={null}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-start gap-4">
              {isRealImage(shop.logo_url) ? (
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-clay-100 ring-1 ring-clay-200/70">
                  <Thumb
                    src={shop.logo_url}
                    alt={shop.name}
                    seed={shop.slug}
                    width={56}
                    height={56}
                    className="h-14 w-14 object-cover"
                  />
                </span>
              ) : (
                <Avatar name={shop.name} className="h-14 w-14 text-base" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-clay-900">{shop.name}</h2>
                  <Badge tone={shop.is_approved ? "success" : "warning"} dot>
                    {shop.is_approved ? "Approved" : "Pending"}
                  </Badge>
                  {shop.is_featured && <Badge tone="brand">Featured</Badge>}
                </div>
                <p className="mt-1 font-mono text-xs text-clay-400">/{shop.slug}</p>
              </div>
            </div>
            {shop.description && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-clay-600">
                {shop.description}
              </p>
            )}
          </Card>

          <Card>
            <CardHeader title="Contact information" />
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 p-5 md:grid-cols-3">
              <DefItem label="City">{shop.city || "—"}</DefItem>
              <DefItem label="State">{shop.state || "—"}</DefItem>
              <DefItem label="Phone">{shop.phone || "—"}</DefItem>
              <DefItem label="Email">{shop.email || "—"}</DefItem>
              <DefItem label="WhatsApp">{shop.whatsapp || "—"}</DefItem>
              <div>
                <dt className="text-xs text-clay-400">Rating</dt>
                <dd className="mt-0.5 flex items-center gap-2">
                  <StarRating rating={shop.rating} />
                  <span className="text-sm text-clay-500 tabular">({shop.review_count})</span>
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader
              title="Products"
              description={`${products.length} total · ${liveProducts} live`}
            />
            {products.length === 0 ? (
              <p className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-clay-500">
                <IconBox className="h-4 w-4 text-clay-300" />
                No products listed yet.
              </p>
            ) : (
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/products/${p.id}`}
                    className="flex items-center gap-3 rounded-xl border border-clay-200/70 p-3 transition hover:border-clay-300 hover:bg-clay-50/70"
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-clay-100">
                      <Thumb
                        src={primaryImage(p)}
                        alt={p.name}
                        seed={p.slug}
                        icon={deityIcon(p.deity)}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-clay-900">{p.name}</p>
                      <p className="truncate text-xs text-saffron-700">{priceLabel(p)}</p>
                    </div>
                    <Badge tone={p.is_approved ? "success" : "warning"}>
                      {p.is_approved ? "Live" : "Pending"}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Reviews" description={`${reviews.length} total`} />
            {reviews.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-clay-500">No reviews yet.</p>
            ) : (
              <ul className="divide-y divide-clay-100">
                {reviews.map((r) => (
                  <li key={r.id} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-clay-900">
                        {r.author_name}
                      </span>
                      <StarRating rating={r.rating} />
                    </div>
                    {r.comment && (
                      <p className="mt-1.5 text-sm leading-relaxed text-clay-600">{r.comment}</p>
                    )}
                    <p className="mt-1.5 text-xs text-clay-400">
                      {new Date(r.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Metadata" />
            <dl className="space-y-3 p-5">
              <div>
                <dt className="text-xs text-clay-400">Shop ID</dt>
                <dd className="mt-0.5 break-all font-mono text-xs text-clay-700">{shop.id}</dd>
              </div>
              <div>
                <dt className="text-xs text-clay-400">Vendor ID</dt>
                <dd className="mt-0.5 break-all font-mono text-xs text-clay-700">{shop.vendor_id}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
