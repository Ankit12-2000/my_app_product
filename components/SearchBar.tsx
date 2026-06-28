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
    <form onSubmit={submit} className="flex w-full max-w-2xl">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Ganesh, marble murti, Buddha, city…"
        className="w-full rounded-l-full border border-clay-100 bg-white px-5 py-3 text-clay-900 outline-none focus:border-saffron-400"
        aria-label="Search products"
      />
      <button
        type="submit"
        className="rounded-r-full bg-saffron-600 px-6 py-3 font-medium text-white transition hover:bg-saffron-700"
      >
        Search
      </button>
    </form>
  );
}
