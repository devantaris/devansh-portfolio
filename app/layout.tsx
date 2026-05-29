import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import LenisProvider from "@/components/LenisProvider";

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
  title: "Devansh Kumar — Creative Technologist",
  description: "Architecting systems that think. From ML-driven fraud models and real-time P2P learning platforms to immersive custom graphics wrappers.",
  keywords: ["Devansh Kumar", "Creative Technologist", "Software Engineer", "MARI", "Biome", "SkillSync", "XGBoost", "Three.js", "React Three Fiber", "IEEE Chairperson", "INTJ Systems"],
  openGraph: {
    title: "Devansh Kumar — Creative Technologist",
    description: "Architecting systems that think. From ML-driven fraud models and real-time P2P learning platforms to immersive custom graphics wrappers.",
    url: "https://devantaris.vercel.app",
    siteName: "Devansh Kumar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devansh Kumar — Creative Technologist",
    description: "Architecting systems that think. From ML-driven fraud models and real-time P2P learning platforms to immersive custom graphics wrappers.",
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
        <Analytics />
      </body>
    </html>
  );
}
