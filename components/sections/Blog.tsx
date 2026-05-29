'use client';

import { motion } from 'framer-motion';

const blogPosts = [
    {
        number: '01',
        title: 'Designing Biome: Gamification loops.',
        description: 'How I mapped Pomodoro focus sessions into procedural world-building territory expansions and leaderboard models — and why modern tools fail at gamified engagement.',
        date: 'COMING_SOON',
    },
    {
        number: '02',
        title: 'Building a P2P credit economy with SkillSync.',
        description: 'Credit transaction scaling, validation node checks, and structural constraints when architecture transforms peer knowledge directly into currency.',
        date: 'COMING_SOON',
    },
    {
        number: '03',
        title: 'INTJ Systems: Architectural limits.',
        description: 'How personality types dictate system bounds — and why I prioritize rigorous design constraints over rapid procedural programming iterations.',
        date: 'COMING_SOON',
    },
];

export default function Blog() {
    return (
        <section id="blog" style={{ padding: 'clamp(100px, 15vw, 200px) 0', background: '#020204', position: 'relative' }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
                
                {/* Section Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '80px', alignItems: 'flex-end' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>06 // TECHNICAL ESSAYS</span>
                        <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 200, marginTop: '8px', color: '#fff', letterSpacing: '-0.04em' }}>
                            Essays & notes.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ fontSize: '15px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.7, maxWidth: '440px', margin: 0 }}
                    >
                        Quantitative thoughts dissecting game loops, transaction boundaries, and system architectures.
                    </motion.p>
                </div>

                {/* Editorial Brutalist List (No Cards, Spacious Dividers) */}
                <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                    {blogPosts.map((post, i) => (
                        <motion.div
                            key={post.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                                gap: '40px',
                                padding: '48px 0',
                                borderBottom: '1px solid var(--border)',
                                alignItems: 'flex-start'
                            }}
                        >
                            {/* Number and Title Block */}
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'baseline' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground-muted)' }}>
                                    {post.number}
                                </span>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3, fontFamily: 'var(--font-serif)' }}>
                                        {post.title}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--foreground-muted)' }}>
                                        <span>STATUS: [{post.date}]</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description and Date Block */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                                    {post.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
                    <a
                        href="https://www.linkedin.com/in/devansh-kumar-3b3701217/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glow-btn"
                    >
                        LINKEDIN_CONNECT →
                    </a>
                </div>
            </div>
        </section>
    );
}
