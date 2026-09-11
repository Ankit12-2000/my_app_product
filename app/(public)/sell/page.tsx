import type { Metadata } from "next";
import { VendorLeadForm } from "@/components/public/VendorLeadForm";

export const metadata: Metadata = { title: "Become a Vendor – Murti Market Online" };

export default function SellPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Become a Vendor</h1>
        <p className="mt-3 text-clay-700">
          Sell your moorti, murti &amp; handicraft products on Murti Market Online.
          Fill out the form below and our team will get in touch with you.
        </p>
      </div>
      <div className="mt-8 rounded-2xl border border-clay-100 bg-white p-6">
        <VendorLeadForm />
      </div>
    </div>
  );
}
