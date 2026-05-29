'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import LorenzAttractor from './LorenzAttractor';

/* ─── HUD Coordinates Widget ─── */
function HUDTelemetry() {
    const [coords, setCoords] = useState({ x: 40.7128, y: -74.0060 });

    useEffect(() => {
        const interval = setInterval(() => {
            setCoords({
                x: 40.7128 + (Math.random() - 0.5) * 0.05,
                y: -74.0060 + (Math.random() - 0.5) * 0.05
            });
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-cyan)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div>LAT_REF: {coords.x.toFixed(5)}°N</div>
            <div>LON_REF: {coords.y.toFixed(5)}°W</div>
            <div>MODEL_STABILITY: 99.84% [MAX]</div>
            <div>THROTTLE_VAL: 2.148 // ACTIVE</div>
        </div>
    );
}

/* ─── Social Icons ─── */
const GithubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
    
    // Parallax tracking
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const scaleFactor = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

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
                paddingTop: '80px',
                background: 'radial-gradient(circle at 70% 30%, rgba(189, 0, 255, 0.03) 0%, transparent 60%)'
            }}
        >
            {/* Fine Grid Background Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Asymmetrical Frame Accents */}
            <div style={{
                position: 'absolute', top: '10%', left: '4%', right: '4%', height: '1px',
                background: 'linear-gradient(to right, var(--border), var(--accent-cyan), transparent 60%)',
                opacity: 0.5, pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: '10%', left: '4%', right: '4%', height: '1px',
                background: 'linear-gradient(to left, var(--border), var(--accent-purple), transparent 60%)',
                opacity: 0.5, pointerEvents: 'none'
            }} />

            {/* Main Editorial Split Shell */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '1440px',
                    margin: '0 auto',
                    padding: '0 clamp(24px, 5vw, 96px)',
                    zIndex: 10,
                }}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
                    gap: '64px',
                    alignItems: 'center'
                }}>
                    {/* Left Column: Asymmetrical Editorial Text Blocks */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
                        {/* Vertical Sideways Ticker */}
                        <div style={{
                            position: 'absolute',
                            left: 'clamp(-80px, -6vw, -40px)',
                            top: '40px',
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '9px',
                            letterSpacing: '0.3em',
                            color: 'var(--accent-cyan)',
                            opacity: 0.6,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <span>01 // CREATIVE TECHNOLOGIST</span>
                            <div style={{ width: '1px', height: '40px', background: 'var(--accent-cyan)' }} />
                        </div>

                        {/* Telemetry Monospace Heading */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span className="mono-tag" style={{ border: '1px solid rgba(0, 245, 255, 0.2)', padding: '4px 12px', background: 'rgba(0, 245, 255, 0.02)' }}>
                                INTJ ENGINE READY
                            </span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-strong)' }} />
                        </div>

                        {/* Extreme Typography Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 style={{ 
                                fontSize: 'clamp(54px, 7vw, 94px)', 
                                fontFamily: 'var(--font-serif)', 
                                fontWeight: 800,
                                letterSpacing: '-0.05em',
                                lineHeight: 0.95,
                                margin: 0,
                                color: '#f6f5fa'
                            }}>
                                Building <br />
                                <span className="text-void" style={{ fontWeight: 900 }}>Systems</span> <br />
                                That Think.
                            </h1>
                        </motion.div>

                        {/* Sophisticated Pairing Copy */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                fontSize: 'clamp(16px, 1.8vw, 19px)',
                                fontFamily: 'var(--font-sans)',
                                lineHeight: 1.6,
                                color: 'var(--foreground-muted)',
                                maxWidth: '580px',
                                margin: 0
                            }}
                        >
                            From real-time <span style={{ color: '#fff', fontWeight: 600 }}>fraud intelligence engines</span> calibrated on extreme dimensional bootstrap vectors, to decentralized peer learning systems and cross-platform mobile frameworks. Architecting for robustness, shipping clean, deterministic systems.
                        </motion.p>

                        {/* Asymmetrical HUD Telemetry Wrapper */}
                        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center', marginTop: '16px' }}>
                            <HUDTelemetry />
                            <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span className="mono-tag" style={{ color: 'var(--accent-purple)' }}>IEEE BRANCH CHAIRPERSON</span>
                                <span style={{ fontSize: '13px', color: '#f6f5fa', fontFamily: 'var(--font-mono)' }}>
                                    BENNETT UNIVERSITY
                                </span>
                            </div>
                        </div>

                        {/* Editorial CTA Panel */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '24px' }}>
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href="mailto:work.devanshkumar@gmail.com"
                                className="glow-btn"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <MailIcon />
                                INITIATE_COMMS
                            </motion.a>

                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href="/resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glow-btn"
                                style={{ borderColor: 'var(--accent-purple)', color: '#fff' }}
                            >
                                TELEMETRY_RESUME.PDF
                            </motion.a>
                        </div>
                    </div>

                    {/* Right Column: WebGL Attractions and Telemetries */}
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {/* 3D Attractor Container */}
                        <div style={{
                            width: 'min(90vw, 550px)',
                            height: 'min(90vw, 550px)',
                            position: 'relative',
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '32px',
                            border: '1px solid rgba(255,255,255,0.04)',
                            background: 'radial-gradient(circle, rgba(5,5,10,0.6) 0%, transparent 80%)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <LorenzAttractor />
                            
                            {/* HUD Frame Overlay ticks */}
                            <div style={{ position: 'absolute', top: '16px', left: '16px', fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.2)' }}>
                                [ATTRACTOR_01 // LORENZ_CHAOS]
                            </div>
                            <div style={{ position: 'absolute', bottom: '16px', right: '16px', fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.2)' }}>
                                PLOT_INTERVAL: dt_0.007
                            </div>
                        </div>

                        {/* Editorial Overlapping Developer Avatar Telemetry HUD */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overlap-right offset-down"
                            style={{
                                position: 'absolute',
                                bottom: '-30px',
                                left: '-30px',
                                zIndex: 10,
                                width: '180px',
                                background: 'rgba(5,5,10,0.9)',
                                border: '1px solid var(--border-strong)',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(20px)'
                            }}
                        >
                            {/* Diagnostic HUD Photo Wrapper */}
                            <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Image
                                    src="/images/image3.png"
                                    alt="Devansh Kumar Avatar"
                                    fill
                                    priority
                                    style={{
                                        objectFit: 'cover',
                                        filter: 'contrast(1.15) brightness(0.9) saturate(0.85) hue-rotate(5deg)'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(5,5,10,0.85) 0%, transparent 50%)',
                                    pointerEvents: 'none'
                                }} />
                                
                                <div style={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '6px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '7px',
                                    background: 'rgba(0, 245, 255, 0.1)',
                                    color: 'var(--accent-cyan)',
                                    padding: '2px 6px',
                                    border: '1px solid var(--accent-cyan)'
                                }}>
                                    TARGET_ID: DK_01
                                </div>
                            </div>
                            
                            <div>
                                <span className="mono-tag" style={{ fontSize: '8px', color: 'var(--accent-purple)' }}>CALIBRATION STATUS</span>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                                    DEVANSH KUMAR
                                </div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--foreground-muted)', marginTop: '2px' }}>
                                    SYSTEM ARCHITECT
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
