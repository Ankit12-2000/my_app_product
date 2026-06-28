"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/vendor-leads", label: "Vendor Leads", icon: "📩" },
  { href: "/admin/vendors", label: "Vendors", icon: "🏪" },
  { href: "/admin/products", label: "Products", icon: "🧱" },
  { href: "/admin/taxonomy", label: "Categories & Materials", icon: "🗂️" },
  { href: "/admin/blogs", label: "Blog / CMS", icon: "📝" },
  { href: "/admin/banners", label: "Banners", icon: "🖼️" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
              active ? "bg-clay-900 text-white" : "text-clay-700 hover:bg-clay-100"
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
