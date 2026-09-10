import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { Shop } from "@/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Every helper here is wrapped in React.cache(), which memoises per request.
// A layout and the page it renders both call requireAdmin()/requireVendor();
// without this each one paid for its own auth.getUser() round trip plus a
// profiles/shops read, doubling the latency of every admin and vendor page.

// Returns the current authenticated user, or null.
export const getSessionUser = cache(async () => {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
});

// Returns the logged-in vendor's user + their shop (shop may be null if they
// haven't completed onboarding yet). Redirects to /login when not signed in.
export const requireVendor = cache(async (): Promise<{
  userId: string;
  email: string | null;
  shop: Shop | null;
}> => {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/vendor");

  const sb = await createSupabaseServerClient();
  const { data: shop } = await sb
    .from("shops")
    .select("*")
    .eq("vendor_id", user.id)
    .maybeSingle();

  return { userId: user.id, email: user.email ?? null, shop: (shop as Shop) ?? null };
});

// Requires an authenticated user with the 'admin' role. Redirects to login
// when signed out, or to the home page when signed in but not an admin.
export const requireAdmin = cache(async (): Promise<{ userId: string; email: string | null }> => {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");

  const sb = await createSupabaseServerClient();
  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") redirect("/");

  return { userId: user.id, email: user.email ?? null };
});

// Like requireVendor, but also requires a completed shop. Redirects to the
// onboarding flow when the vendor hasn't created their shop yet. If the shop
// exists but hasn't been approved by an admin, redirects to a pending page.
export const requireVendorShop = cache(async (): Promise<{
  userId: string;
  email: string | null;
  shop: Shop;
}> => {
  const { userId, email, shop } = await requireVendor();
  if (!shop) redirect("/vendor/onboarding");
  if (!shop.is_approved) redirect("/vendor/pending");
  return { userId, email, shop };
});
