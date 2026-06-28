"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createVendor, type ShopState } from "@/app/actions/admin";

const initial: ShopState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700 disabled:opacity-60">
      {pending ? "Creating…" : "Create Vendor"}
    </button>
  );
}

export function VendorForm() {
  const [state, action] = useActionState(createVendor, initial);

  return (
    <div className="rounded-2xl border border-clay-100 bg-white p-5">
      <h2 className="font-semibold">Create New Vendor</h2>
      <p className="mt-1 text-sm text-clay-700">Add a vendor name, email, phone and password. They will login and set up their own shop.</p>
      <form action={action} className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-clay-700">Full Name *</label>
          <input name="full_name" required className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-clay-700">Email *</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-clay-700">Phone</label>
          <input name="phone" className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-clay-700">Password *</label>
          <input name="password" type="password" required minLength={6} className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
        </div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <SubmitButton />
          {state.message && <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>{state.message}</p>}
        </div>
      </form>
    </div>
  );
}
