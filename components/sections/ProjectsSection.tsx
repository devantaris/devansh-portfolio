'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useCursorProximity } from '@/hooks/useCursorProximity';

export default function ProjectsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section
            id="projects"
            ref={ref}
            className="min-h-screen flex items-center justify-center px-6 py-20"
        >
            <div className="max-w-6xl w-full">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-12 text-center text-heading"
                >
                    Projects
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center text-base mb-12"
                >
                    <p className="text-lg">
                        Project details available upon request. Focus areas include:
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
                    <ProjectCard
                        title="Backend Systems"
                        description={<>Focus on <span className="keyword-systems semantic">scalability</span>, <span className="keyword-systems semantic">failure modes</span>, and <span className="keyword-systems semantic">system architecture</span></>}
                        index={0}
                        isInView={isInView}
                    />
                    <ProjectCard
                        title="Engineering Exercises"
                        description={<><span className="keyword-tech semantic">Flutter</span> projects as product + <span className="keyword-backend semantic">engineering</span> learning</>}
                        index={1}
                        isInView={isInView}
                    />
                    <ProjectCard
                        title="Hackathon Participation"
                        description={<>Post-event <span className="keyword-focus semantic">analysis</span> and learning extraction</>}
                        index={2}
                        isInView={isInView}
                    />
                </div>
            </div>
        </section>
    );
}

function ProjectCard({ title, description, index, isInView }: {
    title: string;
    description: React.ReactNode;
    index: number;
    isInView: boolean
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { proximity } = useCursorProximity(cardRef, 250);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            className="space-card rounded-lg p-8 cursor-pointer depth-layer proximity-glow"
            style={{
                transform: `translateZ(${proximity * 40}px) scale(${1 + proximity * 0.03})`,
                boxShadow: `
          0 0 ${20 + proximity * 30}px rgba(124, 111, 181, ${0.2 + proximity * 0.3}),
          0 0 ${40 + proximity * 40}px rgba(124, 111, 181, ${0.1 + proximity * 0.2}),
          0 0 ${60 + proximity * 50}px rgba(124, 111, 181, ${0.05 + proximity * 0.1})
        `,
            }}
        >
            {/* Inner glow on hover */}
            <div
                className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
                style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(124, 111, 181, ${proximity * 0.15}), transparent 70%)`,
                    opacity: proximity,
                }}
            />

            <h3 className="text-xl font-semibold mb-3 text-heading relative z-10">
                {title}
            </h3>
            <p className="text-base relative z-10">
                {description}
            </p>
        </motion.div>
    );
}
