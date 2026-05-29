'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import MultiLayerStarfield from '@/components/StarfieldBackground';
import CustomCursor from '@/components/CustomCursor';
import AboutBento from '@/components/sections/AboutBento';
import TechStack from '@/components/sections/TechStack';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import GitHubStats from '@/components/sections/GitHubStats';
import Blog from '@/components/sections/Blog';
import ContactSection from '@/components/sections/ContactSection';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <LoadingScreen onComplete={() => setIsLoading(false)} />
      
      {!isLoading && (
        <main className="relative min-h-screen overflow-hidden">
          {/* Glowing mathematical background nodes */}
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
          
          {/* Overlapping sticky project deck */}
          <Projects />
          
          {/* Open source telemetry charts */}
          <GitHubStats />
          
          {/* Intellectual published articles list */}
          <Blog />
          
          {/* Communication encryption node footer */}
          <ContactSection />
        </main>
      )}
    </>
  );
}
