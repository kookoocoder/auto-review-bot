import Link from "next/link";

type Props = {
  href: string;
  label?: string;
};

export function EditLink({ href, label = "Edit" }: Props) {
  return (
    <Link
      href={href}
      className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
    >
      {label}
    </Link>
  );
}
