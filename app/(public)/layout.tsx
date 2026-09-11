import { headers } from "next/headers";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

function isSubdomain(host: string): boolean {
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");
  if (parts.length < 2) return false;
  const lastTwo = parts.slice(-2).join(".");
  const isProd = lastTwo === "murtimarket.online";
  const isDev = lastTwo === "localhost" && parts.length === 2;
  if (!isProd && !isDev) return false;
  if (isProd && parts.length >= 3) {
    const first = parts[0];
    if (first && !["www", "app", "api", "mail", "admin"].includes(first)) {
      return true;
    }
  }
  if (isDev && parts[0] !== "localhost") {
    return true;
  }
  return false;
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const host = h.get("host") || "";
  const subdomain = isSubdomain(host);

  if (subdomain) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
