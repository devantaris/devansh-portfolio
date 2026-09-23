'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    opacity: number;
    decay: number;
    vx: number;
    vy: number;
}

export default function CustomCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -100, y: -100 });
    const smoothPosRef = useRef({ x: -100, y: -100 });
    const isHoveredRef = useRef(false);
    const isDownRef = useRef(false);
    const particlesRef = useRef<Particle[]>([]);
    const lastEmitRef = useRef(0);
    const animIdRef = useRef<number>(0);
    const isVisibleRef = useRef(false);

    // Draw a 4-pointed celestial star
    const drawStar = useCallback(
        (
            ctx: CanvasRenderingContext2D,
            cx: number,
            cy: number,
            outerR: number,
            innerR: number,
            rotation: number,
            color: string,
            opacity: number
        ) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rotation);
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const r = i % 2 === 0 ? outerR : innerR;
                const angle = (Math.PI / 4) * i - Math.PI / 2;
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        },
        []
    );

    useEffect(() => {
        // Only run custom cursor on fine pointer devices (desktops/laptops with mouse/trackpad)
        if (!window.matchMedia('(pointer: fine)').matches) return;

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

        // Hover detection on interactive elements
        const handleOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            const interactive = target.closest('a, button, [role="button"], input, textarea, select, canvas, .glow-btn, .world-row, .sysmap-stop');
            isHoveredRef.current = !!interactive;
        };

        const handlePointerMove = (e: PointerEvent) => {
            // Skip touch pointers to preserve pure native touch behavior
            if (e.pointerType === 'touch') {
                isVisibleRef.current = false;
                document.body.classList.remove('has-custom-cursor');
                return;
            }

            isVisibleRef.current = true;
            if (!document.body.classList.contains('has-custom-cursor')) {
                document.body.classList.add('has-custom-cursor');
            }
            mouseRef.current = { x: e.clientX, y: e.clientY };

            if (smoothPosRef.current.x < 0) {
                smoothPosRef.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handlePointerDown = () => { isDownRef.current = true; };
        const handlePointerUp = () => { isDownRef.current = false; };

        const handleMouseLeave = () => {
            isVisibleRef.current = false;
            document.body.classList.remove('has-custom-cursor');
        };

        const handleMouseEnter = (e: MouseEvent) => {
            isVisibleRef.current = true;
            if (!document.body.classList.contains('has-custom-cursor')) {
                document.body.classList.add('has-custom-cursor');
            }
            mouseRef.current = { x: e.clientX, y: e.clientY };
            smoothPosRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('mouseover', handleOver, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        let currentRadius = 14;

        // Render Loop
        const animate = () => {
            animIdRef.current = requestAnimationFrame(animate);

            if (document.hidden) return;
            if (!isVisibleRef.current && particlesRef.current.length === 0) {
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = Date.now();
            const mouse = mouseRef.current;
            const smooth = smoothPosRef.current;

            // Fluid lerp tracking for outer celestial halo
            smooth.x += (mouse.x - smooth.x) * 0.45;
            smooth.y += (mouse.y - smooth.y) * 0.45;

            // Target ring size based on hover / click states
            let targetRadius = 14;
            if (isDownRef.current) {
                targetRadius = 10;
            } else if (isHoveredRef.current) {
                targetRadius = 24;
            }
            currentRadius += (targetRadius - currentRadius) * 0.25;

            // Stardust trail generation on movement
            const dx = mouse.x - smooth.x;
            const dy = mouse.y - smooth.y;
            const speed = Math.sqrt(dx * dx + dy * dy);

            if (isVisibleRef.current && now - lastEmitRef.current > 32 && speed > 1.2) {
                if (particlesRef.current.length < 10) {
                    particlesRef.current.push({
                        x: smooth.x + (Math.random() - 0.5) * 6,
                        y: smooth.y + (Math.random() - 0.5) * 6,
                        size: Math.random() * 2.5 + 1,
                        opacity: 0.65,
                        decay: 0.04 + Math.random() * 0.02,
                        vx: (Math.random() - 0.5) * 0.8,
                        vy: (Math.random() - 0.5) * 0.8,
                    });
                }
                lastEmitRef.current = now;
            }

            // Draw trailing stardust
            const particles = particlesRef.current;
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.opacity -= p.decay;
                p.size *= 0.95;

                if (p.opacity <= 0 || p.size < 0.2) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            if (isVisibleRef.current && mouse.x >= 0 && mouse.y >= 0) {
                const rotation = now * 0.0012;

                // ── 1. Trailing Cosmic Orbital Ring (glides smoothly behind) ──
                ctx.save();
                ctx.strokeStyle = isHoveredRef.current
                    ? 'rgba(0, 229, 255, 0.7)'
                    : 'rgba(255, 255, 255, 0.4)';
                ctx.lineWidth = isHoveredRef.current ? 1.5 : 1;
                ctx.beginPath();
                ctx.arc(smooth.x, smooth.y, currentRadius, 0, Math.PI * 2);
                ctx.stroke();

                // Small rotating accent star on the trailing ring
                const starSize = isHoveredRef.current ? 6 : 4.5;
                drawStar(
                    ctx,
                    smooth.x,
                    smooth.y,
                    starSize,
                    starSize * 0.35,
                    rotation,
                    isHoveredRef.current ? '#00e5ff' : '#ffffff',
                    isHoveredRef.current ? 0.9 : 0.65
                );
                ctx.restore();

                // ── 2. ZERO-LATENCY Precision Center Pointer Dot (exactly on cursor) ──
                // This ensures instant, 100% responsive tactile feedback for clicking
                ctx.save();
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.restore();
            }
        };

        animate();

        return () => {
            cancelAnimationFrame(animIdRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('mouseover', handleOver);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.body.classList.remove('has-custom-cursor');
        };
    }, [drawStar]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[9999] pointer-events-none"
        />
    );
}
