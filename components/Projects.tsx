'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
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
        color: '#00e5ff',
        specs: [
            'High-performance classification inference engine delivering anomaly detection vectors within 45ms.',
            'Engineered real-time data ingestion pipelines running on FastAPI and SQLAlchemy schemas.',
            'Optimized model hyper-parameters yielding 99.8% precision on complex payment telemetry vectors.'
        ]
    },
    {
        emoji: '🎬',
        number: '02',
        name: 'FLUTTER OTT STREAMER',
        tagline: 'Cinematic cross-platform mobile client with SQLite persistence.',
        tech: ['FLUTTER', 'DART', 'SQLITE', 'BLOC'],
        demo: null,
        code: 'https://github.com/devantaris/flutter-ott-app',
        color: '#b500fa',
        specs: [
            'High-fidelity cinematic media presentation deck with optimized rendering viewports.',
            'Architected offline-first local relational database layer with robust SQLite binding schemas.',
            'Configured strict BLoC state management coordinates for fluid 60fps view transitions.'
        ]
    },
    {
        emoji: '🌿',
        number: '03',
        name: 'BIOME DESKTOP APP',
        tagline: 'Procedural focus world-builder running on Electron native hooks.',
        tech: ['REACT', 'TYPESCRIPT', 'FIREBASE', 'ELECTRON'],
        demo: null,
        code: 'https://github.com/devantaris/Biome',
        color: '#ff5500',
        specs: [
            'Procedural focus ecosystem rendering gorgeous digital environments and responsive feedback cycles.',
            'Integrated high-performance Electron IPC bridges to intercept deep operating system telemetry logs.',
            'Configured light Firestore real-time synchronize handlers for rapid secure state persistence.'
        ]
    },
    {
        emoji: '🔄',
        number: '04',
        name: 'SKILLSYNC PLATFORM',
        tagline: 'Decentralized peer course credit exchange running on Supabase RLS.',
        tech: ['REACT', 'NODE.JS', 'SUPABASE', 'RAZORPAY'],
        demo: 'https://skill-sync-steel-rho.vercel.app',
        code: 'https://github.com/devantaris/SkillSync',
        color: '#ffffff',
        specs: [
            'Decentralized peer-to-peer credit exchange engine relying on Supabase row-level security vectors.',
            'Configured double-entry ledger database tables secured with PostgreSQL trigger handlers.',
            'Integrated commercial payment checkout gates linked to verified webhooks for immediate clearing.'
        ]
    },
];

export default function Projects() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const [inspectedProj, setInspectedProj] = useState<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // Smoothly scroll to a specific project sector
    const scrollToProject = (idx: number) => {
        if (!sectionRef.current) return;
        const totalHeight = sectionRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollRange = totalHeight - viewportHeight;
        const targetPercent = idx / (projects.length - 1);
        
        window.scrollTo({
            top: sectionRef.current.offsetTop + targetPercent * scrollRange,
            behavior: 'smooth'
        });
    };

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
        const artifactMeshes: THREE.Mesh[] = [];

        projects.forEach((proj, idx) => {
            const group = new THREE.Group();

            // Stagger panels left and right
            const isLeft = idx % 2 === 0;
            const xPos = isLeft ? -16 : 16;
            const zPos = -idx * 80;

            // Main Screen Panel - glassmorphic
            const panelGeo = new THREE.PlaneGeometry(28, 16);
            const panelMat = new THREE.MeshBasicMaterial({
                color: 0x020204,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.96
            });
            const panel = new THREE.Mesh(panelGeo, panelMat);
            group.add(panel);

            // Whisper-thin wireframe border outline
            const edges = new THREE.EdgesGeometry(panelGeo);
            const wireframeLine = new THREE.LineBasicMaterial({ 
                color: new THREE.Color(proj.color), 
                transparent: true,
                opacity: 0.25,
                linewidth: 1
            });
            const wireframe = new THREE.LineSegments(edges, wireframeLine);
            wireframe.name = 'wireframe';
            group.add(wireframe);

            // Extremely subtle glowing backing light
            const lightGeo = new THREE.PlaneGeometry(32, 20);
            const lightMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(proj.color),
                transparent: true,
                opacity: 0.008,
                blending: THREE.AdditiveBlending
            });
            const lightBack = new THREE.Mesh(lightGeo, lightMat);
            lightBack.position.z = -1;
            lightBack.name = 'backingLight';
            group.add(lightBack);

            // Create unique floating 3D rotating geometry artifact
            let geom: THREE.BufferGeometry;
            if (idx === 0) {
                geom = new THREE.IcosahedronGeometry(3.5, 1);
            } else if (idx === 1) {
                geom = new THREE.TorusKnotGeometry(2.2, 0.7, 64, 8);
            } else if (idx === 2) {
                geom = new THREE.OctahedronGeometry(3.5, 0);
            } else {
                geom = new THREE.DodecahedronGeometry(3.5, 0);
            }

            const geomMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(proj.color),
                wireframe: true,
                transparent: true,
                opacity: 0.35
            });
            const artifactMesh = new THREE.Mesh(geom, geomMat);
            
            // Position artifact mesh in the central gap to drift by camera
            artifactMesh.position.set(isLeft ? 15 : -15, 2, 4);
            group.add(artifactMesh);
            artifactMeshes.push(artifactMesh);

            group.position.set(xPos, 0, zPos);
            scene.add(group);
            projectGroups.push(group);
        });

        // Soft ambient directional light
        const light = new THREE.DirectionalLight(0xffffff, 0.8);
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

            // Stagger S-Curve camera interpolation path
            const totalProjects = projects.length;
            const frac = scrollVal * (totalProjects - 1);
            const i = Math.min(Math.floor(frac), totalProjects - 1);
            const f = frac - i;

            // Cosine smooth step interpolation factor
            const smoothF = (1 - Math.cos(f * Math.PI)) / 2;

            const nextIndex = Math.min(i + 1, totalProjects - 1);

            const x1 = i % 2 === 0 ? -16 : 16;
            const z1 = -i * 80;
            const x2 = nextIndex % 2 === 0 ? -16 : 16;
            const z2 = -nextIndex * 80;

            // Smoothly interpolate look-at target coordinates
            const targetLookX = x1 + (x2 - x1) * smoothF;
            const targetLookZ = z1 + (z2 - z1) * smoothF;

            // Smoothly interpolate camera position offsets, avoiding plane collisions
            const offset1 = i % 2 === 0 ? 18 : -18;
            const offset2 = nextIndex % 2 === 0 ? 18 : -18;
            
            const targetCamX = x1 + offset1 + ((x2 + offset2) - (x1 + offset1)) * smoothF;
            const targetCamZ = z1 + 55 + ((z2 + 55) - (z1 + 55)) * smoothF;

            // Dynamic camera slide and mouse parallax drift
            camera.position.x += (targetCamX + mouseX * 2.5 - camera.position.x) * 0.08;
            camera.position.y += (mouseY * 2.5 - camera.position.y) * 0.08;
            camera.position.z += (targetCamZ - camera.position.z) * 0.08;
            
            camera.lookAt(targetLookX, 0, targetLookZ);

            // Continuous rotation of the floating digital artifacts
            artifactMeshes.forEach((mesh, idx) => {
                mesh.rotation.y += 0.008 + idx * 0.002;
                mesh.rotation.x += 0.004 + idx * 0.001;
            });

            // Update active index based on current scroll position
            const currentActive = Math.min(Math.round(frac), totalProjects - 1);
            if (currentActive !== activeIdx) {
                setActiveIdx(currentActive);
            }

            // Animate border glow reactions for the active panel
            projectGroups.forEach((group, idx) => {
                const isCurrent = idx === currentActive;
                const wireframe = group.getObjectByName('wireframe') as THREE.LineSegments;
                const backingLight = group.getObjectByName('backingLight') as THREE.Mesh;
                
                if (wireframe && wireframe.material instanceof THREE.LineBasicMaterial) {
                    const targetOpacity = isCurrent ? 0.75 : 0.15;
                    wireframe.material.opacity += (targetOpacity - wireframe.material.opacity) * 0.1;
                }
                
                if (backingLight && backingLight.material instanceof THREE.MeshBasicMaterial) {
                    const targetOpacity = isCurrent ? 0.04 : 0.005;
                    backingLight.material.opacity += (targetOpacity - backingLight.material.opacity) * 0.1;
                }
            });

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
                    } else if (c instanceof THREE.LineSegments) {
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
        <section ref={sectionRef} id="projects" style={{ height: '380vh', position: 'relative', overflow: 'visible', background: '#020204' }}>
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

                {/* Left Side Quick-Link Index */}
                <div style={{
                    position: 'absolute',
                    left: 'clamp(24px, 4vw, 64px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    pointerEvents: 'auto'
                }}>
                    <span className="mono-tag" style={{ color: 'var(--foreground-muted)', fontSize: '8px', letterSpacing: '0.15em', marginBottom: '8px' }}>
                        SYSTEM_INDEX
                    </span>
                    {projects.map((p, idx) => (
                        <button
                            key={p.number}
                            onClick={() => scrollToProject(idx)}
                            style={{
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                padding: 0,
                                margin: 0,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                color: idx === activeIdx ? p.color : 'var(--foreground-muted)',
                                fontWeight: idx === activeIdx ? 'bold' : 'normal',
                                transition: 'color 0.3s ease'
                            }}>
                                {p.number}
                            </span>
                            <span style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '12px',
                                color: idx === activeIdx ? '#fff' : 'rgba(255,255,255,0.2)',
                                transition: 'color 0.3s ease',
                                display: 'none' // Hidden on narrow viewports
                            }} className="index-title">
                                {p.name.split(' — ')[0]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Fullscreen Overlay containing Ultra-Minimalist Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 5,
                    width: '100%',
                    maxWidth: '1320px',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '80px' }}>
                        <div>
                            <span className="mono-tag">04 // RELEASES</span>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 200, marginTop: '4px', color: '#fff', letterSpacing: '-0.03em' }}>
                                Interactive sectors.
                            </h2>
                        </div>
                        <span className="mono-tag scroll-hint" style={{ color: 'var(--foreground-muted)', display: 'none' }}>
                            SCROLL_DOWN_TO_TRAVEL
                        </span>
                    </div>

                    {/* Active Project Highlight Block (INTJ Level Minimal) */}
                    <div style={{ 
                        pointerEvents: 'auto', 
                        alignSelf: 'flex-start', 
                        maxWidth: '440px', 
                        padding: '0 0 0 24px', 
                        borderLeft: `1px solid ${projects[activeIdx].color}`,
                        marginLeft: '80px',
                        transition: 'border-color 0.4s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>SECTOR // {projects[activeIdx].number}</span>
                            <span style={{ fontSize: '18px' }}>{projects[activeIdx].emoji}</span>
                        </div>
                        
                        <h3 style={{ fontSize: '20px', fontWeight: 300, color: '#fff', margin: '8px 0 6px 0', fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
                            {projects[activeIdx].name}
                        </h3>
                        
                        <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: 300, lineHeight: 1.5, margin: '0 0 16px 0' }}>
                            {projects[activeIdx].tagline}
                        </p>

                        {/* INTJ Click to Expand Inspector button */}
                        <button
                            onClick={() => setInspectedProj(activeIdx)}
                            style={{
                                background: 'transparent',
                                border: `1px solid ${projects[activeIdx].color}33`,
                                color: '#fff',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '9px',
                                letterSpacing: '0.1em',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                borderRadius: '2px',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            className="inspect-btn"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = `${projects[activeIdx].color}0a`;
                                e.currentTarget.style.borderColor = projects[activeIdx].color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = `${projects[activeIdx].color}33`;
                            }}
                        >
                            <span>[ DECRYPT_SYSTEM_SPECIFICATIONS ]</span>
                        </button>
                    </div>

                    {/* Footer Progress Ticker */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--foreground-muted)', paddingLeft: '80px' }}>
                        <div>3D_SECTOR: P_0{activeIdx + 1} // ACTIVE</div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {projects.map((p, idx) => (
                                <span 
                                    key={p.number} 
                                    onClick={() => scrollToProject(idx)}
                                    style={{ 
                                        color: idx === activeIdx ? '#fff' : 'var(--foreground-muted)', 
                                        fontWeight: idx === activeIdx ? 700 : 400,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {p.number}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* INTJ Retro-Cyberpunk Side Inspector Drawer Overlay */}
            <AnimatePresence>
                {inspectedProj !== null && (
                    <>
                        {/* Blur Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setInspectedProj(null)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(2, 2, 4, 0.65)',
                                backdropFilter: 'blur(10px)',
                                zIndex: 900
                            }}
                        />

                        {/* Blueprint Sheet Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: 'min(100vw, 540px)',
                                background: 'rgba(2, 2, 4, 0.96)',
                                borderLeft: `1px solid ${projects[inspectedProj].color}33`,
                                padding: 'clamp(32px, 5vw, 64px)',
                                zIndex: 999,
                                overflowY: 'auto',
                                color: '#f6f5fa',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxShadow: `-20px 0 60px rgba(0,0,0,0.8)`
                            }}
                        >
                            {/* Inner Spec Sheet */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {/* Top Ticker */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                                    <span className="mono-tag" style={{ color: projects[inspectedProj].color }}>
                                        SPECIFICATION_SHEET // SEC_0{inspectedProj + 1}
                                    </span>
                                    <button 
                                        onClick={() => setInspectedProj(null)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--foreground-muted)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '9px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        [ CLOSE // ESC ]
                                    </button>
                                </div>

                                {/* Headline details */}
                                <div>
                                    <div style={{ fontSize: '24px', marginRight: '8px', marginBottom: '8px' }}>
                                        {projects[inspectedProj].emoji}
                                    </div>
                                    <h4 style={{ fontSize: '24px', fontWeight: 300, fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>
                                        {projects[inspectedProj].name}
                                    </h4>
                                    <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginTop: '8px', lineHeight: 1.6, fontWeight: 300 }}>
                                        {projects[inspectedProj].tagline}
                                    </p>
                                </div>

                                {/* Decrypted Blueprint Specs (INTJ No-Yap Specifications) */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>
                                        // DECRYPTED_CORE_MECHANICS
                                    </span>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {projects[inspectedProj].specs.map((spec, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '13px', lineHeight: 1.6, fontWeight: 300, color: 'rgba(255,255,255,0.85)' }}>
                                                <span style={{ color: projects[inspectedProj].color, fontFamily: 'var(--font-mono)', fontSize: '10px' }}>[0{i+1}]</span>
                                                <span>{spec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Technology stack vectors */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>
                                        // COMPILED_TECHNOLOGY_STACK
                                    </span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {projects[inspectedProj].tech.map((t) => (
                                            <span 
                                                key={t} 
                                                style={{ 
                                                    fontFamily: 'var(--font-mono)', 
                                                    fontSize: '9px', 
                                                    color: '#fff',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                    padding: '4px 10px',
                                                    borderRadius: '2px'
                                                }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Release Actions (Demo/Code links) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', marginTop: '40px' }}>
                                <span className="mono-tag" style={{ color: 'var(--foreground-muted)' }}>
                                    // OPERATIONAL_RELEASES
                                </span>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    {projects[inspectedProj].demo && (
                                        <a 
                                            href={projects[inspectedProj].demo!} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ 
                                                fontFamily: 'var(--font-mono)', 
                                                fontSize: '10px', 
                                                fontWeight: 700, 
                                                color: 'var(--accent-cyan)', 
                                                textDecoration: 'none', 
                                                border: '1px solid var(--accent-cyan)', 
                                                padding: '10px 16px',
                                                borderRadius: '2px',
                                                flex: 1,
                                                textAlign: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 229, 255, 0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            RUN_LIVE_DEMO
                                        </a>
                                    )}
                                    <a 
                                        href={projects[inspectedProj].code} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ 
                                            fontFamily: 'var(--font-mono)', 
                                            fontSize: '10px', 
                                            fontWeight: 700, 
                                            color: '#fff', 
                                            textDecoration: 'none', 
                                            border: '1px solid rgba(255,255,255,0.2)', 
                                            padding: '10px 16px',
                                            borderRadius: '2px',
                                            flex: 1,
                                            textAlign: 'center',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        INSPECT_SYSTEM_CODE
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
