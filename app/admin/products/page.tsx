import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listAllProducts } from "@/lib/data/admin";
import { setProductApproval, setProductFeatured } from "@/app/actions/admin";
import { Thumb } from "@/components/Thumb";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon } from "@/lib/images";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await listAllProducts();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Products</h1>
      <p className="text-sm text-clay-700">Approve products to list them publicly, and feature standouts.</p>

      <div className="overflow-hidden rounded-2xl border border-clay-100 bg-white">
        {products.length === 0 ? (
          <p className="p-8 text-center text-clay-700">No products yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-clay-50 text-left text-clay-700">
              <tr>
                <th className="px-4 py-2 font-medium">Product</th>
                <th className="hidden px-4 py-2 font-medium md:table-cell">Vendor</th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">Price</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Feat.</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-clay-100 align-middle hover:bg-clay-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-clay-100">
                        <Thumb src={primaryImage(p)} alt={p.name} seed={p.slug} icon={deityIcon(p.deity)} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="font-medium text-clay-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-clay-700 md:table-cell">{p.shop?.name ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-clay-700 sm:table-cell">{priceLabel(p)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.is_approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {p.is_approved ? "Live" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={setProductFeatured}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="featured" value={(!p.is_featured).toString()} />
                      <button className="text-lg" title={p.is_featured ? "Unfeature" : "Feature"}>
                        {p.is_featured ? "⭐" : "☆"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <form action={setProductApproval}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="approve" value={(!p.is_approved).toString()} />
                        <button className={`rounded-full px-3 py-1.5 text-xs font-semibold text-white ${p.is_approved ? "bg-clay-700 hover:opacity-90" : "bg-green-600 hover:bg-green-700"}`}>
                          {p.is_approved ? "Unapprove" : "Approve"}
                        </button>
                      </form>
                      {p.is_approved && (
                        <Link href={`/products/${p.slug}`} className="text-xs text-saffron-700 hover:underline">
                          Public
                        </Link>
                      )}
                      <Link href={`/admin/products/${p.id}`} className="text-xs text-saffron-700 hover:underline">
                        Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
