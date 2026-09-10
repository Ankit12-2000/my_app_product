"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActive, navItems } from "./nav-items";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Navigating away should always leave the drawer closed.
  useEffect(() => setOpen(false), [pathname]);

  // Escape closes the sheet, and the page behind it stops scrolling while
  // it's open — otherwise a swipe on the backdrop moved the page underneath.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="grid h-10 w-10 place-items-center rounded-lg border border-clay-200 bg-white text-clay-800 transition hover:bg-clay-50"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <>
          {/* Tapping anywhere outside the sheet dismisses it. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default bg-clay-950/25"
          />
          <nav
            id="mobile-nav"
            className="absolute inset-x-0 top-full z-40 max-h-[70vh] overflow-y-auto border-b border-clay-200 bg-white shadow-lg"
          >
            <ul className="mx-auto max-w-7xl px-4 py-2">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium transition",
                        active ? "bg-saffron-50 text-saffron-800" : "text-clay-700 hover:bg-clay-50"
                      )}
                    >
                      {item.label}
                      <span aria-hidden className="text-clay-300">
                        ›
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
