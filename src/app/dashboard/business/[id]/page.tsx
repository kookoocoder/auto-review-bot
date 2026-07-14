import Link from "next/link";
import { DeleteButton } from "@/components/delete-button";
import { EditLink } from "@/components/edit-link";
import {
  IconArrowLeft,
  IconChevronRight,
  IconExternal,
  IconInfo,
  IconPlus,
  IconQr,
  IconStore,
} from "@/components/icons";
import {
  deleteBusiness,
  deleteService,
  getBusiness,
  listServicesForBusiness,
} from "@/lib/db";
import { avatarColor, formatDate } from "@/lib/ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/session";

export default async function BusinessDetailPage(
  props: PageProps<"/dashboard/business/[id]">,
) {
  const session = await getSession();
  const isAdmin = session?.role === "admin";

  const { id } = await props.params;
  const business = await getBusiness(id);
  const services = await listServicesForBusiness(id);

  if (!business) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>Business not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const colors = avatarColor(business._id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft />
          Back to Businesses
        </Link>
        {isAdmin && (
          <div className="flex gap-2">
            <EditLink
              href={`/dashboard/business/${id}/edit`}
              label="Edit Business"
            />
            <form action={deleteBusiness.bind(null, id)}>
              <DeleteButton label="Delete Business" />
            </form>
          </div>
        )}
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.text}`}
          >
            <IconStore className="h-9 w-9" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {business.name}
            </h1>
            <a
              href={business.google_review_url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              {business.google_review_url}
              <IconExternal className="h-3.5 w-3.5" />
            </a>
            <p className="mt-2 text-sm text-muted-foreground">
              Created on {formatDate(business.created_at)}
              <span className="mx-2 text-border">·</span>
              {services.length} {services.length === 1 ? "Service" : "Services"}
            </p>
          </div>
        </div>
        <Card className="mt-6 border-muted/50 bg-muted/30 p-4 shadow-none">
          <p className="text-sm font-semibold text-foreground">About this business</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Customers scan a service QR code, get a rotated review line, and are
            redirected to leave a Google review for this business.
          </p>
        </Card>
      </Card>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">Services</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Each service has its own permanent QR link.
            </p>
          </div>
          {isAdmin && (
            <Link
              href={`/dashboard/business/${id}/service/new`}
              className={cn(buttonVariants({ variant: "default" }), "inline-flex items-center gap-1.5")}
            >
              <IconPlus className="h-4 w-4" />
              Add Service
            </Link>
          )}
        </div>

        <div className="space-y-3">
          {services.map((service) => {
            const serviceColors = avatarColor(service._id);
            return (
              <Card
                key={service._id}
                className="group flex flex-row items-center gap-4 p-4 transition-shadow hover:shadow-md"
              >
                <Link
                  href={`/dashboard/service/${service._id}`}
                  className="flex min-w-0 flex-1 items-center gap-4"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${serviceColors.bg} ${serviceColors.text}`}
                  >
                    <IconQr className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground group-hover:text-primary">
                        {service.name}
                      </p>
                      <Badge variant="outline" className="gap-1 border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full px-2 py-0.5 text-xs font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </Badge>
                    </div>
                    <p className="mt-0.5 font-mono text-sm text-muted-foreground">
                      /r/{service.qr_slug}
                    </p>
                  </div>
                  <IconChevronRight className="hidden h-4 w-4 text-muted-foreground sm:block" />
                </Link>
                {isAdmin && (
                  <div className="flex shrink-0 items-center gap-1">
                    <EditLink
                      href={`/dashboard/service/${service._id}/edit`}
                      variant="icon"
                    />
                    <form action={deleteService.bind(null, service._id, id)}>
                      <DeleteButton label="Service" variant="icon" />
                    </form>
                  </div>
                )}
              </Card>
            );
          })}

          {services.length === 0 ? (
            <Card className="flex flex-col items-center justify-center border-dashed bg-muted/30 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {isAdmin
                  ? "No services yet. Add one to generate a QR code."
                  : "No services assigned to you yet."}
              </p>
              {isAdmin && (
                <Link
                  href={`/dashboard/business/${id}/service/new`}
                  className={cn(buttonVariants({ variant: "default" }), "mt-4")}
                >
                  <IconPlus className="h-4 w-4" />
                  Add Service
                </Link>
              )}
            </Card>
          ) : null}
        </div>
      </div>

      <Card className="flex flex-col items-start justify-between gap-4 border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <IconInfo className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              Each service has its own QR code.
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Download and print QR codes from each service page. Links never
              change.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
