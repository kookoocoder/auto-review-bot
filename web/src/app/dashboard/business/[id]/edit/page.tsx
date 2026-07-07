import Link from "next/link";
import { getBusiness, updateBusiness } from "@/lib/db";

export default async function EditBusinessPage(
  props: PageProps<"/dashboard/business/[id]/edit">,
) {
  const { id } = await props.params;
  const business = await getBusiness(id);

  if (!business) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <p className="text-sm text-zinc-600">Business not found.</p>
      </main>
    );
  }

  const placeOrUrl = business.google_place_id ?? business.google_review_url;

  async function onUpdate(formData: FormData) {
    "use server";
    await updateBusiness(id, formData);
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-6 py-10">
      <Link
        href={`/dashboard/business/${id}`}
        className="text-sm text-zinc-500 hover:text-zinc-700"
      >
        ← Back to business
      </Link>
      <h1 className="text-2xl font-semibold">Edit business</h1>
      <form action={onUpdate} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Business name</span>
          <input
            name="name"
            required
            defaultValue={business.name}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Google Place ID or full review URL
          </span>
          <input
            name="google_place_or_url"
            required
            defaultValue={placeOrUrl}
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
            href={`/dashboard/business/${id}`}
            className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
