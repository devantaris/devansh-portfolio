'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import * as THREE from 'three';

const projects = [
    {
        number: '01',
        name: 'MARI — ML FRAUD ENGINE',
        tagline: 'Real-time payment anomaly detection. 99.8% precision at 45 ms p99 latency.',
        tech: ['Python', 'XGBoost', 'FastAPI', 'PostgreSQL', 'Scikit-learn'],
        demo: 'https://mari-alpha.vercel.app',
        code: 'https://github.com/devantaris/mari',
        color: '#00e5ff',
        impact: '284k transactions · 99.8% precision · 45ms p99',
        specs: [
            'Trained XGBoost classifier on 284k labelled payment records; tuned via Bayesian hyperparameter search to achieve 99.8% precision and 0.2% false-positive rate.',
            'Served predictions through a FastAPI async inference endpoint; benchmarked at 45ms p99 on t3.medium with connection-pooled PostgreSQL write-backs.',
            'Engineered feature-engineering pipeline with StandardScaler normalisation and SMOTE oversampling to handle severe class imbalance (fraud ≈ 0.17% of dataset).',
        ]
    },
    {
        number: '02',
        name: 'FLUTTER OTT PLATFORM',
        tagline: 'Cross-platform streaming client shipping to Android & iOS with offline-first architecture.',
        tech: ['Flutter', 'Dart', 'BLoC', 'SQLite', 'REST API'],
        demo: null,
        code: 'https://github.com/devantaris/flutter-ott-app',
        color: '#b500fa',
        impact: '60fps · Offline-first · BLoC state mgmt',
        specs: [
            'Built offline-first media client using SQLite WAL mode for zero-read-latency episode caching; cold launch under 800 ms on mid-range Android.',
            'Implemented strict BLoC separation—UI layer carries zero business logic; state transitions are pure functions enabling deterministic unit tests.',
            'Achieved consistent 60fps on 120Hz displays via RepaintBoundary isolation and Flutter DevTools profiling; GPU frame budget under 6ms.',
        ]
    },
    {
        number: '03',
        name: 'BIOME — ELECTRON DESKTOP',
        tagline: 'Procedural focus environment shipped as a native desktop app via Electron + React.',
        tech: ['React', 'TypeScript', 'Electron', 'Firebase', 'Canvas API'],
        demo: null,
        code: 'https://github.com/devantaris/Biome',
        color: '#ff5500',
        impact: 'Native IPC bridge · Firestore sync · Procedural renderer',
        specs: [
            'Architected bidirectional Electron IPC channel exposing OS-level idle detection and notification APIs to the React renderer without remote-module security holes.',
            'Built a procedural world renderer using the Canvas 2D API — generates deterministic environments from a user seed, ensuring identical scenes across sessions.',
            'Integrated Firestore real-time listeners for cross-device session persistence; applied optimistic UI updates with rollback on snapshot conflict.',
        ]
    },
    {
        number: '04',
        name: 'SKILLSYNC — P2P EXCHANGE',
        tagline: 'Decentralised peer course-credit marketplace with RLS-secured ledger and Razorpay checkout.',
        tech: ['React', 'Node.js', 'Supabase', 'PostgreSQL', 'Razorpay'],
        demo: 'https://skill-sync-steel-rho.vercel.app',
        code: 'https://github.com/devantaris/SkillSync',
        color: '#a0ff60',
        impact: 'RLS row security · Double-entry ledger · Webhook verified',
        specs: [
            'Implemented double-entry credit ledger in PostgreSQL with ACID transactions and trigger-enforced balance invariants—zero credit can be created or destroyed.',
            'Secured all data access with Supabase Row Level Security policies; users can only read/write their own rows, enforced at DB level independent of API logic.',
            'Integrated Razorpay checkout with HMAC-SHA256 webhook signature verification; payment state machine prevents partial fulfilment on network failures.',
        ]
    },
];

export default function Projects() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Use a ref for active index so the Three.js loop reads it without
    // triggering useEffect re-runs (which was destroying/rebuilding WebGL).
    const activeIdxRef = useRef(0);
    const [activeIdx, setActiveIdx] = useState(0); // only for React UI re-render
    const [inspectedProj, setInspectedProj] = useState<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });

    const scrollToProject = (idx: number) => {
        if (!sectionRef.current) return;
        const el = sectionRef.current;
        const scrollRange = el.scrollHeight - window.innerHeight;
        const target = el.offsetTop + (idx / (projects.length - 1)) * scrollRange;
        window.scrollTo({ top: target, behavior: 'smooth' });
    };

    // Three.js scene — runs ONCE only (no activeIdx in dep array)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();

        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 2000);
        camera.position.set(0, 0, 60);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(w, h, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        const SPACING = 100; // Z-distance between panels
        const projectGroups: THREE.Group[] = [];
        const artifactMeshes: THREE.Mesh[] = [];
        const wireframeMats: THREE.LineBasicMaterial[] = [];
        const backLightMats: THREE.MeshBasicMaterial[] = [];

        projects.forEach((proj, idx) => {
            const group = new THREE.Group();
            const isLeft = idx % 2 === 0;
            // Stagger X so panels are left / right of centre
            const xPos = isLeft ? -10 : 10;

            // Background panel
            const panelGeo = new THREE.PlaneGeometry(36, 20);
            const panelMat = new THREE.MeshBasicMaterial({
                color: 0x020204,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.94,
            });
            group.add(new THREE.Mesh(panelGeo, panelMat));

            // Wireframe outline
            const wfMat = new THREE.LineBasicMaterial({
                color: new THREE.Color(proj.color),
                transparent: true,
                opacity: idx === 0 ? 0.7 : 0.12,
            });
            const wf = new THREE.LineSegments(new THREE.EdgesGeometry(panelGeo), wfMat);
            wf.name = 'wireframe';
            group.add(wf);
            wireframeMats.push(wfMat);

            // Subtle backing glow
            const blMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(proj.color),
                transparent: true,
                opacity: idx === 0 ? 0.04 : 0.005,
                blending: THREE.AdditiveBlending,
            });
            const bl = new THREE.Mesh(new THREE.PlaneGeometry(42, 26), blMat);
            bl.position.z = -1;
            bl.name = 'backLight';
            group.add(bl);
            backLightMats.push(blMat);

            // Floating geometric artifact
            const geoms = [
                new THREE.IcosahedronGeometry(4, 1),
                new THREE.TorusKnotGeometry(2.5, 0.8, 80, 8),
                new THREE.OctahedronGeometry(4, 0),
                new THREE.DodecahedronGeometry(3.8, 0),
            ];
            const artMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(proj.color),
                wireframe: true,
                transparent: true,
                opacity: 0.4,
            });
            const art = new THREE.Mesh(geoms[idx % geoms.length], artMat);
            art.position.set(isLeft ? 20 : -20, 1, 3);
            group.add(art);
            artifactMeshes.push(art);

            group.position.set(xPos, 0, -idx * SPACING);
            scene.add(group);
            projectGroups.push(group);
        });

        let scrollVal = 0;
        let mouseX = 0;
        let mouseY = 0;

        const unsub = scrollYProgress.on('change', (v) => { scrollVal = v; });

        const onMouse = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
            mouseY = -((e.clientY - r.top) / r.height) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouse, { passive: true });

        let animId: number;
        const animate = () => {
            animId = requestAnimationFrame(animate);

            const total = projects.length;
            const frac = scrollVal * (total - 1);
            const cur = Math.min(Math.floor(frac + 0.5), total - 1); // round to nearest

            // Camera Z: travel from panel 0 to last panel
            const targetZ = 60 - scrollVal * (total - 1) * SPACING;
            // Camera X: pan gently toward active panel's side
            const targetX = (cur % 2 === 0 ? -6 : 6) + mouseX * 2;
            const targetY = mouseY * 1.5;

            camera.position.z += (targetZ - camera.position.z) * 0.07;
            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (targetY - camera.position.y) * 0.05;
            camera.lookAt(camera.position.x * 0.3, 0, camera.position.z - 60);

            // Artifact spin
            artifactMeshes.forEach((m, i) => {
                m.rotation.y += 0.007 + i * 0.002;
                m.rotation.x += 0.003 + i * 0.001;
            });

            // Glow the active panel, dim others
            wireframeMats.forEach((mat, i) => {
                const target = i === cur ? 0.8 : 0.1;
                mat.opacity += (target - mat.opacity) * 0.08;
            });
            backLightMats.forEach((mat, i) => {
                const target = i === cur ? 0.05 : 0.003;
                mat.opacity += (target - mat.opacity) * 0.08;
            });

            // Update React state only when index actually changes
            if (cur !== activeIdxRef.current) {
                activeIdxRef.current = cur;
                setActiveIdx(cur);
            }

            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            const nw = canvas.clientWidth;
            const nh = canvas.clientHeight;
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh, false);
        };
        const ro = new ResizeObserver(onResize);
        ro.observe(canvas);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouse);
            unsub();
            ro.disconnect();
            projectGroups.forEach((g) =>
                g.children.forEach((c) => {
                    if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose();
                    if ((c as THREE.Mesh).material) ((c as THREE.Mesh).material as THREE.Material).dispose();
                })
            );
            renderer.dispose();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrollYProgress]); // Only scrollYProgress — never activeIdx

    const proj = projects[activeIdx];

    return (
        <section
            ref={sectionRef}
            id="projects"
            style={{ height: `${projects.length * 100}vh`, position: 'relative', background: '#020204' }}
        >
            {/* Sticky viewport */}
            <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

                {/* WebGL canvas */}
                <canvas
                    ref={canvasRef}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
                />

                {/* Left project index nav */}
                <div style={{
                    position: 'absolute',
                    left: 'clamp(20px, 4vw, 56px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', color: 'var(--foreground-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Projects
                    </span>
                    {projects.map((p, i) => (
                        <button
                            key={p.number}
                            onClick={() => scrollToProject(i)}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                        >
                            <span style={{
                                width: i === activeIdx ? '20px' : '8px',
                                height: '1px',
                                background: i === activeIdx ? p.color : 'rgba(255,255,255,0.2)',
                                transition: 'all 0.4s ease',
                                display: 'block',
                            }} />
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '9px',
                                color: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.25)',
                                transition: 'color 0.3s ease',
                                letterSpacing: '0.08em',
                            }}>
                                {p.number}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 'clamp(80px, 10vh, 120px) clamp(24px, 6vw, 96px) clamp(40px, 6vh, 64px)',
                    pointerEvents: 'none',
                }}>

                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: 'clamp(60px, 8vw, 120px)' }}>
                        <div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--foreground-muted)', textTransform: 'uppercase' }}>
                                04 // Engineering Work
                            </span>
                            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 200, marginTop: '6px', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                                Shipped systems.
                            </h2>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
                            SCROLL TO EXPLORE
                        </span>
                    </div>

                    {/* Active project card */}
                    <motion.div
                        key={activeIdx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            pointerEvents: 'auto',
                            alignSelf: 'flex-start',
                            maxWidth: '420px',
                            paddingLeft: 'clamp(60px, 8vw, 120px)',
                        }}
                    >
                        {/* Impact chip */}
                        <div style={{
                            display: 'inline-block',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '8px',
                            letterSpacing: '0.12em',
                            color: proj.color,
                            border: `1px solid ${proj.color}40`,
                            padding: '3px 10px',
                            borderRadius: '2px',
                            marginBottom: '14px',
                            background: `${proj.color}08`,
                        }}>
                            {proj.impact}
                        </div>

                        <h3 style={{ fontSize: 'clamp(16px, 1.8vw, 21px)', fontWeight: 300, color: '#fff', margin: '0 0 8px 0', fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                            {proj.name}
                        </h3>

                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.6, margin: '0 0 20px 0' }}>
                            {proj.tagline}
                        </p>

                        {/* Tech pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                            {proj.tech.map((t) => (
                                <span key={t} style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '8px',
                                    letterSpacing: '0.08em',
                                    color: 'rgba(255,255,255,0.5)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    padding: '3px 8px',
                                    borderRadius: '2px',
                                }}>
                                    {t}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => setInspectedProj(activeIdx)}
                            style={{
                                background: 'transparent',
                                border: `1px solid ${proj.color}50`,
                                color: proj.color,
                                fontFamily: 'var(--font-mono)',
                                fontSize: '9px',
                                letterSpacing: '0.12em',
                                padding: '9px 18px',
                                cursor: 'pointer',
                                borderRadius: '2px',
                                transition: 'all 0.25s ease',
                                textTransform: 'uppercase',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = `${proj.color}15`;
                                e.currentTarget.style.borderColor = proj.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = `${proj.color}50`;
                            }}
                        >
                            View Technical Details
                        </button>
                    </motion.div>

                    {/* Footer dots */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 'clamp(60px, 8vw, 120px)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em' }}>
                            PROJECT {activeIdx + 1} / {projects.length}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {projects.map((_, i) => (
                                <div
                                    key={i}
                                    onClick={() => scrollToProject(i)}
                                    style={{
                                        width: i === activeIdx ? '24px' : '6px',
                                        height: '2px',
                                        borderRadius: '1px',
                                        background: i === activeIdx ? proj.color : 'rgba(255,255,255,0.15)',
                                        transition: 'all 0.4s ease',
                                        cursor: 'pointer',
                                        pointerEvents: 'auto',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Side inspector drawer */}
            <AnimatePresence>
                {inspectedProj !== null && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setInspectedProj(null)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(2,2,4,0.7)', backdropFilter: 'blur(12px)', zIndex: 900 }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                            style={{
                                position: 'fixed',
                                top: 0, right: 0, bottom: 0,
                                width: 'min(100vw, 520px)',
                                background: '#08080c',
                                borderLeft: `1px solid ${projects[inspectedProj].color}30`,
                                padding: 'clamp(28px, 5vw, 56px)',
                                zIndex: 999,
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '32px',
                            }}
                        >
                            {/* Drawer header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', color: projects[inspectedProj].color, textTransform: 'uppercase' }}>
                                    Technical Breakdown — {projects[inspectedProj].number}
                                </span>
                                <button
                                    onClick={() => setInspectedProj(null)}
                                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', fontSize: '9px', cursor: 'pointer', letterSpacing: '0.1em' }}
                                >
                                    [ ESC ]
                                </button>
                            </div>

                            {/* Project name + tagline */}
                            <div>
                                <h4 style={{ fontSize: '22px', fontWeight: 300, fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em', margin: '0 0 8px', color: '#fff' }}>
                                    {projects[inspectedProj].name}
                                </h4>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
                                    {projects[inspectedProj].tagline}
                                </p>
                            </div>

                            {/* Impact chip */}
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '9px',
                                letterSpacing: '0.1em',
                                color: projects[inspectedProj].color,
                                border: `1px solid ${projects[inspectedProj].color}40`,
                                padding: '8px 14px',
                                borderRadius: '2px',
                                background: `${projects[inspectedProj].color}08`,
                                display: 'inline-block',
                            }}>
                                {projects[inspectedProj].impact}
                            </div>

                            {/* Engineering details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                                    Engineering Details
                                </span>
                                {projects[inspectedProj].specs.map((s, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'baseline' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: projects[inspectedProj].color, flexShrink: 0 }}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0, fontWeight: 300 }}>
                                            {s}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Tech stack */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                                    Stack
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {projects[inspectedProj].tech.map((t) => (
                                        <span key={t} style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '9px',
                                            color: '#fff',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.07)',
                                            padding: '5px 12px',
                                            borderRadius: '2px',
                                            letterSpacing: '0.06em',
                                        }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Links */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                {projects[inspectedProj].demo && (
                                    <a
                                        href={projects[inspectedProj].demo!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            flex: 1,
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '9px',
                                            letterSpacing: '0.12em',
                                            color: projects[inspectedProj].color,
                                            border: `1px solid ${projects[inspectedProj].color}`,
                                            padding: '11px',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            borderRadius: '2px',
                                            transition: 'background 0.2s',
                                            textTransform: 'uppercase',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = `${projects[inspectedProj].color}12`}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        Live Demo
                                    </a>
                                )}
                                <a
                                    href={projects[inspectedProj].code}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: 1,
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '9px',
                                        letterSpacing: '0.12em',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        padding: '11px',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        borderRadius: '2px',
                                        transition: 'background 0.2s',
                                        textTransform: 'uppercase',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    View Code
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
