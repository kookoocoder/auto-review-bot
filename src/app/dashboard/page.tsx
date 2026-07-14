import Link from "next/link";
import { DeleteButton } from "@/components/delete-button";
import { EditLink } from "@/components/edit-link";
import { IconPlus, IconStore } from "@/components/icons";
import { deleteBusiness, listBusinesses, listServicesForBusiness } from "@/lib/db";
import { avatarColor } from "@/lib/ui";

export default async function DashboardPage() {
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
        <h1 className="text-2xl font-bold text-navy">Convex not ready</h1>
        <p className="text-sm text-muted">
          The app could not reach your Convex backend. This usually means
          functions are not deployed yet to your cloud project.
        </p>
        <pre className="overflow-x-auto rounded-2xl border border-red-200 bg-danger-soft p-4 text-sm text-danger">
          {loadError}
        </pre>
        <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
          <p className="font-semibold text-navy">Fix (run in the web folder):</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
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
        </div>
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
          <h1 className="text-3xl font-bold tracking-tight text-navy">Businesses</h1>
          <p className="mt-1 text-sm text-muted">
            Manage all your businesses in one place.
          </p>
        </div>
        <Link
          href="/dashboard/business/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-colors hover:bg-primary-hover"
        >
          <IconPlus className="h-4 w-4" />
          New Business
        </Link>
      </div>

      <div className="space-y-3">
        {businesses.map((business) => {
          const colors = avatarColor(business._id);
          const count = countById[business._id] ?? 0;
          return (
            <div
              key={business._id}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-md hover:shadow-navy/5"
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
                  <p className="font-semibold text-navy group-hover:text-primary">
                    {business.name}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-primary/80">
                    {business.google_review_url}
                  </p>
                </div>
                <span className="hidden shrink-0 text-sm font-medium text-primary sm:inline">
                  {count} {count === 1 ? "Service" : "Services"}
                </span>
              </Link>
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
            </div>
          );
        })}

        {businesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface/60 px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
              <IconStore className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-muted">
              No businesses yet. Create your first business to get started.
            </p>
            <Link
              href="/dashboard/business/new"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              <IconPlus className="h-4 w-4" />
              New Business
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface/40 px-6 py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
              <IconStore className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted">
              Add another business to manage more locations.
            </p>
            <Link
              href="/dashboard/business/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              <IconPlus className="h-4 w-4" />
              New Business
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
