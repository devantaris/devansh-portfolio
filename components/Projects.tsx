'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import * as THREE from 'three';

const projects = [
    {
        emoji: '🛡️',
        number: '01',
        name: 'MARI — FRAUD ENGINE',
        tagline: 'Three-layer XGBoost fraud anomaly filter trained on 284k telemetry records.',
        tech: ['PYTHON', 'FASTAPI', 'XGBOOST', 'POSTGRESQL'],
        demo: 'https://mari-alpha.vercel.app',
        code: 'https://github.com/devantaris/mari',
        color: '#00f5ff'
    },
    {
        emoji: '🎬',
        number: '02',
        name: 'FLUTTER OTT STREAMER',
        tagline: 'Cinematic cross-platform mobile client with SQLite auth persistence.',
        tech: ['FLUTTER', 'DART', 'SQLITE', 'BLOC'],
        demo: null,
        code: 'https://github.com/devantaris/flutter-ott-app',
        color: '#bd00ff'
    },
    {
        emoji: '🌿',
        number: '03',
        name: 'BIOME DESKTOP APP',
        tagline: 'Procedural focus world-builder wrapped inside secure native Electron hooks.',
        tech: ['REACT', 'TYPESCRIPT', 'FIREBASE', 'ELECTRON'],
        demo: null,
        code: 'https://github.com/devantaris/Biome',
        color: '#ff5700'
    },
    {
        emoji: '🔄',
        number: '04',
        name: 'SKILLSYNC PLATFORM',
        tagline: 'Decentralized peer course credit exchange running on secure Supabase RLS.',
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

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 75);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create 3D Project Screens
        const projectGroups: THREE.Group[] = [];

        projects.forEach((proj, idx) => {
            const group = new THREE.Group();

            // Main Screen Panel (asymmetrical proportion)
            const panelGeo = new THREE.PlaneGeometry(36, 20);
            const panelMat = new THREE.MeshBasicMaterial({
                color: 0x05050a,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            const panel = new THREE.Mesh(panelGeo, panelMat);
            group.add(panel);

            // Glowing Outer Wireframe
            const edges = new THREE.EdgesGeometry(panelGeo);
            const wireframeLine = new THREE.LineBasicMaterial({ 
                color: new THREE.Color(proj.color), 
                linewidth: 2 
            });
            const wireframe = new THREE.LineSegments(edges, wireframeLine);
            group.add(wireframe);

            // Futuristic Blueprint Telemetry Grid behind card
            const gridHelper = new THREE.GridHelper(30, 10, new THREE.Color(proj.color), new THREE.Color(0x222222));
            gridHelper.rotation.x = Math.PI / 2;
            gridHelper.position.z = -2;
            group.add(gridHelper);

            // Glow backing light
            const lightGeo = new THREE.PlaneGeometry(42, 26);
            const lightMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(proj.color),
                transparent: true,
                opacity: 0.05,
                blending: THREE.AdditiveBlending
            });
            const lightBack = new THREE.Mesh(lightGeo, lightMat);
            lightBack.position.z = -3;
            group.add(lightBack);

            // Add dynamic floating orbits representing technology links
            const ringGeo = new THREE.RingGeometry(22, 22.3, 32);
            const ringMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(proj.color),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.15
            });
            const techRing = new THREE.Mesh(ringGeo, ringMat);
            techRing.rotation.x = Math.PI / 3;
            group.add(techRing);

            // Shift position in space (layer them in 3D depth)
            // Stagger coordinates so scrolling feels like travelling through a structural system
            group.position.set(0, 0, -idx * 80);
            scene.add(group);
            projectGroups.push(group);
        });

        // Ambient Lights
        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(0, 20, 50);
        scene.add(light);

        // Interaction coordinates
        let mouseX = 0;
        let mouseY = 0;
        let scrollVal = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Scroll listener to update scrollVal
        const unsubscribeScroll = scrollYProgress.on("change", (latest) => {
            scrollVal = latest;
        });

        let animId: number;
        const animate = () => {
            animId = requestAnimationFrame(animate);

            // Smoothly slide camera through 3D space based on scrollVal
            // Range maps from z=75 down to z=-240 to explore the panels!
            const targetCameraZ = 75 - scrollVal * 300;
            camera.position.z += (targetCameraZ - camera.position.z) * 0.08;

            // Camera looking slightly ahead with mouse parallax
            camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, camera.position.z - 80);

            // Rotate panels slowly in space
            projectGroups.forEach((group, i) => {
                group.rotation.y = Math.sin(performance.now() * 0.0005 + i) * 0.06;
                group.rotation.x = Math.cos(performance.now() * 0.0004 + i) * 0.04;
                
                // Spin technology orbits
                const ring = group.children[4];
                if (ring) {
                    ring.rotation.z += 0.005;
                }
            });

            // Update active index based on camera location proximity
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
        <section ref={sectionRef} id="projects" style={{ height: '360vh', position: 'relative', overflow: 'visible' }}>
            {/* Sticky screen container */}
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

                {/* Grid Background Accents */}
                <div style={{
                    position: 'absolute',
                    top: '10%', left: '4%', right: '4%', height: '1px',
                    background: 'linear-gradient(to right, rgba(255,255,255,0.05), var(--accent-cyan), transparent)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                {/* Fullscreen Overlay containing Ultra-Minimalist Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 5,
                    width: '100%',
                    maxWidth: '1200px',
                    height: '100%',
                    padding: '0 clamp(24px, 5vw, 64px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingTop: '100px',
                    paddingBottom: '64px',
                    pointerEvents: 'none' // allow clicking canvas underneath
                }}>
                    
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span className="mono-tag" style={{ color: 'var(--accent-purple)' }}>04 // WEBGL_PROJECT_VAULT</span>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginTop: '4px', color: '#fff', letterSpacing: '-0.02em' }}>
                                Featured Systems.
                            </h2>
                        </div>
                        <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>
                            SCROLL_DOWN_TO_TRAVEL_3D
                        </span>
                    </div>

                    {/* Active Project Highlight Block (Highly Minimalist) */}
                    <div style={{ pointerEvents: 'auto', alignSelf: 'flex-start', maxWidth: '440px', background: 'rgba(5,5,10,0.8)', border: '1px solid rgba(255,255,255,0.08)', padding: '28px', backdropFilter: 'blur(10px)', borderLeft: `3px solid ${projects[activeIdx].color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="mono-tag" style={{ color: projects[activeIdx].color }}>LOCK // {projects[activeIdx].number}</span>
                            <span style={{ fontSize: '20px' }}>{projects[activeIdx].emoji}</span>
                        </div>
                        
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '12px 0 6px 0' }}>
                            {projects[activeIdx].name}
                        </h3>
                        
                        <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.5, margin: 0 }}>
                            {projects[activeIdx].tagline}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '16px 0' }}>
                            {projects[activeIdx].tech.map((t) => (
                                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', padding: '3px 8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--foreground-muted)' }}>
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* CTA Links */}
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {projects[activeIdx].demo && (
                                <a 
                                    href={projects[activeIdx].demo!} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--accent-cyan)', textDecoration: 'none', borderBottom: '1px dashed var(--accent-cyan)' }}
                                >
                                    CORE_DEMO
                                </a>
                            )}
                            <a 
                                href={projects[activeIdx].code} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: '#fff', textDecoration: 'none', borderBottom: '1px dashed rgba(255,255,255,0.3)' }}
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
