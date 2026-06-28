"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitReview, type ReviewState } from "@/app/actions/review";

const initial: ReviewState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-saffron-600 px-6 py-3 font-semibold text-white transition hover:bg-saffron-700 disabled:opacity-60"
    >
      {pending ? "Submitting…" : "Submit Review"}
    </button>
  );
}

export function ReviewForm({ shopId }: { shopId: string }) {
  const [state, action] = useActionState(submitReview, initial);
  const [rating, setRating] = useState(0);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="text-3xl">⭐</div>
        <h3 className="mt-2 text-lg font-semibold text-green-800">Review submitted!</h3>
        <p className="mt-1 text-sm text-green-700">{state.message}</p>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="shop_id" value={shopId} />

      <div>
        <label className="text-sm font-medium">Your Name *</label>
        <input
          name="author_name"
          className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
        />
        {err.author_name && <p className="mt-1 text-xs text-red-600">{err.author_name}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Rating *</label>
        <input type="hidden" name="rating" value={rating} />
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              className={`text-2xl transition ${i <= rating ? "text-saffron-500" : "text-clay-200 hover:text-saffron-400"}`}
            >
              ★
            </button>
          ))}
        </div>
        {err.rating && <p className="mt-1 text-xs text-red-600">{err.rating}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Comment</label>
        <textarea
          name="comment"
          rows={3}
          placeholder="Share your experience with this vendor…"
          className="mt-1 w-full rounded-lg border border-clay-100 bg-white px-3 py-2 outline-none focus:border-saffron-400"
        />
      </div>

      {state.message && !state.ok && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}
