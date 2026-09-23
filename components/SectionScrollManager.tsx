'use client';

import { useEffect, useRef } from 'react';
import { getLenis } from '@/components/LenisProvider';

const SECTION_LANDMARKS = [
    'home',
    'about',
    'stack',
    'experience',
    'projects',
    'stats',
    'blog',
    'contact',
];

interface SnapStopsData {
    stops: number[];
    projectsTop: number;
    projectsBottom: number;
}

export default function SectionScrollManager() {
    const isAnimatingRef = useRef(false);
    const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Only enable on desktop pointer:fine devices and without reduced-motion preference
        if (!window.matchMedia('(pointer: fine)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        /**
         * Calculate all target scroll stop positions dynamically based on current DOM layout.
         */
        const computeStops = (): SnapStopsData => {
            const rawStops: number[] = [0];
            let projectsTop = -1;
            let projectsBottom = -1;

            const vh = window.innerHeight;
            const currentScrollY = window.scrollY;

            SECTION_LANDMARKS.forEach((id) => {
                const el = document.getElementById(id);
                if (!el) return;

                const rect = el.getBoundingClientRect();
                const top = Math.round(currentScrollY + rect.top);
                const height = el.offsetHeight;

                if (id === 'projects') {
                    projectsTop = top;
                    projectsBottom = Math.max(top, top + height - vh);
                    rawStops.push(projectsTop);
                    rawStops.push(projectsBottom);
                } else {
                    rawStops.push(top);
                    // For tall sections (e.g. Tech Stack or long Bento), provide a second stop at the bottom
                    if (height > vh + 100) {
                        const bottomStop = Math.round(top + height - vh);
                        rawStops.push(bottomStop);
                    }
                }
            });

            // Deduplicate and sort ascending
            const uniqueStops = Array.from(new Set(rawStops)).sort((a, b) => a - b);

            return {
                stops: uniqueStops,
                projectsTop,
                projectsBottom,
            };
        };

        const executeSnap = (targetY: number) => {
            if (isAnimatingRef.current) return;
            isAnimatingRef.current = true;

            const lenis = getLenis();
            if (lenis) {
                lenis.scrollTo(targetY, {
                    duration: 0.85,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
                    onComplete: () => {
                        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
                        lockTimerRef.current = setTimeout(() => {
                            isAnimatingRef.current = false;
                        }, 100);
                    },
                });
            } else {
                window.scrollTo({ top: targetY, behavior: 'smooth' });
                if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
                lockTimerRef.current = setTimeout(() => {
                    isAnimatingRef.current = false;
                }, 700);
            }

            // Fallback safety timeout in case onComplete doesn't fire
            if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
            lockTimerRef.current = setTimeout(() => {
                isAnimatingRef.current = false;
            }, 1000);
        };

        const handleWheel = (e: WheelEvent) => {
            // Ignore minimal mouse / trackpad drift
            if (Math.abs(e.deltaY) < 16) return;

            const { stops, projectsTop, projectsBottom } = computeStops();
            const scrollY = window.scrollY;

            // Check if current scroll position is within Featured Projects continuous zone
            const hasProjects = projectsTop >= 0 && projectsBottom > projectsTop;
            const isInsideProjects =
                hasProjects &&
                scrollY >= projectsTop - 12 &&
                scrollY <= projectsBottom + 12;

            if (isInsideProjects) {
                // When at the very bottom of Projects and scrolling DOWN -> snap to next section (e.g. #stats)
                if (e.deltaY > 0 && scrollY >= projectsBottom - 8) {
                    e.preventDefault();
                    if (isAnimatingRef.current) return;
                    const nextStop = stops.find((s) => s > projectsBottom + 15);
                    if (nextStop !== undefined) {
                        executeSnap(nextStop);
                    }
                    return;
                }

                // When at the very top of Projects and scrolling UP -> snap to previous section (e.g. #experience)
                if (e.deltaY < 0 && scrollY <= projectsTop + 8) {
                    e.preventDefault();
                    if (isAnimatingRef.current) return;
                    const prevStops = stops.filter((s) => s < projectsTop - 15);
                    if (prevStops.length > 0) {
                        const prevStop = prevStops[prevStops.length - 1];
                        executeSnap(prevStop);
                    }
                    return;
                }

                // Otherwise, within Projects: ALLOW CONTINUOUS FREE SCROLLING!
                return;
            }

            // ── OUTSIDE Featured Projects: Each scroll leads to the next / previous section stop ──
            e.preventDefault();
            if (isAnimatingRef.current) return;

            if (e.deltaY > 0) {
                // Scroll down: find next stop strictly below current scroll position
                const nextStop = stops.find((s) => s > scrollY + 20);
                if (nextStop !== undefined) {
                    executeSnap(nextStop);
                }
            } else {
                // Scroll up: find previous stop strictly above current scroll position
                const prevStops = stops.filter((s) => s < scrollY - 20);
                if (prevStops.length > 0) {
                    const prevStop = prevStops[prevStops.length - 1];
                    executeSnap(prevStop);
                }
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent handling when user is typing in form inputs/modals
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

            const { stops, projectsTop, projectsBottom } = computeStops();
            const scrollY = window.scrollY;
            const hasProjects = projectsTop >= 0 && projectsBottom > projectsTop;
            const isInsideProjects =
                hasProjects &&
                scrollY >= projectsTop - 12 &&
                scrollY <= projectsBottom + 12;

            if (['ArrowDown', 'PageDown', 'Space'].includes(e.key)) {
                if (isInsideProjects && scrollY < projectsBottom - 8) {
                    // Let native / Lenis handle internal scroll in projects
                    return;
                }
                e.preventDefault();
                if (isAnimatingRef.current) return;
                const nextStop = stops.find((s) => s > scrollY + 20);
                if (nextStop !== undefined) {
                    executeSnap(nextStop);
                }
            } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
                if (isInsideProjects && scrollY > projectsTop + 8) {
                    // Let native / Lenis handle internal scroll in projects
                    return;
                }
                e.preventDefault();
                if (isAnimatingRef.current) return;
                const prevStops = stops.filter((s) => s < scrollY - 20);
                if (prevStops.length > 0) {
                    const prevStop = prevStops[prevStops.length - 1];
                    executeSnap(prevStop);
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
            if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
        };
    }, []);

    return null;
}
