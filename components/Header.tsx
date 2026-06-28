import Link from "next/link";
import { SearchBar } from "./SearchBar";

const nav = [
  { href: "/", label: "Home" },
  { href: "/search", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/vendors", label: "Vendors" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-clay-100 bg-clay-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-saffron-600 text-lg text-white">
              ॐ
            </span>
            <span className="text-xl font-bold tracking-tight text-clay-900">
              Moorti<span className="text-saffron-600">Bazaar</span>
            </span>
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3 text-sm">
          </div>
        </div>

        <div className="md:hidden">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-clay-700 transition hover:bg-saffron-50 hover:text-saffron-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
