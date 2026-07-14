"use client";

import { Button } from "@/components/ui/button";
import { IconTrash } from "@/components/icons";

type Props = {
  label?: string;
  variant?: "outline" | "ghost" | "icon";
};

export function DeleteButton({ label = "Delete", variant = "outline" }: Props) {
  return (
    <Button
      type="submit"
      variant="destructive"
      size={variant === "icon" ? "icon-sm" : "default"}
      className={variant === "outline" ? "border border-destructive/20" : ""}
      onClick={(event) => {
        if (!confirm(`Delete this ${label.toLowerCase()}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <IconTrash className="h-4 w-4" />
      {variant !== "icon" ? label : null}
    </Button>
  );
}

