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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-clay-900">Products</h1>
          <p className="mt-1 text-sm text-clay-500">{products.length} product{products.length !== 1 ? "s" : ""} in your shop</p>
        </div>
        <Link
          href="/vendor/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-saffron-200 transition hover:shadow-xl"
        >
          <span className="text-lg">+</span> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-white py-20 text-center ring-1 ring-clay-100">
          <p className="text-5xl">📦</p>
          <p className="mt-4 text-lg font-bold text-clay-700">No products yet</p>
          <p className="mt-1 text-sm text-clay-500">Add your first statue to start receiving inquiries</p>
          <Link
            href="/vendor/products/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-saffron-200 transition hover:shadow-xl"
          >
            <span className="text-lg">+</span> Add your first product
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-clay-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden bg-clay-100">
                <Thumb src={primaryImage(p)} alt={p.name} seed={p.slug} icon={deityIcon(p.deity)} caption={p.deity} fill sizes="33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className={`absolute left-2.5 top-2.5 rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm ${p.is_approved ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>
                  {p.is_approved ? "Live" : "Pending"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="truncate font-bold text-clay-900">{p.name}</h3>
                <p className="mt-1 text-sm font-bold text-saffron-700">{priceLabel(p)}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/vendor/products/${p.id}/edit`}
                    className="flex-1 rounded-xl border border-clay-200 px-3 py-2 text-center text-sm font-medium text-clay-700 transition hover:border-clay-300 hover:bg-clay-50"
                  >
                    Edit
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50">
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
