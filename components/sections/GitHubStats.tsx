'use client';

import { motion } from 'framer-motion';

const stats = [
    { label: 'PUBLIC REPOS', value: '7' },
    { label: 'FOLLOWERS', value: '1' },
    { label: 'FOLLOWING', value: '2' },
    { label: 'YEARS ACTIVE', value: '2+' },
];

const languages = [
    { name: 'JAVASCRIPT', pct: 30 },
    { name: 'TYPESCRIPT', pct: 28 },
    { name: 'PYTHON', pct: 22 },
    { name: 'DART', pct: 12 },
    { name: 'C++', pct: 5 },
    { name: 'HTML', pct: 3 },
];

export default function GitHubStats() {
    return (
        <section id="stats" style={{ padding: 'clamp(100px, 15vw, 200px) 0', background: '#020204', position: 'relative' }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
                
                {/* Section Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '80px', alignItems: 'flex-end' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>05 // REPOSITORY DIAGNOSTICS</span>
                        <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 200, marginTop: '8px', color: '#fff', letterSpacing: '-0.04em' }}>
                            Open telemetry.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ fontSize: '15px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.7, maxWidth: '440px', margin: 0 }}
                    >
                        Commit registers and language distributions indexed directly from public repositories.
                    </motion.p>
                </div>

                {/* Asymmetric Content Spread */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '80px' }}>
                    
                    {/* Diagnostic totals list (No Cards, Spacious Lines) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                    >
                        <span className="mono-tag">TOTALS // DIAGNOSTIC</span>
                        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                            {stats.map((s, idx) => (
                                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground-muted)' }}>{s.label}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 200, color: '#fff', lineHeight: 1 }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Language metric list (No Cards, Spacious Lists) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                    >
                        <span className="mono-tag">COMPILATION // DENSITIES</span>
                        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                            {languages.map((lang, idx) => (
                                <div key={lang.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', fontWeight: 600 }}>{lang.name}</span>
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground-muted)' }}>{lang.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Glowing chart container (No Cards, Spacious desaturated graphic) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ 
                            gridColumn: '1 / -1', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '32px',
                            borderTop: '1px solid var(--border)',
                            paddingTop: '48px',
                            marginTop: '20px'
                        }}
                    >
                        <span className="mono-tag">DENSITY_MAP // CONTRIB_GRID</span>
                        
                        <div style={{ 
                            width: '100%', 
                            overflowX: 'auto', 
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            padding: '32px'
                        }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://ghchart.rshah.org/3b82f6/devantaris"
                                alt="Devansh Kumar's GitHub contribution telemetry"
                                style={{ 
                                    minWidth: '700px', 
                                    width: '100%', 
                                    opacity: 0.65, 
                                    filter: 'grayscale(100%) contrast(1.1) brightness(0.85)', // desaturated gray visual
                                    mixBlendMode: 'screen'
                                }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <a
                                href="https://github.com/devantaris"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glow-btn"
                            >
                                GITHUB_PROFILE →
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
