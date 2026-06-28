"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";

const initial: InquiryState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-saffron-600 px-6 py-3 font-semibold text-white transition hover:bg-saffron-700 disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send Inquiry"}
    </button>
  );
}

export function InquiryForm({
  shopId,
  productId,
  productName,
}: {
  shopId: string;
  productId?: string;
  productName?: string;
}) {
  const [state, action] = useActionState(submitInquiry, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="text-3xl">✅</div>
        <h3 className="mt-2 text-lg font-semibold text-green-800">Inquiry sent!</h3>
        <p className="mt-1 text-sm text-green-700">{state.message}</p>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="shop_id" value={shopId} />
      {productId && <input type="hidden" name="product_id" value={productId} />}

      {productName && (
        <p className="rounded-lg bg-saffron-50 px-3 py-2 text-sm text-saffron-800">
          Inquiring about: <strong>{productName}</strong>
        </p>
      )}

      <Field name="name" label="Your Name *" error={err.name} />
      <div className="grid grid-cols-2 gap-3">
        <Field name="phone" label="Phone *" type="tel" error={err.phone} />
        <Field name="city" label="City" />
      </div>
      <Field name="email" label="Email" type="email" error={err.email} />
      <div>
        <label className="text-sm font-medium">Requirement *</label>
        <textarea
          name="requirement"
          rows={3}
          placeholder="Describe size, finish, deity, delivery city, timeline…"
          className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
        />
        {err.requirement && <p className="mt-1 text-xs text-red-600">{err.requirement}</p>}
      </div>

      {state.message && !state.ok && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton />
      <p className="text-center text-xs text-clay-700">
        No payment required. The vendor will contact you with a quotation.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  error,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
