import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { SITE, withBasePath } from "@/lib/content";

// Brutalist editorial header font
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// Telemetry metadata monospace font
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

// High-legibility body sans-serif font
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url),
  title: SITE.title,
  description: SITE.description,
  keywords: ["Devansh Kumar", "Software Engineer", "MARI", "SatyaLabel", "CryptoFlow", "XGBoost", "FastAPI", "IEEE Chairperson", "Bennett University"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: "/",
    siteName: SITE.name,
    type: "website",
    images: [
      {
        url: withBasePath("/images/og-image.jpg"),
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [withBasePath("/images/og-image.jpg")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${spaceMono.variable} ${plusJakarta.variable}`}>
      <body className="antialiased font-sans text-foreground bg-background">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
