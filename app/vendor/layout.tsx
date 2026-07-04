import Link from "next/link";
import { requireVendor } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const { email, shop } = await requireVendor();

  return (
    <div className="min-h-screen bg-clay-50">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-clay-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/vendor" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 text-base font-bold text-white shadow-md shadow-saffron-200">
              ॐ
            </span>
            <span className="text-lg font-extrabold">
              Moorti<span className="text-saffron-600">Bazaar</span>
            </span>
            <span className="hidden rounded-lg bg-saffron-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-saffron-700 sm:inline">
              Vendor Panel
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/shop/${shop?.slug ?? ""}`}
              className="hidden items-center gap-1.5 rounded-lg border border-clay-200 px-3 py-1.5 text-sm font-medium text-clay-700 transition hover:border-saffron-200 hover:bg-saffron-50 hover:text-saffron-700 sm:flex"
            >
              <span className="text-xs">🌐</span>
              View Shop
            </Link>
            <div className="hidden h-5 w-px bg-clay-200 sm:block" />
            <span className="hidden text-sm text-clay-500 sm:inline">{email}</span>
            <form action={logout}>
              <button className="rounded-lg border border-clay-200 px-3 py-1.5 text-sm font-medium text-clay-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          {shop ? (
            <VendorSidebar shopName={shop.name} />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-clay-200 bg-white p-6 text-center">
              <p className="text-3xl">🏪</p>
              <p className="mt-2 text-sm font-medium text-clay-700">Finish setting up your shop</p>
              <p className="mt-1 text-xs text-clay-500">Complete your profile to unlock the dashboard.</p>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
