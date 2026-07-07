import Link from "next/link";
import { DeleteButton } from "@/components/delete-button";
import { EditLink } from "@/components/edit-link";
import {
  deleteBusiness,
  deleteService,
  getBusiness,
  listServicesForBusiness,
} from "@/lib/db";

export default async function BusinessDetailPage(
  props: PageProps<"/dashboard/business/[id]">,
) {
  const { id } = await props.params;
  const business = await getBusiness(id);
  const services = await listServicesForBusiness(id);

  if (!business) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <p className="text-sm text-zinc-600">Business not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-700">
            ← Back to businesses
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{business.name}</h1>
          <p className="text-sm text-zinc-500">{business.google_review_url}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <EditLink href={`/dashboard/business/${id}/edit`} />
          <form action={deleteBusiness.bind(null, id)}>
            <DeleteButton label="Delete" />
          </form>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Services</h2>
        <Link
          href={`/dashboard/business/${id}/service/new`}
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
        >
          Add service
        </Link>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service._id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
          >
            <Link href={`/dashboard/service/${service._id}`} className="min-w-0 flex-1">
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-zinc-500">/r/{service.qr_slug}</p>
            </Link>
            <div className="ml-4 flex shrink-0 gap-2">
              <EditLink href={`/dashboard/service/${service._id}/edit`} />
              <form action={deleteService.bind(null, service._id, id)}>
                <DeleteButton label="Delete" />
              </form>
            </div>
          </div>
        ))}
        {services.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
            No services yet. Add one to generate a QR code.
          </p>
        ) : null}
      </div>
    </main>
  );
}
