import "server-only";
import { redirect } from "next/navigation";
import type { Shop } from "@/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Returns the current authenticated user, or null.
export async function getSessionUser() {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
}

// Returns the logged-in vendor's user + their shop (shop may be null if they
// haven't completed onboarding yet). Redirects to /login when not signed in.
export async function requireVendor(): Promise<{
  userId: string;
  email: string | null;
  shop: Shop | null;
}> {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) redirect("/login?next=/vendor");

  const { data: shop } = await sb
    .from("shops")
    .select("*")
    .eq("vendor_id", user.id)
    .maybeSingle();

  return { userId: user.id, email: user.email ?? null, shop: (shop as Shop) ?? null };
}

// Requires an authenticated user with the 'admin' role. Redirects to login
// when signed out, or to the home page when signed in but not an admin.
export async function requireAdmin(): Promise<{ userId: string; email: string | null }> {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") redirect("/");

  return { userId: user.id, email: user.email ?? null };
}

// Like requireVendor, but also requires a completed shop. Redirects to the
// onboarding flow when the vendor hasn't created their shop yet. If the shop
// exists but hasn't been approved by an admin, redirects to a pending page.
export async function requireVendorShop(): Promise<{
  userId: string;
  email: string | null;
  shop: Shop;
}> {
  const { userId, email, shop } = await requireVendor();
  if (!shop) redirect("/vendor/onboarding");
  if (!shop.is_approved) redirect("/vendor/pending");
  return { userId, email, shop };
}
