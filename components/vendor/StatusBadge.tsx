import type { InquiryStatus } from "@/types";
import { cn } from "@/lib/utils";

export const STATUS_META: Record<InquiryStatus, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-blue-100 text-blue-700" },
  contacted: { label: "Contacted", cls: "bg-indigo-100 text-indigo-700" },
  quotation_sent: { label: "Quote Sent", cls: "bg-purple-100 text-purple-700" },
  negotiation: { label: "Negotiation", cls: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", cls: "bg-green-100 text-green-700" },
  closed: { label: "Closed", cls: "bg-clay-100 text-clay-700" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700" },
};

export const STATUS_ORDER: InquiryStatus[] = [
  "new", "contacted", "quotation_sent", "negotiation", "confirmed", "closed", "rejected",
];

export function StatusBadge({ status }: { status: InquiryStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold", meta.cls)}>
      <span className="h-1 w-1 rounded-full bg-current opacity-60" />
      {meta.label}
    </span>
  );
}
