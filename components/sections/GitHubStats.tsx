'use client';

import { motion } from 'framer-motion';

const stats = [
    { label: 'Public Repos', value: '7', icon: '📁' },
    { label: 'Followers', value: '1', icon: '👥' },
    { label: 'Following', value: '2', icon: '➡️' },
    { label: 'Member Since', value: '2024', icon: '📅' },
];

const languages = [
    { name: 'JavaScript', color: 'var(--accent-cyan)', pct: 30 },
    { name: 'TypeScript', color: 'var(--accent-purple)', pct: 28 },
    { name: 'Python', color: 'var(--accent-blue)', pct: 22 },
    { name: 'Dart', color: '#00f0ff', pct: 12 },
    { name: 'C++', color: '#9d4edd', pct: 5 },
    { name: 'HTML', color: '#3b82f6', pct: 3 },
];

export default function GitHubStats() {
    return (
        <section id="stats" style={{ padding: 'clamp(80px, 10vw, 160px) 0', position: 'relative' }}>
            
            {/* Background Decor */}
            <div style={{
                position: 'absolute', top: '20%', left: '0', width: '30vw', height: '30vw',
                background: 'radial-gradient(circle, var(--accent-purple) 0%, transparent 60%)',
                opacity: 0.05, filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
            }} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)', position: 'relative', zIndex: 1 }}>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '60px' }}
                >
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        Open Source <br/><span className="text-gradient">Activity</span>
                    </h2>
                    <p className="text-gradient-subtle" style={{ fontSize: '15px', marginTop: '16px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        GitHub Statistics
                    </p>
                </motion.div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                    
                    {/* Stats overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5 }}
                        className="premium-card glass"
                        style={{ flex: '1 1 300px', padding: '40px', position: 'relative', overflow: 'hidden' }}
                    >
                        {/* Subtle background icon */}
                        <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', fontSize: '150px', opacity: 0.03, pointerEvents: 'none' }}>
                            🐙
                        </div>
                        
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#a1a1aa', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Overview
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            {stats.map((s, i) => (
                                <motion.div 
                                    key={s.label} 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                                >
                                    <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>{s.icon}</span>
                                    <span style={{ fontSize: '36px', fontWeight: 800, color: '#fff', lineHeight: 1, textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>{s.value}</span>
                                    <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 500 }}>{s.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Language bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="premium-card glass"
                        style={{ flex: '2 1 400px', padding: '40px' }}
                    >
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#a1a1aa', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Top Languages
                        </h3>

                        {/* Color bar */}
                        <div style={{ display: 'flex', borderRadius: '9999px', overflow: 'hidden', height: '16px', marginBottom: '32px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5), 0 0 20px rgba(0,240,255,0.1)' }}>
                            {languages.map((lang) => (
                                <div
                                    key={lang.name}
                                    style={{ width: `${lang.pct}%`, background: lang.color, transition: 'all 0.3s' }}
                                    title={`${lang.name} ${lang.pct}%`}
                                />
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
                            {languages.map((lang) => (
                                <div key={lang.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: lang.color, boxShadow: `0 0 10px ${lang.color}` }} />
                                        <span style={{ fontSize: '14px', color: '#d4d4d8', fontWeight: 600 }}>{lang.name}</span>
                                    </div>
                                    <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 700 }}>{lang.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* GitHub contribution graph */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="premium-card glass"
                        style={{ flex: '1 1 100%', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#a1a1aa', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.1em', width: '100%', textAlign: 'left' }}>
                            Contribution Activity
                        </h3>
                        
                        <div style={{ 
                            width: '100%', 
                            overflowX: 'auto', 
                            paddingBottom: '16px',
                            // The hue-rotate(-35deg) turns the default blue (#3b82f6) into our neon cyan
                            // saturate(1.5) and brightness(1.2) make it pop against the dark background
                        }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://ghchart.rshah.org/3b82f6/devantaris"
                                alt="Devansh's GitHub contribution chart"
                                style={{ 
                                    minWidth: '700px', 
                                    width: '100%', 
                                    opacity: 0.9, 
                                    filter: 'hue-rotate(-35deg) saturate(1.5) brightness(1.2) drop-shadow(0 0 20px rgba(0,240,255,0.1))',
                                    mixBlendMode: 'screen'
                                }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        </div>
                        
                        <div style={{ marginTop: '24px', width: '100%', textAlign: 'right' }}>
                            <a
                                href="https://github.com/devantaris"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ 
                                    fontSize: '13px', 
                                    fontWeight: 600,
                                    color: 'var(--accent-cyan)', 
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    background: 'rgba(0,240,255,0.05)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(0,240,255,0.1)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(0,240,255,0.1)';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0,240,255,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(0,240,255,0.05)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                View full profile on GitHub →
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
