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
    rotation: number;
    rotationSpeed: number;
}

export default function CustomCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -100, y: -100 });
    const smoothPosRef = useRef({ x: -100, y: -100 });
    const particlesRef = useRef<Particle[]>([]);
    const lastEmitRef = useRef(0);
    const animIdRef = useRef<number>(0);
    const isVisibleRef = useRef(false);
    const lastTouchTimeRef = useRef(0);

    // Draw a 4-pointed star shape
    const drawStar = useCallback(
        (
            ctx: CanvasRenderingContext2D,
            cx: number,
            cy: number,
            outerR: number,
            innerR: number,
            points: number,
            rotation: number,
            color: string,
            opacity: number
        ) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rotation);
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
                const r = i % 2 === 0 ? outerR : innerR;
                const angle = (Math.PI / points) * i - Math.PI / 2;
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();

            // Glow
            ctx.shadowColor = color;
            ctx.shadowBlur = outerR * 0.8;
            ctx.fill();
            ctx.restore();
        },
        []
    );

    useEffect(() => {
        // Initial coarse pointer check (run once on mount)
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
            isVisibleRef.current = false;
        }

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

        // Track touch
        const handleTouchStart = () => {
            lastTouchTimeRef.current = Date.now();
            isVisibleRef.current = false;
        };
        window.addEventListener('touchstart', handleTouchStart, { passive: true });

        // Track mouse
        const handleMouseMove = (e: MouseEvent) => {
            // Ignore emulated mouse moves from touches
            if (Date.now() - lastTouchTimeRef.current < 500) return;

            if (!isVisibleRef.current) {
                smoothPosRef.current = { x: e.clientX, y: e.clientY };
                isVisibleRef.current = true;
            }

            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const handleMouseLeave = () => {
            isVisibleRef.current = false;
        };
        document.addEventListener('mouseleave', handleMouseLeave);

        const handleMouseEnter = (e: MouseEvent) => {
            if (Date.now() - lastTouchTimeRef.current < 500) return;
            isVisibleRef.current = true;
            mouseRef.current = { x: e.clientX, y: e.clientY };
            smoothPosRef.current = { x: e.clientX, y: e.clientY };
        };
        document.addEventListener('mouseenter', handleMouseEnter);

        // Animation
        const animate = () => {
            animIdRef.current = requestAnimationFrame(animate);

            // Skip drawing completely if cursor is hidden (like on mobile devices)
            if (!isVisibleRef.current && particlesRef.current.length === 0) {
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = Date.now();
            const mouse = mouseRef.current;
            const smooth = smoothPosRef.current;

            // Smooth cursor position
            smooth.x += (mouse.x - smooth.x) * 0.2;
            smooth.y += (mouse.y - smooth.y) * 0.2;

            // Emit trail particles every ~16ms when moving
            const dx = mouse.x - smooth.x;
            const dy = mouse.y - smooth.y;
            const speed = Math.sqrt(dx * dx + dy * dy);

            if (isVisibleRef.current && now - lastEmitRef.current > 16 && speed > 0.3) {
                const count = Math.min(Math.floor(speed / 2) + 1, 4);
                for (let i = 0; i < count; i++) {
                    particlesRef.current.push({
                        x: smooth.x + (Math.random() - 0.5) * 6,
                        y: smooth.y + (Math.random() - 0.5) * 6,
                        size: Math.random() * 4 + 2,
                        opacity: Math.random() * 0.6 + 0.4,
                        decay: 0.015 + Math.random() * 0.01,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: (Math.random() - 0.5) * 1.5,
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.1,
                    });
                }
                lastEmitRef.current = now;
            }

            // Update and draw trail particles
            const particles = particlesRef.current;
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.opacity -= p.decay;
                p.size *= 0.98;
                p.rotation += p.rotationSpeed;

                if (p.opacity <= 0 || p.size < 0.3) {
                    particles.splice(i, 1);
                    continue;
                }

                drawStar(ctx, p.x, p.y, p.size, p.size * 0.35, 4, p.rotation, '#ffffff', p.opacity);
            }

            if (isVisibleRef.current) {
                // Draw main cursor star — 4-pointed with subtle glow
                const pulse = 1 + Math.sin(now * 0.005) * 0.15;
                const mainSize = 10 * pulse;
                const rotation = now * 0.001;

                // Outer glow
                drawStar(ctx, smooth.x, smooth.y, mainSize * 1.6, mainSize * 0.5, 4, rotation, 'rgba(255,255,255,0.2)', 0.3);
                // Main star
                drawStar(ctx, smooth.x, smooth.y, mainSize, mainSize * 0.3, 4, rotation, '#ffffff', 0.95);
                // Inner bright core
                ctx.save();
                ctx.globalAlpha = 0.9;
                ctx.beginPath();
                ctx.arc(smooth.x, smooth.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.restore();
            }
        };

        animate();

        return () => {
            cancelAnimationFrame(animIdRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [drawStar]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{ cursor: 'none' }}
        />
    );
}
