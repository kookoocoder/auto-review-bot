import Link from "next/link";

type Props = {
  href?: string | null;
  compact?: boolean;
  className?: string;
};

export function Logo({ href = "/", compact = false, className = "" }: Props) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold tracking-tight text-white shadow-sm shadow-primary/25">
        QR
      </span>
      {!compact ? (
        <span className="text-[15px] font-bold tracking-tight text-navy">
          QR Review Platform
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {content}
      </Link>
    );
  }

  return content;
}
