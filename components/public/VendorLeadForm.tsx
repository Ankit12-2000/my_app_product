"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitVendorLead, type VendorLeadState } from "@/app/actions/vendorLead";
import { IconSpinner } from "@/components/admin/icons";

const initial: VendorLeadState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-saffron-600 px-6 py-3 font-semibold text-white transition hover:bg-saffron-700 disabled:opacity-60"
    >
      {pending && <IconSpinner className="h-4 w-4 animate-spin" />}
      {pending ? "Submitting…" : "Submit Registration"}
    </button>
  );
}

export function VendorLeadForm() {
  const [state, action] = useActionState(submitVendorLead, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">
          ✅
        </div>
        <h2 className="mt-4 text-xl font-bold text-green-800">Registration Submitted!</h2>
        <p className="mt-2 text-green-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Full Name *</label>
          <input
            name="full_name"
            required
            className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
          />
          {state.errors?.full_name && (
            <p className="mt-1 text-xs text-red-600">{state.errors.full_name}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">Phone *</label>
          <input
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
          />
          {state.errors?.phone && (
            <p className="mt-1 text-xs text-red-600">{state.errors.phone}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
          />
          {state.errors?.email && (
            <p className="mt-1 text-xs text-red-600">{state.errors.email}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">City</label>
          <input
            name="city"
            className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">State</label>
          <input
            name="state"
            className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Business / Shop Name</label>
          <input
            name="business_name"
            className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Business Type</label>
        <select
          name="business_type"
          className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
        >
          <option value="">Select type</option>
          <option value="artisan">Artisan / Sculptor</option>
          <option value="manufacturer">Manufacturer</option>
          <option value="dealer">Dealer / Trader</option>
          <option value="workshop">Workshop</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Tell us about your work</label>
        <textarea
          name="message"
          rows={3}
          placeholder="What kind of statues/products do you make? Any specialties?"
          className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
        />
      </div>

      {state.message && !state.ok && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}
