import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { getAdminStats } from "@/lib/data/admin";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminSidebar";
import { IconExternal } from "@/components/admin/icons";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();
  const stats = await getAdminStats();

  const counts = {
    leads: stats.vendorLeadsPending,
    vendors: stats.vendorsPending,
    products: stats.productsPending,
  };

  return (
    <div className="min-h-screen bg-clay-50">
      <header className="sticky top-0 z-40 border-b border-clay-800/60 bg-clay-900/95 text-white backdrop-blur supports-[backdrop-filter]:bg-clay-900/85">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-600 text-base leading-none">
              ॐ
            </span>
            <span className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold tracking-tight">MoortiBazaar</span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70">
                Admin
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              View site
              <IconExternal className="h-3.5 w-3.5" />
            </Link>
            <span className="hidden max-w-[200px] truncate border-l border-white/15 pl-3 text-sm text-white/60 md:inline">
              {email}
            </span>
            <form action={logout}>
              <button className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white/90 transition hover:border-white/40 hover:bg-white/10">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 py-6 sm:px-6 lg:py-8">
        <aside className="hidden w-[228px] shrink-0 lg:block">
          <div className="sticky top-[76px]">
            <AdminSidebar counts={counts} />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-5 lg:hidden">
            <AdminMobileNav counts={counts} />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
