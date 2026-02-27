'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const techStack = [
    // — Languages —
    { name: 'Python', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'TypeScript', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'JavaScript', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'C++', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'C', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'Java', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'Dart', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
    { name: 'SQL', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg' },
    // — Frameworks & Libraries —
    { name: 'FastAPI', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
    { name: 'Next.js', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'React', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Node.js', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Flutter', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'Tailwind CSS', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    // — Databases —
    { name: 'PostgreSQL', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Redis', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
    { name: 'SQLite', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
    // — ML & Data Science —
    { name: 'Scikit-learn', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg' },
    { name: 'Pandas', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
    { name: 'NumPy', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
    { name: 'Matplotlib', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg' },
    // — DevOps & Deployment —
    { name: 'Docker', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Git', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub Actions', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg' },
    { name: 'Linux', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
    { name: 'REST APIs', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openapi/openapi-original.svg' },
    { name: 'Railway', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/railway/railway-original.svg' },
    { name: 'Vercel', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
];

const half = Math.ceil(techStack.length / 2);
const row1 = [...techStack.slice(0, half), ...techStack.slice(0, half)];
const row2 = [...techStack.slice(half), ...techStack.slice(half)];

export default function TechStack() {
    return (
        <section id="stack" style={{ padding: '80px 0', overflow: 'hidden' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)', marginBottom: '48px' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#fff' }}
                >
                    Tech Stack
                </motion.h2>
            </div>

            {/* Marquee container */}
            <div style={{ position: 'relative' }}>
                {/* Left fade */}
                <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 10, pointerEvents: 'none',
                    background: 'linear-gradient(to right, #07060d, transparent)',
                }} />
                {/* Right fade */}
                <div style={{
                    position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 10, pointerEvents: 'none',
                    background: 'linear-gradient(to left, #07060d, transparent)',
                }} />

                {/* Row 1 — left scroll */}
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
                            <Image
                                src={tech.logoUrl}
                                alt={tech.name}
                                width={32}
                                height={32}
                                unoptimized
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    objectFit: 'contain',
                                    filter: 'brightness(0.95)',
                                }}
                            />
                            <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Row 2 — right scroll (reverse) */}
                <div className="marquee-reverse" style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    {row2.map((tech, i) => (
                        <div
                            key={`${tech.name}-rev-${i}`}
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
                            <Image
                                src={tech.logoUrl}
                                alt={tech.name}
                                width={32}
                                height={32}
                                unoptimized
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    objectFit: 'contain',
                                    filter: 'brightness(0.95)',
                                }}
                            />
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
