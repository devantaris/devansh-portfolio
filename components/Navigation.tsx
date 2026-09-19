'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactModal from '@/components/ui/contact-modal';
import { profile } from '@/lib/content';

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    // Prevent body scrolling when menu is full screen
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const menuItems = [
        { name: 'ABOUT & PROFILE', href: '#about', number: '01' },
        { name: 'FEATURED PROJECTS', href: '#projects', number: '02' },
        { name: 'CAREER CHRONOLOGY', href: '#experience', number: '03' },
        { name: 'PUBLICATIONS & RESEARCH', href: '#blog', number: '04' },
        { name: 'SYSTEM METRICS', href: '#stats', number: '05' },
        { name: 'LIVE RESUME ↗', href: profile.resumeSite, number: '06', external: true },
    ];

    const handleNavigate = (item: { href: string; external?: boolean }) => {
        setIsOpen(false);
        if (item.external) {
            window.open(item.href, '_blank', 'noopener,noreferrer');
            return;
        }
        const element = document.querySelector(item.href);
        if (element) {
            // Delay scrolling slightly to allow exit animation to begin
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    };

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed',
                    top: '24px',
                    left: '0',
                    right: '0',
                    zIndex: 100,
                    pointerEvents: 'none' // allow clicking items underneath except interactive navigation
                }}
            >
                <div style={{
                    width: '100%',
                    maxWidth: '1440px',
                    margin: '0 auto',
                    padding: '0 clamp(24px, 5vw, 96px)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* Editorial Logo Pill */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{
                            pointerEvents: 'auto',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '99px',
                            padding: '10px 24px',
                            background: 'rgba(5, 5, 10, 0.85)',
                            backdropFilter: 'blur(12px)',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 245, 255, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        DEVANSH.KUMAR // CORE
                    </button>

                    {/* Right Controls: Resume Pill + Kinetic Menu Trigger Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
                        <a
                            href={profile.resumeSite}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                color: 'var(--accent-cyan)',
                                border: '1px solid rgba(0, 245, 255, 0.3)',
                                borderRadius: '99px',
                                padding: '10px 20px',
                                background: 'rgba(5, 5, 10, 0.85)',
                                backdropFilter: 'blur(12px)',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                                e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 245, 255, 0.25)';
                                e.currentTarget.style.background = 'rgba(0, 245, 255, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.3)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = 'rgba(5, 5, 10, 0.85)';
                            }}
                        >
                            RESUME ↗
                        </a>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle navigation menu"
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'rgba(5, 5, 10, 0.85)',
                                backdropFilter: 'blur(12px)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--accent-purple)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(189, 0, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <span style={{
                                display: 'block',
                                width: '16px',
                                height: '2px',
                                background: '#fff',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                transform: isOpen ? 'rotate(45deg) translateY(4.2px)' : 'none'
                            }} />
                            <span style={{
                                display: 'block',
                                width: '16px',
                                height: '2px',
                                background: '#fff',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                opacity: isOpen ? 0 : 1
                            }} />
                            <span style={{
                                display: 'block',
                                width: '16px',
                                height: '2px',
                                background: '#fff',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                transform: isOpen ? 'rotate(-45deg) translateY(-4.2px)' : 'none'
                            }} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Magnetic Full-Screen Portal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 90,
                            background: 'rgba(4, 4, 8, 0.98)',
                            backdropFilter: 'blur(30px)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: 'clamp(32px, 6vw, 96px) clamp(24px, 5vw, 96px)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Decorative Background Matrix Ticker */}
                        <div style={{
                            position: 'absolute',
                            right: '4%',
                            top: '20%',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '9px',
                            letterSpacing: '0.2em',
                            color: 'rgba(255,255,255,0.02)',
                            writingMode: 'vertical-rl',
                            height: '60%',
                            pointerEvents: 'none',
                            userSelect: 'none'
                        }}>
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div key={i} style={{ marginBottom: '24px' }}>MODEL_STABILITY_LOCK_VAL_{(i * 7.3183 % 100).toFixed(4)}</div>
                            ))}
                        </div>

                        {/* Top spacing (leaves room for logo and close trigger button) */}
                        <div style={{ height: '80px' }} />

                        {/* Huge Editorial Links Block */}
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {menuItems.map((item, idx) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 50, rotate: 1 }}
                                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                                    exit={{ opacity: 0, y: 30 }}
                                    transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <button
                                        onClick={() => handleNavigate(item)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            gap: '24px',
                                            textAlign: 'left',
                                            padding: '8px 0',
                                        }}
                                    >
                                        <span style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            color: 'var(--accent-cyan)'
                                        }}>
                                            {item.number}
                                        </span>
                                        <h2 
                                            className="text-hover-effect"
                                            style={{
                                                fontFamily: 'var(--font-serif)',
                                                fontSize: 'clamp(42px, 6vw, 84px)',
                                                fontWeight: 800,
                                                letterSpacing: '-0.04em',
                                                margin: 0,
                                                color: '#f6f5fa',
                                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = 'var(--accent-purple)';
                                                e.currentTarget.style.transform = 'translateX(16px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#f6f5fa';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            {item.name}
                                        </h2>
                                    </button>
                                </motion.div>
                            ))}
                        </nav>

                        {/* Full-Screen Menu Bottom Telemetries */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            paddingTop: '32px'
                        }}>
                            <div>
                                <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>GET IN TOUCH</span>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsContactOpen(true);
                                    }}
                                    style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#fff',
                                        background: 'none',
                                        border: 'none',
                                        padding: '4px 0',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #fff',
                                        marginTop: '4px',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
                                >
                                    OPEN SECURE CHANNEL →
                                </button>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <a 
                                    href={profile.socials.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    style={{ color: '#8b889e', textDecoration: 'none', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#8b889e'}
                                >
                                    <GithubIcon />
                                </a>
                                <a 
                                    href={profile.socials.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    style={{ color: '#8b889e', textDecoration: 'none', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#8b889e'}
                                >
                                    <LinkedInIcon />
                                </a>
                                <a 
                                    href={profile.socials.leetcode} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label="LeetCode"
                                    style={{ color: '#8b889e', textDecoration: 'none', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#8b889e'}
                                >
                                    <LeetCodeIcon />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
}

const LeetCodeIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.874 5.874 0 0 0 .349 1.017 5.938 5.938 0 0 0 .482.849l.015.02.003.003.006.007a5.975 5.975 0 0 0 2.213 1.968c.28.14.57.257.869.349.336.104.685.167 1.04.187.355.02.713-.002 1.066-.065.354-.063.698-.168 1.026-.312l3.41-1.636a1.375 1.375 0 0 0 .234-2.392 1.38 1.38 0 0 0-1.488-.04l-3.324 1.595a3.195 3.195 0 0 1-1.89.263 3.18 3.18 0 0 1-1.68-.973 3.193 3.193 0 0 1-.77-1.785 3.196 3.196 0 0 1 .425-2.007l3.633-3.89 4.795-5.132a1.377 1.377 0 0 0-.05-1.928A1.374 1.374 0 0 0 13.483 0zm1.75 6.842a1.376 1.376 0 0 0-.974.404L9.043 12.57a1.376 1.376 0 0 0 1.945 1.945l5.216-5.324a1.376 1.376 0 0 0-.971-2.349zM18.84 9.07a1.375 1.375 0 0 0-1.016.452l-7.79 8.35a1.376 1.376 0 1 0 2.012 1.876l7.79-8.35a1.375 1.375 0 0 0-.996-2.328z"/>
    </svg>
);

const GithubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);
