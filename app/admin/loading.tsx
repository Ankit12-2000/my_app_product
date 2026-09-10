import { HeaderSkeleton, StatGridSkeleton } from "@/components/admin/Skeleton";

// Dashboard-shaped placeholder. List sections override this with their own.
export default function AdminLoading() {
  return (
    <div className="space-y-7">
      <HeaderSkeleton />
      <StatGridSkeleton count={4} />
      <StatGridSkeleton count={4} />
    </div>
  );
}
