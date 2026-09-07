// Single source of truth for the primary navigation, shared by the desktop row
// and the mobile drawer so the two can never drift apart.
export const navItems = [
  { href: "/", label: "Home" },
  { href: "/search", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/vendors", label: "Vendors" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
