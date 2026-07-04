import Link from "next/link";
import { notFound } from "next/navigation";
import { requireVendorShop } from "@/lib/auth";
import { getInquiry } from "@/lib/data/vendor";
import {
  addInquiryNote,
  createQuotationFromInquiry,
  updateInquiryStatus,
} from "@/app/actions/vendor";
import { STATUS_META, STATUS_ORDER, StatusBadge } from "@/components/vendor/StatusBadge";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { shop } = await requireVendorShop();
  const { id } = await params;
  const data = await getInquiry(shop.id, id);
  if (!data) notFound();
  const { inquiry, messages } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/vendor/inquiries"
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-saffron-700 transition hover:bg-saffron-50"
        >
          ← Back to inquiries
        </Link>
        <StatusBadge status={inquiry.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100 sm:p-8">
            <h1 className="text-xl font-extrabold text-clay-900">{inquiry.name}</h1>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Info label="Phone" value={inquiry.phone} />
              <Info label="Email" value={inquiry.email ?? "—"} />
              <Info label="City" value={inquiry.city ?? "—"} />
              <Info label="Quantity" value={String(inquiry.quantity)} />
              <Info label="Product" value={inquiry.product?.name ?? "General inquiry"} />
              <Info label="Received" value={new Date(inquiry.created_at).toLocaleString("en-IN")} />
            </div>

            <div className="mt-5 rounded-xl bg-clay-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-clay-500">Requirement</p>
              <p className="mt-2 whitespace-pre-line text-clay-900">{inquiry.requirement}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`tel:${inquiry.phone}`}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
              >
                📞 Call
              </a>
              <a
                href={`https://wa.me/${inquiry.phone.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 hover:shadow"
              >
                💬 WhatsApp
              </a>
              <form action={createQuotationFromInquiry}>
                <input type="hidden" name="inquiry_id" value={inquiry.id} />
                <button className="inline-flex items-center gap-2 rounded-xl border-2 border-saffron-200 bg-saffron-50 px-4 py-2.5 text-sm font-bold text-saffron-700 transition hover:border-saffron-300 hover:bg-saffron-100">
                  🧾 Create Quotation
                </button>
              </form>
            </div>
          </div>

          {/* Notes & history */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100 sm:p-8">
            <h2 className="font-extrabold text-clay-900">Notes &amp; History</h2>
            <div className="mt-4 space-y-3">
              {messages.length === 0 && (
                <div className="rounded-xl bg-clay-50 py-8 text-center">
                  <p className="text-3xl">📝</p>
                  <p className="mt-2 text-sm text-clay-500">No notes yet. Add your first internal note below.</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className="rounded-xl bg-clay-50 p-4">
                  <div className="flex items-center justify-between text-xs text-clay-500">
                    <span className="inline-flex items-center gap-1.5 font-medium capitalize">
                      <span className="h-1.5 w-1.5 rounded-full bg-saffron-400" />
                      {m.sender}{m.is_internal ? " · internal" : ""}
                    </span>
                    <span>{new Date(m.created_at).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm text-clay-900">{m.body}</p>
                </div>
              ))}
            </div>
            <form action={addInquiryNote} className="mt-5 flex gap-2">
              <input type="hidden" name="id" value={inquiry.id} />
              <input
                name="body"
                placeholder="Add an internal note…"
                className="flex-1 rounded-xl border border-clay-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-clay-400 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
              />
              <button className="rounded-xl bg-clay-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-clay-800">
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Status sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-clay-100">
            <h2 className="font-extrabold text-clay-900">Update Status</h2>
            <form action={updateInquiryStatus} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={inquiry.id} />
              <select
                name="status"
                defaultValue={inquiry.status}
                className="w-full rounded-xl border border-clay-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{STATUS_META[s].label}</option>
                ))}
              </select>
              <button className="w-full rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-saffron-200 transition hover:shadow-lg">
                Save Status
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-clay-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-clay-900">{value}</p>
    </div>
  );
}
