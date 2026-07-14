"use client";

import { Button } from "@/components/ui/button";

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
    <Button
      type="button"
      onClick={onClick}
      className="w-full"
      size="lg"
    >
      Copy & Open Google Reviews
    </Button>
  );
}

