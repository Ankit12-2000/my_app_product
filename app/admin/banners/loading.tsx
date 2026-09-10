import { HeaderSkeleton, ListSkeleton, ToolbarSkeleton } from "@/components/admin/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-5">
      <HeaderSkeleton />
      <ToolbarSkeleton />
      <ListSkeleton />
    </div>
  );
}
