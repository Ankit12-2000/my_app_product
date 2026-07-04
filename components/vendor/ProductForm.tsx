"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Category, Material, Product } from "@/types";
import { ImageUploader } from "./ImageUploader";

type ProductState = { error?: string };
type ProductAction = (prev: ProductState, formData: FormData) => Promise<ProductState>;

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-6 py-2.5 font-bold text-white shadow-md shadow-saffron-200 transition hover:shadow-lg disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ProductForm({
  action,
  product,
  categories,
  materials,
  submitLabel,
  shopId,
}: {
  action: ProductAction;
  product?: Product | null;
  categories: Category[];
  materials: Material[];
  submitLabel: string;
  shopId: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const initialImages = (product?.images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);

  return (
    <form action={formAction} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* Basic info */}
      <div className="space-y-4">
        <Field name="name" label="Product name *" defaultValue={product?.name} required />
        <div>
          <label className="text-sm font-bold text-clay-700">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={product?.description ?? ""}
            className="mt-1.5 w-full rounded-xl border border-clay-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-clay-400 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
          />
        </div>
      </div>

      {/* Category & Material */}
      <div className="grid grid-cols-2 gap-4">
        <Select name="category_id" label="Category" defaultValue={product?.category_id ?? ""}
          options={categories.map((c) => ({ value: c.id, label: c.name }))} />
        <Select name="material_id" label="Material" defaultValue={product?.material_id ?? ""}
          options={materials.map((m) => ({ value: m.id, label: m.name }))} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field name="deity" label="Deity" defaultValue={product?.deity ?? ""} />
        <Field name="finish" label="Finish" defaultValue={product?.finish ?? ""} />
        <Field name="size" label="Size (label)" defaultValue={product?.size ?? ""} />
        <Field name="city" label="City" defaultValue={product?.city ?? ""} />
        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm font-bold text-clay-700">Height</label>
          <div className="mt-1.5 flex gap-2">
            <input
              name="height"
              type="number"
              step="any"
              min={0}
              defaultValue={product?.height_cm?.toString() ?? ""}
              className="w-full rounded-xl border border-clay-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
            />
            <select
              name="height_unit"
              defaultValue="cm"
              className="rounded-xl border border-clay-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
            >
              <option value="cm">cm</option>
              <option value="feet">feet</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <Field name="price_min" label="Price min (₹)" type="number" defaultValue={product?.price_min?.toString() ?? ""} />
        <Field name="price_max" label="Price max (₹)" type="number" defaultValue={product?.price_max?.toString() ?? ""} />
      </div>

      {/* Images */}
      <div className="border-t border-clay-100 pt-6">
        <ImageUploader shopId={shopId} initialUrls={initialImages} />
      </div>

      {/* Stock */}
      <label className="flex items-center gap-3 rounded-xl border border-clay-200 px-4 py-3 transition hover:bg-clay-50">
        <input type="checkbox" name="in_stock" defaultChecked={product ? product.in_stock : true} className="h-4 w-4 rounded border-clay-300 text-saffron-600 focus:ring-saffron-500" />
        <span className="text-sm font-medium text-clay-700">In stock / ready to ship</span>
      </label>

      {/* Error */}
      {state.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          <span>⚠️</span> {state.error}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-3">
        <Submit label={submitLabel} />
        <p className="text-xs text-clay-400">New products go live after admin approval.</p>
      </div>
    </form>
  );
}

function Field({
  name, label, type = "text", defaultValue, required,
}: {
  name: string; label: string; type?: string; defaultValue?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-clay-700">{label}</label>
      <input
        name={name}
        type={type}
        step={type === "number" ? "any" : undefined}
        required={required}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-xl border border-clay-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-clay-400 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
      />
    </div>
  );
}

function Select({
  name, label, defaultValue, options,
}: {
  name: string; label: string; defaultValue?: string; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-sm font-bold text-clay-700">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-xl border border-clay-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
