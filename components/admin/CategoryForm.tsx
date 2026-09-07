"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCategory, type CategoryState } from "@/app/actions/admin";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, Field, inputClass } from "@/components/admin/ui";
import { IconImage, IconPlus } from "@/components/admin/icons";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="brand" size="md" disabled={pending} className="w-full justify-center">
      <IconPlus className="h-4 w-4" />
      {pending ? "Adding…" : "Add category"}
    </Button>
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
    <form action={formAction} className="space-y-4">
      <p className="text-xs font-semibold text-clay-600">Add a category</p>

      <Field label="Name" required>
        <input name="name" placeholder="e.g. Ganesha Moortis" required className={inputClass} />
      </Field>
      <Field label="Description">
        <input name="description" placeholder="Shown on the category page" className={inputClass} />
      </Field>

      <input type="hidden" name="image_url" value={imageUrl} />

      <Field label="Cover image" hint="Max 5 MB. JPG, PNG or WebP.">
        <div className="flex items-center gap-3">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-clay-200 bg-clay-100">
            {imageUrl ? (
              <Image src={imageUrl} alt="" fill sizes="64px" className="object-cover" />
            ) : (
              <IconImage className="h-5 w-5 text-clay-400" />
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              variant="secondary"
            >
              {busy ? "Uploading…" : imageUrl ? "Change image" : "Upload image"}
            </Button>
            {imageUrl && !busy && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="px-1 text-xs font-medium text-rose-600 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </Field>

      <input ref={inputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

      <SubmitButton />
    </form>
  );
}
