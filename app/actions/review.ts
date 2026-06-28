"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ReviewState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function submitReview(
  _prev: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const author_name = String(formData.get("author_name") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim();
  const shop_id = String(formData.get("shop_id") ?? "");

  const errors: Record<string, string> = {};
  if (author_name.length < 2) errors.author_name = "Please enter your name.";
  if (rating < 1 || rating > 5) errors.rating = "Please select a rating.";
  if (!shop_id) errors.form = "Missing vendor reference.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  const payload = {
    shop_id,
    author_name,
    rating,
    comment: comment || null,
    is_approved: true,
  };

  if (!isSupabaseConfigured) {
    return {
      ok: true,
      message: "Review submitted! (Demo mode — connect Supabase to store reviews.)",
    };
  }

  const sb = await createSupabaseServerClient();
  const { error } = await sb.from("reviews").insert(payload);
  if (error) {
    console.error("Review insert error:", error.message);
    return { ok: false, message: `Error: ${error.message}` };
  }

  return { ok: true, message: "Review submitted! Thank you for your feedback." };
}
