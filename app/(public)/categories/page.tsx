import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard";
import { getCategoriesWithProducts } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await getCategoriesWithProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">All Categories</h1>
      {categories.length === 0 ? (
        <p className="mt-6 text-clay-600">No categories to show yet. Please check back soon.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      )}
    </div>
  );
}
