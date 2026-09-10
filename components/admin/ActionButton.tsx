"use client";

import { useFormStatus } from "react-dom";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/admin/button-style";
import { IconSpinner } from "@/components/admin/icons";

/**
 * A server-action button wrapped in its own form. Shows a spinner while the
 * action is in flight — without it an Approve click looked like nothing had
 * happened until the page quietly re-rendered — and can ask for confirmation
 * before destructive actions.
 */
export function ActionButton({
  action,
  fields,
  variant = "secondary",
  size = "sm",
  className,
  title,
  confirm,
  disabled,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  title?: string;
  /** When set, the browser asks this before the action runs. */
  confirm?: string;
  /** Blocks the action — use when a prerequisite is missing, not for busy state. */
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      className="contents"
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Submit variant={variant} size={size} className={className} title={title} disabled={disabled}>
        {children}
      </Submit>
    </form>
  );
}

function Submit({
  variant,
  size,
  className,
  title,
  disabled,
  children,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  className?: string;
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      title={title}
      disabled={pending || disabled}
      aria-busy={pending}
      className={buttonClass(variant, size, className)}
    >
      {pending ? <IconSpinner className={size === "icon" ? "h-4 w-4 animate-spin" : "h-3.5 w-3.5 animate-spin"} /> : children}
    </button>
  );
}

/** Standalone submit button for the larger admin/vendor forms. */
export function SubmitButton({
  variant = "brand",
  size = "md",
  className,
  children,
  pendingLabel,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={buttonClass(variant, size, className)}
    >
      {pending && <IconSpinner className="h-4 w-4 animate-spin" />}
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}
