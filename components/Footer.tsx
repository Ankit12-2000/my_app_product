import Link from "next/link";

const cols = [
  {
    title: "Marketplace",
    links: [
      { href: "/search", label: "All Products" },
      { href: "/categories", label: "Categories" },
      { href: "/vendors", label: "Vendors" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Help Center" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-clay-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-saffron-600 text-white">ॐ</span>
            <span className="text-lg font-bold">MoortiBazaar</span>
          </div>
          <p className="mt-3 text-sm text-clay-700">
            India&apos;s marketplace for handcrafted statues &amp; idols. Connect directly with verified artisans.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-clay-900">{col.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-clay-700">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-saffron-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-clay-100 py-4 text-center text-xs text-clay-700">
        © {new Date().getFullYear()} MoortiBazaar. Inquiry-based marketplace — no online payments.
      </div>
    </footer>
  );
}
