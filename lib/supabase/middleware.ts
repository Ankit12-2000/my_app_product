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

  // Server Action POSTs expect an RSC payload, not a 3xx to an HTML page. If we
  // redirect one, the browser follows it, React gets HTML back and the whole app
  // dies with "An unexpected response was received from the server". Let these
  // through instead — requireAdmin()/requireVendor() inside the action call
  // redirect(), which Next encodes into the action response the client can act on.
  const isServerAction = request.headers.get("next-action") !== null;

  // Protect the vendor portal (note: must not match the public "/vendors" pages)
  // and the admin panel. Role enforcement happens in the respective layouts.
  const isVendorPortal = path === "/vendor" || path.startsWith("/vendor/");
  const isAdminPanel = path === "/admin" || path.startsWith("/admin/");
  if ((isVendorPortal || isAdminPanel) && !user && !isServerAction) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Logged-in users skip the auth pages. Honour ?next= when it points at an
  // in-app path, otherwise send admins to /admin and vendors to /vendor —
  // an admin has no shop, so a blind /vendor default dead-ends in onboarding.
  if ((path === "/login" || path === "/signup") && user && !isServerAction) {
    const url = request.nextUrl.clone();
    const next = request.nextUrl.searchParams.get("next");
    url.search = "";

    // Only relative paths; "//host" would be an off-site redirect.
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      const target = new URL(next, request.url);
      url.pathname = target.pathname;
      url.search = target.search;
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      url.pathname = profile?.role === "admin" ? "/admin" : "/vendor";
    }
    return NextResponse.redirect(url);
  }

  return response;
}
