"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface VendorLeadState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

function isValidPhone(phone: string) {
  return /^[+]?[\d\s-]{8,15}$/.test(phone);
}

export async function submitVendorLead(
  _prev: VendorLeadState,
  formData: FormData
): Promise<VendorLeadState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const business_name = String(formData.get("business_name") ?? "").trim();
  const business_type = String(formData.get("business_type") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: Record<string, string> = {};
  if (full_name.length < 2) errors.full_name = "Please enter your full name.";
  if (!isValidPhone(phone)) errors.phone = "Enter a valid phone number.";
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Enter a valid email.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  const payload = {
    full_name,
    phone,
    email: email || null,
    city: city || null,
    state: state || null,
    business_name: business_name || null,
    business_type: business_type || null,
    message: message || null,
  };

  if (!isSupabaseConfigured) {
    return {
      ok: true,
      message: "Registration received! We will contact you soon. (Demo mode)",
    };
  }

  const sb = await createSupabaseServerClient();
  const { error } = await sb.from("vendor_leads").insert(payload);
  if (error) {
    console.error("Vendor lead insert error:", error.message);
    return { ok: false, message: `Error: ${error.message}` };
  }

  return { ok: true, message: "Registration received! Our team will contact you within 24-48 hours." };
}
