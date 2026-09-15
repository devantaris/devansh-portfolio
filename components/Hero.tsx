'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import LorenzAttractor from './LorenzAttractor';

/* ─── Social Icons ─── */
const GithubIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const LeetCodeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.874 5.874 0 0 0 .349 1.017 5.938 5.938 0 0 0 .482.849l.015.02.003.003.006.007a5.975 5.975 0 0 0 2.213 1.968c.28.14.57.257.869.349.336.104.685.167 1.04.187.355.02.713-.002 1.066-.065.354-.063.698-.168 1.026-.312l3.41-1.636a1.375 1.375 0 0 0 .234-2.392 1.38 1.38 0 0 0-1.488-.04l-3.324 1.595a3.195 3.195 0 0 1-1.89.263 3.18 3.18 0 0 1-1.68-.973 3.193 3.193 0 0 1-.77-1.785 3.196 3.196 0 0 1 .425-2.007l3.633-3.89 4.795-5.132a1.377 1.377 0 0 0-.05-1.928A1.374 1.374 0 0 0 13.483 0zm1.75 6.842a1.376 1.376 0 0 0-.974.404L9.043 12.57a1.376 1.376 0 0 0 1.945 1.945l5.216-5.324a1.376 1.376 0 0 0-.971-2.349zM18.84 9.07a1.375 1.375 0 0 0-1.016.452l-7.79 8.35a1.376 1.376 0 1 0 2.012 1.876l7.79-8.35a1.375 1.375 0 0 0-.996-2.328z"/>
    </svg>
);

const MailIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleFactor = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

    return (
        <section
            id="home"
            ref={containerRef}
            style={{ 
                minHeight: '100vh', 
                position: 'relative', 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                background: '#020204',
                padding: 'clamp(80px, 12vw, 160px) 0'
            }}
        >
            {/* Ambient attractor field situated in background */}
            <div style={{
                position: 'absolute',
                right: '10%',
                width: 'min(70vw, 650px)',
                height: 'min(70vw, 650px)',
                opacity: 0.35,
                zIndex: 1,
                pointerEvents: 'none'
            }}>
                <LorenzAttractor />
            </div>

            {/* Core Editorial Container */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '1320px',
                    margin: '0 auto',
                    padding: '0 clamp(24px, 6vw, 96px)',
                    zIndex: 10,
                }}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
                    gap: '80px',
                    alignItems: 'center'
                }}>
                    
                    {/* Left Column: Ultra-Minimalist Typography */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>
                                SYSTEM STATUS // ONLINE
                            </span>
                            <div style={{ width: '32px', height: '1px', background: 'var(--border-strong)' }} />
                        </div>

                        {/* Whisper-Thin Editorial Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 style={{ 
                                fontSize: 'clamp(44px, 6vw, 76px)', 
                                fontFamily: 'var(--font-serif)', 
                                fontWeight: 200,
                                letterSpacing: '-0.04em',
                                lineHeight: 1.05,
                                color: '#f8f8fa',
                                margin: 0
                            }}>
                                Software <br />
                                engineer. <br />
                                <span style={{ color: 'var(--accent-cyan)' }}>Builder.</span>
                            </h1>
                        </motion.div>

                        {/* Spacious Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                fontSize: '16px',
                                fontFamily: 'var(--font-sans)',
                                fontWeight: 300,
                                lineHeight: 1.7,
                                color: 'var(--foreground-muted)',
                                maxWidth: '460px',
                                margin: 0
                            }}
                        >
                            B.Tech CSE at Bennett University (CGPA 8.75) with production systems experience. First-author researcher on staged uncertainty-aware fraud decisioning (284K+ transactions, 100% DECLINE precision). IEEE Student Branch Chairperson leading 100+ engineers.
                        </motion.p>

                        {/* Telemetry Links in Space-Mono */}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--foreground-muted)' }}>
                            <span>Python · FastAPI · PostgreSQL · Docker · Next.js</span>
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-strong)' }} />
                            <span>IEEE BU Chair · Open to Opportunities</span>
                        </div>

                        {/* CTAs */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
                            <a 
                                href="mailto:work.devanshkumar@gmail.com"
                                className="glow-btn"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <MailIcon />
                                Contact me
                            </a>

                            <a 
                                href="https://devantaris.github.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glow-btn"
                                style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                View Resume ↗
                            </a>

                            <a 
                                href="/Devansh_Kumar_Resume_1Page.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                download="Devansh_Kumar_Resume.pdf"
                                className="glow-btn"
                                style={{ borderColor: 'var(--border)', color: 'var(--foreground-muted)' }}
                                title="Download Offline 1-Page PDF"
                            >
                                PDF ↓
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Premium portrait photograph of Devansh */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                width: '100%',
                                maxWidth: '380px',
                                height: '540px',
                                position: 'relative',
                                border: '1px solid var(--border)',
                                padding: '12px',
                                background: '#020204',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                zIndex: 10
                            }}
                        >
                            {/* Vertical Frame layout */}
                            <div style={{ position: 'relative', width: '100%', height: '440px', overflow: 'hidden' }}>
                                <Image
                                    src="/images/devansh-portrait.png"
                                    alt="Devansh Kumar Portrait"
                                    fill
                                    priority
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: 'center top',
                                        filter: 'grayscale(100%) contrast(1.06) brightness(0.96)' // Luxury editorial monochrome
                                    }}
                                />
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#fff', fontWeight: 600 }}>
                                        DEVANSH KUMAR
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--foreground-muted)', marginTop: '2px' }}>
                                        BENNETT UNIV // CGPA 8.75 // IEEE BU
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <a href="https://github.com/devantaris" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground-muted)', transition: 'color 0.2s' }} title="GitHub" onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground-muted)'}>
                                        <GithubIcon />
                                    </a>
                                    <a href="https://linkedin.com/in/devansh-kumar-3b3701217" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground-muted)', transition: 'color 0.2s' }} title="LinkedIn" onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground-muted)'}>
                                        <LinkedInIcon />
                                    </a>
                                    <a href="https://leetcode.com/u/vantaris/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground-muted)', transition: 'color 0.2s' }} title="LeetCode" onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground-muted)'}>
                                        <LeetCodeIcon />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
