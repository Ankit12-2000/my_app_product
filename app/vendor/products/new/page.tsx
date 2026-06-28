import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { getCategories, getMaterials } from "@/lib/data/queries";
import { createProduct } from "@/app/actions/vendor";
import { ProductForm } from "@/components/vendor/ProductForm";

export default async function NewProductPage() {
  const { shop } = await requireVendorShop();
  const [categories, materials] = await Promise.all([getCategories(), getMaterials()]);

  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/vendor/products" className="text-sm text-saffron-700 hover:underline">
        ← Back to products
      </Link>
      <h1 className="text-2xl font-bold">Add product</h1>
      <div className="rounded-2xl border border-clay-100 bg-white p-6">
        <ProductForm action={createProduct} categories={categories} materials={materials} submitLabel="Create product" shopId={shop.id} />
      </div>
    </div>
  );
}
