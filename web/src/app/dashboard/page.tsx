import Link from "next/link";
import { DeleteButton } from "@/components/delete-button";
import { EditLink } from "@/components/edit-link";
import { deleteBusiness, listBusinesses } from "@/lib/db";

export default async function DashboardPage() {
  const businesses = await listBusinesses();

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Businesses</h1>
        <Link
          href="/dashboard/business/new"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
        >
          New business
        </Link>
      </div>

      <div className="space-y-3">
        {businesses.map((business) => (
          <div
            key={business._id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
          >
            <Link href={`/dashboard/business/${business._id}`} className="min-w-0 flex-1">
              <p className="font-medium">{business.name}</p>
              <p className="truncate text-sm text-zinc-500">{business.google_review_url}</p>
            </Link>
            <div className="ml-4 flex shrink-0 gap-2">
              <EditLink href={`/dashboard/business/${business._id}/edit`} />
              <form action={deleteBusiness.bind(null, business._id)}>
                <DeleteButton label="Delete" />
              </form>
            </div>
          </div>
        ))}
        {businesses.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
            No businesses yet. Create your first one.
          </p>
        ) : null}
      </div>
    </main>
  );
}
