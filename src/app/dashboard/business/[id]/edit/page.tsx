import Link from "next/link";
import {
  IconArrowLeft,
  IconLink,
  IconSave,
  IconStore,
  IconX,
} from "@/components/icons";
import { getBusiness, updateBusiness } from "@/lib/db";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function EditBusinessPage(
  props: PageProps<"/dashboard/business/[id]/edit">,
) {
  const { id } = await props.params;
  const business = await getBusiness(id);

  if (!business) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>Business not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const placeOrUrl = business.google_place_id ?? business.google_review_url;

  async function onUpdate(formData: FormData) {
    "use server";
    await updateBusiness(id, formData);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/business/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft />
          Back to Business
        </Link>
        <Link
          href={`/dashboard/business/${id}`}
          className={cn(buttonVariants({ variant: "outline" }), "inline-flex items-center gap-1.5")}
        >
          <IconX />
          Cancel
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Business
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Update your business details.</p>
      </div>

      <Card className="max-w-xl p-6">
        <form action={onUpdate} className="space-y-5">
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
                defaultValue={business.name}
              />
            </InputGroup>
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
                defaultValue={placeOrUrl}
              />
            </InputGroup>
          </div>

          <Button type="submit" className="inline-flex items-center gap-2">
            <IconSave className="h-4 w-4" />
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
