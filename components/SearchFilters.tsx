"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Category, Material } from "@/types";
import { cn } from "@/lib/utils";

const cities = ["Jaipur", "Moradabad", "Mahabalipuram", "Delhi", "Kolkata"];
const finishes = ["Polished", "Antique", "Hand Painted", "Matte", "Golden"];
const popularDeities = ["Ganesha", "Krishna", "Buddha", "Lakshmi", "Shiva", "Durga"];

// Keys that count as a "filter" (q drives the search itself, sort lives in the toolbar).
const FILTER_KEYS = ["category", "material", "city", "finish", "deity", "priceMin", "priceMax"];

type Option = { value: string; label: string };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-clay-500">
      {children}
    </span>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none rounded-xl border bg-clay-50/60 py-2.5 pl-3 pr-9 text-sm text-clay-900 outline-none transition",
            "hover:border-clay-200 focus:border-saffron-400 focus:bg-white focus:ring-2 focus:ring-saffron-100",
            value ? "border-saffron-300 bg-saffron-50/70 font-medium" : "border-clay-100"
          )}
        >
          <option value="">Any</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
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
      </div>
    </label>
  );
}

export function SearchFilters({
  categories,
  materials,
}: {
  categories: Category[];
  materials: Material[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [openOnMobile, setOpenOnMobile] = useState(false);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // a changed filter always starts back at page 1
    router.push(`/search?${next.toString()}`);
  }

  function clearAll() {
    const q = params.get("q");
    const sort = params.get("sort");
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (sort) next.set("sort", sort);
    const qs = next.toString();
    router.push(`/search${qs ? `?${qs}` : ""}`);
  }

  const value = (key: string) => params.get(key) ?? "";
  const activeCount = FILTER_KEYS.filter((k) => params.get(k)).length;
  const deity = value("deity");

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-clay-100 bg-white shadow-sm">
        {/* Header doubles as the collapse toggle on small screens. */}
        <div className="flex items-center justify-between gap-2 border-b border-clay-100 px-4 py-3">
          <button
            type="button"
            onClick={() => setOpenOnMobile((v) => !v)}
            className="flex items-center gap-2 text-left lg:pointer-events-none"
            aria-expanded={openOnMobile}
          >
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              className="h-4 w-4 text-clay-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M3 5h14M6 10h8M8.5 15h3" />
            </svg>
            <span className="font-semibold text-clay-900">Filters</span>
            {activeCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-saffron-600 px-1.5 text-[11px] font-semibold text-white">
                {activeCount}
              </span>
            )}
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              className={cn(
                "h-4 w-4 text-clay-400 transition lg:hidden",
                openOnMobile && "rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="rounded-full px-2 py-1 text-xs font-medium text-saffron-700 transition hover:bg-saffron-50"
            >
              Clear all
            </button>
          )}
        </div>

        <div className={cn("space-y-5 p-4", openOnMobile ? "block" : "hidden lg:block")}>
          <FilterSelect
            label="Category"
            value={value("category")}
            options={categories.map((c) => ({ value: c.slug, label: c.name }))}
            onChange={(v) => update("category", v)}
          />
          <FilterSelect
            label="Material"
            value={value("material")}
            options={materials.map((m) => ({ value: m.slug, label: m.name }))}
            onChange={(v) => update("material", v)}
          />
          <FilterSelect
            label="City"
            value={value("city")}
            options={cities.map((c) => ({ value: c, label: c }))}
            onChange={(v) => update("city", v)}
          />
          <FilterSelect
            label="Finish"
            value={value("finish")}
            options={finishes.map((f) => ({ value: f, label: f }))}
            onChange={(v) => update("finish", v)}
          />

          <div>
            <FieldLabel>Deity</FieldLabel>
            <input
              key={deity}
              defaultValue={deity}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v !== deity) update("deity", v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              placeholder="e.g. Ganesha"
              className="w-full rounded-xl border border-clay-100 bg-clay-50/60 px-3 py-2.5 text-sm outline-none transition placeholder:text-clay-400 hover:border-clay-200 focus:border-saffron-400 focus:bg-white focus:ring-2 focus:ring-saffron-100"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {popularDeities.map((d) => {
                const selected = deity.toLowerCase() === d.toLowerCase();
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => update("deity", selected ? "" : d)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs transition",
                      selected
                        ? "border-saffron-300 bg-saffron-100 font-medium text-saffron-800"
                        : "border-clay-100 bg-clay-50 text-clay-600 hover:border-saffron-200 hover:bg-saffron-50 hover:text-saffron-700"
                    )}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <FieldLabel>Price range (₹)</FieldLabel>
            <div className="flex items-center gap-2">
              <PriceInput
                placeholder="Min"
                value={value("priceMin")}
                onCommit={(v) => update("priceMin", v)}
              />
              <span className="text-clay-300">–</span>
              <PriceInput
                placeholder="Max"
                value={value("priceMax")}
                onCommit={(v) => update("priceMax", v)}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PriceInput({
  value,
  placeholder,
  onCommit,
}: {
  value: string;
  placeholder: string;
  onCommit: (value: string) => void;
}) {
  return (
    <div className="relative flex-1">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-clay-400">
        ₹
      </span>
      <input
        key={value}
        type="number"
        min={0}
        inputMode="numeric"
        defaultValue={value}
        placeholder={placeholder}
        onBlur={(e) => {
          const v = e.target.value.trim();
          if (v !== value) onCommit(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className={cn(
          "w-full rounded-xl border bg-clay-50/60 py-2.5 pl-7 pr-2 text-sm outline-none transition",
          "placeholder:text-clay-400 hover:border-clay-200 focus:border-saffron-400 focus:bg-white focus:ring-2 focus:ring-saffron-100",
          value ? "border-saffron-300 bg-saffron-50/70 font-medium" : "border-clay-100"
        )}
      />
    </div>
  );
}
