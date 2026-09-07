import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listVendorLeads, type VendorLead } from "@/lib/data/admin";
import { setVendorLeadStatus, deleteVendorLead } from "@/app/actions/admin";
import {
  ActionButton,
  Avatar,
  Badge,
  Card,
  EmptyState,
  PageHeader,
  type Tone,
} from "@/components/admin/ui";
import {
  IconCheck,
  IconChat,
  IconInbox,
  IconMail,
  IconPhone,
  IconPin,
  IconTrash,
  IconUndo,
  IconX,
} from "@/components/admin/icons";
import { cn } from "@/lib/utils";

type Status = VendorLead["status"];

const STATUS_META: Record<Status, { label: string; tone: Tone }> = {
  pending: { label: "Pending", tone: "warning" },
  contacted: { label: "Contacted", tone: "info" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "contacted", label: "Contacted" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

// "3 days ago" reads faster than a date when triaging a queue.
function relativeDay(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return dateFmt.format(new Date(iso));
}

export default async function VendorLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const [leads, { status }] = await Promise.all([listVendorLeads(), searchParams]);

  const active = FILTERS.some((f) => f.key === status) ? status! : "all";
  const visible = active === "all" ? leads : leads.filter((l) => l.status === active);

  const countFor = (key: string) =>
    key === "all" ? leads.length : leads.filter((l) => l.status === key).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Leads"
        description="Registration requests from vendors who want to sell on MoortiBazaar. Review each one, then approve or reject."
      />

      {/* Status filter tabs */}
      <div className="admin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => {
          const isActive = f.key === active;
          const count = countFor(f.key);
          return (
            <Link
              key={f.key}
              href={f.key === "all" ? "/admin/vendor-leads" : `/admin/vendor-leads?status=${f.key}`}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition",
                isActive
                  ? "border-clay-900 bg-clay-900 text-white"
                  : "border-clay-200 bg-white text-clay-600 hover:border-clay-300 hover:text-clay-900"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-bold leading-none tabular",
                  isActive ? "bg-white/20 text-white" : "bg-clay-100 text-clay-500"
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <Card>
        {visible.length === 0 ? (
          <EmptyState
            icon={<IconInbox className="h-5 w-5" />}
            title={active === "all" ? "No vendor leads yet" : `No ${active} leads`}
            description={
              active === "all"
                ? "New vendor registration requests will land here as they come in."
                : "Try a different status filter to see other leads."
            }
          />
        ) : (
          <ul className="divide-y divide-clay-100">
            {visible.map((lead) => {
              const meta = STATUS_META[lead.status] ?? STATUS_META.pending;
              const location = [lead.city, lead.state].filter(Boolean).join(", ");
              return (
                <li
                  key={lead.id}
                  className="group flex flex-col gap-4 p-4 transition-colors hover:bg-clay-50/60 sm:flex-row sm:items-start sm:gap-4 sm:p-5"
                >
                  <Avatar name={lead.full_name} />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <h3 className="text-[15px] font-semibold text-clay-900">{lead.full_name}</h3>
                      <Badge tone={meta.tone} dot>
                        {meta.label}
                      </Badge>
                      <span className="text-xs text-clay-400">· {relativeDay(lead.created_at)}</span>
                    </div>

                    {lead.business_name && (
                      <p className="mt-1 text-sm text-clay-700">
                        <span className="font-medium text-clay-800">{lead.business_name}</span>
                        {lead.business_type && (
                          <span className="text-clay-500"> · {lead.business_type}</span>
                        )}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-clay-600">
                      <a
                        href={`tel:${lead.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-1.5 transition hover:text-saffron-700"
                      >
                        <IconPhone className="h-3.5 w-3.5 text-clay-400" />
                        <span className="tabular">{lead.phone}</span>
                      </a>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex min-w-0 items-center gap-1.5 transition hover:text-saffron-700"
                        >
                          <IconMail className="h-3.5 w-3.5 shrink-0 text-clay-400" />
                          <span className="truncate">{lead.email}</span>
                        </a>
                      )}
                      {location && (
                        <span className="inline-flex items-center gap-1.5">
                          <IconPin className="h-3.5 w-3.5 text-clay-400" />
                          {location}
                        </span>
                      )}
                    </div>

                    {lead.message && (
                      <p className="clamp-2 mt-2.5 rounded-lg border border-clay-100 bg-clay-50/70 px-3 py-2 text-sm leading-relaxed text-clay-600">
                        {lead.message}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:justify-end">
                    {lead.status === "pending" ? (
                      <>
                        <ActionButton
                          action={setVendorLeadStatus}
                          fields={{ id: lead.id, status: "contacted" }}
                          variant="secondary"
                        >
                          <IconChat className="h-3.5 w-3.5" />
                          Contact
                        </ActionButton>
                        <ActionButton
                          action={setVendorLeadStatus}
                          fields={{ id: lead.id, status: "approved" }}
                          variant="success"
                        >
                          <IconCheck className="h-3.5 w-3.5" />
                          Approve
                        </ActionButton>
                        <ActionButton
                          action={setVendorLeadStatus}
                          fields={{ id: lead.id, status: "rejected" }}
                          variant="danger"
                          size="icon"
                          title="Reject lead"
                        >
                          <IconX className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </ActionButton>
                      </>
                    ) : (
                      <ActionButton
                        action={setVendorLeadStatus}
                        fields={{ id: lead.id, status: "pending" }}
                        variant="secondary"
                        title="Move back to pending"
                      >
                        <IconUndo className="h-3.5 w-3.5" />
                        Reset
                      </ActionButton>
                    )}
                    <ActionButton
                      action={deleteVendorLead}
                      fields={{ id: lead.id }}
                      variant="ghost"
                      size="icon"
                      title="Delete lead"
                      className="hover:bg-rose-50 hover:text-rose-600"
                    >
                      <IconTrash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </ActionButton>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
