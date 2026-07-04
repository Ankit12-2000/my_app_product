"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Shop } from "@/types";
import { SingleImageUploader } from "./SingleImageUploader";

type ShopState = { error?: string; ok?: boolean };
type ShopAction = (prev: ShopState, formData: FormData) => Promise<ShopState>;

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

export function ShopForm({
  action,
  shop,
  submitLabel,
  showImages = false,
}: {
  action: ShopAction;
  shop?: Shop | null;
  submitLabel: string;
  showImages?: boolean;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <Field name="name" label="Shop name *" defaultValue={shop?.name} required />
        <Field name="tagline" label="Tagline" defaultValue={shop?.tagline ?? ""} />
        <div>
          <label className="text-sm font-bold text-clay-700">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={shop?.description ?? ""}
            className="mt-1.5 w-full rounded-xl border border-clay-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-clay-400 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
          />
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field name="city" label="City" defaultValue={shop?.city ?? ""} />
          <Field name="state" label="State" defaultValue={shop?.state ?? ""} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field name="phone" label="Phone" defaultValue={shop?.phone ?? ""} />
          <Field name="whatsapp" label="WhatsApp" defaultValue={shop?.whatsapp ?? ""} />
        </div>
        <Field name="email" label="Email" type="email" defaultValue={shop?.email ?? ""} />
      </div>

      {/* Images */}
      {showImages && (
        <div className="space-y-5 border-t border-clay-100 pt-6">
          <p className="text-sm font-bold text-clay-700">Branding</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <SingleImageUploader
              name="logo_url"
              label="Shop logo"
              shopId={shop?.id}
              initialUrl={shop?.logo_url ?? ""}
              aspect="square"
              prefix="logo"
              placeholder="🏪"
            />
            <SingleImageUploader
              name="banner_url"
              label="Shop banner"
              shopId={shop?.id}
              initialUrl={shop?.banner_url ?? ""}
              aspect="banner"
              prefix="banner"
              placeholder="🖼️"
            />
          </div>
        </div>
      )}

      {/* Feedback */}
      {state.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          <span>⚠️</span> {state.error}
        </div>
      )}
      {state.ok && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
          <span>✅</span> Saved successfully.
        </div>
      )}

      <Submit label={submitLabel} />
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  required,
}: {
  name: string; label: string; type?: string; defaultValue?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-clay-700">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-xl border border-clay-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-clay-400 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
      />
    </div>
  );
}
