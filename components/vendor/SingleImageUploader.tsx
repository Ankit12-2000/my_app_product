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
  hint,
  shopId,
  initialUrl = "",
  aspect = "square",
  prefix,
  placeholder = "🏪",
}: {
  name: string;
  label: string;
  hint?: string;
  shopId?: string;
  initialUrl?: string;
  aspect?: "square" | "banner";
  prefix: string;
  placeholder?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is larger than 5 MB. Try a smaller file.");
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

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void upload(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  const box = aspect === "banner" ? "aspect-[3/1] w-full" : "aspect-square w-full max-w-[160px]";

  return (
    <div>
      <p className="text-sm font-bold text-clay-700">
        {label}
        <span className="ml-1.5 text-xs font-medium text-clay-400">Optional</span>
      </p>
      <input type="hidden" name={name} value={url} />

      {/* Drop zone / preview — tapping it opens the picker */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        disabled={busy}
        aria-label={url ? `Change ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
        className={cn(
          "group relative mt-2 block overflow-hidden rounded-xl border-2 border-dashed border-clay-200 bg-clay-50 transition",
          "hover:border-saffron-300 hover:bg-saffron-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-300",
          dragOver && "border-saffron-400 bg-saffron-50",
          url && "border-solid border-clay-200 bg-clay-100",
          busy && "cursor-wait opacity-70",
          box
        )}
      >
        {url ? (
          <Image src={url} alt="" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center">
            <span className="text-2xl" aria-hidden>
              {placeholder}
            </span>
            <span className="text-xs font-semibold text-clay-600">Tap to upload</span>
            <span className="hidden text-[11px] text-clay-400 sm:block">or drop an image here</span>
          </span>
        )}

        {busy && (
          <span className="absolute inset-0 grid place-items-center bg-white/70 text-xs font-semibold text-clay-700">
            Uploading…
          </span>
        )}
      </button>

      {/* Actions */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-full border border-clay-200 px-4 py-2 text-sm font-medium text-clay-700 transition hover:border-saffron-200 hover:bg-saffron-50 hover:text-saffron-700 disabled:opacity-60"
        >
          {busy ? "Uploading…" : url ? "Change image" : "Upload image"}
        </button>
        {url && !busy && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="rounded-full px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Remove
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={onSelect} className="hidden" />
      <p className="mt-1.5 text-xs text-clay-500">{hint ? `${hint} ` : ""}Max 5 MB — JPG, PNG or WebP.</p>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
