import { headers } from "next/headers";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

function isSubdomain(host: string): boolean {
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");
  if (parts.length >= 2) {
    const first = parts[0];
    if (first && !["www", "app", "api", "mail", "admin", "localhost", "moortibazaar"].includes(first)) {
      return true;
    }
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
