'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ExternalLink, Github, LayoutGrid, Table, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MultiLayerStarfield from '@/components/StarfieldBackground';
import { projects as projectData, type Project } from '@/lib/content';
import ProjectHudPreview from '@/components/ui/ProjectHudPreview';

export default function AllProjectsPage() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'showcase' | 'ledger'>('showcase');

    // Filter projects
    const filteredProjects = useMemo(() => {
        return projectData.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'FEATURED') return p.featured;
            if (activeFilter === 'AI & ML') {
                return (
                    p.tech.some((t) => ['Python', 'FastAPI', 'XGBoost', 'SVM', 'Machine Learning', 'AI', 'pgvector'].includes(t)) ||
                    p.id === 'mari' || p.id === 'edusupervision'
                );
            }
            if (activeFilter === 'CRYPTO') {
                return (
                    p.tech.some((t) => ['AES-256-GCM', 'RSA-OAEP', 'HMAC-SHA-256', 'DICOM'].includes(t)) ||
                    p.id === 'cryptoflow'
                );
            }
            if (activeFilter === 'MOBILE & GIS') {
                return (
                    p.tech.some((t) => ['Flutter', 'PostGIS', 'Dart', 'OpenCV', 'BLoC'].includes(t)) ||
                    p.id === 'satyalabel' || p.id === 'raahi'
                );
            }
            return true;
        });
    }, [activeFilter, searchQuery]);

    const filterTabs = [
        { id: 'ALL', label: `ALL SYSTEMS (${projectData.length})` },
        { id: 'FEATURED', label: 'FLAGSHIP ARCHITECTURE (4)' },
        { id: 'AI & ML', label: 'AI & ML' },
        { id: 'CRYPTO', label: 'CRYPTOGRAPHY' },
        { id: 'MOBILE & GIS', label: 'MOBILE & GIS' },
    ];

    // Split featured vs other for the showcase view
    const featuredList = useMemo(() => filteredProjects.filter((p) => p.featured), [filteredProjects]);
    const secondaryList = useMemo(() => filteredProjects.filter((p) => !p.featured), [filteredProjects]);

    return (
        <main className="relative min-h-screen bg-[#020204] text-foreground overflow-x-hidden">
            <MultiLayerStarfield />
            <Navigation />

            <div className="relative z-10 pt-32 pb-24 px-6 sm:px-10 lg:px-16 w-full max-w-[1560px] mx-auto">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 mb-8 text-[11px] font-mono tracking-widest text-foreground-muted hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>← BASE PORTFOLIO</span>
                </Link>

                {/* Editorial Page Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 border-b border-white/5 pb-10">
                    <div>
                        <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>
                            04 // ARCHIVE — COMPLETE SYSTEM REPOSITORY
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mt-3 mb-4 text-white font-serif">
                            Systems &amp; Architecture Archive.
                        </h1>
                        <p className="text-base sm:text-lg text-foreground-muted max-w-3xl font-light leading-relaxed">
                            A curated repository of production platforms, distributed machine learning pipelines, medical cryptographic systems, and geospatial engines built by Devansh Kumar.
                        </p>
                    </div>

                    {/* View Switcher: Showcase vs Ledger */}
                    <div className="flex items-center gap-1.5 p-1 rounded-md border border-white/10 bg-white/[0.02]">
                        <button
                            onClick={() => setViewMode('showcase')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded text-[10.5px] font-mono tracking-wider transition-all"
                            style={{
                                background: viewMode === 'showcase' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: viewMode === 'showcase' ? '#ffffff' : 'rgba(255,255,255,0.45)',
                            }}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>SHOWCASE</span>
                        </button>
                        <button
                            onClick={() => setViewMode('ledger')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded text-[10.5px] font-mono tracking-wider transition-all"
                            style={{
                                background: viewMode === 'ledger' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: viewMode === 'ledger' ? '#ffffff' : 'rgba(255,255,255,0.45)',
                            }}
                        >
                            <Table className="w-3.5 h-3.5" />
                            <span>LEDGER</span>
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-12">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveFilter(tab.id)}
                                className="px-3.5 py-1.5 text-[10px] font-mono tracking-wider transition-all rounded"
                                style={{
                                    border: activeFilter === tab.id
                                        ? '1px solid var(--accent-cyan)'
                                        : '1px solid rgba(255, 255, 255, 0.08)',
                                    color: activeFilter === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                                    background: activeFilter === tab.id
                                        ? 'rgba(0, 229, 255, 0.12)'
                                        : 'rgba(255, 255, 255, 0.02)',
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Quick Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
                        <input
                            type="text"
                            placeholder="Filter systems or tech…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                    </div>
                </div>

                {/* ── VIEW MODE 1: SHOWCASE GRID ────────────────────────────────────────── */}
                {viewMode === 'showcase' ? (
                    <div>
                        {/* 1. Flagship Systems (Spacious 2-Column Grid) */}
                        {featuredList.length > 0 && (
                            <div className="mb-16">
                                <div className="flex items-center gap-3 mb-8">
                                    <Sparkles className="w-4 h-4 text-cyan-400" />
                                    <h2 className="font-mono text-xs tracking-widest text-white/70 uppercase">
                                        Flagship Engineering Architecture
                                    </h2>
                                    <div className="flex-1 h-[1px] bg-white/10" />
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    {featuredList.map((project) => (
                                        <div
                                            key={project.id}
                                            className="group rounded-lg border border-white/10 bg-[#06060e]/90 backdrop-blur-md overflow-hidden flex flex-col hover:border-white/30 transition-all duration-300"
                                            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
                                        >
                                            {/* Large Crisp 16:9 Interactive HUD Preview */}
                                            <div className="w-full aspect-[38/22] relative overflow-hidden bg-[#030307] border-b border-white/10 pointer-events-none">
                                                <ProjectHudPreview project={project} />
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                                                    style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }}
                                                />
                                            </div>

                                            {/* Card Content Body */}
                                            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span
                                                            className="inline-block font-mono text-[9px] tracking-wider px-2.5 py-1 rounded"
                                                            style={{
                                                                color: project.color,
                                                                border: `1px solid ${project.color}45`,
                                                                background: `${project.color}12`,
                                                            }}
                                                        >
                                                            {project.impact}
                                                        </span>
                                                        <span className="font-mono text-[10px] text-white/30">
                                                            PROD.RELEASE
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl sm:text-3xl font-serif font-light text-white mb-3">
                                                        {project.name}
                                                    </h3>

                                                    <p className="text-sm text-foreground-muted font-light leading-relaxed mb-6">
                                                        {project.tagline}
                                                    </p>

                                                    {/* Key Specs bullets */}
                                                    <div className="flex flex-col gap-2 mb-6 border-l border-white/10 pl-3">
                                                        {project.specs.slice(0, 2).map((spec, si) => (
                                                            <p key={si} className="text-xs text-white/70 font-light leading-relaxed line-clamp-2">
                                                                — {spec}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    {/* Tech Stack Pills */}
                                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                                        {project.tech.map((t, ti) => (
                                                            <span
                                                                key={ti}
                                                                className="px-2.5 py-0.5 rounded font-mono text-[9px] border border-white/10 text-white/60 bg-white/[0.02]"
                                                            >
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Action Buttons Row */}
                                                    <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                                                        <button
                                                            onClick={() => setSelectedProject(project)}
                                                            className="flex-1 py-2.5 px-4 text-center text-[10px] font-mono tracking-widest text-white border border-white/20 rounded hover:border-white hover:bg-white/5 transition-all uppercase"
                                                        >
                                                            INSPECT DOSSIER →
                                                        </button>

                                                        {project.demo && (
                                                            <a
                                                                href={project.demo}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="py-2.5 px-4 rounded border border-white/15 hover:border-cyan-400 text-white/75 hover:text-cyan-400 text-[10px] font-mono tracking-wider transition-all inline-flex items-center gap-1.5"
                                                            >
                                                                <span>DEMO</span>
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}

                                                        {project.code && (
                                                            <a
                                                                href={project.code}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="py-2.5 px-4 rounded border border-white/15 hover:border-white text-white/75 hover:text-white text-[10px] font-mono tracking-wider transition-all inline-flex items-center gap-1.5"
                                                            >
                                                                <span>CODE</span>
                                                                <Github className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Production Systems (Balanced 3-Column Grid) */}
                        {secondaryList.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <h2 className="font-mono text-xs tracking-widest text-white/50 uppercase">
                                        Production Systems &amp; Distributed Apps
                                    </h2>
                                    <div className="flex-1 h-[1px] bg-white/10" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {secondaryList.map((project) => (
                                        <div
                                            key={project.id}
                                            className="group rounded-lg border border-white/10 bg-[#06060c]/80 backdrop-blur-md overflow-hidden flex flex-col hover:border-white/25 transition-all duration-300"
                                            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                                        >
                                            {/* Architectural Top Banner */}
                                            <div
                                                className="p-6 relative overflow-hidden border-b border-white/5"
                                                style={{
                                                    background: `radial-gradient(circle at 90% 10%, ${project.color}15, transparent 65%), #040409`,
                                                }}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <span
                                                        className="font-mono text-[8.5px] tracking-wider px-2 py-0.5 rounded"
                                                        style={{
                                                            color: project.color,
                                                            border: `1px solid ${project.color}35`,
                                                            background: `${project.color}0a`,
                                                        }}
                                                    >
                                                        {project.impact}
                                                    </span>
                                                    <span className="font-mono text-[9px] text-white/30 uppercase">
                                                        {project.id}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-serif font-light text-white mb-2">
                                                    {project.name}
                                                </h3>
                                                <p className="text-xs text-foreground-muted font-light leading-relaxed line-clamp-2">
                                                    {project.tagline}
                                                </p>
                                            </div>

                                            {/* Body */}
                                            <div className="p-6 flex-1 flex flex-col justify-between">
                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                    {project.tech.map((t, ti) => (
                                                        <span
                                                            key={ti}
                                                            className="px-2 py-0.5 rounded font-mono text-[8.5px] border border-white/10 text-white/55 bg-white/[0.02]"
                                                        >
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                                    <button
                                                        onClick={() => setSelectedProject(project)}
                                                        className="flex-1 py-2 text-center text-[9px] font-mono tracking-wider text-white border border-white/15 rounded hover:border-white hover:bg-white/5 transition-all uppercase"
                                                    >
                                                        INSPECT DOSSIER
                                                    </button>
                                                    {project.demo && (
                                                        <a
                                                            href={project.demo}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 border border-white/15 rounded hover:border-cyan-400 text-white/70 hover:text-cyan-400 transition-all"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                    {project.code && (
                                                        <a
                                                            href={project.code}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 border border-white/15 rounded hover:border-white text-white/70 hover:text-white transition-all"
                                                        >
                                                            <Github className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ── VIEW MODE 2: SYSTEMS LEDGER (TECHNICAL SPECIFICATION TABLE) ────── */
                    <div className="border border-white/10 rounded-lg overflow-x-auto bg-[#06060c]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-mono text-white/40 tracking-widest uppercase">
                                    <th className="py-4 px-6">System ID</th>
                                    <th className="py-4 px-6">Architecture &amp; Name</th>
                                    <th className="py-4 px-6">Key Engineering Impact</th>
                                    <th className="py-4 px-6">Core Tech Stack</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((project, idx) => (
                                    <tr
                                        key={project.id}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="py-4 px-6 font-mono text-xs" style={{ color: project.color }}>
                                            0{idx + 1} // {project.id.toUpperCase()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-serif text-base text-white">{project.name}</div>
                                            <div className="text-xs text-white/40 font-light mt-0.5 line-clamp-1">{project.tagline}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span
                                                className="inline-block font-mono text-[9px] px-2 py-0.5 rounded"
                                                style={{
                                                    color: project.color,
                                                    border: `1px solid ${project.color}35`,
                                                    background: `${project.color}0a`,
                                                }}
                                            >
                                                {project.impact}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-1">
                                                {project.tech.slice(0, 3).map((t, ti) => (
                                                    <span key={ti} className="font-mono text-[9px] text-white/60 bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                                                        {t}
                                                    </span>
                                                ))}
                                                {project.tech.length > 3 && (
                                                    <span className="font-mono text-[9px] text-white/30">+{project.tech.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedProject(project)}
                                                    className="px-3 py-1 text-[9px] font-mono border border-white/20 text-white rounded hover:border-white transition-all uppercase"
                                                >
                                                    DOSSIER
                                                </button>
                                                {project.demo && (
                                                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-1 text-white/50 hover:text-cyan-400">
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                                {project.code && (
                                                    <a href={project.code} target="_blank" rel="noopener noreferrer" className="p-1 text-white/50 hover:text-white">
                                                        <Github className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredProjects.length === 0 && (
                    <div className="text-center py-24 border border-white/5 rounded-lg">
                        <p className="text-foreground-muted font-mono text-xs">
                            NO ARCHITECTURE FOUND MATCHING &ldquo;{searchQuery}&rdquo;
                        </p>
                    </div>
                )}
            </div>

            {/* Technical Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="relative max-w-3xl w-full max-h-[88vh] overflow-y-auto custom-scrollbar bg-[#06060c] border border-white/20 rounded-lg p-6 sm:p-10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-6 right-6 p-2 rounded border border-white/10 hover:border-white text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Modal Header */}
                            <div className="mb-6">
                                <span className="mono-tag" style={{ color: selectedProject.color }}>
                                    SYSTEM DOSSIER // {selectedProject.impact}
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-serif font-light text-white mt-2">
                                    {selectedProject.name}
                                </h2>
                                <p className="text-sm text-foreground-muted font-light mt-2 leading-relaxed">
                                    {selectedProject.tagline}
                                </p>
                            </div>

                            {/* Visual Architecture Preview */}
                            <div className="w-full aspect-[38/22] relative overflow-hidden rounded border border-white/15 bg-[#030307] mb-6 shadow-lg pointer-events-none">
                                <ProjectHudPreview project={selectedProject} />
                            </div>

                            {/* Technical Specs Breakdown */}
                            <div className="border-t border-white/10 pt-6 mb-8">
                                <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-4">
                                    Architectural Specifications
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {selectedProject.specs.map((spec, i) => (
                                        <div key={i} className="flex gap-4 items-baseline">
                                            <span className="font-mono text-xs text-white/40 flex-shrink-0">
                                                {String(i + 1).padStart(2, '0')}.
                                            </span>
                                            <p className="text-sm text-white/80 font-light leading-relaxed">
                                                {spec}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="border-t border-white/10 pt-6 mb-8">
                                <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-3">
                                    Engineering Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.tech.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded border border-white/10 font-mono text-[10px] text-white/70 bg-white/[0.02]"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action Links */}
                            <div className="flex gap-4 pt-6 border-t border-white/10">
                                {selectedProject.demo && (
                                    <a
                                        href={selectedProject.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="glow-btn flex-1 text-center"
                                        style={{
                                            borderColor: selectedProject.color,
                                            color: selectedProject.color,
                                        }}
                                    >
                                        LAUNCH LIVE DEMO ↗
                                    </a>
                                )}
                                {selectedProject.code && (
                                    <a
                                        href={selectedProject.code}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="glow-btn flex-1 text-center"
                                    >
                                        VIEW SOURCE CODE ↗
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
