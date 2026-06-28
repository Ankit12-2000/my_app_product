import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listAllShops } from "@/lib/data/admin";
import { setShopApproval, setShopFeatured } from "@/app/actions/admin";
import { VendorForm } from "@/components/admin/VendorForm";

export default async function AdminVendorsPage() {
  await requireAdmin();
  const shops = await listAllShops();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Vendors</h1>
      <p className="text-sm text-clay-700">Create new vendors, approve shops to make them public, and feature the best ones.</p>

      <VendorForm />

      <div className="overflow-hidden rounded-2xl border border-clay-100 bg-white">
        {shops.length === 0 ? (
          <p className="p-8 text-center text-clay-700">No vendors yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-clay-50 text-left text-clay-700">
              <tr>
                <th className="px-4 py-2 font-medium">Shop</th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">Location</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Featured</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <tr key={s.id} className="border-t border-clay-100 align-middle hover:bg-clay-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-clay-900">{s.name}</div>
                    <div className="text-xs text-clay-700">{s.phone ?? s.email ?? "—"}</div>
                  </td>
                  <td className="hidden px-4 py-3 text-clay-700 sm:table-cell">
                    {[s.city, s.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.is_approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {s.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={setShopFeatured}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="featured" value={(!s.is_featured).toString()} />
                      <button className="text-lg" title={s.is_featured ? "Unfeature" : "Feature"}>
                        {s.is_featured ? "⭐" : "☆"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <form action={setShopApproval}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="approve" value={(!s.is_approved).toString()} />
                        <button className={`rounded-full px-3 py-1.5 text-xs font-semibold text-white ${s.is_approved ? "bg-clay-700 hover:opacity-90" : "bg-green-600 hover:bg-green-700"}`}>
                          {s.is_approved ? "Unapprove" : "Approve"}
                        </button>
                      </form>
                      {s.is_approved && (
                        <Link href={`/vendors/${s.slug}`} className="text-xs text-saffron-700 hover:underline">
                          Public
                        </Link>
                      )}
                      <Link href={`/admin/vendors/${s.id}`} className="text-xs text-saffron-700 hover:underline">
                        Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
