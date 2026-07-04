import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ROOT_DOMAIN = "moortibazaar.com";

function getSubdomain(hostname: string): string | null {
  // Strip port (localhost:3000 → localhost)
  const host = hostname.split(":")[0];
  const parts = host.split(".");
  // demo-shop.moortibazaar.com → demo-shop
  // demo-shop.localhost → demo-shop (dev)
  if (parts.length >= 2) {
    const potentialSubdomain = parts[0];
    // Ignore www, app, api, mail etc.
    if (potentialSubdomain && !["www", "app", "api", "mail", "admin", "localhost", "moortibazaar"].includes(potentialSubdomain)) {
      return potentialSubdomain;
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  const subdomain = getSubdomain(hostname);

  // If a subdomain is detected, rewrite to /shop/[slug]
  if (subdomain) {
    const url = request.nextUrl.clone();
    // Allow /api, /_next, static files to pass through on subdomains
    if (
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
    ) {
      return await updateSession(request);
    }
    url.pathname = `/shop/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on everything except static assets and image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
