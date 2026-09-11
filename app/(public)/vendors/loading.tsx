import { Skeleton, ShopGridSkeleton } from "@/components/PageSkeleton";

export default function VendorsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-2 h-4 w-44" />
      <ShopGridSkeleton count={6} />
    </div>
  );
}