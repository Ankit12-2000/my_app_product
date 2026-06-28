"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function SingleImageUploader({
  name,
  label,
  shopId,
  initialUrl = "",
  aspect = "square",
  prefix,
  placeholder = "🏪",
}: {
  name: string;
  label: string;
  shopId?: string;
  initialUrl?: string;
  aspect?: "square" | "banner";
  prefix: string;
  placeholder?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
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
      const path = shopId
        ? `shops/${shopId}/${prefix}-${crypto.randomUUID()}.${ext}`
        : `shops/pending/${prefix}-${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) {
        setError(upErr.message);
        return;
      }
      const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
      setUrl(data.publicUrl);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const box = aspect === "banner" ? "aspect-[3/1] w-full max-w-md" : "h-24 w-24";

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type="hidden" name={name} value={url} />
      <div className="mt-2 flex items-center gap-4">
        <div className={cn("relative overflow-hidden rounded-lg border border-clay-100 bg-clay-100", box)}>
          {url ? (
            <Image src={url} alt="" fill sizes="400px" className="object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-2xl text-clay-700/50">
              {placeholder}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-full border border-clay-100 px-4 py-2 text-sm font-medium text-clay-700 hover:bg-clay-50 disabled:opacity-60"
          >
            {busy ? "Uploading…" : url ? "Change" : "Upload"}
          </button>
          {url && !busy && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onSelect} className="hidden" />
      <p className="mt-1 text-xs text-clay-700/70">Max 5 MB. JPG/PNG/WebP.</p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
