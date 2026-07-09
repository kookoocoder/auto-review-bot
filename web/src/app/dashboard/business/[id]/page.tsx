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

export default async function BusinessDetailPage(
  props: PageProps<"/dashboard/business/[id]">,
) {
  const { id } = await props.params;
  const business = await getBusiness(id);
  const services = await listServicesForBusiness(id);

  if (!business) {
    return (
      <div>
        <p className="text-sm text-muted">Business not found.</p>
      </div>
    );
  }

  const colors = avatarColor(business._id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-navy"
        >
          <IconArrowLeft />
          Back to Businesses
        </Link>
        <div className="flex gap-2">
          <EditLink
            href={`/dashboard/business/${id}/edit`}
            label="Edit Business"
          />
          <form action={deleteBusiness.bind(null, id)}>
            <DeleteButton label="Delete Business" />
          </form>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.text}`}
          >
            <IconStore className="h-9 w-9" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-navy">
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
            <p className="mt-2 text-sm text-muted">
              Created on {formatDate(business.created_at)}
              <span className="mx-2 text-border-strong">·</span>
              {services.length} {services.length === 1 ? "Service" : "Services"}
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-border bg-surface-muted/60 p-4">
          <p className="text-sm font-semibold text-navy">About this business</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Customers scan a service QR code, get a rotated review line, and are
            redirected to leave a Google review for this business.
          </p>
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-navy">Services</h2>
            <p className="mt-0.5 text-sm text-muted">
              Each service has its own permanent QR link.
            </p>
          </div>
          <Link
            href={`/dashboard/business/${id}/service/new`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 hover:bg-primary-hover"
          >
            <IconPlus className="h-4 w-4" />
            Add Service
          </Link>
        </div>

        <div className="space-y-3">
          {services.map((service) => {
            const serviceColors = avatarColor(service._id);
            return (
              <div
                key={service._id}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-md hover:shadow-navy/5"
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
                      <p className="font-semibold text-navy group-hover:text-primary">
                        {service.name}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Active
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-sm text-muted">
                      /r/{service.qr_slug}
                    </p>
                  </div>
                  <IconChevronRight className="hidden h-4 w-4 text-muted-light sm:block" />
                </Link>
                <div className="flex shrink-0 items-center gap-1">
                  <EditLink
                    href={`/dashboard/service/${service._id}/edit`}
                    variant="icon"
                  />
                  <form action={deleteService.bind(null, service._id, id)}>
                    <DeleteButton label="Service" variant="icon" />
                  </form>
                </div>
              </div>
            );
          })}

          {services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface/60 px-6 py-12 text-center">
              <p className="text-sm text-muted">
                No services yet. Add one to generate a QR code.
              </p>
              <Link
                href={`/dashboard/business/${id}/service/new`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                <IconPlus className="h-4 w-4" />
                Add Service
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary-muted/40 bg-primary-soft/50 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <IconInfo className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-navy">
              Each service has its own QR code.
            </p>
            <p className="mt-0.5 text-sm text-muted">
              Download and print QR codes from each service page. Links never
              change.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
