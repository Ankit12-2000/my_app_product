"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminNav, type NavCounts } from "@/components/admin/AdminNav";
import { IconExternal, IconMenu, IconX } from "@/components/admin/icons";

/**
 * The admin app shell: a fixed full-height sidebar on desktop, a slide-in
 * drawer on mobile, and a padded content column. Replaces the old top-bar +
 * in-flow sidebar layout. `logout` is a server action passed down from the
 * (server) layout so the footer button can post to it.
 */
export function AdminShell({
  email,
  counts,
  logout,
  children,
}: {
  email: string | null;
  counts: NavCounts;
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

  return (
    <div className="theme-premium min-h-screen bg-clay-50">
      {/* Desktop sidebar — fixed, full height */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-clay-200 bg-white lg:flex">
        <Brand />
        <div className="admin-scroll flex-1 overflow-y-auto px-3 py-5">
          <AdminNav counts={counts} />
        </div>
        <Footer email={email} logout={logout} />
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
        <Link href="/admin" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-600 text-base text-white">ॐ</span>
          <span className="text-[15px] font-semibold tracking-tight text-clay-900">MoortiBazaar</span>
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
        className={cnDrawerBackdrop(open)}
      />
      <aside
        role="dialog"
        aria-modal={open}
        aria-label="Admin navigation"
        className={cnDrawer(open)}
      >
        <div className="flex h-14 items-center justify-between border-b border-clay-200 px-4">
          <span className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-600 text-base text-white">ॐ</span>
            <span className="text-[15px] font-semibold tracking-tight text-clay-900">MoortiBazaar</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-clay-500 transition hover:bg-clay-100"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="admin-scroll flex-1 overflow-y-auto px-3 py-5">
          <AdminNav counts={counts} onNavigate={() => setOpen(false)} />
        </div>
        <Footer email={email} logout={logout} />
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
      <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-saffron-600 text-lg text-white">
          ॐ
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[15px] font-semibold tracking-tight text-clay-900">MoortiBazaar</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-clay-400">Admin</span>
        </span>
      </Link>
    </div>
  );
}

function Footer({ email, logout }: { email: string | null; logout: () => void | Promise<void> }) {
  return (
    <div className="border-t border-clay-200 p-3">
      <Link
        href="/"
        className="mb-1 flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-clay-500 transition hover:bg-clay-50 hover:text-clay-900"
      >
        <IconExternal className="h-4 w-4" />
        View site
      </Link>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-clay-900 text-[11px] font-bold text-white">
          {(email ?? "A").slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs text-clay-500">{email ?? "Admin"}</span>
        <form action={logout}>
          <button className="rounded-lg px-2 py-1 text-xs font-semibold text-clay-500 transition hover:bg-clay-100 hover:text-clay-900">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

const cnDrawerBackdrop = (open: boolean) =>
  `fixed inset-0 z-40 bg-clay-950/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
    open ? "opacity-100" : "pointer-events-none opacity-0"
  }`;

const cnDrawer = (open: boolean) =>
  `fixed inset-y-0 left-0 z-50 flex w-[min(17rem,84vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
    open ? "translate-x-0" : "-translate-x-full"
  }`;
