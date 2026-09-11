import { Skeleton } from "@/components/PageSkeleton";

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-clay-200 bg-white">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}