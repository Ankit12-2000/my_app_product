"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category, Material } from "@/types";

const cities = ["Jaipur", "Moradabad", "Mahabalipuram", "Delhi", "Kolkata"];
const finishes = ["Polished", "Antique", "Hand Painted", "Matte", "Golden"];

export function SearchFilters({
  categories,
  materials,
}: {
  categories: Category[];
  materials: Material[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/search?${next.toString()}`);
  }

  const Select = ({
    name,
    label,
    options,
  }: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
  }) => (
    <div>
      <label className="text-sm font-medium text-clay-900">{label}</label>
      <select
        value={params.get(name) ?? ""}
        onChange={(e) => update(name, e.target.value)}
        className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 text-sm outline-none focus:border-saffron-400"
      >
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  const hasFilters = Array.from(params.keys()).some((k) => k !== "q");

  return (
    <aside className="space-y-4 rounded-2xl border border-clay-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {hasFilters && (
          <button
            onClick={() => router.push(`/search${params.get("q") ? `?q=${params.get("q")}` : ""}`)}
            className="text-sm text-saffron-700 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <Select
        name="category"
        label="Category"
        options={categories.map((c) => ({ value: c.slug, label: c.name }))}
      />
      <Select
        name="material"
        label="Material"
        options={materials.map((m) => ({ value: m.slug, label: m.name }))}
      />
      <Select name="city" label="City" options={cities.map((c) => ({ value: c, label: c }))} />
      <Select name="finish" label="Finish" options={finishes.map((f) => ({ value: f, label: f }))} />

      <div>
        <label className="text-sm font-medium text-clay-900">Deity</label>
        <input
          defaultValue={params.get("deity") ?? ""}
          onBlur={(e) => update("deity", e.target.value.trim())}
          placeholder="e.g. Ganesha"
          className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 text-sm outline-none focus:border-saffron-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium text-clay-900">Min ₹</label>
          <input
            type="number"
            defaultValue={params.get("priceMin") ?? ""}
            onBlur={(e) => update("priceMin", e.target.value)}
            className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 text-sm outline-none focus:border-saffron-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-clay-900">Max ₹</label>
          <input
            type="number"
            defaultValue={params.get("priceMax") ?? ""}
            onBlur={(e) => update("priceMax", e.target.value)}
            className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 text-sm outline-none focus:border-saffron-400"
          />
        </div>
      </div>

      <Select
        name="sort"
        label="Sort by"
        options={[
          { value: "newest", label: "Newest" },
          { value: "price_asc", label: "Price: Low to High" },
          { value: "price_desc", label: "Price: High to Low" },
        ]}
      />
    </aside>
  );
}
