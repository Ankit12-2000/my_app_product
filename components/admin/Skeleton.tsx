import { cn } from "@/lib/utils";
import { Card } from "@/components/admin/ui";

// Shared shimmer block. Admin navigation used to sit on a blank frame while
// the server fetched — these placeholders keep the layout stable instead.

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-clay-200/70", className)} />;
}

export function HeaderSkeleton() {
  return (
    <div className="border-b border-clay-200/70 pb-5">
      <Skeleton className="h-7 w-44" />
      <Skeleton className="mt-2.5 h-4 w-full max-w-md" />
    </div>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Skeleton className="h-10 w-full rounded-lg sm:w-64" />
      <Skeleton className="h-10 w-28 rounded-lg" />
      <Skeleton className="h-10 w-20 rounded-lg" />
      <Skeleton className="h-10 w-20 rounded-lg" />
    </div>
  );
}

/** Rows that read as a table on desktop and as cards on a phone. */
export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card>
      <div className="divide-y divide-clay-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 sm:px-5">
            <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2 max-w-[220px]" />
              <Skeleton className="h-3 w-1/3 max-w-[140px]" />
            </div>
            <Skeleton className="hidden h-6 w-16 rounded-md sm:block" />
            <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function StatGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-clay-200/70 bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="mt-4 h-8 w-14" />
        </div>
      ))}
    </div>
  );
}
