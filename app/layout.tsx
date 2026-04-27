import type { Metadata } from "next";
import { 
  IBM_Plex_Mono, 
  Syne, 
  JetBrains_Mono, 
  Literata, 
  Space_Grotesk, 
  Courier_Prime 
} from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

// 1. Headers & Display Text
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
});

// 2. Body Copy & Descriptions (Default Fallback)
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

// 3. Technical Data & Metrics
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// 4. Philosophical/Longform Text
const literata = Literata({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-literata",
  display: "swap",
});

// 5. Accent/Subheadings
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

// 6. Timestamps & Metadata
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Devansh Kumar — Software Engineer",
  description: "Building systems that think — from risk intelligence engines and peer economies to gamified desktop apps. Creator of Biome, SkillSync, and MARI.",
  keywords: ["Devansh Kumar", "Portfolio", "Software Engineer", "Biome", "SkillSync", "MARI", "Electron", "React", "TypeScript", "Firebase", "Supabase", "Peer Economy", "Desktop Apps", "Python", "Next.js"],
  openGraph: {
    title: "Devansh Kumar — Software Engineer",
    description: "Building systems that think — from risk intelligence engines and peer economies to gamified desktop apps.",
    url: "https://devantaris.vercel.app",
    siteName: "Devansh Kumar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devansh Kumar — Software Engineer",
    description: "Building systems that think — from risk intelligence engines and peer economies to gamified desktop apps.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`
        ${ibmPlexMono.variable} 
        ${syne.variable} 
        ${jetbrainsMono.variable} 
        ${literata.variable} 
        ${spaceGrotesk.variable} 
        ${courierPrime.variable} 
        antialiased font-syne
      `}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
