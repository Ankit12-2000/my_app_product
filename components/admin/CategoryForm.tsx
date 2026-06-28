"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCategory, type CategoryState } from "@/app/actions/admin";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700 disabled:opacity-60">
      {pending ? "Adding…" : "Add category"}
    </button>
  );
}

export function CategoryForm() {
  const [state, formAction] = useActionState(createCategory, {});
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is larger than 5 MB.");
      return;
    }

    setBusy(true);
    const sb = createSupabaseBrowserClient();
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `categories/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) {
        setError(upErr.message);
        return;
      }
      const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <form action={formAction} className="mt-4 space-y-2 border-t border-clay-100 pt-4">
      <input name="name" placeholder="Category name *" required
        className="w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
      <input name="description" placeholder="Description"
        className="w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />

      <input type="hidden" name="image_url" value={imageUrl} />

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-clay-100 bg-clay-100">
          {imageUrl ? (
            <Image src={imageUrl} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-xl text-clay-700/50">🖼️</div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
            className="rounded-full border border-clay-100 px-3 py-1.5 text-xs font-medium text-clay-700 hover:bg-clay-50 disabled:opacity-60">
            {busy ? "Uploading…" : imageUrl ? "Change image" : "Upload image"}
          </button>
          {imageUrl && !busy && (
            <button type="button" onClick={() => setImageUrl("")} className="text-xs font-medium text-red-600 hover:underline">
              Remove
            </button>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
      <p className="text-xs text-clay-700/70">Max 5 MB. JPG/PNG/WebP.</p>
      {error && <p className="text-xs text-red-600">{error}</p>}

      <SubmitButton />
    </form>
  );
}
