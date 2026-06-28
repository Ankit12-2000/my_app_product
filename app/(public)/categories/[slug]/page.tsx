import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryBySlug, searchProducts } from "@/lib/data/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await searchProducts({ category: slug });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-clay-700">
        <a href="/categories" className="hover:text-saffron-600">Categories</a> / {category.name}
      </nav>
      <h1 className="mt-2 text-2xl font-bold">{category.name}</h1>
      {category.description && <p className="mt-1 text-clay-700">{category.description}</p>}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-8 text-clay-700">No products in this category yet.</p>
      )}
    </div>
  );
}
