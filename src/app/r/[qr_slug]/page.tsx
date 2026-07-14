import { notFound } from "next/navigation";
import { Logo } from "@/components/logo";
import { IconStar } from "@/components/icons";
import { getServiceBySlug, pickNextReviewText } from "@/lib/db";
import { CopyButton } from "./copy-button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
    <main className="relative flex min-h-screen flex-col bg-muted/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(45,70,185,0.1),_transparent_55%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 py-10">
        <div className="mb-8 flex justify-center">
          <Logo href={null} />
        </div>

        <Card className="p-6 shadow-lg sm:p-8">
          <div className="mb-1 flex justify-center gap-1 text-gold">
            {[1, 2, 3, 4, 5].map((n) => (
              <IconStar key={n} className="h-5 w-5" />
            ))}
          </div>
          <h1 className="mt-3 text-center text-2xl font-bold tracking-tight text-foreground">
            {business.name}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Tap the button to copy your review text, then paste it on Google.
          </p>

          <label className="mt-6 block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your review text
            </span>
            <Textarea
              readOnly
              value={textToShow}
              className="min-h-36 resize-none"
            />
          </label>

          <div className="mt-5">
            <CopyButton
              reviewText={textToShow}
              googleReviewUrl={business.google_review_url}
            />
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Powered by QR Review Platform
        </p>
      </div>
    </main>
  );
}

