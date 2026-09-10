import { requireAdmin } from "@/lib/auth";
import { listVendorLeadsPage, vendorLeadStatusCounts, type VendorLead } from "@/lib/data/admin";
import { parsePage } from "@/lib/data/paging";
import {
  setVendorLeadStatus,
  deleteVendorLead,
  approveVendorLead,
  resetVendorLeadPassword,
} from "@/app/actions/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/config";
import { VendorCredentials } from "@/components/admin/VendorCredentials";
import { FilterTabs, SearchInput, Toolbar } from "@/components/admin/Toolbar";
import { PageNav } from "@/components/admin/PageNav";
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
  IconAlert,
  IconCheck,
  IconChat,
  IconRefresh,
  IconInbox,
  IconMail,
  IconPhone,
  IconPin,
  IconTrash,
  IconUndo,
  IconX,
} from "@/components/admin/icons";

type Status = VendorLead["status"];

const STATUS_META: Record<Status, { label: string; tone: Tone }> = {
  pending: { label: "Pending", tone: "warning" },
  contacted: { label: "Contacted", tone: "info" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

const STATUSES: Status[] = ["pending", "contacted", "approved", "rejected"];

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

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
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const status = (STATUSES as string[]).includes(sp.status ?? "") ? sp.status : "all";

  const [{ rows, total, page, pageCount, pageSize }, counts] = await Promise.all([
    listVendorLeadsPage({ page: parsePage(sp.page), q: sp.q, status }),
    vendorLeadStatusCounts(),
  ]);

  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const tabs = [
    { value: "all", label: "All", count: allCount },
    ...STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label, count: counts[s] ?? 0 })),
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vendor Leads"
        description="Registration requests from vendors who want to sell on MoortiBazaar. Review each one, then approve or reject."
      />

      {!isServiceRoleConfigured && (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <span className="font-semibold">Approvals are disabled.</span> Creating a vendor login
            needs <code className="font-mono text-[13px]">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
            <code className="font-mono text-[13px]">.env.local</code>. Copy the service_role key
            from Supabase → Settings → API, then restart the dev server.
          </p>
        </div>
      )}

      <Toolbar>
        <SearchInput placeholder="Search name, phone, business or city…" />
        <div className="w-full sm:w-auto">
          <FilterTabs tabs={tabs} />
        </div>
      </Toolbar>

      <Card>
        {rows.length === 0 ? (
          <EmptyState
            icon={<IconInbox className="h-5 w-5" />}
            title={sp.q ? `No leads match “${sp.q}”` : status === "all" ? "No vendor leads yet" : `No ${status} leads`}
            description={
              sp.q
                ? "Try a different search term or clear the filters."
                : "New vendor registration requests will land here as they come in."
            }
          />
        ) : (
          <>
            <ul className="divide-y divide-clay-100">
              {rows.map((lead) => {
                const meta = STATUS_META[lead.status] ?? STATUS_META.pending;
                const place = [lead.city, lead.state].filter(Boolean).join(", ");
                return (
                  <li
                    key={lead.id}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-clay-50/60 sm:flex-row sm:items-start sm:gap-4 sm:p-5"
                  >
                    <div className="flex items-start gap-3 sm:contents">
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
                            {lead.business_type && <span className="text-clay-500"> · {lead.business_type}</span>}
                          </p>
                        )}

                        <div className="mt-2 flex flex-col gap-1.5 text-sm text-clay-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
                          <a
                            href={`tel:${lead.phone.replace(/\s/g, "")}`}
                            className="inline-flex items-center gap-1.5 transition hover:text-saffron-700"
                          >
                            <IconPhone className="h-3.5 w-3.5 shrink-0 text-clay-400" />
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
                          {place && (
                            <span className="inline-flex items-center gap-1.5">
                              <IconPin className="h-3.5 w-3.5 shrink-0 text-clay-400" />
                              {place}
                            </span>
                          )}
                        </div>

                        {lead.message && (
                          <p className="clamp-2 mt-2.5 rounded-lg border border-clay-100 bg-clay-50/70 px-3 py-2 text-sm leading-relaxed text-clay-600">
                            {lead.message}
                          </p>
                        )}

                        {lead.login_email && (
                          <VendorCredentials
                            email={lead.login_email}
                            password={lead.temp_password}
                            createdAt={lead.account_created_at}
                            resetSlot={
                              <ActionButton
                                action={resetVendorLeadPassword}
                                fields={{ id: lead.id }}
                                variant="secondary"
                                confirm={`Issue a new password for ${lead.full_name}? Their current password will stop working.`}
                                className="border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"
                              >
                                <IconRefresh className="h-3.5 w-3.5" />
                                Reset password
                              </ActionButton>
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-clay-100 pt-3 sm:justify-end sm:border-0 sm:pt-0">
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
                            action={approveVendorLead}
                            fields={{ id: lead.id }}
                            variant="success"
                            disabled={!isServiceRoleConfigured}
                            title={
                              isServiceRoleConfigured
                                ? "Approve and create this vendor's login"
                                : "Set SUPABASE_SERVICE_ROLE_KEY in .env.local to enable approvals"
                            }
                            confirm={`Approve ${lead.full_name} and create their vendor login?`}
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
                            confirm={`Reject the lead from ${lead.full_name}?`}
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
                        confirm={`Permanently delete the lead from ${lead.full_name}? This cannot be undone.`}
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

            <PageNav page={page} pageCount={pageCount} total={total} pageSize={pageSize} label="leads" />
          </>
        )}
      </Card>
    </div>
  );
}
