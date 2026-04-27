'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

const projects = [
    {
        emoji: '🛡️',
        name: 'MARI — Risk-Aware Fraud Decision System',
        description:
            'A 3-layer fraud detection and decision system (risk assessment · predictive uncertainty · novelty detection) trained on 284,807 real-world transactions across 31 PCA-transformed dimensions with a 0.17% fraud class imbalance.',
        features: [
            '5-member calibrated XGBoost bootstrap ensemble paired with Isolation Forest anomaly detection',
            'Cost-optimised routing policy with asymmetric loss functions and consequence-weighted thresholding',
            'Real-time inference REST API achieving sub-100ms latency per transaction under production load',
        ],
        tech: ['Python', 'FastAPI', 'XGBoost', 'PostgreSQL'],
        demo: 'https://mari-alpha.vercel.app',
        code: 'https://github.com/devantaris/mari',
    },
    {
        emoji: '🎬',
        name: 'Flutter OTT Streaming Application',
        description:
            'A cross-platform OTT streaming application (iOS, Android, Web) with local authentication, content catalog, rental and purchase flow, and cinematic UI using Flutter and Dart.',
        features: [
            'Implemented BLoC-pattern state management and secure session handling',
            'SQLite-backed local persistence for offline data access',
            'Optimised page transitions for smooth cross-platform user experience',
        ],
        tech: ['Flutter', 'Dart', 'SQLite', 'BLoC'],
        demo: null,
        code: 'https://github.com/devantaris/flutter-ott-app',
    },
    {
        emoji: '🌿',
        name: 'Biome PWA',
        description:
            'A cross-platform world-building productivity application (PWA & Desktop) featuring a focus timer, daily planner, and real-time interactive leaderboards.',
        features: [
            'Scalable backend using Firebase for cross-device synchronization and Google Authentication',
            'Global progression tracking and real-time competitive leaderboards',
            'Electron desktop build with native window controls',
        ],
        tech: ['React', 'TypeScript', 'Firebase', 'Electron'],
        demo: null,
        code: 'https://github.com/devantaris/Biome',
    },
    {
        emoji: '🔄',
        name: 'SkillSync Platform',
        description:
            'A full-stack peer-to-peer skill economy platform where users earn credits by teaching and spend them to enroll in courses.',
        features: [
            'AI-powered content validator to automatically score uploaded courses and maintain platform quality',
            'End-to-end payment flow integration using Razorpay',
            'Scalable relational data management with Supabase PostgreSQL and RLS',
        ],
        tech: ['React', 'Node.js', 'Supabase', 'Razorpay'],
        demo: 'https://skill-sync-steel-rho.vercel.app',
        code: 'https://github.com/devantaris/SkillSync',
    },
    {
        emoji: '🧠',
        name: 'Nexus — RAG Knowledge Engine',
        description:
            'A Retrieval-Augmented Generation (RAG) system that connects to Notion and local markdown files, semantic-searching through personal knowledge graphs to answer complex queries.',
        features: [
            'Vector embeddings stored in Pinecone for ultra-fast cosine similarity search',
            'Context-aware LLM generation using LangChain and OpenAI gpt-4o-mini',
            'Sleek conversational UI built with Next.js and Tailwind CSS',
        ],
        tech: ['TypeScript', 'LangChain', 'Pinecone', 'Next.js'],
        demo: null,
        code: 'https://github.com/devantaris/nexus',
    },
    {
        emoji: '📊',
        name: 'Aura — E-Commerce Analytics Dashboard',
        description:
            'A high-performance analytics dashboard designed for e-commerce vendors to track realtime sales velocity, inventory depletion rates, and geographic customer hotspots.',
        features: [
            'Real-time WebSocket data ingestion handling 1000+ events/sec',
            'Interactive geospatial mapping using Mapbox GL JS',
            'Cached Redis layer for instant aggregated metrics loading',
        ],
        tech: ['React', 'Node.js', 'Redis', 'Mapbox'],
        demo: null,
        code: 'https://github.com/devantaris/aura',
    },
];

const ProjectPlaceholder = ({ name, emoji }: { name: string; emoji: string }) => (
    <div
        style={{
            width: '100%', height: '100%', borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.8))',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)',
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px', height: '200px',
            background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)',
            opacity: 0.1,
            filter: 'blur(30px)',
            pointerEvents: 'none'
        }} />
        
        <div style={{ textAlign: 'center', padding: '24px', zIndex: 1 }}>
            <div style={{ fontSize: '80px', marginBottom: '24px', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.2))' }}>{emoji}</div>
            <p className="text-gradient" style={{ fontSize: '16px', fontWeight: 800 }}>{name.split('—')[0]}</p>
        </div>
    </div>
);

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

export default function Projects() {
    const targetRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [carouselWidth, setCarouselWidth] = useState(0);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Measure the exact scrollable width on mount and resize
    useEffect(() => {
        const updateWidth = () => {
            if (carouselRef.current) {
                const scrollWidth = carouselRef.current.scrollWidth;
                const clientWidth = window.innerWidth;
                setCarouselWidth(scrollWidth - clientWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Smooth physics-based spring for the scroll to avoid jank
    const smoothProgress = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 });
    const x = useTransform(smoothProgress, [0, 1], [0, -carouselWidth]);

    return (
        <section id="projects" ref={targetRef} style={{ height: '400vh', position: 'relative', background: 'transparent' }}>
            <div style={{ 
                position: 'sticky', 
                top: 0, 
                height: '100vh', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                paddingTop: '100px' // Clears the navbar
            }}>
                
                {/* Background Artistic Elements */}
                <div style={{
                    position: 'absolute', top: '10%', right: '10%', width: '40vw', height: '40vw',
                    background: 'radial-gradient(circle, var(--accent-purple) 0%, transparent 60%)',
                    opacity: 0.05, filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
                }} />

                {/* Top Section: Fixed Title Area */}
                <div style={{ 
                    flexShrink: 0, // Prevents title from being squished
                    width: '100%',
                    paddingLeft: 'clamp(24px, 5vw, 48px)',
                    marginBottom: '4vh',
                    zIndex: 10,
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            Featured <br/><span className="text-gradient">Projects</span>
                        </h2>
                        <p className="text-gradient-subtle" style={{ fontSize: '15px', marginTop: '16px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Scroll to explore →
                        </p>
                    </motion.div>
                </div>

                {/* Bottom Section: Horizontal Scroll Container */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                    <motion.div 
                        ref={carouselRef}
                        style={{ x, display: 'flex', gap: '4vw', paddingLeft: 'clamp(24px, 5vw, 48px)', paddingRight: 'clamp(24px, 5vw, 48px)', alignItems: 'center', zIndex: 5 }}
                        className="projects-slider"
                    >
                        {projects.map((project, idx) => (
                            <div 
                                key={project.name}
                                style={{ 
                                    width: 'min(90vw, 850px)', 
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}
                            >
                                {/* Artistic Background Number */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-40px',
                                    right: '20px',
                                    fontSize: '200px',
                                    fontWeight: 900,
                                    color: 'rgba(255,255,255,0.02)',
                                    zIndex: 0,
                                    userSelect: 'none',
                                    pointerEvents: 'none',
                                    lineHeight: 1
                                }}>
                                    0{idx + 1}
                                </div>

                                <div 
                                    className="premium-card glass"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                                        gap: '30px',
                                        alignItems: 'center',
                                        padding: 'clamp(20px, 4vw, 40px)',
                                        width: '100%',
                                        maxHeight: '70vh', // Prevent cards from getting too tall and causing cutoffs
                                        overflowY: 'auto', // Scroll inside card if content is too long on small screens
                                        zIndex: 1
                                    }}
                                >
                                    {/* Image side */}
                                    <div style={{ height: 'min(300px, 30vh)', position: 'relative' }}>
                                        <ProjectPlaceholder name={project.name} emoji={project.emoji} />
                                    </div>

                                    {/* Info side */}
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', marginBottom: '16px' }}>{project.name}</h3>
                                        
                                        <p className="text-gradient-subtle" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                                            {project.description}
                                        </p>

                                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {project.features.map((f) => (
                                                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#8b8b99', lineHeight: '1.5' }}>
                                                    <span style={{ color: 'var(--accent-cyan)', marginTop: '2px' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                        </svg>
                                                    </span>
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                                            {project.tech.map((t) => (
                                                <span
                                                    key={t}
                                                    style={{
                                                        fontSize: '11px',
                                                        padding: '4px 12px',
                                                        background: 'rgba(255,255,255,0.03)',
                                                        border: '1px solid rgba(255,255,255,0.08)',
                                                        borderRadius: '20px',
                                                        color: '#d4d4d8',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>

                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {project.demo && (
                                                <motion.a
                                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}
                                                    whileTap={{ scale: 0.95 }}
                                                    href={project.demo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '6px',
                                                        padding: '10px 20px',
                                                        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                                                        borderRadius: '10px',
                                                        fontSize: '13px',
                                                        fontWeight: 700,
                                                        color: '#000',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <ExternalLinkIcon />
                                                    Live Demo
                                                </motion.a>
                                            )}
                                            {project.code && (
                                                <motion.a
                                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                                    whileTap={{ scale: 0.95 }}
                                                    href={project.code}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '6px',
                                                        padding: '10px 20px',
                                                        borderRadius: '10px',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        fontSize: '13px',
                                                        fontWeight: 600,
                                                        color: '#fff',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <GithubIcon />
                                                    View Code
                                                </motion.a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
