'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';
import { featuredProjects as projects } from '@/lib/content';
import { useMotionCapable } from '@/hooks/useMotionCapable';
import { createProjectHudCanvas, renderProjectHud } from '@/lib/projectHudRenderer';
import ProjectHudPreview from '@/components/ui/ProjectHudPreview';

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

        const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 2000);
        camera.position.set(0, 0, 52);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(w, h, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        // ── Build panels ──────────────────────────────────────────────────────
        const projectGroups: THREE.Group[] = [];
        const artifactMeshes: THREE.Mesh[] = [];
        const wireframeMats: THREE.LineBasicMaterial[] = [];
        const backLightMats: THREE.MeshBasicMaterial[] = [];
        const hudCanvases: HTMLCanvasElement[] = [];
        const hudTextures: THREE.CanvasTexture[] = [];

        projects.forEach((proj, idx) => {
            const group = new THREE.Group();
            // Firmly positioned on the right stage (+14) so it never collides with text or clips at 100% zoom
            const xPos = 14;

            // Generate procedural telemetry HUD canvas texture
            const hudCanvas = createProjectHudCanvas(1520, 880);
            const hudCtx = hudCanvas.getContext('2d');
            if (hudCtx) {
                renderProjectHud(hudCtx, proj, hudCanvas.width, hudCanvas.height, 0);
            }
            const hudTexture = new THREE.CanvasTexture(hudCanvas);
            hudTexture.colorSpace = THREE.SRGBColorSpace;
            hudCanvases.push(hudCanvas);
            hudTextures.push(hudTexture);

            // Background panel with project HUD visual (24 x 13.9 preserves crisp 16:9 ratio)
            const panelGeo = new THREE.PlaneGeometry(24, 13.9);
            const panelMat = new THREE.MeshBasicMaterial({
                map: hudTexture,
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
            const bl = new THREE.Mesh(new THREE.PlaneGeometry(28, 17.5), blMat);
            bl.position.z = -1;
            group.add(bl);
            backLightMats.push(blMat);

            // Floating geometry artifact placed gracefully above the card's right edge
            const artGeos: THREE.BufferGeometry[] = [
                new THREE.IcosahedronGeometry(2.5, 1),
                new THREE.TorusKnotGeometry(1.6, 0.5, 80, 8),
                new THREE.OctahedronGeometry(2.5, 0),
                new THREE.DodecahedronGeometry(2.3, 0),
            ];
            const artMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(proj.color),
                wireframe: true,
                transparent: true,
                opacity: 0.5,
            });
            const art = new THREE.Mesh(artGeos[idx % artGeos.length], artMat);
            art.position.set(12, 7.5, 2);
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

            // Camera Z travels through the panels (responsive 0.14 lerp)
            const targetZ = 52 - frac * SPACING;
            // Subtle mouse parallax centered on stage
            const targetX = mouseX * 1.2;
            const targetY = mouseY * 0.8;

            camera.position.z += (targetZ - camera.position.z) * 0.14;
            camera.position.x += (targetX - camera.position.x) * 0.08;
            camera.position.y += (targetY - camera.position.y) * 0.08;

            // Straight-ahead camera angle focused on stage
            camera.lookAt(0, 0, camera.position.z - 50);

            // Distance fade to prevent panels from ever blowing up in the user's face when scrolling
            projectGroups.forEach((g) => {
                const distToCam = g.position.z - camera.position.z;
                // Visible window: -110 to -14
                let alpha = 1;
                if (distToCam > -22) {
                    alpha = Math.max(0, (-distToCam) / 22);
                } else if (distToCam < -90) {
                    alpha = Math.max(0, 1 - (-distToCam - 90) / 40);
                }
                const panelMesh = g.children[0] as THREE.Mesh;
                if (panelMesh && panelMesh.material) {
                    (panelMesh.material as THREE.MeshBasicMaterial).opacity = 0.95 * alpha;
                }
            });

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

            // Animate active project's telemetry HUD texture (silky 30fps refresh)
            hudFrameCount++;
            if (hudFrameCount % 2 === 0 && hudCanvases[cur]) {
                const ctx = hudCanvases[cur].getContext('2d');
                if (ctx) {
                    renderProjectHud(ctx, projects[cur], 1520, 880, performance.now() * 0.001);
                    hudTextures[cur].needsUpdate = true;
                }
            }

            // Update React UI only when index flips
            if (cur !== activeIdxRef.current) {
                activeIdxRef.current = cur;
                setActiveIdx(cur);
                // Immediately render new active project's HUD
                if (hudCanvases[cur]) {
                    const ctx = hudCanvases[cur].getContext('2d');
                    if (ctx) {
                        renderProjectHud(ctx, projects[cur], 1520, 880, performance.now() * 0.001);
                        hudTextures[cur].needsUpdate = true;
                    }
                }
            }

            renderer.render(scene, camera);
        };
        let hudFrameCount = 0;
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
            hudTextures.forEach((t) => t.dispose());
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
                        left: 'clamp(14px, 2vw, 32px)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '2px' }}>
                        PRJ
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
                                gap: '8px',
                            }}
                        >
                            <span style={{
                                width: i === activeIdx ? '16px' : '6px',
                                height: '1px',
                                background: i === activeIdx ? p.color : 'rgba(255,255,255,0.18)',
                                transition: 'all 0.3s ease',
                                display: 'block',
                            }} />
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '9px',
                                letterSpacing: '0.08em',
                                color: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.22)',
                                transition: 'color 0.3s ease',
                            }}>
                                0{i + 1}
                            </span>
                        </button>
                    ))}
                </nav>

                {/* Content overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 'clamp(56px, 7vh, 88px) clamp(24px, 4.5vw, 72px) clamp(24px, 4vh, 44px)',
                        pointerEvents: 'none',
                        maxWidth: '1520px',
                        margin: '0 auto',
                        left: 0,
                        right: 0,
                    }}
                >
                    {/* Section header */}
                    <div style={{ paddingLeft: 'clamp(36px, 4vw, 56px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                                04 // ENGINEERING WORK
                            </span>
                            <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 40px)', fontWeight: 200, marginTop: '6px', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                                Shipped systems.
                            </h2>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em' }}>
                            SCROLL TO EXPLORE ↓
                        </span>
                    </div>

                    {/* Active project card */}
                    <div
                        key={activeIdx}
                        style={{
                            paddingLeft: 'clamp(36px, 4vw, 56px)',
                            maxWidth: 'min(450px, 42vw)',
                            pointerEvents: 'auto',
                            transition: 'opacity 0.25s ease',
                        }}
                    >
                        {/* Impact badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '8px',
                            letterSpacing: '0.1em',
                            color: proj.color,
                            border: `1px solid ${proj.color}50`,
                            padding: '4px 10px',
                            borderRadius: '2px',
                            marginBottom: '14px',
                            background: `${proj.color}0e`,
                        }}>
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: proj.color }} />
                            {proj.impact}
                        </div>

                        <h3 style={{
                            fontSize: 'clamp(18px, 2vw, 26px)',
                            fontWeight: 300,
                            color: '#fff',
                            margin: '0 0 10px 0',
                            fontFamily: 'var(--font-serif)',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.2,
                        }}>
                            {proj.name}
                        </h3>

                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.65, margin: '0 0 18px 0' }}>
                            {proj.tagline}
                        </p>

                        {/* Tech pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
                            {proj.tech.map((t) => (
                                <span key={t} style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '8px',
                                    letterSpacing: '0.06em',
                                    color: 'rgba(255,255,255,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '3px 8px',
                                    borderRadius: '2px',
                                    background: 'rgba(255,255,255,0.02)',
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
                                    padding: '10px 18px',
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
                                    color: 'rgba(255,255,255,0.75)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '9px',
                                    letterSpacing: '0.12em',
                                    padding: '10px 18px',
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
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                                }}
                            >
                                All Projects Archive →
                            </Link>
                        </div>
                    </div>

                    {/* Footer progress dots */}
                    <div style={{
                        paddingLeft: 'clamp(36px, 4vw, 56px)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>
                            0{activeIdx + 1} / 0{projects.length}
                        </span>
                        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
                            {projects.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => scrollToProject(i)}
                                    style={{
                                        width: i === activeIdx ? '32px' : '8px',
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

                            {/* Media slot: video > poster > pending frame */}
                            {projects[inspectedProj].video ? (
                                <video
                                    src={projects[inspectedProj].video}
                                    poster={projects[inspectedProj].poster ?? undefined}
                                    controls
                                    playsInline
                                    style={{ width: '100%', aspectRatio: '16 / 9', background: '#000', border: `1px solid ${projects[inspectedProj].color}35`, borderRadius: '2px', objectFit: 'cover' }}
                                />
                            ) : projects[inspectedProj].poster ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={projects[inspectedProj].poster}
                                    alt={`${projects[inspectedProj].name} preview`}
                                    style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', border: `1px solid ${projects[inspectedProj].color}35`, borderRadius: '2px' }}
                                />
                            ) : (
                                <ProjectHudPreview project={projects[inspectedProj]} />
                            )}

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
