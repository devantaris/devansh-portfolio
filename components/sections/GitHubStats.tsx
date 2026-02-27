'use client';

import { motion } from 'framer-motion';

const stats = [
    { label: 'Public Repos', value: '6', icon: '📁' },
    { label: 'Followers', value: '1', icon: '👥' },
    { label: 'Following', value: '2', icon: '➡️' },
    { label: 'Member Since', value: '2024', icon: '📅' },
];

const languages = [
    { name: 'TypeScript', color: '#3178c6', pct: 38 },
    { name: 'Python', color: '#3572A5', pct: 28 },
    { name: 'Dart', color: '#00B4AB', pct: 18 },
    { name: 'C++', color: '#f34b7d', pct: 10 },
    { name: 'HTML', color: '#e34c26', pct: 6 },
];

export default function GitHubStats() {
    return (
        <section id="stats" style={{ padding: 'clamp(60px, 10vw, 120px) 0' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#fff', marginBottom: '12px' }}
                >
                    GitHub Stats
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ fontSize: '14px', color: '#71717a', marginBottom: '48px' }}
                >
                    A snapshot of my open-source activity.
                </motion.p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '16px' }}>
                    {/* Stats overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5 }}
                        className="zinc-card"
                        style={{ padding: '28px' }}
                    >
                        <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Overview
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {stats.map((s) => (
                                <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '24px' }}>{s.icon}</span>
                                    <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{s.value}</span>
                                    <span style={{ fontSize: '12px', color: '#71717a' }}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Language bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="zinc-card"
                        style={{ padding: '28px' }}
                    >
                        <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Top Languages
                        </h3>

                        {/* Color bar */}
                        <div style={{ display: 'flex', borderRadius: '9999px', overflow: 'hidden', height: '10px', marginBottom: '24px' }}>
                            {languages.map((lang) => (
                                <div
                                    key={lang.name}
                                    style={{ width: `${lang.pct}%`, background: lang.color }}
                                    title={`${lang.name} ${lang.pct}%`}
                                />
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {languages.map((lang) => (
                                <div key={lang.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: lang.color }} />
                                        <span style={{ fontSize: '14px', color: '#d4d4d8' }}>{lang.name}</span>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#71717a' }}>{lang.pct}%</span>
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
                        className="zinc-card"
                        style={{ padding: '28px', gridColumn: '1 / -1' }}
                    >
                        <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Contribution Activity
                        </h3>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://ghchart.rshah.org/3b82f6/devantaris"
                            alt="Devansh's GitHub contribution chart"
                            style={{ width: '100%', opacity: 0.8, borderRadius: '8px', filter: 'brightness(1.1)' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div style={{ marginTop: '16px' }}>
                            <a
                                href="https://github.com/devantaris"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: '12px', color: '#71717a', textDecoration: 'none' }}
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
