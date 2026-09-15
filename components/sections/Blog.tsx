'use client';

import { motion } from 'framer-motion';

const publications = [
    {
        number: '01',
        title: '"Knowing When Not to Decide: A Staged Uncertainty-Aware Framework for Fraud Decisioning"',
        badge: 'FIRST AUTHOR // RESEARCH MANUSCRIPT',
        status: 'TARGETING IEEE TDSC & CONFERENCES',
        description: 'Architected a staged decisioning framework routing 284K+ transactions through distinct uncertainty layers: abstention-aware XGBoost ensemble router, calibrated SVM second-opinion for epistemic uncertainty, Dempster-Shafer belief fusion across 3 evidence sources, and SHAP-backed structured deferral. Achieved 100% DECLINE precision and 100% automation rate.',
        link: 'https://mari-alpha.vercel.app',
        linkText: 'VIEW MARI FRAMEWORK →'
    },
    {
        number: '02',
        title: 'Simply Universe',
        badge: 'PUBLISHED BOOK // CO-AUTHOR',
        status: 'POTHI PUBLICATIONS',
        description: 'Co-authored published book breaking down cosmological phenomena, astrophysics principles, and systemic models for scientific enthusiasts. Explores theoretical bounds and foundational laws governing physical architectures.',
        link: 'https://devantaris.github.io',
        linkText: 'SEE CITATION →'
    },
    {
        number: '03',
        title: 'IBM Machine Learning Professional Certificate',
        badge: 'PROFESSIONAL ACCREDITATION',
        status: 'CREDENTIAL: TYJU31W22CSJ // FEB 2026',
        description: 'Professional validation spanning supervised and unsupervised machine learning, deep learning, hyperparameter calibration, feature engineering with SMOTE/StandardScaler, and production model evaluation.',
        link: 'https://www.coursera.org/account/accomplishments/specialization/TYJU31W22CSJ',
        linkText: 'VERIFY CREDENTIAL →'
    },
    {
        number: '04',
        title: 'FastAPI & Backend Development Specialization',
        badge: 'BACKEND SPECIALIZATION',
        status: 'PACKT / COURSERA // MAR 2026',
        description: 'Advanced asynchronous API architectures, SQLAlchemy 2.0 ORM, PgBouncer connection pooling, Redis caching patterns, Celery background worker queues, and Dockerized microservice deployments.',
        link: 'https://devantaris.github.io',
        linkText: 'VIEW CURRICULUM →'
    },
];

export default function Blog() {
    return (
        <section id="blog" style={{ padding: 'clamp(100px, 15vw, 200px) 0', background: '#020204', position: 'relative' }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
                
                {/* Section Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '80px', alignItems: 'flex-end' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>04 // RESEARCH & PUBLICATIONS</span>
                        <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 200, marginTop: '8px', color: '#fff', letterSpacing: '-0.04em' }}>
                            Publications & research.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ fontSize: '15px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.7, maxWidth: '440px', margin: 0 }}
                    >
                        First-author research manuscripts, published books, and certified technical specializations.
                    </motion.p>
                </div>

                {/* Editorial Brutalist List */}
                <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                    {publications.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                                gap: '40px',
                                padding: '48px 0',
                                borderBottom: '1px solid var(--border)',
                                alignItems: 'flex-start'
                            }}
                        >
                            {/* Number, Badge and Title Block */}
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'baseline' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                                    {item.number}
                                </span>
                                <div>
                                    <span style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '8px',
                                        letterSpacing: '0.12em',
                                        color: 'var(--accent-cyan)',
                                        border: '1px solid rgba(0, 245, 255, 0.25)',
                                        padding: '2px 8px',
                                        display: 'inline-block',
                                        marginBottom: '10px'
                                    }}>
                                        {item.badge}
                                    </span>
                                    <h3 style={{ fontSize: '20px', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.35, fontFamily: 'var(--font-serif)', margin: '0 0 10px 0' }}>
                                        {item.title}
                                    </h3>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--foreground-muted)' }}>
                                        STATUS: [{item.status}]
                                    </div>
                                </div>
                            </div>

                            {/* Description and Action Link */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 300, lineHeight: 1.7, margin: 0 }}>
                                    {item.description}
                                </p>
                                <div>
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '10px',
                                            color: 'var(--accent-cyan)',
                                            textDecoration: 'none',
                                            borderBottom: '1px solid var(--accent-cyan)',
                                            paddingBottom: '2px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        {item.linkText}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', gap: '16px' }}>
                    <a
                        href="https://devantaris.github.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glow-btn"
                        style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                    >
                        VIEW FULL ACADEMIC RESUME ↗
                    </a>
                    <a
                        href="https://linkedin.com/in/devansh-kumar-3b3701217"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glow-btn"
                    >
                        LINKEDIN PROFILE →
                    </a>
                </div>
            </div>
        </section>
    );
}
