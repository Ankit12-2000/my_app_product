import { cn } from "@/lib/utils";

// Reusable public-page skeleton blocks. Server components only — they render
// instantly while the page's data is being fetched, so navigation never sits
// on a blank screen.

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-clay-200/70", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-clay-200 bg-white">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ShopCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-clay-200 bg-white p-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function ShopGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ShopCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Row of thumbnail-style cards used by category shelves on the home page. */
export function ShelfSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-clay-200 bg-white">
          <Skeleton className="aspect-square rounded-none" />
          <div className="space-y-1.5 p-2.5">
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Page banner used on internal pages (search, categories…). */
export function PageBannerSkeleton() {
  return (
    <div className="border-b border-clay-100 bg-gradient-to-b from-white to-clay-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-3 h-8 w-64 max-w-full" />
        <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      </div>
    </div>
  );
}

/** Two-column product detail layout. */
export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5 pb-28 sm:py-8">
      <Skeleton className="h-3 w-72 max-w-full" />
      <div className="mt-4 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div>
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <Skeleton className="h-16 w-16 rounded-lg" />
            <Skeleton className="h-16 w-16 rounded-lg" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-7 w-3/4 max-w-md" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-8 w-full max-w-md" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Full shop storefront page. */
export function ShopPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-clay-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl bg-white/15" />
            <Skeleton className="h-4 w-40 bg-white/15" />
          </div>
          <Skeleton className="h-8 w-28 rounded-lg bg-white/15" />
        </div>
      </div>
      <div className="flex min-h-[55vh] items-center bg-clay-900 sm:min-h-[65vh]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <Skeleton className="h-20 w-20 rounded-2xl bg-white/15 sm:h-28 sm:w-28" />
            <div className="w-full max-w-md space-y-3">
              <Skeleton className="h-10 w-3/4 bg-white/15" />
              <Skeleton className="h-4 w-1/2 bg-white/15" />
              <Skeleton className="h-10 w-48 rounded-xl bg-white/15" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}

/** Generic centered form card (login/signup/sell/contact). */
export function FormCardSkeleton({ heading, rows = 4 }: { heading?: boolean; rows?: number }) {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      {heading && <Skeleton className="mx-auto h-7 w-48" />}
      <div className="mt-6 space-y-4 rounded-2xl border border-clay-200 bg-white p-5 sm:p-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

/** Single centred article. */
export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-3 h-8 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-6 aspect-video w-full rounded-2xl" />
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}