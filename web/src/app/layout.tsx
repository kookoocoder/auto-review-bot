import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Review Platform",
  description:
    "Collect more Google reviews with static QR links and smart review text rotation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", plusJakarta.variable, geistMono.variable, "font-sans", figtree.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
