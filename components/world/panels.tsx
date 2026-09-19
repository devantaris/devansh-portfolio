'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { profile, projects, experience, publications, skillCategories, featuredProjects } from '@/lib/content';
import type { Project } from '@/lib/content';

const stopAccent: Record<string, string> = {
    origin: 'var(--accent-cyan)',
    machines: '#a0ff60',
    trajectory: '#ffaa00',
    signals: '#d5a8ff',
    arsenal: '#b9c6ff',
    beacon: '#ff5577',
};

export function accentFor(id: string): string {
    return stopAccent[id] ?? 'var(--accent-cyan)';
}

function PanelShell({ children, accent, onClose }: { children: React.ReactNode; accent: string; onClose: () => void }) {
    return (
        <motion.aside
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(46vw, 560px)',
                minWidth: '420px',
                padding: '96px 40px 40px',
                overflowY: 'auto',
                background: 'linear-gradient(to left, rgba(2,2,6,0.92) 65%, rgba(2,2,6,0))',
                zIndex: 20,
            }}
        >
            <div style={{
                border: `1px solid ${accent}30`,
                borderRight: `2px solid ${accent}`,
                background: 'rgba(3,3,8,0.72)',
                backdropFilter: 'blur(18px)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                maxHeight: '100%',
            }}>
                {children}
            </div>
            <button
                onClick={onClose}
                aria-label="Close panel"
                style={{
                    position: 'absolute', top: '64px', right: '24px', background: 'rgba(3,3,8,0.7)',
                    border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em',
                    padding: '6px 12px', cursor: 'pointer', borderRadius: '2px',
                }}
            >
                [ ESC ]
            </button>
        </motion.aside>
    );
}

function Tag({ children, accent }: { children: React.ReactNode; accent: string }) {
    return <span className="mono-tag" style={{ color: accent, fontSize: '9px' }}>{children}</span>;
}

/* ── ORIGIN ──────────────────────────────────────────────────────────────── */
function OriginPanel({ accent, onClose }: { accent: string; onClose: () => void }) {
    return (
        <PanelShell accent={accent} onClose={onClose}>
            <Tag accent={accent}>01 // ORIGIN — PROFILE_INDEX</Tag>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 200, fontSize: '34px', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#fff', margin: 0 }}>
                {profile.name}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', fontWeight: 300, lineHeight: 1.75, margin: 0 }}>
                {profile.tagline}
            </p>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Tag accent="var(--foreground-muted)">THE_INTENT</Tag>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.75, margin: 0 }}>
                    {profile.about.longBio}
                </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Tag accent="var(--foreground-muted)">DIAGNOSTIC_TOTALS</Tag>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {profile.githubStats.totals.map((s) => (
                        <div key={s.label} style={{ border: '1px solid var(--border)', padding: '12px 14px' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 200, color: '#fff' }}>{s.value}</div>
                            <div className="mono-tag" style={{ fontSize: '7px', marginTop: '2px' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <Tag accent="var(--foreground-muted)">COORDINATES</Tag>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {[
                        ['GITHUB', profile.socials.github],
                        ['LINKEDIN', profile.socials.linkedin],
                        ['LEETCODE', profile.socials.leetcode],
                        ['SCHOLAR', profile.socials.scholar],
                        ['ORCID', profile.socials.orcid],
                    ].map(([label, href]) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ padding: '8px 14px', fontSize: '8px' }}>
                            {label} ↗
                        </a>
                    ))}
                </div>
            </div>
        </PanelShell>
    );
}

/* ── MACHINES ────────────────────────────────────────────────────────────── */
function MachinesPanel({ accent, selected, onSelect, onClose }: { accent: string; selected: string | null; onSelect: (id: string | null) => void; onClose: () => void }) {
    const proj: Project | undefined = selected ? projects.find((p) => p.id === selected) : undefined;

    if (!proj) {
        return (
            <PanelShell accent={accent} onClose={onClose}>
                <Tag accent={accent}>02 // MACHINES — ENGINEERING_WORK</Tag>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 200, fontSize: '30px', letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>Shipped systems.</h2>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', margin: 0 }}>
                    {'// CLICK A MOON IN ORBIT — OR A RECORD BELOW — TO OPEN ITS DOSSIER'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {projects.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => onSelect(p.id)}
                            className="world-row"
                            style={{
                                textAlign: 'left', background: 'none', border: 'none', borderTop: '1px solid var(--border)',
                                padding: '18px 4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '6px',
                            }}
                        >
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em', color: p.color }}>{p.impact}</span>
                            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 300, color: '#fff' }}>{p.name}</span>
                        </button>
                    ))}
                </div>
            </PanelShell>
        );
    }

    return (
        <PanelShell accent={accent} onClose={onClose}>
            <button onClick={() => onSelect(null)} style={{ background: 'none', border: 'none', color: accent, fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', cursor: 'pointer', alignSelf: 'flex-start', padding: 0 }}>
                ← ALL SYSTEMS
            </button>
            <Tag accent={proj.color}>{proj.impact}</Tag>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '24px', letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>{proj.name}</h2>

            {/* Media slot: video > poster > pending frame */}
            {proj.video ? (
                <video src={proj.video} poster={proj.poster ?? undefined} controls playsInline
                    style={{ width: '100%', aspectRatio: '16 / 9', background: '#000', border: `1px solid ${proj.color}40`, borderRadius: '2px', objectFit: 'cover' }} />
            ) : proj.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={proj.poster} alt={`${proj.name} preview`}
                    style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', border: `1px solid ${proj.color}40`, borderRadius: '2px' }} />
            ) : (
                <div style={{
                    width: '100%', aspectRatio: '16 / 9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    border: `1px dashed ${proj.color}35`, borderRadius: '2px', background: 'rgba(255,255,255,0.015)',
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>TRANSMISSION PENDING</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.16)' }}>{'// SET "VIDEO" OR "POSTER" IN data/projects.json'}</span>
                </div>
            )}

            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.7, margin: 0 }}>{proj.tagline}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {proj.specs.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: proj.color, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                        <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{s}</p>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {proj.tech.map((t) => (
                    <span key={t} className="mono-tag" style={{ fontSize: '8px', border: '1px solid rgba(255,255,255,0.09)', padding: '3px 9px' }}>{t}</span>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
                {proj.demo && <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ flex: 1, textAlign: 'center', borderColor: proj.color, color: proj.color }}>LIVE DEMO</a>}
                <a href={proj.code} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ flex: 1, textAlign: 'center' }}>VIEW CODE</a>
            </div>
        </PanelShell>
    );
}

/* ── TRAJECTORY ──────────────────────────────────────────────────────────── */
function TrajectoryPanel({ accent, onClose }: { accent: string; onClose: () => void }) {
    return (
        <PanelShell accent={accent} onClose={onClose}>
            <Tag accent={accent}>03 // TRAJECTORY — CHRONOLOGY</Tag>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 200, fontSize: '30px', letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>Flight record.</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {experience.map((exp) => (
                    <div key={exp.id} style={{ borderTop: '1px solid var(--border)', padding: '18px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                            <span className="mono-tag" style={{ fontSize: '8px', color: accent }}>{exp.company}</span>
                            <span className="mono-tag" style={{ fontSize: '8px' }}>{exp.date}</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 300, color: '#fff' }}>{exp.role}</span>
                        <ul style={{ listStyle: 'none', margin: 0, padding: '0 0 0 14px', borderLeft: `1px solid ${accent}35`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {exp.points.slice(0, 3).map((pt, i) => (
                                <li key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.6 }}>{pt}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </PanelShell>
    );
}

/* ── SIGNALS ─────────────────────────────────────────────────────────────── */
function SignalsPanel({ accent, onClose }: { accent: string; onClose: () => void }) {
    return (
        <PanelShell accent={accent} onClose={onClose}>
            <Tag accent={accent}>04 // SIGNALS — RESEARCH_TRANSMISSIONS</Tag>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 200, fontSize: '30px', letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>Signals sent.</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {publications.map((pub) => (
                    <div key={pub.number} style={{ borderTop: '1px solid var(--border)', padding: '18px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Tag accent={accent}>{pub.badge}</Tag>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 300, color: '#fff', lineHeight: 1.4 }}>{pub.title}</span>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{pub.description}</p>
                        <a href={pub.link} target="_blank" rel="noopener noreferrer"
                            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', color: accent, textDecoration: 'none', borderBottom: `1px solid ${accent}`, alignSelf: 'flex-start', paddingBottom: '1px' }}>
                            {pub.linkText}
                        </a>
                    </div>
                ))}
            </div>
        </PanelShell>
    );
}

/* ── ARSENAL ─────────────────────────────────────────────────────────────── */
function ArsenalPanel({ accent, onClose }: { accent: string; onClose: () => void }) {
    return (
        <PanelShell accent={accent} onClose={onClose}>
            <Tag accent={accent}>05 // ARSENAL — TECHNICAL_CONSTELLATION</Tag>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 200, fontSize: '30px', letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>Loadout.</h2>
            {skillCategories.map((cat) => (
                <div key={cat.id} style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Tag accent="var(--foreground-muted)">{cat.title}</Tag>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {cat.skills.map((s) => (
                            <span key={s.name} style={{
                                display: 'inline-flex', alignItems: 'center', gap: '7px',
                                border: '1px solid rgba(255,255,255,0.09)', padding: '5px 10px',
                                fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em',
                            }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={s.logoUrl} alt="" width={13} height={13} style={{ filter: 'brightness(1.2)' }} />
                                {s.name}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </PanelShell>
    );
}

/* ── BEACON ──────────────────────────────────────────────────────────────── */
function BeaconPanel({ accent, onClose }: { accent: string; onClose: () => void }) {
    return (
        <PanelShell accent={accent} onClose={onClose}>
            <Tag accent={accent}>06 // BEACON — CONTACT_SECURE</Tag>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 200, fontSize: '30px', letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>Open a channel.</h2>
            <a href={`mailto:${profile.email}`} className="glow-btn"
                style={{ borderColor: accent, color: accent, fontSize: '11px', padding: '14px 20px', textAlign: 'center', letterSpacing: '0.14em' }}>
                {profile.email}
            </a>
            <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', fontWeight: 300, lineHeight: 1.7, margin: 0 }}>
                Open channels for project development, systems engineering consultations, or research collaboration. Response window: 24–48h.
            </p>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ padding: '9px 16px', fontSize: '8px' }}>GITHUB ↗</a>
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ padding: '9px 16px', fontSize: '8px' }}>LINKEDIN ↗</a>
                <a href={profile.socials.leetcode} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ padding: '9px 16px', fontSize: '8px' }}>LEETCODE ↗</a>
                <a href={profile.resumeSite} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ padding: '9px 16px', fontSize: '8px', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>LIVE RESUME ↗</a>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <span className="mono-tag" style={{ fontSize: '8px' }}>{profile.phone}</span>
            </div>
        </PanelShell>
    );
}

export interface StopPanelProps {
    bodyId: string;
    selectedProjectId: string | null;
    onSelectProject: (id: string | null) => void;
    onClose: () => void;
}

export function StopPanel({ bodyId, selectedProjectId, onSelectProject, onClose }: StopPanelProps) {
    const accent = accentFor(bodyId);
    const content = (() => {
        switch (bodyId) {
            case 'origin': return <OriginPanel accent={accent} onClose={onClose} />;
            case 'machines': return <MachinesPanel accent={accent} selected={selectedProjectId} onSelect={onSelectProject} onClose={onClose} />;
            case 'trajectory': return <TrajectoryPanel accent={accent} onClose={onClose} />;
            case 'signals': return <SignalsPanel accent={accent} onClose={onClose} />;
            case 'arsenal': return <ArsenalPanel accent={accent} onClose={onClose} />;
            case 'beacon': return <BeaconPanel accent={accent} onClose={onClose} />;
            default: return null;
        }
    })();
    return <AnimatePresence mode="wait">{content}</AnimatePresence>;
}

export { featuredProjects };
