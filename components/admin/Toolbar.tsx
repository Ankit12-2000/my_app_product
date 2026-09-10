"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconSearch, IconSpinner, IconX } from "@/components/admin/icons";

/**
 * URL-driven list controls shared by every admin and vendor list screen.
 * Search is debounced and pushed into the query string so the server does the
 * filtering — the old screens fetched every row and filtered in the browser.
 */

function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  // Any control change resets to page 1 — page 4 of an old filter is meaningless.
  const setParam = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    next.delete("page");
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  return { setParam, pending, params };
}

export function SearchInput({
  placeholder = "Search…",
  paramName = "q",
  className,
}: {
  placeholder?: string;
  paramName?: string;
  className?: string;
}) {
  const { setParam, pending, params } = useQueryUpdater();
  const urlValue = params.get(paramName) ?? "";
  const [value, setValue] = useState(urlValue);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // What this input most recently pushed into the URL. Without it, the URL
  // update from a debounced push echoes back and overwrites whatever the user
  // typed during the round trip, so fast typing kept losing characters.
  const pushed = useRef(urlValue);

  // Adopt the URL only when it changed from somewhere else — back/forward
  // navigation, or a filter chip clearing the search.
  useEffect(() => {
    if (urlValue !== pushed.current) {
      pushed.current = urlValue;
      setValue(urlValue);
    }
  }, [urlValue]);

  const push = (next: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const trimmed = next.trim();
      pushed.current = trimmed;
      setParam({ [paramName]: trimmed || null });
    }, 300);
  };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div className={cn("relative min-w-0 flex-1 sm:max-w-xs", className)}>
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          push(e.target.value);
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-lg border border-clay-200 bg-white pl-9 pr-9 text-sm text-clay-900 placeholder:text-clay-400 outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/25 [&::-webkit-search-cancel-button]:hidden"
      />
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
        {pending ? (
          <IconSpinner className="h-4 w-4 animate-spin text-clay-400" />
        ) : value ? (
          <button
            type="button"
            onClick={() => {
              setValue("");
              if (timer.current) clearTimeout(timer.current);
              pushed.current = "";
              setParam({ [paramName]: null });
            }}
            aria-label="Clear search"
            className="grid h-5 w-5 place-items-center rounded text-clay-400 transition hover:bg-clay-100 hover:text-clay-700"
          >
            <IconX className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </span>
    </div>
  );
}

export function SortSelect({
  options,
  paramName = "sort",
}: {
  options: { value: string; label: string }[];
  paramName?: string;
}) {
  const { setParam, params } = useQueryUpdater();
  return (
    <select
      value={params.get(paramName) ?? options[0]?.value}
      onChange={(e) => setParam({ [paramName]: e.target.value })}
      aria-label="Sort by"
      className="h-10 shrink-0 rounded-lg border border-clay-200 bg-white px-3 text-sm font-medium text-clay-700 outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/25"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export type FilterTab = { value: string; label: string; count?: number };

/**
 * Filter chips rendered as real links so they work without JS and prefetch.
 * They preserve the current search term but always reset paging.
 */
export function FilterTabs({
  tabs,
  paramName = "status",
  defaultValue = "all",
}: {
  tabs: FilterTab[];
  paramName?: string;
  defaultValue?: string;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get(paramName) ?? defaultValue;

  const hrefFor = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === defaultValue) next.delete(paramName);
    else next.set(paramName, value);
    next.delete("page");
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <div className="admin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
      {tabs.map((tab) => {
        const active = tab.value === current;
        return (
          <Link
            key={tab.value}
            href={hrefFor(tab.value)}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition",
              active
                ? "border-clay-900 bg-clay-900 text-white"
                : "border-clay-200 bg-white text-clay-600 hover:border-clay-300 hover:text-clay-900"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "tabular rounded px-1.5 py-0.5 text-[10px] font-bold leading-none",
                  active ? "bg-white/20 text-white" : "bg-clay-100 text-clay-500"
                )}
              >
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

/** Search + filters + sort in one responsive row. */
export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}
