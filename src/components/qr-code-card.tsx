"use client";

import { IconInfo } from "@/components/icons";

type Props = {
  scanUrl: string;
  pngDataUrl: string;
  svg: string;
  serviceName: string;
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

export function QrCodeCard({ scanUrl, pngDataUrl, svg, serviceName }: Props) {
  const safeName = serviceName.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="text-base font-bold text-navy">QR Code</h2>
      <p className="mt-1 text-sm text-muted">
        Download and print your QR code.
      </p>

      <div className="mt-5 flex justify-center">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pngDataUrl}
            alt={`QR code for ${serviceName}`}
            width={200}
            height={200}
            className="h-[200px] w-[200px]"
          />
        </div>
      </div>

      <p className="mt-4 break-all text-center font-mono text-xs text-muted">
        {scanUrl}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => downloadDataUrl(pngDataUrl, `${safeName}-qr.png`)}
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Download PNG
        </button>
        <button
          type="button"
          onClick={() => downloadSvg(svg, `${safeName}-qr.svg`)}
          className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-navy hover:bg-surface-muted"
        >
          Download SVG
        </button>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary-soft/70 px-3 py-2.5 text-xs text-primary">
        <IconInfo className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        This QR code is permanent and will never change.
      </div>
    </section>
  );
}
