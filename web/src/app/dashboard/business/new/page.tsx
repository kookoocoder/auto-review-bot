import Link from "next/link";
import { redirect } from "next/navigation";
import {
  IconArrowLeft,
  IconCheck,
  IconInfo,
  IconLink,
  IconSave,
  IconStore,
  IconX,
} from "@/components/icons";
import { createBusiness } from "@/lib/db";

export default function NewBusinessPage() {
  async function onCreateBusiness(formData: FormData) {
    "use server";
    await createBusiness(formData);
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-navy"
        >
          <IconArrowLeft />
          Back to Businesses
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-muted hover:bg-surface-muted"
        >
          <IconX />
          Cancel
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-navy">
          Create New Business
        </h1>
        <p className="mt-1 text-sm text-muted">
          Add your business details to get started.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form
          action={onCreateBusiness}
          className="space-y-5 rounded-2xl border border-border bg-surface p-6"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              Business Name <span className="text-danger">*</span>
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-light">
                <IconStore className="h-4 w-4" />
              </span>
              <input
                name="name"
                required
                maxLength={100}
                placeholder="Enter business name"
                className="w-full rounded-xl border border-border-strong bg-surface py-2.5 pl-10 pr-3 text-sm text-navy outline-none transition-shadow placeholder:text-muted-light focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <span className="mt-1.5 block text-xs text-muted">
              Use your official business name as it appears on Google.
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              Google Place ID or Review URL <span className="text-danger">*</span>
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-light">
                <IconLink className="h-4 w-4" />
              </span>
              <input
                name="google_place_or_url"
                required
                placeholder="Enter Google Place ID or full review URL"
                className="w-full rounded-xl border border-border-strong bg-surface py-2.5 pl-10 pr-3 text-sm text-navy outline-none transition-shadow placeholder:text-muted-light focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <a
              href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-block text-xs font-medium text-primary hover:underline"
            >
              How to find your Google Place ID?
            </a>
          </label>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-colors hover:bg-primary-hover"
          >
            <IconSave />
            Save Business
          </button>
        </form>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-semibold text-navy">Preview</p>
            <div className="mt-4 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                <IconStore className="h-6 w-6" />
              </div>
              <p className="mt-3 font-bold text-navy">Your Business Name</p>
              <p className="mt-1 text-xs font-medium text-muted">Google Reviews</p>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                This is how your business will appear to customers when they scan
                your QR code.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-primary-muted/50 bg-primary-soft/60 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
              <IconInfo className="h-4 w-4 text-primary" />
              What happens next?
            </div>
            <ul className="space-y-2.5 text-sm text-muted">
              {[
                "You can add services after creating your business",
                "Each service will have its own QR code",
                "You can edit details anytime",
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
