'use client';

import { useState } from 'react';
import { Tilt } from '@/components/ui/tilt';
import { Spotlight } from '@/components/ui/spotlight';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MultiLayerStarfield from '@/components/StarfieldBackground';
import NebulaBackground from '@/components/NebulaBackground';
import CustomCursor from '@/components/CustomCursor';

interface Project {
    id: number;
    title: string;
    description: string;
    tech: string[];
    image: string;
    gallery: string[];
    fullDescription: string;
}

export default function AllProjectsPage() {
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
        {
            id: 5,
            title: 'Microservices Architecture',
            description: 'Event-driven microservices platform with service mesh',
            tech: ['Java', 'Kafka', 'Istio', 'PostgreSQL'],
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
            ],
            fullDescription: 'Distributed microservices architecture with event sourcing and CQRS patterns. Includes circuit breakers, service discovery, and advanced observability.',
        },
        {
            id: 6,
            title: 'Data Pipeline',
            description: 'Real-time data processing pipeline handling TB/day',
            tech: ['Apache Spark', 'Airflow', 'S3', 'Redshift'],
            image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
            ],
            fullDescription: 'Scalable data pipeline processing terabytes of data daily. Features automated data quality checks, schema evolution, and multi-stage transformations.',
        },
        {
            id: 7,
            title: 'Authentication Service',
            description: 'OAuth2/OIDC compliant authentication microservice',
            tech: ['Node.js', 'Redis', 'PostgreSQL', 'JWT'],
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop',
            ],
            fullDescription: 'Enterprise-grade authentication service supporting SSO, MFA, and social login. Includes rate limiting, session management, and audit logging.',
        },
        {
            id: 8,
            title: 'CDN Infrastructure',
            description: 'Global content delivery network with edge caching',
            tech: ['CloudFlare', 'Nginx', 'Varnish', 'Terraform'],
            image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop',
            ],
            fullDescription: 'Global CDN with edge caching and dynamic content optimization. Reduces latency by 60% with intelligent routing and auto-scaling.',
        },
        {
            id: 9,
            title: 'CI/CD Platform',
            description: 'Automated deployment pipeline with zero-downtime releases',
            tech: ['Jenkins', 'Docker', 'Kubernetes', 'ArgoCD'],
            image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop',
            ],
            fullDescription: 'Fully automated CI/CD platform with blue-green deployments. Includes automated testing, security scanning, and rollback capabilities.',
        },
        {
            id: 10,
            title: 'Search Engine',
            description: 'Full-text search engine with ML-powered relevance',
            tech: ['Elasticsearch', 'Python', 'TensorFlow', 'Redis'],
            image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
            ],
            fullDescription: 'Advanced search engine with ML-powered ranking and personalization. Features autocomplete, faceted search, and semantic understanding.',
        },
    ];

    return (
        <main className="relative min-h-screen">
            <MultiLayerStarfield />
            <NebulaBackground />
            <CustomCursor />
            <Navigation />

            <div className="relative z-10 pt-32 pb-16 px-8 md:px-16">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mb-8 text-foreground-muted hover:text-accent transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>

                    {/* Page Header */}
                    <div className="mb-16">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-foreground">
                            All Projects
                        </h1>
                        <p className="text-xl text-foreground-muted max-w-2xl">
                            A comprehensive showcase of systems, platforms, and tools I've built.
                        </p>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div key={project.id} className="aspect-[4/5]">
                                <Tilt
                                    rotationFactor={6}
                                    isRevese
                                    springOptions={{
                                        stiffness: 26.7,
                                        damping: 4.1,
                                        mass: 0.2,
                                    }}
                                    className="group relative rounded-2xl cursor-pointer h-full"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <Spotlight
                                        className="z-10 from-accent/50 via-accent/20 to-accent/10 blur-2xl"
                                        size={200}
                                        springOptions={{
                                            stiffness: 26.7,
                                            damping: 4.1,
                                            mass: 0.2,
                                        }}
                                    />
                                    <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-background/40 backdrop-blur-sm flex flex-col">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="h-48 w-full object-cover grayscale duration-700 group-hover:grayscale-0"
                                        />
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold mb-2 text-foreground">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-foreground-muted mb-4 line-clamp-3 flex-1">
                                                {project.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.slice(0, 3).map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium"
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
                </div>
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-md border border-white/10 rounded-2xl p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-accent/10 hover:bg-accent/20 text-foreground transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                                {selectedProject.title}
                            </h2>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {selectedProject.gallery.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`${selectedProject.title} ${idx + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                ))}
                            </div>

                            <p className="text-lg text-foreground-muted mb-6 leading-relaxed">
                                {selectedProject.fullDescription}
                            </p>

                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-3 text-foreground">
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.tech.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium"
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
        </main>
    );
}
