'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ContactSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section
            id="contact"
            ref={ref}
            className="min-h-screen flex items-center justify-center px-6 py-32"
        >
            <div className="max-w-3xl w-full text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-8 text-heading"
                >
                    Get in Touch
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-base mb-12"
                >
                    Open to discussing{' '}
                    <span className="keyword-systems semantic">systems architecture</span>,{' '}
                    <span className="keyword-backend semantic">backend engineering</span>, and analytical approaches to complex problems.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    <a
                        href="mailto:your.email@example.com"
                        className="group relative px-8 py-4 bg-transparent border-2 border-accent text-accent font-semibold tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:text-background w-full sm:w-auto"
                    >
                        <span className="relative z-10">Email</span>
                        <div className="absolute inset-0 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    </a>

                    <a
                        href="https://linkedin.com/in/yourprofile"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative px-8 py-4 bg-transparent border-2 border-accent text-accent font-semibold tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:text-background w-full sm:w-auto"
                    >
                        <span className="relative z-10">LinkedIn</span>
                        <div className="absolute inset-0 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    </a>

                    <a
                        href="https://github.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative px-8 py-4 bg-transparent border-2 border-accent text-accent font-semibold tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:text-background w-full sm:w-auto"
                    >
                        <span className="relative z-10">GitHub</span>
                        <div className="absolute inset-0 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    </a>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-24 pt-8 border-t border-accent/20"
                >
                    <p className="text-sm text-metadata">
                        Built with <span className="keyword-tech semantic">Next.js</span>,{' '}
                        <span className="keyword-tech semantic">Three.js</span>, and{' '}
                        <span className="keyword-tech semantic">Framer Motion</span>
                    </p>
                    <p className="text-xs text-metadata mt-2">
                        © 2026 Portfolio. Minimalist design, maximum depth.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
