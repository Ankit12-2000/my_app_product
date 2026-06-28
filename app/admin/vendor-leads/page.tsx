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

      <div className="overflow-hidden rounded-2xl border border-clay-100 bg-white">
        {leads.length === 0 ? (
          <p className="p-8 text-center text-clay-700">No vendor leads yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-clay-50 text-left text-clay-700">
                <tr>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Contact</th>
                  <th className="hidden px-4 py-2 font-medium sm:table-cell">Location</th>
                  <th className="hidden px-4 py-2 font-medium md:table-cell">Business</th>
                  <th className="hidden px-4 py-2 font-medium lg:table-cell">Message</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-clay-100 align-top hover:bg-clay-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-clay-900">{lead.full_name}</div>
                      <div className="text-xs text-clay-700">
                        {new Date(lead.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-clay-900">{lead.phone}</div>
                      {lead.email && <div className="text-xs text-clay-700">{lead.email}</div>}
                    </td>
                    <td className="hidden px-4 py-3 text-clay-700 sm:table-cell">
                      {[lead.city, lead.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      {lead.business_name && <div className="font-medium text-clay-900">{lead.business_name}</div>}
                      {lead.business_type && <div className="text-xs text-clay-700 capitalize">{lead.business_type}</div>}
                    </td>
                    <td className="hidden max-w-xs truncate px-4 py-3 text-clay-700 lg:table-cell">
                      {lead.message || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status] ?? STATUS_COLORS.pending}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {lead.status === "pending" && (
                          <>
                            <form action={setVendorLeadStatus}>
                              <input type="hidden" name="id" value={lead.id} />
                              <input type="hidden" name="status" value="contacted" />
                              <button className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700">
                                Contact
                              </button>
                            </form>
                            <form action={setVendorLeadStatus}>
                              <input type="hidden" name="id" value={lead.id} />
                              <input type="hidden" name="status" value="approved" />
                              <button className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700">
                                Approve
                              </button>
                            </form>
                            <form action={setVendorLeadStatus}>
                              <input type="hidden" name="id" value={lead.id} />
                              <input type="hidden" name="status" value="rejected" />
                              <button className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700">
                                Reject
                              </button>
                            </form>
                          </>
                        )}
                        {lead.status !== "pending" && (
                          <form action={setVendorLeadStatus}>
                            <input type="hidden" name="id" value={lead.id} />
                            <input type="hidden" name="status" value="pending" />
                            <button className="rounded-full border border-clay-200 px-2.5 py-1 text-xs font-medium text-clay-700 hover:bg-clay-50">
                              Reset
                            </button>
                          </form>
                        )}
                        <form action={deleteVendorLead}>
                          <input type="hidden" name="id" value={lead.id} />
                          <button className="rounded-full border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
