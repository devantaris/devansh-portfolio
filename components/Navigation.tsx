'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navigation() {
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Writing', href: '#writing' },
        { name: 'Contact', href: '#contact' },
    ];

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(href.slice(1));
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'py-6 bg-gradient-to-r from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] shadow-lg border-b border-white/5 backdrop-blur-sm'
                : 'py-8 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-3 items-center">
                {/* Logo - Left */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-xl font-mono font-bold tracking-tighter text-foreground hover:text-accent transition-colors justify-self-start"
                >
                    &lt;devansh&gt;
                </button>

                {/* Desktop Nav - Center */}
                <div className="hidden md:flex items-center justify-center space-x-16 col-span-1">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => scrollToSection(item.href)}
                            className={`text-sm font-medium transition-colors hover:text-accent relative group ${activeSection === item.href.slice(1) ? 'text-accent' : 'text-foreground-muted'
                                }`}
                        >
                            {item.name}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full ${activeSection === item.href.slice(1) ? 'w-full' : ''
                                }`} />
                        </button>
                    ))}
                </div>

                {/* Right spacer for grid balance */}
                <div className="hidden md:block" />

                {/* Mobile Menu Button */}
                <div className="md:hidden col-span-2 flex justify-end">
                    {/* Add mobile menu logic later if needed */}
                </div>
            </div>
        </motion.nav>
    );
}
