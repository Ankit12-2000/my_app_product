"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActive, navItems } from "./nav-items";

// Desktop-only navigation row. On phones the same links live in MobileNav so
// they never end up as a clipped horizontal scroller.
export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 hidden items-center gap-1 px-1 text-sm md:flex">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition",
              active
                ? "bg-saffron-100 text-saffron-800"
                : "text-clay-600 hover:bg-saffron-50 hover:text-saffron-700"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
