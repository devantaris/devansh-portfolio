'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Stats', href: '#stats' },
        { name: 'Blog', href: '#blog' },
    ];

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50"
            style={{ padding: isScrolled ? '12px 0' : '16px 0' }}
        >
            <div className="max-w-[1100px] mx-auto" style={{ padding: '0 24px' }}>
                <div
                    className="flex items-center justify-between glass"
                    style={{
                        borderRadius: '9999px',
                        padding: '10px 20px',
                        border: '1px solid rgba(255,255,255,0.07)',
                        boxShadow: isScrolled ? '0 8px 30px rgba(0,0,0,0.4)' : 'none',
                        transition: 'box-shadow 0.3s ease',
                    }}
                >
                    {/* Logo */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#fff',
                            border: '1px solid #3f3f46',
                            borderRadius: '9999px',
                            padding: '6px 16px',
                            background: 'transparent',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#71717a')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#3f3f46')}
                    >
                        Devansh Kumar
                    </button>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center" style={{ gap: '32px' }}>
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.href)}
                                style={{
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#a1a1aa',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1aa')}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    {/* Right: Contact + Mobile hamburger */}
                    <div className="flex items-center" style={{ gap: '12px' }}>
                        <a
                            href="mailto:work.devanshkumar@gmail.com"
                            className="hidden md:flex"
                            style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#fff',
                                border: '1px solid #3f3f46',
                                borderRadius: '9999px',
                                padding: '6px 16px',
                                textDecoration: 'none',
                                letterSpacing: '0.05em',
                                transition: 'border-color 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#3f3f46')}
                        >
                            CONTACT
                        </a>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                padding: '8px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            aria-label="Toggle menu"
                        >
                            <span style={{
                                display: 'block', width: '20px', height: '2px', background: '#fff',
                                transition: 'all 0.2s',
                                transform: isMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
                            }} />
                            <span style={{
                                display: 'block', width: '20px', height: '2px', background: '#fff',
                                transition: 'all 0.2s',
                                opacity: isMenuOpen ? 0 : 1,
                            }} />
                            <span style={{
                                display: 'block', width: '20px', height: '2px', background: '#fff',
                                transition: 'all 0.2s',
                                transform: isMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
                            }} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                            className="glass"
                            style={{
                                marginTop: '8px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.07)',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                            }}
                        >
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollToSection(item.href)}
                                    style={{
                                        fontSize: '14px',
                                        color: '#d4d4d8',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        padding: '4px 0',
                                    }}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
}
