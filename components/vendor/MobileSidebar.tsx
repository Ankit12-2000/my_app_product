"use client";

import { useSidebar } from "./SidebarContext";
import { VendorSidebar } from "./VendorSidebar";

export function MobileMenuButton() {
  const { toggle } = useSidebar();
  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-clay-700 transition hover:bg-clay-100 lg:hidden"
      aria-label="Open menu"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>
  );
}

export function SidebarDrawer({ shopName }: { shopName: string }) {
  const { open, toggle } = useSidebar();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-5">
          {/* Close button */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-clay-400">Navigation</span>
            <button
              onClick={toggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-clay-500 transition hover:bg-clay-100 hover:text-clay-900"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sidebar content */}
          <VendorSidebar shopName={shopName} />
        </div>
      </div>
    </>
  );
}
