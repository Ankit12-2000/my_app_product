import type { QuotationItem, QuotationRow } from "@/lib/data/vendor";

export interface QuoteTotals {
  subtotal: number;
  discount: number;
  taxed: number;
  gst: number;
  total: number;
}

export function quoteTotals(
  items: Pick<QuotationItem, "quantity" | "unit_price">[],
  gstPercent: number,
  discount: number
): QuoteTotals {
  const subtotal = items.reduce((s, i) => s + (i.quantity || 0) * (i.unit_price || 0), 0);
  const taxed = Math.max(0, subtotal - (discount || 0));
  const gst = (taxed * (gstPercent || 0)) / 100;
  return { subtotal, discount: discount || 0, taxed, gst, total: taxed + gst };
}

export function rowTotal(q: QuotationRow): number {
  return quoteTotals(q.items ?? [], q.gst_percent, q.discount).total;
}
