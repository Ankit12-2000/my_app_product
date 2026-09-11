import { ShelfSkeleton, ProductGridSkeleton } from "@/components/PageSkeleton";

export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="h-[240px] w-full animate-pulse rounded-xl bg-clay-200/70 sm:h-[300px]" />
      <div className="mt-8 space-y-8">
        <div className="space-y-3">
          <div className="h-6 w-56 animate-pulse rounded bg-clay-200/70" />
          <ShelfSkeleton items={6} />
          <div className="h-6 w-56 animate-pulse rounded bg-clay-200/70" />
          <ShelfSkeleton items={6} />
        </div>
        <div className="space-y-3">
          <div className="h-6 w-52 animate-pulse rounded bg-clay-200/70" />
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}