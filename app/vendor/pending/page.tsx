import { requireVendor } from "@/lib/auth";

export default async function PendingApprovalPage() {
  const { shop } = await requireVendor();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-amber-100 text-4xl">
        ⏳
      </div>
      <h1 className="mt-6 text-2xl font-bold">Shop pending approval</h1>
      <p className="mt-2 max-w-md text-clay-700">
        {shop?.name && <strong>{shop.name}</strong>} has been created successfully.
        Our team is reviewing your shop. You&apos;ll get access to the dashboard once it&apos;s approved.
      </p>
      <p className="mt-4 text-sm text-clay-700/70">
        This usually takes 1-2 business days.
      </p>
    </div>
  );
}
