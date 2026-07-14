import Link from "next/link";
import {
  IconArrowLeft,
  IconCoffee,
  IconSave,
  IconX,
} from "@/components/icons";
import { getService, updateService } from "@/lib/db";

export default async function EditServicePage(
  props: PageProps<"/dashboard/service/[id]/edit">,
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

  async function onUpdate(formData: FormData) {
    "use server";
    await updateService(id, formData);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/service/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-navy"
        >
          <IconArrowLeft />
          Back to Service
        </Link>
        <Link
          href={`/dashboard/service/${id}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-muted hover:bg-surface-muted"
        >
          <IconX />
          Cancel
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-navy">
          Edit Service
        </h1>
        <p className="mt-1 text-sm text-muted">
          QR slug{" "}
          <code className="rounded-md bg-surface-muted px-1.5 py-0.5 font-mono text-xs text-navy">
            /r/{service.qr_slug}
          </code>{" "}
          cannot be changed once created.
        </p>
      </div>

      <form
        action={onUpdate}
        className="max-w-xl space-y-5 rounded-2xl border border-border bg-surface p-6"
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy">
            Service Name <span className="text-danger">*</span>
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-light">
              <IconCoffee className="h-4 w-4" />
            </span>
            <input
              name="name"
              required
              maxLength={100}
              defaultValue={service.name}
              className="w-full rounded-xl border border-border-strong bg-surface py-2.5 pl-10 pr-3 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </label>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 hover:bg-primary-hover"
        >
          <IconSave />
          Save Changes
        </button>
      </form>
    </div>
  );
}
