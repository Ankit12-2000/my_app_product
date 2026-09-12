"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ContactState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email.";
  if (message.length < 10) errors.message = "Message should be at least 10 characters.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  const payload = {
    name,
    email,
    subject: subject || null,
    message,
    status: "new",
  };

  if (!isSupabaseConfigured) {
    return {
      ok: true,
      message: "Message sent! (Demo mode — connect Supabase to store messages.)",
    };
  }

  const sb = await createSupabaseServerClient();
  const { error } = await sb.from("contact_messages").insert(payload);
  if (error) {
    console.error("Contact insert error:", error.message);
    return { ok: false, message: `Error: ${error.message}` };
  }

  return { ok: true, message: "Message sent! We'll get back to you within 24 hours." };
}