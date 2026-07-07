import Link from "next/link";
import { getService, updateService } from "@/lib/db";

export default async function EditServicePage(
  props: PageProps<"/dashboard/service/[id]/edit">,
) {
  const { id } = await props.params;
  const service = await getService(id);

  if (!service) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <p className="text-sm text-zinc-600">Service not found.</p>
      </main>
    );
  }

  async function onUpdate(formData: FormData) {
    "use server";
    await updateService(id, formData);
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-6 py-10">
      <Link
        href={`/dashboard/service/${id}`}
        className="text-sm text-zinc-500 hover:text-zinc-700"
      >
        ← Back to service
      </Link>
      <h1 className="text-2xl font-semibold">Edit service</h1>
      <p className="text-sm text-zinc-500">
        QR slug <code className="rounded bg-zinc-100 px-1">/r/{service.qr_slug}</code> cannot be
        changed once created.
      </p>
      <form action={onUpdate} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Service name</span>
          <input
            name="name"
            required
            defaultValue={service.name}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Save changes
          </button>
          <Link
            href={`/dashboard/service/${id}`}
            className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
