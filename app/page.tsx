import MultiLayerStarfield from '@/components/StarfieldBackground';
import NebulaBackground from '@/components/NebulaBackground';
import CustomCursor from '@/components/CustomCursor';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AboutSection from '@/components/sections/AboutSection';
import Projects from '@/components/Projects';
import WritingSection from '@/components/sections/WritingSection';
import SystemsSection from '@/components/sections/SystemsSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <main className="relative">
      <MultiLayerStarfield />
      <NebulaBackground />
      <CustomCursor />
      <Navigation />
      <Hero />
      <AboutSection />
      <Projects />
      <SystemsSection />
      <WritingSection />
      <ContactSection />
    </main>
  );
}
