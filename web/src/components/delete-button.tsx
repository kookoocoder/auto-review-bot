"use client";

type Props = {
  label?: string;
};

export function DeleteButton({ label = "Delete" }: Props) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!confirm(`Delete this ${label.toLowerCase()}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
      className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      {label}
    </button>
  );
}
