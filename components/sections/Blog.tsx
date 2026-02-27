'use client';

import { motion } from 'framer-motion';

const blogPlaceholders = [
    {
        title: 'Building a Risk-Aware Fraud Decision Engine',
        description: 'How I designed a multi-axis scoring system that explains every decision it makes — and why explainability matters more than accuracy.',
        date: 'Coming soon',
        emoji: '🛡️',
    },
    {
        title: 'Why Flutter is Underrated for Rapid Prototyping',
        description: "From zero to OTT app in 48 hours — how Flutter's widget system and hot reload change the way you think about building UIs.",
        date: 'Coming soon',
        emoji: '💙',
    },
    {
        title: 'INTJ Notes: On Systems Thinking in Software',
        description: 'A reflection on how personality shapes engineering philosophy — and why I obsess over architecture before writing a single line of code.',
        date: 'Coming soon',
        emoji: '🧠',
    },
];

export default function Blog() {
    return (
        <section id="blog" style={{ padding: 'clamp(60px, 10vw, 120px) 0' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#fff' }}
                    >
                        Recent Blog
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{
                            fontSize: '11px', color: '#52525b',
                            border: '1px solid #27272a',
                            borderRadius: '9999px',
                            padding: '4px 14px',
                        }}
                    >
                        Coming soon
                    </motion.div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                        gap: '16px',
                    }}
                >
                    {blogPlaceholders.map((post, i) => (
                        <motion.div
                            key={post.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="zinc-card"
                            style={{
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                opacity: 0.5,
                                cursor: 'not-allowed',
                            }}
                        >
                            {/* Placeholder image area */}
                            <div
                                style={{
                                    width: '100%', height: '160px',
                                    borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '36px',
                                    background: '#18181b',
                                    border: '1px solid #27272a',
                                }}
                            >
                                {post.emoji}
                            </div>

                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '8px', lineHeight: 1.4 }}>
                                    {post.title}
                                </h3>
                                <p style={{ fontSize: '12px', color: '#71717a', lineHeight: 1.6 }}>
                                    {post.description}
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '11px', color: '#52525b' }}>{post.date}</span>
                                <span style={{ fontSize: '11px', color: '#52525b' }}>✍</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
