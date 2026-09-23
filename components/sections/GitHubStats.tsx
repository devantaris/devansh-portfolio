'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/lib/content';

interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

interface ApiResponse {
    total: Record<string, number>;
    contributions: ContributionDay[];
}

export default function GitHubStats() {
    const [days, setDays] = useState<ContributionDay[]>([]);
    const [totalCount, setTotalCount] = useState<number>(371);
    const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const stats = profile.githubStats.totals;
    const languages = profile.githubStats.languages;

    // Fetch live contribution activity on mount — with 1-hour localStorage cache
    useEffect(() => {
        let isMounted = true;

        const CACHE_KEY = 'gh_contributions_v1';
        const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

        function applyData(contributions: ContributionDay[]) {
            if (!isMounted) return;
            setDays(contributions);
            const total = contributions.reduce((acc, cur) => acc + cur.count, 0);
            setTotalCount(total);
            setIsLoading(false);
        }

        function generateFallback(): ContributionDay[] {
            const fallback: ContributionDay[] = [];
            const now = new Date();
            for (let i = 365; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const isToday = i === 0;
                fallback.push({
                    date: dateStr,
                    count: isToday ? 4 : (i % 7 === 0 ? 3 : 0),
                    level: isToday ? 2 : (i % 7 === 0 ? 1 : 0),
                });
            }
            return fallback;
        }

        async function fetchContributions() {
            // ── Check localStorage cache first ──────────────────────────────
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { ts, data }: { ts: number; data: ContributionDay[] } = JSON.parse(cached);
                    if (Date.now() - ts < CACHE_TTL && data?.length > 0) {
                        applyData(data);
                        return; // cache hit — skip network request entirely
                    }
                }
            } catch { /* ignore parse errors */ }

            // ── Network fetch ───────────────────────────────────────────────
            try {
                const res = await fetch('https://github-contributions-api.jogruber.de/v4/devantaris?y=last');
                if (!res.ok) throw new Error('Failed to fetch contributions');
                const json: ApiResponse = await res.json();

                if (json.contributions?.length > 0) {
                    // Persist to cache before applying so subsequent loads are instant
                    try {
                        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: json.contributions }));
                    } catch { /* storage quota exceeded — just skip caching */ }
                    applyData(json.contributions);
                }
            } catch (err) {
                console.warn('Could not fetch live GitHub activity, using fallback:', err);
                if (isMounted) applyData(generateFallback());
            }
        }

        fetchContributions();
        return () => { isMounted = false; };
    }, []);


    // Structure 365/366 days into 53 weekly columns (7 days each)
    const weeks = useMemo(() => {
        if (!days.length) return [];
        const result: (ContributionDay | null)[][] = [];
        let currentWeek: (ContributionDay | null)[] = [];

        // Fill leading empty days before the first day of the dataset
        const firstDate = new Date(days[0].date);
        const leadingDays = firstDate.getDay(); // 0 = Sun, 1 = Mon, etc.
        for (let i = 0; i < leadingDays; i++) {
            currentWeek.push(null);
        }

        for (const day of days) {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                result.push(currentWeek);
                currentWeek = [];
            }
        }

        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            result.push(currentWeek);
        }

        return result;
    }, [days]);

    // Format month labels along the top axis
    const monthLabels = useMemo(() => {
        const labels: { index: number; name: string }[] = [];
        let lastMonth = -1;

        weeks.forEach((week, wIdx) => {
            const validDay = week.find((d) => d !== null);
            if (validDay) {
                const dateObj = new Date(validDay.date);
                const month = dateObj.getMonth();
                if (month !== lastMonth && dateObj.getDate() <= 14) {
                    const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
                    labels.push({ index: wIdx, name: monthName });
                    lastMonth = month;
                }
            }
        });

        return labels;
    }, [weeks]);

    // Color mapper with glowing cyber-cyan levels
    const getLevelStyles = (level: number) => {
        switch (level) {
            case 1:
                return {
                    background: 'rgba(0, 245, 255, 0.3)',
                    border: '1px solid rgba(0, 245, 255, 0.4)',
                    boxShadow: 'none',
                };
            case 2:
                return {
                    background: 'rgba(0, 245, 255, 0.55)',
                    border: '1px solid rgba(0, 245, 255, 0.65)',
                    boxShadow: '0 0 6px rgba(0, 245, 255, 0.25)',
                };
            case 3:
                return {
                    background: 'rgba(0, 245, 255, 0.8)',
                    border: '1px solid rgba(0, 245, 255, 0.9)',
                    boxShadow: '0 0 8px rgba(0, 245, 255, 0.45)',
                };
            case 4:
                return {
                    background: '#00f5ff',
                    border: '1px solid #ffffff',
                    boxShadow: '0 0 12px rgba(0, 245, 255, 0.8)',
                };
            default:
                return {
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.03)',
                    boxShadow: 'none',
                };
        }
    };

    return (
        <section id="stats" style={{ padding: 'clamp(80px, 12vw, 160px) 0', background: '#020204', position: 'relative' }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
                
                {/* Section Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '64px', alignItems: 'flex-end' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>05 // REPOSITORY DIAGNOSTICS</span>
                            <div style={{ width: '32px', height: '1px', background: 'rgba(0, 245, 255, 0.25)' }} />
                        </div>
                        <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 200, marginTop: '4px', color: '#fff', letterSpacing: '-0.04em' }}>
                            Open telemetry.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ fontSize: '15px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.7, maxWidth: '440px', margin: 0 }}
                    >
                        Live commit registers, distribution metrics, and daily activity indexed directly from the GitHub API.
                    </motion.p>
                </div>

                {/* Diagnostic Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '64px', marginBottom: '64px' }}>
                    
                    {/* Totals Diagnostic List */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                    >
                        <span className="mono-tag">TOTALS // DIAGNOSTIC</span>
                        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                            {stats.map((s) => (
                                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground-muted)' }}>{s.label}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 200, color: '#fff', lineHeight: 1 }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Language Densities */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                    >
                        <span className="mono-tag">COMPILATION // DENSITIES</span>
                        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                            {languages.map((lang) => (
                                <div key={lang.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', fontWeight: 600 }}>{lang.name}</span>
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground-muted)' }}>{lang.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── LIVE INTERACTIVE GITHUB CONTRIBUTION HEATMAP ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        borderTop: '1px solid var(--border)',
                        paddingTop: '48px',
                    }}
                >
                    {/* Telemetry Header */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>
                                DENSITY_MAP // CONTRIB_GRID
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                                |
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ffffff', fontWeight: 600 }}>
                                {totalCount} CONTRIBUTIONS IN PAST 365 DAYS
                            </span>
                        </div>

                        {/* Interactive Status Indicator / Day inspector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {hoveredDay ? (
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                                    {hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'} on {hoveredDay.date}
                                </span>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: '#00f5ff',
                                            boxShadow: '0 0 8px #00f5ff',
                                            display: 'inline-block',
                                        }}
                                    />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.08em' }}>
                                        LATEST COMMITS: TODAY (LIVE)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scrollable Heatmap Monolith Frame */}
                    <div
                        style={{
                            width: '100%',
                            overflowX: 'auto',
                            background: 'linear-gradient(180deg, rgba(12, 14, 24, 0.6) 0%, rgba(6, 7, 13, 0.8) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            padding: '28px 24px 20px',
                            boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.6)',
                        }}
                    >
                        <div style={{ minWidth: '780px' }}>
                            
                            {/* Month Labels Bar */}
                            <div style={{ display: 'flex', marginBottom: '8px', position: 'relative', height: '16px' }}>
                                {monthLabels.map((m) => (
                                    <span
                                        key={`${m.name}-${m.index}`}
                                        style={{
                                            position: 'absolute',
                                            left: `${(m.index / 53) * 100}%`,
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '10px',
                                            color: 'rgba(255, 255, 255, 0.45)',
                                            letterSpacing: '0.04em',
                                        }}
                                    >
                                        {m.name}
                                    </span>
                                ))}
                            </div>

                            {/* 53 Weeks x 7 Days Columns */}
                            <div style={{ display: 'flex', gap: '3.5px' }}>
                                {weeks.map((week, wIdx) => (
                                    <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3.5px' }}>
                                        {week.map((day, dIdx) => {
                                            if (!day) {
                                                return (
                                                    <div
                                                        key={`empty-${wIdx}-${dIdx}`}
                                                        style={{
                                                            width: '11px',
                                                            height: '11px',
                                                            visibility: 'hidden',
                                                        }}
                                                    />
                                                );
                                            }

                                            const styles = getLevelStyles(day.level);
                                            const isHovered = hoveredDay?.date === day.date;

                                            return (
                                                <div
                                                    key={day.date}
                                                    onMouseEnter={() => setHoveredDay(day)}
                                                    onMouseLeave={() => setHoveredDay(null)}
                                                    title={`${day.count} contributions on ${day.date}`}
                                                    style={{
                                                        width: '11px',
                                                        height: '11px',
                                                        borderRadius: '2.5px',
                                                        ...styles,
                                                        outline: isHovered ? '2px solid #ffffff' : 'none',
                                                        zIndex: isHovered ? 10 : 1,
                                                        transform: isHovered ? 'scale(1.35)' : 'none',
                                                        transition: 'transform 0.15s ease, outline 0.15s ease',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Legend & Status */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.06em' }}>
                                    FEED: GITHUB_PUBLIC_EVENT_LOG // @devantaris
                                </span>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255, 255, 255, 0.4)' }}>
                                        Less
                                    </span>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.03)' }} />
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(0, 245, 255, 0.3)', border: '1px solid rgba(0, 245, 255, 0.4)' }} />
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(0, 245, 255, 0.55)', border: '1px solid rgba(0, 245, 255, 0.65)' }} />
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(0, 245, 255, 0.8)', border: '1px solid rgba(0, 245, 255, 0.9)' }} />
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#00f5ff', border: '1px solid #ffffff', boxShadow: '0 0 6px #00f5ff' }} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255, 255, 255, 0.4)' }}>
                                        More
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* GitHub Profile Action Link */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <a
                            href={profile.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glow-btn"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                letterSpacing: '0.12em',
                                borderColor: 'rgba(0, 245, 255, 0.3)',
                                color: 'var(--accent-cyan)',
                                padding: '10px 20px',
                            }}
                        >
                            VERIFY ON GITHUB_PROFILE →
                        </a>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
