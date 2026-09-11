import { FormCardSkeleton, Skeleton } from "@/components/PageSkeleton";

export default function SellLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Skeleton className="h-8 w-72" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <FormCardSkeleton />
      </div>
    </div>
  );
}