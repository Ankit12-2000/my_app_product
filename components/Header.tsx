import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-clay-100 bg-clay-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-2.5 sm:gap-3 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 text-lg text-white shadow-sm sm:h-10 sm:w-10">
              ॐ
            </span>
            <span className="truncate text-lg font-bold tracking-tight text-clay-900 sm:text-xl">
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
