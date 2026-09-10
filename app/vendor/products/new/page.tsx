import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { getCategories, getMaterials } from "@/lib/data/queries";
import { createProduct } from "@/app/actions/vendor";
import { ProductForm } from "@/components/vendor/ProductForm";
import { PageHeader } from "@/components/admin/ui";
import { IconArrowLeft } from "@/components/admin/icons";

export default async function NewProductPage() {
  const { shop } = await requireVendorShop();
  const [categories, materials] = await Promise.all([getCategories(), getMaterials()]);

  return (
    <div className="space-y-6">
      <Link
        href="/vendor/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-clay-500 transition hover:text-clay-900"
      >
        <IconArrowLeft className="h-3.5 w-3.5" />
        Back to products
      </Link>
      <PageHeader title="Add product" description="Fill in the details to list a new murti." />
      <ProductForm
          action={createProduct}
          categories={categories}
          materials={materials}
          submitLabel="Create product"
          shopId={shop.id}
        />
    </div>
  );
}
