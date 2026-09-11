// Run: npx tsx scripts/create-admin.ts
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// Load .env.local manually
const envContent = readFileSync(".env.local", "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const eq = trimmed.indexOf("=");
  if (eq === -1) return;
  env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY!;

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = "admin@murtimarket.online";
const password = "Admin@123456";
const fullName = "Super Admin";

async function main() {
  // 1. Create auth user
  const { data: user, error: authErr } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (authErr) {
    console.error("Auth error:", authErr.message);
    return;
  }
  console.log("Auth user created:", user.user.id);

  // 2. Create profile with admin role
  const { error: profErr } = await sb.from("profiles").upsert({
    id: user.user.id,
    full_name: fullName,
    role: "admin",
  });
  if (profErr) {
    console.error("Profile error:", profErr.message);
    return;
  }
  console.log("Admin profile created!");
  console.log(`\nLogin with:\n  Email: ${email}\n  Password: ${password}`);
}

main();
