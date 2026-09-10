"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} role="search" className="flex w-full max-w-2xl">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Ganesh, marble murti, Buddha, city…"
        className="h-12 w-full min-w-0 rounded-l-full border border-clay-100 bg-white px-4 text-clay-900 outline-none transition focus:border-saffron-400 sm:px-5"
        aria-label="Search products"
      />
      {/* Icon-only below sm — the word "Search" ate a third of a phone's width. */}
      <button
        type="submit"
        aria-label="Search"
        className="flex h-12 shrink-0 items-center justify-center rounded-r-full bg-saffron-600 px-4 font-medium text-white transition hover:bg-saffron-700 sm:px-6"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="h-5 w-5 sm:hidden"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}
