"use client";

import { useState } from "react";
import { IconCheck, IconCopy, IconKey, IconMail } from "@/components/admin/icons";
import { cn } from "@/lib/utils";

function CopyField({
  label,
  value,
  Icon,
  mono,
}: {
  label: string;
  value: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return; // Clipboard blocked (insecure origin) — leave the value selectable.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="min-w-0 flex-1">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-clay-400">
        {label}
      </p>
      <div className="flex items-center gap-1.5 rounded-lg border border-clay-200 bg-white px-2.5 py-1.5">
        <Icon className="h-3.5 w-3.5 shrink-0 text-clay-400" />
        <span
          className={cn(
            "min-w-0 flex-1 select-all truncate text-sm text-clay-900",
            mono && "font-mono font-semibold tracking-wide"
          )}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={copy}
          title={`Copy ${label.toLowerCase()}`}
          className="shrink-0 rounded p-1 text-clay-400 transition hover:bg-clay-100 hover:text-clay-700"
        >
          {copied ? (
            <IconCheck className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <IconCopy className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">Copy {label}</span>
        </button>
      </div>
    </div>
  );
}

/**
 * The login handed to a vendor when their lead was approved. The password only
 * exists here until the vendor signs in for the first time, after which the
 * admin can issue a new one from the Reset password button.
 */
export function VendorCredentials({
  email,
  password,
  createdAt,
  resetSlot,
}: {
  email: string;
  password: string | null;
  createdAt: string | null;
  resetSlot?: React.ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);

  const whatsappText = password
    ? `Namaste! MoortiBazaar par aapka vendor account ban gaya hai.\n\nLogin: ${email}\nPassword: ${password}\n\nLogin karke apni shop set up karein.`
    : null;

  return (
    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
          <IconKey className="h-3.5 w-3.5" />
          Vendor login created
          {createdAt && (
            <span className="font-normal text-emerald-700/70">
              · {new Date(createdAt).toLocaleDateString("en-IN")}
            </span>
          )}
        </p>
        <div className="flex items-center gap-1.5">
          {whatsappText && (
            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Send on WhatsApp
            </a>
          )}
          {resetSlot}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <CopyField label="Login email" value={email} Icon={IconMail} />

        {password ? (
          <div className="min-w-0 flex-1">
            {revealed ? (
              <CopyField label="Password" value={password} Icon={IconKey} mono />
            ) : (
              <>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-clay-400">
                  Password
                </p>
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="w-full rounded-lg border border-dashed border-clay-300 bg-white px-2.5 py-1.5 text-sm font-medium text-clay-500 transition hover:border-clay-400 hover:text-clay-800"
                >
                  Click to reveal
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-clay-400">
              Password
            </p>
            <p className="rounded-lg border border-clay-200 bg-white px-2.5 py-1.5 text-sm text-clay-500">
              Vendor has logged in — password hidden
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
