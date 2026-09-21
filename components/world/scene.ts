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
    { id: 'origin', label: 'ORIGIN', subtitle: 'PROFILE_INDEX', kind: 'planet', colorA: 0x0a2540, colorB: 0x00e5ff, orbitRadius: 46, orbitSpeed: 0.055, angle0: 0.6, tilt: 0.12, size: 3.4 },
    { id: 'machines', label: 'MACHINES', subtitle: 'ENGINEERING_WORK', kind: 'ringed', colorA: 0x2b4a1b, colorB: 0xa0ff60, orbitRadius: 92, orbitSpeed: 0.036, angle0: 2.4, tilt: 0.3, size: 4.6 },
    { id: 'trajectory', label: 'TRAJECTORY', subtitle: 'PROFESSIONAL_CHRONOLOGY', kind: 'planet', colorA: 0x7a3010, colorB: 0xffaa00, orbitRadius: 138, orbitSpeed: 0.026, angle0: 4.4, tilt: -0.18, size: 4.0 },
    { id: 'signals', label: 'SIGNALS', subtitle: 'RESEARCH_TRANSMISSIONS', kind: 'pulsar', colorA: 0x4a126e, colorB: 0xd5a8ff, orbitRadius: 184, orbitSpeed: 0.02, angle0: 1.4, tilt: 0.1, size: 2.2 },
    { id: 'arsenal', label: 'ARSENAL', subtitle: 'TECHNICAL_CONSTELLATION', kind: 'belt', colorA: 0x3d4254, colorB: 0xb9c6ff, orbitRadius: 232, orbitSpeed: 0.015, angle0: 5.2, tilt: 0.22, size: 1.2 },
    { id: 'beacon', label: 'BEACON', subtitle: 'CONTACT_SECURE', kind: 'beacon', colorA: 0x6e1026, colorB: 0xff5577, orbitRadius: 286, orbitSpeed: 0.011, angle0: 3.5, tilt: -0.1, size: 2.6 },
];

/** Positions each body on its tilted orbit for time t (seconds). Writes into out. */
export function bodyPosition(def: BodyDef, t: number, out: THREE.Vector3): THREE.Vector3 {
    const a = def.angle0 + t * def.orbitSpeed;
    out.set(Math.cos(a) * def.orbitRadius, 0, Math.sin(a) * def.orbitRadius);
    out.applyAxisAngle(new THREE.Vector3(1, 0, 0), def.tilt);
    return out;
}

/** ── Pure TypeScript 3D Perlin Noise Generator ───────────────────────────── */
class PerlinNoise3D {
    private p: Uint8Array;

    constructor() {
        this.p = new Uint8Array(512);
        const perm = [
            151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,
            120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,
            74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,
            143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,
            173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,
            42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,
            113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
            14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,
            67,29,24,72,243,141,128,195,78,66,215,61,156,180
        ];
        for (let i = 0; i < 256; i++) {
            this.p[i] = this.p[256 + i] = perm[i];
        }
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(t: number, a: number, b: number): number {
        return a + t * (b - a);
    }

    private grad(hash: number, x: number, y: number, z: number): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    public noise(x: number, y: number, z: number): number {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);
        const A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z;
        const B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z;
        return this.lerp(w,
            this.lerp(v,
                this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)),
                this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))
            ),
            this.lerp(v,
                this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))
            )
        );
    }

    public fbm(x: number, y: number, z: number, octaves = 4): number {
        let val = 0;
        let amp = 0.5;
        let freq = 1.0;
        for (let i = 0; i < octaves; i++) {
            val += amp * this.noise(x * freq, y * freq, z * freq);
            amp *= 0.5;
            freq *= 2.05;
        }
        return val;
    }
}

const perlin = new PerlinNoise3D();

/** ── Procedural Planetary Texture Generators (Seamless Spherical UV Maps) ── */

function createTerranTexture(w = 512, h = 256): THREE.DataTexture {
    const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
        const lat = (y / h) * Math.PI - Math.PI / 2;
        const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
        for (let x = 0; x < w; x++) {
            const lon = (x / w) * Math.PI * 2;
            const nx = cosLat * Math.cos(lon), ny = sinLat, nz = cosLat * Math.sin(lon);
            const e = perlin.fbm(nx * 2.8, ny * 2.8, nz * 2.8, 5);

            let r = 0, g = 0, b = 0;
            if (Math.abs(ny) > 0.82) {
                // Polar Ice Caps
                r = 242; g = 246; b = 255;
            } else if (e < -0.06) {
                // Abyssal Deep Ocean
                r = 10; g = 32; b = 75;
            } else if (e < 0.04) {
                // Shallow Tropical Shelf / Turquoise waters
                r = 24; g = 120; b = 168;
            } else if (e < 0.10) {
                // Sandy Coastal Margin
                r = 192; g = 175; b = 135;
            } else if (e < 0.35) {
                // Temperate Forests & Grasslands
                r = 48; g = 122; b = 58;
            } else if (e < 0.56) {
                // Highland Savannah / Clay Mountains
                r = 152; g = 108; b = 68;
            } else if (e < 0.72) {
                // Alpine Granite Ridge
                r = 118; g = 114; b = 122;
            } else {
                // Glacial Snow Peaks
                r = 245; g = 248; b = 255;
            }

            const idx = (y * w + x) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
}

function createCloudTexture(w = 512, h = 256): THREE.DataTexture {
    const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
        const lat = (y / h) * Math.PI - Math.PI / 2;
        const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
        for (let x = 0; x < w; x++) {
            const lon = (x / w) * Math.PI * 2;
            const nx = cosLat * Math.cos(lon), ny = sinLat, nz = cosLat * Math.sin(lon);
            const c1 = perlin.fbm(nx * 3.6, ny * 3.6, nz * 3.6, 4);
            const c2 = perlin.fbm(nx * 7.5, ny * 7.5, nz * 7.5, 3);
            const c = c1 * 0.65 + c2 * 0.35;

            let alpha = 0;
            if (c > 0.08) {
                alpha = Math.floor(Math.min(1, (c - 0.08) / 0.35) * 220);
            }

            const idx = (y * w + x) * 4;
            data[idx] = 255;
            data[idx + 1] = 255;
            data[idx + 2] = 255;
            data[idx + 3] = alpha;
        }
    }
    const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
}

function createGasGiantTexture(w = 512, h = 256): THREE.DataTexture {
    const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
        const lat = (y / h) * Math.PI - Math.PI / 2;
        const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
        for (let x = 0; x < w; x++) {
            const lon = (x / w) * Math.PI * 2;
            const nx = cosLat * Math.cos(lon), ny = sinLat, nz = cosLat * Math.sin(lon);

            // Zonal atmospheric shear bands
            const wave = Math.sin(ny * 22.0 + perlin.noise(nx * 3, ny * 3, nz * 3) * 1.8);
            const micro = Math.sin(ny * 65.0) * 0.25;
            const swirl = perlin.fbm(nx * 8, ny * 8, nz * 8, 3) * 0.25;
            const v = (wave * 0.65 + micro * 0.2 + swirl * 0.15) * 0.5 + 0.5;

            // Colors: golden amber, cream, caramel, olive
            let r = Math.floor(135 + v * 105);
            let g = Math.floor(115 + v * 125);
            let b = Math.floor(70 + v * 100);

            // Great Storm Oval at latitude -0.28, longitude ~ 1.8 rad
            const dLat = ny - (-0.28);
            const dLon = (lon > Math.PI ? lon - Math.PI * 2 : lon) - 1.8;
            const stormDist = Math.sqrt(dLon * dLon * 2.5 + dLat * dLat * 8.0);
            if (stormDist < 0.28) {
                const stormFactor = 1.0 - stormDist / 0.28;
                r = Math.floor(r * (1 - stormFactor) + 215 * stormFactor);
                g = Math.floor(g * (1 - stormFactor) + 75 * stormFactor);
                b = Math.floor(b * (1 - stormFactor) + 35 * stormFactor);
            }

            const idx = (y * w + x) * 4;
            data[idx] = Math.min(255, r);
            data[idx + 1] = Math.min(255, g);
            data[idx + 2] = Math.min(255, b);
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
}

function createMarsTexture(w = 512, h = 256): THREE.DataTexture {
    const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
        const lat = (y / h) * Math.PI - Math.PI / 2;
        const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
        for (let x = 0; x < w; x++) {
            const lon = (x / w) * Math.PI * 2;
            const nx = cosLat * Math.cos(lon), ny = sinLat, nz = cosLat * Math.sin(lon);

            // Canyons & craters
            const terrain = perlin.fbm(nx * 3.5, ny * 3.5, nz * 3.5, 4);
            const canyon = Math.abs(perlin.noise(nx * 7.5, ny * 7.5, nz * 7.5)) * 0.45;
            const hVal = terrain - canyon;

            let r = 0, g = 0, b = 0;
            if (Math.abs(ny) > 0.82) {
                // Polar Dry-Ice Caps
                r = 245; g = 248; b = 255;
            } else if (hVal < -0.15) {
                // Valles Marineris canyon depths
                r = 68; g = 28; b = 15;
            } else if (hVal < 0.18) {
                // Rust oxidized highlands
                r = 185; g = 82; b = 32;
            } else {
                // Bright sand plains
                r = 232; g = 145; b = 68;
            }

            const idx = (y * w + x) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
}

function createPulsarTexture(w = 512, h = 256): THREE.DataTexture {
    const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
        const lat = (y / h) * Math.PI - Math.PI / 2;
        const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
        for (let x = 0; x < w; x++) {
            const lon = (x / w) * Math.PI * 2;
            const nx = cosLat * Math.cos(lon), ny = sinLat, nz = cosLat * Math.sin(lon);

            // Relativistic magnetic flux spirals
            const flux = Math.abs(Math.sin(ny * 24.0 + perlin.fbm(nx * 6, ny * 6, nz * 6, 3) * 3.5));
            const pole = Math.pow(Math.abs(ny), 4.0);

            const r = Math.floor(40 + flux * 170 + pole * 45);
            const g = Math.floor(15 + flux * 120 + pole * 70);
            const b = Math.floor(80 + flux * 175 + pole * 95);

            const idx = (y * w + x) * 4;
            data[idx] = Math.min(255, r);
            data[idx + 1] = Math.min(255, g);
            data[idx + 2] = Math.min(255, b);
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
}

function createAsteroidTexture(w = 512, h = 256): THREE.DataTexture {
    const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
        const lat = (y / h) * Math.PI - Math.PI / 2;
        const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
        for (let x = 0; x < w; x++) {
            const lon = (x / w) * Math.PI * 2;
            const nx = cosLat * Math.cos(lon), ny = sinLat, nz = cosLat * Math.sin(lon);

            const maria = perlin.fbm(nx * 2.2, ny * 2.2, nz * 2.2, 3);
            const craters = Math.pow(Math.abs(perlin.noise(nx * 14.0, ny * 14.0, nz * 14.0)), 1.8) * 0.45;
            const hVal = maria - craters;

            const base = Math.floor(75 + hVal * 95);
            const val = Math.max(30, Math.min(235, base));

            const idx = (y * w + x) * 4;
            data[idx] = val;
            data[idx + 1] = Math.floor(val * 1.02);
            data[idx + 2] = Math.floor(val * 1.08);
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
}

function createBeaconTexture(w = 512, h = 256): THREE.DataTexture {
    const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
        const lat = (y / h) * Math.PI - Math.PI / 2;
        const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
        for (let x = 0; x < w; x++) {
            const lon = (x / w) * Math.PI * 2;
            const nx = cosLat * Math.cos(lon), ny = sinLat, nz = cosLat * Math.sin(lon);

            // Obsidian crystal facets with circuit tracks
            const gridX = Math.abs(Math.sin(nx * 32.0)) > 0.94 ? 1 : 0;
            const gridY = Math.abs(Math.sin(ny * 32.0)) > 0.94 ? 1 : 0;
            const gridZ = Math.abs(Math.sin(nz * 32.0)) > 0.94 ? 1 : 0;
            const circuit = Math.max(gridX, Math.max(gridY, gridZ));

            let r = 16, g = 12, b = 18;
            if (circuit > 0) {
                r = 255; g = 65; b = 110;
            }

            const idx = (y * w + x) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
}

/** ── Cached Procedural Textures ───────────────────────────────────────────── */
let cachedTerran: THREE.DataTexture | null = null;
let cachedClouds: THREE.DataTexture | null = null;
let cachedGas: THREE.DataTexture | null = null;
let cachedMars: THREE.DataTexture | null = null;
let cachedPulsar: THREE.DataTexture | null = null;
let cachedAsteroid: THREE.DataTexture | null = null;
let cachedBeacon: THREE.DataTexture | null = null;

function getPlanetTexture(id: string): THREE.DataTexture {
    if (typeof window === 'undefined') {
        return new THREE.DataTexture(new Uint8Array(4), 1, 1);
    }
    if (id === 'origin') {
        if (!cachedTerran) cachedTerran = createTerranTexture();
        return cachedTerran;
    }
    if (id === 'machines') {
        if (!cachedGas) cachedGas = createGasGiantTexture();
        return cachedGas;
    }
    if (id === 'trajectory') {
        if (!cachedMars) cachedMars = createMarsTexture();
        return cachedMars;
    }
    if (id === 'signals') {
        if (!cachedPulsar) cachedPulsar = createPulsarTexture();
        return cachedPulsar;
    }
    if (id === 'arsenal') {
        if (!cachedAsteroid) cachedAsteroid = createAsteroidTexture();
        return cachedAsteroid;
    }
    if (!cachedBeacon) cachedBeacon = createBeaconTexture();
    return cachedBeacon;
}

/** ── Starfield: Multi-temperature stars with depth and scintillation ───────── */
export function createStars(count = 3800): THREE.Points {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const colorType = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        const r = 260 + Math.pow(Math.random(), 0.5) * 1400;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.cos(phi) * 0.7;
        pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

        seed[i] = Math.random() * 100.0;
        colorType[i] = Math.random();
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geo.setAttribute('aColorType', new THREE.BufferAttribute(colorType, 1));

    const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
            attribute float aSeed;
            attribute float aColorType;
            varying float vSeed;
            varying float vColorType;
            uniform float uTime;
            void main() {
                vSeed = aSeed;
                vColorType = aColorType;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                float dist = -mvPosition.z;
                float twinkle = sin(uTime * 1.5 + aSeed) * 0.25 + 0.75;
                gl_PointSize = (1.6 + aColorType * 1.4) * (260.0 / dist) * twinkle;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vSeed;
            varying float vColorType;
            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                float dist = length(coord);
                if (dist > 0.5) discard;
                float alpha = smoothstep(0.5, 0.0, dist);

                vec3 col = vec3(0.9, 0.95, 1.0);
                if (vColorType < 0.25) {
                    col = vec3(1.0, 0.82, 0.55);
                } else if (vColorType > 0.75) {
                    col = vec3(0.65, 0.85, 1.0);
                }
                gl_FragColor = vec4(col, alpha * 0.95);
            }
        `,
    });

    return new THREE.Points(geo, mat);
}

function makeRadialGlowTexture(r: number, g: number, b: number, peakAlpha = 0.8): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, `rgba(${r},${g},${b},${peakAlpha})`);
    grad.addColorStop(0.25, `rgba(${r},${g},${b},${peakAlpha * 0.55})`);
    grad.addColorStop(0.55, `rgba(${r},${g},${b},${peakAlpha * 0.18})`);
    grad.addColorStop(0.8, `rgba(${r},${g},${b},${peakAlpha * 0.04})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
}

/** ── Photorealistic The Sun (Identity Core with Granulation & Corona) ─────── */
export function createSun(): { group: THREE.Group; core: THREE.Mesh; glow: THREE.Sprite; light: THREE.PointLight } {
    const group = new THREE.Group();

    // Procedural solar photosphere shader
    const sunGeo = new THREE.SphereGeometry(6.2, 64, 64);
    const sunMat = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vView;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                vView = normalize(-mv.xyz);
                gl_Position = projectionMatrix * mv;
            }
        `,
        fragmentShader: `
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vView;

            float hash(vec3 p) {
                p = fract(p * 0.3183099 + 0.1);
                p *= 17.0;
                return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
            }

            float noise(vec3 x) {
                vec3 p = floor(x);
                vec3 f = fract(x);
                f = f * f * (3.0 - 2.0 * f);
                return mix(mix(mix(hash(p + vec3(0,0,0)), hash(p + vec3(1,0,0)), f.x),
                               mix(hash(p + vec3(0,1,0)), hash(p + vec3(1,1,0)), f.x), f.y),
                           mix(mix(hash(p + vec3(0,0,1)), hash(p + vec3(1,0,1)), f.x),
                               mix(hash(p + vec3(0,1,1)), hash(p + vec3(1,1,1)), f.x), f.y), f.z);
            }

            void main() {
                vec3 normPos = normalize(vPosition);
                float n1 = noise(normPos * 12.0 + vec3(uTime * 0.08, uTime * 0.05, 0.0));
                float n2 = noise(normPos * 24.0 - vec3(0.0, uTime * 0.06, uTime * 0.09));
                float plasma = n1 * 0.7 + n2 * 0.3;

                vec3 coreWhite = vec3(1.0, 0.98, 0.92);
                vec3 solarGold = vec3(1.0, 0.78, 0.22);
                vec3 deepOrange = vec3(1.0, 0.35, 0.05);
                vec3 coronaRed = vec3(0.85, 0.12, 0.02);

                vec3 col = mix(deepOrange, solarGold, plasma * 0.5 + 0.5);
                col = mix(col, coreWhite, pow(plasma * 0.5 + 0.5, 3.0) * 0.85);

                float limb = clamp(dot(vNormal, vView), 0.0, 1.0);
                col = mix(coronaRed, col, pow(limb, 0.5));

                gl_FragColor = vec4(col, 1.0);
            }
        `,
    });

    const core = new THREE.Mesh(sunGeo, sunMat);

    // Multi-layered solar corona glow sprite (confined within 12-radius, well inside Orbit 1 at 46)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeRadialGlowTexture(255, 205, 120, 0.7),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.65,
    }));
    glow.scale.setScalar(24);

    // Dynamic solar prominence halo (confined within 17-radius)
    const prominenceGlow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeRadialGlowTexture(255, 95, 20, 0.35),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.45,
    }));
    prominenceGlow.scale.setScalar(34);

    // Physical balanced point light illuminating all planets cleanly
    const light = new THREE.PointLight(0xfff6ea, 300, 1600, 1.0);

    group.add(core, glow, prominenceGlow, light);
    return { group, core, glow, light };
}

/** ── Soft Rayleigh Inverted-Fresnel Atmosphere Glow ───────────────────────── */
function createAtmosphereMesh(radius: number, colorHex: number): THREE.Mesh {
    // Thin, realistic atmospheric limb hugging the planet surface
    const geo = new THREE.SphereGeometry(radius * 1.025, 48, 48);
    const color = new THREE.Color(colorHex);
    const mat = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
            uColor: { value: color },
            uTime: { value: 0 },
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                vView = normalize(-mv.xyz);
                gl_Position = projectionMatrix * mv;
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
                float rim = 1.0 - max(0.0, dot(vNormal, vView));
                float intensity = pow(rim, 3.5);
                gl_FragColor = vec4(uColor, intensity * 0.45);
            }
        `,
    });
    return new THREE.Mesh(geo, mat);
}

/** ── Photorealistic Multi-Band Rings for Gas Giants (Machines) ────────────── */
function createPhotorealisticRings(radius: number, colorHex: number): THREE.Mesh {
    const innerR = radius * 1.45;
    const outerR = radius * 2.75;
    const geo = new THREE.RingGeometry(innerR, outerR, 96);

    // Re-map UV coordinates radially so texture maps from inner to outer radius
    const pos = geo.attributes.position;
    const uvs = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const dist = Math.sqrt(x * x + y * y);
        const u = (dist - innerR) / (outerR - innerR);
        uvs.setXY(i, u, 0.5);
    }
    uvs.needsUpdate = true;

    // Create 1D concentric ring gradient
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 1;
    const ctx = c.getContext('2d')!;
    const imgData = ctx.createImageData(512, 1);
    const col = new THREE.Color(colorHex);
    const cr = Math.floor(col.r * 255);
    const cg = Math.floor(col.g * 255);
    const cb = Math.floor(col.b * 255);

    for (let x = 0; x < 512; x++) {
        const u = x / 512;
        let cassini = 1.0;
        if (u >= 0.61 && u <= 0.68) {
            cassini = 0.06;
        }
        const bands = Math.sin(u * 95.0) * 0.22 + Math.sin(u * 190.0) * 0.12 + 0.72;
        const edgeFade = Math.sin(u * Math.PI);
        const alpha = Math.floor(bands * cassini * edgeFade * 210);

        const idx = x * 4;
        imgData.data[idx] = Math.floor(cr * 0.35 + 215 * 0.65);
        imgData.data[idx + 1] = Math.floor(cg * 0.35 + 200 * 0.65);
        imgData.data[idx + 2] = Math.floor(cb * 0.35 + 175 * 0.65);
        imgData.data[idx + 3] = alpha;
    }
    ctx.putImageData(imgData, 0, 0);
    const ringTex = new THREE.CanvasTexture(c);
    ringTex.wrapS = THREE.ClampToEdgeWrapping;
    ringTex.wrapT = THREE.ClampToEdgeWrapping;

    const ringMat = new THREE.MeshStandardMaterial({
        map: ringTex,
        side: THREE.DoubleSide,
        transparent: true,
        roughness: 0.85,
        metalness: 0.05,
    });

    const ring = new THREE.Mesh(geo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    return ring;
}

export interface BuiltBody {
    def: BodyDef;
    group: THREE.Group;
    mesh: THREE.Mesh;
    clouds?: THREE.Mesh;
    atmosphere?: THREE.Mesh;
    mats: THREE.ShaderMaterial[];
    ringPulse?: THREE.Mesh;
    glow: THREE.Sprite;
}

/** ── Natural Celestial Moon with Surface Shading & Halos ───────────────────── */
export function createProjectMoon(color: string, index: number): THREE.Mesh {
    const geo = new THREE.SphereGeometry(0.72, 24, 24);
    const mat = new THREE.MeshStandardMaterial({
        color: 0x8892a0,
        roughness: 0.75,
        metalness: 0.18,
        emissive: new THREE.Color(color).multiplyScalar(0.22),
    });
    const moon = new THREE.Mesh(geo, mat);
    moon.userData.projectIndex = index;

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeRadialGlowTexture(color === '#00e5ff' ? 0 : 160, color === '#00e5ff' ? 229 : 255, color === '#00e5ff' ? 255 : 96, 0.6),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.35,
    }));
    halo.scale.setScalar(2.2);
    moon.add(halo);

    return moon;
}

/** ── Master Body Factory ─────────────────────────────────────────────────── */
export function createBody(def: BodyDef): BuiltBody {
    const group = new THREE.Group();
    const mats: THREE.ShaderMaterial[] = [];
    let mesh: THREE.Mesh;
    let clouds: THREE.Mesh | undefined;
    let atmosphere: THREE.Mesh | undefined;
    let ringPulse: THREE.Mesh | undefined;

    const planetTexture = getPlanetTexture(def.id);

    if (def.kind === 'pulsar') {
        // Relativistic Pulsar / Magnetar
        mesh = new THREE.Mesh(
            new THREE.SphereGeometry(def.size, 48, 48),
            new THREE.MeshStandardMaterial({
                map: planetTexture,
                roughness: 0.35,
                metalness: 0.45,
                emissive: new THREE.Color(def.colorB),
                emissiveIntensity: 0.5,
            })
        );

        // Expanding relativistic magnetic rings
        const pulse = new THREE.Mesh(
            new THREE.RingGeometry(def.size * 1.3, def.size * 1.45, 64),
            new THREE.MeshBasicMaterial({ color: def.colorB, transparent: true, opacity: 0.6, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
        );
        pulse.rotation.x = -Math.PI / 2;
        group.add(pulse);
        ringPulse = pulse;
    } else if (def.kind === 'beacon') {
        // High-energy crystalline deep space relay
        const octa = new THREE.Mesh(
            new THREE.OctahedronGeometry(def.size, 1),
            new THREE.MeshStandardMaterial({
                map: planetTexture,
                roughness: 0.2,
                metalness: 0.85,
                emissive: new THREE.Color(def.colorB),
                emissiveIntensity: 0.4,
            })
        );
        mesh = octa;

        // Laser beacon beam
        const beam = new THREE.Mesh(
            new THREE.CylinderGeometry(def.size * 0.08, def.size * 0.35, def.size * 10, 16, 1, true),
            new THREE.MeshBasicMaterial({ color: def.colorB, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
        );
        beam.position.y = def.size * 5.0;
        group.add(beam);
        ringPulse = beam;
    } else {
        // Terran, Gas Giant, Mars, Asteroid
        mesh = new THREE.Mesh(
            new THREE.SphereGeometry(def.size, 64, 64),
            new THREE.MeshStandardMaterial({
                map: planetTexture,
                roughness: def.id === 'origin' ? 0.55 : def.id === 'machines' ? 0.85 : 0.9,
                metalness: def.id === 'origin' ? 0.12 : 0.08,
            })
        );

        // Add swirling cloud layer to Earth/Terran class (Origin)
        if (def.id === 'origin') {
            if (!cachedClouds) cachedClouds = createCloudTexture();
            clouds = new THREE.Mesh(
                new THREE.SphereGeometry(def.size * 1.015, 48, 48),
                new THREE.MeshStandardMaterial({
                    map: cachedClouds,
                    transparent: true,
                    opacity: 0.82,
                    roughness: 0.95,
                    depthWrite: false,
                })
            );
            group.add(clouds);

            atmosphere = createAtmosphereMesh(def.size, def.colorB);
            mats.push(atmosphere.material as THREE.ShaderMaterial);
            group.add(atmosphere);
        }

        // Add photorealistic rings to Gas Giant (Machines)
        if (def.kind === 'ringed') {
            const ring = createPhotorealisticRings(def.size, def.colorB);
            group.add(ring);
        }

        // Add soft atmospheric glow to Mars (Trajectory)
        if (def.id === 'trajectory') {
            atmosphere = createAtmosphereMesh(def.size, def.colorB);
            mats.push(atmosphere.material as THREE.ShaderMaterial);
            group.add(atmosphere);
        }
    }

    // Delicate planetary atmospheric aura (subtle, non-occluding)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeRadialGlowTexture((def.colorB >> 16) & 255, (def.colorB >> 8) & 255, def.colorB & 255, 0.35),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: def.id === 'origin' ? 0.08 : 0.16,
    }));
    glow.scale.setScalar(def.size * 2.4);

    group.add(glow);
    group.add(mesh);

    return { def, group, mesh, clouds, atmosphere, mats, ringPulse, glow };
}

/** ── Photorealistic Whisper Orbit Traces ──────────────────────────────────── */
export function createOrbitRing(radius: number, tilt: number, color: number): THREE.Group {
    const g = new THREE.Group();
    const pts: THREE.Vector3[] = [];
    const segments = 160;
    for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.08 }),
    );
    g.add(line);
    g.rotation.x = tilt;
    return g;
}

/** ── Photorealistic Asteroid Belt ────────────────────────────────────────── */
export function createAsteroidBelt(def: BodyDef): THREE.InstancedMesh {
    const count = 380;
    const geo = new THREE.DodecahedronGeometry(0.9, 1);
    const mat = new THREE.MeshStandardMaterial({
        color: 0x5a5550,
        roughness: 0.95,
        metalness: 0.25,
        flatShading: true,
    });
    const inst = new THREE.InstancedMesh(geo, mat, count);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = def.orbitRadius + (Math.random() - 0.5) * 32;
        dummy.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 12, Math.sin(a) * r);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        dummy.scale.setScalar(0.3 + Math.random() * 1.5);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
    }
    return inst;
}

/** ── Deep Volumetric Cosmic Nebulae ──────────────────────────────────────── */
export function createNebulae(): THREE.Group {
    const g = new THREE.Group();
    const palette: [number, number, number][] = [
        [70, 25, 130],
        [15, 75, 110],
        [110, 20, 80],
    ];
    for (let i = 0; i < 7; i++) {
        const p = palette[i % palette.length];
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: makeRadialGlowTexture(p[0], p[1], p[2], 0.5),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            opacity: 0.18,
        }));
        const a = (i / 7) * Math.PI * 2 + 0.5;
        const r = 540 + (i % 3) * 200;
        sprite.position.set(Math.cos(a) * r, (i - 3.5) * 70, Math.sin(a) * r);
        sprite.scale.set(780 + i * 80, 480 + i * 50, 1);
        g.add(sprite);
    }
    return g;
}
