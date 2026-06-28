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
        <Link href="/vendor/inquiries" className="text-sm text-saffron-700 hover:underline">
          ← Back to inquiries
        </Link>
        <StatusBadge status={inquiry.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-clay-100 bg-white p-6">
            <h1 className="text-xl font-bold">{inquiry.name}</h1>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <Info label="Phone" value={inquiry.phone} />
              <Info label="Email" value={inquiry.email ?? "—"} />
              <Info label="City" value={inquiry.city ?? "—"} />
              <Info label="Quantity" value={String(inquiry.quantity)} />
              <Info label="Product" value={inquiry.product?.name ?? "General inquiry"} />
              <Info label="Received" value={new Date(inquiry.created_at).toLocaleString("en-IN")} />
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide text-clay-700/60">Requirement</p>
              <p className="mt-1 whitespace-pre-line text-clay-900">{inquiry.requirement}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`tel:${inquiry.phone}`}
                className="rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700"
              >
                📞 Call
              </a>
              <a
                href={`https://wa.me/${inquiry.phone.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                WhatsApp
              </a>
              <form action={createQuotationFromInquiry}>
                <input type="hidden" name="inquiry_id" value={inquiry.id} />
                <button className="rounded-full border border-saffron-600 px-4 py-2 text-sm font-semibold text-saffron-700 hover:bg-saffron-50">
                  🧾 Create quotation
                </button>
              </form>
            </div>
          </div>

          {/* Internal notes / conversation */}
          <div className="rounded-2xl border border-clay-100 bg-white p-6">
            <h2 className="font-bold">Notes &amp; history</h2>
            <div className="mt-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-clay-700">No notes yet. Add your first internal note below.</p>
              )}
              {messages.map((m) => (
                <div key={m.id} className="rounded-lg bg-clay-50 p-3 text-sm">
                  <div className="flex items-center justify-between text-xs text-clay-700/70">
                    <span className="capitalize">{m.sender}{m.is_internal ? " · internal" : ""}</span>
                    <span>{new Date(m.created_at).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-clay-900">{m.body}</p>
                </div>
              ))}
            </div>
            <form action={addInquiryNote} className="mt-4 flex gap-2">
              <input type="hidden" name="id" value={inquiry.id} />
              <input
                name="body"
                placeholder="Add an internal note…"
                className="flex-1 rounded-lg border border-clay-100 bg-white px-3 py-2 text-sm outline-none focus:border-saffron-400"
              />
              <button className="rounded-lg bg-clay-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Status sidebar */}
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-2xl border border-clay-100 bg-white p-5">
            <h2 className="font-bold">Update status</h2>
            <form action={updateInquiryStatus} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={inquiry.id} />
              <select
                name="status"
                defaultValue={inquiry.status}
                className="w-full rounded-lg border border-clay-100 bg-white px-3 py-2 text-sm outline-none focus:border-saffron-400"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{STATUS_META[s].label}</option>
                ))}
              </select>
              <button className="w-full rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700">
                Save status
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
      <p className="text-xs uppercase tracking-wide text-clay-700/60">{label}</p>
      <p className="text-clay-900">{value}</p>
    </div>
  );
}
