import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { listVendorProducts } from "@/lib/data/vendor";
import { deleteProduct } from "@/app/actions/vendor";
import { Thumb } from "@/components/Thumb";
import { priceLabel, primaryImage } from "@/lib/utils";
import { deityIcon } from "@/lib/images";

export default async function VendorProductsPage() {
  const { shop } = await requireVendorShop();
  const products = await listVendorProducts(shop.id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/vendor/products/new"
          className="rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700"
        >
          + Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-clay-100 bg-white p-12 text-center">
          <p className="text-lg font-medium">No products yet</p>
          <p className="mt-1 text-clay-700">Add your first statue to start receiving inquiries.</p>
          <Link
            href="/vendor/products/new"
            className="mt-4 inline-block rounded-full bg-saffron-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-saffron-700"
          >
            + Add product
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-clay-100 bg-white">
              <div className="relative aspect-square overflow-hidden bg-clay-100">
                <Thumb src={primaryImage(p)} alt={p.name} seed={p.slug} icon={deityIcon(p.deity)} caption={p.deity} fill sizes="33vw" className="object-cover" />
                <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-xs font-medium ${p.is_approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {p.is_approved ? "Live" : "Pending"}
                </span>
              </div>
              <div className="p-3">
                <h3 className="clamp-2 font-medium">{p.name}</h3>
                <p className="mt-1 text-sm font-semibold text-saffron-700">{priceLabel(p)}</p>
                <div className="mt-3 flex gap-2 text-sm">
                  <Link
                    href={`/vendor/products/${p.id}/edit`}
                    className="flex-1 rounded-lg border border-clay-100 px-3 py-1.5 text-center font-medium text-clay-700 hover:bg-clay-50"
                  >
                    Edit
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rounded-lg border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
