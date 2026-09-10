import "server-only";
import { randomInt } from "crypto";

// Characters that survive being read off a phone screen and typed back in —
// no 0/O, 1/l/I, 5/S, 8/B.
const UPPER = "ACDEFGHJKLMNPQRTUVWXYZ";
const LOWER = "acdefghjkmnpqrtuvwxyz";
const DIGITS = "234679";

function pick(pool: string, n: number): string {
  let out = "";
  for (let i = 0; i < n; i++) out += pool[randomInt(pool.length)];
  return out;
}

/**
 * A readable one-time password, e.g. "Kxq7-Rmp4-Tw92". Grouping in fours makes
 * it far easier to dictate over a phone call or paste into WhatsApp than a flat
 * random string, and it still carries ~60 bits of entropy.
 */
export function generateTempPassword(): string {
  const groups = [
    pick(UPPER, 1) + pick(LOWER, 2) + pick(DIGITS, 1),
    pick(UPPER, 1) + pick(LOWER, 2) + pick(DIGITS, 1),
    pick(LOWER, 2) + pick(DIGITS, 2),
  ];
  return groups.join("-");
}

// Deliberately strict: a lead typed by hand often carries a typo that only
// shows up as an undeliverable mailbox later. "name@gmail.com6" must fail here.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;

export function isValidEmail(value: string | null | undefined): boolean {
  const email = value?.trim() ?? "";
  return email.length > 0 && email.length <= 254 && EMAIL_RE.test(email);
}

/** Bare 10-digit Indian number, with any +91 / 0 prefix and spacing removed. */
export function normalisePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

/** Domain for generated logins. Not a real mailbox — used only as a login id. */
export const VENDOR_LOGIN_DOMAIN = "vendor.moortibazaar.com";

/**
 * The email a vendor will log in with. Prefers the address they gave us, since
 * that one can actually receive a password reset; falls back to a phone-derived
 * login id when the lead has no usable email.
 */
export function resolveLoginEmail(lead: {
  email: string | null;
  phone: string;
}): { email: string; generated: boolean } {
  if (isValidEmail(lead.email)) {
    return { email: lead.email!.trim().toLowerCase(), generated: false };
  }
  const digits = normalisePhone(lead.phone);
  return { email: `${digits}@${VENDOR_LOGIN_DOMAIN}`, generated: true };
}
