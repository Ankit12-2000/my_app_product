"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, signup, type AuthState } from "@/app/actions/auth";
import { IconSpinner } from "@/components/admin/icons";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-saffron-600 px-6 py-3 font-semibold text-white transition hover:bg-saffron-700 disabled:opacity-60"
    >
      {pending && <IconSpinner className="h-4 w-4 animate-spin" />}
      {pending ? "Please wait…" : label}
    </button>
  );
}

const initial: AuthState = {};

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const action = mode === "login" ? login : signup;
  const [state, formAction] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-3">
      {next && <input type="hidden" name="next" value={next} />}

      {mode === "signup" && (
        <>
          <Field name="full_name" label="Full name" />
          <Field name="phone" label="Phone" type="tel" />
        </>
      )}
      <Field name="email" label="Email" type="email" required />
      <Field name="password" label="Password" type="password" required />

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state.notice && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.notice}</p>
      )}

      <Submit label={mode === "login" ? "Login" : "Create account"} />
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
      />
    </div>
  );
}
