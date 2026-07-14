"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onCopy}
      className={className}
      title={copied ? "Copied!" : "Copy"}
    >
      <IconCopy className="h-4 w-4" />
    </Button>
  );
}

