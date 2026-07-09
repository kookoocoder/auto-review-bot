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
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-navy"
        >
          <IconArrowLeft />
          Back to Business
        </Link>
        <Link
          href={`/dashboard/business/${id}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-muted hover:bg-surface-muted"
        >
          <IconX />
          Cancel
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-navy">
          Add New Service
        </h1>
        <p className="mt-1 text-sm text-muted">
          Add a new service under{" "}
          <span className="font-semibold text-primary">
            {business?.name ?? "this business"}
          </span>
          .
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form
          action={onCreateService}
          className="space-y-5 rounded-2xl border border-border bg-surface p-6"
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
                placeholder="Enter service name"
                className="w-full rounded-xl border border-border-strong bg-surface py-2.5 pl-10 pr-3 text-sm text-navy outline-none placeholder:text-muted-light focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <span className="mt-1.5 block text-xs text-muted">
              Example: Cafe, Bakery, Catering, Haircut, etc.
            </span>
          </label>

          <div className="rounded-xl border border-primary-muted/50 bg-primary-soft/50 p-4">
            <div className="flex items-start gap-2 text-sm text-muted">
              <IconInfo className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                A unique QR link is generated automatically when you save. The
                link is permanent and cannot be changed later.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 hover:bg-primary-hover"
          >
            <IconSave />
            Save Service
          </button>
        </form>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-semibold text-navy">Preview</p>
            <p className="mt-0.5 text-xs text-muted">
              This is how your service will appear.
            </p>
            <div className="mt-4 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                <IconCoffee className="h-6 w-6" />
              </div>
              <p className="mt-3 font-bold text-navy">Your Service Name</p>
              <p className="mt-1 text-xs text-muted">
                {business?.name ?? "Business"}
              </p>
              <div className="mt-4 w-full rounded-xl border border-dashed border-border-strong bg-surface-muted px-3 py-2 font-mono text-xs text-muted">
                QR Link: /r/auto-generated
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary-muted/50 bg-primary-soft/60 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
              <IconInfo className="h-4 w-4 text-primary" />
              What happens next?
            </div>
            <ul className="space-y-2.5 text-sm text-muted">
              {[
                "You can upload review text lines for this service",
                "A unique QR code will be generated",
                "Customers can scan and leave reviews on Google",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success text-white">
                    <IconCheck className="h-2.5 w-2.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
