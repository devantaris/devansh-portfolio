'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const projects = [
    {
        emoji: '🛡️',
        number: '01',
        name: 'MARI — FRAUD ENGINE',
        description: 'A three-layer real-time fraud filter trained on a highly dimensional 284,000 transaction telemetry database. Optimizes cost-sensitive thresholds to isolate anomalies.',
        features: [
            '5-member calibrated XGBoost bootstrap ensemble model',
            'Isolation Forest anomaly detection pipeline',
            'Sub-100ms real-time REST API inference framework',
        ],
        tech: ['Python', 'FastAPI', 'XGBoost', 'PostgreSQL'],
        demo: 'https://mari-alpha.vercel.app',
        code: 'https://github.com/devantaris/mari',
    },
    {
        emoji: '🎬',
        number: '02',
        name: 'FLUTTER OTT STREAMING APP',
        description: 'Cross-platform native cinematic application featuring localized secure authentication pipelines, asset offline caching, and responsive transition matrices.',
        features: [
            'BLoC-pattern architectural state management flow',
            'SQLite-backed local secure persistence layers',
            'Smooth 60fps rendering transitions and overlays',
        ],
        tech: ['Flutter', 'Dart', 'SQLite', 'BLoC'],
        demo: null,
        code: 'https://github.com/devantaris/flutter-ott-app',
    },
    {
        emoji: '🌿',
        number: '03',
        name: 'BIOME SYSTEM PROGRESSION',
        description: 'A world-building productivity application wrapping Pomodoro focus nodes with real-time progression systems, rarity logic layers, and interactive local leaderboards.',
        features: [
            'Firebase database scaling for real-time account synch',
            'Electron-wrapped desktop wrapper with native hook bindings',
            'Dynamic procedural state logic for progression models',
        ],
        tech: ['React', 'TypeScript', 'Firebase', 'Electron'],
        demo: null,
        code: 'https://github.com/devantaris/Biome',
    },
    {
        emoji: '🔄',
        number: '04',
        name: 'SKILLSYNC PLATFORM',
        description: 'A decentralized peer-to-peer skill economy platform where users transact system credits gained by teaching courses, securing validation through transactional scoring.',
        features: [
            'AI-powered course indexing and scoring logic',
            'End-to-end payment capture using integrated Razorpay API',
            'Strict Supabase RLS (Row Level Security) schemas',
        ],
        tech: ['React', 'Node.js', 'Supabase', 'Razorpay'],
        demo: 'https://skill-sync-steel-rho.vercel.app',
        code: 'https://github.com/devantaris/SkillSync',
    },
];

const ExternalLinkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
        <polyline points="15,3 21,3 21,9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

const GithubIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

function ProjectCard({ project, progress, index }: { project: typeof projects[0]; progress: any; index: number }) {
    const cardY = useTransform(progress, [index * 0.25, (index + 1) * 0.25], [1000, 0]);
    // Shrink and fade underlying cards slightly as new ones lock on top
    const scale = useTransform(progress, [(index + 1) * 0.25, (index + 2) * 0.25], [1, 0.93]);
    const opacity = useTransform(progress, [(index + 1) * 0.25, (index + 2) * 0.25], [1, 0.4]);

    return (
        <motion.div
            style={{
                y: index === 0 ? 0 : cardY,
                scale,
                opacity,
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: index
            }}
        >
            <div 
                className="telemetry-box" 
                style={{ 
                    width: '100%', 
                    maxWidth: '1000px', 
                    background: '#06060c', 
                    padding: 'clamp(24px, 4vw, 48px)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                    gap: '40px',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
                }}
            >
                {/* Asymmetric Technical Detail Column */}
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                    
                    {/* Big Editorial Index Block */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(72px, 8vw, 110px)', fontWeight: 900, lineHeight: 0.8, color: 'var(--accent-purple)' }}>
                            {project.number}
                        </div>
                        <div style={{ fontSize: '48px', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.15))' }}>
                            {project.emoji}
                        </div>
                    </div>

                    <div>
                        <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>PROJECT_TELEMETRY_VAL</span>
                        <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', color: '#fff', fontWeight: 800, margin: '8px 0 12px 0' }}>
                            {project.name}
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.6 }}>
                            {project.description}
                        </p>
                    </div>

                    {/* Tech Stacks */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {project.tech.map((t) => (
                            <span 
                                key={t} 
                                style={{ 
                                    fontFamily: 'var(--font-mono)', 
                                    fontSize: '9px', 
                                    padding: '6px 14px', 
                                    background: 'rgba(255,255,255,0.02)', 
                                    border: '1px solid rgba(255,255,255,0.08)', 
                                    color: '#fff' 
                                }}
                            >
                                {t.toUpperCase()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Asymmetric blueprint description column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: 'clamp(0px, 3vw, 32px)' }}>
                    <div>
                        <span className="mono-tag" style={{ color: 'var(--accent-orange)' }}>BLUEPRINT_SPECIFICATIONS</span>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {project.features.map((feat, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
                                    <span style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }}>&gt;</span>
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Operational CTA anchors */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                        {project.demo && (
                            <a 
                                href={project.demo} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="glow-btn"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', color: '#000', border: 'none' }}
                            >
                                <ExternalLinkIcon />
                                LIVE_DEMO
                            </a>
                        )}
                        <a 
                            href={project.code} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="glow-btn"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                            <GithubIcon />
                            VIEW_CODE
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Projects() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef
    });

    return (
        <section id="projects" ref={targetRef} style={{ height: '320vh', position: 'relative', overflow: 'visible' }}>
            {/* Sticky portal viewport */}
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 clamp(24px, 5vw, 96px)',
                overflow: 'hidden'
            }}>
                
                {/* Horizontal telemetry bars */}
                <div style={{ 
                    position: 'absolute', top: '10%', left: '4%', right: '4%', height: '1px', 
                    background: 'linear-gradient(to right, rgba(255,255,255,0.06), rgba(0, 245, 255, 0.1), transparent)', 
                    pointerEvents: 'none' 
                }} />

                {/* Section Header inside sticky view */}
                <div style={{ 
                    width: '100%', 
                    maxWidth: '1000px', 
                    margin: '0 auto 40px auto', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-end',
                    zIndex: 10
                }}>
                    <div>
                        <span className="mono-tag" style={{ color: 'var(--accent-purple)' }}>04 // ARCHIVE LOCKER</span>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginTop: '4px', color: '#fff' }}>
                            Featured Systems.
                        </h2>
                    </div>
                    <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>
                        SCROLL_DOWN_TO_EXPLORE_DECK
                    </span>
                </div>

                {/* Core overlapping absolute drawer viewport */}
                <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '520px', 
                    maxWidth: '1000px', 
                    margin: '0 auto' 
                }}>
                    {projects.map((project, idx) => (
                        <ProjectCard 
                            key={project.name} 
                            project={project} 
                            progress={scrollYProgress} 
                            index={idx} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
