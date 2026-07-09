import Link from "next/link";
import { IconPencil } from "@/components/icons";

type Props = {
  href: string;
  label?: string;
  variant?: "outline" | "ghost" | "icon";
};

export function EditLink({ href, label = "Edit", variant = "outline" }: Props) {
  const base =
    "inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-colors";

  const styles =
    variant === "icon"
      ? `${base} h-8 w-8 rounded-lg text-muted hover:bg-surface-muted hover:text-navy`
      : variant === "ghost"
        ? `${base} rounded-xl px-3 py-2 text-muted hover:bg-surface-muted hover:text-navy`
        : `${base} rounded-xl border border-border bg-surface px-3.5 py-2 text-navy hover:bg-surface-muted`;

  return (
    <Link href={href} className={styles}>
      <IconPencil className="h-4 w-4" />
      {variant !== "icon" ? label : null}
    </Link>
  );
}
