import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/admin/button-style";
import { IconArrowLeft } from "@/components/admin/icons";

/* ============================================================
   Premium-minimal component kit for the admin & vendor panels.
   Crisp 1px borders, generous whitespace, one indigo accent,
   flat surfaces with a soft radius. No heavy shadows or gradients.
   ============================================================ */

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
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="mb-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-clay-500 transition hover:text-clay-900"
          >
            <IconArrowLeft className="h-3.5 w-3.5" />
            {backLabel ?? "Back"}
          </Link>
        )}
        <h1 className="truncate text-2xl font-semibold tracking-tight text-clay-900 sm:text-[28px]">
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
        "overflow-hidden rounded-2xl border border-clay-200/80 bg-white",
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
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-clay-400">{children}</h3>
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
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {icon && (
        <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-clay-100 text-clay-400">
          {icon}
        </span>
      )}
      <p className="text-sm font-semibold text-clay-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-clay-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
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

export { buttonClass } from "@/components/admin/button-style";
export type { ButtonVariant, ButtonSize } from "@/components/admin/button-style";
// ActionButton is a client component so it can show an in-flight spinner.
export { ActionButton, SubmitButton } from "@/components/admin/ActionButton";

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

/* ---------------- Table ---------------- */

export function Table({
  children,
  minWidth = "min-w-[680px]",
}: {
  children: React.ReactNode;
  minWidth?: string;
}) {
  return (
    <div className="admin-scroll -mx-px overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", minWidth)}>{children}</table>
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
        "sticky top-0 z-10 border-b border-clay-200/70 bg-white px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-clay-400 sm:px-5",
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
    <td className={cn("border-b border-clay-100 px-4 py-3.5 align-middle text-clay-700 sm:px-5", className)}>
      {children}
    </td>
  );
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="transition-colors last:[&>td]:border-b-0 hover:bg-clay-50">{children}</tr>;
}

/* ---------------- Form fields ---------------- */

export const inputClass =
  "h-10 w-full rounded-lg border border-clay-200 bg-white px-3 text-sm text-clay-900 placeholder:text-clay-400 outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/25";

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

/* ---------------- Responsive list scaffolding ---------------- */

export function DesktopOnly({ children }: { children: React.ReactNode }) {
  return <div className="hidden md:block">{children}</div>;
}

export function MobileOnly({ children }: { children: React.ReactNode }) {
  return <div className="md:hidden">{children}</div>;
}

export function CardList({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-clay-100">{children}</ul>;
}

export function CardListItem({
  media,
  title,
  meta,
  badges,
  actions,
}: {
  media?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <li className="p-4">
      <div className="flex gap-3">
        {media && <div className="shrink-0">{media}</div>}
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-snug text-clay-900">{title}</div>
          {meta && <div className="mt-1 space-y-0.5 text-sm text-clay-500">{meta}</div>}
          {badges && <div className="mt-2 flex flex-wrap items-center gap-1.5">{badges}</div>}
        </div>
      </div>
      {actions && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-clay-100 pt-3">
          {actions}
        </div>
      )}
    </li>
  );
}

/* ---------------- Stat tile ---------------- */

export function StatTile({
  label,
  value,
  href,
  icon,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  href?: string;
  icon?: React.ReactNode;
  hint?: string;
  tone?: "neutral" | "urgent";
}) {
  const urgent = tone === "urgent" && Number(value) > 0;

  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium text-clay-500">{label}</span>
        {icon && (
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
              urgent ? "bg-saffron-600 text-white" : "bg-clay-100 text-clay-500"
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <span className="tabular text-[30px] font-semibold leading-none tracking-tight text-clay-900 sm:text-[34px]">
          {value}
        </span>
        {hint && <span className="pb-1 text-xs text-clay-400">{hint}</span>}
      </div>
    </>
  );

  const shell = "flex flex-col justify-between rounded-2xl border border-clay-200/80 bg-white p-5";

  if (!href) return <div className={shell}>{body}</div>;

  return (
    <Link
      href={href}
      className={cn(shell, "group transition hover:border-clay-300 hover:bg-clay-50/50")}
    >
      {body}
    </Link>
  );
}
