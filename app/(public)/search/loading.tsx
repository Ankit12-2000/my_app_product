import { PageBannerSkeleton, ProductGridSkeleton, Skeleton } from "@/components/PageSkeleton";

export default function SearchLoading() {
  return (
    <div className="bg-clay-50">
      <PageBannerSkeleton />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[272px_1fr] lg:gap-8">
          <aside className="hidden space-y-4 lg:block">
            <Skeleton className="h-96 w-full rounded-xl" />
          </aside>
          <div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-clay-100 bg-white px-4 py-3 shadow-sm">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </div>
    </div>
  );
}