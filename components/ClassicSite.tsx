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

const MultiLayerStarfield = dynamic(() => import('@/components/StarfieldBackground'), { ssr: false });
const Projects = dynamic(() => import('@/components/Projects'), { ssr: false });

/**
 * The classic stacked one-page site. Now serves as the fallback experience on
 * mobile / touch / reduced-motion devices, where the WebGL universe is skipped.
 */
export default function ClassicSite() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="relative min-h-screen">
      <MultiLayerStarfield />
      <CustomCursor />
      <Navigation />
      <Hero />
      <AboutBento />
      <TechStack />
      <Experience />
      <Projects />
      <GitHubStats />
      <Blog />
      <ContactSection />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </main>
  );
}
