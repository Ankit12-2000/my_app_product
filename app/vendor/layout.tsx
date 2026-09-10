import { requireVendor } from "@/lib/auth";
import { getVendorStats } from "@/lib/data/vendor";
import { logout } from "@/app/actions/auth";
import { VendorShell } from "@/components/vendor/VendorShell";
import type { VendorCounts } from "@/components/vendor/VendorNav";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const { email, shop } = await requireVendor();

  // getVendorStats is cached per request, so the dashboard reuses this.
  const counts: VendorCounts = shop
    ? await getVendorStats(shop.id).then((s) => ({
        inquiries: s.inquiriesNew,
        products: s.products,
        quotations: s.quotations,
      }))
    : {};

  return (
    <VendorShell
      email={email}
      shopName={shop?.name ?? ""}
      shopSlug={shop?.slug ?? null}
      hasShop={Boolean(shop)}
      counts={counts}
      logout={logout}
    >
      {children}
    </VendorShell>
  );
}
