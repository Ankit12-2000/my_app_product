import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-2 text-clay-700">
        Questions about the marketplace, a vendor or your inquiry? We&apos;re here to help.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <ContactRow icon="📧" label="Email" value="ank440851@gmail.com" />
          <ContactRow icon="📞" label="Phone" value="+91 9351779792" />
          <ContactRow icon="🕑" label="Hours" value="Mon–Sat, 10am – 7pm IST" />
          <ContactRow icon="📍" label="Office" value="Jaipur, Rajasthan, India" />
        </div>

        <form className="space-y-3 rounded-2xl border border-clay-100 bg-white p-5">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 outline-none focus:border-saffron-400" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 outline-none focus:border-saffron-400" />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea rows={4} className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 outline-none focus:border-saffron-400" />
          </div>
          <button
            type="button"
            className="w-full rounded-full bg-saffron-600 px-6 py-3 font-semibold text-white hover:bg-saffron-700"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-clay-100 bg-white p-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-sm text-clay-700">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
