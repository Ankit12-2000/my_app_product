import { Skeleton } from "@/components/admin/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-clay-100 sm:p-6">
          <div className="flex flex-wrap items-center gap-3 border-b border-clay-100 pb-4">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-3 w-28 shrink-0" />
                <Skeleton className="h-3 w-full max-w-md" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-clay-100">
            <Skeleton className="h-4 w-24" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-clay-100">
            <Skeleton className="h-3 w-32" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}