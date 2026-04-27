'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const categories = [
    {
        id: 'languages',
        title: 'Core Languages',
        icon: '⚡',
        skills: [
            { name: 'Python', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
            { name: 'TypeScript', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
            { name: 'JavaScript', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
            { name: 'C++', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
            { name: 'C', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
            { name: 'Java', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
            { name: 'Dart', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
        ]
    },
    {
        id: 'frameworks',
        title: 'Frameworks & Libraries',
        icon: '⚛️',
        skills: [
            { name: 'React', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
            { name: 'Next.js', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
            { name: 'FastAPI', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
            { name: 'Node.js', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
            { name: 'Flutter', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
            { name: 'Electron', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg' },
            { name: 'Tailwind CSS', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
            { name: 'Zustand', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/zustand/zustand-original.svg' },
        ]
    },
    {
        id: 'backend',
        title: 'Backend & Databases',
        icon: '🗄️',
        skills: [
            { name: 'PostgreSQL', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
            { name: 'SQL', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg' },
            { name: 'Firebase', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' },
            { name: 'Supabase', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
            { name: 'Redis', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
            { name: 'SQLite', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
        ]
    },
    {
        id: 'devops',
        title: 'ML, Data & DevOps',
        icon: '🧠',
        skills: [
            { name: 'Scikit-learn', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg' },
            { name: 'Pandas', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
            { name: 'NumPy', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
            { name: 'Docker', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
            { name: 'Git', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
            { name: 'GitHub Actions', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg' },
            { name: 'Vercel', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
        ]
    }
];

const OrbitalConstellation = () => {
    // All skills flattened
    const allSkills = categories.flatMap(c => c.skills);
    
    // Create 3 orbit rings
    const ring1 = allSkills.slice(0, 8);
    const ring2 = allSkills.slice(8, 18);
    const ring3 = allSkills.slice(18);

    return (
        <div style={{ position: 'relative', width: '100%', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* Inline styles for keyframes to ensure they work component-level */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
                .orbit-ring { position: absolute; border-radius: 50%; border: 1px dashed rgba(255,255,255,0.1); }
                .orbit-animate-1 { animation: spin 40s linear infinite; }
                .orbit-animate-2 { animation: spin-reverse 50s linear infinite; }
                .orbit-animate-3 { animation: spin 60s linear infinite; }
                .orbit-item { position: absolute; transform-origin: center; animation: spin-reverse 40s linear infinite; }
                .orbit-item-2 { position: absolute; transform-origin: center; animation: spin 50s linear infinite; }
                .orbit-item-3 { position: absolute; transform-origin: center; animation: spin-reverse 60s linear infinite; }
            `}} />

            {/* Core */}
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-cyan) 0%, var(--accent-purple) 100%)', boxShadow: '0 0 40px var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <span style={{ fontWeight: 800, fontSize: '12px', color: '#000' }}>CORE</span>
            </div>

            {/* Ring 1 */}
            <div className="orbit-ring orbit-animate-1" style={{ width: '250px', height: '250px' }}>
                {ring1.map((skill, i) => {
                    const angle = (i / ring1.length) * 360;
                    return (
                        <div key={skill.name} className="orbit-item" style={{ 
                            top: '50%', left: '50%', 
                            marginTop: '-20px', marginLeft: '-20px',
                            transform: `rotate(${angle}deg) translateX(125px) rotate(-${angle}deg)` 
                        }}>
                            <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }} title={skill.name}>
                                <Image src={skill.logoUrl} alt={skill.name} width={24} height={24} unoptimized style={{ filter: 'brightness(1.2)' }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ring 2 */}
            <div className="orbit-ring orbit-animate-2" style={{ width: '400px', height: '400px' }}>
                {ring2.map((skill, i) => {
                    const angle = (i / ring2.length) * 360;
                    return (
                        <div key={skill.name} className="orbit-item-2" style={{ 
                            top: '50%', left: '50%', 
                            marginTop: '-20px', marginLeft: '-20px',
                            transform: `rotate(${angle}deg) translateX(200px) rotate(-${angle}deg)` 
                        }}>
                            <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }} title={skill.name}>
                                <Image src={skill.logoUrl} alt={skill.name} width={24} height={24} unoptimized style={{ filter: 'brightness(1.2)' }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ring 3 */}
            <div className="orbit-ring orbit-animate-3" style={{ width: '550px', height: '550px' }}>
                {ring3.map((skill, i) => {
                    const angle = (i / ring3.length) * 360;
                    return (
                        <div key={skill.name} className="orbit-item-3" style={{ 
                            top: '50%', left: '50%', 
                            marginTop: '-20px', marginLeft: '-20px',
                            transform: `rotate(${angle}deg) translateX(275px) rotate(-${angle}deg)` 
                        }}>
                            <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }} title={skill.name}>
                                <Image src={skill.logoUrl} alt={skill.name} width={24} height={24} unoptimized style={{ filter: 'brightness(1.2)' }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CyberTerminal = () => {
    const [activeTab, setActiveTab] = useState(categories[0].id);
    const activeCategory = categories.find(c => c.id === activeTab) || categories[0];

    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', height: '500px', borderRadius: '12px', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            
            {/* Terminal Header */}
            <div style={{ background: '#111116', padding: '12px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'center', fontSize: '13px', color: '#8b8b99', fontFamily: 'monospace' }}>
                    devansh@antigravity: ~/stack
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar */}
                <div style={{ width: '250px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '20px 0' }}>
                    <div style={{ padding: '0 20px', marginBottom: '16px', fontSize: '11px', textTransform: 'uppercase', color: '#52525b', fontWeight: 700, letterSpacing: '0.1em' }}>Directories</div>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '10px 20px',
                                background: activeTab === cat.id ? 'rgba(0,240,255,0.1)' : 'transparent',
                                borderLeft: activeTab === cat.id ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                                color: activeTab === cat.id ? '#fff' : '#a1a1aa',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <span>{cat.icon}</span> {cat.title}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, padding: '30px', background: '#050508', fontFamily: 'monospace', overflowY: 'auto' }}>
                    <div style={{ color: 'var(--accent-cyan)', marginBottom: '20px' }}>
                        $ ls -la ./{activeTab}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            {activeCategory.skills.map((skill, idx) => (
                                <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ color: '#52525b' }}>drwxr-xr-x</span>
                                    <span style={{ color: '#8b8b99' }}>devansh</span>
                                    <span style={{ color: '#8b8b99' }}>staff</span>
                                    <span style={{ color: '#8b8b99', width: '40px', textAlign: 'right' }}>{1024 * (idx + 1)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px' }}>
                                        <Image src={skill.logoUrl} alt={skill.name} width={16} height={16} unoptimized style={{ filter: 'grayscale(100%) brightness(2)' }} />
                                        <span style={{ color: '#fff', fontSize: '15px' }}>{skill.name}</span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                    <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#27c93f' }}>➜</span>
                        <span style={{ color: 'var(--accent-cyan)' }}>~/{activeTab}</span>
                        <motion.span 
                            animate={{ opacity: [1, 0] }} 
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            style={{ width: '8px', height: '16px', background: '#fff', display: 'inline-block' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function TechStack() {
    const [viewMode, setViewMode] = useState<'orbital' | 'terminal'>('orbital');

    return (
        <section id="stack" style={{ padding: 'clamp(80px, 10vw, 160px) 0', position: 'relative' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)', position: 'relative', zIndex: 1 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '60px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            Technical <br/><span className="text-gradient">Arsenal</span>
                        </h2>
                    </motion.div>

                    {/* View Toggle */}
                    <div className="glass" style={{ display: 'flex', padding: '4px', borderRadius: '12px' }}>
                        <button
                            onClick={() => setViewMode('orbital')}
                            style={{
                                padding: '8px 16px',
                                background: viewMode === 'orbital' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: viewMode === 'orbital' ? '#fff' : '#a1a1aa',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                border: 'none'
                            }}
                        >
                            Orbit View (Option B)
                        </button>
                        <button
                            onClick={() => setViewMode('terminal')}
                            style={{
                                padding: '8px 16px',
                                background: viewMode === 'terminal' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: viewMode === 'terminal' ? '#fff' : '#a1a1aa',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                border: 'none'
                            }}
                        >
                            Terminal View (Option C)
                        </button>
                    </div>
                </div>

                {/* Display active view */}
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {viewMode === 'orbital' ? <OrbitalConstellation /> : <CyberTerminal />}
                </motion.div>

            </div>
        </section>
    );
}
