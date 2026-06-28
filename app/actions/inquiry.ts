"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface InquiryState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

function isValidPhone(phone: string) {
  return /^[+]?[\d\s-]{8,15}$/.test(phone);
}

// Server Action invoked by the public inquiry form.
// Validates input, then persists to Supabase when configured (otherwise
// simulates success so the flow is demoable before keys are added).
export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 1);
  const requirement = String(formData.get("requirement") ?? "").trim();
  const shop_id = String(formData.get("shop_id") ?? "");
  const product_id = String(formData.get("product_id") ?? "") || null;

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!isValidPhone(phone)) errors.phone = "Enter a valid phone number.";
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Enter a valid email.";
  if (requirement.length < 5) errors.requirement = "Tell the vendor a bit more about your requirement.";
  if (!shop_id) errors.form = "Missing vendor reference.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  const payload = {
    shop_id,
    product_id,
    name,
    phone,
    email: email || null,
    city: city || null,
    quantity: Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1,
    requirement,
  };

  if (!isSupabaseConfigured) {
    // Demo mode — no database yet. Pretend it worked.
    return {
      ok: true,
      message: "Inquiry received! (Demo mode — connect Supabase to store inquiries.)",
    };
  }

  const sb = await createSupabaseServerClient();
  const { error } = await sb.from("inquiries").insert(payload);
  if (error) {
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true, message: "Inquiry sent! The vendor will contact you soon." };
}
