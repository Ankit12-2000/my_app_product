import { Skeleton, StatGridSkeleton } from "@/components/admin/Skeleton";

export default function VendorLoading() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-2 h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl sm:w-40" />
      </div>
      <StatGridSkeleton count={4} />
      <div className="overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-clay-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-clay-100 py-3 last:border-0">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
