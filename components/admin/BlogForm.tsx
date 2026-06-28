"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { BlogPost } from "@/types";

type BlogState = { error?: string };
type BlogAction = (prev: BlogState, formData: FormData) => Promise<BlogState>;

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-saffron-600 px-6 py-2.5 font-semibold text-white hover:bg-saffron-700 disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function BlogForm({
  action,
  post,
  submitLabel,
}: {
  action: BlogAction;
  post?: BlogPost | null;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  // `is_published` lives in the DB but isn't on the public BlogPost type.
  const published = (post as { is_published?: boolean } | null | undefined)?.is_published ?? true;

  return (
    <form action={formAction} className="space-y-4">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label className="text-sm font-medium">Title *</label>
        <input name="title" required defaultValue={post?.title}
          className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 outline-none focus:border-saffron-400" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Author</label>
          <input name="author" defaultValue={post?.author ?? ""}
            className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 outline-none focus:border-saffron-400" />
        </div>
        <div>
          <label className="text-sm font-medium">Cover image URL</label>
          <input name="cover_url" defaultValue={post?.cover_url ?? ""}
            className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 outline-none focus:border-saffron-400" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Excerpt</label>
        <input name="excerpt" defaultValue={post?.excerpt ?? ""}
          className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 outline-none focus:border-saffron-400" />
      </div>
      <div>
        <label className="text-sm font-medium">Body</label>
        <textarea name="body" rows={10} defaultValue={post?.body ?? ""}
          className="mt-1 w-full rounded-lg border border-clay-100 px-3 py-2 outline-none focus:border-saffron-400" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_published" defaultChecked={published} />
        Published (visible on the public blog)
      </label>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <Submit label={submitLabel} />
    </form>
  );
}
