import * as THREE from 'three';

/** The six stops of the system. Each maps to a HUD panel fed by the JSON data layer. */
export interface BodyDef {
    id: string;
    label: string;
    subtitle: string;
    kind: 'planet' | 'ringed' | 'pulsar' | 'belt' | 'beacon';
    colorA: number;
    colorB: number;
    orbitRadius: number;
    orbitSpeed: number;
    angle0: number;
    tilt: number;
    size: number;
}

export const BODIES: BodyDef[] = [
    { id: 'origin', label: 'ORIGIN', subtitle: 'PROFILE_INDEX', kind: 'planet', colorA: 0x1a6f6f, colorB: 0x00e5ff, orbitRadius: 46, orbitSpeed: 0.055, angle0: 0.6, tilt: 0.12, size: 3.4 },
    { id: 'machines', label: 'MACHINES', subtitle: 'ENGINEERING_WORK', kind: 'ringed', colorA: 0x3d7a1f, colorB: 0xa0ff60, orbitRadius: 92, orbitSpeed: 0.036, angle0: 2.4, tilt: 0.3, size: 4.6 },
    { id: 'trajectory', label: 'TRAJECTORY', subtitle: 'PROFESSIONAL_CHRONOLOGY', kind: 'planet', colorA: 0x8a4a12, colorB: 0xffaa00, orbitRadius: 138, orbitSpeed: 0.026, angle0: 4.4, tilt: -0.18, size: 4.0 },
    { id: 'signals', label: 'SIGNALS', subtitle: 'RESEARCH_TRANSMISSIONS', kind: 'pulsar', colorA: 0x5c1a8a, colorB: 0xd5a8ff, orbitRadius: 184, orbitSpeed: 0.02, angle0: 1.4, tilt: 0.1, size: 2.2 },
    { id: 'arsenal', label: 'ARSENAL', subtitle: 'TECHNICAL_CONSTELLATION', kind: 'belt', colorA: 0x555a70, colorB: 0xb9c6ff, orbitRadius: 232, orbitSpeed: 0.015, angle0: 5.2, tilt: 0.22, size: 1.2 },
    { id: 'beacon', label: 'BEACON', subtitle: 'CONTACT_SECURE', kind: 'beacon', colorA: 0x7a1530, colorB: 0xff5577, orbitRadius: 286, orbitSpeed: 0.011, angle0: 3.5, tilt: -0.1, size: 2.6 },
];

/** Positions each body on its tilted orbit for time t (seconds). Writes into out. */
export function bodyPosition(def: BodyDef, t: number, out: THREE.Vector3): THREE.Vector3 {
    const a = def.angle0 + t * def.orbitSpeed;
    out.set(Math.cos(a) * def.orbitRadius, 0, Math.sin(a) * def.orbitRadius);
    out.applyAxisAngle(new THREE.Vector3(1, 0, 0), def.tilt);
    return out;
}

/** ── Starfield: one Points cloud, twinkle in-shader ───────────────────────── */
export function createStars(count = 3200): THREE.Points {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        // shell distribution between r 220..1200
        const r = 220 + Math.pow(Math.random(), 0.6) * 980;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.cos(phi) * 0.6;
        pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        seed[i] = Math.random() * 100;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
            attribute float aSeed;
            varying float vSeed;
            void main() {
                vSeed = aSeed;
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = (1.2 + fract(aSeed * 0.37) * 2.2) * (300.0 / -mv.z);
                gl_Position = projectionMatrix * mv;
            }
        `,
        fragmentShader: `
            uniform float uTime;
            varying float vSeed;
            void main() {
                float d = length(gl_PointCoord - vec2(0.5));
                if (d > 0.5) discard;
                float twinkle = 0.55 + 0.45 * sin(uTime * (0.4 + fract(vSeed) * 0.8) + vSeed);
                float alpha = (1.0 - smoothstep(0.0, 0.5, d)) * twinkle;
                vec3 tint = mix(vec3(0.75, 0.82, 1.0), vec3(1.0, 0.92, 0.8), fract(vSeed * 0.618));
                gl_FragColor = vec4(tint, alpha * 0.9);
            }
        `,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    return points;
}

/** ── Soft radial sprite texture (for glows/nebulae) ───────────────────────── */
export function makeGlowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)'): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, inner);
    g.addColorStop(0.4, inner.replace(',1)', ',0.35)'));
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
}

/** ── The sun (identity core) ──────────────────────────────────────────────── */
export function createSun(): { group: THREE.Group; core: THREE.Mesh; glow: THREE.Sprite; light: THREE.PointLight } {
    const group = new THREE.Group();
    const core = new THREE.Mesh(
        new THREE.SphereGeometry(9, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xfff4e0 }),
    );
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture('rgba(255,220,160,1)', 'rgba(255,150,60,0)'),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
    }));
    glow.scale.setScalar(70);
    const light = new THREE.PointLight(0xffe0b0, 900, 900, 1.8);
    group.add(core, glow, light);
    return { group, core, glow, light };
}

/** ── Planet surface shader: soft bands + fresnel rim ─────────────────────── */
function planetMaterial(colorA: number, colorB: number): THREE.ShaderMaterial {
    const ca = new THREE.Color(colorA);
    const cb = new THREE.Color(colorB);
    return new THREE.ShaderMaterial({
        uniforms: {
            uColorA: { value: ca },
            uColorB: { value: cb },
            uTime: { value: 0 },
            uSeed: { value: Math.random() * 10 },
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vView;
            varying vec3 vObj;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                vView = normalize(-mv.xyz);
                vObj = position;
                gl_Position = projectionMatrix * mv;
            }
        `,
        fragmentShader: `
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            uniform float uTime;
            uniform float uSeed;
            varying vec3 vNormal;
            varying vec3 vView;
            varying vec3 vObj;
            float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            float noise(vec2 p) {
                vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
                return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                           mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
            }
            void main() {
                vec2 uv = vObj.xy * 1.6 + uSeed;
                float bands = noise(uv + vec2(uTime * 0.03, 0.0)) * 0.6 + noise(uv * 2.7) * 0.4;
                vec3 base = mix(uColorA, uColorB, bands * 0.85);
                // day/night shading from a fixed light dir
                float lambert = clamp(dot(normalize(vNormal), normalize(vec3(0.6, 0.5, 0.8))) * 0.5 + 0.5, 0.0, 1.0);
                base *= 0.25 + 0.85 * lambert;
                float fres = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0), 2.6);
                vec3 col = base + uColorB * fres * 0.9;
                gl_FragColor = vec4(col, 1.0);
            }
        `,
    });
}

export interface BuiltBody {
    def: BodyDef;
    group: THREE.Group;      // positioned on the orbit each frame
    mesh: THREE.Mesh;        // raycast target
    mats: THREE.ShaderMaterial[];
    ringPulse?: THREE.Mesh;
    glow: THREE.Sprite;
}

/** ── Body factory ────────────────────────────────────────────────────────── */
export function createBody(def: BodyDef): BuiltBody {
    const group = new THREE.Group();
    const mats: THREE.ShaderMaterial[] = [];
    let mesh: THREE.Mesh;
    let ringPulse: THREE.Mesh | undefined;

    if (def.kind === 'pulsar') {
        // compact bright core + slow expanding pulse rings
        mesh = new THREE.Mesh(new THREE.SphereGeometry(def.size, 24, 24), new THREE.MeshBasicMaterial({ color: def.colorB }));
        const pulse = new THREE.Mesh(
            new THREE.RingGeometry(def.size * 1.3, def.size * 1.42, 48),
            new THREE.MeshBasicMaterial({ color: def.colorB, transparent: true, opacity: 0.5, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
        );
        pulse.rotation.x = -Math.PI / 2;
        group.add(pulse);
        ringPulse = pulse;
    } else if (def.kind === 'beacon') {
        const octa = new THREE.Mesh(
            new THREE.OctahedronGeometry(def.size, 0),
            planetMaterial(def.colorA, def.colorB),
        );
        mats.push(octa.material as THREE.ShaderMaterial);
        mesh = octa;
        const beam = new THREE.Mesh(
            new THREE.CylinderGeometry(def.size * 0.12, def.size * 0.5, def.size * 9, 12, 1, true),
            new THREE.MeshBasicMaterial({ color: def.colorB, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
        );
        beam.position.y = def.size * 4.5;
        group.add(beam);
        ringPulse = beam;
    } else {
        mesh = new THREE.Mesh(new THREE.SphereGeometry(def.size, 40, 40), planetMaterial(def.colorA, def.colorB));
        mats.push(mesh.material as THREE.ShaderMaterial);
        if (def.kind === 'ringed') {
            const ring = new THREE.Mesh(
                new THREE.RingGeometry(def.size * 1.5, def.size * 2.4, 64),
                new THREE.MeshBasicMaterial({ color: def.colorB, transparent: true, opacity: 0.22, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
            );
            ring.rotation.x = Math.PI / 2.4;
            group.add(ring);
        }
    }

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture(`rgba(${(def.colorB >> 16) & 255},${(def.colorB >> 8) & 255},${def.colorB & 255},1)`, 'rgba(0,0,0,0)'),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.5,
    }));
    glow.scale.setScalar(def.size * 6.5);
    group.add(glow);
    group.add(mesh);

    return { def, group, mesh, mats, ringPulse, glow };
}

/** ── Orbit rings ─────────────────────────────────────────────────────────── */
export function createOrbitRing(radius: number, tilt: number, color: number): THREE.Group {
    const g = new THREE.Group();
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.09 }),
    );
    g.add(line);
    g.rotation.x = tilt;
    return g;
}

/** ── Asteroid belt (skills arsenal) ──────────────────────────────────────── */
export function createAsteroidBelt(def: BodyDef): THREE.InstancedMesh {
    const count = 260;
    const geo = new THREE.TetrahedronGeometry(1, 0);
    const mat = new THREE.MeshStandardMaterial({ color: def.colorA, roughness: 0.9, metalness: 0.1, flatShading: true });
    const inst = new THREE.InstancedMesh(geo, mat, count);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = def.orbitRadius + (Math.random() - 0.5) * 26;
        dummy.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 10, Math.sin(a) * r);
        dummy.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        dummy.scale.setScalar(0.4 + Math.random() * 1.4);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
    }
    return inst;
}

/** ── Nebula backdrop sprites ─────────────────────────────────────────────── */
export function createNebulae(): THREE.Group {
    const g = new THREE.Group();
    const palette = ['rgba(64,28,120,1)', 'rgba(12,60,90,1)', 'rgba(90,20,70,1)'];
    for (let i = 0; i < 6; i++) {
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: makeGlowTexture(palette[i % palette.length], 'rgba(0,0,0,0)'),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            opacity: 0.16,
        }));
        const a = (i / 6) * Math.PI * 2 + 0.7;
        const r = 500 + (i % 3) * 180;
        sprite.position.set(Math.cos(a) * r, (i - 3) * 60, Math.sin(a) * r);
        sprite.scale.set(700 + i * 90, 420 + i * 60, 1);
        g.add(sprite);
    }
    return g;
}
