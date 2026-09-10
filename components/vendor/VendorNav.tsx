"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconBox, IconChat, IconClipboard, IconDashboard, IconStore } from "@/components/admin/icons";

export type VendorCounts = Partial<Record<"inquiries" | "products" | "quotations", number>>;

const links: {
  href: string;
  label: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  exact?: boolean;
  badgeKey?: keyof VendorCounts;
}[] = [
  { href: "/vendor", label: "Dashboard", Icon: IconDashboard, exact: true },
  { href: "/vendor/inquiries", label: "Inquiries", Icon: IconChat, badgeKey: "inquiries" },
  { href: "/vendor/products", label: "Products", Icon: IconBox, badgeKey: "products" },
  { href: "/vendor/quotations", label: "Quotations", Icon: IconClipboard, badgeKey: "quotations" },
  { href: "/vendor/profile", label: "Shop Profile", Icon: IconStore },
];

export function VendorNav({
  counts = {},
  onNavigate,
}: {
  counts?: VendorCounts;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        const count = l.badgeKey ? counts[l.badgeKey] ?? 0 : 0;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
              active
                ? "bg-clay-100 font-semibold text-clay-900"
                : "text-clay-500 hover:bg-clay-50 hover:text-clay-900"
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-saffron-600 transition-opacity",
                active ? "opacity-100" : "opacity-0"
              )}
            />
            <l.Icon
              className={cn(
                "h-[18px] w-[18px] shrink-0 transition-colors",
                active ? "text-saffron-600" : "text-clay-400 group-hover:text-clay-600"
              )}
            />
            <span className="truncate">{l.label}</span>
            {count > 0 && (
              <span
                className={cn(
                  "tabular ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                  active ? "bg-saffron-600 text-white" : "bg-clay-200 text-clay-600"
                )}
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
