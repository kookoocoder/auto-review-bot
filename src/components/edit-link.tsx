import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconPencil } from "@/components/icons";

type Props = {
  href: string;
  label?: string;
  variant?: "outline" | "ghost" | "icon";
};

export function EditLink({ href, label = "Edit", variant = "outline" }: Props) {
  return (
    <Link href={href} className="inline-flex">
      <Button
        variant={variant === "outline" ? "outline" : "ghost"}
        size={variant === "icon" ? "icon-sm" : "default"}
        type="button"
      >
        <IconPencil className="h-4 w-4" />
        {variant !== "icon" ? label : null}
      </Button>
    </Link>
  );
}

