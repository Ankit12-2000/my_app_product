import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

// Refreshes the Supabase auth session on every request and guards the
// /vendor portal. Public routes are unaffected.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // No Supabase yet → nothing to refresh or guard.
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Protect the vendor portal (note: must not match the public "/vendors" pages)
  // and the admin panel. Role enforcement happens in the respective layouts.
  const isVendorPortal = path === "/vendor" || path.startsWith("/vendor/");
  const isAdminPanel = path === "/admin" || path.startsWith("/admin/");
  if ((isVendorPortal || isAdminPanel) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Logged-in users skip the auth pages.
  if ((path === "/login" || path === "/signup") && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/vendor";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
