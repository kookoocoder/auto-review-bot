import { redirect } from "next/navigation";
import { createService } from "@/lib/db";

export default async function NewServicePage(
  props: PageProps<"/dashboard/business/[id]/service/new">,
) {
  const { id } = await props.params;

  async function onCreateService(formData: FormData) {
    "use server";
    await createService(id, formData);
    redirect(`/dashboard/business/${id}`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-6 py-10">
      <h1 className="text-2xl font-semibold">Create service</h1>
      <form action={onCreateService} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Service name</span>
          <input
            name="name"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Save service
        </button>
      </form>
    </main>
  );
}
