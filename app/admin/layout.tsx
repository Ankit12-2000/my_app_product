import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { getAdminStats } from "@/lib/data/admin";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();
  const stats = await getAdminStats();

  const counts = {
    leads: stats.vendorLeadsPending,
    vendors: stats.vendorsPending,
    products: stats.productsPending,
    inquiries: stats.inquiriesNew,
  };

  return (
    <AdminShell email={email} counts={counts} logout={logout}>
      {children}
    </AdminShell>
  );
}
