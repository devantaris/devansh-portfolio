'use client';

import { motion } from 'framer-motion';

const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 30 } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: '-100px' } as const,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const principles = [
    { text: 'Risk-aware fraud architecture', type: 'CORE' },
    { text: 'Cost-sensitive modeling', type: 'MATH' },
    { text: 'Consequence-weighted thresholds', type: 'DECISION' },
    { text: 'EDA-driven reasoning systems', type: 'LOGIC' },
    { text: 'Layered decision node pipelines', type: 'ARCH' },
    { text: 'The Extremity Principle', type: 'THEORY' },
    { text: 'SIMPLY UNIVERSE - published book', type: 'LIT' },
    { text: 'IEEE Bennett Chairperson', type: 'LEAD' },
];

export default function AboutBento() {
    return (
        <section id="about" style={{ padding: 'clamp(80px, 12vw, 160px) 0', position: 'relative' }}>
            {/* Background elements */}
            <div style={{
                position: 'absolute', top: '40%', right: '5%', width: '40vw', height: '40vw',
                background: 'radial-gradient(circle, rgba(0, 245, 255, 0.02) 0%, transparent 60%)',
                opacity: 0.8, filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
            }} />

            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 96px)', position: 'relative', zIndex: 1 }}>
                
                {/* Section Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '64px', alignItems: 'flex-end' }}>
                    <motion.div {...fadeUp(0)}>
                        <span className="mono-tag" style={{ color: 'var(--accent-purple)' }}>02 // DIAGNOSTIC PROFILE</span>
                        <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
                            Architecting <br />
                            The <span className="text-science">Void</span>.
                        </h2>
                    </motion.div>
                    <motion.p 
                        {...fadeUp(0.1)} 
                        style={{ fontSize: '15px', color: 'var(--foreground-muted)', lineHeight: 1.7, maxWidth: '480px', margin: 0, fontFamily: 'var(--font-sans)' }}
                    >
                        An engineer obsessed with system design. Building full-stack platforms, high-throughput fraud filters, gamified applications, and local-first microservices. INTJ reasoning applied to production pipelines.
                    </motion.p>
                </div>

                {/* Asymmetric Overlapping Grid Layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* First Row: 2 unequal columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '20px' }}>
                        
                        {/* Biography / Intent Box */}
                        <motion.div 
                            {...fadeUp(0.15)} 
                            className="telemetry-box" 
                            style={{ 
                                padding: '48px', 
                                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 100%)' 
                            }}
                        >
                            <span className="mono-tag">BIOGRAPHY_TELEMETRY</span>
                            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: '16px 0', letterSpacing: '-0.02em' }}>
                                Who is Devansh Kumar?
                            </h3>
                            <p style={{ fontSize: '15px', color: 'var(--foreground-muted)', lineHeight: 1.8, marginBottom: '24px' }}>
                                I construct computational tools. My work merges ML optimization pipelines, scalable relational database designs, and immersive visual layouts. I serve as the Chairperson of the IEEE Student Branch at Bennett University, leading over 100 developers in building local systems and global tech summits.
                            </p>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px', background: 'rgba(255,255,255,0.01)', flex: '1 1 120px' }}>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-cyan)' }}>100+</div>
                                    <div className="mono-tag" style={{ fontSize: '8px', color: 'var(--foreground-muted)' }}>MEMBERS_MANAGED</div>
                                </div>
                                <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px', background: 'rgba(255,255,255,0.01)', flex: '1 1 120px' }}>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-purple)' }}>₹1.48L+</div>
                                    <div className="mono-tag" style={{ fontSize: '8px', color: 'var(--foreground-muted)' }}>SPONSORSHIPS_SECURED</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Engineering Philosophy List */}
                        <motion.div 
                            {...fadeUp(0.25)} 
                            className="telemetry-box offset-down" 
                            style={{ 
                                padding: '48px', 
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                background: 'linear-gradient(135deg, rgba(189, 0, 255, 0.01) 0%, transparent 100%)' 
                            }}
                        >
                            <span className="mono-tag">ENGINEERING_PHILOSOPHY</span>
                            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: '16px 0', letterSpacing: '-0.02em' }}>
                                Decisional Reasoning
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {[
                                    { title: 'SYSTEMS OVER PREDICTIONS', desc: 'Models fail; architecture should insulate against mathematical thresholds.' },
                                    { title: 'ARCHITECTURE BEFORE CODE', desc: 'Draft clean systems bounds before allocating computing stacks.' },
                                    { title: 'FAILURE BY DESIGN', desc: 'Optimize pipelines for the non-ideal, catastrophic boundary cases.' },
                                    { title: 'EXPLICIT TRADE-OFF WEIGHTS', desc: 'Balance scale bottlenecks against memory boundaries quantitatively.' }
                                ].map((phil, i) => (
                                    <li key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: '#fff' }}>
                                            <span style={{ width: '4px', height: '4px', background: 'var(--accent-purple)', borderRadius: '50%' }} />
                                            {phil.title}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--foreground-muted)', paddingLeft: '12px' }}>
                                            {phil.desc}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                    </div>

                    {/* Second Row: Overlapping wider boxes */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '20px', marginTop: '40px' }}>
                        
                        {/* Proof of Thinking Matrix */}
                        <motion.div 
                            {...fadeUp(0.35)} 
                            className="telemetry-box" 
                            style={{ 
                                padding: '48px', 
                                flex: '2 1 600px',
                                background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.015) 0%, transparent 100%)'
                            }}
                        >
                            <span className="mono-tag">PROOF_OF_THINKING</span>
                            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: '16px 0', letterSpacing: '-0.02em' }}>
                                Active Principles
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                {principles.map((p, i) => (
                                    <div key={i} style={{ border: '1px solid rgba(255,255,255,0.05)', padding: '16px', background: 'rgba(255,255,255,0.015)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>
                                            [{p.type}]
                                        </span>
                                        <span style={{ fontSize: '13px', color: '#f6f5fa', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
                                            {p.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Systems Built Grid */}
                        <motion.div 
                            {...fadeUp(0.4)} 
                            className="telemetry-box offset-up" 
                            style={{ 
                                padding: '48px', 
                                flex: '1 1 400px',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, transparent 100%)'
                            }}
                        >
                            <span className="mono-tag">SYSTEMS_BUILD_INDEX</span>
                            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: '16px 0', letterSpacing: '-0.02em' }}>
                                Production Nodes
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {[
                                    'Risk Engines', 'Desktop Applications', 'Credit Economics', 'Authentication Nodes',
                                    'Data Telemetry Dashboards', 'Cross-Platform Mobile Apps', 'REST APIs', 'Fraud Detection Models',
                                    'Agile Sprint Cycles', 'IEEE Conference Directives'
                                ].map((tag, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '10px',
                                            padding: '8px 16px',
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            border: '1px solid rgba(255, 255, 255, 0.06)',
                                            borderRadius: '0px',
                                            color: '#fff',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                                            e.currentTarget.style.background = 'rgba(0, 245, 255, 0.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                        }}
                                    >
                                        {tag}
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
