import Link from "next/link";
import { requireVendor } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const { email, shop } = await requireVendor();

  return (
    <div className="min-h-screen bg-clay-50">
      {/* Top bar */}
      <header className="border-b border-clay-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/vendor" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-saffron-600 text-white">ॐ</span>
            <span className="font-bold">
              Moorti<span className="text-saffron-600">Bazaar</span>
              <span className="ml-2 rounded-full bg-clay-100 px-2 py-0.5 text-xs font-medium text-clay-700">
                Vendor
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-clay-700 hover:text-saffron-600">
              View site ↗
            </Link>
            <span className="hidden text-clay-700/70 sm:inline">{email}</span>
            <form action={logout}>
              <button className="rounded-full border border-clay-100 px-3 py-1.5 font-medium text-clay-700 hover:bg-clay-50">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          {shop ? (
            <VendorSidebar shopName={shop.name} />
          ) : (
            <div className="rounded-lg border border-dashed border-clay-100 p-3 text-sm text-clay-700">
              Finish setting up your shop to unlock the dashboard.
            </div>
          )}
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
