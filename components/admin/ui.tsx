import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconArrowLeft } from "@/components/admin/icons";

/* ---------------- Page header ---------------- */

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  actions,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-clay-200/70 pb-5">
      <div className="min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-clay-500 transition hover:text-clay-900"
          >
            <IconArrowLeft className="h-3.5 w-3.5" />
            {backLabel ?? "Back"}
          </Link>
        )}
        <h1 className="truncate text-[26px] font-semibold leading-tight tracking-[-0.02em] text-clay-900">
          {title}
        </h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-clay-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------------- Surfaces ---------------- */

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-clay-200/70 bg-white shadow-[0_1px_2px_rgba(46,40,32,0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-clay-200/70 px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-clay-900">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-clay-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-clay-400">{children}</h3>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && (
        <span className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-clay-100 text-clay-400">
          {icon}
        </span>
      )}
      <p className="text-sm font-semibold text-clay-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-clay-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ---------------- Badge ---------------- */

const TONES = {
  neutral: "bg-clay-100 text-clay-600 ring-clay-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  brand: "bg-saffron-50 text-saffron-700 ring-saffron-200",
} as const;

export type Tone = keyof typeof TONES;

export function Badge({
  tone = "neutral",
  dot = false,
  children,
  className,
}: {
  tone?: Tone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        TONES[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

/* ---------------- Buttons ---------------- */

const VARIANTS = {
  primary:
    "bg-clay-900 text-white hover:bg-clay-800 focus-visible:outline-clay-900",
  brand:
    "bg-saffron-600 text-white hover:bg-saffron-700 focus-visible:outline-saffron-600",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600",
  secondary:
    "border border-clay-200 bg-white text-clay-700 hover:border-clay-300 hover:bg-clay-50 focus-visible:outline-clay-400",
  ghost:
    "text-clay-500 hover:bg-clay-100 hover:text-clay-900 focus-visible:outline-clay-400",
  danger:
    "border border-transparent text-rose-600 hover:bg-rose-50 focus-visible:outline-rose-400",
} as const;

const SIZES = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-9 gap-2 px-3.5 text-sm",
  icon: "h-8 w-8 justify-center",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export const buttonClass = (
  variant: ButtonVariant = "secondary",
  size: ButtonSize = "sm",
  className?: string
) =>
  cn(
    "inline-flex items-center rounded-lg font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55",
    VARIANTS[variant],
    SIZES[size],
    className
  );

export function Button({
  variant = "secondary",
  size = "sm",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <button {...props} className={buttonClass(variant, size, className)} />;
}

export function ButtonLink({
  href,
  variant = "secondary",
  size = "sm",
  className,
  children,
  ...props
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

/**
 * A server-action button wrapped in its own form, with any number of hidden
 * fields. Keeps the action markup on list pages down to one line.
 */
export function ActionButton({
  action,
  fields,
  variant = "secondary",
  size = "sm",
  className,
  title,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="contents">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button title={title} className={buttonClass(variant, size, className)}>
        {children}
      </button>
    </form>
  );
}

/* ---------------- Table ---------------- */

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-scroll overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "border-b border-clay-200/70 bg-clay-50/60 px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-clay-500",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("border-b border-clay-100 px-5 py-3 align-middle text-clay-700", className)}>
      {children}
    </td>
  );
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="transition-colors last:[&>td]:border-b-0 hover:bg-clay-50/70">{children}</tr>;
}

/* ---------------- Form fields ---------------- */

export const inputClass =
  "w-full rounded-lg border border-clay-200 bg-white px-3 py-2 text-sm text-clay-900 placeholder:text-clay-400 transition outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/25";

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-clay-600">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-clay-400">{hint}</span>}
    </label>
  );
}

/* ---------------- Avatar ---------------- */

const AVATAR_TONES = [
  "bg-saffron-100 text-saffron-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
];

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return (
    <span
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold",
        AVATAR_TONES[hash % AVATAR_TONES.length],
        className
      )}
      aria-hidden="true"
    >
      {initials || "?"}
    </span>
  );
}
