import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { SearchFilters } from "@/components/SearchFilters";
import { getCategories, getMaterials, searchProducts } from "@/lib/data/queries";
import type { ProductSearchFilters } from "@/types";

export const metadata: Metadata = { title: "Search Statues" };

function num(v: string | undefined) {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined));

  const filters: ProductSearchFilters = {
    q: get("q"),
    category: get("category"),
    material: get("material"),
    city: get("city"),
    deity: get("deity"),
    finish: get("finish"),
    priceMin: num(get("priceMin")),
    priceMax: num(get("priceMax")),
    sort: (get("sort") as ProductSearchFilters["sort"]) ?? "newest",
  };

  const [products, categories, materials] = await Promise.all([
    searchProducts(filters),
    getCategories(),
    getMaterials(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">
        {filters.q ? `Results for “${filters.q}”` : "All Statues"}
      </h1>
      <p className="mt-1 text-sm text-clay-700">{products.length} products found</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <SearchFilters categories={categories} materials={materials} />

        <div>
          {products.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-clay-100 py-24 text-center">
              <p className="text-lg font-medium">No statues match your filters</p>
              <p className="mt-1 text-clay-700">Try clearing some filters or searching a different term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
