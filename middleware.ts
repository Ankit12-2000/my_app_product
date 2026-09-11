import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ROOT_DOMAIN = "murtimarket.online";

function getSubdomain(hostname: string): string | null {
  const host = hostname.split(":")[0];
  const parts = host.split(".");
  if (parts.length < 2) return null;

  const lastTwo = parts.slice(-2).join(".");
  const isProd = lastTwo === "murtimarket.online";
  const isDev = lastTwo === "localhost" && parts.length === 2;

  if (!isProd && !isDev) return null;

  const potentialSubdomain = parts[0];
  if (isProd && parts.length >= 3) {
    if (potentialSubdomain && !["www", "app", "api", "mail", "admin"].includes(potentialSubdomain)) {
      return potentialSubdomain;
    }
  }
  if (isDev && potentialSubdomain && potentialSubdomain !== "localhost") {
    return potentialSubdomain;
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
