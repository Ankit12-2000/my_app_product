// Helpers for image rendering.
//
// The demo catalog uses random placeholder URLs (picsum.photos) which return
// unrelated stock photos. We treat those — and empty values — as "not a real
// image" so the UI can render a clean branded gradient tile instead. Once a
// vendor uploads a real image (e.g. to Supabase Storage), it displays normally.

export function isRealImage(url?: string | null): boolean {
  if (!url) return false;
  if (url.includes("picsum.photos")) return false;
  if (url.includes("placeholder")) return false;
  return true;
}

// Full Tailwind class strings are listed literally so they survive purging.
// Soft, low-saturation tiles: a placeholder should read as "photo pending",
// never compete with the real product photography around it.
const GRADIENTS = [
  "from-saffron-50 via-clay-50 to-clay-100",
  "from-clay-50 via-saffron-50 to-saffron-100",
  "from-amber-50 via-clay-50 to-clay-200",
  "from-clay-100 via-clay-50 to-saffron-50",
  "from-rose-50 via-clay-50 to-clay-100",
  "from-clay-50 via-clay-100 to-clay-200",
];

export function tileGradient(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

const DEITY_ICON: Record<string, string> = {
  ganesha: "🐘",
  buddha: "☸️",
  lakshmi: "🪷",
  "radha krishna": "🦚",
  krishna: "🦚",
  durga: "🔱",
  shiva: "🔱",
  nandi: "🐂",
};

export function deityIcon(deity?: string | null): string {
  if (!deity) return "🕉️";
  return DEITY_ICON[deity.toLowerCase()] ?? "🕉️";
}
