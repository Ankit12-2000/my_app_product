"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconChevronLeft, IconChevronRight } from "@/components/admin/icons";

/**
 * Pagination for the admin/vendor list screens. Renders nothing for a single
 * page, and keeps every other query param (search, filters, sort) intact.
 */
export function PageNav({
  page,
  pageCount,
  total,
  pageSize,
  label = "items",
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  label?: string;
}) {
  const pathname = usePathname();
  const params = useSearchParams();

  if (pageCount <= 1) return null;

  const hrefFor = (target: number) => {
    const next = new URLSearchParams(params.toString());
    if (target <= 1) next.delete("page");
    else next.set("page", String(target));
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-clay-200/70 px-4 py-3 sm:px-5">
      <p className="tabular text-xs text-clay-500">
        {first}–{last} of {total} {label}
      </p>
      <div className="flex items-center gap-1">
        <Step href={hrefFor(page - 1)} disabled={page <= 1} label="Previous page">
          <IconChevronLeft className="h-4 w-4" />
        </Step>
        <span className="tabular px-2 text-xs font-semibold text-clay-600">
          {page} / {pageCount}
        </span>
        <Step href={hrefFor(page + 1)} disabled={page >= pageCount} label="Next page">
          <IconChevronRight className="h-4 w-4" />
        </Step>
      </div>
    </div>
  );
}

function Step({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const base =
    "grid h-9 w-9 place-items-center rounded-lg border text-clay-600 transition";
  if (disabled) {
    return (
      <span aria-disabled className={cn(base, "border-clay-200/70 bg-clay-50 text-clay-300")}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      className={cn(base, "border-clay-200 bg-white hover:border-clay-300 hover:bg-clay-50 hover:text-clay-900")}
    >
      {children}
    </Link>
  );
}
