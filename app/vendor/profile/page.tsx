import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { updateShop } from "@/app/actions/vendor";
import { ShopForm } from "@/components/vendor/ShopForm";

export default async function ShopProfilePage() {
  const { shop } = await requireVendorShop();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-clay-900">Shop Profile</h1>
          <p className="mt-1 text-sm text-clay-500">Manage your shop details and branding</p>
        </div>
        {shop.is_approved && (
          <Link
            href={`/shop/${shop.slug}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-clay-200 px-4 py-2 text-sm font-medium text-clay-700 transition hover:border-saffron-200 hover:bg-saffron-50 hover:text-saffron-700"
          >
            🌐 View public page
          </Link>
        )}
      </div>

      {/* Pending approval banner */}
      {!shop.is_approved && (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-5 py-4 ring-1 ring-amber-200">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-semibold text-amber-800">Pending Approval</p>
            <p className="text-sm text-amber-700">Your shop is pending admin approval and isn&apos;t visible on the marketplace yet.</p>
          </div>
        </div>
      )}

      {/* Form card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-clay-100 sm:p-8">
        <ShopForm action={updateShop} shop={shop} submitLabel="Save changes" showImages />
      </div>
    </div>
  );
}
