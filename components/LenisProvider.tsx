'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Native scrolling on touch devices and for reduced-motion users —
        // hijacking mobile scroll hurts both performance and usability.
        const isTouch = window.matchMedia('(pointer: coarse)').matches;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isTouch || reduced) return;

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            infinite: false,
        });

        // Fire a native scroll event on every Lenis tick so that any
        // window.addEventListener('scroll', ...) listener (e.g. in Projects.tsx)
        // picks up the smooth-scrolled position in real time.
        lenis.on('scroll', () => {
            window.dispatchEvent(new Event('scroll'));
        });

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
