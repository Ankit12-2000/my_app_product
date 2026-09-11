import { Skeleton } from "@/components/PageSkeleton";

export default function ContactLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-clay-100 bg-white p-4">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3 rounded-2xl border border-clay-100 bg-white p-5">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}