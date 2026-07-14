import Link from "next/link";
import { redirect } from "next/navigation";
import {
  IconArrowLeft,
  IconCheck,
  IconCoffee,
  IconInfo,
  IconSave,
  IconX,
} from "@/components/icons";
import { createService, getBusiness } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function NewServicePage(
  props: PageProps<"/dashboard/business/[id]/service/new">,
) {
  const { id } = await props.params;
  const business = await getBusiness(id);

  async function onCreateService(formData: FormData) {
    "use server";
    await createService(id, formData);
    redirect(`/dashboard/business/${id}`);
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
          Add New Service
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new service under{" "}
          <span className="font-semibold text-primary">
            {business?.name ?? "this business"}
          </span>
          .
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <form action={onCreateService} className="space-y-5">
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
                  placeholder="Enter service name"
                />
              </InputGroup>
              <span className="mt-1 block text-xs text-muted-foreground">
                Example: Cafe, Bakery, Catering, Haircut, etc.
              </span>
            </div>

            <Card className="border-primary/20 bg-primary/5 p-4 shadow-none">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <IconInfo className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  A unique QR link is generated automatically when you save. The
                  link is permanent and cannot be changed later.
                </p>
              </div>
            </Card>

            <Button type="submit" className="inline-flex items-center gap-2">
              <IconSave className="h-4 w-4" />
              Save Service
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold text-foreground">Preview</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              This is how your service will appear.
            </p>
            <div className="mt-4 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconCoffee className="h-6 w-6" />
              </div>
              <p className="mt-3 font-bold text-foreground">Your Service Name</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {business?.name ?? "Business"}
              </p>
              <div className="mt-4 w-full rounded-xl border border-dashed border-muted bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground">
                QR Link: /r/auto-generated
              </div>
            </div>
          </Card>

          <Card className="border-primary/20 bg-primary/5 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <IconInfo className="h-4 w-4 text-primary" />
              What happens next?
            </div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                "You can upload review text lines for this service",
                "A unique QR code will be generated",
                "Customers can scan and leave reviews on Google",
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
