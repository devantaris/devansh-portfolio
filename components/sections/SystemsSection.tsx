'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SystemsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const interests = [
        {
            title: 'Interests',
            items: [
                'Astronomy and large-scale systems',
                'Philosophy and existential literature',
                'Systems thinking across domains',
            ],
        },
        {
            title: 'Organizations & Roles',
            items: [
                'IEEE member (college chapter)',
                'Participation driven by learning and exposure, not certificates',
            ],
        },
        {
            title: 'What I Intentionally Avoid',
            items: [
                'Tool-centric identity',
                'Superficial full-stack labeling',
                'Motivational fluff',
                'Building without understanding constraints',
            ],
        },
    ];

    return (
        <section
            id="systems"
            ref={ref}
            className="min-h-screen flex items-center justify-center px-6 py-24"
        >
            <div className="max-w-5xl w-full">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-12 text-center"
                >
                    <span className="text-accent">Systems</span> & Thinking
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {interests.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                            className="bg-background/50 border border-accent/20 rounded-lg p-6 hover:border-accent/50 transition-colors duration-300"
                        >
                            <h3 className="text-lg font-semibold mb-4 text-accent-bright">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.items.map((item, i) => (
                                    <li key={i} className="text-sm text-foreground-muted leading-relaxed">
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Quote-style section for philosophy */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center border-l-4 border-accent pl-8 py-6"
                >
                    <p className="text-xl italic text-foreground-muted mb-4">
                        "Minimalism over decoration. Interaction over animation. Depth over breadth."
                    </p>
                    <p className="text-sm text-accent">— Design Philosophy</p>
                </motion.div>
            </div>
        </section>
    );
}
