import Link from "next/link";
import { requireVendorShop } from "@/lib/auth";
import { updateShop } from "@/app/actions/vendor";
import { ShopForm } from "@/components/vendor/ShopForm";

export default async function ShopProfilePage() {
  const { shop } = await requireVendorShop();

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shop Profile</h1>
        {shop.is_approved && (
          <Link href={`/shop/${shop.slug}`} className="text-sm text-saffron-700 hover:underline">
            View public page ↗
          </Link>
        )}
      </div>
      {!shop.is_approved && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Your shop is pending admin approval and isn&apos;t visible on the marketplace yet.
        </p>
      )}
      <div className="rounded-2xl border border-clay-100 bg-white p-6">
        <ShopForm action={updateShop} shop={shop} submitLabel="Save changes" showImages />
      </div>
    </div>
  );
}
