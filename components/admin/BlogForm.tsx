"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { BlogPost } from "@/types";
import { Button, Card, Field, inputClass } from "@/components/admin/ui";
import { IconAlert } from "@/components/admin/icons";

type BlogState = { error?: string };
type BlogAction = (prev: BlogState, formData: FormData) => Promise<BlogState>;

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="brand" size="md" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
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
    <form action={formAction} className="space-y-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      <Card className="space-y-4 p-5">
        <Field label="Title" required>
          <input name="title" required defaultValue={post?.title} className={inputClass} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Author">
            <input name="author" defaultValue={post?.author ?? ""} className={inputClass} />
          </Field>
          <Field label="Cover image URL">
            <input
              name="cover_url"
              placeholder="https://…"
              defaultValue={post?.cover_url ?? ""}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Excerpt" hint="A one-line summary shown in listings and search results.">
          <input name="excerpt" defaultValue={post?.excerpt ?? ""} className={inputClass} />
        </Field>
      </Card>

      <Card className="space-y-4 p-5">
        <Field label="Body">
          <textarea
            name="body"
            rows={16}
            defaultValue={post?.body ?? ""}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </Field>

        <label className="flex items-start gap-2.5 rounded-lg border border-clay-200 bg-clay-50/60 px-3.5 py-3">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={published}
            className="mt-0.5 h-4 w-4 accent-saffron-600"
          />
          <span>
            <span className="block text-sm font-medium text-clay-900">Published</span>
            <span className="block text-xs text-clay-500">Visible on the public blog.</span>
          </span>
        </label>
      </Card>

      {state.error && (
        <p className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
          <IconAlert className="h-4 w-4" />
          {state.error}
        </p>
      )}

      <Submit label={submitLabel} />
    </form>
  );
}
