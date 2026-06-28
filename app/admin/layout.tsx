import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();

  return (
    <div className="min-h-screen bg-clay-50">
      <header className="bg-clay-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-saffron-600">ॐ</span>
            <span className="font-bold">
              MoortiBazaar
              <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium">Admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-white/80 hover:text-white">View site ↗</Link>
            <span className="hidden text-white/60 sm:inline">{email}</span>
            <form action={logout}>
              <button className="rounded-full border border-white/20 px-3 py-1.5 font-medium hover:bg-white/10">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <AdminSidebar />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
