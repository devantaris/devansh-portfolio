'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { skillCategories } from '@/lib/content';

interface DomainMetadata {
    index: string;
    accent: string;
    glowRgba: string;
    domainShort: string;
    titleMain: string;
    titleSub: string;
    tagline: string;
    highlight: string;
    specCode: string;
    skillTags: Record<string, string>;
}

const DOMAIN_METADATA: Record<string, DomainMetadata> = {
    frontend: {
        index: '01',
        accent: '#00f5ff',
        glowRgba: 'rgba(0, 245, 255, 0.18)',
        domainShort: 'FRONTEND',
        titleMain: 'Frontend',
        titleSub: '& Interface Architecture',
        tagline: 'High-refresh reactive interfaces, cross-platform client runtimes, fluid 120fps physics & strict typing.',
        highlight: '120FPS TARGET · ZERO CLS · REACTIVE STATE',
        specCode: 'SSR / HYBRID · HARDWARE ACCELERATED',
        skillTags: {
            'React': 'UI Core',
            'Next.js': 'App Router & SSR',
            'TypeScript': 'Strict Typed',
            'JavaScript': 'ESNext Standard',
            'Tailwind CSS': 'Atomic Styling',
            'Flutter': 'Cross-Platform',
            'Electron': 'Desktop Core',
            'Zustand': 'Atomic State',
        }
    },
    backend: {
        index: '02',
        accent: '#a0ff60',
        glowRgba: 'rgba(160, 255, 96, 0.18)',
        domainShort: 'BACKEND',
        titleMain: 'Backend',
        titleSub: '& Systems Engineering',
        tagline: 'High-throughput async endpoints, resilient microservices, low-level memory safety & event loops.',
        highlight: 'ASYNC I/O · STRICT TYPING · LOW LATENCY',
        specCode: 'EVENT LOOPS · MULTITHREADED EXECUTION',
        skillTags: {
            'Python': 'Async Core',
            'FastAPI': 'Sub-ms REST API',
            'Node.js': 'Event-Loop I/O',
            'C++': 'Systems / Algorithms',
            'C': 'Memory Management',
            'Java': 'OOP & Concurrency',
            'Dart': 'AOT Compiled',
        }
    },
    database: {
        index: '03',
        accent: '#ffaa00',
        glowRgba: 'rgba(255, 170, 0, 0.18)',
        domainShort: 'DATABASE',
        titleMain: 'Database',
        titleSub: '& Data Persistence',
        tagline: 'Relational schema modeling, in-memory sub-ms caching, real-time sync subscriptions & ACID consistency.',
        highlight: 'ACID COMPLIANT · SUB-MS CACHE · RLS SECURED',
        specCode: 'MVCC ISOLATION · ZERO LOSS REPLICATION',
        skillTags: {
            'PostgreSQL': 'Relational / ACID',
            'SQL': 'Declarative Engine',
            'Supabase': 'Postgres & RLS',
            'Firebase': 'NoSQL & Realtime',
            'Redis': 'In-Memory KV',
            'SQLite': 'Embedded Storage',
        }
    },
    devops: {
        index: '04',
        accent: '#c084fc',
        glowRgba: 'rgba(192, 132, 252, 0.18)',
        domainShort: 'ML & CLOUD',
        titleMain: 'ML, Data',
        titleSub: '& Cloud Infrastructure',
        tagline: 'Vectorized scientific computation, predictive model evaluation, containerization & edge CI/CD automation.',
        highlight: 'VECTORIZED NUMERICAL · CONTAINERIZED · CI/CD',
        specCode: 'DOCKER RUNTIME · GLOBAL EDGE CDN',
        skillTags: {
            'Scikit-learn': 'ML Estimators',
            'Pandas': 'DataFrames & ETL',
            'NumPy': 'Matrix Vector Math',
            'Docker': 'Container Runtime',
            'Git': 'Trunk-based VCS',
            'GitHub Actions': 'CI/CD Workflows',
            'Vercel': 'Global Edge Delivery',
        }
    }
};

export default function TechStack() {
    const [selectedTab, setSelectedTab] = useState<string>('all');
    const [layoutMode, setLayoutMode] = useState<'grid2x2' | 'row4'>('grid2x2');
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    const categories = skillCategories;

    const displayedCategories = selectedTab === 'all'
        ? categories
        : categories.filter((c) => c.id === selectedTab);

    return (
        <section
            id="stack"
            style={{
                padding: 'clamp(80px, 12vw, 150px) 0',
                background: '#020204',
                position: 'relative',
                overflow: 'hidden',
                scrollMarginTop: '100px',
            }}
        >
            {/* Ambient Background Radial Glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80vw',
                    maxWidth: '1200px',
                    height: '500px',
                    background: 'radial-gradient(ellipse at center, rgba(0, 245, 255, 0.08) 0%, rgba(160, 255, 96, 0.05) 35%, rgba(192, 132, 252, 0.04) 70%, transparent 100%)',
                    filter: 'blur(120px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/* Core Section Container — Aligned with Hero, AboutBento, and Experience */}
            <div
                style={{
                    maxWidth: '1320px',
                    margin: '0 auto',
                    padding: '0 clamp(24px, 6vw, 96px)',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                
                {/* ── Section Header ── */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '32px',
                        marginBottom: '36px',
                        alignItems: 'flex-end',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>
                                03 // ARCHITECTURAL ARSENAL
                            </span>
                            <div style={{ width: '32px', height: '1px', background: 'rgba(0, 245, 255, 0.25)' }} />
                        </div>
                        <h2
                            style={{
                                fontSize: 'clamp(36px, 5vw, 56px)',
                                fontWeight: 200,
                                marginTop: '4px',
                                color: '#fff',
                                letterSpacing: '-0.04em',
                                lineHeight: 1.1,
                            }}
                        >
                            Engineering <span className="text-void">Arsenal</span>.
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{
                            fontSize: '15px',
                            color: 'var(--foreground-muted)',
                            fontWeight: 300,
                            lineHeight: 1.7,
                            maxWidth: '460px',
                            margin: 0,
                        }}
                    >
                        Four specialized engineering tiers sitting side by side: client interfaces, asynchronous backend runtimes, distributed persistence, and automated cloud pipelines.
                    </motion.p>
                </div>

                {/* ── Controls Bar: Filter Pills + View Switcher ── */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        marginBottom: '32px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    {/* Domain Category Filter Tabs */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={() => setSelectedTab('all')}
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                letterSpacing: '0.08em',
                                padding: '6px 14px',
                                borderRadius: '99px',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                background: selectedTab === 'all' ? '#ffffff' : 'rgba(255, 255, 255, 0.03)',
                                color: selectedTab === 'all' ? '#000000' : 'rgba(255, 255, 255, 0.6)',
                                border: selectedTab === 'all' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.08)',
                                fontWeight: selectedTab === 'all' ? 700 : 400,
                                boxShadow: selectedTab === 'all' ? '0 0 16px rgba(255, 255, 255, 0.3)' : 'none',
                            }}
                        >
                            ALL DOMAINS ({categories.reduce((acc, c) => acc + c.skills.length, 0)})
                        </button>

                        {categories.map((cat) => {
                            const meta = DOMAIN_METADATA[cat.id] || { index: '00', accent: '#00f5ff', domainShort: cat.title };
                            const isActive = selectedTab === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedTab(cat.id)}
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '11px',
                                        letterSpacing: '0.08em',
                                        padding: '6px 14px',
                                        borderRadius: '99px',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease',
                                        background: isActive ? meta.accent : 'rgba(255, 255, 255, 0.03)',
                                        color: isActive ? '#000000' : 'rgba(255, 255, 255, 0.6)',
                                        border: isActive ? `1px solid ${meta.accent}` : '1px solid rgba(255, 255, 255, 0.08)',
                                        fontWeight: isActive ? 700 : 400,
                                        boxShadow: isActive ? `0 0 16px ${meta.accent}55` : 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: isActive ? '#000000' : meta.accent,
                                        }}
                                    />
                                    {meta.domainShort} ({cat.skills.length})
                                </button>
                            );
                        })}
                    </div>

                    {/* View Switcher (2x2 Grid vs 4-in-a-Row Panoramic) */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '3px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                    >
                        <button
                            onClick={() => setLayoutMode('grid2x2')}
                            title="2x2 Side-by-Side Grid"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                letterSpacing: '0.08em',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                border: 'none',
                                background: layoutMode === 'grid2x2' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                                color: layoutMode === 'grid2x2' ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                                fontWeight: layoutMode === 'grid2x2' ? 700 : 400,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            2 × 2 GRID
                        </button>
                        <button
                            onClick={() => setLayoutMode('row4')}
                            title="4-in-a-Row Panoramic"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                letterSpacing: '0.08em',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                border: 'none',
                                background: layoutMode === 'row4' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                                color: layoutMode === 'row4' ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                                fontWeight: layoutMode === 'row4' ? 700 : 400,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            4 IN A ROW
                        </button>
                    </div>
                </div>

                {/* ── SIDE-BY-SIDE CARDS CONTAINER ── */}
                <div
                    style={
                        displayedCategories.length === 1
                            ? { display: 'grid', gridTemplateColumns: '1fr', maxWidth: '720px', margin: '0 auto' }
                            : layoutMode === 'row4'
                            ? {
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
                                  gap: '20px',
                                  width: '100%',
                              }
                            : {
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))',
                                  gap: '24px',
                                  width: '100%',
                              }
                    }
                >
                    <AnimatePresence mode="popLayout">
                        {displayedCategories.map((category, idx) => {
                            const meta = DOMAIN_METADATA[category.id] || {
                                index: `0${idx + 1}`,
                                accent: '#00f5ff',
                                glowRgba: 'rgba(0, 245, 255, 0.18)',
                                domainShort: category.title,
                                titleMain: category.title,
                                titleSub: '',
                                tagline: 'Specialized domain technologies.',
                                highlight: 'OPERATIONAL',
                                specCode: 'STANDARD',
                                skillTags: {},
                            };

                            return (
                                <motion.div
                                    key={category.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                                    style={{
                                        position: 'relative',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        background: 'linear-gradient(165deg, rgba(14, 16, 26, 0.85) 0%, rgba(6, 7, 13, 0.95) 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        boxShadow: '0 12px 36px -10px rgba(0, 0, 0, 0.55)',
                                        overflow: 'hidden',
                                        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = `${meta.accent}66`;
                                        e.currentTarget.style.boxShadow = `0 16px 48px -12px ${meta.glowRgba}, 0 0 0 1px ${meta.accent}33`;
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                        e.currentTarget.style.boxShadow = '0 12px 36px -10px rgba(0, 0, 0, 0.55)';
                                        e.currentTarget.style.transform = 'none';
                                    }}
                                >
                                    {/* Top Laser Accent Strip */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: `linear-gradient(90deg, transparent 0%, ${meta.accent} 30%, ${meta.accent} 70%, transparent 100%)`,
                                            opacity: 0.75,
                                        }}
                                    />

                                    {/* Corner Radial Accent Flare */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '-50px',
                                            right: '-50px',
                                            width: '160px',
                                            height: '160px',
                                            borderRadius: '50%',
                                            background: meta.accent,
                                            filter: 'blur(50px)',
                                            opacity: 0.06,
                                            pointerEvents: 'none',
                                        }}
                                    />

                                    {/* ── Main Card Body ── */}
                                    <div style={{ padding: 'clamp(20px, 2.5vw, 28px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        
                                        {/* Card Header */}
                                        <div style={{ marginBottom: '18px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <span
                                                    style={{
                                                        fontFamily: 'var(--font-mono)',
                                                        fontSize: '9px',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.12em',
                                                        color: meta.accent,
                                                        border: `1px solid ${meta.accent}40`,
                                                        backgroundColor: `${meta.accent}14`,
                                                        padding: '3px 8px',
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    DOMAIN // {meta.index}
                                                </span>

                                                <span
                                                    style={{
                                                        fontFamily: 'var(--font-mono)',
                                                        fontSize: '9px',
                                                        color: 'rgba(255, 255, 255, 0.5)',
                                                        background: 'rgba(255, 255, 255, 0.04)',
                                                        border: '1px solid rgba(255, 255, 255, 0.06)',
                                                        padding: '3px 8px',
                                                        borderRadius: '4px',
                                                        letterSpacing: '0.06em',
                                                    }}
                                                >
                                                    {category.skills.length} PRODUCTION ENGINES
                                                </span>
                                            </div>

                                            {/* Domain Title with Clean White/Silver Hierarchy */}
                                            <h3
                                                style={{
                                                    fontFamily: 'var(--font-serif)',
                                                    fontSize: 'clamp(20px, 2vw, 24px)',
                                                    fontWeight: 300,
                                                    letterSpacing: '-0.02em',
                                                    color: '#ffffff',
                                                    margin: '0 0 6px 0',
                                                    lineHeight: 1.25,
                                                }}
                                            >
                                                {meta.titleMain}{' '}
                                                <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 300 }}>
                                                    {meta.titleSub}
                                                </span>
                                            </h3>

                                            {/* Tagline description */}
                                            <p
                                                style={{
                                                    fontSize: '12px',
                                                    color: 'rgba(255, 255, 255, 0.55)',
                                                    fontWeight: 300,
                                                    lineHeight: 1.55,
                                                    margin: 0,
                                                }}
                                            >
                                                {meta.tagline}
                                            </p>
                                        </div>

                                        {/* Skills Grid: 2 Columns, Zero Truncation, Generous Breathing Room */}
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                                                gap: '8px',
                                                margin: 'auto 0',
                                                paddingTop: '6px',
                                                paddingBottom: '14px',
                                            }}
                                        >
                                            {category.skills.map((skill) => {
                                                const tag = meta.skillTags[skill.name] || 'Core';
                                                const isHovered = hoveredSkill === skill.name;

                                                return (
                                                    <div
                                                        key={skill.name}
                                                        onMouseEnter={() => setHoveredSkill(skill.name)}
                                                        onMouseLeave={() => setHoveredSkill(null)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            gap: '8px',
                                                            padding: '7px 11px',
                                                            borderRadius: '8px',
                                                            background: isHovered ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.025)',
                                                            border: isHovered ? `1px solid ${meta.accent}88` : '1px solid rgba(255, 255, 255, 0.06)',
                                                            boxShadow: isHovered ? `0 0 12px ${meta.glowRgba}` : 'none',
                                                            transform: isHovered ? 'translateY(-1px)' : 'none',
                                                            transition: 'all 0.15s ease',
                                                            cursor: 'default',
                                                        }}
                                                    >
                                                        {/* Logo Icon & Name */}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                                            <div
                                                                style={{
                                                                    width: '22px',
                                                                    height: '22px',
                                                                    borderRadius: '5px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    background: 'rgba(5, 6, 12, 0.85)',
                                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                                    flexShrink: 0,
                                                                    padding: '3px',
                                                                }}
                                                            >
                                                                <Image
                                                                    src={skill.logoUrl}
                                                                    alt={skill.name}
                                                                    width={16}
                                                                    height={16}
                                                                    loading="lazy"
                                                                    unoptimized
                                                                    style={{ filter: 'brightness(1.15) contrast(1.05)' }}
                                                                />
                                                            </div>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: 600,
                                                                    color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
                                                                    letterSpacing: '-0.01em',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                {skill.name}
                                                            </span>
                                                        </div>

                                                        {/* Role Tag (Always 100% visible, never truncated) */}
                                                        <span
                                                            style={{
                                                                fontFamily: 'var(--font-mono)',
                                                                fontSize: '9px',
                                                                color: isHovered ? meta.accent : 'rgba(255, 255, 255, 0.45)',
                                                                letterSpacing: '0.04em',
                                                                whiteSpace: 'nowrap',
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>

                                    {/* ── Card Footer: Capabilities Spec Bar ── */}
                                    <div
                                        style={{
                                            padding: '10px 20px',
                                            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                            background: 'rgba(0, 0, 0, 0.35)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '10px',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.1em' }}>
                                                CAPABILITIES //
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '9px',
                                                    color: 'rgba(255, 255, 255, 0.75)',
                                                    letterSpacing: '0.05em',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {meta.highlight}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                            <span
                                                style={{
                                                    width: '5px',
                                                    height: '5px',
                                                    borderRadius: '50%',
                                                    backgroundColor: meta.accent,
                                                    boxShadow: `0 0 8px ${meta.accent}`,
                                                }}
                                            />
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.08em' }}>
                                                STABLE
                                            </span>
                                        </div>
                                    </div>

                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
