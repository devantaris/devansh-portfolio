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
            duration: 0.75,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
            wheelMultiplier: 1.15,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Fire a native scroll event on every Lenis tick so that any
        // window.addEventListener('scroll', ...) listener (e.g. in Projects.tsx)
        // picks up the smooth-scrolled position in real time.
        // Throttled to ~60fps — Lenis itself may tick at 120fps but scroll handlers
        // don't need to run more often than that, and this halves their workload.
        let lastScrollDispatch = 0;
        lenis.on('scroll', () => {
            const now = performance.now();
            if (now - lastScrollDispatch >= 16) {
                lastScrollDispatch = now;
                window.dispatchEvent(new Event('scroll'));
            }
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
