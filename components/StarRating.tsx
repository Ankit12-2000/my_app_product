import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className={cn("flex", size === "md" ? "text-base" : "text-sm")} aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= full ? "text-saffron-500" : "text-clay-100"}>
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-clay-700">
        {rating.toFixed(1)}
        {count != null && <span className="text-clay-700/70"> ({count})</span>}
      </span>
    </div>
  );
}
