"use client";

import { useState } from "react";
import { IconCopy } from "@/components/icons";

type Props = {
  value: string;
  className?: string;
};

export function CopyButtonInline({ value, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary-soft ${className}`}
      title={copied ? "Copied!" : "Copy"}
    >
      <IconCopy className="h-4 w-4" />
    </button>
  );
}
