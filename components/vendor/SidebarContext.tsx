"use client";

import { createContext, useContext, useState, useCallback } from "react";

const SidebarCtx = createContext({ open: false, toggle: () => {} });
export const useSidebar = () => useContext(SidebarCtx);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return (
    <SidebarCtx.Provider value={{ open, toggle }}>
      {children}
    </SidebarCtx.Provider>
  );
}
