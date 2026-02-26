import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AboutBento from '@/components/sections/AboutBento';
import TechStack from '@/components/sections/TechStack';
import Projects from '@/components/Projects';
import GitHubStats from '@/components/sections/GitHubStats';
import Blog from '@/components/sections/Blog';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <main className="relative bg-background min-h-screen">
      <Navigation />
      <Hero />
      <AboutBento />
      <TechStack />
      <Projects />
      <GitHubStats />
      <Blog />
      <ContactSection />
    </main>
  );
}
