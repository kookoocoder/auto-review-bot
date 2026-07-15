import Link from "next/link";
import { CsvUpload } from "@/components/csv-upload";
import { DeleteButton } from "@/components/delete-button";
import { EditLink } from "@/components/edit-link";
import {
  IconArrowLeft,
  IconCoffee,
  IconExternal,
  IconMessage,
  IconPlus,
  IconQr,
  IconStore,
} from "@/components/icons";
import {
  createReviewText,
  deleteReviewText,
  deleteService,
  getBusiness,
  getService,
  importReviewTexts,
  listReviewTexts,
  updateReviewText,
} from "@/lib/db";
import { avatarColor, formatDate, formatDateTime } from "@/lib/ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/session";

export default async function ServiceDetailPage(
  props: PageProps<"/dashboard/service/[id]">,
) {
  const session = await getSession();
  const isAdmin = session?.role === "admin";

  const { id } = await props.params;
  const service = await getService(id);

  if (!service) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>Service not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const business = await getBusiness(service.business_id);
  const reviewTexts = await listReviewTexts(id);
  const scanCount = reviewTexts.reduce((sum, row) => sum + row.used_count, 0);
  const colors = avatarColor(service._id);

  const sortedByLastUsed = [...reviewTexts].sort((a, b) => {
    const aTime = a.last_used_at ?? 0;
    const bTime = b.last_used_at ?? 0;
    return aTime - bTime;
  });
  const leastRecentlyUsed = sortedByLastUsed[0] ?? null;
  const mostUsed =
    [...reviewTexts].sort((a, b) => b.used_count - a.used_count)[0] ?? null;
  const avgUses =
    reviewTexts.length > 0 ? Math.round(scanCount / reviewTexts.length) : 0;
  const lastUpdated = reviewTexts.reduce<number | null>((latest, row) => {
    const t = row.last_used_at;
    if (t == null) return latest;
    if (latest == null || t > latest) return t;
    return latest;
  }, null);

  async function onImportReviewTexts(formData: FormData) {
    "use server";
    await importReviewTexts(id, formData);
  }

  async function onAddReviewText(formData: FormData) {
    "use server";
    await createReviewText(id, formData);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/dashboard/business/${service.business_id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft />
          Back to Business
        </Link>
        {isAdmin && (
          <div className="flex gap-2">
            <EditLink href={`/dashboard/service/${id}/edit`} label="Edit Service" />
            <form action={deleteService.bind(null, id, service.business_id)}>
              <DeleteButton label="Delete Service" />
            </form>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.text}`}
          >
            <IconCoffee className="h-7 w-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {service.name}
              </h1>
              <Badge variant="outline" className="gap-1 border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full px-2 py-0.5 text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </Badge>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {business ? (
                <span className="inline-flex items-center gap-1.5">
                  Part of
                  <IconStore className="h-3.5 w-3.5" />
                  <Link
                    href={`/dashboard/business/${business._id}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {business.name}
                  </Link>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Total Scans",
            value: scanCount.toLocaleString(),
            icon: IconQr,
            tone: "text-violet-600 bg-violet-100 dark:bg-violet-950/30",
          },
          {
            label: "Reviews Used",
            value: reviewTexts.filter((r) => r.used_count > 0).length.toLocaleString(),
            icon: IconMessage,
            tone: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/30",
          },
          {
            label: "Total Reviews",
            value: reviewTexts.length.toLocaleString(),
            icon: IconMessage,
            tone: "text-orange-600 bg-orange-100 dark:bg-orange-950/30",
          },
          {
            label: "Avg. Uses / Review",
            value: String(avgUses),
            icon: IconQr,
            tone: "text-sky-600 bg-sky-100 dark:bg-sky-950/30",
          },
          {
            label: "Created On",
            value: formatDate(service.created_at),
            icon: IconStore,
            tone: "text-violet-600 bg-violet-100 dark:bg-violet-950/30",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border-border/80 hover:border-primary/20"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${stat.tone}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
            </Card>
          );
        })}
      </div>

      {isAdmin && (
        <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">Review Pool</h2>
                <a
                  href="#review-pool"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Manage Reviews
                </a>
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-muted/30 px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">Total Reviews</p>
                  <p className="mt-0.5 text-lg font-bold text-foreground">
                    {reviewTexts.length}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/30 px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">Least Recently Used</p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-medium text-foreground">
                    {leastRecentlyUsed?.text ?? "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/30 px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">Most Used</p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-medium text-foreground">
                    {mostUsed
                      ? `${mostUsed.text} (${mostUsed.used_count}×)`
                      : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/30 px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {lastUpdated ? formatDateTime(lastUpdated) : "Never"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-base font-bold text-foreground">Pool Health</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Aim for at least 15 varied review lines for best rotation.
              </p>
              <div className="mt-5">
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-foreground">
                    {reviewTexts.length >= 15 ? "Good" : "Low"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reviewTexts.length} / 15 recommended
                  </p>
                </div>
                <div className="mt-3">
                  <Progress value={Math.min(100, (reviewTexts.length / 15) * 100)} />
                </div>
              </div>
              <Link
                href={`/r/${service.qr_slug}`}
                prefetch={false}
                className={cn(buttonVariants({ variant: "outline" }), "mt-6 w-full inline-flex items-center justify-center gap-1.5")}
              >
                Preview Public Page
                <IconExternal className="h-3.5 w-3.5" />
              </Link>
            </Card>
        </div>
      )}

      <Card className="border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">Preview Customer Experience</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            See how your customers see the review page.
          </p>
        </div>
        <Link
          href={`/r/${service.qr_slug}`}
          prefetch={false}
          className={cn(buttonVariants({ variant: "default" }), "inline-flex items-center gap-1.5")}
        >
          Preview Public Page
          <IconExternal className="h-3.5 w-3.5" />
        </Link>
      </Card>

      {isAdmin && (
        <section id="review-pool" className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">Review Pool</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Manage the review text lines rotated for this service.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Total Reviews</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {reviewTexts.length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Least Recently Used</p>
              <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">
                {leastRecentlyUsed
                  ? leastRecentlyUsed.last_used_at
                    ? formatDateTime(leastRecentlyUsed.last_used_at)
                    : "Never used"
                  : "—"}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Most Used</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {mostUsed ? `${mostUsed.used_count} times` : "—"}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {lastUpdated ? formatDateTime(lastUpdated) : "Never"}
              </p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4 p-5">
              <h3 className="text-sm font-bold text-foreground">Import from CSV</h3>
              <CsvUpload action={onImportReviewTexts} />
            </Card>
            <Card className="space-y-4 p-5">
              <h3 className="text-sm font-bold text-foreground">Add Review</h3>
              <form action={onAddReviewText} className="space-y-3">
                <Textarea
                  name="text"
                  required
                  maxLength={300}
                  placeholder="Great service, staff was really helpful and quick."
                  className="min-h-28"
                />
                <Button type="submit" className="inline-flex items-center gap-1.5">
                  <IconPlus className="h-4 w-4" />
                  Add Review
                </Button>
              </form>
            </Card>
          </div>

          {reviewTexts.length === 0 ? (
            <Card className="border-dashed bg-muted/30 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No review lines yet. Add at least 15 varied lines for best
                rotation.
              </p>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Review Text</TableHead>
                    <TableHead className="w-28">Used Count</TableHead>
                    <TableHead className="w-40">Last Used</TableHead>
                    <TableHead className="w-28">Status</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewTexts.map((review, index) => (
                    <TableRow key={review._id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="group/cell max-w-md">
                        <form
                          action={updateReviewText.bind(null, review._id, id)}
                          className="flex items-start gap-2"
                        >
                          <Textarea
                            name="text"
                            required
                            maxLength={300}
                            defaultValue={review.text}
                            className="min-h-[2.5rem] w-full min-w-[220px] border-transparent bg-transparent py-1 px-1.5 transition-all hover:bg-muted/40 focus:bg-card focus:border-input focus:ring-2 focus:ring-ring/50 focus:px-3 focus:py-2 rounded-md shadow-none focus:shadow-sm"
                          />
                          <Button
                            type="submit"
                            variant="outline"
                            size="xs"
                            className="shrink-0 opacity-0 group-focus-within/cell:opacity-100 group-hover/cell:opacity-100 transition-opacity duration-200 self-center"
                          >
                            Save
                          </Button>
                        </form>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {review.used_count}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {review.last_used_at
                          ? formatDateTime(review.last_used_at)
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1 border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full px-2 py-0.5 text-xs font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <form
                          action={deleteReviewText.bind(null, review._id, id)}
                          className="flex justify-end"
                        >
                          <DeleteButton label="Review" variant="icon" />
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                Showing {reviewTexts.length} review
                {reviewTexts.length === 1 ? "" : "s"}
              </div>
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
