import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-clay-100 bg-clay-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 text-lg text-white shadow-sm">
              ॐ
            </span>
            <span className="text-xl font-bold tracking-tight text-clay-900">
              Moorti<span className="text-saffron-600">Bazaar</span>
            </span>
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <SearchBar />
          </div>

          <MobileNav />
        </div>

        <div className="md:hidden">
          <SearchBar />
        </div>

        <NavLinks />
      </div>
    </header>
  );
}
