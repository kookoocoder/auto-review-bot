import QRCode from "qrcode";

const QR_OPTIONS = { width: 512, margin: 2 } as const;

export function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export function getBusinessScanUrl(businessId: string) {
  return `${getAppBaseUrl()}/b/${businessId}`;
}

export async function generateQrAssets(scanUrl: string) {
  const [pngDataUrl, svg] = await Promise.all([
    QRCode.toDataURL(scanUrl, QR_OPTIONS),
    QRCode.toString(scanUrl, { ...QR_OPTIONS, type: "svg" }),
  ]);

  return { pngDataUrl, svg };
}
