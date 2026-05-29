'use client';

import { motion } from 'framer-motion';

const experiences = [
    {
        id: 'buildit',
        role: 'Software Developer Intern',
        company: 'BUILDIT SERVICE',
        location: 'Gurugram, Haryana',
        date: 'MAR 2026 – PRESENT',
        points: [
            'Developing client lead acquisition pipelines and automation scripts using Python.',
            'Building responsive JavaScript components for live production web platforms.',
            'Integrating PostgreSQL and SQL databases to report operational agency metrics.'
        ]
    },
    {
        id: 'raahi',
        role: 'Application Developer (Flutter)',
        company: 'RAAHI',
        location: 'Noida, Uttar Pradesh',
        date: 'OCT 2025 – MAR 2026',
        points: [
            'Delivered a cross-platform mobile client serving local student networks.',
            'Architected SQLite local storage schemas and secure session management.',
            'Optimized Dart widget rendering coordinates for high-frame 60fps transitions.'
        ]
    },
    {
        id: 'ieee-chair',
        role: 'Student Branch Chairperson',
        company: 'IEEE STUDENT BRANCH',
        location: 'Noida, Uttar Pradesh',
        date: 'SEP 2025 – PRESENT',
        points: [
            'Directing a 100+ member vertical hierarchy to compile tech products.',
            'Secured ₹1.48L+ in operations contracts through structured vendor negotiations.',
            'Organized Global AI Summit (4,000+ attendees) featuring industry researchers.'
        ]
    },
    {
        id: 'csi',
        role: 'Junior Core — Tech & Research',
        company: 'IEEE / CSI',
        location: 'Noida, Uttar Pradesh',
        date: 'SEP 2024 – OCT 2025',
        points: [
            'Supported technical onboarding operations and local research coordinate scoping.'
        ]
    }
];

export default function Experience() {
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
                        Professional career chronology. Writing operational scripts, optimizing frame rates, and leading vertical development teams.
                    </motion.p>
                </div>

                {/* Spacious Editorial Chronology list */}
                <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                    {experiences.map((exp, idx) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                                gap: '40px',
                                padding: '48px 0',
                                borderBottom: '1px solid var(--border)',
                                alignItems: 'flex-start'
                            }}
                        >
                            {/* Left Column: Organization & Period */}
                            <div>
                                <span className="mono-tag" style={{ color: 'var(--accent-purple)' }}>{exp.company}</span>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground-muted)', marginTop: '8px' }}>
                                    {exp.date}
                                </div>
                            </div>

                            {/* Right Column: Role & Deliverables */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 300, color: '#fff', margin: 0, fontFamily: 'var(--font-serif)' }}>
                                    {exp.role}
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {exp.points.map((pt, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '12px', fontSize: '14px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.6 }}>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--border-strong)' }}>//</span>
                                            <span>{pt}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
