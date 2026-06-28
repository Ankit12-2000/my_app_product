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
      className="rounded-full bg-saffron-600 px-6 py-2.5 font-semibold text-white transition hover:bg-saffron-700 disabled:opacity-60"
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
    <form action={formAction} className="space-y-4">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Field name="name" label="Product name *" defaultValue={product?.name} required />

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select name="category_id" label="Category" defaultValue={product?.category_id ?? ""}
          options={categories.map((c) => ({ value: c.id, label: c.name }))} />
        <Select name="material_id" label="Material" defaultValue={product?.material_id ?? ""}
          options={materials.map((m) => ({ value: m.id, label: m.name }))} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field name="deity" label="Deity" defaultValue={product?.deity ?? ""} />
        <Field name="finish" label="Finish" defaultValue={product?.finish ?? ""} />
        <Field name="size" label="Size (label)" defaultValue={product?.size ?? ""} />
        <Field name="city" label="City" defaultValue={product?.city ?? ""} />

        {/* Height with cm / feet unit */}
        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm font-medium">Height</label>
          <div className="mt-1 flex gap-2">
            <input
              name="height"
              type="number"
              step="any"
              min={0}
              defaultValue={product?.height_cm?.toString() ?? ""}
              className="w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
            />
            <select
              name="height_unit"
              defaultValue="cm"
              className="rounded-lg border border-clay-100 bg-white px-2 py-2 text-sm outline-none focus:border-saffron-400"
            >
              <option value="cm">cm</option>
              <option value="feet">feet</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field name="price_min" label="Price min (₹)" type="number" defaultValue={product?.price_min?.toString() ?? ""} />
        <Field name="price_max" label="Price max (₹)" type="number" defaultValue={product?.price_max?.toString() ?? ""} />
      </div>

      <ImageUploader shopId={shopId} initialUrls={initialImages} />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="in_stock" defaultChecked={product ? product.in_stock : true} />
        In stock / ready to ship
      </label>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <Submit label={submitLabel} />
        <p className="text-xs text-clay-700/70">New products go live after admin approval.</p>
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
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        step={type === "number" ? "any" : undefined}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
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
      <label className="text-sm font-medium">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 text-sm outline-none focus:border-saffron-400"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
