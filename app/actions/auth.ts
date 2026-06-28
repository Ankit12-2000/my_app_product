"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  notice?: string;
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/vendor") || "/vendor";

  const sb = await createSupabaseServerClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect(next);
}

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) return { error: "Password must be at least 6 characters." };

  const sb = await createSupabaseServerClient();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } },
  });
  if (error) return { error: error.message };

  // If email confirmation is disabled, a session is returned immediately.
  if (data.session) redirect("/vendor/onboarding");

  return {
    notice:
      "Account created! Please check your email to confirm, then log in. (If email confirmation is disabled on the project, you can log in right away.)",
  };
}

export async function logout() {
  const sb = await createSupabaseServerClient();
  await sb.auth.signOut();
  redirect("/login");
}
