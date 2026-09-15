'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    FileText, 
    Download, 
    Terminal, 
    Cpu, 
    ExternalLink, 
    Layers, 
    Briefcase, 
    BookOpen, 
    BarChart3, 
    Mail, 
    Code2, 
    X,
    Command
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
    onOpenMariSimulator: () => void;
    onOpenContactModal: () => void;
}

interface CommandItem {
    id: string;
    title: string;
    subtitle: string;
    category: 'ACTIONS' | 'NAVIGATION' | 'EXTERNAL';
    icon: React.ComponentType<{ size?: number; className?: string }>;
    action: () => void;
}

export default function CommandPalette({ onOpenMariSimulator, onOpenContactModal }: CommandPaletteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

    const scrollTo = useCallback((id: string) => {
        setIsOpen(false);
        const el = document.querySelector(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            router.push(`/${id}`);
        }
    }, [router]);

    const commands: CommandItem[] = [
        {
            id: 'resume-live',
            title: 'Open Live Resume (devantaris.github.io)',
            subtitle: 'Latest single-page verified academic & industry credentials',
            category: 'ACTIONS',
            icon: FileText,
            action: () => {
                setIsOpen(false);
                window.open('https://devantaris.github.io', '_blank', 'noopener,noreferrer');
            }
        },
        {
            id: 'resume-pdf',
            title: 'Download Offline PDF Resume',
            subtitle: '1-page formatted printable resume PDF',
            category: 'ACTIONS',
            icon: Download,
            action: () => {
                setIsOpen(false);
                const link = document.createElement('a');
                link.href = '/Devansh_Kumar_Resume_1Page.pdf';
                link.download = 'Devansh_Kumar_Resume.pdf';
                link.click();
            }
        },
        {
            id: 'mari-simulator',
            title: 'Launch MARI Fraud Decision Simulator',
            subtitle: 'Interactive testbench: 4-stage uncertainty pipeline (IEEE TDSC)',
            category: 'ACTIONS',
            icon: Cpu,
            action: () => {
                setIsOpen(false);
                onOpenMariSimulator();
            }
        },
        {
            id: 'nav-projects',
            title: 'Jump to Featured Projects',
            subtitle: 'MARI, EduSupervision, CryptoFlow, Raahi',
            category: 'NAVIGATION',
            icon: Layers,
            action: () => scrollTo('#projects')
        },
        {
            id: 'nav-archive',
            title: 'Browse All Projects Archive',
            subtitle: 'Comprehensive catalog including Biome, SkillSync & tooling',
            category: 'NAVIGATION',
            icon: ExternalLink,
            action: () => {
                setIsOpen(false);
                router.push('/projects');
            }
        },
        {
            id: 'nav-experience',
            title: 'Jump to Career Chronology',
            subtitle: 'BuildIt Service, Raahi, IEEE Student Branch, Bennett Univ',
            category: 'NAVIGATION',
            icon: Briefcase,
            action: () => scrollTo('#experience')
        },
        {
            id: 'nav-publications',
            title: 'Jump to Research & Publications',
            subtitle: 'IEEE TDSC fraud paper, Simply Universe book, IBM ML cert',
            category: 'NAVIGATION',
            icon: BookOpen,
            action: () => scrollTo('#blog')
        },
        {
            id: 'nav-stack',
            title: 'View Technical Arsenal & Constellation',
            subtitle: 'FastAPI, PostgreSQL, pgvector, Celery, Redis, Docker, Flutter',
            category: 'NAVIGATION',
            icon: Terminal,
            action: () => scrollTo('#stack')
        },
        {
            id: 'nav-stats',
            title: 'Inspect GitHub Telemetry & Diagnostics',
            subtitle: 'Commit density matrix and language compilation percentages',
            category: 'NAVIGATION',
            icon: BarChart3,
            action: () => scrollTo('#stats')
        },
        {
            id: 'ext-leetcode',
            title: 'Open LeetCode Profile (/u/vantaris)',
            subtitle: 'Data structures, graph algorithms, and DP problem solutions',
            category: 'EXTERNAL',
            icon: Code2,
            action: () => {
                setIsOpen(false);
                window.open('https://leetcode.com/u/vantaris/', '_blank', 'noopener,noreferrer');
            }
        },
        {
            id: 'ext-github',
            title: 'Open GitHub Profile (@devantaris)',
            subtitle: 'Repositories, open source systems, and automated pipelines',
            category: 'EXTERNAL',
            icon: ExternalLink,
            action: () => {
                setIsOpen(false);
                window.open('https://github.com/devantaris', '_blank', 'noopener,noreferrer');
            }
        },
        {
            id: 'contact-open',
            title: 'Initiate Secure Channel (Contact)',
            subtitle: 'Direct email, WhatsApp, and LinkedIn messaging matrix',
            category: 'ACTIONS',
            icon: Mail,
            action: () => {
                setIsOpen(false);
                onOpenContactModal();
            }
        }
    ];

    const filtered = commands.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) || 
        c.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
    );

    // Keyboard listener for Cmd+K / Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                setQuery('');
                setSelectedIndex(0);
            } else if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Handle arrow keys
    const handleKeyNav = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
        } else if (e.key === 'Enter' && filtered[selectedIndex]) {
            e.preventDefault();
            filtered[selectedIndex].action();
        }
    };

    return (
        <>
            {/* Floating Quick Command Trigger Button on Desktop & Mobile */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                onClick={() => {
                    setIsOpen(true);
                    setQuery('');
                    setSelectedIndex(0);
                }}
                className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/10 bg-[#05060c]/90 text-zinc-300 hover:text-white hover:border-cyan-400/40 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] font-mono text-[11px] transition-all cursor-pointer group"
                title="Open Command Palette (⌘K / Ctrl+K)"
            >
                <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_rgba(0,245,255,0.8)] transition-shadow" />
                <span className="font-semibold tracking-wider text-white">COMMAND</span>
                <kbd className="px-1.5 py-0.5 text-[9px] bg-white/5 border border-white/10 rounded text-zinc-400 group-hover:text-cyan-400">
                    ⌘K
                </kbd>
            </motion.button>

            {/* Command Palette Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -20 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed left-[50%] top-[20%] z-[121] w-full max-w-[620px] translate-x-[-50%] p-4"
                            onKeyDown={handleKeyNav}
                        >
                            <div
                                style={{
                                    borderRadius: '16px',
                                    border: '1px solid rgba(0, 245, 255, 0.25)',
                                    background: 'rgba(7, 8, 14, 0.98)',
                                    backdropFilter: 'blur(30px)',
                                    boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 245, 255, 0.1)',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Search input */}
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                                    <Search size={18} className="text-cyan-400" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Type a command or search (e.g. resume, mari, stack)..."
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            setSelectedIndex(0);
                                        }}
                                        className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-mono"
                                    />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-zinc-500 hover:text-white p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Results list */}
                                <div className="max-h-[360px] overflow-y-auto p-2 flex flex-col gap-1">
                                    {filtered.length === 0 ? (
                                        <div className="py-8 text-center text-xs font-mono text-zinc-500">
                                            NO COMMANDS MATCHING &quot;{query.toUpperCase()}&quot;
                                        </div>
                                    ) : (
                                        filtered.map((item, idx) => {
                                            const isSelected = idx === selectedIndex;
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => item.action()}
                                                    onMouseEnter={() => setSelectedIndex(idx)}
                                                    className="w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer border"
                                                    style={{
                                                        background: isSelected ? 'rgba(0, 245, 255, 0.08)' : 'transparent',
                                                        borderColor: isSelected ? 'rgba(0, 245, 255, 0.25)' : 'transparent',
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div 
                                                            className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                                                            style={{
                                                                background: isSelected ? 'rgba(0, 245, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                                                                color: isSelected ? 'var(--accent-cyan)' : '#8b889e',
                                                            }}
                                                        >
                                                            <Icon size={16} />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-mono font-medium text-white">
                                                                {item.title}
                                                            </div>
                                                            <div className="text-[10px] text-zinc-400 font-sans mt-0.5">
                                                                {item.subtitle}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <span 
                                                        className="text-[9px] font-mono px-2 py-0.5 rounded border"
                                                        style={{
                                                            color: isSelected ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.3)',
                                                            borderColor: isSelected ? 'rgba(0, 245, 255, 0.3)' : 'rgba(255,255,255,0.06)',
                                                        }}
                                                    >
                                                        {item.category}
                                                    </span>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Footer Bar */}
                                <div className="flex items-center justify-between px-5 py-2.5 bg-black/50 border-t border-white/5 text-[10px] font-mono text-zinc-500">
                                    <div className="flex items-center gap-3">
                                        <span>Use <kbd className="px-1 py-0.2 bg-white/5 rounded">↑</kbd> <kbd className="px-1 py-0.2 bg-white/5 rounded">↓</kbd> to navigate</span>
                                        <span><kbd className="px-1 py-0.2 bg-white/5 rounded">↵</kbd> to select</span>
                                    </div>
                                    <span><kbd className="px-1 py-0.2 bg-white/5 rounded">ESC</kbd> to exit</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
