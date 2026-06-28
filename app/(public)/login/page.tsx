import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Vendor Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-2xl border border-clay-100 bg-white p-8">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-saffron-600 text-xl text-white">ॐ</span>
          <h1 className="mt-3 text-2xl font-bold">Vendor Login</h1>
          <p className="mt-1 text-sm text-clay-600">Manage your shop, products and inquiries.</p>
        </div>
        <div className="mt-6">
          <AuthForm mode="login" next={next} />
        </div>
      </div>
    </div>
  );
}
