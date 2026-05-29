'use client';

import { motion } from 'framer-motion';

const blogPosts = [
    {
        number: '01',
        title: 'DESIGNING BIOME: GAMIFICATION THAT WORKS',
        description: 'How I turned Pomodoro sessions into procedural world-building mechanics with rarity frameworks, territory expansion, and real-time active leaderboards — and why most productivity apps fail at gamification.',
        date: 'COMING_SOON',
        emoji: '🌿',
    },
    {
        number: '02',
        title: 'BUILDING A PEER CREDIT ECONOMY WITH SKILLSYNC',
        description: 'Credit balance scaling, AI-driven validation node checks, and the architectural hurdles of constructing a marketplace where knowledge acts as active currency — lessons from building SkillSync.',
        date: 'COMING_SOON',
        emoji: '🔄',
    },
    {
        number: '03',
        title: 'INTJ SYSTEMS: AN ARCHITECTURAL RETROSPECTIVE',
        description: 'A reflection on how personality models dictate structural software architecture bounds — and why I prioritize interface constraints over immediate procedural implementation scripts.',
        date: 'COMING_SOON',
        emoji: '🧠',
    },
];

export default function Blog() {
    return (
        <section id="blog" style={{ padding: 'clamp(80px, 12vw, 160px) 0', position: 'relative' }}>
            
            {/* Ambient background accent */}
            <div style={{
                position: 'absolute', bottom: '10%', right: '10%', width: '30vw', height: '30vw',
                background: 'radial-gradient(circle, rgba(0, 245, 255, 0.01) 0%, transparent 60%)',
                opacity: 0.8, filter: 'blur(100px)', pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 96px)' }}>
                
                {/* Section Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '64px', alignItems: 'flex-end' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>07 // PUBLISHED WRITINGS</span>
                        <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, marginTop: '8px', color: '#fff', letterSpacing: '-0.03em' }}>
                            Systems <br /><span className="text-void">Intellects</span>.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ fontSize: '15px', color: 'var(--foreground-muted)', lineHeight: 1.7, maxWidth: '480px', margin: 0 }}
                    >
                        Written essays dissecting game loops, peer transaction nodes, and personality mappings on software frameworks.
                    </motion.p>
                </div>

                {/* Editorial Brutalist List */}
                <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    {blogPosts.map((post, i) => (
                        <motion.div
                            key={post.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                                gap: '32px',
                                padding: '48px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                alignItems: 'flex-start',
                                position: 'relative'
                            }}
                        >
                            {/* Number and Title Block */}
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'baseline' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 800, color: 'var(--accent-purple)' }}>
                                    {post.number}
                                </span>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                                        {post.title}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-cyan)' }}>
                                        <span>STATUS: [{post.date}]</span>
                                        <span>SECTOR: SYSTEMS_INTJ</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description and Date Block */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.7, margin: 0 }}>
                                    {post.description}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                                    <span>RELEASE_LOCK: PENDING</span>
                                    <span style={{ fontSize: '16px' }}>{post.emoji}</span>
                                </div>
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
                        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    >
                        FOLLOW_ON_LINKEDIN_FOR_TELEMETRY →
                    </a>
                </div>
            </div>
        </section>
    );
}
