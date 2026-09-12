import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Murti Market Online",
  description:
    "Questions about the marketplace, a vendor or your inquiry? Reach out to the Murti Market Online team.",
};

const contacts = [
  {
    label: "Email",
    value: "support@murtimarket.online",
    href: "mailto:support@murtimarket.online",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "Phone / WhatsApp",
    value: "+91 93517 79792",
    href: "tel:+919351779792",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    label: "Hours",
    value: "Mon–Sat · 10 AM – 7 PM IST",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Office",
    value: "Jaipur, Rajasthan, India",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-100 px-3 py-1 text-xs font-bold text-saffron-700">
          We&apos;re here to help
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-clay-900 sm:text-4xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-clay-600 sm:text-base">
          Questions about the marketplace, a vendor or your inquiry? Send us a message and
          we&apos;ll get back to you within 24 hours.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        {/* Contact info */}
        <div className="space-y-4 lg:col-span-2">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="flex items-center gap-4 rounded-2xl border border-clay-100 bg-white p-4 shadow-sm transition hover:border-saffron-300 hover:shadow"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-saffron-50 text-saffron-700">
                {c.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wide text-clay-500">
                  {c.label}
                </span>
                <span className="block truncate font-semibold text-clay-900">{c.value}</span>
              </span>
            </a>
          ))}

          <div className="rounded-2xl bg-gradient-to-br from-saffron-600 to-saffron-700 p-5 text-white shadow-sm">
            <p className="font-bold">Sell on Murti Market Online</p>
            <p className="mt-1 text-sm text-saffron-100">
              List your handcrafted statues and reach customers across India.
            </p>
            <a
              href="/sell"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-saffron-700 transition hover:bg-saffron-50"
            >
              Become a Seller →
            </a>
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-3xl border border-clay-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
          <h2 className="text-xl font-bold text-clay-900">Send us a message</h2>
          <p className="mt-1 text-sm text-clay-600">
            Fill in the form and our team will respond within 24 hours.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}