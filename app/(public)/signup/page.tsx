import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-2xl border border-clay-100 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p className="mt-2 text-sm text-clay-700">
          Vendor accounts are created by the admin team. Please contact us to get started.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-saffron-600 px-6 py-3 font-semibold text-white hover:bg-saffron-700"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
