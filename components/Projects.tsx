'use client';

import { motion } from 'framer-motion';

const projects = [
    {
        emoji: '🛡️',
        name: 'Risk-Aware Fraud Decision System',
        description:
            'A multi-axis risk intelligence engine that evaluates financial transactions using behavioral, network, and temporal risk signals to produce explainable fraud decisions.',
        features: [
            'Multi-layered risk scoring with 12+ risk signals',
            'Explainable AI — every decision has a breakdown',
            'Real-time decision API with sub-100ms latency',
            'Adaptive rules engine with manual override support',
        ],
        tech: ['Python', 'FastAPI', 'Scikit-learn', 'PostgreSQL', 'Redis', 'Railway'],
        demo: 'https://mari-alpha.vercel.app',
        code: 'https://github.com/devantaris/mari',
    },
    {
        emoji: '🎬',
        name: 'Flutter OTT Streaming App',
        description:
            'A Flutter-based OTT streaming-style application with local authentication, content rentals, and a rich cinematic UI.',
        features: [
            'Local auth with secure session management',
            'Content catalog with rental & purchase flow',
            'Rich cinematic UI with smooth page transitions',
            'Cross-platform: iOS, Android & Web',
        ],
        tech: ['Flutter', 'Dart', 'SQLite', 'BLoC'],
        demo: null,
        code: 'https://github.com/devantaris/flutter-ott-app',
    },
    {
        emoji: '🌐',
        name: 'Portfolio — This Site',
        description:
            'A clean, minimal, and high-performance portfolio website with particle animations, bento grid layout, and GitHub stats integration.',
        features: [
            'Particle canvas background in hero section',
            'Bento grid about section',
            'Tech stack infinite marquee',
            'GitHub stats integration',
        ],
        tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        demo: null,
        code: 'https://github.com/devantaris/devansh-portfolio',
    },
];

const ProjectPlaceholder = ({ name }: { name: string }) => (
    <div
        style={{
            width: '100%', height: '100%', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #18181b, #09090b)',
            border: '1px solid #27272a',
        }}
    >
        <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🖥️</div>
            <p style={{ fontSize: '12px', color: '#52525b' }}>{name}</p>
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
    return (
        <section id="projects" style={{ padding: '120px 0' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px' }}>
                {/* Section heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#fff', marginBottom: '64px' }}
                >
                    Latest Projects
                </motion.h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '96px' }}>
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                                gap: '40px',
                                alignItems: 'center',
                            }}
                        >
                            {/* Image side */}
                            <div
                                style={{
                                    height: '320px',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: '0 0 40px rgba(59, 130, 246, 0.12), 0 0 80px rgba(59, 130, 246, 0.04)',
                                    border: '1px solid rgba(59, 130, 246, 0.15)',
                                    order: idx % 2 === 1 ? 2 : 1,
                                }}
                            >
                                <ProjectPlaceholder name={project.name} />
                            </div>

                            {/* Info side */}
                            <div style={{ order: idx % 2 === 1 ? 1 : 2 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '24px' }}>{project.emoji}</span>
                                    <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>{project.name}</h3>
                                </div>

                                <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.7, marginBottom: '20px' }}>
                                    {project.description}
                                </p>

                                {/* Features */}
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {project.features.map((f) => (
                                        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#a1a1aa' }}>
                                            <span style={{ fontSize: '14px', flexShrink: 0, lineHeight: '1.4' }}>✨</span>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Tech pills */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                                    {project.tech.map((t) => (
                                        <span
                                            key={t}
                                            style={{
                                                fontSize: '12px',
                                                padding: '6px 14px',
                                                border: '1px solid #3f3f46',
                                                borderRadius: '6px',
                                                color: '#d4d4d8',
                                                background: '#18181b',
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {project.demo && (
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '8px 16px',
                                                border: '1px solid #52525b',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                color: '#fff',
                                                textDecoration: 'none',
                                                transition: 'border-color 0.2s',
                                            }}
                                        >
                                            <ExternalLinkIcon />
                                            Live Demo
                                        </a>
                                    )}
                                    {project.code && (
                                        <a
                                            href={project.code}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '8px 16px',
                                                border: '1px solid #52525b',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                color: '#fff',
                                                textDecoration: 'none',
                                                transition: 'border-color 0.2s',
                                            }}
                                        >
                                            <GithubIcon />
                                            View Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
