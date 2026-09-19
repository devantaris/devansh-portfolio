'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';
import { featuredProjects as projects } from '@/lib/content';
import { useMotionCapable } from '@/hooks/useMotionCapable';

const SPACING = 120; // Z-distance between panels in 3D space

export default function Projects() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Track active index in a ref — never inside the Three.js useEffect deps
    const activeIdxRef = useRef(0);
    const [activeIdx, setActiveIdx] = useState(0);
    const [inspectedProj, setInspectedProj] = useState<number | null>(null);
    const motionCapable = useMotionCapable();

    // Scroll to a specific project
    const scrollToProject = (idx: number) => {
        const el = sectionRef.current;
        if (!el) return;
        const scrollRange = el.offsetHeight - window.innerHeight;
        const target = el.offsetTop + (idx / (projects.length - 1)) * scrollRange;
        window.scrollTo({ top: target, behavior: 'smooth' });
    };

    // ─── Three.js Engine (runs ONCE) ─────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        const section = sectionRef.current;
        if (!canvas || !section) return;
        // Skip the WebGL engine on mobile, touch, and reduced-motion devices
        if (!motionCapable) return;

        const scene = new THREE.Scene();

        const getSize = () => ({
            w: canvas.clientWidth || window.innerWidth,
            h: canvas.clientHeight || window.innerHeight,
        });
        const { w, h } = getSize();

        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 2000);
        camera.position.set(0, 0, 60);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(w, h, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        // ── Build panels ──────────────────────────────────────────────────────
        const projectGroups: THREE.Group[] = [];
        const artifactMeshes: THREE.Mesh[] = [];
        const wireframeMats: THREE.LineBasicMaterial[] = [];
        const backLightMats: THREE.MeshBasicMaterial[] = [];

        projects.forEach((proj, idx) => {
            const group = new THREE.Group();
            const isLeft = idx % 2 === 0;
            const xPos = isLeft ? -8 : 8;

            // Background panel
            const panelGeo = new THREE.PlaneGeometry(38, 22);
            const panelMat = new THREE.MeshBasicMaterial({
                color: 0x020204,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.95,
            });
            group.add(new THREE.Mesh(panelGeo, panelMat));

            // Glowing wireframe border
            const wfMat = new THREE.LineBasicMaterial({
                color: new THREE.Color(proj.color),
                transparent: true,
                opacity: idx === 0 ? 0.75 : 0.1,
            });
            const wf = new THREE.LineSegments(new THREE.EdgesGeometry(panelGeo), wfMat);
            group.add(wf);
            wireframeMats.push(wfMat);

            // Backing glow
            const blMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(proj.color),
                transparent: true,
                opacity: idx === 0 ? 0.05 : 0.003,
                blending: THREE.AdditiveBlending,
            });
            const bl = new THREE.Mesh(new THREE.PlaneGeometry(44, 28), blMat);
            bl.position.z = -1;
            group.add(bl);
            backLightMats.push(blMat);

            // Floating geometry artifact
            const artGeos: THREE.BufferGeometry[] = [
                new THREE.IcosahedronGeometry(4.5, 1),
                new THREE.TorusKnotGeometry(2.8, 0.9, 80, 8),
                new THREE.OctahedronGeometry(4.5, 0),
                new THREE.DodecahedronGeometry(4.2, 0),
            ];
            const artMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(proj.color),
                wireframe: true,
                transparent: true,
                opacity: 0.45,
            });
            const art = new THREE.Mesh(artGeos[idx % artGeos.length], artMat);
            art.position.set(isLeft ? 22 : -22, 0, 3);
            group.add(art);
            artifactMeshes.push(art);

            group.position.set(xPos, 0, -idx * SPACING);
            scene.add(group);
            projectGroups.push(group);
        });

        // ── Scroll progress (plain window listener — works with Lenis) ────────
        const scrollValRef = { current: 0 };

        const updateScroll = () => {
            const el = sectionRef.current;
            if (!el) return;
            // Use getBoundingClientRect so this works even when Lenis transforms the body
            const rect = el.getBoundingClientRect();
            const totalScrollable = el.offsetHeight - window.innerHeight;
            if (totalScrollable <= 0) return;
            // rect.top is negative once we scroll past the section top
            const scrolled = -rect.top;
            scrollValRef.current = Math.max(0, Math.min(1, scrolled / totalScrollable));
        };

        window.addEventListener('scroll', updateScroll, { passive: true });
        updateScroll(); // initialise

        // ── Mouse parallax ────────────────────────────────────────────────────
        let mouseX = 0;
        let mouseY = 0;
        const onMouse = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
            mouseY = -((e.clientY - r.top) / r.height) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouse, { passive: true });

        // ── Animation loop ────────────────────────────────────────────────────
        let animId: number;
        const animate = () => {
            animId = requestAnimationFrame(animate);

            const sv = scrollValRef.current;
            const total = projects.length;
            const frac = sv * (total - 1);
            const cur = Math.min(Math.round(frac), total - 1);

            // Camera Z travels through the panels
            const targetZ = 60 - frac * SPACING;
            // Camera X gently pans to current panel's side
            const sideX = cur % 2 === 0 ? -4 : 4;
            const targetX = sideX + mouseX * 2.5;
            const targetY = mouseY * 1.5;

            camera.position.z += (targetZ - camera.position.z) * 0.08;
            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (targetY - camera.position.y) * 0.05;

            // Look slightly ahead of current position
            camera.lookAt(camera.position.x * 0.4, 0, camera.position.z - 50);

            // Spin artifacts
            artifactMeshes.forEach((m, i) => {
                m.rotation.y += 0.007 + i * 0.002;
                m.rotation.x += 0.003 + i * 0.001;
            });

            // Pulse active panel's glow
            wireframeMats.forEach((mat, i) => {
                mat.opacity += ((i === cur ? 0.8 : 0.08) - mat.opacity) * 0.08;
            });
            backLightMats.forEach((mat, i) => {
                mat.opacity += ((i === cur ? 0.06 : 0.003) - mat.opacity) * 0.08;
            });

            // Update React UI only when index flips
            if (cur !== activeIdxRef.current) {
                activeIdxRef.current = cur;
                setActiveIdx(cur);
            }

            renderer.render(scene, camera);
        };
        animate();

        // ── Resize ────────────────────────────────────────────────────────────
        const onResize = () => {
            const { w: nw, h: nh } = getSize();
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh, false);
        };
        const ro = new ResizeObserver(onResize);
        ro.observe(canvas);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('scroll', updateScroll);
            window.removeEventListener('mousemove', onMouse);
            ro.disconnect();
            projectGroups.forEach((g) =>
                g.children.forEach((c: THREE.Object3D) => {
                    const mesh = c as THREE.Mesh;
                    if (mesh.geometry) mesh.geometry.dispose();
                    if (mesh.material) (mesh.material as THREE.Material).dispose();
                })
            );
            renderer.dispose();
        };
    }, [motionCapable]); // engine (re)starts once motion capability is known

    const proj = projects[activeIdx];

    // Mobile / reduced-motion fallback: plain stacked cards, no WebGL, no scroll-jack
    if (!motionCapable) {
        return (
            <section id="projects" style={{ background: '#020204', padding: 'clamp(80px, 12vw, 120px) 0', position: 'relative' }}>
                <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
                    <span className="mono-tag" style={{ color: 'rgba(255,255,255,0.35)' }}>04 // ENGINEERING WORK</span>
                    <h2 style={{ fontSize: 'clamp(26px, 7vw, 42px)', fontWeight: 200, marginTop: '6px', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '40px' }}>
                        Shipped systems.
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {projects.map((p) => (
                            <div
                                key={p.id}
                                style={{
                                    border: `1px solid ${p.color}30`,
                                    borderLeft: `2px solid ${p.color}`,
                                    padding: '24px',
                                    background: '#050508',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                }}
                            >
                                <span className="mono-tag" style={{ color: p.color }}>{p.impact}</span>
                                <h3 style={{ fontSize: '18px', fontWeight: 300, color: '#fff', margin: 0, fontFamily: 'var(--font-serif)' }}>{p.name}</h3>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.65, margin: 0 }}>{p.tagline}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {p.tech.slice(0, 5).map((t) => (
                                        <span key={t} className="mono-tag" style={{ fontSize: '8px', border: '1px solid rgba(255,255,255,0.08)', padding: '3px 8px' }}>{t}</span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                                    <Link href="/projects" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', color: p.color, textDecoration: 'none', border: `1px solid ${p.color}55`, padding: '8px 14px', textTransform: 'uppercase' }}>
                                        Details →
                                    </Link>
                                    {p.demo && (
                                        <a href={p.demo} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ padding: '8px 14px' }}>Demo</a>
                                    )}
                                    <a href={p.code} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ padding: '8px 14px' }}>Code</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            id="projects"
            style={{
                height: `${projects.length * 100}vh`,
                position: 'relative',
                background: '#020204',
            }}
        >
            {/* ── Sticky viewport ── */}
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                {/* WebGL canvas */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}
                />

                {/* Left project index */}
                <nav
                    style={{
                        position: 'absolute',
                        left: 'clamp(20px, 4vw, 56px)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '22px',
                    }}
                >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Projects
                    </span>
                    {projects.map((p, i) => (
                        <button
                            key={p.id}
                            onClick={() => scrollToProject(i)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <span style={{
                                width: i === activeIdx ? '20px' : '8px',
                                height: '1px',
                                background: i === activeIdx ? p.color : 'rgba(255,255,255,0.18)',
                                transition: 'all 0.4s ease',
                                display: 'block',
                            }} />
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '9px',
                                letterSpacing: '0.08em',
                                color: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.22)',
                                transition: 'color 0.3s ease',
                            }}>
                                {String(i + 1).padStart(2, "0")}
                            </span>
                        </button>
                    ))}
                </nav>

                {/* Content overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 'clamp(80px, 10vh, 110px) clamp(24px, 6vw, 96px) clamp(36px, 5vh, 56px)',
                        pointerEvents: 'none',
                    }}
                >
                    {/* Section header */}
                    <div style={{ paddingLeft: 'clamp(56px, 8vw, 110px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                                04 // Engineering Work
                            </span>
                            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 200, marginTop: '6px', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                                Shipped systems.
                            </h2>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em' }}>
                            SCROLL TO EXPLORE
                        </span>
                    </div>

                    {/* Active project card */}
                    <motion.div
                        key={activeIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            paddingLeft: 'clamp(56px, 8vw, 110px)',
                            pointerEvents: 'auto',
                            maxWidth: '460px',
                        }}
                    >
                        {/* Impact badge */}
                        <div style={{
                            display: 'inline-block',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '8px',
                            letterSpacing: '0.1em',
                            color: proj.color,
                            border: `1px solid ${proj.color}50`,
                            padding: '3px 10px',
                            borderRadius: '2px',
                            marginBottom: '14px',
                            background: `${proj.color}0a`,
                        }}>
                            {proj.impact}
                        </div>

                        <h3 style={{
                            fontSize: 'clamp(17px, 1.8vw, 22px)',
                            fontWeight: 300,
                            color: '#fff',
                            margin: '0 0 8px 0',
                            fontFamily: 'var(--font-serif)',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.2,
                        }}>
                            {proj.name}
                        </h3>

                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 300, lineHeight: 1.65, margin: '0 0 18px 0' }}>
                            {proj.tagline}
                        </p>

                        {/* Tech pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                            {proj.tech.map((t) => (
                                <span key={t} style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '8px',
                                    letterSpacing: '0.06em',
                                    color: 'rgba(255,255,255,0.45)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    padding: '3px 8px',
                                    borderRadius: '2px',
                                }}>
                                    {t}
                                </span>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <button
                                onClick={() => setInspectedProj(activeIdx)}
                                style={{
                                    background: 'transparent',
                                    border: `1px solid ${proj.color}55`,
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
                                    e.currentTarget.style.background = `${proj.color}18`;
                                    e.currentTarget.style.borderColor = proj.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = `${proj.color}55`;
                                }}
                            >
                                View Technical Details
                            </button>

                            <Link
                                href="/projects"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.14)',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '9px',
                                    letterSpacing: '0.12em',
                                    padding: '9px 18px',
                                    borderRadius: '2px',
                                    textDecoration: 'none',
                                    transition: 'all 0.25s ease',
                                    textTransform: 'uppercase',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.color = '#fff';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                                }}
                            >
                                All Projects Archive →
                            </Link>
                        </div>
                    </motion.div>

                    {/* Footer progress dots */}
                    <div style={{
                        paddingLeft: 'clamp(56px, 8vw, 110px)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em' }}>
                            {activeIdx + 1} / {projects.length}
                        </span>
                        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
                            {projects.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => scrollToProject(i)}
                                    style={{
                                        width: i === activeIdx ? '28px' : '7px',
                                        height: '2px',
                                        borderRadius: '1px',
                                        background: i === activeIdx ? proj.color : 'rgba(255,255,255,0.15)',
                                        transition: 'all 0.4s ease',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Side inspector drawer ── */}
            <AnimatePresence>
                {inspectedProj !== null && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setInspectedProj(null)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(2,2,4,0.75)', backdropFilter: 'blur(14px)', zIndex: 900 }}
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                            style={{
                                position: 'fixed',
                                top: 0, right: 0, bottom: 0,
                                width: 'min(100vw, 520px)',
                                background: '#07070b',
                                borderLeft: `1px solid ${projects[inspectedProj].color}35`,
                                padding: 'clamp(28px, 5vw, 52px)',
                                zIndex: 999,
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '28px',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', color: projects[inspectedProj].color, textTransform: 'uppercase' }}>
                                    Technical Breakdown — {String((inspectedProj ?? 0) + 1).padStart(2, "0")}
                                </span>
                                <button
                                    onClick={() => setInspectedProj(null)}
                                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', fontSize: '9px', cursor: 'pointer', letterSpacing: '0.1em' }}
                                >
                                    [ ESC ]
                                </button>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '22px', fontWeight: 300, fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em', margin: '0 0 8px', color: '#fff' }}>
                                    {projects[inspectedProj].name}
                                </h4>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
                                    {projects[inspectedProj].tagline}
                                </p>
                            </div>

                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '9px',
                                letterSpacing: '0.1em',
                                color: projects[inspectedProj].color,
                                border: `1px solid ${projects[inspectedProj].color}45`,
                                padding: '8px 14px',
                                borderRadius: '2px',
                                background: `${projects[inspectedProj].color}08`,
                                display: 'inline-block',
                            }}>
                                {projects[inspectedProj].impact}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
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

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
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
                                            padding: '12px',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            borderRadius: '2px',
                                            transition: 'background 0.2s',
                                            textTransform: 'uppercase',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = `${projects[inspectedProj].color}14`}
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
                                        padding: '12px',
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
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
