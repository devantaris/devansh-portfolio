'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const experiences = [
    {
        id: 'buildit',
        role: 'Software Developer Intern',
        company: 'BuildIt Service',
        location: 'Gurugram, Haryana',
        date: 'Mar 2026 – Present',
        points: [
            'Developing lead generation automation pipelines and REST API integrations for client acquisition workflows at a full-service digital agency.',
            'Building client-facing web applications using modern JavaScript frameworks; contributing to backend system architecture and deployment.',
            'Implementing internal dashboards and tooling to automate agency reporting and operational workflows using Python and SQL.',
            'Working in agile sprint cycles with cross-functional delivery teams across multiple concurrent client projects.'
        ]
    },
    {
        id: 'raahi',
        role: 'Application Developer (Flutter)',
        company: 'Raahi',
        location: 'Noida, Uttar Pradesh',
        date: 'Oct 2025 – Mar 2026',
        points: [
            'Delivered a production cross-platform mobile application (iOS, Android, Web) serving students and young professionals using Flutter and Dart.',
            'Architected BLoC-pattern state management with secure local authentication, encrypted session handling, and SQLite-backed persistent storage.',
            'Shipped 4+ iterative sprint releases over 5 months; contributed to feature scoping, QA testing, and sprint retrospectives in a lean 4-person agile team.',
            'Optimised widget rendering and cross-platform UI transitions, achieving smooth 60fps performance across device targets.'
        ]
    },
    {
        id: 'ieee-chair',
        role: 'Chairperson',
        company: 'IEEE Student Branch',
        location: 'Noida, Uttar Pradesh',
        date: 'Sep 2025 – Present',
        points: [
            'Lead 100+ member IEEE student branch; secured ₹1.48L+ in sponsorships across Triverse 3.0 and chapter events through end-to-end sponsor negotiation and contract management.',
            'Organised Global AI Summit 1.0 & 2.0 — international AI conferences with 3,000–4,000+ total attendees across both editions, featuring industry leaders, researchers, and foreign dignitaries.',
            'Directed Triverse 3.0, a 3-day inter-college technical and cultural fest with 1,000–2,000 participants across 15+ events.',
            'Managed 5 cross-functional verticals — events, sponsorship, research, technology, and editorial — across a team of 100+ core members.',
            'Led branch to 3rd place — IEEE UP Section Best Emerging Student Branch Award 2025.'
        ]
    },
    {
        id: 'csi',
        role: 'Junior Core — Tech & Research',
        company: 'IEEE / CSI',
        location: 'Noida, Uttar Pradesh',
        date: 'Sep 2024 – Oct 2025',
        points: [
            'Contributed to technical event planning, speaker coordination, and member onboarding across IEEE and Computer Society of India chapters.'
        ]
    }
];

export default function Experience() {
    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <section id="experience" style={{ padding: 'clamp(60px, 10vw, 120px) 0' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="font-ibm"
                    style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: '#fff', marginBottom: '60px', letterSpacing: '-0.02em' }}
                >
                    Experience
                </motion.h2>

                <div 
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        gap: '40px',
                        flexWrap: 'wrap',
                    }}
                >
                    {/* Left: Interactive Tabs */}
                    <div 
                        style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '12px',
                            flex: '1 1 250px',
                            maxWidth: '100%' 
                        }}
                    >
                        {experiences.map((exp, idx) => {
                            const isActive = activeIdx === idx;
                            return (
                                <button
                                    key={exp.id}
                                    onClick={() => setActiveIdx(idx)}
                                    className="glass"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        padding: '16px 24px',
                                        borderRadius: '16px',
                                        border: isActive ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.05)',
                                        background: isActive ? 'rgba(0, 240, 255, 0.05)' : 'transparent',
                                        boxShadow: isActive ? 'inset 0 0 20px rgba(0,240,255,0.05), 0 0 15px rgba(0,240,255,0.1)' : 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        textAlign: 'left'
                                    }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                bottom: 0,
                                                width: '4px',
                                                background: 'var(--accent-cyan)',
                                                boxShadow: '0 0 10px var(--accent-cyan)'
                                            }}
                                        />
                                    )}
                                    <span className="font-space" style={{ fontSize: '15px', fontWeight: 700, color: isActive ? '#fff' : '#a1a1aa', transition: 'color 0.3s ease' }}>
                                        {exp.company}
                                    </span>
                                    <span className="font-syne" style={{ fontSize: '13px', color: isActive ? 'var(--accent-purple)' : '#52525b', fontWeight: 500, transition: 'color 0.3s ease', marginTop: '4px' }}>
                                        {exp.role.split(' ')[0]} {exp.role.split(' ').length > 1 ? '...' : ''}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: Dynamic Content Area */}
                    <div 
                        className="premium-card"
                        style={{ 
                            flex: '3 1 500px', 
                            minHeight: '400px',
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIdx}
                                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                                transition={{ duration: 0.3 }}
                                style={{ height: '100%' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                                    <div>
                                        <h3 className="font-space" style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', marginBottom: '8px' }}>
                                            {experiences[activeIdx].role} <span className="text-gradient">@ {experiences[activeIdx].company}</span>
                                        </h3>
                                        <div className="font-syne" style={{ fontSize: '14px', color: '#8b8b99', fontWeight: 500 }}>
                                            {experiences[activeIdx].location}
                                        </div>
                                    </div>
                                    <div className="font-courier" style={{ fontSize: '14px', color: '#fff', fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        {experiences[activeIdx].date}
                                    </div>
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {experiences[activeIdx].points.map((p, i) => (
                                        <motion.li 
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: i * 0.1 }}
                                            style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', fontSize: '15px', color: '#a1a1aa', lineHeight: '1.7' }}
                                        >
                                            <span style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-purple)' }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                </svg>
                                            </span>
                                            <span className="font-syne">{p}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
