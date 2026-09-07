"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconArticle,
  IconBox,
  IconDashboard,
  IconImage,
  IconInbox,
  IconStore,
  IconTags,
} from "@/components/admin/icons";

type NavItem = {
  href: string;
  label: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  exact?: boolean;
  badgeKey?: BadgeKey;
};

export type BadgeKey = "leads" | "vendors" | "products";
export type NavCounts = Partial<Record<BadgeKey, number>>;

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

/** Desktop sidebar: grouped nav with pending-count badges. */
export function AdminSidebar({ counts = {} }: { counts?: NavCounts }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      {GROUPS.map((group) => (
        <div key={group.heading}>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-clay-400">
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
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-white text-clay-900 shadow-[0_1px_2px_rgba(46,40,32,0.06)] ring-1 ring-clay-200/70"
                        : "text-clay-600 hover:bg-clay-100/70 hover:text-clay-900"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-saffron-600 transition-opacity",
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
                      <span className="ml-auto rounded-full bg-saffron-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white tabular">
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

/** Mobile: a horizontally scrollable pill bar shown below the header. */
export function AdminMobileNav({ counts = {} }: { counts?: NavCounts }) {
  const pathname = usePathname();
  const items = GROUPS.flatMap((g) => g.items);

  return (
    <div className="admin-scroll -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:hidden">
      {items.map((item) => {
        const active = isActive(pathname, item);
        const count = item.badgeKey ? counts[item.badgeKey] ?? 0 : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "border-clay-900 bg-clay-900 text-white"
                : "border-clay-200 bg-white text-clay-600 hover:border-clay-300"
            )}
          >
            <item.Icon className="h-3.5 w-3.5" />
            {item.label}
            {count > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] font-bold tabular",
                  active ? "bg-white/20 text-white" : "bg-saffron-100 text-saffron-700"
                )}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
