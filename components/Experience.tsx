'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const experiences = [
    {
        id: 'buildit',
        role: 'SOFTWARE DEVELOPER INTERN',
        company: 'BUILDIT SERVICE',
        location: 'GURUGRAM, HARYANA',
        date: 'MAR 2026 – PRESENT',
        points: [
            'Developing client lead acquisition pipelines and automation scripts using Python.',
            'Building responsive JavaScript components for live production web platforms.',
            'Integrating PostgreSQL and SQL databases to report operational agency metrics.'
        ]
    },
    {
        id: 'raahi',
        role: 'APPLICATION DEVELOPER (FLUTTER)',
        company: 'RAAHI',
        location: 'NOIDA, UTTAR PRADESH',
        date: 'OCT 2025 – MAR 2026',
        points: [
            'Delivered a cross-platform mobile client serving local student networks.',
            'Architected SQLite local storage schemas and secure session management.',
            'Optimized Dart widget rendering coordinates for high-frame 60fps transitions.'
        ]
    },
    {
        id: 'ieee-chair',
        role: 'STUDENT BRANCH CHAIRPERSON',
        company: 'IEEE STUDENT BRANCH',
        location: 'NOIDA, UTTAR PRADESH',
        date: 'SEP 2025 – PRESENT',
        points: [
            'Directing a 100+ member vertical hierarchy to compile tech products.',
            'Secured ₹1.48L+ in operations contracts through structured vendor negotiations.',
            'Organized Global AI Summit (4,000+ attendees) featuring industry researchers.'
        ]
    },
    {
        id: 'csi',
        role: 'JUNIOR CORE — TECH & RESEARCH',
        company: 'IEEE / CSI',
        location: 'NOIDA, UTTAR PRADESH',
        date: 'SEP 2024 – OCT 2025',
        points: [
            'Supported technical onboarding operations and local research coordinate scoping.'
        ]
    }
];

export default function Experience() {
    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <section id="experience" style={{ padding: 'clamp(80px, 12vw, 160px) 0', position: 'relative' }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 96px)' }}>
                
                {/* Section Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '64px', alignItems: 'flex-end' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>06 // CAREER CHRONOLOGY</span>
                        <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, marginTop: '8px', color: '#fff', letterSpacing: '-0.03em' }}>
                            Professional <br /><span className="text-void">Milestones</span>.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ fontSize: '15px', color: 'var(--foreground-muted)', lineHeight: 1.7, maxWidth: '480px', margin: 0 }}
                    >
                        A history of professional engineering tasks. Building robust automation scripts, optimizing graphics buffers, managing agile teams, and coordinating summits.
                    </motion.p>
                </div>

                {/* Main Asymmetric Selector Grid */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    gap: '40px',
                    flexWrap: 'wrap',
                }}>
                    {/* Left side selector tabs */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '12px',
                        flex: '1 1 280px',
                        maxWidth: '100%' 
                    }}>
                        {experiences.map((exp, idx) => {
                            const isActive = activeIdx === idx;
                            return (
                                <button
                                    key={exp.id}
                                    onClick={() => setActiveIdx(idx)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        padding: '20px 28px',
                                        background: isActive ? 'rgba(0, 245, 255, 0.03)' : 'rgba(5,5,10,0.5)',
                                        border: isActive ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.06)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        textAlign: 'left'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                    }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="experienceActiveLine"
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
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: isActive ? '#fff' : 'var(--foreground-muted)' }}>
                                        {exp.company}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: isActive ? 'var(--accent-purple)' : 'var(--foreground-muted)', fontWeight: 600, marginTop: '6px', letterSpacing: '0.05em' }}>
                                        {exp.role}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right side telemetry container showing description */}
                    <div 
                        className="telemetry-box"
                        style={{ 
                            flex: '3 1 600px', 
                            minHeight: '440px',
                            padding: '48px',
                            background: '#06060c',
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIdx}
                                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {/* Role and Title Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '36px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '24px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                                            {experiences[activeIdx].role}
                                        </h3>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '8px', letterSpacing: '0.05em' }}>
                                            {experiences[activeIdx].company} // {experiences[activeIdx].location}
                                        </div>
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', fontWeight: 700, background: 'rgba(255,255,255,0.04)', padding: '8px 18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        {experiences[activeIdx].date}
                                    </div>
                                </div>

                                {/* Timeline descriptions */}
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    {experiences[activeIdx].points.map((p, i) => (
                                        <motion.li 
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: i * 0.08 }}
                                            style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '14.5px', color: 'var(--foreground-muted)', lineHeight: '1.7' }}
                                        >
                                            <span style={{ flexShrink: 0, marginTop: '4px', color: 'var(--accent-purple)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                                                &gt;
                                            </span>
                                            <span style={{ fontFamily: 'var(--font-sans)' }}>{p}</span>
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
