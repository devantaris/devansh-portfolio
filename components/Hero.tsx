'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
            className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-24 overflow-hidden"
        >
            {/* Background parallax effect for space */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    transition: 'transform 0.1s linear',
                }}
            />

            {/* Main Content - LEFT Aligned (matching Edwin Le screenshot) */}
            <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-12 gap-8">
                {/* LEFT COLUMN - Text Block (cols 1-6) */}
                <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-4">
                            <span className="text-foreground-muted font-normal">Sup, I'm </span>
                            <span className="text-foreground">Devansh Kumar.</span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.2] mb-6 text-foreground-muted">
                            Backend-oriented engineer.
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="text-base md:text-lg text-foreground-muted leading-relaxed max-w-md">
                            Systems thinker.
                        </p>
                    </motion.div>
                </div>

                {/* RIGHT COLUMN - Reserved for space visuals (handled by background) */}
                <div className="col-span-12 md:col-span-6 lg:col-span-6 hidden md:block">
                    {/* Space visuals are in the background layer, this column provides layout structure */}
                </div>
            </div>

            {/* Bottom UI Elements */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute bottom-8 md:bottom-12 left-6 md:left-12 lg:left-24 right-6 md:right-12 lg:right-24 flex justify-between items-end"
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
