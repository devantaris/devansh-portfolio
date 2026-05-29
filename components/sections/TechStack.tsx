'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const categories = [
    {
        id: 'languages',
        title: 'Core Languages',
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
        <div className="orbit-container" style={{ position: 'relative', width: '100%', height: '640px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            
            {/* Telemetry Coordinate Box Background Overlay */}
            <div style={{
                position: 'absolute',
                width: '640px',
                height: '640px',
                border: '1px dashed rgba(255,255,255,0.04)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                width: '1px',
                height: '100%',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.03), transparent)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                height: '1px',
                width: '100%',
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent)',
                pointerEvents: 'none'
            }} />

            {/* Inline styles for keyframes to ensure they work component-level */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
                .orbit-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,0.05); }
                
                .orbit-animate-1 { animation: spin 45s linear infinite; }
                .orbit-counter-1 { animation: spin-reverse 45s linear infinite; }
                
                .orbit-animate-2 { animation: spin-reverse 55s linear infinite; }
                .orbit-counter-2 { animation: spin 55s linear infinite; }
                
                .orbit-animate-3 { animation: spin 65s linear infinite; }
                .orbit-counter-3 { animation: spin-reverse 65s linear infinite; }

                .orbit-wrapper {
                    position: relative;
                    width: 600px;
                    height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform-origin: center;
                }

                @media (max-width: 768px) {
                    .orbit-wrapper { transform: scale(0.65); }
                    .orbit-container { height: 480px !important; }
                }
                @media (max-width: 480px) {
                    .orbit-wrapper { transform: scale(0.52); }
                    .orbit-container { height: 400px !important; }
                }
            `}} />

            <div className="orbit-wrapper">
                {/* pulsing nuclear fusion core representing systems intelligence */}
                <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: '90px', 
                    height: '90px', 
                    borderRadius: '50%', 
                    background: 'radial-gradient(circle, var(--accent-cyan) 0%, var(--accent-purple) 70%, transparent 100%)', 
                    boxShadow: '0 0 50px rgba(0, 245, 255, 0.3), inset 0 0 15px rgba(255,255,255,0.6)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 10 
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '10px', color: '#fff', letterSpacing: '0.1em' }}>CORE</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>READY</span>
                </div>

                {/* Ring 1 */}
                <div className="orbit-ring orbit-animate-1" style={{ width: '260px', height: '260px', borderColor: 'rgba(0, 245, 255, 0.15)' }}>
                    {ring1.map((skill, i) => {
                        const angle = (i / ring1.length) * 360;
                        return (
                            <div key={skill.name} style={{ position: 'absolute', top: '50%', left: '50%', transform: `rotate(${angle}deg) translateX(130px)` }}>
                                <div className="orbit-counter-1" style={{ position: 'absolute', marginTop: '-24px', marginLeft: '-24px' }}>
                                    <div style={{ transform: `rotate(-${angle}deg)` }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <div 
                                                style={{ 
                                                    width: '44px', 
                                                    height: '44px', 
                                                    borderRadius: '50%', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    padding: '10px',
                                                    background: 'rgba(5,5,10,0.95)',
                                                    border: '1px solid rgba(0, 245, 255, 0.25)',
                                                    boxShadow: '0 0 15px rgba(0, 245, 255, 0.1)'
                                                }} 
                                                title={skill.name}
                                            >
                                                <Image src={skill.logoUrl} alt={skill.name} width={22} height={22} unoptimized style={{ filter: 'brightness(1.15) contrast(1.05)' }} />
                                            </div>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, color: 'var(--foreground-muted)', background: 'rgba(5,5,10,0.85)', padding: '2px 6px', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>
                                                {skill.name.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Ring 2 */}
                <div className="orbit-ring orbit-animate-2" style={{ width: '420px', height: '420px', borderColor: 'rgba(189, 0, 255, 0.12)' }}>
                    {ring2.map((skill, i) => {
                        const angle = (i / ring2.length) * 360;
                        return (
                            <div key={skill.name} style={{ position: 'absolute', top: '50%', left: '50%', transform: `rotate(${angle}deg) translateX(210px)` }}>
                                <div className="orbit-counter-2" style={{ position: 'absolute', marginTop: '-24px', marginLeft: '-24px' }}>
                                    <div style={{ transform: `rotate(-${angle}deg)` }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <div 
                                                style={{ 
                                                    width: '44px', 
                                                    height: '44px', 
                                                    borderRadius: '50%', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    padding: '10px',
                                                    background: 'rgba(5,5,10,0.95)',
                                                    border: '1px solid rgba(189, 0, 255, 0.25)',
                                                    boxShadow: '0 0 15px rgba(189, 0, 255, 0.08)'
                                                }} 
                                                title={skill.name}
                                            >
                                                <Image src={skill.logoUrl} alt={skill.name} width={22} height={22} unoptimized style={{ filter: 'brightness(1.15) contrast(1.05)' }} />
                                            </div>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, color: 'var(--foreground-muted)', background: 'rgba(5,5,10,0.85)', padding: '2px 6px', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>
                                                {skill.name.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Ring 3 */}
                <div className="orbit-ring orbit-animate-3" style={{ width: '560px', height: '560px', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                    {ring3.map((skill, i) => {
                        const angle = (i / ring3.length) * 360;
                        return (
                            <div key={skill.name} style={{ position: 'absolute', top: '50%', left: '50%', transform: `rotate(${angle}deg) translateX(280px)` }}>
                                <div className="orbit-counter-3" style={{ position: 'absolute', marginTop: '-24px', marginLeft: '-24px' }}>
                                    <div style={{ transform: `rotate(-${angle}deg)` }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <div 
                                                style={{ 
                                                    width: '44px', 
                                                    height: '44px', 
                                                    borderRadius: '50%', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    padding: '10px',
                                                    background: 'rgba(5,5,10,0.95)',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.03)'
                                                }} 
                                                title={skill.name}
                                            >
                                                <Image src={skill.logoUrl} alt={skill.name} width={22} height={22} unoptimized style={{ filter: 'brightness(1.15) contrast(1.05)' }} />
                                            </div>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, color: 'var(--foreground-muted)', background: 'rgba(5,5,10,0.85)', padding: '2px 6px', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>
                                                {skill.name.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default function TechStack() {
    return (
        <section id="stack" style={{ padding: 'clamp(80px, 12vw, 160px) 0', position: 'relative', overflow: 'hidden' }}>
            {/* Background glowing matrix */}
            <div style={{
                position: 'absolute', top: '10%', left: '10%', width: '40vw', height: '40vw',
                background: 'radial-gradient(circle, rgba(189,0,255,0.02) 0%, transparent 60%)',
                opacity: 0.7, filter: 'blur(80px)', pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 96px)', position: 'relative', zIndex: 1 }}>
                
                {/* Editorial Section Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '48px', alignItems: 'flex-end' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>03 // TECHNICAL CONSTELATION</span>
                        <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, marginTop: '8px', color: '#fff', letterSpacing: '-0.03em' }}>
                            Technical <br /><span className="text-void">Arsenal</span>.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ fontSize: '15px', color: 'var(--foreground-muted)', lineHeight: 1.7, maxWidth: '480px', margin: 0 }}
                    >
                        A layered index of language stacks, database layers, ML toolkits, and client frameworks. Built to spin on dynamic nodes around an integrated computational core.
                    </motion.p>
                </div>

                {/* Main Orbital Telemetry Visualizer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <OrbitalConstellation />
                </motion.div>

            </div>
        </section>
    );
}
