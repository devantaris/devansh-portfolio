'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Instagram, MessageCircle, Copy, Check, ArrowUpRight } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('work.devanshkumar@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed left-[50%] top-[50%] z-[101] w-full max-w-[700px] translate-x-[-50%] translate-y-[-50%] p-4"
                    >
                        <div
                            className="glass overflow-hidden relative"
                            style={{
                                borderRadius: '32px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'rgba(10, 10, 12, 0.95)',
                                backdropFilter: 'blur(40px)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.05) inset',
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                                    <h2 className="text-[14px] font-medium tracking-[0.25em] text-zinc-400 uppercase">
                                        System Connect
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Main Content */}
                            <div className="p-8 flex flex-col gap-6 md:p-10" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div className="text-center mb-2">
                                    <p className="text-zinc-400 text-[15px] leading-relaxed">
                                        I am currently open for full-time roles, freelance projects, and general inquiries. Choose your preferred channel below.
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full mx-auto mt-2">
                                    {/* Direct Email Option */}
                                    <div
                                        className="group relative flex flex-col items-center justify-center p-6 py-10 w-full md:w-[160px] rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer overflow-hidden aspect-square"
                                        onClick={handleCopyEmail}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                        <div className="flex flex-col items-center justify-center gap-5 relative z-10 w-full h-full">
                                            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 text-blue-400">
                                                <Mail size={24} strokeWidth={1.5} />
                                            </div>
                                            <div className="flex flex-col items-center gap-1 text-center">
                                                <p className="text-[15px] font-medium text-white/90">Email</p>
                                            </div>
                                            <div className="mt-auto">
                                                {copied ? (
                                                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20 whitespace-nowrap">
                                                        <Check size={14} /> Copied
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 group-hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 group-hover:border-white/20 whitespace-nowrap">
                                                        <Copy size={14} /> Copy Address
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* WhatsApp */}
                                    <a
                                        href="https://wa.me/917007484933"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative flex flex-col items-center justify-center p-6 py-10 w-full md:w-[160px] rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden aspect-square"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                        <div className="flex flex-col items-center justify-center gap-5 relative z-10 w-full h-full">
                                            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 text-green-400">
                                                <MessageCircle size={24} strokeWidth={1.5} />
                                            </div>
                                            <div className="flex flex-col items-center gap-1 text-center">
                                                <p className="text-[15px] font-medium text-white/90">WhatsApp</p>
                                            </div>
                                            <div className="mt-auto">
                                                <span className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 group-hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 group-hover:border-white/20 whitespace-nowrap">
                                                    Connect <ArrowUpRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    </a>

                                    {/* Instagram */}
                                    <a
                                        href="https://instagram.com/itsdevanshkumar"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative flex flex-col items-center justify-center p-6 py-10 w-full md:w-[160px] rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden aspect-square"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                        <div className="flex flex-col items-center justify-center gap-5 relative z-10 w-full h-full">
                                            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-pink-500/10 text-pink-400">
                                                <Instagram size={24} strokeWidth={1.5} />
                                            </div>
                                            <div className="flex flex-col items-center gap-1 text-center">
                                                <p className="text-[15px] font-medium text-white/90">Instagram</p>
                                            </div>
                                            <div className="mt-auto">
                                                <span className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 group-hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 group-hover:border-white/20 whitespace-nowrap">
                                                    Follow <ArrowUpRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
