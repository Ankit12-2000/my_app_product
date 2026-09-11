import { PageBannerSkeleton, ProductGridSkeleton } from "@/components/PageSkeleton";

export default function CategoriesLoading() {
  return (
    <div>
      <PageBannerSkeleton />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}