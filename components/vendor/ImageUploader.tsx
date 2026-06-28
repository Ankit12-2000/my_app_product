"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "product-images";
const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function ImageUploader({
  name = "images",
  shopId,
  initialUrls = [],
}: {
  name?: string;
  shopId: string;
  initialUrls?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (urls.length + files.length > MAX_FILES) {
      setError(`You can upload a maximum of ${MAX_FILES} images per product.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    for (const f of files) {
      if (!f.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }
      if (f.size > MAX_BYTES) {
        setError(`"${f.name}" is larger than 5 MB.`);
        return;
      }
    }

    setBusy(true);
    const sb = createSupabaseBrowserClient();
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${shopId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (upErr) {
          setError(upErr.message);
          break;
        }
        const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      if (uploaded.length) setUrls((prev) => [...prev, ...uploaded]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    setUrls((prev) => prev.filter((u) => u !== url));
  }

  return (
    <div>
      <label className="text-sm font-medium">Product images</label>
      <input type="hidden" name={name} value={urls.join("\n")} />

      <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {urls.map((url) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-clay-100 bg-clay-100">
            <Image src={url} alt="" fill sizes="120px" className="object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-clay-900/70 text-xs text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}

        {urls.length < MAX_FILES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-clay-200 text-clay-700 transition hover:border-saffron-400 hover:text-saffron-700 disabled:opacity-60"
          >
            <span className="text-2xl">{busy ? "…" : "＋"}</span>
            <span className="text-xs">{busy ? "Uploading" : "Add"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onSelect}
        className="hidden"
      />

      <p className="mt-1 text-xs text-clay-700/70">
        Up to {MAX_FILES} images, max 5 MB each. JPG/PNG/WebP.
      </p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
