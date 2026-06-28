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
      className="rounded-full bg-saffron-600 px-6 py-2.5 font-semibold text-white transition hover:bg-saffron-700 disabled:opacity-60"
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
    <form action={formAction} className="space-y-4">
      <Field name="name" label="Shop name *" defaultValue={shop?.name} required />
      <Field name="tagline" label="Tagline" defaultValue={shop?.tagline ?? ""} />
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={shop?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field name="city" label="City" defaultValue={shop?.city ?? ""} />
        <Field name="state" label="State" defaultValue={shop?.state ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field name="phone" label="Phone" defaultValue={shop?.phone ?? ""} />
        <Field name="whatsapp" label="WhatsApp" defaultValue={shop?.whatsapp ?? ""} />
      </div>
      <Field name="email" label="Email" type="email" defaultValue={shop?.email ?? ""} />

      {showImages && (
        <div className="space-y-4 border-t border-clay-100 pt-4">
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
      )}

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state.ok && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Saved successfully.</p>
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
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
      />
    </div>
  );
}
