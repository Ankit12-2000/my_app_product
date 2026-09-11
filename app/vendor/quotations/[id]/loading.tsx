import { Skeleton } from "@/components/admin/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-clay-100 sm:p-6">
          <Skeleton className="h-4 w-40" />
          <div className="mt-5 space-y-4">
            <table className="w-full">
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-2.5">
                      <Skeleton className="h-3 w-24" />
                    </td>
                    <td className="py-2.5">
                      <Skeleton className="h-3 w-44" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 border-t border-clay-100 pt-4">
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-clay-100">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-1.5 h-3 w-2/3" />
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-clay-100">
            <Skeleton className="h-4 w-32" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}