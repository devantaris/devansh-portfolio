'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experience } from '@/lib/content';

export default function Experience() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        <section id="experience" style={{ padding: 'clamp(100px, 15vw, 200px) 0', background: '#020204', position: 'relative' }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
                
                {/* Section Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '80px', alignItems: 'flex-end' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>03 // PROFESSIONAL CHRONOLOGY</span>
                        <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 200, marginTop: '8px', color: '#fff', letterSpacing: '-0.04em' }}>
                            Selected milestones.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ fontSize: '15px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.7, maxWidth: '440px', margin: 0 }}
                    >
                        Professional career chronology. Click any sector to decrypt full technical specifications and key deliverables.
                    </motion.p>
                </div>

                {/* Spacious Editorial Chronology list */}
                <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                    {experience.map((exp, idx) => {
                        const isExpanded = expandedId === exp.id;
                        return (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                onClick={() => toggleExpand(exp.id)}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                                    gap: '40px',
                                    padding: '48px 0',
                                    borderBottom: '1px solid var(--border)',
                                    alignItems: 'flex-start',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                }}
                                className="experience-row"
                            >
                                {/* Left Column: Organization & Period */}
                                <div>
                                    <span className="mono-tag" style={{ color: isExpanded ? 'var(--accent-cyan)' : 'var(--accent-purple)', transition: 'color 0.3s ease' }}>
                                        {exp.company}
                                    </span>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground-muted)', marginTop: '8px' }}>
                                        {exp.date}
                                    </div>
                                </div>

                                {/* Right Column: Role & Deliverables */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: 300, color: '#fff', margin: 0, fontFamily: 'var(--font-serif)' }}>
                                            {exp.role}
                                        </h3>
                                        <span className="mono-tag" style={{ fontSize: '8px', color: isExpanded ? 'var(--accent-cyan)' : 'var(--foreground-muted)', opacity: 0.8 }}>
                                            {isExpanded ? '[ SPEC // DECRYPTED ]' : '[ SPEC // DECRYPT ]'}
                                        </span>
                                    </div>

                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <ul style={{ listStyle: 'none', padding: '12px 0 0 0', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '1px solid rgba(0, 229, 255, 0.2)', paddingLeft: '16px' }}>
                                                    {exp.points.map((pt, i) => (
                                                        <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 300, lineHeight: 1.6 }}>
                                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-cyan)' }}>{'//'}</span>
                                                            <span>{pt}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
