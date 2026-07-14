import Link from "next/link";
import { CopyButtonInline } from "@/components/copy-button-inline";
import { CsvUpload } from "@/components/csv-upload";
import { DeleteButton } from "@/components/delete-button";
import { EditLink } from "@/components/edit-link";
import { QrCodeCard } from "@/components/qr-code-card";
import {
  IconArrowLeft,
  IconCoffee,
  IconExternal,
  IconMessage,
  IconPlus,
  IconQr,
  IconStore,
} from "@/components/icons";
import {
  createReviewText,
  deleteReviewText,
  deleteService,
  getBusiness,
  getService,
  importReviewTexts,
  listReviewTexts,
  updateReviewText,
} from "@/lib/db";
import { generateQrAssets, getScanUrl } from "@/lib/qr";
import { avatarColor, formatDate, formatDateTime } from "@/lib/ui";

export default async function ServiceDetailPage(
  props: PageProps<"/dashboard/service/[id]">,
) {
  const { id } = await props.params;
  const service = await getService(id);

  if (!service) {
    return (
      <div>
        <p className="text-sm text-muted">Service not found.</p>
      </div>
    );
  }

  const business = await getBusiness(service.business_id);
  const reviewTexts = await listReviewTexts(id);
  const scanCount = reviewTexts.reduce((sum, row) => sum + row.used_count, 0);
  const scanUrl = getScanUrl(service.qr_slug);
  const qrAssets = await generateQrAssets(scanUrl);
  const colors = avatarColor(service._id);

  const sortedByLastUsed = [...reviewTexts].sort((a, b) => {
    const aTime = a.last_used_at ?? 0;
    const bTime = b.last_used_at ?? 0;
    return aTime - bTime;
  });
  const leastRecentlyUsed = sortedByLastUsed[0] ?? null;
  const mostUsed =
    [...reviewTexts].sort((a, b) => b.used_count - a.used_count)[0] ?? null;
  const avgUses =
    reviewTexts.length > 0 ? Math.round(scanCount / reviewTexts.length) : 0;
  const lastUpdated = reviewTexts.reduce<number | null>((latest, row) => {
    const t = row.last_used_at;
    if (t == null) return latest;
    if (latest == null || t > latest) return t;
    return latest;
  }, null);

  async function onImportReviewTexts(formData: FormData) {
    "use server";
    await importReviewTexts(id, formData);
  }

  async function onAddReviewText(formData: FormData) {
    "use server";
    await createReviewText(id, formData);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/dashboard/business/${service.business_id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-navy"
        >
          <IconArrowLeft />
          Back to Business
        </Link>
        <div className="flex gap-2">
          <EditLink href={`/dashboard/service/${id}/edit`} label="Edit Service" />
          <form action={deleteService.bind(null, id, service.business_id)}>
            <DeleteButton label="Delete Service" />
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.text}`}
          >
            <IconCoffee className="h-7 w-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-navy">
                {service.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Active
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <Link
                href={`/r/${service.qr_slug}`}
                className="inline-flex items-center gap-1 font-mono text-primary hover:underline"
              >
                /r/{service.qr_slug}
                <IconExternal className="h-3.5 w-3.5" />
              </Link>
              {business ? (
                <span className="inline-flex items-center gap-1.5">
                  Part of
                  <IconStore className="h-3.5 w-3.5" />
                  <Link
                    href={`/dashboard/business/${business._id}`}
                    className="font-medium text-navy hover:text-primary"
                  >
                    {business.name}
                  </Link>
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary-muted/50 bg-primary-soft/50 p-4 lg:min-w-[320px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            QR Link (Permanent)
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
            <p className="min-w-0 flex-1 truncate font-mono text-xs text-navy">
              {scanUrl}
            </p>
            <CopyButtonInline value={scanUrl} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Total Scans",
            value: scanCount.toLocaleString(),
            icon: IconQr,
            tone: "text-violet-600 bg-violet-100",
          },
          {
            label: "Reviews Used",
            value: reviewTexts.filter((r) => r.used_count > 0).length.toLocaleString(),
            icon: IconMessage,
            tone: "text-emerald-600 bg-emerald-100",
          },
          {
            label: "Total Reviews",
            value: reviewTexts.length.toLocaleString(),
            icon: IconMessage,
            tone: "text-orange-600 bg-orange-100",
          },
          {
            label: "Avg. Uses / Review",
            value: String(avgUses),
            icon: IconQr,
            tone: "text-sky-600 bg-sky-100",
          },
          {
            label: "Created On",
            value: formatDate(service.created_at),
            icon: IconStore,
            tone: "text-violet-600 bg-violet-100",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted">{stat.label}</p>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${stat.tone}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-navy">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <QrCodeCard
          scanUrl={scanUrl}
          pngDataUrl={qrAssets.pngDataUrl}
          svg={qrAssets.svg}
          serviceName={service.name}
        />

        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy">Review Pool</h2>
            <a
              href="#review-pool"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Manage Reviews
            </a>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-surface-muted/70 px-3 py-2.5">
              <p className="text-xs text-muted">Total Reviews</p>
              <p className="mt-0.5 text-lg font-bold text-navy">
                {reviewTexts.length}
              </p>
            </div>
            <div className="rounded-xl bg-surface-muted/70 px-3 py-2.5">
              <p className="text-xs text-muted">Least Recently Used</p>
              <p className="mt-0.5 line-clamp-2 text-sm font-medium text-navy">
                {leastRecentlyUsed?.text ?? "—"}
              </p>
            </div>
            <div className="rounded-xl bg-surface-muted/70 px-3 py-2.5">
              <p className="text-xs text-muted">Most Used</p>
              <p className="mt-0.5 line-clamp-2 text-sm font-medium text-navy">
                {mostUsed
                  ? `${mostUsed.text} (${mostUsed.used_count}×)`
                  : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-surface-muted/70 px-3 py-2.5">
              <p className="text-xs text-muted">Last Updated</p>
              <p className="mt-0.5 text-sm font-medium text-navy">
                {lastUpdated ? formatDateTime(lastUpdated) : "Never"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-base font-bold text-navy">Pool Health</h2>
          <p className="mt-1 text-sm text-muted">
            Aim for at least 15 varied review lines for best rotation.
          </p>
          <div className="mt-5">
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-navy">
                {reviewTexts.length >= 15 ? "Good" : "Low"}
              </p>
              <p className="text-sm text-muted">
                {reviewTexts.length} / 15 recommended
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className={`h-full rounded-full transition-all ${
                  reviewTexts.length >= 15 ? "bg-success" : "bg-warning"
                }`}
                style={{
                  width: `${Math.min(100, (reviewTexts.length / 15) * 100)}%`,
                }}
              />
            </div>
          </div>
          <Link
            href={`/r/${service.qr_slug}`}
            className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-navy hover:bg-surface-muted"
          >
            Preview Public Page
            <IconExternal className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-primary-muted/40 bg-primary-soft/50 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-navy">Preview Customer Experience</p>
          <p className="mt-0.5 text-sm text-muted">
            See how your customers see the review page.
          </p>
        </div>
        <Link
          href={`/r/${service.qr_slug}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Preview Public Page
          <IconExternal className="h-3.5 w-3.5" />
        </Link>
      </div>

      <section id="review-pool" className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-navy">Review Pool</h2>
            <p className="mt-0.5 text-sm text-muted">
              Manage the review text lines rotated for this service.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">Total Reviews</p>
            <p className="mt-1 text-2xl font-bold text-navy">
              {reviewTexts.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">Least Recently Used</p>
            <p className="mt-1 line-clamp-2 text-sm font-medium text-navy">
              {leastRecentlyUsed
                ? leastRecentlyUsed.last_used_at
                  ? formatDateTime(leastRecentlyUsed.last_used_at)
                  : "Never used"
                : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">Most Used</p>
            <p className="mt-1 text-sm font-medium text-navy">
              {mostUsed ? `${mostUsed.used_count} times` : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">Last Updated</p>
            <p className="mt-1 text-sm font-medium text-navy">
              {lastUpdated ? formatDateTime(lastUpdated) : "Never"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-navy">Import from CSV</h3>
            <CsvUpload action={onImportReviewTexts} />
          </div>
          <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-navy">Add Review</h3>
            <form action={onAddReviewText} className="space-y-3">
              <textarea
                name="text"
                required
                maxLength={300}
                placeholder="Great service, staff was really helpful and quick."
                className="min-h-28 w-full rounded-xl border border-border-strong p-3 text-sm text-navy outline-none placeholder:text-muted-light focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                <IconPlus className="h-4 w-4" />
                Add Review
              </button>
            </form>
          </div>
        </div>

        {reviewTexts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-strong bg-surface/60 px-6 py-12 text-center">
            <p className="text-sm text-muted">
              No review lines yet. Add at least 15 varied lines for best
              rotation.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/50 text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Review Text</th>
                    <th className="px-4 py-3">Used Count</th>
                    <th className="px-4 py-3">Last Used</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewTexts.map((review, index) => (
                    <tr
                      key={review._id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <form
                          action={updateReviewText.bind(null, review._id, id)}
                          className="flex items-start gap-2"
                        >
                          <textarea
                            name="text"
                            required
                            maxLength={300}
                            defaultValue={review.text}
                            className="min-h-[4.5rem] w-full min-w-[220px] rounded-lg border border-border bg-surface px-2.5 py-2 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="submit"
                            className="shrink-0 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-navy hover:bg-surface-muted"
                          >
                            Save
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-3 font-medium text-navy">
                        {review.used_count}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {review.last_used_at
                          ? formatDateTime(review.last_used_at)
                          : "Never"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" />
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <form
                          action={deleteReviewText.bind(null, review._id, id)}
                          className="flex justify-end"
                        >
                          <DeleteButton label="Review" variant="icon" />
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border px-4 py-3 text-xs text-muted">
              Showing {reviewTexts.length} review
              {reviewTexts.length === 1 ? "" : "s"}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
