import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SearchFilters } from "@/components/SearchFilters";
import { ActiveFilterChips, SortSelect } from "@/components/SearchToolbar";
import { Pagination } from "@/components/Pagination";
import { getCategories, getMaterials, searchProductsPage } from "@/lib/data/queries";
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

  const requestedPage = Math.max(1, Number(get("page")) || 1);

  const [paged, categories, materials] = await Promise.all([
    searchProductsPage(filters, requestedPage),
    getCategories(),
    getMaterials(),
  ]);

  const { products, total, page, totalPages, perPage } = paged;
  const firstOnPage = total === 0 ? 0 : (page - 1) * perPage + 1;
  const lastOnPage = Math.min(page * perPage, total);

  // Query params carried over by pagination links (page itself is re-added).
  const carried: Record<string, string> = {};
  for (const key of Object.keys(sp)) {
    if (key === "page") continue;
    const v = get(key);
    if (v) carried[key] = v;
  }

  return (
    <div className="bg-clay-50">
      {/* Page banner: sets context and separates the catalog from the site chrome. */}
      <div className="border-b border-clay-100 bg-gradient-to-b from-white to-clay-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
          <nav className="flex items-center gap-1.5 text-xs text-clay-500">
            <Link href="/" className="transition hover:text-saffron-700">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-clay-700">{filters.q ? "Search" : "All Statues"}</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-clay-900 sm:text-3xl">
            {filters.q ? (
              <>
                Results for <span className="text-saffron-700">“{filters.q}”</span>
              </>
            ) : (
              "All Statues"
            )}
          </h1>
          <p className="mt-1.5 text-sm text-clay-500">
            Handpicked murtis from verified vendors across India.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[272px_1fr] lg:gap-8">
          <SearchFilters categories={categories} materials={materials} />

          <div>
            <div
              id="results"
              className="flex scroll-mt-32 flex-wrap items-center justify-between gap-3 rounded-2xl border border-clay-100 bg-white px-4 py-3 shadow-sm"
            >
              <p className="text-sm text-clay-500">
                {total > 0 ? (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-clay-900">
                      {firstOnPage}–{lastOnPage}
                    </span>{" "}
                    of <span className="font-semibold text-clay-900">{total}</span>{" "}
                    {total === 1 ? "product" : "products"}
                  </>
                ) : (
                  "No products found"
                )}
              </p>
              <SortSelect />
            </div>

            <ActiveFilterChips
              categories={categories}
              materials={materials}
              className="mt-3"
            />

            {products.length === 0 ? (
              <div className="mt-4 grid place-items-center rounded-2xl border border-dashed border-clay-200 bg-white/60 px-6 py-20 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-clay-100 text-2xl">
                  🔍
                </span>
                <p className="mt-4 text-lg font-semibold text-clay-900">
                  No statues match your filters
                </p>
                <p className="mt-1 max-w-sm text-sm text-clay-500">
                  Try clearing a filter or two, or search a different deity, material or city.
                </p>
                <Link
                  href="/search"
                  className="mt-5 rounded-full bg-saffron-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-saffron-700"
                >
                  Browse all statues
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  params={carried}
                  hash="#results"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
