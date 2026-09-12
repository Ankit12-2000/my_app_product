"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { IconSpinner } from "@/components/admin/icons";

const initial: ContactState = { ok: false, message: "" };

const inputClass =
  "mt-1.5 w-full rounded-lg border border-clay-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/25";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-saffron-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-saffron-700 disabled:opacity-60"
    >
      {pending && <IconSpinner className="h-4 w-4 animate-spin" />}
      {pending ? "Sending…" : "Send Message"}
    </button>
  );
}

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h3 className="mt-4 text-xl font-bold text-green-800">Message sent!</h3>
        <p className="mt-2 text-sm text-green-700">{state.message}</p>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-left text-xs font-semibold text-clay-600">
            Your Name *
          </label>
          <input name="name" placeholder="e.g. Rahul Sharma" className={inputClass} />
          {err.name && <p className="mt-1 text-left text-xs text-red-600">{err.name}</p>}
        </div>
        <div>
          <label className="block text-left text-xs font-semibold text-clay-600">
            Your Email *
          </label>
          <input name="email" type="email" placeholder="you@example.com" className={inputClass} />
          {err.email && <p className="mt-1 text-left text-xs text-red-600">{err.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-left text-xs font-semibold text-clay-600">Subject</label>
        <input
          name="subject"
          placeholder="How can we help?"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-left text-xs font-semibold text-clay-600">
          Message *
        </label>
        <textarea
          name="message"
          rows={5}
          placeholder="Write your question or message…"
          className={inputClass}
        />
        {err.message && <p className="mt-1 text-left text-xs text-red-600">{err.message}</p>}
      </div>

      {state.message && !state.ok && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-left text-sm text-red-600">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}