"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconArticle,
  IconBox,
  IconChat,
  IconDashboard,
  IconImage,
  IconInbox,
  IconStore,
  IconTags,
} from "@/components/admin/icons";

export type BadgeKey = "leads" | "vendors" | "products" | "inquiries";
export type NavCounts = Partial<Record<BadgeKey, number>>;

type NavItem = {
  href: string;
  label: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  exact?: boolean;
  badgeKey?: BadgeKey;
};

const GROUPS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard", Icon: IconDashboard, exact: true }],
  },
  {
    heading: "Marketplace",
    items: [
      { href: "/admin/vendor-leads", label: "Vendor Leads", Icon: IconInbox, badgeKey: "leads" },
      { href: "/admin/vendors", label: "Vendors", Icon: IconStore, badgeKey: "vendors" },
      { href: "/admin/products", label: "Products", Icon: IconBox, badgeKey: "products" },
      { href: "/admin/inquiries", label: "Inquiries", Icon: IconChat, badgeKey: "inquiries" },
      { href: "/admin/taxonomy", label: "Categories & Materials", Icon: IconTags },
    ],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/blogs", label: "Blog / CMS", Icon: IconArticle },
      { href: "/admin/banners", label: "Banners", Icon: IconImage },
    ],
  },
];

const isActive = (pathname: string, item: NavItem) =>
  item.exact ? pathname === item.href : pathname.startsWith(item.href);

export function AdminNav({
  counts = {},
  onNavigate,
}: {
  counts?: NavCounts;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      {GROUPS.map((group) => (
        <div key={group.heading}>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-clay-400">
            {group.heading}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item);
              const count = item.badgeKey ? counts[item.badgeKey] ?? 0 : 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
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
                    <item.Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        active ? "text-saffron-600" : "text-clay-400 group-hover:text-clay-600"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
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
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
