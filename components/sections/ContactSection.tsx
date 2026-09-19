'use client';

import { motion } from 'framer-motion';
import { profile } from '@/lib/content';

const GithubIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const LeetCodeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.874 5.874 0 0 0 .349 1.017 5.938 5.938 0 0 0 .482.849l.015.02.003.003.006.007a5.975 5.975 0 0 0 2.213 1.968c.28.14.57.257.869.349.336.104.685.167 1.04.187.355.02.713-.002 1.066-.065.354-.063.698-.168 1.026-.312l3.41-1.636a1.375 1.375 0 0 0 .234-2.392 1.38 1.38 0 0 0-1.488-.04l-3.324 1.595a3.195 3.195 0 0 1-1.89.263 3.18 3.18 0 0 1-1.68-.973 3.193 3.193 0 0 1-.77-1.785 3.196 3.196 0 0 1 .425-2.007l3.633-3.89 4.795-5.132a1.377 1.377 0 0 0-.05-1.928A1.374 1.374 0 0 0 13.483 0zm1.75 6.842a1.376 1.376 0 0 0-.974.404L9.043 12.57a1.376 1.376 0 0 0 1.945 1.945l5.216-5.324a1.376 1.376 0 0 0-.971-2.349zM18.84 9.07a1.375 1.375 0 0 0-1.016.452l-7.79 8.35a1.376 1.376 0 1 0 2.012 1.876l7.79-8.35a1.375 1.375 0 0 0-.996-2.328z"/>
    </svg>
);

export default function ContactSection() {
    return (
        <footer 
            id="contact" 
            style={{ 
                padding: 'clamp(100px, 15vw, 200px) 0 48px 0', 
                background: '#020204',
                position: 'relative'
            }}
        >
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
                
                {/* Thin top divider line */}
                <div style={{ 
                    position: 'absolute', top: '0', left: '4%', right: '4%', height: '1px', 
                    background: 'var(--border)', 
                    pointerEvents: 'none' 
                }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '64px', marginBottom: '100px' }}>
                    
                    {/* Left Column: Comms Callout */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <span className="mono-tag">07 // CONTACT_SECURE</span>
                            <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 200, marginTop: '8px', color: '#fff', letterSpacing: '-0.04em' }}>
                                Initiate comms.
                            </h2>
                        </div>
                        <p style={{ fontSize: '15px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.7, maxWidth: '400px', margin: 0 }}>
                            Open secure communication channels for project development, systems engineering consultations, or administrative inquiries.
                        </p>
                    </div>

                    {/* Right Column: Massive Whisper-Thin Email Link */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', justifyContent: 'center' }}>
                        <div>
                            <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>PRIMARY_CHANNEL</span>
                            <motion.a
                                href={`mailto:${profile.email}`}
                                whileHover={{ scale: 1.01 }}
                                style={{
                                    display: 'block',
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: 'clamp(28px, 4.5vw, 44px)',
                                    fontWeight: 200, // whisper thin
                                    color: '#fff',
                                    textDecoration: 'none',
                                    marginTop: '8px',
                                    borderBottom: '1px dashed var(--border)',
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
                                {profile.email.split('@')[0]} <br />@{profile.email.split('@')[1]}
                            </motion.a>
                        </div>

                        {/* Social telemetries */}
                        <div>
                            <span className="mono-tag" style={{ color: 'var(--foreground-muted)', display: 'block', marginBottom: '16px' }}>NETWORK_HANDSHAKES</span>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <a
                                    href={profile.socials.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glow-btn"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 100px', justifyContent: 'center' }}
                                    aria-label="GitHub"
                                >
                                    <GithubIcon />
                                    GITHUB
                                </a>
                                <a
                                    href={profile.socials.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glow-btn"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 100px', justifyContent: 'center', borderColor: 'var(--border-strong)' }}
                                    aria-label="LinkedIn"
                                >
                                    <LinkedInIcon />
                                    LINKEDIN
                                </a>
                                <a
                                    href={profile.socials.leetcode}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glow-btn"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 100px', justifyContent: 'center', borderColor: 'var(--border-strong)' }}
                                    aria-label="LeetCode"
                                >
                                    <LeetCodeIcon />
                                    LEETCODE
                                </a>
                                <a
                                    href={profile.resumeSite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glow-btn"
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 120px', justifyContent: 'center', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                                    aria-label="Live Resume"
                                >
                                    RESUME ↗
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Microcopyright row */}
                <div style={{ 
                    borderTop: '1px solid var(--border)', 
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
                    <span>© {new Date().getFullYear()} DEVANSH KUMAR // ALL COMMUNICATIONS SECURED</span>
                    <span>BUILT WITH NEXT.JS 16 // THREE.JS // LENIS // MONO_PAIRING</span>
                </div>
            </div>
        </footer>
    );
}
