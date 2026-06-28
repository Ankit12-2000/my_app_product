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
const GRADIENTS = [
  "from-saffron-400 to-saffron-700",
  "from-amber-400 to-orange-600",
  "from-orange-400 to-rose-600",
  "from-rose-400 to-saffron-600",
  "from-amber-500 to-saffron-700",
  "from-saffron-500 to-clay-700",
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
