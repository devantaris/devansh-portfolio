'use client';

import { useState } from 'react';
import { Tilt } from '@/components/ui/tilt';
import { Spotlight } from '@/components/ui/spotlight';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MultiLayerStarfield from '@/components/StarfieldBackground';
import NebulaBackground from '@/components/NebulaBackground';
import CustomCursor from '@/components/CustomCursor';

interface Project {
    id: number;
    title: string;
    description: string;
    tech: string[];
    image: string;
    gallery: string[];
    fullDescription: string;
    github?: string;
    demo?: string;
}

export default function AllProjectsPage() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const projects: Project[] = [
        {
            id: 1,
            title: 'Biome — Focus Forest',
            description: 'A world-building productivity desktop app. Complete Pomodoro focus sessions to earn trees, flowers, and rare items — then place them on your personal grid.',
            tech: ['TypeScript', 'React', 'Electron', 'Firebase', 'Vite'],
            image: '',
            gallery: [],
            fullDescription: 'Biome is a gamified productivity desktop app where deep work leaves a tangible, beautiful trace. Complete focus sessions to earn plants with a rarity system (Common → Legendary), then place them wherever you want on your personal world grid. Features territory expansion, real-time global leaderboard, XP levels with progression titles (Forest Ranger → Ancient Guardian), 30+ achievements, streak tracking with freeze mechanic, 5 ambient soundscapes, and cross-device sync via Firebase. Available as an Electron desktop app with a floating mini-widget timer and as a PWA for mobile.',
            github: 'https://github.com/devantaris/Biome',
        },
        {
            id: 2,
            title: 'SkillSync — Peer Skill Economy',
            description: 'A full-stack platform where users share knowledge through courses, earn credits, and spend credits to learn — no money needed, just knowledge.',
            tech: ['React', 'Vite', 'Express', 'Supabase', 'Zustand', 'Razorpay'],
            image: '',
            gallery: [],
            fullDescription: 'SkillSync is a peer-powered skill economy platform. Users earn credits by uploading quality courses (validated by AI scoring 0–100, must score ≥70 to publish) and spend credits to enroll in others\' courses. The platform takes a 15% fee per transaction. Features include a 4-step course upload wizard, personalized dashboard with skill radar charts, full wallet with Razorpay credit purchase (₹49/₹99/₹199), Google OAuth + email auth via Supabase, and a responsive design with frosted glass bottom nav on mobile.',
            github: 'https://github.com/devantaris/SkillSync',
            demo: 'https://skill-sync-steel-rho.vercel.app',
        },
        {
            id: 3,
            title: 'MARI — Risk-Aware Fraud Engine',
            description: 'A multi-axis risk intelligence engine that evaluates financial transactions using behavioral, network, and temporal risk signals.',
            tech: ['Python', 'FastAPI', 'Scikit-learn', 'PostgreSQL', 'Redis', 'Railway'],
            image: '',
            gallery: [],
            fullDescription: 'MARI (Machine-learning Aided Risk Intelligence) is a 2D decision engine that combines ML predictions with uncertainty quantification to produce explainable fraud decisions. Features 12+ risk signals, cost-sensitive thresholding, EDA-driven reasoning, and a real-time decision API with sub-100ms latency. Every decision comes with a human-readable breakdown explaining exactly why a transaction was flagged.',
            github: 'https://github.com/devantaris/mari',
            demo: 'https://mari-alpha.vercel.app',
        },
        {
            id: 4,
            title: 'Flutter OTT Streaming App',
            description: 'A Flutter-based OTT streaming-style application with local auth, content rentals, and a rich cinematic UI.',
            tech: ['Flutter', 'Dart', 'SQLite', 'BLoC'],
            image: '',
            gallery: [],
            fullDescription: 'A cross-platform OTT streaming app built with Flutter as a rapid prototyping exercise. Features local authentication with secure session management, a content catalog with rental and purchase flow, smooth page transitions with cinematic UI patterns, and consistent behavior across iOS, Android, and Web. Built in 48 hours to demonstrate Flutter\'s rapid development capabilities.',
            github: 'https://github.com/devantaris/flutter-ott-app',
        },
        {
            id: 5,
            title: 'Portfolio — This Site',
            description: 'A minimal, high-performance portfolio with swimming avatar, starfield background, bento grid layout, and live GitHub stats.',
            tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
            image: '',
            gallery: [],
            fullDescription: 'This portfolio site features a multi-layer starfield canvas with parallax scrolling, a swimming avatar that reacts to scroll position via Framer Motion\'s animation thread (zero re-renders), a bento grid about section with engineering philosophy, an infinite tech stack marquee, and live GitHub contribution graph integration. Built with zero template dependencies for maximum performance.',
            github: 'https://github.com/devantaris/devansh-portfolio',
        },
    ];

    return (
        <main className="relative min-h-screen">
            <MultiLayerStarfield />
            <NebulaBackground />
            <CustomCursor />
            <Navigation />

            <div className="relative z-10 pt-32 pb-16 px-8 md:px-16">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mb-8 text-foreground-muted hover:text-accent transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>

                    {/* Page Header */}
                    <div className="mb-16">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-foreground">
                            All Projects
                        </h1>
                        <p className="text-xl text-foreground-muted max-w-2xl">
                            A comprehensive showcase of systems, platforms, and tools I've built.
                        </p>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div key={project.id} className="aspect-[4/5]">
                                <Tilt
                                    rotationFactor={6}
                                    isRevese
                                    springOptions={{
                                        stiffness: 26.7,
                                        damping: 4.1,
                                        mass: 0.2,
                                    }}
                                    className="group relative rounded-2xl cursor-pointer h-full"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <Spotlight
                                        className="z-10 from-accent/50 via-accent/20 to-accent/10 blur-2xl"
                                        size={200}
                                        springOptions={{
                                            stiffness: 26.7,
                                            damping: 4.1,
                                            mass: 0.2,
                                        }}
                                    />
                                    <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-background/40 backdrop-blur-sm flex flex-col">
                                        {project.image ? (
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="h-48 w-full object-cover grayscale duration-700 group-hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="h-48 w-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #18181b, #09090b)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span className="text-5xl font-bold" style={{ color: 'rgba(59, 130, 246, 0.2)' }}>{project.title.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold mb-2 text-foreground">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-foreground-muted mb-4 line-clamp-3 flex-1">
                                                {project.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.slice(0, 3).map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Tilt>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-md border border-white/10 rounded-2xl p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-accent/10 hover:bg-accent/20 text-foreground transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                                {selectedProject.title}
                            </h2>

                            {selectedProject.gallery.length > 0 && (
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {selectedProject.gallery.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`${selectedProject.title} ${idx + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}

                            <p className="text-lg text-foreground-muted mb-6 leading-relaxed">
                                {selectedProject.fullDescription}
                            </p>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3 text-foreground">
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.tech.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {selectedProject.github && (
                                    <a
                                        href={selectedProject.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-foreground hover:border-accent/50 transition-colors"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                                        View Code
                                    </a>
                                )}
                                {selectedProject.demo && (
                                    <a
                                        href={selectedProject.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-foreground hover:border-accent/50 transition-colors"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
