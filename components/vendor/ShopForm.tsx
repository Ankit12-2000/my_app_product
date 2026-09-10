"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Shop } from "@/types";
import { SingleImageUploader } from "./SingleImageUploader";

type ShopState = { error?: string; ok?: boolean };
type ShopAction = (prev: ShopState, formData: FormData) => Promise<ShopState>;

const TAGLINE_MAX = 80;
const DESCRIPTION_MAX = 600;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-saffron-600 px-6 py-3 text-base font-bold text-white shadow-md transition hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-2.5 sm:text-sm"
    >
      {pending && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
      )}
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ShopForm({
  action,
  shop,
  submitLabel,
  showImages = false,
}: {
  action: ShopAction;
  shop?: Shop | null;
  submitLabel: string;
  showImages?: boolean;
}) {
  const [state, formAction] = useActionState(action, {});
  const [name, setName] = useState(shop?.name ?? "");
  const [tagline, setTagline] = useState(shop?.tagline ?? "");
  const [description, setDescription] = useState(shop?.description ?? "");
  const [phone, setPhone] = useState(shop?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(shop?.whatsapp ?? "");
  const [sameAsPhone, setSameAsPhone] = useState(
    Boolean(shop?.phone) && shop?.phone === shop?.whatsapp
  );
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Bring the result of a submit into view — on mobile the button sits far
  // below the message otherwise.
  useEffect(() => {
    if (state.error || state.ok) {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state]);

  const slug = slugify(name);

  return (
    <form action={formAction} className="space-y-8">
      {/* Basic info */}
      <section className="space-y-4">
        <SectionHeading
          title="Shop details"
          hint="This is what buyers see first on your shop page."
        />
        <Field
          name="name"
          label="Shop name"
          value={name}
          onValueChange={setName}
          required
          autoComplete="organization"
          placeholder="e.g. Shri Ganesh Moorti Bhandar"
          hint={
            slug
              ? undefined
              : "Use the name buyers know you by."
          }
        >
          {slug && (
            <p className="mt-1.5 truncate text-xs text-clay-500">
              Shop link: <span className="font-medium text-clay-700">/shop/{slug}</span>
            </p>
          )}
        </Field>

        <Field
          name="tagline"
          label="Tagline"
          value={tagline}
          onValueChange={(v) => setTagline(v.slice(0, TAGLINE_MAX))}
          maxLength={TAGLINE_MAX}
          placeholder="Handcrafted marble moortis since 1985"
          optional
          counter={`${tagline.length}/${TAGLINE_MAX}`}
        />

        <div>
          <LabelRow
            htmlFor="shop-description"
            label="Description"
            optional
            counter={`${description.length}/${DESCRIPTION_MAX}`}
          />
          <textarea
            id="shop-description"
            name="description"
            rows={4}
            maxLength={DESCRIPTION_MAX}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell buyers about your craft, materials, and what makes your work special."
            className={inputClass + " resize-y"}
          />
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-4 border-t border-clay-100 pt-6">
        <SectionHeading
          title="Contact & location"
          hint="Buyers use these to reach you about enquiries."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="city"
            label="City"
            defaultValue={shop?.city ?? ""}
            autoComplete="address-level2"
            placeholder="Jaipur"
            optional
          />
          <Field
            name="state"
            label="State"
            defaultValue={shop?.state ?? ""}
            autoComplete="address-level1"
            placeholder="Rajasthan"
            optional
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="phone"
            label="Phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            optional
            value={phone}
            onValueChange={(v) => {
              setPhone(v);
              if (sameAsPhone) setWhatsapp(v);
            }}
          />
          <Field
            name="whatsapp"
            label="WhatsApp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            optional
            readOnly={sameAsPhone}
            value={whatsapp}
            onValueChange={setWhatsapp}
          >
            <label className="mt-2 flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-clay-600">
              <input
                type="checkbox"
                checked={sameAsPhone}
                onChange={(e) => {
                  setSameAsPhone(e.target.checked);
                  if (e.target.checked) setWhatsapp(phone);
                }}
                className="h-4 w-4 rounded border-clay-300 text-saffron-600 accent-saffron-600"
              />
              Same as phone
            </label>
          </Field>
        </div>

        <Field
          name="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="shop@example.com"
          defaultValue={shop?.email ?? ""}
          optional
        />
      </section>

      {/* Images */}
      {showImages && (
        <section className="space-y-5 border-t border-clay-100 pt-6">
          <SectionHeading
            title="Branding"
            hint="Optional, but shops with a logo and banner get far more enquiries."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <SingleImageUploader
              name="logo_url"
              label="Shop logo"
              hint="Square image works best."
              shopId={shop?.id}
              initialUrl={shop?.logo_url ?? ""}
              aspect="square"
              prefix="logo"
              placeholder="🏪"
            />
            <SingleImageUploader
              name="banner_url"
              label="Shop banner"
              hint="Wide image, 1200×400 or larger."
              shopId={shop?.id}
              initialUrl={shop?.banner_url ?? ""}
              aspect="banner"
              prefix="banner"
              placeholder="🖼️"
            />
          </div>
        </section>
      )}

      {/* Feedback */}
      <div ref={feedbackRef} aria-live="polite">
        {state.error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
          >
            <span aria-hidden>⚠️</span>
            <span>{state.error}</span>
          </div>
        )}
        {state.ok && (
          <div className="flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
            <span aria-hidden>✅</span>
            <span>Saved successfully.</span>
          </div>
        )}
      </div>

      {/* Actions — stays reachable while scrolling on small screens */}
      <div className="sticky bottom-0 -mx-5 border-t border-clay-100 bg-white/90 px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-2 sm:backdrop-blur-none">
        <Submit label={submitLabel} />
        <p className="mt-2 text-center text-xs text-clay-500 sm:text-left">
          Fields marked <span className="font-semibold text-red-500">*</span> are required. You can
          edit everything later.
        </p>
      </div>
    </form>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-clay-200 bg-white px-4 py-3 text-base outline-none transition placeholder:text-clay-400 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 read-only:bg-clay-50 read-only:text-clay-600 sm:py-2.5 sm:text-sm";

function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-clay-800">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-clay-500">{hint}</p>}
    </div>
  );
}

function LabelRow({
  htmlFor,
  label,
  required,
  optional,
  counter,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  counter?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="text-sm font-bold text-clay-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden>
            *
          </span>
        )}
        {optional && <span className="ml-1.5 text-xs font-medium text-clay-400">Optional</span>}
      </label>
      {counter && <span className="shrink-0 text-xs tabular-nums text-clay-400">{counter}</span>}
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  value,
  onValueChange,
  required,
  optional,
  placeholder,
  hint,
  counter,
  autoComplete,
  inputMode,
  maxLength,
  readOnly,
  children,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  hint?: string;
  counter?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  readOnly?: boolean;
  children?: React.ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div>
      <LabelRow
        htmlFor={id}
        label={label}
        required={required}
        optional={optional}
        counter={counter}
      />
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-describedby={hintId}
        {...(onValueChange
          ? { value: value ?? "", onChange: (e) => onValueChange(e.target.value) }
          : { defaultValue })}
        className={inputClass}
      />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-clay-500">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}
