const AVATAR_COLORS = [
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-sky-100", text: "text-sky-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-violet-100", text: "text-violet-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
];

export function avatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash] ?? AVATAR_COLORS[0];
}

export function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
