import Link from "next/link";
import { notFound } from "next/navigation";
import { requireVendorShop } from "@/lib/auth";
import { getCategories, getMaterials } from "@/lib/data/queries";
import { getVendorProduct } from "@/lib/data/vendor";
import { updateProduct } from "@/app/actions/vendor";
import { ProductForm } from "@/components/vendor/ProductForm";
import { PageHeader } from "@/components/admin/ui";
import { IconArrowLeft } from "@/components/admin/icons";

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
    <div className="space-y-6">
      <Link
        href="/vendor/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-clay-500 transition hover:text-clay-900"
      >
        <IconArrowLeft className="h-3.5 w-3.5" />
        Back to products
      </Link>
      <PageHeader title="Edit product" description={product.name} />
      <ProductForm
          action={updateProduct}
          product={product}
          categories={categories}
          materials={materials}
          submitLabel="Save changes"
          shopId={shop.id}
        />
    </div>
  );
}
