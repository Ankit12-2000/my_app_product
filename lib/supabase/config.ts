// Central place to read Supabase env vars and decide whether the app is
// wired to a real Supabase project. When keys are missing we fall back to
// built-in mock data so the public site previews instantly.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

// Admin-only operations (creating vendor logins, resetting passwords) need the
// service_role key. It is optional, so anything using it must check this first
// and fail with a readable message rather than a raw Supabase error.
export const isServiceRoleConfigured =
  isSupabaseConfigured && SUPABASE_SERVICE_ROLE_KEY.length > 0;
