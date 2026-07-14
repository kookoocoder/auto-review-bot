import { ConvexHttpClient } from "convex/browser";

export function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_CONVEX_URL. Set it in your environment (Vercel project settings for production).",
    );
  }
  return new ConvexHttpClient(url);
}
