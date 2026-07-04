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

  // If a subdomain is detected, only rewrite root path to /shop/[slug]
  if (subdomain) {
    // Allow all non-root paths to pass through normally
    // (products, categories, api, etc. work as-is)
    if (
      pathname !== "/" &&
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/_next")
    ) {
      return await updateSession(request);
    }

    // Only rewrite root "/" to the shop page
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = `/shop/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on everything except static assets and image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
