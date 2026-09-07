import Link from "next/link";
import { cn } from "@/lib/utils";

// Builds the visible page list: first, last, current ±1, with "…" gaps.
function pageItems(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items: (number | "gap")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("gap");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages - 1) items.push("gap");
  items.push(totalPages);

  return items;
}

export function Pagination({
  page,
  totalPages,
  basePath = "/search",
  params,
  hash = "",
}: {
  page: number;
  totalPages: number;
  basePath?: string;
  /** Current query params, minus `page` — carried over on every link. */
  params: Record<string, string>;
  /** Optional anchor (e.g. "#results") so the grid stays in view after a jump. */
  hash?: string;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const next = new URLSearchParams(params);
    if (p > 1) next.set("page", String(p));
    else next.delete("page");
    const qs = next.toString();
    return `${basePath}${qs ? `?${qs}` : ""}${hash}`;
  };

  const arrow = "grid h-9 w-9 place-items-center rounded-full border text-sm transition";
  const inactive = "border-clay-100 bg-white text-clay-700 hover:border-saffron-300 hover:text-saffron-700";
  const disabled = "cursor-not-allowed border-clay-100 bg-clay-50 text-clay-300";

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-xs text-clay-500">
        Page <span className="font-semibold text-clay-900">{page}</span> of {totalPages}
      </p>

      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Link href={href(page - 1)} aria-label="Previous page" className={cn(arrow, inactive)}>
            ‹
          </Link>
        ) : (
          <span aria-hidden className={cn(arrow, disabled)}>
            ‹
          </span>
        )}

        {pageItems(page, totalPages).map((item, i) =>
          item === "gap" ? (
            <span key={`gap-${i}`} className="px-1 text-sm text-clay-400">
              …
            </span>
          ) : (
            <Link
              key={item}
              href={href(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "grid h-9 min-w-9 place-items-center rounded-full border px-3 text-sm transition",
                item === page
                  ? "border-saffron-600 bg-saffron-600 font-semibold text-white"
                  : inactive
              )}
            >
              {item}
            </Link>
          )
        )}

        {page < totalPages ? (
          <Link href={href(page + 1)} aria-label="Next page" className={cn(arrow, inactive)}>
            ›
          </Link>
        ) : (
          <span aria-hidden className={cn(arrow, disabled)}>
            ›
          </span>
        )}
      </div>
    </nav>
  );
}
