'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { BODIES, bodyPosition, createAsteroidBelt, createBody, createNebulae, createOrbitRing, createStars, createSun, createProjectMoon, type BuiltBody } from './scene';
import { StopPanel, accentFor } from './panels';
import { profile, featuredProjects } from '@/lib/content';

const OVERVIEW = -1;

export default function Universe() {
    const mountRef = useRef<HTMLDivElement>(null);
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [booted, setBooted] = useState(false);
    const [activeStop, setActiveStop] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(OVERVIEW);
    // Mirror of selectedProjectId for the rAF loop (avoids stale closures)
    const selectedRef = useRef<string | null>(null);
    const syncSelected = useCallback((id: string | null) => {
        selectedRef.current = id;
        setSelectedProjectId(id);
        world.current.selectedMoon = id ? featuredProjects.findIndex((p) => p.id === id) : -1;
    }, []);

    // Mutable world state shared with the rAF loop
    const world = useRef<{
        targetIndex: number;
        camPos: THREE.Vector3;
        camLook: THREE.Vector3;
        mouse: { x: number; y: number };
        warpCooldownUntil: number;
        selectedMoon: number;
    }>({
        targetIndex: OVERVIEW,
        camPos: new THREE.Vector3(0, 190, 420),
        camLook: new THREE.Vector3(0, 0, 0),
        mouse: { x: 0, y: 0 },
        warpCooldownUntil: 0,
        selectedMoon: -1,
    });

    /* ── Navigation actions ──────────────────────────────────────────────── */
    const goTo = useCallback((index: number) => {
        const w = world.current;
        w.targetIndex = index;
        w.warpCooldownUntil = performance.now() + 900;
        setActiveIndex(index);
        syncSelected(null);
        setActiveStop(index === OVERVIEW ? null : BODIES[index].id);
    }, [syncSelected]);

    const step = useCallback((dir: 1 | -1) => {
        const cur = world.current.targetIndex;
        const next = Math.min(BODIES.length - 1, Math.max(OVERVIEW, cur + dir));
        if (next !== cur) goTo(next);
    }, [goTo]);

    /* ── Scene mount ─────────────────────────────────────────────────────── */
    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // The world is a fixed full-viewport surface — lock body scroll
        // (the SSR fallback markup underneath would otherwise scroll behind it).
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 0.5, 4000);
        camera.position.copy(world.current.camPos);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.setClearColor(0x020205, 1);
        mount.appendChild(renderer.domElement);

        // ── Build the system ──
        const stars = createStars();
        scene.add(stars);
        scene.add(createNebulae());
        const sun = createSun();
        scene.add(sun.group);

        const bodies: BuiltBody[] = BODIES.map((def) => {
            const b = createBody(def);
            scene.add(b.group);
            scene.add(createOrbitRing(def.orbitRadius, def.tilt, def.colorB));
            return b;
        });

        // Arsenal asteroid belt
        const belt = createAsteroidBelt(BODIES[4]);
        scene.add(belt);

        // Project moons orbiting MACHINES
        const machines = bodies[1];
        const moonGroup = new THREE.Group();
        machines.group.add(moonGroup);
        const moons = featuredProjects.slice(0, 4).map((p, i) => {
            const m = createProjectMoon(p.color, i);
            moonGroup.add(m);
            return m;
        });

        scene.add(new THREE.AmbientLight(0x3e4758, 1.8));

        /* ── Interaction listeners ── */
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2(-10, -10);
        let hovered: THREE.Object3D | null = null;

        const onPointerMove = (e: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            world.current.mouse.x = pointer.x;
            world.current.mouse.y = pointer.y;
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });

        const pickables = [...bodies.map((b) => b.mesh), ...moons];
        const onClick = () => {
            if (hovered) {
                const bodyIdx = bodies.findIndex((b) => b.mesh === hovered);
                if (bodyIdx >= 0) { goTo(bodyIdx); return; }
                const moonIdx = moons.findIndex((m) => m === hovered);
                if (moonIdx >= 0) {
                    if (world.current.targetIndex !== 1) goTo(1);
                    syncSelected(featuredProjects[moonIdx]?.id ?? null);
                }
            }
        };
        renderer.domElement.addEventListener('click', onClick);

        const onWheel = (e: WheelEvent) => {
            const target = e.target as HTMLElement | null;
            if (target && target.closest('.world-panel-aside, aside, .world-panel-scroll, .custom-scrollbar')) {
                return; // Allow smooth, natural scrolling inside the dossier panel!
            }
            if (Math.abs(e.deltaY) < 8) return;
            if (performance.now() < world.current.warpCooldownUntil) return;
            step(e.deltaY > 0 ? 1 : -1);
        };
        window.addEventListener('wheel', onWheel, { passive: true });

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { syncSelected(null); setActiveStop(null); return; }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { step(1); return; }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { step(-1); return; }
            const n = parseInt(e.key, 10);
            if (n >= 1 && n <= BODIES.length) goTo(n - 1);
            if (e.key === '0' || e.key === '`') goTo(OVERVIEW);
        };
        window.addEventListener('keydown', onKey);

        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        const ro = new ResizeObserver(onResize);
        ro.observe(mount);

        /* ── Frame loop ── */
        const tmp = new THREE.Vector3();
        const desired = new THREE.Vector3();
        const lookDesired = new THREE.Vector3();
        const projected = new THREE.Vector3();
        let raf = 0;
        const start = performance.now();
        let firstFrame = true;

        const animate = () => {
            raf = requestAnimationFrame(animate);
            if (document.hidden) return;
            const t = (performance.now() - start) / 1000;
            const dt = Math.min(0.05, 1 / 60);
            const w = world.current;

            // Sun pulse + starfield time + solar granulation turbulence
            sun.core.scale.setScalar(1 + Math.sin(t * 1.4) * 0.02);
            sun.glow.material.opacity = 0.75 + Math.sin(t * 1.4) * 0.12;
            if ((sun.core.material as THREE.ShaderMaterial).uniforms?.uTime) {
                (sun.core.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
            }
            if ((stars.material as THREE.ShaderMaterial).uniforms?.uTime) {
                (stars.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
            }

            // Bodies on orbits
            bodies.forEach((b, i) => {
                bodyPosition(b.def, t, b.group.position);
                b.mesh.rotation.y += dt * (0.15 + i * 0.05);
                if (b.clouds) {
                    b.clouds.rotation.y += dt * 0.22;
                }
                b.mats.forEach((m) => {
                    if (m.uniforms?.uTime) {
                        m.uniforms.uTime.value = t;
                    }
                });
                if (b.ringPulse) {
                    if (b.def.kind === 'pulsar') {
                        const p = (t * 0.35) % 1;
                        b.ringPulse.scale.setScalar(1 + p * 4);
                        (b.ringPulse.material as THREE.MeshBasicMaterial).opacity = 0.45 * (1 - p);
                    } else {
                        b.ringPulse.rotation.y += dt * 0.4;
                    }
                }
                b.glow.material.opacity = (b.def.id === 'origin' ? 0.08 : 0.16) + Math.sin(t * 0.8 + i) * 0.02;
            });

            belt.rotation.y = t * 0.01;

            // Moons around MACHINES
            moons.forEach((m, i) => {
                const a = t * (0.5 + i * 0.12) + i * 1.7;
                m.position.set(Math.cos(a) * (machines.def.size + 4.5 + i * 1.4), Math.sin(a * 0.7) * 1.2, Math.sin(a) * (machines.def.size + 4.5 + i * 1.4));
                m.rotation.y += dt;
                const isSel = w.selectedMoon === i && selectedRef.current !== null;
                m.scale.setScalar(isSel ? 1.4 : 1);
            });

            // Raycast hover (desktop affordance)
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects(pickables, false)[0];
            const newHovered = hit ? hit.object : null;
            if (newHovered !== hovered) {
                hovered = newHovered;
                document.body.style.cursor = hovered ? 'pointer' : '';
            }

            // ── Camera rig ──
            if (w.targetIndex === OVERVIEW) {
                const a = t * 0.035;
                // Extended radius (420) and elevation (190) ensures all bodies out to Beacon (286) fit at 100% default zoom
                desired.set(Math.cos(a) * 420, 190 + Math.sin(t * 0.08) * 8, Math.sin(a) * 420);
                lookDesired.set(0, 0, 0);
            } else {
                const b = bodies[w.targetIndex];
                bodyPosition(b.def, t, tmp);

                // Position camera on the sunward side so the planet's illuminated daylight hemisphere faces the viewer!
                // Vector pointing from planet toward the central star (0,0,0)
                const planetToSun = new THREE.Vector3(-tmp.x, 0, -tmp.z).normalize();
                // Perpendicular horizontal tangent along orbital direction
                const tangent = new THREE.Vector3(-planetToSun.z, 0, planetToSun.x);
                // 33-degree sun offset creates an ~80% gibbous phase (shows terrain, oceans & terminator line)
                const sunAngle = 0.58;
                const viewDir = new THREE.Vector3()
                    .copy(planetToSun)
                    .multiplyScalar(Math.cos(sunAngle))
                    .addScaledVector(tangent, Math.sin(sunAngle))
                    .normalize();

                const dist = b.def.size * 5.0 + 13;
                desired.set(
                    tmp.x + viewDir.x * dist + w.mouse.x * 2.2,
                    tmp.y + b.def.size * 0.9 + w.mouse.y * 1.8,
                    tmp.z + viewDir.z * dist
                );
                // Offset camera look target to the right so the planet is framed gracefully in the left half of the screen,
                // leaving the right half open for the HUD dossier panel
                const camDir = new THREE.Vector3().subVectors(tmp, desired).normalize();
                const camRight = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();
                lookDesired.copy(tmp).addScaledVector(camRight, dist * 0.28);
            }
            const ease = 1 - Math.exp(-dt * 2.6);
            w.camPos.lerp(desired, ease);
            w.camLook.lerp(lookDesired, ease);
            camera.position.copy(w.camPos);
            camera.lookAt(w.camLook);

            // ── Project labels to screen ──
            const project = (obj: THREE.Vector3, el: HTMLElement | null) => {
                if (!el) return;
                projected.copy(obj).project(camera);
                const onScreen = projected.z < 1 &&
                    Math.abs(projected.x) < 0.95 && Math.abs(projected.y) < 0.95;
                el.style.opacity = onScreen ? '0.85' : '0';
                if (onScreen) {
                    el.style.left = `${(projected.x * 0.5 + 0.5) * mount.clientWidth}px`;
                    el.style.top = `${(-projected.y * 0.5 + 0.5) * mount.clientHeight}px`;
                }
            };
            project(sun.group.position, labelRefs.current[0]);
            bodies.forEach((b, i) => {
                bodyPosition(b.def, t, tmp);
                tmp.y += b.def.size + 3.5;
                project(tmp, labelRefs.current[i + 1]);
            });

            renderer.render(scene, camera);
            if (firstFrame) { firstFrame = false; setBooted(true); }
        };
        animate();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKey);
            renderer.domElement.removeEventListener('click', onClick);
            document.body.style.cursor = '';
            scene.traverse((o) => {
                const mesh = o as THREE.Mesh;
                if (mesh.geometry) mesh.geometry.dispose();
                const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
                if (Array.isArray(m)) m.forEach((x) => x.dispose());
                else if (m) m.dispose();
            });
            renderer.dispose();
            mount.removeChild(renderer.domElement);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#020205', overflow: 'hidden' }}>
            {/* WebGL world */}
            <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

            {/* Projected body labels */}
            {['CORE', ...BODIES.map((b) => b.label)].map((label, i) => (
                <div
                    key={label}
                    ref={(el) => { labelRefs.current[i] = el; }}
                    style={{
                        position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0,
                        transition: 'opacity 0.5s ease',
                    }}
                >
                    <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em',
                        color: i === 0 ? 'rgba(255,230,180,0.9)' : accentFor(BODIES[i - 1]?.id ?? ''),
                        textShadow: '0 0 12px rgba(0,0,0,0.9)', whiteSpace: 'nowrap',
                    }}>
                        {label}
                    </div>
                </div>
            ))}

            {/* Content dossier for the arrived stop */}
            {activeStop && (
                <StopPanel
                    bodyId={activeStop}
                    selectedProjectId={selectedProjectId}
                    onSelectProject={syncSelected}
                    onClose={() => { setActiveStop(null); syncSelected(null); }}
                />
            )}

            {/* Top chrome */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px clamp(20px, 3vw, 44px)', pointerEvents: 'none' }}>
                <button onClick={() => goTo(OVERVIEW)} style={{ pointerEvents: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '99px', padding: '10px 22px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: '#fff', background: 'rgba(3,3,8,0.6)', backdropFilter: 'blur(10px)' }}>
                    {profile.name.split(' ')[0].toUpperCase()}.SYSTEM
                </button>
                <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto' }}>
                    <Link href="/" className="glow-btn" style={{ background: 'rgba(3,3,8,0.6)', backdropFilter: 'blur(10px)', borderRadius: '99px' }}>
                        ← BASE
                    </Link>
                    <a href={profile.resumeSite} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)', background: 'rgba(3,3,8,0.6)', backdropFilter: 'blur(10px)', borderRadius: '99px' }}>
                        RESUME ↗
                    </a>
                    <Link href="/projects" className="glow-btn" style={{ background: 'rgba(3,3,8,0.6)', backdropFilter: 'blur(10px)', borderRadius: '99px' }}>
                        ARCHIVE
                    </Link>
                </div>
            </div>

            {/* Hint (overview only) */}
            {!activeStop && booted && (
                <div style={{ position: 'absolute', left: '50%', bottom: '110px', transform: 'translateX(-50%)', zIndex: 30, pointerEvents: 'none', textAlign: 'center' }}>
                    <span className="mono-tag" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.45)' }}>
                        EXPLORE BODIES VIA SCROLL OR CLICK — [1–6] DIRECT JUMP — ESC TO RETURN
                    </span>
                </div>
            )}

            {/* Bottom system map */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30, padding: '20px clamp(20px, 3vw, 44px) 26px', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '99px', padding: '8px 12px', background: 'rgba(3,3,8,0.72)', backdropFilter: 'blur(14px)', pointerEvents: 'auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button onClick={() => goTo(OVERVIEW)} className="sysmap-stop" data-active={activeIndex === OVERVIEW}>
                        <span style={{ color: '#ffe6b4' }}>◉</span> CORE
                    </button>
                    {BODIES.map((b, i) => (
                        <span key={b.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '9px' }}>—</span>
                            <button onClick={() => goTo(i)} className="sysmap-stop" data-active={activeIndex === i}>
                                <span style={{ color: accentFor(b.id) }}>●</span> {b.label}
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Boot fade */}
            <div style={{
                position: 'absolute', inset: 0, background: '#020205', zIndex: 50, pointerEvents: 'none',
                opacity: booted ? 0 : 1, transition: 'opacity 1.2s ease',
            }}>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                    <span className="mono-tag" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>INITIALIZING CELESTIAL SYSTEM…</span>
                </div>
            </div>
        </div>
    );
}
