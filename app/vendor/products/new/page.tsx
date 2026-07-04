import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { getCategories, getMaterials } from "@/lib/data/queries";
import { createProduct } from "@/app/actions/vendor";
import { ProductForm } from "@/components/vendor/ProductForm";

export default async function NewProductPage() {
  const { shop } = await requireVendorShop();
  const [categories, materials] = await Promise.all([getCategories(), getMaterials()]);

  return (
    <div className="max-w-3xl space-y-5">
      <Link
        href="/vendor/products"
        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-saffron-700 transition hover:bg-saffron-50"
      >
        ← Back to products
      </Link>
      <div>
        <h1 className="text-2xl font-extrabold text-clay-900">Add Product</h1>
        <p className="mt-1 text-sm text-clay-500">Fill in the details to list a new product</p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100 sm:p-8">
        <ProductForm action={createProduct} categories={categories} materials={materials} submitLabel="Create product" shopId={shop.id} />
      </div>
    </div>
  );
}
