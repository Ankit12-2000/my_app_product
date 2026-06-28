import Link from "next/link";
import { notFound } from "next/navigation";
import { requireVendorShop } from "@/lib/auth";
import { getCategories, getMaterials } from "@/lib/data/queries";
import { getVendorProduct } from "@/lib/data/vendor";
import { updateProduct } from "@/app/actions/vendor";
import { ProductForm } from "@/components/vendor/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { shop } = await requireVendorShop();
  const { id } = await params;
  const [product, categories, materials] = await Promise.all([
    getVendorProduct(shop.id, id),
    getCategories(),
    getMaterials(),
  ]);
  if (!product) notFound();

  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/vendor/products" className="text-sm text-saffron-700 hover:underline">
        ← Back to products
      </Link>
      <h1 className="text-2xl font-bold">Edit product</h1>
      <div className="rounded-2xl border border-clay-100 bg-white p-6">
        <ProductForm action={updateProduct} product={product} categories={categories} materials={materials} submitLabel="Save changes" shopId={shop.id} />
      </div>
    </div>
  );
}
