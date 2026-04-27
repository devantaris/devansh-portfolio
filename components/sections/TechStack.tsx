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
                .orbit-counter-1 { animation: spin-reverse 40s linear infinite; }
                
                .orbit-animate-2 { animation: spin-reverse 50s linear infinite; }
                .orbit-counter-2 { animation: spin 50s linear infinite; }
                
                .orbit-animate-3 { animation: spin 60s linear infinite; }
                .orbit-counter-3 { animation: spin-reverse 60s linear infinite; }
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
                        <div key={skill.name} style={{ position: 'absolute', top: '50%', left: '50%', transform: `rotate(${angle}deg) translateX(125px)` }}>
                            <div className="orbit-counter-1" style={{ position: 'absolute', marginTop: '-20px', marginLeft: '-20px' }}>
                                <div style={{ transform: `rotate(-${angle}deg)` }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                        <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }} title={skill.name}>
                                            <Image src={skill.logoUrl} alt={skill.name} width={24} height={24} unoptimized style={{ filter: 'brightness(1.2)' }} />
                                        </div>
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#e4e4e7', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '10px', backdropFilter: 'blur(4px)', whiteSpace: 'nowrap' }}>
                                            {skill.name}
                                        </span>
                                    </div>
                                </div>
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
                        <div key={skill.name} style={{ position: 'absolute', top: '50%', left: '50%', transform: `rotate(${angle}deg) translateX(200px)` }}>
                            <div className="orbit-counter-2" style={{ position: 'absolute', marginTop: '-20px', marginLeft: '-20px' }}>
                                <div style={{ transform: `rotate(-${angle}deg)` }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                        <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }} title={skill.name}>
                                            <Image src={skill.logoUrl} alt={skill.name} width={24} height={24} unoptimized style={{ filter: 'brightness(1.2)' }} />
                                        </div>
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#e4e4e7', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '10px', backdropFilter: 'blur(4px)', whiteSpace: 'nowrap' }}>
                                            {skill.name}
                                        </span>
                                    </div>
                                </div>
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
                        <div key={skill.name} style={{ position: 'absolute', top: '50%', left: '50%', transform: `rotate(${angle}deg) translateX(275px)` }}>
                            <div className="orbit-counter-3" style={{ position: 'absolute', marginTop: '-20px', marginLeft: '-20px' }}>
                                <div style={{ transform: `rotate(-${angle}deg)` }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                        <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }} title={skill.name}>
                                            <Image src={skill.logoUrl} alt={skill.name} width={24} height={24} unoptimized style={{ filter: 'brightness(1.2)' }} />
                                        </div>
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#e4e4e7', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '10px', backdropFilter: 'blur(4px)', whiteSpace: 'nowrap' }}>
                                            {skill.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function TechStack() {
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
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                >
                    <OrbitalConstellation />
                </motion.div>

            </div>
        </section>
    );
}
