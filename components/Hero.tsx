'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTypewriter } from '@/hooks/useTypewriter';

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Scroll-based image fade effect
    const { scrollY } = useScroll();
    const imageOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const imageY = useTransform(scrollY, [0, 400], [0, 100]);

    const typewriterPhrases = [
        'do programming.',
        'learn system architecture.',
        'make fintech projects.',
        'like making projects.',
        'love reading.',
        'explore.',
        'write.'
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

            {/* Full-screen image overlay that dissolves on scroll */}
            <motion.div
                className="fixed inset-0 z-20 pointer-events-none"
                style={{
                    opacity: imageOpacity,
                    y: imageY,
                }}
            >
                <Image
                    src="/images/image1.png"
                    alt="Devansh Kumar"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                />
            </motion.div>

            {/* Main Content Container with SUBSTANTIAL left padding */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-[12vw] md:px-[15vw] lg:px-[20vw] pl-[15vw] md:pl-[18vw] lg:pl-[22vw]">
                <div className="grid grid-cols-12 gap-8 items-center">
                    {/* Text Block - Substantial gap from left edge */}
                    <div className="col-span-12 md:col-span-10 lg:col-span-8 pl-8 md:pl-12 lg:pl-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
        </section>
    );
}
