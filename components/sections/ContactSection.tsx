'use client';

import { motion } from 'framer-motion';

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

export default function ContactSection() {
    return (
        <footer 
            id="contact" 
            style={{ 
                padding: 'clamp(80px, 12vw, 160px) 0 48px 0', 
                borderTop: '1px solid rgba(255,255,255,0.08)',
                background: 'linear-gradient(to top, rgba(189,0,255,0.015) 0%, transparent 100%)',
                position: 'relative'
            }}
        >
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 96px)' }}>
                
                {/* Horizontal blueprint line */}
                <div style={{ 
                    position: 'absolute', top: '0', left: '4%', right: '4%', height: '1px', 
                    background: 'linear-gradient(to right, rgba(255,255,255,0.08), rgba(189, 0, 255, 0.12), transparent)', 
                    pointerEvents: 'none' 
                }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '64px', marginBottom: '80px' }}>
                    
                    {/* Left Column: Comms Callout */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>08 // SECURE TRANSMISSIONS</span>
                            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, marginTop: '8px', color: '#fff', letterSpacing: '-0.03em' }}>
                                Initiate Comms.
                            </h2>
                        </div>
                        <p style={{ fontSize: '15px', color: 'var(--foreground-muted)', lineHeight: 1.7, maxWidth: '440px' }}>
                            Open secure communication channels for project development, systems engineering consultations, or administrative inquiries.
                        </p>
                        
                        {/* HSL active node indicator */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start', padding: '8px 18px', border: '1px solid rgba(0, 245, 255, 0.25)', background: 'rgba(0, 245, 255, 0.02)' }}>
                            <span style={{ 
                                width: '8px', 
                                height: '8px', 
                                borderRadius: '50%', 
                                background: 'var(--accent-cyan)', 
                                display: 'inline-block',
                                boxShadow: '0 0 10px var(--accent-cyan)',
                                animation: 'pulse 1s infinite'
                            }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#fff', fontWeight: 700, letterSpacing: '0.05em' }}>
                                SYSTEMS STATUS: DEPLOY_READY
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Massive Email Link & Social Array */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', justifyContent: 'center' }}>
                        <div>
                            <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>PRIMARY_SECURE_EMAIL</span>
                            <motion.a
                                href="mailto:work.devanshkumar@gmail.com"
                                whileHover={{ scale: 1.01 }}
                                style={{
                                    display: 'block',
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: 'clamp(28px, 4vw, 44px)',
                                    fontWeight: 800,
                                    color: '#fff',
                                    textDecoration: 'none',
                                    marginTop: '8px',
                                    borderBottom: '1px dashed rgba(255,255,255,0.2)',
                                    paddingBottom: '8px',
                                    transition: 'color 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--accent-cyan)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#fff';
                                }}
                            >
                                work.devanshkumar <br />@gmail.com
                            </motion.a>
                        </div>

                        {/* Social telemetries */}
                        <div>
                            <span className="mono-tag" style={{ color: 'var(--foreground-muted)', display: 'block', marginBottom: '16px' }}>NETWORK_HANDSHAKES</span>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <a
                                    href="https://github.com/devantaris"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glow-btn"
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 120px', justifyContent: 'center' }}
                                    aria-label="GitHub"
                                >
                                    <GithubIcon />
                                    GITHUB
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/devansh-kumar-3b3701217/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glow-btn"
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 120px', justifyContent: 'center', borderColor: 'var(--accent-purple)' }}
                                    aria-label="LinkedIn"
                                >
                                    <LinkedInIcon />
                                    LINKEDIN
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Microcopyright row */}
                <div style={{ 
                    borderTop: '1px solid rgba(255,255,255,0.06)', 
                    paddingTop: '32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--foreground-muted)'
                }}>
                    <span>© {new Date().getFullYear()} DEVANSH KUMAR // ALL CHANNELS ENCRYPTED</span>
                    <span>BUILT WITH NEXT.JS 16 // THREE.JS // GSAP // SCROLL_SPRING</span>
                </div>
            </div>
        </footer>
    );
}
