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
            {/* Custom cursor */}
            <div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] mix-blend-screen"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {/* Glow halo */}
                <div className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 rounded-full bg-accent blur-xl opacity-30 animate-pulse" />
                </div>

                {/* Cursor dot */}
                <div className="relative w-2 h-2 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 rounded-full bg-accent-bright opacity-90" />
                    <div className="absolute inset-0 rounded-full bg-white opacity-60 animate-ping" style={{ animationDuration: '2s' }} />
                </div>
            </div>
        </>
    );
}
