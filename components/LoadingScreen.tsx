'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type LoadingOption = 'A' | 'B' | 'C' | 'D';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [activeOption, setActiveOption] = useState<LoadingOption>('A');

    // Telemetry logs for Option B
    const [logs, setLogs] = useState<string[]>([
        '[SYS] BOOTSTRAPING CORE_SECTORS...',
        '[SYS] INITIALIZING INTJ_MINIMAL_ENGINE...'
    ]);

    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            const increment = Math.floor(Math.random() * 3) + 1;
            current = Math.min(current + increment, 100);
            setProgress(current);

            // Add dynamic logs for Option B based on progress
            if (current > 20 && current < 40 && logs.length === 2) {
                setLogs(prev => [...prev, '[SYS] CORE_GEOMETRY: RESOLVED', '[SYS] FETCHING_EXPERIENCE_BLUEPRINTS...']);
            } else if (current > 50 && current < 70 && logs.length === 4) {
                setLogs(prev => [...prev, '[SYS] RENDER_PIPELINE: ESTABLISHED', '[SYS] STAGGERING_3D_PROJECTS...']);
            } else if (current > 80 && current < 95 && logs.length === 6) {
                setLogs(prev => [...prev, '[SYS] ENCRYPTING_LUXURY_VOIDS...', '[SYS] ESTABLISHING_BOUNDS: OK']);
            }

            if (current === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsExiting(true);
                    setTimeout(() => {
                        onComplete();
                    }, 800);
                }, 1000);
            }
        }, 20);

        return () => clearInterval(interval);
    }, [onComplete, logs.length]);

    // Canvas Graphics Loop supporting Options A, B, and D
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

        // Particle System for Option A
        const numParticles = 600;
        const perspective = 300;
        const radius = 180;
        const particles = Array.from({ length: numParticles }, () => {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            return {
                x: (Math.random() - 0.5) * 800,
                y: (Math.random() - 0.5) * 800,
                z: (Math.random() - 0.5) * 800,
                tx: radius * Math.sin(phi) * Math.cos(theta),
                ty: radius * Math.sin(phi) * Math.sin(theta),
                tz: radius * Math.cos(phi),
                size: Math.random() * 1.5 + 0.5,
                speed: 0.04 + Math.random() * 0.04
            };
        });

        // Matrix Scan settings for Option B
        let sweepY = 0;
        let sweepDir = 1;

        // Horology Ring settings for Option D
        let ringRot1 = 0;
        let ringRot2 = 0;
        let ringRot3 = 0;

        let rotationY = 0;
        let rotationX = 0;
        let animId: number;

        const render = () => {
            animId = requestAnimationFrame(render);
            const progressRatio = progress / 100;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Clean background
            ctx.fillStyle = '#020204';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // ==========================================
            // OPTION A: QUANTUM NODE NETWORK (WebGL 3D)
            // ==========================================
            if (activeOption === 'A') {
                rotationY += 0.005;
                rotationX += 0.002;

                const cosY = Math.cos(rotationY);
                const sinY = Math.sin(rotationY);
                const cosX = Math.cos(rotationX);
                const sinX = Math.sin(rotationX);

                particles.forEach((p) => {
                    const cx = p.x + (p.tx - p.x) * progressRatio * p.speed;
                    const cy = p.y + (p.ty - p.y) * progressRatio * p.speed;
                    const cz = p.z + (p.tz - p.z) * progressRatio * p.speed;

                    p.x = cx;
                    p.y = cy;
                    p.z = cz;

                    let x1 = cx * cosY - cz * sinY;
                    let z1 = cz * cosY + cx * sinY;
                    let y2 = cy * cosX - z1 * sinX;
                    let z2 = z1 * cosX + cy * sinX;

                    const scale = perspective / (perspective + z2 + 250);
                    const screenX = centerX + x1 * scale;
                    const screenY = centerY + y2 * scale;

                    if (screenX >= 0 && screenX <= canvas.width && screenY >= 0 && screenY <= canvas.height) {
                        const depthAlpha = (perspective - z2) / (perspective * 1.5);
                        const colorAlpha = Math.max(0.1, Math.min(depthAlpha, 0.9));
                        
                        ctx.beginPath();
                        ctx.arc(screenX, screenY, p.size * scale * 1.5, 0, Math.PI * 2);
                        
                        // HSL glow transition
                        const globalHue = 285 - progressRatio * 105;
                        ctx.fillStyle = `hsla(${globalHue}, 100%, 65%, ${colorAlpha * 0.8})`;
                        ctx.fill();
                    }
                });

                if (progressRatio > 0.75) {
                    const lineAlpha = (progressRatio - 0.75) * 4 * 0.06;
                    for (let i = 0; i < particles.length; i += 15) {
                        const p1 = particles[i];
                        let x1 = p1.x * cosY - p1.z * sinY;
                        let z1 = p1.z * cosY + p1.x * sinY;
                        let y2 = p1.y * cosX - z1 * sinX;
                        let z2 = z1 * cosX + p1.y * sinX;
                        const scale1 = perspective / (perspective + z2 + 250);
                        const screenX1 = centerX + x1 * scale1;
                        const screenY1 = centerY + y2 * scale1;

                        for (let j = i + 1; j < i + 8; j++) {
                            if (j >= particles.length) break;
                            const p2 = particles[j];
                            const dx = p1.x - p2.x;
                            const dy = p1.y - p2.y;
                            const dz = p1.z - p2.z;
                            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

                            if (dist < 50) {
                                let px1 = p2.x * cosY - p2.z * sinY;
                                let pz1 = p2.z * cosY + p2.x * sinY;
                                let py2 = p2.y * cosX - pz1 * sinX;
                                let pz2 = pz1 * cosX + p2.y * sinX;
                                const scale2 = perspective / (perspective + pz2 + 250);
                                const screenX2 = centerX + px1 * scale2;
                                const screenY2 = centerY + py2 * scale2;

                                ctx.beginPath();
                                ctx.moveTo(screenX1, screenY1);
                                ctx.lineTo(screenX2, screenY2);
                                ctx.strokeStyle = `hsla(${285 - progressRatio * 105}, 100%, 65%, ${lineAlpha})`;
                                ctx.lineWidth = 0.4;
                                ctx.stroke();
                            }
                        }
                    }
                }
            }

            // ==========================================
            // OPTION B: MATRIX SCANNER
            // ==========================================
            else if (activeOption === 'B') {
                // Draw coordinate grid lines
                ctx.strokeStyle = 'rgba(0, 229, 255, 0.03)';
                ctx.lineWidth = 0.5;
                const gridSize = 60;
                
                for (let x = 0; x < canvas.width; x += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
                for (let y = 0; y < canvas.height; y += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }

                // Laser scan line sweep
                sweepY += 4 * sweepDir;
                if (sweepY > canvas.height || sweepY < 0) {
                    sweepDir *= -1;
                }

                // Draw glowing cyan horizontal scanning laser line
                const gradient = ctx.createLinearGradient(0, sweepY - 10, 0, sweepY + 10);
                gradient.addColorStop(0, 'rgba(0, 229, 255, 0)');
                gradient.addColorStop(0.5, 'rgba(0, 229, 255, 0.25)');
                gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, sweepY - 10, canvas.width, 20);

                ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(0, sweepY);
                ctx.lineTo(canvas.width, sweepY);
                ctx.stroke();

                // Highlight intersections close to sweep line
                const snapY = Math.round(sweepY / gridSize) * gridSize;
                if (Math.abs(sweepY - snapY) < 15) {
                    for (let x = gridSize; x < canvas.width; x += gridSize * 2) {
                        ctx.beginPath();
                        ctx.arc(x, snapY, 4, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(x, snapY, 12, 0, Math.PI * 2);
                        ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();

                        // Tiny text coordinates next to active point
                        ctx.font = '8px monospace';
                        ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
                        ctx.fillText(`X:${x.toFixed(0)} Y:${snapY.toFixed(0)}`, x + 16, snapY + 3);
                    }
                }
            }

            // ==========================================
            // OPTION D: HOROLOGY RING (Astrolabe Engine)
            // ==========================================
            else if (activeOption === 'D') {
                ringRot1 += 0.003;
                ringRot2 -= 0.005;
                ringRot3 += 0.008;

                const baseRadius = Math.min(canvas.width, canvas.height) * 0.25;

                ctx.strokeStyle = 'rgba(181, 0, 250, 0.1)';
                ctx.lineWidth = 0.5;

                // Center crosshairs
                ctx.beginPath();
                ctx.moveTo(centerX - baseRadius * 1.5, centerY);
                ctx.lineTo(centerX + baseRadius * 1.5, centerY);
                ctx.moveTo(centerX, centerY - baseRadius * 1.5);
                ctx.lineTo(centerX, centerY + baseRadius * 1.5);
                ctx.stroke();

                // Ring 1: Inner Solid/Dotted
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(ringRot1);
                ctx.beginPath();
                ctx.arc(0, 0, baseRadius * 0.6, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
                
                // Fine inner ticks
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 18) {
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(a) * baseRadius * 0.55, Math.sin(a) * baseRadius * 0.55);
                    ctx.lineTo(Math.cos(a) * baseRadius * 0.6, Math.sin(a) * baseRadius * 0.6);
                    ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
                    ctx.stroke();
                }
                ctx.restore();

                // Ring 2: Middle Outer Gear
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(ringRot2);
                ctx.beginPath();
                ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(181, 0, 250, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Outer teeth
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 36) {
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(a) * baseRadius, Math.sin(a) * baseRadius);
                    ctx.lineTo(Math.cos(a) * baseRadius * 1.05, Math.sin(a) * baseRadius * 1.05);
                    ctx.strokeStyle = 'rgba(181, 0, 250, 0.2)';
                    ctx.stroke();
                }
                ctx.restore();

                // Ring 3: Compass pointer needle sweep
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(ringRot3);
                
                // Draw sweeps
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(0) * baseRadius * 1.3, Math.sin(0) * baseRadius * 1.3);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.lineWidth = 0.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(Math.cos(0) * baseRadius * 1.3, Math.sin(0) * baseRadius * 1.3, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#00e5ff';
                ctx.fill();

                ctx.restore();

                // Draw loading arc representing progress
                ctx.beginPath();
                ctx.arc(centerX, centerY, baseRadius * 1.25, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progressRatio));
                ctx.strokeStyle = '#00e5ff';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Angle values text overlays
                ctx.font = '8px monospace';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillText(`ROT_A: ${(ringRot1 * 180 / Math.PI).toFixed(1)}°`, centerX - 50, centerY + baseRadius * 1.5);
                ctx.fillText(`ROT_B: ${(ringRot2 * 180 / Math.PI).toFixed(1)}°`, centerX - 50, centerY + baseRadius * 1.6);
            }
        };

        render();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [progress, activeOption]);

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
                        background: '#020204',
                        overflow: 'hidden',
                        color: '#f6f5fa',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 'clamp(24px, 5vw, 64px)'
                    }}
                >
                    {/* Background Canvas (Hidden for Option C) */}
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 0,
                            pointerEvents: 'none',
                            display: activeOption === 'C' ? 'none' : 'block'
                        }}
                    />

                    {/* Top Header */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>01 // SYSTEM COMPILER</span>
                            <h2 style={{ fontSize: '14px', fontWeight: 300, marginTop: '4px', letterSpacing: '-0.01em', fontFamily: 'var(--font-serif)', color: '#fff' }}>
                                {activeOption === 'A' && 'WebGL 3D Quantum Node Network'}
                                {activeOption === 'B' && 'Tactical Coordinate Raster Scan'}
                                {activeOption === 'C' && 'Brutalist Monospace Typography'}
                                {activeOption === 'D' && 'Celestial Horology Astrolabe'}
                            </h2>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--foreground-muted)' }}>
                            127.0.0.1 // DEV_WORKSPACE
                        </div>
                    </div>

                    {/* Center Progress or Typographic Layout */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        {activeOption === 'C' ? (
                            // Brutalist Typography layout shift
                            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                    <h1 style={{ 
                                        fontSize: 'clamp(100px, 18vw, 240px)', 
                                        fontWeight: 100, 
                                        fontFamily: 'var(--font-mono)', 
                                        lineHeight: 0.8,
                                        margin: 0,
                                        letterSpacing: '-0.08em',
                                        color: '#fff'
                                    }}>
                                        {progress.toString().padStart(3, '0')}
                                    </h1>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                                    {progress < 25 && '>> ESTABLISHING_VOIDS'}
                                    {progress >= 25 && progress < 50 && '>> DECRYPTING_CHRONOLOGY'}
                                    {progress >= 50 && progress < 75 && '>> RENDERING_STAGGERED_SECTORS'}
                                    {progress >= 75 && '>> INTJ_COMPILER_COMPLETE'}
                                </div>
                            </div>
                        ) : (
                            // Core numeric indicator
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <h1 style={{ 
                                    fontSize: 'clamp(90px, 12vw, 180px)', 
                                    fontWeight: 200, 
                                    fontFamily: 'var(--font-serif)', 
                                    lineHeight: 0.8,
                                    margin: 0,
                                    letterSpacing: '-0.06em',
                                    color: '#fff'
                                }}>
                                    {progress}
                                </h1>
                                <span style={{ fontSize: 'clamp(16px, 2vw, 32px)', fontWeight: 300, color: 'var(--foreground-muted)', fontFamily: 'var(--font-mono)' }}>%</span>
                            </div>
                        )}
                        {activeOption !== 'C' && (
                            <span className="mono-tag" style={{ marginTop: '16px', fontSize: '9px', letterSpacing: '0.2em' }}>
                                {activeOption === 'A' && 'MORPHING_COORDINATE_SPHERE'}
                                {activeOption === 'B' && 'SWEEPING_RASTER_BOUNDS'}
                                {activeOption === 'D' && 'GEOMETRIC_MECHANICS_LOAD'}
                            </span>
                        )}
                    </div>

                    {/* Option Selection Panel (Live Switcher) */}
                    <div style={{
                        position: 'absolute',
                        bottom: '96px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 20,
                        display: 'flex',
                        gap: '8px',
                        background: 'rgba(2, 2, 4, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        padding: '4px',
                        borderRadius: '4px',
                        backdropFilter: 'blur(12px)',
                        pointerEvents: 'auto'
                    }}>
                        {(['A', 'B', 'C', 'D'] as LoadingOption[]).map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setActiveOption(opt)}
                                style={{
                                    background: activeOption === opt ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                    border: 'none',
                                    color: activeOption === opt ? '#fff' : 'rgba(255,255,255,0.4)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '9px',
                                    cursor: 'pointer',
                                    padding: '6px 12px',
                                    borderRadius: '2px',
                                    transition: 'all 0.2s ease',
                                    borderBottom: activeOption === opt ? '1px solid var(--accent-cyan)' : '1px solid transparent'
                                }}
                            >
                                OPT_{opt}
                            </button>
                        ))}
                    </div>

                    {/* Left Column console logger for Option B */}
                    {activeOption === 'B' && (
                        <div style={{
                            position: 'absolute',
                            left: '64px',
                            top: '160px',
                            width: '260px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '8px',
                            color: 'rgba(0, 229, 255, 0.6)',
                            lineHeight: 1.8,
                            pointerEvents: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                        }}>
                            {logs.map((log, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                    {log}
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Bottom Tickers */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--foreground-muted)' }}>
                            LOADING_ENGINE: ACTIVE // MORPH_{(progress / 100).toFixed(2)}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--foreground-muted)' }}>
                            STYLE: {activeOption === 'A' && '3D_NET'}
                            {activeOption === 'B' && 'LASER_GRID'}
                            {activeOption === 'C' && 'BRUTAL_MONO'}
                            {activeOption === 'D' && 'ASTRO_GEOM'}
                        </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
