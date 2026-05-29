'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const telemetryLogs = [
    'CONNECTING TO DEVANTARIS CORE ENGINE...',
    'RESOLVING ASYMMETRICAL NODE COORDINATES...',
    'RETRIEVING MARI FRAUD MODEL ARCHITECTURE...',
    'LOAD LEVEL: 284K TRANSACTION VECTORS LOADED.',
    'ESTABLISHED 5-MEMBER CALIBRATED XGBOOST BOOTSTRAP...',
    'INTEGRATING ISOLATION FOREST PIPELINE [OK]',
    'INITIALIZING P2P CREDIT SYSTEM ON SKILLSYNC...',
    'STRETCHING BIOME TIME PROGRESSION THRESHOLDS...',
    'COMPILING 3D ATTRACTOR WEBGL FRAME...',
    'CALIBRATING DYNAMIC CO-SYSTEM FLUIDS...',
    'DEVANSH KUMAR SYSTEM ONLINE.'
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [logIndex, setLogIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // High-precision percentage counter with irregular organic steps
        let current = 0;
        const interval = setInterval(() => {
            const increment = Math.floor(Math.random() * 4) + 1;
            current = Math.min(current + increment, 100);
            setProgress(current);

            // Stagger telemetry logs based on percentage levels
            const targetLogIndex = Math.floor((current / 100) * (telemetryLogs.length - 1));
            if (targetLogIndex > logIndex) {
                setLogIndex(targetLogIndex);
            }

            if (current === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsExiting(true);
                    setTimeout(() => {
                        onComplete();
                    }, 800); // Allow exit animations to complete
                }, 600);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [logIndex, onComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0, 
                        y: '-100vh',
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: '#040408',
                        color: '#f6f5fa',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 'clamp(24px, 5vw, 64px)',
                        overflow: 'hidden'
                    }}
                >
                    {/* Top row: Title and status indicators */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span className="mono-tag" style={{ color: 'var(--accent-purple)' }}>SYSTEM RUNTIME // CREATIVE REDESIGN</span>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '4px', letterSpacing: '-0.02em', fontFamily: 'var(--font-sans)' }}>
                                Devansh Kumar Core
                            </h2>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-cyan)' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block', boxShadow: '0 0 8px var(--accent-cyan)', animation: 'pulse 1s infinite' }} />
                            <span>NODE_ONLINE: 127.0.0.1</span>
                        </div>
                    </div>

                    {/* Center row: Asymmetrical typography layout */}
                    <div style={{ position: 'relative', width: '100%' }}>
                        {/* Extreme Background Numbers */}
                        <div style={{
                            position: 'absolute',
                            left: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: 'clamp(120px, 20vw, 360px)',
                            fontWeight: 800,
                            fontFamily: 'var(--font-serif)',
                            color: 'rgba(255,255,255,0.015)',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            lineHeight: 0.8
                        }}>
                            SYS.THINK
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            {/* Diagnostic Logger */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span className="mono-tag">CORE DIAGNOSTICS</span>
                                <div style={{ 
                                    border: '1px solid rgba(255,255,255,0.05)', 
                                    background: 'rgba(255,255,255,0.01)', 
                                    padding: '24px', 
                                    fontFamily: 'var(--font-mono)', 
                                    fontSize: '11px', 
                                    lineHeight: 1.6,
                                    height: '140px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    gap: '4px',
                                    overflow: 'hidden',
                                    color: 'var(--foreground-muted)'
                                }}>
                                    {telemetryLogs.slice(0, logIndex + 1).map((log, index) => (
                                        <motion.div 
                                            key={log} 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{ color: index === logIndex ? '#fff' : 'var(--foreground-muted)' }}
                                        >
                                            &gt; {log}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Massive Editorial Progress Counter */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                    <h1 style={{ 
                                        fontSize: 'clamp(100px, 15vw, 240px)', 
                                        fontWeight: 800, 
                                        fontFamily: 'var(--font-serif)', 
                                        lineHeight: 0.8,
                                        margin: 0,
                                        letterSpacing: '-0.06em',
                                        color: progress > 80 ? 'var(--accent-cyan)' : '#fff',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        {progress}
                                    </h1>
                                    <span style={{ fontSize: 'clamp(24px, 3vw, 48px)', fontWeight: 700, color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>%</span>
                                </div>
                                <span className="mono-tag" style={{ marginTop: '8px' }}>BOOT ENGINE SEQUENCE</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom row: Telemetry indicators */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--foreground-muted)' }}>
                            ESTABLISHED MODEL INFERENCES: Sub-100ms
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--foreground-muted)', display: 'flex', gap: '20px' }}>
                            <span>SECTOR: RA_3L_SYS</span>
                            <span>VER: 4.1.8_CR</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
