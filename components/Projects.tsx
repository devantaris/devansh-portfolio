'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import * as THREE from 'three';

const projects = [
    {
        emoji: '🛡️',
        number: '01',
        name: 'MARI — FRAUD ENGINE',
        tagline: 'XGBoost fraud filter trained on 284k telemetry records.',
        tech: ['PYTHON', 'FASTAPI', 'XGBOOST', 'POSTGRESQL'],
        demo: 'https://mari-alpha.vercel.app',
        code: 'https://github.com/devantaris/mari',
        color: '#00e5ff'
    },
    {
        emoji: '🎬',
        number: '02',
        name: 'FLUTTER OTT STREAMER',
        tagline: 'Cinematic cross-platform mobile client with SQLite persistence.',
        tech: ['FLUTTER', 'DART', 'SQLITE', 'BLOC'],
        demo: null,
        code: 'https://github.com/devantaris/flutter-ott-app',
        color: '#b500fa'
    },
    {
        emoji: '🌿',
        number: '03',
        name: 'BIOME DESKTOP APP',
        tagline: 'Procedural focus world-builder running on Electron native hooks.',
        tech: ['REACT', 'TYPESCRIPT', 'FIREBASE', 'ELECTRON'],
        demo: null,
        code: 'https://github.com/devantaris/Biome',
        color: '#ff5500'
    },
    {
        emoji: '🔄',
        number: '04',
        name: 'SKILLSYNC PLATFORM',
        tagline: 'Decentralized peer course credit exchange running on Supabase RLS.',
        tech: ['REACT', 'NODE.JS', 'SUPABASE', 'RAZORPAY'],
        demo: 'https://skill-sync-steel-rho.vercel.app',
        code: 'https://github.com/devantaris/SkillSync',
        color: '#ffffff'
    },
];

export default function Projects() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 75);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        const projectGroups: THREE.Group[] = [];

        projects.forEach((proj, idx) => {
            const group = new THREE.Group();

            // Main Screen Panel - highly transparent, sleek
            const panelGeo = new THREE.PlaneGeometry(32, 18);
            const panelMat = new THREE.MeshBasicMaterial({
                color: 0x020204,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.95
            });
            const panel = new THREE.Mesh(panelGeo, panelMat);
            group.add(panel);

            // Whisper-thin wireframe border outline
            const edges = new THREE.EdgesGeometry(panelGeo);
            const wireframeLine = new THREE.LineBasicMaterial({ 
                color: new THREE.Color(proj.color), 
                transparent: true,
                opacity: 0.3,
                linewidth: 1
            });
            const wireframe = new THREE.LineSegments(edges, wireframeLine);
            group.add(wireframe);

            // Extremely subtle glowing backing light
            const lightGeo = new THREE.PlaneGeometry(36, 22);
            const lightMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(proj.color),
                transparent: true,
                opacity: 0.015,
                blending: THREE.AdditiveBlending
            });
            const lightBack = new THREE.Mesh(lightGeo, lightMat);
            lightBack.position.z = -1;
            group.add(lightBack);

            group.position.set(0, 0, -idx * 80);
            scene.add(group);
            projectGroups.push(group);
        });

        // Ambient Lights
        const light = new THREE.DirectionalLight(0xffffff, 1.0);
        light.position.set(0, 10, 50);
        scene.add(light);

        let mouseX = 0;
        let mouseY = 0;
        let scrollVal = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        const unsubscribeScroll = scrollYProgress.on("change", (latest) => {
            scrollVal = latest;
        });

        let animId: number;
        const animate = () => {
            animId = requestAnimationFrame(animate);

            // Slide camera
            const targetCameraZ = 75 - scrollVal * 300;
            camera.position.z += (targetCameraZ - camera.position.z) * 0.08;

            // Camera looking with subtle parallax drift
            camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, camera.position.z - 80);

            // Subtle rotation drift
            projectGroups.forEach((group, i) => {
                group.rotation.y = Math.sin(performance.now() * 0.0003 + i) * 0.04;
                group.rotation.x = Math.cos(performance.now() * 0.0002 + i) * 0.02;
            });

            // Update active index
            const currentZ = camera.position.z;
            let currentActive = 0;
            for (let i = 0; i < projectGroups.length; i++) {
                const zDist = Math.abs(currentZ - (75 - i * 80));
                if (zDist < 40) {
                    currentActive = i;
                    break;
                }
                if (currentZ < 75 - i * 80) {
                    currentActive = i;
                }
            }
            if (currentActive !== activeIdx) {
                setActiveIdx(currentActive);
            }

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        };

        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(canvas);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', handleMouseMove);
            unsubscribeScroll();
            resizeObserver.disconnect();
            
            projectGroups.forEach((g) => {
                g.children.forEach((c) => {
                    if (c instanceof THREE.Mesh) {
                        c.geometry.dispose();
                        if (c.material instanceof THREE.Material) {
                            c.material.dispose();
                        }
                    }
                });
            });
            renderer.dispose();
        };
    }, [scrollYProgress, activeIdx]);

    return (
        <section ref={sectionRef} id="projects" style={{ height: '360vh', position: 'relative', overflow: 'visible', background: '#020204' }}>
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                
                {/* 3D WebGL Canvas Layer */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                />

                {/* Fullscreen Overlay containing Ultra-Minimalist Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 5,
                    width: '100%',
                    maxWidth: '1200px',
                    height: '100%',
                    padding: '0 clamp(24px, 6vw, 96px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingTop: '120px',
                    paddingBottom: '64px',
                    pointerEvents: 'none'
                }}>
                    
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span className="mono-tag">04 // VAULT</span>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 200, marginTop: '4px', color: '#fff', letterSpacing: '-0.03em' }}>
                                Featured projects.
                            </h2>
                        </div>
                        <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>
                            SCROLL_DOWN_TO_TRAVEL
                        </span>
                    </div>

                    {/* Active Project Highlight Block (Highly Minimalist, Floating, Fills Removed) */}
                    <div style={{ 
                        pointerEvents: 'auto', 
                        alignSelf: 'flex-start', 
                        maxWidth: '400px', 
                        padding: '0 0 0 24px', 
                        borderLeft: `1px solid ${projects[activeIdx].color}` 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>LOCK // {projects[activeIdx].number}</span>
                            <span style={{ fontSize: '18px' }}>{projects[activeIdx].emoji}</span>
                        </div>
                        
                        <h3 style={{ fontSize: '18px', fontWeight: 300, color: '#fff', margin: '8px 0 6px 0', fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
                            {projects[activeIdx].name}
                        </h3>
                        
                        <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.5, margin: 0 }}>
                            {projects[activeIdx].tagline}
                        </p>

                        {/* Tech tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0' }}>
                            {projects[activeIdx].tech.map((t) => (
                                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--foreground-muted)' }}>
                                    #{t}
                                </span>
                            ))}
                        </div>

                        {/* CTA Links */}
                        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                            {projects[activeIdx].demo && (
                                <a 
                                    href={projects[activeIdx].demo!} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--accent-cyan)', textDecoration: 'none', borderBottom: '1px dashed var(--accent-cyan)' }}
                                >
                                    CORE_DEMO
                                </a>
                            )}
                            <a 
                                href={projects[activeIdx].code} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: '#fff', textDecoration: 'none', borderBottom: '1px dashed rgba(255,255,255,0.3)' }}
                            >
                                SYSTEM_CODE
                            </a>
                        </div>
                    </div>

                    {/* Footer Progress Ticker */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--foreground-muted)' }}>
                        <div>3D_SECTOR: P_0{activeIdx + 1} // ACTIVE</div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {projects.map((p, idx) => (
                                <span key={p.number} style={{ color: idx === activeIdx ? '#fff' : 'var(--foreground-muted)', fontWeight: idx === activeIdx ? 700 : 400 }}>
                                    {p.number}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
