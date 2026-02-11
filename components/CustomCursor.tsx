'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [targetPosition, setTargetPosition] = useState({ x: -100, y: -100 });
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setTargetPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Smooth follow with inertia using lerp
        let animationId: number;
        const animate = () => {
            setPosition((prev) => ({
                x: prev.x + (targetPosition.x - prev.x) * 0.15, // Lerp factor for inertia
                y: prev.y + (targetPosition.y - prev.y) * 0.15,
            }));
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, [targetPosition]);

    return (
        <>
            {/* Custom cursor - SHINY & BOLD */}
            <div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] mix-blend-screen"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {/* Outer glow halo - LARGER & BRIGHTER */}
                <div className="absolute inset-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 rounded-full bg-accent blur-3xl opacity-70 animate-pulse" />
                    <div className="absolute inset-0 rounded-full bg-white blur-2xl opacity-40" />
                </div>

                {/* Middle glow layer */}
                <div className="absolute inset-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 rounded-full bg-accent blur-xl opacity-80" />
                </div>

                {/* Cursor dot - LARGER & SHINIER */}
                <div className="relative w-4 h-4 -translate-x-1/2 -translate-y-1/2">
                    {/* Core white shine */}
                    <div className="absolute inset-0 rounded-full bg-white opacity-100 shadow-lg shadow-white/50" />
                    {/* Accent ring */}
                    <div className="absolute inset-0 rounded-full bg-accent opacity-70 blur-sm" />
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full bg-white opacity-60 animate-ping" style={{ animationDuration: '1.5s' }} />
                </div>
            </div>
        </>
    );
}
