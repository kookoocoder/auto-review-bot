"use client";

type Props = {
  reviewText: string;
  googleReviewUrl: string;
};

export function CopyButton({ reviewText, googleReviewUrl }: Props) {
  async function onClick() {
    try {
      await navigator.clipboard.writeText(reviewText);
    } catch {
      // Manual fallback is the readonly textarea shown on screen.
    }
    window.location.href = googleReviewUrl;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary-hover"
    >
      Copy & Open Google Reviews
    </button>
  );
}
