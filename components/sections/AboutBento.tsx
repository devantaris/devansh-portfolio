'use client';

import { motion } from 'framer-motion';

const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: '-50px' } as const,
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
});

const principles = [
    'Write Modular Code',
    'Use Comments Wisely',
    'Handle Errors Properly',
    'Optimize for Readability',
    'Avoid Premature Optimization',
    'Test Early, Test Often',
    'Keep Functions Small',
    'Meaningful Variable Names',
];

export default function AboutBento() {
    return (
        <section id="about" style={{ padding: '80px 0 80px 0' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px' }}>
                {/* 3-column top row */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '16px',
                        marginBottom: '16px',
                    }}
                >
                    {/* Services Card */}
                    <motion.div {...fadeUp(0)} className="zinc-card" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>Services</h3>
                        <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.7 }}>
                            Building scalable backend systems, risk intelligence engines, and full-stack web applications with clean architecture.
                        </p>
                    </motion.div>

                    {/* Center card — Profile avatar */}
                    <motion.div
                        {...fadeUp(0.1)}
                        className="zinc-card"
                        style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://avatars.githubusercontent.com/u/181229665?v=4"
                            alt="Devansh Kumar"
                            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #3f3f46' }}
                        />
                        <div>
                            <p style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>@devantaris</p>
                            <a
                                href="https://github.com/devantaris"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: '12px', color: '#71717a', textDecoration: 'none', display: 'block', marginTop: '4px' }}
                            >
                                github.com/devantaris →
                            </a>
                        </div>
                    </motion.div>

                    {/* Clean Code Card */}
                    <motion.div {...fadeUp(0.2)} className="zinc-card" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>Clean Code</h3>
                        <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.7 }}>
                            Writing maintainable, efficient, and scalable code following best practices and proven engineering principles.
                        </p>
                    </motion.div>
                </div>

                {/* Bottom row — wider cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '16px',
                    }}
                >
                    {/* Systems Card */}
                    <motion.div {...fadeUp(0.3)} className="zinc-card" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>Systems I Build</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {[
                                'Risk Engines', 'REST APIs', 'ML Pipelines', 'Auth Systems',
                                'Data Dashboards', 'Mobile Apps', 'ETL Pipelines', 'Fraud Detection',
                            ].map((tag) => (
                                <span
                                    key={tag}
                                    style={{
                                        fontSize: '12px',
                                        padding: '6px 14px',
                                        background: '#27272a',
                                        border: '1px solid #3f3f46',
                                        borderRadius: '9999px',
                                        color: '#d4d4d8',
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Code Principles Card */}
                    <motion.div {...fadeUp(0.4)} className="zinc-card" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>Code Principles</h3>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '8px 16px',
                            }}
                        >
                            {principles.map((p) => (
                                <p key={p} style={{ fontSize: '12px', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#52525b', flexShrink: 0 }} />
                                    {p}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
