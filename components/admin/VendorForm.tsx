"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createVendor, type ShopState } from "@/app/actions/admin";
import { Button, Card, CardHeader, Field, inputClass } from "@/components/admin/ui";
import { IconCheck, IconPlus, IconAlert } from "@/components/admin/icons";

const initial: ShopState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="brand" size="md" disabled={pending}>
      <IconPlus className="h-4 w-4" />
      {pending ? "Creating…" : "Create vendor"}
    </Button>
  );
}

export function VendorForm() {
  const [state, action] = useActionState(createVendor, initial);

  return (
    <Card>
      <CardHeader
        title="Create new vendor"
        description="They log in with these credentials and set up their own shop."
      />
      <form action={action} className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required>
            <input name="full_name" required placeholder="Ramesh Sharma" className={inputClass} />
          </Field>
          <Field label="Email" required>
            <input
              name="email"
              type="email"
              required
              placeholder="vendor@example.com"
              className={inputClass}
            />
          </Field>
          <Field label="Phone">
            <input name="phone" placeholder="+91 98765 43210" className={inputClass} />
          </Field>
          <Field label="Password" required hint="Minimum 6 characters.">
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton />
          {state.message && (
            <p
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                state.ok ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {state.ok ? <IconCheck className="h-4 w-4" /> : <IconAlert className="h-4 w-4" />}
              {state.message}
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}
