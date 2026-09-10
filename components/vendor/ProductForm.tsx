"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Category, Material, Product } from "@/types";
import { ImageUploader } from "./ImageUploader";

type ProductState = { error?: string };
type ProductAction = (prev: ProductState, formData: FormData) => Promise<ProductState>;

const control =
  "h-11 w-full rounded-lg border border-clay-200 bg-white px-3.5 text-sm text-clay-900 outline-none transition placeholder:text-clay-400 focus:border-saffron-500 focus:ring-4 focus:ring-saffron-500/10";

type TabKey = "general" | "attributes" | "inventory";

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
  const [tab, setTab] = useState<TabKey>("general");
  const initialImages = (product?.images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "general", label: "General", icon: "₹" },
    { key: "attributes", label: "Attributes", icon: "☰" },
    { key: "inventory", label: "Inventory", icon: "▣" },
  ];

  return (
    <form action={formAction} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      {state.error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span className="mt-0.5">⚠</span>
          <span>{state.error}</span>
        </div>
      )}

      {/* Product title — WooCommerce-style bare title at the top */}
      <div className="rounded-xl border border-clay-200/80 bg-white p-4">
        <input
          name="name"
          required
          defaultValue={product?.name ?? ""}
          placeholder="Product name"
          aria-label="Product name"
          className="w-full border-0 bg-transparent px-1 text-xl font-semibold text-clay-900 outline-none placeholder:text-clay-300 sm:text-2xl"
        />
      </div>

      {/* Two-column meta-box layout */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ---------------- Main column ---------------- */}
        <div className="space-y-5">
          <MetaBox title="Product description">
            <textarea
              name="description"
              rows={6}
              defaultValue={product?.description ?? ""}
              placeholder="Describe the murti — materials, craftsmanship, customisation…"
              className="w-full rounded-lg border border-clay-200 bg-white px-3.5 py-3 text-sm text-clay-900 outline-none transition placeholder:text-clay-400 focus:border-saffron-500 focus:ring-4 focus:ring-saffron-500/10"
            />
          </MetaBox>

          <MetaBox title="Product data" bodyClassName="p-0">
            <div className="flex flex-col sm:flex-row">
              {/* Tabs */}
              <div
                role="tablist"
                aria-label="Product data"
                className="admin-scroll flex shrink-0 gap-1 overflow-x-auto border-b border-clay-200/70 p-2 sm:w-44 sm:flex-col sm:gap-0.5 sm:border-b-0 sm:border-r"
              >
                {tabs.map((t) => {
                  const active = tab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(t.key)}
                      className={`flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition ${
                        active
                          ? "bg-saffron-50 text-saffron-700 sm:bg-clay-100 sm:text-clay-900"
                          : "text-clay-500 hover:bg-clay-50 hover:text-clay-900"
                      }`}
                    >
                      <span className="text-clay-400">{t.icon}</span>
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Panels — all stay mounted so every field submits. */}
              <div className="min-w-0 flex-1 p-4 sm:p-5">
                <div role="tabpanel" hidden={tab !== "general"} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Price from">
                      <Money name="price_min" defaultValue={product?.price_min?.toString() ?? ""} placeholder="Min" />
                    </Field>
                    <Field label="Price to">
                      <Money name="price_max" defaultValue={product?.price_max?.toString() ?? ""} placeholder="Max" />
                    </Field>
                  </div>
                  <Field label="City" hint="Where the piece ships from.">
                    <input name="city" defaultValue={product?.city ?? ""} placeholder="Jaipur" className={control} />
                  </Field>
                </div>

                <div role="tabpanel" hidden={tab !== "attributes"} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <Field label="Deity">
                    <input name="deity" defaultValue={product?.deity ?? ""} placeholder="Ganesha" className={control} />
                  </Field>
                  <Field label="Finish">
                    <input name="finish" defaultValue={product?.finish ?? ""} placeholder="Polished" className={control} />
                  </Field>
                  <Field label="Size label">
                    <input name="size" defaultValue={product?.size ?? ""} placeholder="Medium" className={control} />
                  </Field>
                  <Field label="Height" className="col-span-2 sm:col-span-3">
                    <div className="flex gap-2">
                      <input name="height" type="number" step="any" min={0} inputMode="decimal" defaultValue={product?.height_cm?.toString() ?? ""} placeholder="0" className={`${control} sm:max-w-xs`} />
                      <select name="height_unit" defaultValue="cm" className="h-11 shrink-0 rounded-lg border border-clay-200 bg-white px-3 text-sm text-clay-900 outline-none transition focus:border-saffron-500 focus:ring-4 focus:ring-saffron-500/10">
                        <option value="cm">cm</option>
                        <option value="feet">feet</option>
                      </select>
                    </div>
                  </Field>
                </div>

                <div role="tabpanel" hidden={tab !== "inventory"}>
                  <Toggle name="in_stock" defaultChecked={product ? product.in_stock : true} label="In stock / ready to ship" />
                  <p className="mt-2 text-xs text-clay-400">Buyers can still send inquiries about out-of-stock items.</p>
                </div>
              </div>
            </div>
          </MetaBox>
        </div>

        {/* ---------------- Sidebar column ---------------- */}
        <div className="space-y-5">
          <MetaBox title="Publish">
            <p className="text-xs leading-relaxed text-clay-500">
              New products go live after admin approval. You can edit them any time.
            </p>
            <div className="mt-4">
              <Submit label={submitLabel} />
            </div>
          </MetaBox>

          <MetaBox title="Product category">
            <SelectBox name="category_id" defaultValue={product?.category_id ?? ""} options={categories.map((c) => ({ value: c.id, label: c.name }))} placeholder="Uncategorised" />
          </MetaBox>

          <MetaBox title="Material">
            <SelectBox name="material_id" defaultValue={product?.material_id ?? ""} options={materials.map((m) => ({ value: m.id, label: m.name }))} placeholder="Not specified" />
          </MetaBox>

          <MetaBox title="Product images" hint="First image is the cover.">
            <ImageUploader shopId={shopId} initialUrls={initialImages} />
          </MetaBox>
        </div>
      </div>
    </form>
  );
}

/* ---------------- sub-components ---------------- */

function MetaBox({
  title,
  hint,
  bodyClassName,
  children,
}: {
  title: string;
  hint?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-clay-200/80 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-clay-200/70 px-4 py-3">
        <h3 className="text-sm font-semibold text-clay-900">{title}</h3>
        {hint && <span className="text-xs text-clay-400">{hint}</span>}
      </div>
      <div className={bodyClassName ?? "p-4"}>{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-clay-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-clay-400">{hint}</span>}
    </label>
  );
}

function SelectBox({
  name,
  defaultValue,
  options,
  placeholder = "Select…",
}: {
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full appearance-none rounded-lg border border-clay-200 bg-white pl-3.5 pr-9 text-sm text-clay-900 outline-none transition focus:border-saffron-500 focus:ring-4 focus:ring-saffron-500/10"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-400" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Money({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-clay-400">₹</span>
      <input
        name={name}
        type="number"
        step="any"
        min={0}
        inputMode="numeric"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-clay-200 bg-white pl-7 pr-3.5 text-sm text-clay-900 outline-none transition placeholder:text-clay-400 focus:border-saffron-500 focus:ring-4 focus:ring-saffron-500/10"
      />
    </div>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-clay-200 transition-colors peer-checked:bg-saffron-600 peer-focus-visible:ring-2 peer-focus-visible:ring-saffron-500/40 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
      <span className="text-sm font-medium text-clay-700">{label}</span>
    </label>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-saffron-600 px-6 text-sm font-semibold text-white transition hover:bg-saffron-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />}
      {pending ? "Saving…" : label}
    </button>
  );
}
