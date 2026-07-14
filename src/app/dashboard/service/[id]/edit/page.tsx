import Link from "next/link";
import {
  IconArrowLeft,
  IconCoffee,
  IconSave,
  IconX,
} from "@/components/icons";
import { getService, updateService } from "@/lib/db";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function EditServicePage(
  props: PageProps<"/dashboard/service/[id]/edit">,
) {
  const { id } = await props.params;
  const service = await getService(id);

  if (!service) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>Service not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  async function onUpdate(formData: FormData) {
    "use server";
    await updateService(id, formData);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/service/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft />
          Back to Service
        </Link>
        <Link
          href={`/dashboard/service/${id}`}
          className={cn(buttonVariants({ variant: "outline" }), "inline-flex items-center gap-1.5")}
        >
          <IconX />
          Cancel
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Service
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          QR slug{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            /r/{service.qr_slug}
          </code>{" "}
          cannot be changed once created.
        </p>
      </div>

      <Card className="max-w-xl p-6">
        <form action={onUpdate} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="service-name" className="text-sm font-semibold text-foreground">
              Service Name <span className="text-destructive">*</span>
            </Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <IconCoffee className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                id="service-name"
                name="name"
                required
                maxLength={100}
                defaultValue={service.name}
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
