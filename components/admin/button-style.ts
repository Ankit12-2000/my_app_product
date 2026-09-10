import { cn } from "@/lib/utils";

// Button tokens live apart from ui.tsx so both server components and the
// client-side ActionButton can import them without dragging in the rest.
// Premium-minimal language: flat fills, one indigo accent, generous height.

const VARIANTS = {
  primary: "bg-clay-900 text-white hover:bg-clay-800 focus-visible:outline-clay-900",
  brand: "bg-saffron-600 text-white hover:bg-saffron-700 focus-visible:outline-saffron-600",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600",
  secondary:
    "border border-clay-200 bg-white text-clay-700 hover:bg-clay-50 hover:text-clay-900 focus-visible:outline-clay-400",
  ghost: "text-clay-500 hover:bg-clay-100 hover:text-clay-900 focus-visible:outline-clay-400",
  danger: "border border-transparent text-rose-600 hover:bg-rose-50 focus-visible:outline-rose-400",
} as const;

const SIZES = {
  sm: "h-9 gap-1.5 px-3 text-[13px]",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-11 gap-2 px-5 text-sm",
  icon: "h-9 w-9 justify-center",
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
