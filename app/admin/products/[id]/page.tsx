import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getProductAdmin } from "@/lib/data/admin";
import { setProductApproval, setProductFeatured } from "@/app/actions/admin";
import { Thumb } from "@/components/Thumb";
import { ProductGallery } from "@/components/ProductGallery";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon } from "@/lib/images";

export default async function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/products" className="text-sm text-saffron-700 hover:underline">← Back to products</Link>
          <h1 className="mt-2 text-2xl font-bold">Product Detail</h1>
        </div>
        <div className="flex items-center gap-2">
          <form action={setProductFeatured}>
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="featured" value={(!product.is_featured).toString()} />
            <button className="rounded-full px-3 py-1.5 text-sm font-semibold border border-clay-200 hover:bg-clay-50">
              {product.is_featured ? "⭐ Featured" : "☆ Feature"}
            </button>
          </form>
          <form action={setProductApproval}>
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="approve" value={(!product.is_approved).toString()} />
            <button className={`rounded-full px-4 py-1.5 text-sm font-semibold text-white ${product.is_approved ? "bg-clay-700 hover:opacity-90" : "bg-green-600 hover:bg-green-700"}`}>
              {product.is_approved ? "Unapprove" : "Approve"}
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-clay-100 bg-white p-4">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${product.is_approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {product.is_approved ? "Live" : "Pending"}
              </span>
              {product.is_featured && <span className="rounded-full bg-saffron-100 px-2.5 py-0.5 text-xs font-medium text-saffron-700">Featured</span>}
            </div>
            <p className="mt-1 text-sm text-clay-700">Slug: {product.slug}</p>
          </div>

          <div className="rounded-2xl border border-clay-100 bg-white p-4">
            <p className="text-2xl font-semibold text-saffron-700">{priceLabel(product)}</p>
            <p className="mt-1 text-sm text-clay-700">{product.in_stock ? "In stock · ready to ship" : "Made to order"}</p>
          </div>

          {product.description && (
            <div className="rounded-2xl border border-clay-100 bg-white p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-clay-700/70">Description</h3>
              <p className="mt-2 text-clay-700 whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          <div className="rounded-2xl border border-clay-100 bg-white p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-clay-700/70">Specifications</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
              {specs.filter((s) => s.value).map((s) => (
                <div key={s.label}>
                  <dt className="text-xs text-clay-700/70">{s.label}</dt>
                  <dd className="font-medium text-clay-900">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {product.video_url && (
            <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-saffron-700 hover:underline">
              ▶ Watch product video
            </a>
          )}
        </div>
      </div>

      {product.shop && (
        <div className="rounded-2xl border border-clay-100 bg-white p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-clay-700/70">Vendor</h3>
          <Link href={`/admin/vendors`} className="mt-3 flex items-center gap-3 transition hover:opacity-80">
            <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-clay-100 text-xl">
              <Thumb src={product.shop.logo_url} alt={product.shop.name} seed={product.shop.slug} icon="🏪" width={48} height={48} className="object-cover" />
            </span>
            <div>
              <p className="font-semibold">{product.shop.name}</p>
              <p className="text-sm text-clay-700">{product.shop.city}, {product.shop.state}</p>
              <p className="text-xs text-clay-700/70">{product.shop.email} · {product.shop.phone}</p>
            </div>
            <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${product.shop.is_approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {product.shop.is_approved ? "Approved" : "Pending"}
            </span>
          </Link>
        </div>
      )}

      <div className="rounded-2xl border border-clay-100 bg-white p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-clay-700/70">Metadata</h3>
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-4">
          <div>
            <dt className="text-clay-700/70">Product ID</dt>
            <dd className="font-mono text-xs text-clay-900">{product.id}</dd>
          </div>
          <div>
            <dt className="text-clay-700/70">Images</dt>
            <dd className="text-clay-900">{product.images.length} uploaded</dd>
          </div>
          <div>
            <dt className="text-clay-700/70">Shop ID</dt>
            <dd className="font-mono text-xs text-clay-900">{product.shop_id}</dd>
          </div>
          <div>
            <dt className="text-clay-700/70">Video</dt>
            <dd className="text-clay-900">{product.video_url ? "Yes" : "None"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
