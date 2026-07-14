import Link from "next/link";
import { redirect } from "next/navigation";
import {
  IconArrowLeft,
  IconCheck,
  IconInfo,
  IconLink,
  IconSave,
  IconStore,
  IconX,
} from "@/components/icons";
import { createBusiness } from "@/lib/db";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function NewBusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  async function onCreateBusiness(formData: FormData) {
    "use server";
    try {
      await createBusiness(formData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save business.";
      redirect(
        `/dashboard/business/new?error=${encodeURIComponent(message)}`,
      );
    }
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft />
          Back to Businesses
        </Link>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "outline" }), "inline-flex items-center gap-1.5")}
        >
          <IconX />
          Cancel
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Business
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your business details to get started.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <form action={onCreateBusiness} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="business-name" className="text-sm font-semibold text-foreground">
                Business Name <span className="text-destructive">*</span>
              </Label>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <IconStore className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  id="business-name"
                  name="name"
                  required
                  maxLength={100}
                  placeholder="Enter business name"
                />
              </InputGroup>
              <span className="mt-1 block text-xs text-muted-foreground">
                Use your official business name as it appears on Google.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="google-place" className="text-sm font-semibold text-foreground">
                Google Place ID or Review URL <span className="text-destructive">*</span>
              </Label>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <IconLink className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  id="google-place"
                  name="google_place_or_url"
                  required
                  placeholder="Enter Google Place ID or full review URL"
                />
              </InputGroup>
              <a
                href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
              >
                How to find your Google Place ID?
              </a>
            </div>

            <Button type="submit" className="inline-flex items-center gap-2">
              <IconSave className="h-4 w-4" />
              Save Business
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold text-foreground">Preview</p>
            <div className="mt-4 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconStore className="h-6 w-6" />
              </div>
              <p className="mt-3 font-bold text-foreground">Your Business Name</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">Google Reviews</p>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                This is how your business will appear to customers when they scan
                your QR code.
              </p>
            </div>
          </Card>

          <Card className="border-primary/20 bg-primary/5 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <IconInfo className="h-4 w-4 text-primary" />
              What happens next?
            </div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                "You can add services after creating your business",
                "Each service will have its own QR code",
                "You can edit details anytime",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white dark:text-black">
                    <IconCheck className="h-2.5 w-2.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
