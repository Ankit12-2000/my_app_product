import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getShopAdmin } from "@/lib/data/admin";
import { setShopApproval, setShopFeatured } from "@/app/actions/admin";
import { Thumb } from "@/components/Thumb";
import { StarRating } from "@/components/StarRating";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon } from "@/lib/images";

export default async function AdminVendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const result = await getShopAdmin(id);
  if (!result) notFound();
  const { shop, products, reviews } = result;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/vendors" className="text-sm text-saffron-700 hover:underline">← Back to vendors</Link>
          <h1 className="mt-2 text-2xl font-bold">Vendor Detail</h1>
        </div>
        <div className="flex items-center gap-2">
          <form action={setShopFeatured}>
            <input type="hidden" name="id" value={shop.id} />
            <input type="hidden" name="featured" value={(!shop.is_featured).toString()} />
            <button className="rounded-full px-3 py-1.5 text-sm font-semibold border border-clay-200 hover:bg-clay-50">
              {shop.is_featured ? "⭐ Featured" : "☆ Feature"}
            </button>
          </form>
          <form action={setShopApproval}>
            <input type="hidden" name="id" value={shop.id} />
            <input type="hidden" name="approve" value={(!shop.is_approved).toString()} />
            <button className={`rounded-full px-4 py-1.5 text-sm font-semibold text-white ${shop.is_approved ? "bg-clay-700 hover:opacity-90" : "bg-green-600 hover:bg-green-700"}`}>
              {shop.is_approved ? "Unapprove" : "Approve"}
            </button>
          </form>
        </div>
      </div>

      {shop.banner_url && (
        <div className="relative h-48 overflow-hidden rounded-2xl border border-clay-100 bg-clay-100">
          <Thumb src={shop.banner_url} alt={`${shop.name} banner`} seed={shop.slug} fill sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border border-clay-100 bg-white p-5">
            <div className="flex items-start gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-clay-100 text-2xl">
                <Thumb src={shop.logo_url} alt={shop.name} seed={shop.slug} icon="🏪" width={64} height={64} className="object-cover" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{shop.name}</h2>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${shop.is_approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {shop.is_approved ? "Approved" : "Pending"}
                  </span>
                  {shop.is_featured && <span className="rounded-full bg-saffron-100 px-2.5 py-0.5 text-xs font-medium text-saffron-700">Featured</span>}
                </div>
                {shop.tagline && <p className="mt-1 text-clay-700">{shop.tagline}</p>}
                <p className="mt-1 text-xs text-clay-700/70">Slug: {shop.slug}</p>
              </div>
            </div>
            {shop.description && <p className="mt-4 text-clay-700 whitespace-pre-wrap">{shop.description}</p>}
          </div>

          <div className="rounded-2xl border border-clay-100 bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-clay-700/70">Contact Information</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
              <div>
                <dt className="text-clay-700/70">City</dt>
                <dd className="font-medium text-clay-900">{shop.city || "—"}</dd>
              </div>
              <div>
                <dt className="text-clay-700/70">State</dt>
                <dd className="font-medium text-clay-900">{shop.state || "—"}</dd>
              </div>
              <div>
                <dt className="text-clay-700/70">Phone</dt>
                <dd className="font-medium text-clay-900">{shop.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-clay-700/70">Email</dt>
                <dd className="font-medium text-clay-900">{shop.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-clay-700/70">WhatsApp</dt>
                <dd className="font-medium text-clay-900">{shop.whatsapp || "—"}</dd>
              </div>
              <div>
                <dt className="text-clay-700/70">Rating</dt>
                <dd className="flex items-center gap-2">
                  <StarRating rating={shop.rating} />
                  <span className="text-clay-700">({shop.review_count})</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-clay-100 bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-clay-700/70">Products ({products.length})</h3>
            {products.length === 0 ? (
              <p className="mt-3 text-sm text-clay-700">No products yet.</p>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center gap-3 rounded-xl border border-clay-100 p-3 transition hover:shadow">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-clay-100">
                      <Thumb src={primaryImage(p)} alt={p.name} seed={p.slug} icon={deityIcon(p.deity)} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-clay-900">{p.name}</p>
                      <p className="text-xs text-saffron-700">{priceLabel(p)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${p.is_approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {p.is_approved ? "Live" : "Pending"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-clay-100 bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-clay-700/70">Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-clay-700">No reviews yet.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-clay-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-clay-900">{r.author_name}</span>
                      <StarRating rating={r.rating} />
                    </div>
                    {r.comment && <p className="mt-1 text-sm text-clay-700">{r.comment}</p>}
                    <p className="mt-1 text-xs text-clay-700/50">{new Date(r.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-clay-100 bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-clay-700/70">Metadata</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-clay-700/70">Shop ID</dt>
                <dd className="font-mono text-xs text-clay-900">{shop.id}</dd>
              </div>
              <div>
                <dt className="text-clay-700/70">Vendor ID</dt>
                <dd className="font-mono text-xs text-clay-900">{shop.vendor_id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
