'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function WritingSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const writings = [
        {
            title: 'SIMPLY UNIVERSE',
            type: 'Published Work',
            description: 'Author',
        },
        {
            title: 'The Hidden Symphony of Complexity',
            subtitle: 'Emergence, Consciousness, and the Cosmic Dance',
            type: 'Ongoing Research',
            description: 'Current work in progress',
        },
        {
            title: 'Daily Analytical Writing',
            type: 'Personal Discipline',
            description: 'Long-form analytical writing practice',
        },
    ];

    return (
        <section
            id="writing"
            ref={ref}
            className="min-h-screen flex items-center justify-center px-6 py-32"
        >
            <div className="max-w-5xl w-full">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-12 text-center text-heading"
                >
                    Writing & Research
                </motion.h2>

                <div className="space-y-6">
                    {writings.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                            className="group bg-background/50 border border-accent/20 rounded-lg p-6 hover:border-accent/50 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold mb-2 text-heading group-hover:text-accent-bright transition-colors">
                                        {item.title}
                                    </h3>
                                    {item.subtitle && (
                                        <p className="text-sm text-metadata italic mb-2">
                                            {item.subtitle}
                                        </p>
                                    )}
                                    <p className="text-base">{item.description}</p>
                                </div>
                                <span className="text-xs font-semibold text-metadata px-3 py-1 bg-accent/10 rounded-full">
                                    {item.type}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Personal Framework */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-16 bg-gradient-to-br from-accent/10 to-transparent border border-accent/30 rounded-lg p-8"
                >
                    <h3 className="text-2xl font-semibold mb-4 text-heading">
                        Personal Framework
                    </h3>
                    <p className="text-lg mb-3 text-heading">
                        <span className="keyword-focus semantic">The Extremity Principle</span>
                    </p>
                    <p className="text-base leading-relaxed">
                        History and narratives shaped by dominant traits pushed beyond equilibrium
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
