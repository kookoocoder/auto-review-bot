import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-14">
      <main className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">QR Review Platform</h1>
        <p className="max-w-xl text-zinc-600">
          Create businesses, services, and static QR links that rotate review
          text lines using least-recently-used logic before redirecting to
          Google reviews.
        </p>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Open dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
