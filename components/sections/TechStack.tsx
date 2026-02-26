'use client';

import { motion } from 'framer-motion';

const techStack = [
    { name: 'Python', icon: '🐍' },
    { name: 'FastAPI', icon: '⚡' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'Redis', icon: '🔴' },
    { name: 'Docker', icon: '🐳' },
    { name: 'Next.js', icon: '▲' },
    { name: 'TypeScript', icon: '🔷' },
    { name: 'React', icon: '⚛️' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'Git', icon: '🌿' },
    { name: 'Flutter', icon: '💙' },
    { name: 'Dart', icon: '🎯' },
    { name: 'Scikit-learn', icon: '🤖' },
    { name: 'Pandas', icon: '🐼' },
    { name: 'Railway', icon: '🚂' },
    { name: 'Vercel', icon: '▲' },
    { name: 'C++', icon: '⚙️' },
    { name: 'SQLite', icon: '🗃️' },
    { name: 'REST APIs', icon: '🔗' },
    { name: 'Linux', icon: '🐧' },
];

const row1 = [...techStack, ...techStack];

export default function TechStack() {
    return (
        <section id="stack" style={{ padding: '80px 0', overflow: 'hidden' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px', marginBottom: '48px' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#fff' }}
                >
                    Technology Stack
                </motion.h2>
            </div>

            {/* Marquee container */}
            <div style={{ position: 'relative' }}>
                {/* Left fade */}
                <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 10, pointerEvents: 'none',
                    background: 'linear-gradient(to right, #09090b, transparent)',
                }} />
                {/* Right fade */}
                <div style={{
                    position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 10, pointerEvents: 'none',
                    background: 'linear-gradient(to left, #09090b, transparent)',
                }} />

                <div className="marquee" style={{ display: 'flex', gap: '16px' }}>
                    {row1.map((tech, i) => (
                        <div
                            key={`${tech.name}-${i}`}
                            className="zinc-card"
                            style={{
                                flexShrink: 0,
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '10px',
                                width: '110px',
                            }}
                        >
                            <span style={{ fontSize: '28px' }}>{tech.icon}</span>
                            <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
