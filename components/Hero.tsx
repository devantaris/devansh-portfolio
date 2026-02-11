'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SplineScene } from '@/components/ui/splite';
import { useTypewriter } from '@/hooks/useTypewriter';

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Scroll-based fade effect for 3D scene
    const { scrollY } = useScroll();
    const sceneOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const sceneY = useTransform(scrollY, [0, 400], [0, 100]);

    const typewriterPhrases = [
        'program.',
        'learn system architecture.',
        'make fintech projects.',
        'like making projects.',
        'love reading.',
        'explore.',
        'write.',
        'build.',
        'design.',
        'am INTJ.'
    ];

    const currentPhrase = useTypewriter(typewriterPhrases, 100, 50, 2000);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 5,
                y: (e.clientY / window.innerHeight - 0.5) * 5,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center overflow-hidden"
        >
            {/* Background parallax effect for space */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    transition: 'transform 0.1s linear',
                }}
            />

            {/* 3D ASTRONAUT on RIGHT SIDE - dissolves on scroll - INTERACTIVE */}
            <motion.div
                className="fixed right-0 top-0 bottom-0 w-1/2 md:w-1/2 lg:w-1/2 z-20"
                style={{
                    opacity: sceneOpacity,
                    y: sceneY,
                }}
            >
                <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                />
            </motion.div>

            {/* Main Content Container */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-24 pl-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Text Block - Left Column */}
                    <div className="space-y-6 max-w-[600px]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.15] mb-2 text-foreground-muted">
                                Hey, I am
                            </h1>
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8 text-foreground">
                                Devansh Kumar.
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <p className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight leading-[1.3] text-foreground-muted">
                                I {' '}
                                <span className="inline-block min-w-[200px] text-foreground font-normal">
                                    {currentPhrase}
                                    <span className="animate-pulse">|</span>
                                </span>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom UI Elements - Keep exactly as is */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute bottom-8 md:bottom-12 left-[8vw] md:left-[10vw] lg:left-[12vw] right-[8vw] md:right-[10vw] lg:right-[12vw] flex justify-between items-end z-30"
            >
                <div className="text-xs md:text-sm text-foreground-muted uppercase tracking-widest">
                    Scroll to explore
                </div>
                <div className="text-xs md:text-sm text-foreground-muted uppercase tracking-widest">
                    Based in India
                </div>
            </motion.div>
        </section >
    );
}
