'use client';

import { useState } from 'react';
import { Tilt } from './ui/tilt';
import { Spotlight } from './ui/spotlight';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

interface Project {
    id: number;
    title: string;
    description: string;
    tech: string[];
    image: string;
    gallery: string[];
    fullDescription: string;
}

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const projects: Project[] = [
        {
            id: 1,
            title: 'FinTech Platform',
            description: 'High-performance backend system for processing millions of transactions',
            tech: ['Go', 'PostgreSQL', 'Redis', 'Kubernetes'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop',
            ],
            fullDescription: 'A scalable fintech platform built to handle millions of daily transactions with sub-second latency. Implements distributed caching, real-time processing, and comprehensive audit logging for regulatory compliance.',
        },
        {
            id: 2,
            title: 'Distributed Cache',
            description: 'Custom distributed caching solution with automatic sharding',
            tech: ['Rust', 'Docker', 'Kubernetes', 'gRPC'],
            image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop',
            ],
            fullDescription: 'High-performance distributed caching system with automatic sharding and replication. Features consistent hashing, automatic failover, and real-time monitoring dashboards.',
        },
        {
            id: 3,
            title: 'API Gateway',
            description: 'Scalable API gateway handling 10K+ requests per second',
            tech: ['Node.js', 'MongoDB', 'AWS', 'Redis'],
            image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
            ],
            fullDescription: 'Enterprise API gateway with rate limiting, authentication, and comprehensive analytics. Supports multiple protocols including REST, GraphQL, and WebSocket.',
        },
        {
            id: 4,
            title: 'System Monitor',
            description: 'Real-time infrastructure monitoring and alerting platform',
            tech: ['Python', 'Grafana', 'Prometheus', 'Kafka'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
            ],
            fullDescription: 'Comprehensive monitoring solution for large-scale infrastructure. Includes custom metrics collection, anomaly detection, and intelligent alerting with PagerDuty integration.',
        },
    ];

    return (
        <section
            id="projects"
            className="relative"
            style={{
                background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%), #0B0F1A',
                paddingTop: '96px',
                paddingBottom: '96px',
            }}
        >
            {/* Max-width container: 1280px - 12 column grid */}
            <div
                className="mx-auto"
                style={{
                    maxWidth: '1280px',
                    paddingLeft: '96px',
                    paddingRight: '96px',
                }}
            >
                {/* Section Header - Aligned to grid column 1 */}
                <div style={{ marginBottom: '64px' }}>
                    <h2
                        className="font-bold tracking-tight"
                        style={{
                            fontSize: '56px',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em',
                            marginBottom: '16px',
                            color: '#FFFFFF',
                        }}
                    >
                        Featured Projects
                    </h2>
                    <p
                        style={{
                            fontSize: '18px',
                            lineHeight: '1.6',
                            color: 'rgba(255, 255, 255, 0.6)',
                            maxWidth: '600px',
                        }}
                    >
                        Building systems that scale, perform, and solve real problems.
                    </p>
                </div>

                {/* Strict 2x2 Grid - Equal dimensions */}
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '32px',
                        marginBottom: '64px',
                    }}
                >
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            style={{
                                aspectRatio: '16/9',
                            }}
                        >
                            <Tilt
                                rotationFactor={6}
                                isRevese
                                style={{
                                    transformOrigin: 'center center',
                                    height: '100%',
                                }}
                                springOptions={{
                                    stiffness: 26.7,
                                    damping: 4.1,
                                    mass: 0.2,
                                }}
                                className="group relative cursor-pointer"
                                onClick={() => setSelectedProject(project)}
                            >
                                <Spotlight
                                    className="z-10 from-violet-500/30 via-violet-500/10 to-transparent blur-3xl"
                                    size={248}
                                    springOptions={{
                                        stiffness: 26.7,
                                        damping: 4.1,
                                        mass: 0.2,
                                    }}
                                />
                                <div
                                    className="relative h-full overflow-hidden"
                                    style={{
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        background: 'rgba(15, 23, 42, 0.5)',
                                        backdropFilter: 'blur(8px)',
                                        boxShadow: '0 0 40px rgba(139, 92, 246, 0.1)',
                                    }}
                                >
                                    {/* Image - Full width */}
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full object-cover grayscale duration-700 group-hover:grayscale-0"
                                        style={{
                                            height: '192px',
                                        }}
                                    />

                                    {/* Text block - Equal padding */}
                                    <div style={{ padding: '32px' }}>
                                        {/* Title - Semi-bold */}
                                        <h3
                                            className="font-semibold"
                                            style={{
                                                fontSize: '24px',
                                                lineHeight: '1.3',
                                                marginBottom: '8px',
                                                color: '#FFFFFF',
                                            }}
                                        >
                                            {project.title}
                                        </h3>

                                        {/* Description - Regular */}
                                        <p
                                            className="line-clamp-2"
                                            style={{
                                                fontSize: '15px',
                                                lineHeight: '1.6',
                                                marginBottom: '16px',
                                                color: 'rgba(255, 255, 255, 0.6)',
                                            }}
                                        >
                                            {project.description}
                                        </p>

                                        {/* Tech tags - Single horizontal row */}
                                        <div
                                            className="flex flex-wrap"
                                            style={{ gap: '8px' }}
                                        >
                                            {project.tech.slice(0, 3).map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '12px',
                                                        background: 'rgba(139, 92, 246, 0.15)',
                                                        color: 'rgba(167, 139, 250, 1)',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Tilt>
                        </div>
                    ))}
                </div>

                {/* Button - Centered, equal spacing */}
                <div
                    className="flex justify-center"
                    style={{
                        marginTop: '64px',
                    }}
                >
                    <Link
                        href="/projects"
                        className="group inline-flex items-center"
                        style={{
                            padding: '16px 32px',
                            borderRadius: '9999px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            color: 'rgba(167, 139, 250, 1)',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.3s',
                            gap: '8px',
                        }}
                    >
                        <span>See All Projects</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-h-[90vh] overflow-y-auto"
                            style={{
                                maxWidth: '1024px',
                                background: 'rgba(15, 23, 42, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '24px',
                                padding: '48px',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Title */}
                            <h2
                                className="font-bold"
                                style={{
                                    fontSize: '40px',
                                    lineHeight: '1.2',
                                    marginBottom: '32px',
                                    color: '#FFFFFF',
                                }}
                            >
                                {selectedProject.title}
                            </h2>

                            {/* Gallery */}
                            <div
                                className="grid grid-cols-3"
                                style={{
                                    gap: '16px',
                                    marginBottom: '32px',
                                }}
                            >
                                {selectedProject.gallery.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`${selectedProject.title} ${idx + 1}`}
                                        className="w-full object-cover"
                                        style={{
                                            height: '160px',
                                            borderRadius: '12px',
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Description */}
                            <p
                                style={{
                                    fontSize: '18px',
                                    lineHeight: '1.7',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    marginBottom: '32px',
                                }}
                            >
                                {selectedProject.fullDescription}
                            </p>

                            {/* Tech Stack */}
                            <div>
                                <h3
                                    className="font-semibold"
                                    style={{
                                        fontSize: '20px',
                                        marginBottom: '16px',
                                        color: '#FFFFFF',
                                    }}
                                >
                                    Tech Stack
                                </h3>
                                <div
                                    className="flex flex-wrap"
                                    style={{ gap: '8px' }}
                                >
                                    {selectedProject.tech.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                padding: '10px 20px',
                                                borderRadius: '12px',
                                                background: 'rgba(139, 92, 246, 0.15)',
                                                color: 'rgba(167, 139, 250, 1)',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Responsive mobile styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    section > div {
                        padding-left: 24px !important;
                        padding-right: 24px !important;
                    }
                    section > div > div:first-child h2 {
                        font-size: 36px !important;
                    }
                    section > div > div:nth-child(2) {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
}
