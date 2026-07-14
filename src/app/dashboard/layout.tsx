import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <DashboardSidebar session={session} />
      <div className="min-w-0 flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
