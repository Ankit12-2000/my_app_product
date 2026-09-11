import { redirect } from "next/navigation";
import { requireVendor } from "@/lib/auth";
import { createShop } from "@/app/actions/vendor";
import { ShopForm } from "@/components/vendor/ShopForm";

const STEPS = [
  { title: "Fill your details", body: "Shop name is all we need to start." },
  { title: "Admin review", body: "We verify new shops within 24–48 hours." },
  { title: "Go live", body: "Add products and start receiving enquiries." },
];

export default async function OnboardingPage() {
  const { shop } = await requireVendor();
  if (shop) redirect("/vendor");

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-saffron-600 text-xl shadow-md">
          🏪
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold text-clay-900 sm:text-2xl">Set up your shop</h1>
          <p className="mt-1 text-sm text-clay-600">
            Create your shop profile. It goes live on the marketplace once an admin approves it.
          </p>
        </div>
      </div>

      {/* What happens next */}
      <ol className="mt-5 grid gap-3 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="rounded-2xl bg-white p-4 ring-1 ring-clay-100"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-saffron-100 text-[11px] font-bold text-saffron-700">
                {i + 1}
              </span>
              <span className="text-sm font-bold text-clay-800">{s.title}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-clay-500">{s.body}</p>
          </li>
        ))}
      </ol>

      {/* Form card */}
      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-clay-100 sm:p-8">
        <ShopForm action={createShop} submitLabel="Create shop" showImages />
      </div>

      <p className="mt-4 text-center text-xs text-clay-500">
        Need help? Write to us at{" "}
        <a href="mailto:support@murtimarket.online" className="font-medium text-saffron-700 hover:underline">
          support@murtimarket.online
        </a>
      </p>
    </div>
  );
}
