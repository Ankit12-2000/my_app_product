"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/vendor", label: "Dashboard", icon: "📊", exact: true },
  { href: "/vendor/inquiries", label: "Inquiries", icon: "📨" },
  { href: "/vendor/products", label: "Products", icon: "🧱" },
  { href: "/vendor/quotations", label: "Quotations", icon: "🧾" },
  { href: "/vendor/profile", label: "Shop Profile", icon: "🏪" },
];

export function VendorSidebar({ shopName }: { shopName: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      <div className="mb-3 px-3">
        <p className="text-xs uppercase tracking-wide text-clay-700/60">Shop</p>
        <p className="truncate font-semibold text-clay-900">{shopName}</p>
      </div>
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-saffron-600 text-white"
                : "text-clay-700 hover:bg-saffron-50 hover:text-saffron-700"
            )}
          >
            <span>{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
