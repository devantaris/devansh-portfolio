'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    // Glass card style
    const glassCardClass = "bg-[#0a0a0f]/40 backdrop-blur-xl border border-white/5 rounded-xl p-8 hover:border-accent/20 transition-all duration-500 shadow-xl";

    const techStack = {
        languages: ['C', 'C++', 'Java', 'Python', 'Kotlin'],
        mobile: ['Flutter', 'Android Studio', 'Gradle'],
        backend: ['Git', 'GitHub', 'MySQL']
    };

    return (
        <section
            id="about"
            ref={ref}
            className="min-h-screen flex items-center justify-center px-6 py-32"
        >
            <div className="max-w-7xl w-full">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-20 text-left text-heading"
                >
                    About
                </motion.h2>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* LEFT COLUMN (4 cols ~ 33%) - Narrative */}
                    <div className="lg:col-span-4 space-y-12 sticky top-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h3 className="text-sm font-bold text-metadata tracking-widest uppercase">
                                Profile
                            </h3>
                            <p className="text-xl leading-relaxed text-base font-light">
                                I am a 2nd year <span className="keyword-tech semantic">B.Tech CSE</span> student at{' '}
                                <span className="text-heading">Bennett University</span>.
                                My orientation is towards <span className="keyword-systems semantic">systems thinking</span> and{' '}
                                <span className="keyword-backend semantic">backend engineering</span>, balancing analytical depth with functional execution.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <h3 className="text-sm font-bold text-metadata tracking-widest uppercase">
                                Focus
                            </h3>
                            <p className="text-lg leading-relaxed text-base font-light">
                                I prioritize <span className="keyword-focus semantic">mental models</span> over tools.
                                My current trajectory involves deepening rigorous fundamentals in{' '}
                                <span className="keyword-tech semantic">DSA</span>,{' '}
                                <span className="keyword-systems semantic">OS</span>, and{' '}
                                <span className="keyword-systems semantic">system architecture</span>.
                            </p>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN (8 cols ~ 66%) - Glass Cards */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Academic */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className={glassCardClass}
                        >
                            <span className="text-xs font-mono text-accent-bright mb-4 block">01 / ACADEMIC</span>
                            <h3 className="text-2xl font-semibold text-heading mb-6">
                                Academic Background
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-metadata mb-2">Degree</p>
                                    <p className="text-lg text-base">
                                        <span className="keyword-tech semantic">B.Tech</span> in Computer Science & Engineering
                                    </p>
                                </div>
                                <div>
                                    <p className="text-metadata mb-2">Core Subjects</p>
                                    <p className="text-lg text-base">
                                        <span className="keyword-tech semantic">DSA (C++)</span>,{' '}
                                        <span className="keyword-backend semantic">Software Engineering</span>,{' '}
                                        <span className="keyword-systems semantic">OS</span>,{' '}
                                        <span className="keyword-backend semantic">DBMS</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tech Stack - Pill Tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className={glassCardClass}
                        >
                            <span className="text-xs font-mono text-accent-bright mb-4 block">02 / ARSENAL</span>
                            <h3 className="text-2xl font-semibold text-heading mb-8">
                                Tools & Environments
                            </h3>

                            <div className="space-y-8">
                                {/* Languages */}
                                <div>
                                    <h4 className="text-sm text-metadata mb-4 uppercase tracking-wider">Languages</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {techStack.languages.map(tech => (
                                            <span key={tech} className="px-4 py-2 bg-white/5 rounded-full text-sm hover:bg-white/10 transition-colors border border-white/5 text-base keyword-tech">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Mobile */}
                                <div>
                                    <h4 className="text-sm text-metadata mb-4 uppercase tracking-wider">Mobile / App</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {techStack.mobile.map(tech => (
                                            <span key={tech} className="px-4 py-2 bg-white/5 rounded-full text-sm hover:bg-white/10 transition-colors border border-white/5 text-base keyword-tech">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Backend */}
                                <div>
                                    <h4 className="text-sm text-metadata mb-4 uppercase tracking-wider">Backend / Systems</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {techStack.backend.map(tech => (
                                            <span key={tech} className="px-4 py-2 bg-white/5 rounded-full text-sm hover:bg-white/10 transition-colors border border-white/5 text-base keyword-backend">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Strengths */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className={glassCardClass}
                        >
                            <span className="text-xs font-mono text-accent-bright mb-4 block">03 / TRAIT</span>
                            <h3 className="text-2xl font-semibold text-heading mb-6">
                                Strengths
                            </h3>
                            <ul className="grid md:grid-cols-2 gap-4 text-base">
                                <li className="flex items-center space-x-3">
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                    <span>High <span className="keyword-focus semantic">analytical bandwidth</span></span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                    <span>Comfort with <span className="keyword-systems semantic">abstraction</span></span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                    <span><span className="keyword-focus semantic">Self-directed</span> learning</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                    <span>Long <span className="keyword-focus semantic">attention span</span></span>
                                </li>
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
