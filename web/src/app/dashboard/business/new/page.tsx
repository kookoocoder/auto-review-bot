import { redirect } from "next/navigation";
import { createBusiness } from "@/lib/db";

export default function NewBusinessPage() {
  async function onCreateBusiness(formData: FormData) {
    "use server";
    await createBusiness(formData);
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-6 py-10">
      <h1 className="text-2xl font-semibold">Create business</h1>
      <form action={onCreateBusiness} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Business name</span>
          <input
            name="name"
            required
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
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Save business
        </button>
      </form>
    </main>
  );
}
