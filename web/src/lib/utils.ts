export function buildGoogleReviewUrl(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://search.google.com/local/writereview?placeid=${trimmed}`;
}
