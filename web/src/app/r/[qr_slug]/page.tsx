import { notFound } from "next/navigation";
import { getServiceBySlug, pickNextReviewText } from "@/lib/db";
import { CopyButton } from "./copy-button";

export default async function PublicReviewPage(props: PageProps<"/r/[qr_slug]">) {
  const { qr_slug } = await props.params;
  const service = await getServiceBySlug(qr_slug);

  if (!service) notFound();

  const reviewText = await pickNextReviewText(service._id);
  const textToShow =
    reviewText?.text ??
    "Thanks for choosing us! Please share your experience in your own words.";

  const business = service.businesses;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center space-y-5 px-5 py-10">
      <h1 className="text-2xl font-semibold">{business.name}</h1>
      <p className="text-sm text-zinc-600">
        Tap the button to copy your review text, then paste it on Google.
      </p>
      <textarea
        readOnly
        value={textToShow}
        className="min-h-36 w-full rounded-md border border-zinc-300 p-3 text-sm"
      />
      <CopyButton reviewText={textToShow} googleReviewUrl={business.google_review_url} />
    </main>
  );
}
