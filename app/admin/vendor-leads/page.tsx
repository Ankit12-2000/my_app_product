import { requireAdmin } from "@/lib/auth";
import { listVendorLeads } from "@/lib/data/admin";
import { setVendorLeadStatus, deleteVendorLead } from "@/app/actions/admin";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function VendorLeadsPage() {
  await requireAdmin();
  const leads = await listVendorLeads();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Vendor Leads</h1>
        <p className="text-sm text-clay-700">Registration requests from vendors who want to sell on MoortiBazaar.</p>
      </div>

      <div className="rounded-2xl border border-clay-100 bg-white">
        {leads.length === 0 ? (
          <p className="p-8 text-center text-clay-700">No vendor leads yet.</p>
        ) : (
          <div className="divide-y divide-clay-100">
            {leads.map((lead) => (
              <div key={lead.id} className="p-4 hover:bg-clay-50">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-clay-900">{lead.full_name}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status] ?? STATUS_COLORS.pending}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-clay-700">
                      <span>{lead.phone}</span>
                      {lead.email && <span>{lead.email}</span>}
                      {(lead.city || lead.state) && <span>{[lead.city, lead.state].filter(Boolean).join(", ")}</span>}
                    </div>
                    {lead.business_name && (
                      <div className="mt-1 text-sm text-clay-700">
                        {lead.business_name}{lead.business_type ? ` — ${lead.business_type}` : ""}
                      </div>
                    )}
                    {lead.message && (
                      <p className="mt-1 line-clamp-2 text-sm text-clay-700/70">{lead.message}</p>
                    )}
                    <div className="mt-1 text-xs text-clay-700/50">
                      {new Date(lead.created_at).toLocaleDateString("en-IN")}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    {lead.status === "pending" && (
                      <>
                        <form action={setVendorLeadStatus}>
                          <input type="hidden" name="id" value={lead.id} />
                          <input type="hidden" name="status" value="contacted" />
                          <button className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                            Contact
                          </button>
                        </form>
                        <form action={setVendorLeadStatus}>
                          <input type="hidden" name="id" value={lead.id} />
                          <input type="hidden" name="status" value="approved" />
                          <button className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                            Approve
                          </button>
                        </form>
                        <form action={setVendorLeadStatus}>
                          <input type="hidden" name="id" value={lead.id} />
                          <input type="hidden" name="status" value="rejected" />
                          <button className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
                            Reject
                          </button>
                        </form>
                      </>
                    )}
                    {lead.status !== "pending" && (
                      <form action={setVendorLeadStatus}>
                        <input type="hidden" name="id" value={lead.id} />
                        <input type="hidden" name="status" value="pending" />
                        <button className="rounded-full border border-clay-200 px-3 py-1.5 text-xs font-medium text-clay-700 hover:bg-clay-50">
                          Reset
                        </button>
                      </form>
                    )}
                    <form action={deleteVendorLead}>
                      <input type="hidden" name="id" value={lead.id} />
                      <button className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
