'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const minimalistTelemetry = [
    'INIT CORE_TELEMETRY...',
    'WEBGL_FLOW_FIELD: ACTIVE',
    'CHAOS_MATRIX: CONNECTED',
    'PARTICLE_DENSITY: 1200_NODES',
    'ACCELERATION_COEFFICIENT: DYNAMIC',
    'SINGULARITY_LOCK: OK',
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    // High-precision irregular percentage counter
    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            const increment = Math.floor(Math.random() * 3) + 1;
            current = Math.min(current + increment, 100);
            setProgress(current);

            if (current === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsExiting(true);
                    setTimeout(() => {
                        onComplete();
                    }, 800); // Allow exit transition
                }, 800);
            }
        }, 25);

        return () => clearInterval(interval);
    }, [onComplete]);

    // WebGL particle storm simulator
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Particle definitions
        const numParticles = 1200;
        const particles = Array.from({ length: numParticles }, () => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 400;
            return {
                x: canvas.width / 2 + Math.cos(angle) * distance,
                y: canvas.height / 2 + Math.sin(angle) * distance,
                originDist: distance,
                angle: angle,
                speed: 0.01 + Math.random() * 0.02,
                size: Math.random() * 2 + 0.5,
                hue: 285 // Start at purple HSL
            };
        });

        let animId: number;

        const render = () => {
            animId = requestAnimationFrame(render);
            
            // Faint trailing erase to create organic glowing paths
            ctx.fillStyle = 'rgba(4, 4, 8, 0.12)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Interpolate storm speed and convergence based on percentage progress
            const speedFactor = 1.0 + (progress / 100) * 8.0;
            const pullFactor = 1.0 - (progress / 100) * 0.9; // pull close into a node
            const globalHue = 285 - (progress / 100) * 105; // morph purple (285) to cyan (180)

            particles.forEach((p) => {
                // Accelerate angular rotation speed
                p.angle += p.speed * speedFactor;

                // Pull distance closer to origin center as loading completes
                const currentDist = p.originDist * pullFactor + Math.sin(p.angle * 2) * 20;

                // Update coordinate calculations
                p.x = centerX + Math.cos(p.angle) * currentDist;
                p.y = centerY + Math.sin(p.angle) * currentDist;

                // Glowing core overlay
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${globalHue}, 100%, 60%, ${0.3 + (progress / 100) * 0.5})`;
                ctx.fill();

                // Faint particle links if progress is high (singularity structure)
                if (progress > 85 && Math.random() < 0.005) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(centerX, centerY);
                    ctx.strokeStyle = `rgba(0, 245, 255, 0.03)`;
                    ctx.stroke();
                }
            });

            // Core neon reactor draw in center
            const coreRadius = 4 + (progress / 100) * 80;
            const coreGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 2);
            coreGlow.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
            coreGlow.addColorStop(0.3, `hsla(${globalHue}, 100%, 55%, 0.6)`);
            coreGlow.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(centerX, centerY, coreRadius * 2, 0, Math.PI * 2);
            ctx.fillStyle = coreGlow;
            ctx.fill();
        };

        render();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [progress]);

    // Current diagnostic telemetry string based on percentage
    const getTelemetryLog = () => {
        if (progress < 25) return 'COMPILING WEBGL ATTRACTOR CONTEXT...';
        if (progress < 50) return 'CALIBRATING PARTICLE CHAOS FIELDS...';
        if (progress < 75) return 'INCREASING GRAVITATIONAL COHERENCE...';
        if (progress < 100) return 'SYNCHRONIZING MODEL SINGULARITIES...';
        return 'SINGULARITY ONLINE // DEVANSH KUMAR SYSTEM UNLOCKED';
    };

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: '#040408',
                        overflow: 'hidden',
                        color: '#f6f5fa',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 'clamp(24px, 5vw, 64px)'
                    }}
                >
                    {/* Background WebGL Attractor Storm Canvas */}
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}
                    />

                    {/* Top: Header Row */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span className="mono-tag" style={{ color: 'var(--accent-purple)' }}>SYSTEM RUNTIME // CREATIVE REDESIGN</span>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '4px', letterSpacing: '-0.02em', fontFamily: 'var(--font-sans)' }}>
                                Devansh Kumar Core
                            </h2>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-cyan)' }}>
                            NODE_ONLINE: 127.0.0.1
                        </div>
                    </div>

                    {/* Center: Extreme Typography and Minimal Telemetry */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center', width: '100%' }}>
                        
                        {/* High-speed Telemetry Indicators */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span className="mono-tag">CHAOS_DIAGNOSTICS</span>
                            <div style={{ 
                                border: '1px solid rgba(255,255,255,0.06)', 
                                background: 'rgba(5, 5, 10, 0.75)', 
                                backdropFilter: 'blur(8px)',
                                padding: '20px', 
                                fontFamily: 'var(--font-mono)', 
                                fontSize: '10px', 
                                lineHeight: 1.6,
                                color: 'var(--foreground-muted)'
                            }}>
                                <div style={{ color: '#fff', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                                    &gt; {getTelemetryLog()}
                                </div>
                                {minimalistTelemetry.map((log) => (
                                    <div key={log}>&gt; {log}</div>
                                ))}
                            </div>
                        </div>

                        {/* Extreme Percentage Count */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <h1 style={{ 
                                    fontSize: 'clamp(100px, 14vw, 220px)', 
                                    fontWeight: 900, 
                                    fontFamily: 'var(--font-serif)', 
                                    lineHeight: 0.8,
                                    margin: 0,
                                    letterSpacing: '-0.06em',
                                    color: progress > 80 ? 'var(--accent-cyan)' : '#fff',
                                    transition: 'color 0.4s ease'
                                }}>
                                    {progress}
                                </h1>
                                <span style={{ fontSize: 'clamp(20px, 3vw, 40px)', fontWeight: 700, color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>%</span>
                            </div>
                            <span className="mono-tag" style={{ marginTop: '4px' }}>SINGULARITY_BOOST</span>
                        </div>
                    </div>

                    {/* Bottom: Tickers */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--foreground-muted)' }}>
                            ACCELERATION_LOCK: ACTIVE [{(progress * 1.84).toFixed(1)} FPS]
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--foreground-muted)', display: 'flex', gap: '20px' }}>
                            <span>SECTOR: WEBGL_CORE</span>
                            <span>VER: 4.2.0_STORM</span>
                        </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
