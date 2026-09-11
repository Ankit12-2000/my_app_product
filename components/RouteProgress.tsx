"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Slim top progress bar shown while the App Router is loading the next page.
// next/link navigations have no public "started" event, so we detect link
// clicks ourselves and ease the bar forward; once the pathname settles we
// snap to 100% and fade out.

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [settled, setSettled] = useState(false);
  const raf = useRef<number | null>(null);
  const lastPath = useRef<string>(`${pathname}${searchParams.toString()}`);

  useEffect(() => {
    // Route settled: finish and fade out.
    setProgress(1);
    setSettled(true);
    const t = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      setSettled(false);
    }, 220);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  useEffect(() => {
    let last = 0;
    const tick = (now: number) => {
      // Ease toward ~90% so the bar visibly keeps moving while the server
      // streams; it snaps to 100% when the route actually settles.
      if (!last) last = now;
      const dt = (now - last) / 1000;
      last = now;
      setProgress((p) => {
        if (settled) return 1;
        const next = p + dt * (0.28 + p * 0.55);
        return Math.min(0.9, next);
      });
      raf.current = requestAnimationFrame(tick);
    };
    if (visible) raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [visible, settled]);

  useEffect(() => {
    const isSameOrigin = (href: string) => {
      try {
        const url = new URL(href, window.location.href);
        return url.origin === window.location.origin;
      } catch {
        return false;
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as HTMLElement | null)?.closest?.("a");
      const a = el as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;
      if (!isSameOrigin(href)) return;

      lastPath.current = `${pathname}${searchParams.toString()}`;
      setSettled(false);
      setVisible(true);
      setProgress(0.02);
    };

    const end = () => {
      const current = `${pathname}${searchParams.toString()}`;
      if (current !== lastPath.current) {
        setProgress(1);
        setSettled(true);
      } else {
        setVisible(false);
        setProgress(0);
        setSettled(false);
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", end);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", end);
    };
  }, [pathname, searchParams]);

  const width = Math.round(progress * 100);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 transition-opacity duration-200"
      style={{
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? "0s" : "0.15s",
      }}
    >
      <div
        className="h-full bg-gradient-to-r from-saffron-500 via-saffron-600 to-saffron-500 transition-[width] duration-200 ease-linear"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}