"use client";

import { IconTrash } from "@/components/icons";

type Props = {
  label?: string;
  variant?: "outline" | "ghost" | "icon";
};

export function DeleteButton({ label = "Delete", variant = "outline" }: Props) {
  const base =
    "inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-colors";

  const styles =
    variant === "icon"
      ? `${base} h-8 w-8 rounded-lg text-danger hover:bg-danger-soft`
      : variant === "ghost"
        ? `${base} rounded-xl px-3 py-2 text-danger hover:bg-danger-soft`
        : `${base} rounded-xl border border-red-200 bg-surface px-3.5 py-2 text-danger hover:bg-danger-soft`;

  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!confirm(`Delete this ${label.toLowerCase()}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
      className={styles}
    >
      <IconTrash className="h-4 w-4" />
      {variant !== "icon" ? label : null}
    </button>
  );
}
