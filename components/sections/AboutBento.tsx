'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 30 } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: '-100px' } as const,
    transition: { duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function AboutBento() {
    return (
        <section id="about" style={{ padding: 'clamp(100px, 15vw, 200px) 0', position: 'relative', background: '#020204' }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
                
                {/* Asymmetric Spacious Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', 
                    gap: '100px',
                    alignItems: 'flex-start'
                }}>
                    
                    {/* Left Column: Monochrome Portrait Profile */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                        
                        <motion.div {...fadeUp(0)}>
                            <span className="mono-tag">02 // PROFILE_INDEX</span>
                            <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 200, marginTop: '8px', color: '#fff', letterSpacing: '-0.04em' }}>
                                Architecting <br />
                                structural bounds.
                            </h2>
                        </motion.div>

                        {/* Real photo devansh-award.png in a premium sleek crop */}
                        <motion.div 
                            {...fadeUp(0.15)}
                            style={{ 
                                position: 'relative', 
                                width: '100%', 
                                height: '360px', 
                                overflow: 'hidden', 
                                border: '1px solid var(--border)',
                                background: '#07070b'
                            }}
                        >
                            <Image
                                src="/images/devansh-award.png"
                                alt="Devansh Kumar Academic Recognition at Bennett University"
                                fill
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center 30%',
                                    filter: 'grayscale(100%) contrast(1.1) brightness(0.95)' // Luxury desaturated portrait
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '8px 12px',
                                background: 'linear-gradient(to top, rgba(2,2,4,0.95), transparent)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '8px',
                                color: 'var(--accent-cyan)',
                                letterSpacing: '0.1em'
                            }}>
                                // BENNETT UNIVERSITY · ACADEMIC RECOGNITION
                            </div>
                        </motion.div>

                        <motion.p 
                            {...fadeUp(0.2)}
                            style={{ fontSize: '15px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.7, margin: 0, fontFamily: 'var(--font-sans)', maxWidth: '440px' }}
                        >
                            B.Tech Computer Science student at Bennett University (CGPA 8.75/10.0). Architecting high-throughput backend services, cryptographic pipelines, and uncertainty-aware ML frameworks.
                        </motion.p>
                    </div>

                    {/* Right Column: Spaced out parameters and values */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', paddingTop: '40px' }}>
                        
                        {/* Biography Block */}
                        <motion.div {...fadeUp(0.1)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <span className="mono-tag">THE_INTENT</span>
                            <p style={{ fontSize: '16px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.8, margin: 0 }}>
                                I design computational tools for complex operations. As the Chairperson of the IEEE Student Branch at Bennett University, I lead and coordinate a 100+ member vertical structure to construct software products, secure sponsorships (₹1.48L+), and spearhead international events like the Global AI Summit 2.0 (3,000–4,000+ attendees) and Triverse 3.0. First-author of a research manuscript on staged uncertainty-aware fraud decisioning targeting IEEE TDSC.
                            </p>
                        </motion.div>

                        {/* Engineering Values Block */}
                        <motion.div {...fadeUp(0.2)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <span className="mono-tag">DECISIONAL_PRINCIPLES</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { title: 'SYSTEMS OVER PREDICTIONS', desc: 'Models fail; structural bounds must insulate against mathematical thresholds.' },
                                    { title: 'ARCHITECTURE BEFORE CODE', desc: 'Establish strict structural interfaces before allocating computing stacks.' },
                                    { title: 'FAILURE BY DESIGN', desc: 'Optimize loops exclusively for non-ideal, catastrophic coordinates.' },
                                    { title: 'QUANTIFIED BOUNDARIES', desc: 'Explicitly balance execution latency thresholds against memory scale bounds.' }
                                ].map((value, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: '#fff' }}>
                                            // {value.title}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: 300, paddingLeft: '20px' }}>
                                            {value.desc}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Production Nodes Index */}
                        <motion.div {...fadeUp(0.3)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <span className="mono-tag">PRODUCTION_NODES_BUILT</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {[
                                    'Risk Engines', 'Desktop Micro-wrappers', 'Credit Economies', 'Secure Auth Matrices',
                                    'FastAPI REST Architectures', '60fps Mobile Clients', 'Calibrated ML Booststraps'
                                ].map((tag, idx) => (
                                    <span 
                                        key={idx}
                                        style={{ 
                                            fontFamily: 'var(--font-mono)', 
                                            fontSize: '9px', 
                                            padding: '4px 12px', 
                                            border: '1px solid var(--border)', 
                                            color: 'var(--foreground-muted)' 
                                        }}
                                    >
                                        {tag.toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                    </div>

                </div>
            </div>
        </section>
    );
}
