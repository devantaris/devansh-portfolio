'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navigation() {
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
            // Close menu when scrolling
            if (window.scrollY > 50) {
                setIsMenuOpen(false);
            }
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
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Logo - Top Left Corner */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="fixed top-8 left-8 md:left-12 z-50"
            >
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-2xl md:text-3xl font-sans font-bold tracking-tighter text-foreground hover:text-accent transition-colors"
                >
                    &lt;devansh&gt;
                </button>
            </motion.div>

            {/* Vertical Navigation - Right Side - Shifts up when scrolled */}
            <motion.nav
                initial={{ x: 100, opacity: 0 }}
                animate={{
                    x: 0,
                    opacity: isScrolled ? 0 : 1,
                    pointerEvents: isScrolled ? 'none' : 'auto'
                }}
                transition={{ duration: 0.3 }}
                className="fixed right-8 md:right-12 top-[15%] z-50"
            >
                <div className="flex flex-col items-end space-y-8">
                    {navItems.map((item, index) => (
                        <motion.button
                            key={item.name}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            onClick={() => scrollToSection(item.href)}
                            className={`text-sm md:text-base font-medium uppercase tracking-widest transition-all duration-300 hover:text-accent relative group ${activeSection === item.href.slice(1) ? 'text-accent' : 'text-foreground-muted'
                                }`}
                        >
                            {item.name}
                            <span
                                className={`absolute -right-6 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-4 ${activeSection === item.href.slice(1) ? 'w-4' : ''
                                    }`}
                            />
                        </motion.button>
                    ))}
                </div>
            </motion.nav>

            {/* Hamburger Menu - Appears on Scroll - ROUND GLASS BUTTON */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: isScrolled ? 1 : 0,
                    scale: isScrolled ? 1 : 0.8
                }}
                transition={{ duration: 0.3 }}
                className={`fixed top-8 right-8 md:right-12 z-50 ${isScrolled ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
                {/* Round Glass Hamburger Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="relative p-5 w-16 h-16 rounded-full bg-background/50 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-background/70 hover:border-accent/40 hover:scale-110 transition-all duration-300 group flex items-center justify-center"
                    aria-label="Toggle menu"
                >
                    <div className="flex flex-col items-center justify-center space-y-1.5 w-6">
                        <motion.span
                            animate={{
                                rotate: isMenuOpen ? 45 : 0,
                                y: isMenuOpen ? 7 : 0,
                                width: isMenuOpen ? '24px' : '24px'
                            }}
                            className="block h-0.5 w-6 bg-foreground group-hover:bg-accent transition-colors"
                        />
                        <motion.span
                            animate={{ opacity: isMenuOpen ? 0 : 1 }}
                            className="block h-0.5 w-6 bg-foreground group-hover:bg-accent transition-colors"
                        />
                        <motion.span
                            animate={{
                                rotate: isMenuOpen ? -45 : 0,
                                y: isMenuOpen ? -7 : 0,
                                width: isMenuOpen ? '24px' : '24px'
                            }}
                            className="block h-0.5 w-6 bg-foreground group-hover:bg-accent transition-colors"
                        />
                    </div>
                </button>

                {/* Dropdown Menu */}
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{
                        opacity: isMenuOpen ? 1 : 0,
                        y: isMenuOpen ? 0 : -20,
                        scale: isMenuOpen ? 1 : 0.95
                    }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-20 right-0 bg-background/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 min-w-[200px] ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                    <div className="flex flex-col items-end space-y-4">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.href)}
                                className={`text-sm md:text-base font-medium uppercase tracking-widest transition-all duration-300 hover:text-accent relative group ${activeSection === item.href.slice(1) ? 'text-accent' : 'text-foreground-muted'
                                    }`}
                            >
                                {item.name}
                                <span
                                    className={`absolute -right-6 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-4 ${activeSection === item.href.slice(1) ? 'w-4' : ''
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
