"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

const links = [
  { href: "/vendor", label: "Dashboard", icon: "📊", exact: true },
  { href: "/vendor/inquiries", label: "Inquiries", icon: "📨" },
  { href: "/vendor/products", label: "Products", icon: "🧱" },
  { href: "/vendor/quotations", label: "Quotations", icon: "🧾" },
  { href: "/vendor/profile", label: "Shop Profile", icon: "🏪" },
];

export function VendorSidebar({ shopName }: { shopName: string }) {
  const pathname = usePathname();
  const { toggle } = useSidebar();

  return (
    <nav className="flex flex-col">
      {/* Shop identity */}
      <div className="mb-4 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-600 p-4 text-white shadow-lg shadow-saffron-200">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Your Shop</p>
        <p className="mt-1 truncate text-lg font-extrabold">{shopName}</p>
      </div>

      {/* Nav links */}
      <div className="flex flex-col gap-0.5">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => {
                if (window.innerWidth < 1024) toggle();
              }}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-saffron-600 text-white shadow-md shadow-saffron-200"
                  : "text-clay-600 hover:bg-clay-100 hover:text-clay-900"
              )}
            >
              <span className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition",
                active ? "bg-white/20" : "bg-clay-100 group-hover:bg-clay-200"
              )}>
                {l.icon}
              </span>
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
