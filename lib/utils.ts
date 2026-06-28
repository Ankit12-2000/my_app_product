import type { Product } from "@/types";

// Join class names, dropping falsy values.
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return inr.format(value);
}

// Human-friendly price label that handles ranges and "on request".
export function priceLabel(product: Pick<Product, "price_min" | "price_max">): string {
  const { price_min, price_max } = product;
  if (price_min == null && price_max == null) return "Price on request";
  if (price_min != null && price_max != null && price_min !== price_max) {
    return `${formatPrice(price_min)} – ${formatPrice(price_max)}`;
  }
  return formatPrice((price_min ?? price_max) as number);
}

export function primaryImage(product: Product): string {
  const sorted = [...(product.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return sorted[0]?.url ?? "https://picsum.photos/seed/placeholder/800/800";
}
