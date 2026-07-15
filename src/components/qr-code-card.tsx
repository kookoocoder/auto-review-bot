"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconInfo } from "@/components/icons";

type Props = {
  scanUrl: string;
  pngDataUrl: string;
  svg: string;
  name: string;
};

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function QrCodeCard({ scanUrl, pngDataUrl, svg, name }: Props) {
  const safeName = name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
        <CardDescription>Download and print your QR code.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pngDataUrl}
            alt={`QR code for ${name}`}
            width={200}
            height={200}
            className="h-[200px] w-[200px]"
          />
        </div>
        <p className="break-all text-center font-mono text-xs text-muted-foreground">
          {scanUrl}
        </p>
      </CardContent>

      <CardFooter className="flex-col gap-3">
        <div className="flex w-full flex-col gap-2">
          <Button
            type="button"
            onClick={() => downloadDataUrl(pngDataUrl, `${safeName}-qr.png`)}
            className="w-full"
          >
            Download PNG
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => downloadSvg(svg, `${safeName}-qr.svg`)}
            className="w-full"
          >
            Download SVG
          </Button>
        </div>

        <div className="flex w-full items-start gap-2 rounded-xl bg-primary-soft/70 px-3 py-2.5 text-xs text-primary">
          <IconInfo className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          This QR code is permanent and will never change.
        </div>
      </CardFooter>
    </Card>
  );
}

