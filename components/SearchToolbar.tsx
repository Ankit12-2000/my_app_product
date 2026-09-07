"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category, Material } from "@/types";
import { cn, formatPrice } from "@/lib/utils";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const CHIP_LABELS: Record<string, string> = {
  q: "Search",
  category: "Category",
  material: "Material",
  city: "City",
  finish: "Finish",
  deity: "Deity",
  priceMin: "Min",
  priceMax: "Max",
};

const CHIP_ORDER = ["q", "category", "material", "city", "finish", "deity", "priceMin", "priceMax"];

function useParamActions() {
  const router = useRouter();
  const params = useSearchParams();

  const push = (next: URLSearchParams) => {
    const qs = next.toString();
    router.push(`/search${qs ? `?${qs}` : ""}`);
  };

  return {
    params,
    set(key: string, value: string) {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page"); // sorting differently means starting from page 1
      push(next);
    },
    remove(key: string) {
      const next = new URLSearchParams(params.toString());
      next.delete(key);
      next.delete("page");
      push(next);
    },
    clearAll() {
      const next = new URLSearchParams();
      const sort = params.get("sort");
      if (sort) next.set("sort", sort);
      push(next);
    },
  };
}

export function SortSelect() {
  const { params, set } = useParamActions();
  const value = params.get("sort") ?? "newest";

  return (
    <label className="flex items-center gap-2 text-sm text-clay-500">
      <span className="hidden sm:inline">Sort</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => set("sort", e.target.value === "newest" ? "" : e.target.value)}
          className="appearance-none rounded-full border border-clay-100 bg-white py-2 pl-3.5 pr-9 text-sm font-medium text-clay-900 outline-none transition hover:border-clay-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
          aria-label="Sort products"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}

export function ActiveFilterChips({
  categories,
  materials,
  className,
}: {
  categories: Category[];
  materials: Material[];
  className?: string;
}) {
  const { params, remove, clearAll } = useParamActions();

  function chipValue(key: string, raw: string) {
    if (key === "category") return categories.find((c) => c.slug === raw)?.name ?? raw;
    if (key === "material") return materials.find((m) => m.slug === raw)?.name ?? raw;
    if (key === "priceMin" || key === "priceMax") {
      const n = Number(raw);
      return Number.isFinite(n) ? formatPrice(n) : raw;
    }
    return raw;
  }

  const chips = CHIP_ORDER.filter((k) => params.get(k)).map((k) => ({
    key: k,
    label: CHIP_LABELS[k],
    value: chipValue(k, params.get(k) as string),
  }));

  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => remove(chip.key)}
          className="group flex items-center gap-1.5 rounded-full border border-clay-100 bg-white py-1.5 pl-3 pr-2 text-xs text-clay-700 shadow-sm transition hover:border-saffron-300 hover:text-saffron-800"
        >
          <span className="text-clay-400 group-hover:text-saffron-500">{chip.label}:</span>
          <span className="font-medium">{chip.value}</span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5 text-clay-400 transition group-hover:text-saffron-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l8 8M14 6l-8 8" />
          </svg>
          <span className="sr-only">Remove {chip.label} filter</span>
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={clearAll}
          className="rounded-full px-2 py-1 text-xs font-medium text-saffron-700 transition hover:bg-saffron-50"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
