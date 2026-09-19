'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import CustomCursor from '@/components/CustomCursor';
import AboutBento from '@/components/sections/AboutBento';
import TechStack from '@/components/sections/TechStack';
import Experience from '@/components/Experience';
import GitHubStats from '@/components/sections/GitHubStats';
import Blog from '@/components/sections/Blog';
import ContactSection from '@/components/sections/ContactSection';
import ContactModal from '@/components/ui/contact-modal';

// Heavy WebGL / client-only surfaces load lazily — they are not part of the
// critical first paint.
const MultiLayerStarfield = dynamic(() => import('@/components/StarfieldBackground'), { ssr: false });
const Projects = dynamic(() => import('@/components/Projects'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/ui/CommandPalette'), { ssr: false });
const MariSimulatorModal = dynamic(() => import('@/components/ui/MariSimulatorModal'), { ssr: false });

export default function Home() {
  const [isMariOpen, setIsMariOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="relative min-h-screen">
      {/* Glowing mathematical background nodes (desktop only, lazy) */}
      <MultiLayerStarfield />

      {/* Custom responsive kinetic cursor */}
      <CustomCursor />

      {/* Editorial header navigation */}
      <Navigation />

      {/* 3D Attractor dynamic hero section */}
      <Hero />

      {/* Asymmetrical profile descriptions */}
      <AboutBento />

      {/* Interactive Technical Constellation */}
      <TechStack />

      {/* Career chronology grid */}
      <Experience />

      {/* Overlapping sticky project deck (WebGL on desktop, cards on mobile) */}
      <Projects />

      {/* Open source telemetry charts */}
      <GitHubStats />

      {/* Intellectual published articles & research */}
      <Blog />

      {/* Communication encryption node footer */}
      <ContactSection />

      {/* Quick Command Palette (Cmd+K) */}
      <CommandPalette
        onOpenMariSimulator={() => setIsMariOpen(true)}
        onOpenContactModal={() => setIsContactOpen(true)}
      />

      {/* Interactive MARI Decision Simulator Modal */}
      <MariSimulatorModal
        isOpen={isMariOpen}
        onClose={() => setIsMariOpen(false)}
      />

      {/* Secure Contact Channel Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}
