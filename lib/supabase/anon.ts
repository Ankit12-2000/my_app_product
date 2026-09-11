import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

// Client for public, non-authenticated reads. Unlike the cookie-bound
// server client it never touches request cookies, so it is safe to call
// inside unstable_cache and can be reused across requests. Public catalog
// tables are readable by the anon role (see supabase/schema.sql RLS), so
// this is exactly what the homepage, search and shopfront reads need.
let client: ReturnType<typeof createClient> | null = null;

export function createSupabasePublicClient() {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}