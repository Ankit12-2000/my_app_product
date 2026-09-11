"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitReview, type ReviewState } from "@/app/actions/review";
import { IconSpinner } from "@/components/admin/icons";
import { StarIcon } from "@/components/StarRating";
import { cn } from "@/lib/utils";

const initial: ReviewState = { ok: false, message: "" };

const RATING_LABELS = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-saffron-600 px-6 py-3 font-semibold text-white transition hover:bg-saffron-700 disabled:opacity-60"
    >
      {pending && <IconSpinner className="h-4 w-4 animate-spin" />}
      {pending ? "Submitting…" : "Submit Review"}
    </button>
  );
}

export function ReviewForm({ shopId }: { shopId: string }) {
  const [state, action] = useActionState(submitReview, initial);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">
          ⭐
        </div>
        <h3 className="mt-4 text-xl font-bold text-green-800">Thank you!</h3>
        <p className="mt-2 text-sm text-green-700">{state.message}</p>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="shop_id" value={shopId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <span className="mb-2 block text-left text-xs font-semibold text-clay-600">
          Your Rating *
        </span>
        <div className="flex flex-col items-center gap-2 rounded-xl bg-clay-50 px-4 py-4">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i} star${i > 1 ? "s" : ""}`}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                className="group outline-none"
              >
                <StarIcon
                  filled={(hover || rating) >= i}
                  className={cn(
                    "h-8 w-8 transition",
                    (hover || rating) >= i
                      ? "text-saffron-500 group-hover:scale-110"
                      : "fill-clay-200 group-hover:fill-clay-300"
                  )}
                />
              </button>
            ))}
          </div>
          <span
            aria-live="polite"
            className={cn(
              "text-xs font-medium",
              rating > 0 ? "text-saffron-700" : "text-clay-400"
            )}
          >
            {hover || rating > 0
              ? RATING_LABELS[(hover || rating) - 1]
              : "Tap a star to rate"}
          </span>
        </div>
        {err.rating && <p className="mt-1 text-left text-xs text-red-600">{err.rating}</p>}
      </div>

      <div>
        <label className="block text-left text-xs font-semibold text-clay-600">
          Your Name *
        </label>
        <input
          name="author_name"
          placeholder="e.g. Rahul Sharma"
          className="mt-1.5 w-full rounded-lg border border-clay-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/25"
        />
        {err.author_name && (
          <p className="mt-1 text-left text-xs text-red-600">{err.author_name}</p>
        )}
      </div>

      <div>
        <label className="block text-left text-xs font-semibold text-clay-600">
          Your Review
        </label>
        <textarea
          name="comment"
          rows={4}
          placeholder="Share your experience with this vendor…"
          className="mt-1.5 w-full rounded-lg border border-clay-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/25"
        />
      </div>

      {state.message && !state.ok && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-left text-sm text-red-600">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}