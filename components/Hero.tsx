'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* ─── Particle Background ─── */
function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        const particles: { x: number; y: number; r: number; speed: number; opacity: number; phase: number }[] = [];
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.3,
                speed: Math.random() * 0.3 + 0.05,
                opacity: Math.random() * 0.5 + 0.1,
                phase: Math.random() * Math.PI * 2,
            });
        }

        let animId: number;
        let t = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.01;
            particles.forEach((p) => {
                const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(t * p.speed + p.phase));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${currentOpacity})`;
                ctx.fill();
            });
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

export default function Hero() {
    return (
        <section
            id="home"
            className="relative overflow-hidden"
            style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
        >
            <ParticleBackground />

            {/* Blue edge glow - left */}
            <div
                className="absolute left-0 top-0 bottom-0 pointer-events-none"
                style={{ width: '2px', background: 'linear-gradient(to bottom, transparent, #3b82f6, transparent)', opacity: 0.5 }}
            />
            {/* Blue edge glow - right */}
            <div
                className="absolute right-0 top-0 bottom-0 pointer-events-none"
                style={{ width: '2px', background: 'linear-gradient(to bottom, transparent, #3b82f6, transparent)', opacity: 0.5 }}
            />

            <div
                className="relative z-10 w-full"
                style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 48px 80px 48px' }}
            >
                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{
                        fontSize: 'clamp(48px, 6vw, 80px)',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        color: '#fff',
                        marginBottom: '20px',
                        lineHeight: 1.1,
                    }}
                >
                    Devansh Kumar
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                    style={{
                        fontSize: '16px',
                        color: '#a1a1aa',
                        maxWidth: '520px',
                        marginBottom: '40px',
                        lineHeight: 1.7,
                    }}
                >
                    Building systems that think — from risk intelligence engines to mobile apps.
                    I write code that solves real problems, reads well, and scales.
                </motion.p>

                {/* CTA Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
                >
                    <a
                        href="mailto:work.devanshkumar@gmail.com"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            background: '#fff',
                            color: '#000',
                            fontSize: '14px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            textDecoration: 'none',
                            transition: 'background 0.2s',
                        }}
                    >
                        <MailIcon />
                        Hire me
                    </a>

                    <a
                        href="https://github.com/devantaris"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            border: '1px solid #3f3f46',
                            borderRadius: '8px',
                            color: '#d4d4d8',
                            textDecoration: 'none',
                            transition: 'border-color 0.2s, color 0.2s',
                        }}
                        aria-label="GitHub"
                    >
                        <GithubIcon />
                    </a>

                    <a
                        href="https://www.linkedin.com/in/devansh-kumar-3b3701217/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            border: '1px solid #3f3f46',
                            borderRadius: '8px',
                            color: '#d4d4d8',
                            textDecoration: 'none',
                            transition: 'border-color 0.2s, color 0.2s',
                        }}
                        aria-label="LinkedIn"
                    >
                        <LinkedInIcon />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
