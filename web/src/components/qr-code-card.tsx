"use client";

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
    <section className="rounded-lg border border-zinc-200 p-6">
      <h2 className="text-lg font-medium">QR code</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Print this once — the URL never changes. Each scan rotates to the next
        review line automatically.
      </p>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pngDataUrl}
            alt={`QR code for ${serviceName}`}
            width={256}
            height={256}
            className="h-64 w-64"
          />
        </div>

        <div className="w-full min-w-0 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Scan URL
            </p>
            <p className="mt-1 break-all font-mono text-sm text-zinc-800">
              {scanUrl}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadDataUrl(pngDataUrl, `${safeName}-qr.png`)}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Download PNG
            </button>
            <button
              type="button"
              onClick={() => downloadSvg(svg, `${safeName}-qr.svg`)}
              className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Download SVG
            </button>
          </div>

          <p className="text-xs text-zinc-500">
            PNG for printing · SVG for posters and table tents (scales cleanly)
          </p>
        </div>
      </div>
    </section>
  );
}
