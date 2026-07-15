import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/logo";
import { IconChevronRight, IconCoffee, IconStore } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { getPublicBusinessProfile } from "@/lib/db";

export default async function BusinessServicesPage(
  props: PageProps<"/b/[business_id]">,
) {
  const { business_id } = await props.params;
  const profile = await getPublicBusinessProfile(business_id);

  if (!profile) notFound();

  return (
    <main className="relative flex min-h-screen flex-col bg-muted/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(45,70,185,0.1),_transparent_55%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 py-10">
        <div className="mb-8 flex justify-center">
          <Logo href={null} />
        </div>

        <Card className="p-6 shadow-lg sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconStore className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-foreground">
            {profile.business.name}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Select the service you received to continue.
          </p>

          {profile.services.length > 0 ? (
            <div className="mt-6 space-y-3">
              {profile.services.map((service) => (
                <Link
                  key={service._id}
                  href={`/r/${service.qr_slug}`}
                  prefetch={false}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconCoffee className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1 font-semibold text-foreground">
                    {service.name}
                  </span>
                  <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No services are available yet.
              </p>
            </div>
          )}
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Powered by QR Review Platform
        </p>
      </div>
    </main>
  );
}
