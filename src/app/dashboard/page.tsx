import Link from "next/link";
import { DeleteButton } from "@/components/delete-button";
import { EditLink } from "@/components/edit-link";
import { IconPlus, IconStore } from "@/components/icons";
import { deleteBusiness, listBusinesses, listServicesForBusiness } from "@/lib/db";
import { avatarColor } from "@/lib/ui";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();
  const isAdmin = session?.role === "admin";

  let businesses: Awaited<ReturnType<typeof listBusinesses>> = [];
  let loadError: string | null = null;

  try {
    businesses = await listBusinesses();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load businesses from Convex.";
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Convex not ready</AlertTitle>
          <AlertDescription>
            The app could not reach your Convex backend. This usually means
            functions are not deployed yet to your cloud project.
          </AlertDescription>
        </Alert>
        <pre className="overflow-x-auto rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </pre>
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Fix (run in the web folder):</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                <code>npx convex login</code>
              </li>
              <li>
                <code>
                  npx convex dev --configure existing --project auto-review-bot
                  --dev-deployment cloud --once
                </code>
              </li>
              <li>
                Restart Next.js: <code>npm run dev</code>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    );
  }

  const serviceCounts = await Promise.all(
    businesses.map(async (business) => {
      const services = await listServicesForBusiness(business._id);
      return [business._id, services.length] as const;
    }),
  );
  const countById = Object.fromEntries(serviceCounts);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Businesses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin ? "Manage all your businesses in one place." : "Businesses assigned to you."}
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/dashboard/business/new"
            className={cn(buttonVariants({ variant: "default" }), "inline-flex items-center gap-1.5")}
          >
            <IconPlus className="h-4 w-4" />
            New Business
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {businesses.map((business) => {
          const colors = avatarColor(business._id);
          const count = countById[business._id] ?? 0;
          return (
            <Card
              key={business._id}
              className="group flex flex-row items-center gap-4 p-4 transition-shadow hover:shadow-md"
            >
              <Link
                href={`/dashboard/business/${business._id}`}
                className="flex min-w-0 flex-1 items-center gap-4"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.text}`}
                >
                  <IconStore className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground group-hover:text-primary">
                    {business.name}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {business.google_review_url}
                  </p>
                </div>
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  {count} {count === 1 ? "Service" : "Services"}
                </Badge>
              </Link>
              {isAdmin && (
                <div className="flex shrink-0 items-center gap-1">
                  <EditLink
                    href={`/dashboard/business/${business._id}/edit`}
                    label="Edit Business"
                    variant="icon"
                  />
                  <form action={deleteBusiness.bind(null, business._id)}>
                    <DeleteButton label="Business" variant="icon" />
                  </form>
                </div>
              )}
            </Card>
          );
        })}

        {businesses.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border-dashed bg-muted/30 px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconStore className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {isAdmin
                ? "No businesses yet. Create your first business to get started."
                : "No assigned businesses found."}
            </p>
            {isAdmin && (
              <Link
                href="/dashboard/business/new"
                className={cn(buttonVariants({ variant: "default" }), "mt-5")}
              >
                <IconPlus className="h-4 w-4" />
                New Business
              </Link>
            )}
          </Card>
        ) : (
          isAdmin && (
            <Card className="flex flex-col items-center justify-center border-dashed bg-muted/10 px-6 py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconStore className="h-5 w-5" />
              </div>
              <p className="text-sm text-muted-foreground">
                Add another business to manage more locations.
              </p>
              <Link
                href="/dashboard/business/new"
                className={cn(buttonVariants({ variant: "default" }), "mt-4")}
              >
                <IconPlus className="h-4 w-4" />
                New Business
              </Link>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
