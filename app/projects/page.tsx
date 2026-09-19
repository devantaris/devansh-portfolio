'use client';

import { useState } from 'react';
import { Tilt } from '@/components/ui/tilt';
import { Spotlight } from '@/components/ui/spotlight';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MultiLayerStarfield from '@/components/StarfieldBackground';
import CustomCursor from '@/components/CustomCursor';
import { projects as projectData } from '@/lib/content';

interface Project {
    id: number;
    title: string;
    description: string;
    tech: string[];
    fullDescription: string;
    github?: string;
    demo?: string;
}

export default function AllProjectsPage() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Single source of truth: data/projects.json
    const projects: Project[] = projectData.map((p, i) => ({
        id: i + 1,
        title: p.name,
        description: p.tagline,
        tech: p.tech,
        fullDescription: p.specs.join(' '),
        github: p.code,
        demo: p.demo ?? undefined,
    }));


    return (
        <main className="relative min-h-screen">
            <MultiLayerStarfield />
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
                            A comprehensive showcase of systems, platforms, and tools I&rsquo;ve built.
                        </p>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div key={project.id}>
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
                                        <div className="h-48 w-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #18181b, #09090b)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span className="text-5xl font-bold" style={{ color: 'rgba(59, 130, 246, 0.2)' }}>{project.title.charAt(0)}</span>
                                        </div>
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
