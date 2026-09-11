"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VendorNav, type VendorCounts } from "@/components/vendor/VendorNav";
import { IconExternal, IconMenu, IconX } from "@/components/admin/icons";

/** Vendor app shell — mirrors the admin shell so both panels feel like one product. */
export function VendorShell({
  email,
  shopName,
  shopSlug,
  hasShop,
  counts,
  logout,
  children,
}: {
  email: string | null;
  shopName: string;
  shopSlug: string | null;
  hasShop: boolean;
  counts: VendorCounts;
  logout: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const inner = (
    <>
      {hasShop ? (
        <>
          <div className="mb-4 rounded-xl bg-saffron-600 p-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">Your Shop</p>
            <p className="mt-1 truncate text-base font-bold">{shopName}</p>
          </div>
          <VendorNav counts={counts} onNavigate={() => setOpen(false)} />
        </>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-clay-200 bg-white p-5 text-center">
          <p className="text-2xl" aria-hidden>🏪</p>
          <p className="mt-2 text-sm font-bold text-clay-800">Finish setup</p>
          <p className="mt-1 text-xs leading-relaxed text-clay-500">
            Complete your profile to unlock the dashboard.
          </p>
          <Link
            href="/vendor/onboarding"
            className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg bg-saffron-600 px-4 text-sm font-bold text-white transition hover:bg-saffron-700"
          >
            Continue
          </Link>
        </div>
      )}
    </>
  );

  return (
    <div className="theme-premium min-h-screen bg-clay-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-clay-200 bg-white lg:flex">
        <Brand />
        <div className="admin-scroll flex-1 overflow-y-auto px-3 py-5">{inner}</div>
        <Footer email={email} shopSlug={shopSlug} logout={logout} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-clay-200 bg-white/90 px-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-lg text-clay-700 transition hover:bg-clay-100"
        >
          <IconMenu className="h-5 w-5" />
        </button>
        <Link href="/vendor" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-600 text-base text-white">ॐ</span>
          <span className="text-[15px] font-semibold tracking-tight text-clay-900">Murti Market Online</span>
        </Link>
        <form action={logout}>
          <button className="h-9 rounded-lg px-3 text-sm font-medium text-clay-600 transition hover:bg-clay-100">
            Logout
          </button>
        </form>
      </header>

      {/* Mobile drawer */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-40 bg-clay-950/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal={open}
        aria-label="Vendor navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(17rem,84vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-clay-200 px-4">
          <span className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-600 text-base text-white">ॐ</span>
            <span className="text-[15px] font-semibold tracking-tight text-clay-900">Vendor</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-clay-500 transition hover:bg-clay-100"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="admin-scroll flex-1 overflow-y-auto px-3 py-5">{inner}</div>
        <Footer email={email} shopSlug={shopSlug} logout={logout} />
      </aside>

      {/* Content */}
      <div className="lg:pl-64">
        <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex h-16 items-center gap-2.5 border-b border-clay-200 px-5">
      <Link href="/vendor" className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-saffron-600 text-lg text-white">
          ॐ
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[15px] font-semibold tracking-tight text-clay-900">Murti Market Online</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-clay-400">Vendor</span>
        </span>
      </Link>
    </div>
  );
}

function Footer({
  email,
  shopSlug,
  logout,
}: {
  email: string | null;
  shopSlug: string | null;
  logout: () => void | Promise<void>;
}) {
  return (
    <div className="border-t border-clay-200 p-3">
      {shopSlug && (
        <Link
          href={`/shop/${shopSlug}`}
          className="mb-1 flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-clay-500 transition hover:bg-clay-50 hover:text-clay-900"
        >
          <IconExternal className="h-4 w-4" />
          View shop
        </Link>
      )}
      <div className="flex items-center gap-2 rounded-lg px-3 py-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-clay-900 text-[11px] font-bold text-white">
          {(email ?? "V").slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs text-clay-500">{email ?? "Vendor"}</span>
        <form action={logout}>
          <button className="rounded-lg px-2 py-1 text-xs font-semibold text-clay-500 transition hover:bg-clay-100 hover:text-clay-900">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
