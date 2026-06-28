import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./config";

// Admin Supabase client with service role key.
// Use ONLY in server actions / API routes for admin-only operations
// (e.g. creating users, managing auth). Never expose this key to the client.

export function createSupabaseAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
