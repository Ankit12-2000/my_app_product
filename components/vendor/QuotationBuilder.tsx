"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import type { QuotationRow } from "@/lib/data/vendor";
import type { Shop } from "@/types";
import { saveQuotation } from "@/app/actions/vendor";
import { formatPrice } from "@/lib/utils";
import { quoteTotals } from "@/lib/quotation";

interface Item {
  description: string;
  quantity: number;
  unit_price: number;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-saffron-600 px-6 py-2.5 font-semibold text-white hover:bg-saffron-700 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save quotation"}
    </button>
  );
}

export function QuotationBuilder({ quotation, shop }: { quotation: QuotationRow; shop: Shop }) {
  const [items, setItems] = useState<Item[]>(
    (quotation.items ?? []).length
      ? quotation.items!.sort((a, b) => a.sort_order - b.sort_order).map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unit_price: i.unit_price,
        }))
      : [{ description: "", quantity: 1, unit_price: 0 }]
  );
  const [gst, setGst] = useState(quotation.gst_percent ?? 18);
  const [discount, setDiscount] = useState(quotation.discount ?? 0);

  const totals = useMemo(() => quoteTotals(items, gst, discount), [items, gst, discount]);

  function setItem(idx: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, unit_price: 0 }]);
  }
  function removeItem(idx: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));
  }

  return (
    <form action={saveQuotation} className="space-y-6">
      <input type="hidden" name="id" value={quotation.id} />
      <input type="hidden" name="gst_percent" value={gst} />
      <input type="hidden" name="discount" value={discount} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-bold">Quotation {quotation.number}</h1>
          <p className="text-sm text-clay-700">Build and share a quotation for your customer.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            name="status"
            defaultValue={quotation.status}
            className="rounded-lg border border-clay-100 bg-white px-3 py-2 text-sm capitalize"
          >
            {["draft", "sent", "accepted", "rejected"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full border border-clay-100 px-4 py-2 text-sm font-medium text-clay-700 hover:bg-clay-50"
          >
            🖨️ Print / PDF
          </button>
          <SaveButton />
        </div>
      </div>

      {/* Customer + shop header */}
      <div className="grid gap-6 rounded-2xl border border-clay-100 bg-white p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-clay-700/60">From</p>
          <p className="font-bold">{shop.name}</p>
          <p className="text-sm text-clay-700">
            {shop.city}{shop.state ? `, ${shop.state}` : ""}<br />
            {shop.phone}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-clay-700/60">Bill to</p>
          <div className="grid grid-cols-2 gap-2">
            <input name="customer_name" defaultValue={quotation.customer_name ?? ""} placeholder="Customer name"
              className="rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
            <input name="customer_phone" defaultValue={quotation.customer_phone ?? ""} placeholder="Phone"
              className="rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
            <input name="customer_email" defaultValue={quotation.customer_email ?? ""} placeholder="Email"
              className="rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
            <input name="customer_city" defaultValue={quotation.customer_city ?? ""} placeholder="City"
              className="rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-clay-100 bg-white p-6">
        {/* Column headings only make sense once the row is actually a row. */}
        <div className="mb-2 hidden grid-cols-12 gap-2 text-xs font-medium uppercase tracking-wide text-clay-700/60 sm:grid">
          <div className="col-span-6">Description</div>
          <div className="col-span-2 text-right">Qty</div>
          <div className="col-span-2 text-right">Unit ₹</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>
        <div className="space-y-2">
          {items.map((it, i) => (
            /* On a phone the 12-column row squeezed the description to a few
               characters, so each line item becomes a small stacked card and
               only becomes a true row from `sm` up. */
            <div
              key={i}
              className="rounded-xl border border-clay-100 p-3 sm:grid sm:grid-cols-12 sm:items-center sm:gap-2 sm:rounded-none sm:border-0 sm:p-0"
            >
              <input
                name="item_description"
                value={it.description}
                onChange={(e) => setItem(i, { description: e.target.value })}
                placeholder="e.g. Marble Ganesh 24 inch"
                aria-label="Item description"
                className="w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400 sm:col-span-6"
              />
              <div className="mt-2 grid grid-cols-2 gap-2 sm:contents">
                <label className="sm:contents">
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-clay-700/60 sm:hidden">
                    Qty
                  </span>
                  <input
                    name="item_quantity"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={it.quantity}
                    onChange={(e) => setItem(i, { quantity: Number(e.target.value) })}
                    aria-label="Quantity"
                    className="w-full rounded-lg border border-clay-100 px-2 py-2 text-right text-sm outline-none focus:border-saffron-400 sm:col-span-2"
                  />
                </label>
                <label className="sm:contents">
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-clay-700/60 sm:hidden">
                    Unit ₹
                  </span>
                  <input
                    name="item_price"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={it.unit_price}
                    onChange={(e) => setItem(i, { unit_price: Number(e.target.value) })}
                    aria-label="Unit price"
                    className="w-full rounded-lg border border-clay-100 px-2 py-2 text-right text-sm outline-none focus:border-saffron-400 sm:col-span-2"
                  />
                </label>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-clay-100 pt-2 sm:col-span-2 sm:mt-0 sm:justify-end sm:border-0 sm:pt-0">
                <span className="text-xs uppercase tracking-wide text-clay-700/60 sm:hidden">Amount</span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatPrice(it.quantity * it.unit_price)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-clay-700/50 transition hover:bg-red-50 hover:text-red-600 print:hidden"
                  aria-label={`Remove item ${i + 1}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 text-sm font-medium text-saffron-700 hover:underline print:hidden"
        >
          + Add line item
        </button>

        {/* Totals */}
        <div className="mt-6 space-y-2 text-sm sm:ml-auto sm:max-w-xs">
          <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
          <div className="flex items-center justify-between">
            <span>Discount ₹</span>
            <input
              type="number"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-28 rounded-lg border border-clay-100 px-2 py-1 text-right outline-none focus:border-saffron-400 print:hidden"
            />
            <span className="hidden print:inline">{formatPrice(discount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>GST %</span>
            <input
              type="number"
              min={0}
              value={gst}
              onChange={(e) => setGst(Number(e.target.value))}
              className="w-28 rounded-lg border border-clay-100 px-2 py-1 text-right outline-none focus:border-saffron-400 print:hidden"
            />
            <span className="hidden print:inline">{gst}%</span>
          </div>
          <Row label="GST amount" value={formatPrice(totals.gst)} />
          <div className="flex justify-between border-t border-clay-100 pt-2 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes + terms */}
      <div className="grid gap-4 sm:grid-cols-2 print:hidden">
        <div>
          <label className="text-sm font-medium">Notes</label>
          <textarea name="notes" rows={3} defaultValue={quotation.notes ?? ""}
            className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
        </div>
        <div>
          <label className="text-sm font-medium">Terms &amp; conditions</label>
          <textarea name="terms" rows={3} defaultValue={quotation.terms ?? ""}
            placeholder="50% advance, delivery in 3 weeks…"
            className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
        </div>
      </div>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
