import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

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
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
