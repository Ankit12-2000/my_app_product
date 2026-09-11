import type { Metadata } from "next";
import { ShopCard } from "@/components/ShopCard";
import { getShops } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Vendors" };

export default async function VendorsPage() {
  const shops = await getShops();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">Verified Vendors</h1>
      <p className="mt-1 text-clay-700">{shops.length} statue makers on Murti Market Online</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((s) => (
          <ShopCard key={s.id} shop={s} />
        ))}
      </div>
    </div>
  );
}
