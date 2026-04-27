'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const categories = [
    {
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

export default function TechStack() {
    return (
        <section id="stack" style={{ padding: 'clamp(80px, 10vw, 160px) 0', position: 'relative' }}>
            {/* Background Glows */}
            <div style={{
                position: 'absolute', top: '10%', right: '0', width: '40vw', height: '40vw',
                background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 60%)',
                opacity: 0.03, filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
            }} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)', position: 'relative', zIndex: 1 }}>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '60px' }}
                >
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        Technical <br/><span className="text-gradient">Arsenal</span>
                    </h2>
                    <p className="text-gradient-subtle" style={{ fontSize: '15px', marginTop: '16px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Tools & Technologies
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', 
                    gap: '24px' 
                }}>
                    {categories.map((category, idx) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="premium-card glass"
                            style={{ padding: '40px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                                <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>
                                    {category.icon}
                                </span>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e4e4e7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {category.title}
                                </h3>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {category.skills.map(skill => (
                                    <motion.div
                                        key={skill.name}
                                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px 18px',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '100px',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            transition: 'all 0.2s',
                                            cursor: 'default'
                                        }}
                                    >
                                        <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Image
                                                src={skill.logoUrl}
                                                alt={skill.name}
                                                width={20}
                                                height={20}
                                                unoptimized
                                                style={{ objectFit: 'contain', filter: 'brightness(0.95)' }}
                                            />
                                        </div>
                                        <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 500 }}>
                                            {skill.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
