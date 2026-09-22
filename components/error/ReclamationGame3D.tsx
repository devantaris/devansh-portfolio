'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { reclamationAudio } from '@/lib/audio/reclamationAudio';

export interface BeaconItem {
  id: string;
  name: string;
  location: string;
  pos: [number, number, number];
  activated: boolean;
  color: number;
}

export interface TelemetryData {
  speed: number;
  altitude: number;
  heading: number;
  shields: number;
  empCooldown: number; // 0 to 1 (1 = ready)
  nearestDist: number;
  nearestName: string;
  zombieCount: number;
  zombiesChasing: number;
}

interface ReclamationGame3DProps {
  onActivateBeacon: (beacon: BeaconItem, index: number) => void;
  onEnterPortal: () => void;
  onUpdateTelemetry: (telemetry: TelemetryData) => void;
  onDamageTaken?: (shields: number) => void;
  isAudioActive: boolean;
  virtualInput?: { forward: number; turn: number; action: boolean; boost?: boolean };
}

interface ZombieState {
  mesh: THREE.Group;
  eyeMat: THREE.MeshBasicMaterial;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  speed: number;
  state: 'idle' | 'chase' | 'attack' | 'stunned';
  stunTimer: number;
  screeched: boolean;
  wanderAngle: number;
}

export default function ReclamationGame3D({
  onActivateBeacon,
  onEnterPortal,
  onUpdateTelemetry,
  onDamageTaken,
  virtualInput,
}: ReclamationGame3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Beacons state
  const beaconsRef = useRef<BeaconItem[]>([
    {
      id: 'ALPHA',
      name: 'SKYLINE OVERPASS BEACON',
      location: 'HIGHWAY RAMP // 0x404_A',
      pos: [-38, 4.5, -35],
      activated: false,
      color: 0x00e5ff,
    },
    {
      id: 'BETA',
      name: 'NEON PLAZA BEACON',
      location: 'CIVIC CENTER // 0x404_B',
      pos: [42, 1.8, -25],
      activated: false,
      color: 0x50fa7b,
    },
    {
      id: 'GAMMA',
      name: 'SUB-GRID TERMINAL BEACON',
      location: 'FLOODED CANAL // 0x404_C',
      pos: [-12, 1.8, 42],
      activated: false,
      color: 0xffb86c,
    },
  ]);

  const allActivatedRef = useRef(false);
  const shieldsRef = useRef(100);
  const empCooldownRef = useRef(1); // 1 = ready
  const lastDamageTimeRef = useRef(0);

  // Keyboard controls
  const keysRef = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    boost: boolean;
    action: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
    action: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.forward = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.backward = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;
      if (['ShiftLeft', 'ShiftRight'].includes(e.code)) keysRef.current.boost = true;
      if (['Space', 'KeyE'].includes(e.code)) keysRef.current.action = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.forward = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.backward = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
      if (['ShiftLeft', 'ShiftRight'].includes(e.code)) keysRef.current.boost = false;
      if (['Space', 'KeyE'].includes(e.code)) keysRef.current.action = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Three.js Engine initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020805, 0.012); // Cyberpunk rainy forest twilight mist

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500);
    camera.position.set(0, 8, 16);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x020603, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0d2618, 1.3);
    scene.add(ambientLight);

    const stormLight = new THREE.DirectionalLight(0xaad8ff, 1.4);
    stormLight.position.set(50, 70, 30);
    stormLight.castShadow = true;
    stormLight.shadow.mapSize.width = 1024;
    stormLight.shadow.mapSize.height = 1024;
    stormLight.shadow.camera.near = 10;
    stormLight.shadow.camera.far = 180;
    const sD = 80;
    stormLight.shadow.camera.left = -sD;
    stormLight.shadow.camera.right = sD;
    stormLight.shadow.camera.top = sD;
    stormLight.shadow.camera.bottom = -sD;
    scene.add(stormLight);

    const hemiLight = new THREE.HemisphereLight(0x194d33, 0x050d06, 0.8);
    scene.add(hemiLight);

    // 5. Overgrown Street Ground & Terrain
    const cityGroundSize = 240;
    const groundGeo = new THREE.PlaneGeometry(cityGroundSize, cityGroundSize, 64, 64);
    groundGeo.rotateX(-Math.PI / 2);

    const groundPos = groundGeo.attributes.position;
    const groundColors = new Float32Array(groundPos.count * 3);

    for (let i = 0; i < groundPos.count; i++) {
      const gx = groundPos.getX(i);
      const gz = groundPos.getZ(i);

      // Mild street topography with cracked asphalt rises
      const h = Math.sin(gx * 0.04) * Math.cos(gz * 0.04) * 1.5;
      groundPos.setY(i, h);

      // Cracked asphalt streets vs dense encroaching moss
      const streetGrid = Math.sin(gx * 0.1) * Math.cos(gz * 0.1);
      if (streetGrid > 0.3) {
        // Vibrant creeping moss
        groundColors[i * 3] = 0.1;
        groundColors[i * 3 + 1] = 0.42;
        groundColors[i * 3 + 2] = 0.18;
      } else if (streetGrid < -0.3) {
        // Flooded canal puddle / cyber slick
        groundColors[i * 3] = 0.02;
        groundColors[i * 3 + 1] = 0.28;
        groundColors[i * 3 + 2] = 0.32;
      } else {
        // Dark cracked asphalt
        groundColors[i * 3] = 0.08;
        groundColors[i * 3 + 1] = 0.11;
        groundColors[i * 3 + 2] = 0.09;
      }
    }

    groundGeo.setAttribute('color', new THREE.BufferAttribute(groundColors, 3));
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.2,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // 6. Overgrown Skyscraper Monoliths
    const buildingsGroup = new THREE.Group();
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x141816,
      roughness: 0.7,
      metalness: 0.6,
    });
    const vineMat = new THREE.MeshStandardMaterial({ color: 0x18422d, roughness: 0.9 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.2, metalness: 0.9, transparent: true, opacity: 0.35 });

    const buildingDefs: [number, number, number, number, number][] = [
      // [x, z, width, depth, height]
      [-55, -55, 18, 18, 42],
      [-55, 0, 16, 20, 36],
      [-55, 55, 18, 16, 40],
      [55, -55, 20, 18, 45],
      [55, 0, 16, 22, 38],
      [55, 55, 18, 18, 44],
      [-25, -65, 14, 14, 32],
      [25, -65, 14, 14, 30],
      [-25, 65, 14, 14, 28],
      [25, 65, 14, 14, 34],
      [-22, -22, 10, 10, 24],
      [22, -20, 12, 10, 26],
      [-20, 22, 10, 12, 22],
      [20, 24, 12, 12, 25],
    ];

    buildingDefs.forEach(([bx, bz, bw, bd, bh]) => {
      const bGeo = new THREE.BoxGeometry(bw, bh, bd);
      const building = new THREE.Mesh(bGeo, buildingMat);
      building.position.set(bx, bh / 2, bz);
      building.castShadow = true;
      building.receiveShadow = true;

      // Add broken glass window strips
      for (let f = 0; f < 4; f++) {
        const winGeo = new THREE.BoxGeometry(bw * 0.85, 1.2, bd + 0.1);
        const win = new THREE.Mesh(winGeo, glassMat);
        win.position.y = (f - 1.5) * (bh / 5);
        building.add(win);
      }

      // Add climbing vine clusters
      for (let v = 0; v < 3; v++) {
        const vGeo = new THREE.CylinderGeometry(0.2, 0.2, bh, 6);
        const vine = new THREE.Mesh(vGeo, vineMat);
        vine.position.set((v - 1) * (bw / 3), 0, bd / 2 + 0.2);
        building.add(vine);
      }

      buildingsGroup.add(building);
    });
    scene.add(buildingsGroup);

    // 7. Collapsed Elevated Highway Overpass
    const highwayGroup = new THREE.Group();
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1f2421, roughness: 0.8 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x151a17, roughness: 0.9 });

    // Highway segments
    const seg1 = new THREE.Mesh(new THREE.BoxGeometry(45, 1.5, 9), roadMat);
    seg1.position.set(-35, 5.5, -30);
    seg1.rotation.y = 0.2;
    highwayGroup.add(seg1);

    const seg2 = new THREE.Mesh(new THREE.BoxGeometry(40, 1.5, 9), roadMat);
    seg2.position.set(25, 4.5, -20);
    seg2.rotation.y = -0.15;
    highwayGroup.add(seg2);

    // Concrete pillars
    [-50, -35, -20, 10, 30, 45].forEach((px, idx) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 7, 8), pillarMat);
      pillar.position.set(px, 3.5, idx < 3 ? -30 : -20);
      highwayGroup.add(pillar);
    });

    scene.add(highwayGroup);

    // 8. The 3 Survival Beacons
    const beaconMeshes: {
      group: THREE.Group;
      item: BeaconItem;
      index: number;
      rings: THREE.Mesh[];
      laserPillar: THREE.Mesh;
      light: THREE.PointLight;
    }[] = [];

    beaconsRef.current.forEach((item, index) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(item.pos[0], item.pos[1], item.pos[2]);

      // Tower structure
      const towerGeo = new THREE.CylinderGeometry(0.8, 1.6, 6, 8);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0x232b26, roughness: 0.6, metalness: 0.7 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 3;
      tower.castShadow = true;
      bGroup.add(tower);

      // Rotating holographic rings
      const rings: THREE.Mesh[] = [];
      for (let r = 0; r < 2; r++) {
        const rGeo = new THREE.TorusGeometry(2.2 + r * 0.7, 0.08, 8, 32);
        const rMat = new THREE.MeshBasicMaterial({ color: item.color, transparent: true, opacity: 0.85 });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.position.y = 5.5;
        ring.rotation.x = Math.PI / 2;
        bGroup.add(ring);
        rings.push(ring);
      }

      // Skyward Laser Pillar (active on collection)
      const laserGeo = new THREE.CylinderGeometry(0.3, 0.3, 120, 8);
      const laserMat = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.25,
      });
      const laserPillar = new THREE.Mesh(laserGeo, laserMat);
      laserPillar.position.y = 60;
      bGroup.add(laserPillar);

      const bLight = new THREE.PointLight(item.color, 3.0, 18);
      bLight.position.y = 5.5;
      bGroup.add(bLight);

      scene.add(bGroup);
      beaconMeshes.push({ group: bGroup, item, index, rings, laserPillar, light: bLight });
    });

    // 9. Extraction Evacuation Gateway (North Gate)
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 7, -85);

    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(9, 1.2, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0x161e1a, roughness: 0.6, metalness: 0.8 })
    );
    portalGroup.add(arch);

    const portalVortex = new THREE.Mesh(
      new THREE.CircleGeometry(8.2, 32),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
    );
    portalGroup.add(portalVortex);

    const portalLight = new THREE.PointLight(0x00e5ff, 2.0, 35);
    portalGroup.add(portalLight);
    scene.add(portalGroup);

    // 10. Bio-Cyber Zombie Horde
    const zombieCount = 28;
    const zombies: ZombieState[] = [];

    const zombieChassisGeo = new THREE.BoxGeometry(1.0, 1.8, 0.7);
    const zombieMat = new THREE.MeshStandardMaterial({ color: 0x222623, roughness: 0.85 });
    const headGeo = new THREE.SphereGeometry(0.4, 12, 12);
    const armGeo = new THREE.BoxGeometry(0.3, 1.4, 0.3);

    for (let z = 0; z < zombieCount; z++) {
      const zGroup = new THREE.Group();

      // Body torso (hunched)
      const torso = new THREE.Mesh(zombieChassisGeo, zombieMat);
      torso.position.y = 1.2;
      torso.rotation.x = 0.2; // hunched forward
      torso.castShadow = true;
      zGroup.add(torso);

      // Head
      const head = new THREE.Mesh(headGeo, zombieMat);
      head.position.set(0, 2.2, 0.25);
      zGroup.add(head);

      // Glowing Crimson Optic Eyes
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1744 }); // Glowing red
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
      eyeL.position.set(0.14, 2.25, 0.6);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
      eyeR.position.set(-0.14, 2.25, 0.6);
      zGroup.add(eyeL);
      zGroup.add(eyeR);

      // Arms (reaching forward)
      const leftArm = new THREE.Mesh(armGeo, zombieMat);
      leftArm.position.set(-0.65, 1.4, 0.3);
      leftArm.rotation.x = -0.5;
      zGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, zombieMat);
      rightArm.position.set(0.65, 1.4, 0.3);
      rightArm.rotation.x = -0.5;
      zGroup.add(rightArm);

      // Spawn location spread out through streets and alleys
      const spawnAngle = Math.random() * Math.PI * 2;
      const spawnDist = Math.random() * 65 + 18;
      const zx = Math.cos(spawnAngle) * spawnDist;
      const zz = Math.sin(spawnAngle) * spawnDist;

      zGroup.position.set(zx, 0, zz);
      scene.add(zGroup);

      zombies.push({
        mesh: zGroup,
        eyeMat,
        leftArm,
        rightArm,
        pos: zGroup.position,
        velocity: new THREE.Vector3(),
        speed: Math.random() * 0.04 + 0.07, // Chase speed
        state: 'idle',
        stunTimer: 0,
        screeched: false,
        wanderAngle: Math.random() * Math.PI * 2,
      });
    }

    // 11. The Player Drone Model: RECLAIMER-04
    const drone = new THREE.Group();
    drone.position.set(0, 2.6, 0);

    const podGeo = new THREE.DodecahedronGeometry(0.95, 1);
    const podMat = new THREE.MeshStandardMaterial({ color: 0x212523, roughness: 0.5, metalness: 0.8 });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.castShadow = true;
    drone.add(pod);

    // Hazard stripe
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.15, 1.4),
      new THREE.MeshBasicMaterial({ color: 0xffaa00 })
    );
    stripe.position.y = 0.4;
    drone.add(stripe);

    // Camera eye lens
    const lens = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff })
    );
    lens.position.set(0, 0.1, 0.9);
    drone.add(lens);

    // Real-time dynamic spotlight
    const spotlight = new THREE.SpotLight(0xaaffff, 4.2, 55, Math.PI / 4.5, 0.35, 1.2);
    spotlight.position.set(0, 0.2, 0.6);
    spotlight.target.position.set(0, -0.6, 16);
    spotlight.castShadow = true;
    drone.add(spotlight);
    drone.add(spotlight.target);

    // Spinning rotors
    const rotorMeshes: THREE.Mesh[] = [];
    const rotorOffsets = [
      [1.4, 0.3, 1.2],
      [-1.4, 0.3, 1.2],
      [1.4, 0.3, -1.2],
      [-1.4, 0.3, -1.2],
    ];

    rotorOffsets.forEach(([rx, ry, rz]) => {
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 1.6, 6),
        new THREE.MeshStandardMaterial({ color: 0x111312 })
      );
      arm.position.set(rx * 0.5, ry * 0.5, rz * 0.5);
      arm.rotation.z = rx > 0 ? -Math.PI / 4 : Math.PI / 4;
      drone.add(arm);

      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.04, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.3 })
      );
      blade.position.set(rx, ry + 0.2, rz);
      drone.add(blade);
      rotorMeshes.push(blade);
    });

    // EMP Shockwave visual ring
    const empRingGeo = new THREE.RingGeometry(0.5, 1.2, 32);
    const empRingMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const empRing = new THREE.Mesh(empRingGeo, empRingMat);
    empRing.rotation.x = -Math.PI / 2;
    empRing.position.y = 0.2;
    drone.add(empRing);

    scene.add(drone);

    // Drone flight state
    let speed = 0;
    let yaw = 0;
    let roll = 0;
    let pitch = 0;
    let isEmpExpanding = false;
    let empRadius = 1;

    setIsLoaded(true);

    // 12. Main Game & AI Loop
    let animId: number;
    const clock = new THREE.Clock();
    let frame = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();
      frame++;

      // ── Process Player Inputs ──
      const keys = keysRef.current;
      const vInput = virtualInput;

      const isBoosting = keys.boost || vInput?.boost;
      const currentMaxSpeed = isBoosting ? 0.95 : 0.55;
      const currentAccel = isBoosting ? 0.045 : 0.026;

      const forwardInput = keys.forward ? 1 : keys.backward ? -1 : (vInput?.forward ?? 0);
      const turnInput = keys.left ? 1 : keys.right ? -1 : -(vInput?.turn ?? 0);
      const actionInput = keys.action || (vInput?.action ?? false);

      // Yaw rotation & speed
      yaw += turnInput * 0.038;
      if (forwardInput !== 0) {
        speed = Math.max(-currentMaxSpeed * 0.6, Math.min(currentMaxSpeed, speed + forwardInput * currentAccel));
      } else {
        speed *= 0.94;
      }

      // Banking physics
      roll = THREE.MathUtils.lerp(roll, -turnInput * 0.45, 0.12);
      pitch = THREE.MathUtils.lerp(pitch, -forwardInput * 0.35, 0.12);

      const forwardX = Math.sin(yaw);
      const forwardZ = Math.cos(yaw);
      drone.position.x += forwardX * speed;
      drone.position.z += forwardZ * speed;
      drone.position.y = 2.4 + Math.sin(time * 3.2) * 0.15;

      drone.rotation.y = yaw;
      drone.rotation.z = roll;
      drone.rotation.x = pitch;

      // Sector bounds
      const cityBound = 100;
      drone.position.x = Math.max(-cityBound, Math.min(cityBound, drone.position.x));
      drone.position.z = Math.max(-cityBound, Math.min(cityBound, drone.position.z));

      // Rotor animation
      const rotorSpeed = 0.5 + Math.abs(speed) * 2.0;
      rotorMeshes.forEach((blade, i) => {
        blade.rotation.y += (i % 2 === 0 ? 1 : -1) * rotorSpeed;
      });

      // Third person follow camera
      const camDist = 9.8;
      const camHeight = 4.4;
      const targetCam = new THREE.Vector3(
        drone.position.x - forwardX * camDist,
        drone.position.y + camHeight,
        drone.position.z - forwardZ * camDist
      );
      camera.position.lerp(targetCam, 0.08);

      const lookTarget = new THREE.Vector3(
        drone.position.x + forwardX * 6,
        drone.position.y + 0.6,
        drone.position.z + forwardZ * 6
      );
      camera.lookAt(lookTarget);

      // ── EMP Shockwave Blast ──
      empCooldownRef.current = Math.min(1, empCooldownRef.current + delta * 0.25); // 4s cooldown

      if (actionInput && empCooldownRef.current >= 1 && !isEmpExpanding) {
        empCooldownRef.current = 0;
        isEmpExpanding = true;
        empRadius = 1;
        empRingMat.opacity = 0.95;
        reclamationAudio.playEmpBlast();

        // Blast nearby zombies
        zombies.forEach((z) => {
          const dist = drone.position.distanceTo(z.pos);
          if (dist < 18) {
            z.state = 'stunned';
            z.stunTimer = 3.5;
            z.eyeMat.color.setHex(0x00e5ff); // Stunned cyan eyes
            // Knockback vector
            const kb = z.pos.clone().sub(drone.position).normalize().multiplyScalar(10);
            z.velocity.add(kb);
          }
        });
      }

      if (isEmpExpanding) {
        empRadius += delta * 35;
        empRing.scale.set(empRadius, empRadius, 1);
        empRingMat.opacity *= 0.91;
        if (empRingMat.opacity <= 0.03) {
          isEmpExpanding = false;
          empRingMat.opacity = 0;
        }
      }

      // ── Shield Regeneration ──
      if (time - lastDamageTimeRef.current > 3.0) {
        shieldsRef.current = Math.min(100, shieldsRef.current + delta * 5.0);
      }

      // ── Zombie AI & Flocking Loop ──
      let chasingCount = 0;
      zombies.forEach((z, idx) => {
        // Friction on knockback velocity
        z.pos.add(z.velocity.clone().multiplyScalar(delta));
        z.velocity.multiplyScalar(0.88);

        const distToDrone = drone.position.distanceTo(z.pos);

        // Stunned countdown
        if (z.state === 'stunned') {
          z.stunTimer -= delta;
          z.leftArm.rotation.x = Math.sin(time * 20) * 0.2;
          z.rightArm.rotation.x = Math.sin(time * 20) * 0.2;
          if (z.stunTimer <= 0) {
            z.state = 'idle';
            z.eyeMat.color.setHex(0xff1744); // Red eyes back
          }
          return;
        }

        // Agro trigger: within 28m or spotlight illuminates them
        const isNear = distToDrone < 28;
        if (isNear) {
          z.state = 'chase';
          chasingCount++;

          if (!z.screeched && Math.random() < 0.15) {
            z.screeched = true;
            reclamationAudio.playZombieScreech();
          }

          // Steer towards drone
          const dir = drone.position.clone().sub(z.pos);
          dir.y = 0;
          dir.normalize();

          // Flocking separation with other zombies
          const separation = new THREE.Vector3();
          zombies.forEach((other, oIdx) => {
            if (idx !== oIdx) {
              const d = z.pos.distanceTo(other.pos);
              if (d < 3.2 && d > 0) {
                separation.add(z.pos.clone().sub(other.pos).normalize().multiplyScalar((3.2 - d) * 0.8));
              }
            }
          });

          dir.add(separation).normalize();

          // Move zombie
          z.pos.add(dir.multiplyScalar(z.speed * (distToDrone < 8 ? 1.4 : 1.0)));
          z.mesh.lookAt(new THREE.Vector3(drone.position.x, z.pos.y, drone.position.z));

          // Arm running animation
          z.leftArm.rotation.x = -0.5 + Math.sin(time * 8 + idx) * 0.6;
          z.rightArm.rotation.x = -0.5 - Math.sin(time * 8 + idx) * 0.6;

          // Attack swipe if close (< 3.2m)
          if (distToDrone < 3.4) {
            shieldsRef.current = Math.max(0, shieldsRef.current - delta * 22);
            lastDamageTimeRef.current = time;
            if (onDamageTaken) onDamageTaken(Math.round(shieldsRef.current));
            if (frame % 20 === 0) reclamationAudio.playShieldHit();
          }
        } else {
          z.state = 'idle';
          z.screeched = false;
          // Gentle idle shuffle
          z.wanderAngle += (Math.random() - 0.5) * 0.1;
          z.pos.x += Math.cos(z.wanderAngle) * 0.02;
          z.pos.z += Math.sin(z.wanderAngle) * 0.02;
        }

        // Keep zombies in city
        z.pos.x = Math.max(-cityBound, Math.min(cityBound, z.pos.x));
        z.pos.z = Math.max(-cityBound, Math.min(cityBound, z.pos.z));
      });

      // ── Beacon Logic & Activation Check ──
      let nearestDist = 9999;
      let nearestName = 'SCANNING...';

      beaconMeshes.forEach(({ group, item, index, rings, laserPillar, light }) => {
        rings[0].rotation.z += 0.03;
        rings[1].rotation.y += 0.02;

        const dist = drone.position.distanceTo(group.position);
        if (!item.activated && dist < nearestDist) {
          nearestDist = dist;
          nearestName = `${item.id}: ${item.name}`;
        }

        // Activation trigger: near or EMP blast near beacon
        if (!item.activated && (dist < 4.8 || (dist < 16 && isEmpExpanding))) {
          item.activated = true;
          beaconsRef.current[index].activated = true;
          reclamationAudio.playBeaconLaser();
          onActivateBeacon(item, index);

          // Ignite skyward laser beam
          laserPillar.scale.set(3.5, 1, 3.5);
          (laserPillar.material as THREE.MeshBasicMaterial).opacity = 0.95;
          light.intensity = 8.0;

          // Seismic beacon EMP clears surrounding zombies
          zombies.forEach((z) => {
            if (group.position.distanceTo(z.pos) < 26) {
              z.state = 'stunned';
              z.stunTimer = 5.0;
              z.velocity.add(z.pos.clone().sub(group.position).normalize().multiplyScalar(16));
            }
          });

          // Check if all 3 beacons activated
          const remaining = beaconsRef.current.filter((b) => !b.activated).length;
          if (remaining === 0 && !allActivatedRef.current) {
            allActivatedRef.current = true;
            reclamationAudio.playWarpPortalSound();
            (portalVortex.material as THREE.MeshBasicMaterial).color.setHex(0x50fa7b);
            (portalVortex.material as THREE.MeshBasicMaterial).opacity = 0.9;
            portalLight.intensity = 7.0;
            portalLight.color.setHex(0x50fa7b);
          }
        }
      });

      // ── Check Portal Entry ──
      if (allActivatedRef.current) {
        portalVortex.rotation.z += 0.04;
        if (drone.position.distanceTo(portalGroup.position) < 9.5) {
          onEnterPortal();
        }
      }

      // ── Send Telemetry to HUD ──
      if (frame % 4 === 0) {
        onUpdateTelemetry({
          speed: Math.abs(speed) * 55,
          altitude: drone.position.y,
          heading: Math.round(((yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) * (180 / Math.PI)),
          shields: Math.round(shieldsRef.current),
          empCooldown: empCooldownRef.current,
          nearestDist: Math.round(nearestDist),
          nearestName,
          zombieCount,
          zombiesChasing: chasingCount,
        });
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onActivateBeacon, onEnterPortal, onUpdateTelemetry, onDamageTaken, virtualInput]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-screen overflow-hidden bg-[#020503]"
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#010603] z-50">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin mb-4" />
          <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase">
            CALIBRATING ZOMBIE ARENA & CYBER RUINS...
          </span>
        </div>
      )}
    </div>
  );
}
