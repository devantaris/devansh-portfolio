'use client';

import { motion } from 'framer-motion';

const stats = [
    { label: 'PUBLIC REPOS', value: '7', icon: '📁', color: 'var(--accent-cyan)' },
    { label: 'FOLLOWERS', value: '1', icon: '👥', color: 'var(--accent-purple)' },
    { label: 'FOLLOWING', value: '2', icon: '➡️', color: 'var(--accent-orange)' },
    { label: 'YEARS ACTIVE', value: '2+', icon: '📅', color: '#fff' },
];

const languages = [
    { name: 'JAVASCRIPT', color: 'var(--accent-cyan)', pct: 30 },
    { name: 'TYPESCRIPT', color: 'var(--accent-purple)', pct: 28 },
    { name: 'PYTHON', color: 'var(--accent-blue)', pct: 22 },
    { name: 'DART', color: '#00f5ff', pct: 12 },
    { name: 'C++', color: '#bd00ff', pct: 5 },
    { name: 'HTML', color: '#ff5700', pct: 3 },
];

export default function GitHubStats() {
    return (
        <section id="stats" style={{ padding: 'clamp(80px, 12vw, 160px) 0', position: 'relative' }}>
            
            {/* Background glowing particles */}
            <div style={{
                position: 'absolute', top: '30%', left: '0', width: '35vw', height: '35vw',
                background: 'radial-gradient(circle, rgba(189, 0, 255, 0.015) 0%, transparent 60%)',
                opacity: 0.8, filter: 'blur(100px)', pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 96px)', position: 'relative', zIndex: 1 }}>
                
                {/* Section Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '64px', alignItems: 'flex-end' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="mono-tag" style={{ color: 'var(--accent-purple)' }}>05 // GIT INDEX ACTIVITY</span>
                        <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, marginTop: '8px', color: '#fff', letterSpacing: '-0.03em' }}>
                            Open Source <br /><span className="text-science">Telemetry</span>.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ fontSize: '15px', color: 'var(--foreground-muted)', lineHeight: 1.7, maxWidth: '480px', margin: 0 }}
                    >
                        Quantitative tracking metrics fetched directly from open repositories. Displaying core operational outputs, commit densities, and language ratios.
                    </motion.p>
                </div>

                {/* Dashboard grid panel */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '20px' }}>
                    
                    {/* General statistics telemetry card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="telemetry-box"
                        style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 100%)' }}
                    >
                        <span className="mono-tag">OVERVIEW_MATRICES</span>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '16px 0 32px 0', letterSpacing: '-0.01em' }}>
                            Diagnostic Totals
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            {stats.map((s, i) => (
                                <motion.div 
                                    key={s.label} 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                                >
                                    <span style={{ fontSize: '20px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.15))' }}>{s.icon}</span>
                                    <span style={{ 
                                        fontFamily: 'var(--font-mono)', 
                                        fontSize: '36px', 
                                        fontWeight: 800, 
                                        color: '#fff', 
                                        lineHeight: 1,
                                        textShadow: `0 0 20px ${s.color === '#fff' ? 'rgba(255,255,255,0.15)' : s.color + '25'}`
                                    }}>
                                        {s.value}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--foreground-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>{s.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Language metric telemetry card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="telemetry-box"
                        style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(189,0,255,0.01) 0%, transparent 100%)' }}
                    >
                        <span className="mono-tag">COMPILATION_RATIOS</span>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '16px 0 32px 0', letterSpacing: '-0.01em' }}>
                            Top Languages
                        </h3>

                        {/* Brutalist continuous bar */}
                        <div style={{ 
                            display: 'flex', 
                            height: '14px', 
                            marginBottom: '32px', 
                            border: '1px solid rgba(255,255,255,0.15)',
                            padding: '1px',
                            background: '#040408'
                        }}>
                            {languages.map((lang) => (
                                <div
                                    key={lang.name}
                                    style={{ 
                                        width: `${lang.pct}%`, 
                                        background: lang.color, 
                                        height: '100%',
                                        boxShadow: `0 0 10px ${lang.color}44`
                                    }}
                                    title={`${lang.name} ${lang.pct}%`}
                                />
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
                            {languages.map((lang) => (
                                <div key={lang.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: lang.color, boxShadow: `0 0 10px ${lang.color}` }} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#f6f5fa', fontWeight: 700 }}>{lang.name}</span>
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--foreground-muted)' }}>{lang.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Glowing chart visualizer */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="telemetry-box"
                        style={{ 
                            gridColumn: '1 / -1', 
                            padding: '40px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, rgba(0,245,255,0.01) 0%, transparent 100%)'
                        }}
                    >
                        <span className="mono-tag" style={{ width: '100%', textAlign: 'left' }}>DENSITY_MAP // CONTRIB_GRID</span>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '16px 0 32px 0', letterSpacing: '-0.01em', width: '100%', textAlign: 'left' }}>
                            Contribution Chart
                        </h3>
                        
                        <div style={{ 
                            width: '100%', 
                            overflowX: 'auto', 
                            paddingBottom: '16px',
                            border: '1px solid rgba(255,255,255,0.04)',
                            background: 'rgba(5,5,10,0.4)',
                            padding: '24px'
                        }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://ghchart.rshah.org/3b82f6/devantaris"
                                alt="Devansh Kumar's GitHub contribution telemetry"
                                style={{ 
                                    minWidth: '700px', 
                                    width: '100%', 
                                    opacity: 0.85, 
                                    filter: 'hue-rotate(-45deg) saturate(1.8) brightness(1.2) drop-shadow(0 0 25px rgba(0,245,255,0.15))',
                                    mixBlendMode: 'screen'
                                }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        </div>
                        
                        <div style={{ marginTop: '24px', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                            <a
                                href="https://github.com/devantaris"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glow-btn"
                                style={{ padding: '8px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            >
                                FETCH_FULL_PROFILE_ON_GITHUB →
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
