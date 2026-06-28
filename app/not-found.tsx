import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="text-6xl">🪔</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-clay-700">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-saffron-600 px-6 py-3 font-semibold text-white hover:bg-saffron-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
