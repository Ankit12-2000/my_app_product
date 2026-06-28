import { redirect } from "next/navigation";
import { requireVendor } from "@/lib/auth";
import { createShop } from "@/app/actions/vendor";
import { ShopForm } from "@/components/vendor/ShopForm";

export default async function OnboardingPage() {
  const { shop } = await requireVendor();
  if (shop) redirect("/vendor");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Set up your shop</h1>
      <p className="mt-1 text-clay-700">
        Create your shop profile. It goes live on the marketplace once an admin approves it.
      </p>
      <div className="mt-6 rounded-2xl border border-clay-100 bg-white p-6">
        <ShopForm action={createShop} submitLabel="Create shop" showImages />
      </div>
    </div>
  );
}
