import Link from "next/link";
import { CsvUpload } from "@/components/csv-upload";
import { DeleteButton } from "@/components/delete-button";
import { EditLink } from "@/components/edit-link";
import { QrCodeCard } from "@/components/qr-code-card";
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

export default async function ServiceDetailPage(
  props: PageProps<"/dashboard/service/[id]">,
) {
  const { id } = await props.params;
  const service = await getService(id);

  if (!service) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <p className="text-sm text-zinc-600">Service not found.</p>
      </main>
    );
  }

  const business = await getBusiness(service.business_id);
  const reviewTexts = await listReviewTexts(id);
  const scanCount = reviewTexts.reduce((sum, row) => sum + row.used_count, 0);
  const scanUrl = getScanUrl(service.qr_slug);
  const qrAssets = await generateQrAssets(scanUrl);

  async function onImportReviewTexts(formData: FormData) {
    "use server";
    await importReviewTexts(id, formData);
  }

  async function onAddReviewText(formData: FormData) {
    "use server";
    await createReviewText(id, formData);
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/dashboard/business/${service.business_id}`}
            className="text-sm text-zinc-500 hover:text-zinc-700"
          >
            ← Back to {business?.name ?? "business"}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{service.name}</h1>
          <p className="text-sm text-zinc-500">QR slug: /r/{service.qr_slug}</p>
          <Link
            href={`/r/${service.qr_slug}`}
            className="mt-1 inline-block text-sm text-blue-600 hover:underline"
          >
            Open public scan page →
          </Link>
        </div>
        <div className="flex shrink-0 gap-2">
          <EditLink href={`/dashboard/service/${id}/edit`} />
          <form action={deleteService.bind(null, id, service.business_id)}>
            <DeleteButton label="Delete" />
          </form>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Review lines</p>
          <p className="text-2xl font-semibold">{reviewTexts.length}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Total scans</p>
          <p className="text-2xl font-semibold">{scanCount}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Pool health</p>
          <p className="text-2xl font-semibold">
            {reviewTexts.length >= 15 ? "Good" : "Low"}
          </p>
        </div>
      </div>

      <QrCodeCard
        scanUrl={scanUrl}
        pngDataUrl={qrAssets.pngDataUrl}
        svg={qrAssets.svg}
        serviceName={service.name}
      />

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Add review text</h2>
        <CsvUpload action={onImportReviewTexts} />
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-xs text-zinc-500">or add manually</span>
          </div>
        </div>
        <form action={onAddReviewText} className="space-y-3">
          <textarea
            name="text"
            required
            maxLength={300}
            placeholder="Great service, staff was really helpful and quick."
            className="min-h-24 w-full rounded-md border border-zinc-300 p-3 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Add review line
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Review text pool</h2>
        {reviewTexts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
            No review lines yet. Add at least 15 varied lines for best rotation.
          </p>
        ) : (
          <div className="space-y-3">
            {reviewTexts.map((review) => (
              <div
                key={review._id}
                className="rounded-lg border border-zinc-200 p-4"
              >
                <form action={updateReviewText.bind(null, review._id, id)} className="space-y-3">
                  <textarea
                    name="text"
                    required
                    maxLength={300}
                    defaultValue={review.text}
                    className="min-h-20 w-full rounded-md border border-zinc-300 p-3 text-sm"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-zinc-500">
                      Used {review.used_count} times
                      {review.last_used_at
                        ? ` · Last used ${new Date(review.last_used_at).toLocaleString()}`
                        : " · Never used"}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
                <form action={deleteReviewText.bind(null, review._id, id)} className="mt-2 flex justify-end">
                  <DeleteButton label="Delete" />
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
