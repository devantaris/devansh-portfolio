'use client';

import { useEffect, useRef } from 'react';

export default function NebulaBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                containerRef.current.style.setProperty('--scroll-y', String(window.scrollY));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" style={{ '--scroll-y': '0' } as React.CSSProperties}>
            {/* Large nebula gradients with CSS-driven parallax (no re-renders) */}
            <div
                className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.08]"
                style={{
                    background: 'radial-gradient(circle, rgba(124, 111, 181, 0.6) 0%, rgba(74, 95, 199, 0.3) 50%, transparent 70%)',
                    top: 'calc(20% - calc(var(--scroll-y) * 0.3px))',
                    left: '10%',
                    transform: 'translate(-50%, -50%)',
                    willChange: 'top',
                }}
            />

            <div
                className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-[0.06]"
                style={{
                    background: 'radial-gradient(circle, rgba(157, 143, 199, 0.5) 0%, rgba(124, 111, 181, 0.2) 60%, transparent 80%)',
                    top: 'calc(60% - calc(var(--scroll-y) * 0.2px))',
                    right: '15%',
                    transform: 'translate(50%, -50%)',
                    willChange: 'top',
                }}
            />

            <div
                className="absolute w-[700px] h-[700px] rounded-full blur-[110px] opacity-[0.05]"
                style={{
                    background: 'radial-gradient(circle, rgba(74, 95, 199, 0.4) 0%, rgba(124, 111, 181, 0.2) 50%, transparent 75%)',
                    bottom: 'calc(-20% - calc(var(--scroll-y) * 0.15px))',
                    left: '50%',
                    transform: 'translate(-50%, 50%)',
                    willChange: 'bottom',
                }}
            />
        </div>
    );
}
