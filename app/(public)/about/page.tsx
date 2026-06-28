import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">About MoortiBazaar</h1>
      <p className="mt-4 text-lg text-clay-700">
        MoortiBazaar is Jaipur&apos;s trusted marketplace for premium marble statues and handcrafted
        idols. We bring together the finest artisans and skilled sculptors from Jaipur, connecting
        you directly with the creators of authentic marble murtis, temple idols, garden statues,
        and custom sculptures. Every piece is handcrafted with exceptional craftsmanship, quality,
        and devotion.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {[
          { n: "500+", l: "Verified vendors" },
          { n: "10,000+", l: "Statues listed" },
          { n: "50+", l: "Cities covered" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-clay-100 bg-white p-6 text-center">
            <div className="text-2xl font-bold text-saffron-700">{s.n}</div>
            <div className="text-sm text-clay-700">{s.l}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold">Why inquiry-based?</h2>
      <p className="mt-2 text-clay-700">
        Statues are often customised — size, finish, deity and delivery vary for every order. Rather
        than a fixed online checkout, we let you send an inquiry so the vendor can give you an
        accurate, personalised quotation. It&apos;s the way the trade has always worked, now made
        simple online.
      </p>

      <div className="mt-10 rounded-2xl bg-saffron-600 p-8 text-center text-white">
        <h2 className="text-xl font-bold">Sell your craft to all of India</h2>
        <Link
          href="/sell"
          className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 font-semibold text-saffron-700"
        >
          Become a Vendor
        </Link>
      </div>
    </div>
  );
}
