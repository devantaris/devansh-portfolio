'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { reclamationAudio } from '@/lib/audio/reclamationAudio';

export interface DiskItem {
  id: string;
  name: string;
  tag: string;
  pos: [number, number, number];
  collected: boolean;
  color: number;
}

export interface TelemetryData {
  speed: number;
  altitude: number;
  heading: number;
  nearestDist: number;
  nearestName: string;
}

interface ReclamationGame3DProps {
  onCollectDisk: (disk: DiskItem, index: number) => void;
  onEnterPortal: () => void;
  onUpdateTelemetry: (telemetry: TelemetryData) => void;
  isAudioActive: boolean;
  virtualInput?: { forward: number; turn: number; action: boolean };
}

export default function ReclamationGame3D({
  onCollectDisk,
  onEnterPortal,
  onUpdateTelemetry,
  virtualInput,
}: ReclamationGame3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistent game state refs
  const disksRef = useRef<DiskItem[]>([
    {
      id: '/dev/sda',
      name: 'KERNEL BIOS CORE',
      tag: '0x00404_VFS',
      pos: [-32, 1.8, -18],
      collected: false,
      color: 0x00e5ff, // Cyan
    },
    {
      id: '/dev/sdb',
      name: 'INODE ROUTE TABLE',
      tag: '0x00404_ROUTE',
      pos: [36, 1.8, -38],
      collected: false,
      color: 0x50fa7b, // Emerald
    },
    {
      id: '/dev/sdc',
      name: 'QUANTUM NEURAL CACHE',
      tag: '0x00404_NEURAL',
      pos: [-10, 1.8, 32],
      collected: false,
      color: 0xffb86c, // Amber gold
    },
  ]);

  const allCollectedRef = useRef(false);

  // Input states
  const keysRef = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    action: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
  });

  // Setup keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.forward = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.backward = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;
      if (['Space', 'KeyE'].includes(e.code)) keysRef.current.action = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.forward = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.backward = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
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
    scene.fog = new THREE.FogExp2(0x020704, 0.011); // Dense forest twilight fog

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 500);
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
    const ambientLight = new THREE.AmbientLight(0x0a2414, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeaaf, 1.6);
    sunLight.position.set(40, 60, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    const shadowD = 70;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x194d33, 0x050d06, 0.7);
    scene.add(hemiLight);

    // 5. Procedural Undulating Terrain
    const terrainSize = 220;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Gentle rolling hill topography
      const h =
        Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2.2 +
        Math.sin(x * 0.1 + 1.2) * Math.cos(z * 0.08) * 1.1;
      posAttr.setY(i, h);

      // Vertex color palette: rich forest soil with moss and bioluminescent patches
      const mossFactor = Math.sin(x * 0.15) * Math.cos(z * 0.15);
      if (mossFactor > 0.4) {
        // Bright emerald moss
        colors[i * 3] = 0.12;
        colors[i * 3 + 1] = 0.42;
        colors[i * 3 + 2] = 0.22;
      } else if (mossFactor < -0.4) {
        // Bioluminescent lichen cyan
        colors[i * 3] = 0.04;
        colors[i * 3 + 1] = 0.32;
        colors[i * 3 + 2] = 0.35;
      } else {
        // Dark decaying soil
        colors[i * 3] = 0.06;
        colors[i * 3 + 1] = 0.12;
        colors[i * 3 + 2] = 0.08;
      }
    }

    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.9,
      metalness: 0.1,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 6. Overgrown Server Monoliths
    const monolithGroup = new THREE.Group();
    const serverGeo = new THREE.BoxGeometry(3.5, 9, 2.5);
    const serverMat = new THREE.MeshStandardMaterial({
      color: 0x181c1a,
      roughness: 0.7,
      metalness: 0.7,
    });

    const ledMatCyan = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const ledMatAmber = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const ledMatGreen = new THREE.MeshBasicMaterial({ color: 0x50fa7b });

    const monolithPositions: [number, number, number, number][] = [
      [-18, 4.5, -28, 0.12],
      [-22, 4.2, -32, -0.22],
      [-14, 4.0, -36, 0.05],
      [20, 4.5, -25, -0.15],
      [26, 4.2, -30, 0.18],
      [16, 4.5, -42, 0.28],
      [-42, 4.5, -5, -0.32],
      [-38, 4.2, 8, 0.15],
      [40, 4.5, 0, 0.25],
      [36, 4.2, 14, -0.1],
      [-24, 4.5, 28, 0.18],
      [22, 4.5, 32, -0.24],
      [-8, 4.5, -55, 0.08],
      [8, 4.5, -58, -0.12],
    ];

    monolithPositions.forEach(([x, y, z, tilt]) => {
      const monolith = new THREE.Mesh(serverGeo, serverMat);
      monolith.position.set(x, y, z);
      monolith.rotation.z = tilt;
      monolith.rotation.y = Math.random() * Math.PI;
      monolith.castShadow = true;
      monolith.receiveShadow = true;

      // Add blinking LED strips
      for (let row = 0; row < 5; row++) {
        const ledGeo = new THREE.BoxGeometry(2.4, 0.15, 0.05);
        const mat = row % 3 === 0 ? ledMatCyan : row % 3 === 1 ? ledMatGreen : ledMatAmber;
        const led = new THREE.Mesh(ledGeo, mat);
        led.position.set(0, 3.2 - row * 1.4, 1.28);
        monolith.add(led);
      }

      // Add climbing vine cylinders
      const vineMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.9 });
      for (let v = 0; v < 3; v++) {
        const vineGeo = new THREE.CylinderGeometry(0.12, 0.12, 8.5, 6);
        const vine = new THREE.Mesh(vineGeo, vineMat);
        vine.position.set((v - 1) * 1.1, 0, 1.25);
        vine.rotation.z = (v - 1) * 0.1;
        monolith.add(vine);
      }

      monolithGroup.add(monolith);
    });
    scene.add(monolithGroup);

    // 7. Giant Central CRT Monument
    const crtMonument = new THREE.Group();
    crtMonument.position.set(0, 5.5, -45);

    const crtChassisGeo = new THREE.BoxGeometry(10, 7.5, 6);
    const crtChassisMat = new THREE.MeshStandardMaterial({
      color: 0x151817,
      roughness: 0.8,
      metalness: 0.5,
    });
    const crtChassis = new THREE.Mesh(crtChassisGeo, crtChassisMat);
    crtChassis.castShadow = true;
    crtMonument.add(crtChassis);

    // CRT Screen with dynamic canvas
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 256;
    const screenCtx = screenCanvas.getContext('2d');

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });
    const screenGeo = new THREE.PlaneGeometry(8.2, 5.8);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0, 3.02);
    crtMonument.add(screenMesh);

    // CRT Glow light
    const crtLight = new THREE.PointLight(0x50fa7b, 2.5, 24);
    crtLight.position.set(0, 0, 4.5);
    crtMonument.add(crtLight);

    scene.add(crtMonument);

    // 8. Ancient Warp Gateway (The Return Portal)
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 7, -80);

    const archPillars = new THREE.Mesh(
      new THREE.TorusGeometry(8, 0.9, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0x1a211e, roughness: 0.6, metalness: 0.8 })
    );
    portalGroup.add(archPillars);

    // Swirling portal vortex disk
    const vortexGeo = new THREE.CircleGeometry(7.2, 32);
    const vortexMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const vortexMesh = new THREE.Mesh(vortexGeo, vortexMat);
    portalGroup.add(vortexMesh);

    const portalLight = new THREE.PointLight(0x00e5ff, 1.5, 30);
    portalGroup.add(portalLight);

    scene.add(portalGroup);

    // 9. Collectible Memory Disks (`/dev/sda`, `/dev/sdb`, `/dev/sdc`)
    const diskMeshes: {
      group: THREE.Group;
      beaconRing: THREE.Mesh;
      light: THREE.PointLight;
      item: DiskItem;
      index: number;
    }[] = [];

    disksRef.current.forEach((item, index) => {
      const diskGroup = new THREE.Group();
      diskGroup.position.set(item.pos[0], item.pos[1], item.pos[2]);

      // Magnetic Platter
      const platterGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32);
      const platterMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37, // Gold/bronze platter
        metalness: 0.95,
        roughness: 0.2,
      });
      const platter = new THREE.Mesh(platterGeo, platterMat);
      platter.castShadow = true;
      diskGroup.add(platter);

      // Rotating holographic beacon ring
      const ringGeo = new THREE.TorusGeometry(2.4, 0.08, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.85,
      });
      const beaconRing = new THREE.Mesh(ringGeo, ringMat);
      beaconRing.rotation.x = Math.PI / 2;
      diskGroup.add(beaconRing);

      // Vertical beacon light shaft
      const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 14, 8);
      const shaftMat = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.35,
      });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.position.y = 7;
      diskGroup.add(shaft);

      // Local beacon point light
      const light = new THREE.PointLight(item.color, 2.5, 12);
      light.position.y = 1.2;
      diskGroup.add(light);

      scene.add(diskGroup);
      diskMeshes.push({ group: diskGroup, beaconRing, light, item, index });
    });

    // 10. Bioluminescent Mushrooms & Firefly Particles
    const sporeCount = 280;
    const sporeGeo = new THREE.BufferGeometry();
    const sporePositions = new Float32Array(sporeCount * 3);

    for (let i = 0; i < sporeCount; i++) {
      sporePositions[i * 3] = (Math.random() - 0.5) * 180;
      sporePositions[i * 3 + 1] = Math.random() * 18 + 0.5;
      sporePositions[i * 3 + 2] = (Math.random() - 0.5) * 180;
    }
    sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePositions, 3));

    const sporeMat = new THREE.PointsMaterial({
      color: 0x50fa7b,
      size: 0.45,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const sporePoints = new THREE.Points(sporeGeo, sporeMat);
    scene.add(sporePoints);

    // 11. The Player Drone Model: RECLAIMER-04
    const drone = new THREE.Group();
    drone.position.set(0, 2.5, 0);

    // Central Pod
    const podGeo = new THREE.DodecahedronGeometry(0.9, 1);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0x242826,
      roughness: 0.5,
      metalness: 0.8,
    });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.castShadow = true;
    drone.add(pod);

    // Hazard stripes banner
    const stripeGeo = new THREE.BoxGeometry(0.8, 0.15, 1.4);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.y = 0.4;
    drone.add(stripe);

    // Front glowing optical camera lens
    const lensGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, 0.1, 0.85);
    drone.add(lens);

    // Dynamic Drone Spotlight pointing forward
    const droneSpotlight = new THREE.SpotLight(0xccffff, 4.0, 48, Math.PI / 5, 0.35, 1.2);
    droneSpotlight.position.set(0, 0.2, 0.6);
    droneSpotlight.target.position.set(0, -0.5, 14);
    droneSpotlight.castShadow = true;
    droneSpotlight.shadow.bias = -0.002;
    drone.add(droneSpotlight);
    drone.add(droneSpotlight.target);

    // Rotor arms & spinning rotors
    const rotorMeshes: THREE.Mesh[] = [];
    const rotorOffsets = [
      [1.4, 0.3, 1.2],
      [-1.4, 0.3, 1.2],
      [1.4, 0.3, -1.2],
      [-1.4, 0.3, -1.2],
    ];

    rotorOffsets.forEach(([rx, ry, rz]) => {
      // Carbon arm
      const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.6, 6);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x111312, roughness: 0.8 });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(rx * 0.5, ry * 0.5, rz * 0.5);
      arm.rotation.z = rx > 0 ? -Math.PI / 4 : Math.PI / 4;
      drone.add(arm);

      // Motor hub
      const hubGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 12);
      const hub = new THREE.Mesh(hubGeo, podMat);
      hub.position.set(rx, ry, rz);
      drone.add(hub);

      // Rotor blades
      const bladeGeo = new THREE.BoxGeometry(1.5, 0.03, 0.18);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.3 });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(rx, ry + 0.18, rz);
      drone.add(blade);
      rotorMeshes.push(blade);
    });

    scene.add(drone);

    // Drone flight physics state
    let speed = 0;
    let yaw = 0;
    let roll = 0;
    let pitch = 0;
    const maxSpeed = 0.55;
    const turnSpeed = 0.038;
    const accel = 0.025;
    const friction = 0.94;

    // Pulse scanner visual ring
    const scanRingGeo = new THREE.RingGeometry(0.5, 0.8, 32);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.rotation.x = -Math.PI / 2;
    scanRing.position.y = 0.2;
    drone.add(scanRing);
    let scanRingScale = 1;
    let isScanning = false;

    setIsLoaded(true);

    // 12. Main Animation & Game Loop
    let animId: number;
    let clock = new THREE.Clock();
    let frame = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();
      frame++;

      // ── Process Controls ──
      const keys = keysRef.current;
      const vInput = virtualInput;

      const forwardInput = keys.forward ? 1 : keys.backward ? -1 : (vInput?.forward ?? 0);
      const turnInput = keys.left ? 1 : keys.right ? -1 : -(vInput?.turn ?? 0);
      const actionInput = keys.action || (vInput?.action ?? false);

      // Yaw rotation
      yaw += turnInput * turnSpeed;

      // Acceleration & speed
      if (forwardInput !== 0) {
        speed = Math.max(-maxSpeed * 0.6, Math.min(maxSpeed, speed + forwardInput * accel));
      } else {
        speed *= friction;
      }

      // Smooth banking roll & tilt pitch
      roll = THREE.MathUtils.lerp(roll, -turnInput * 0.45, 0.12);
      pitch = THREE.MathUtils.lerp(pitch, -forwardInput * 0.35, 0.12);

      // Move drone along current yaw heading
      const forwardX = Math.sin(yaw);
      const forwardZ = Math.cos(yaw);
      drone.position.x += forwardX * speed;
      drone.position.z += forwardZ * speed;

      // Natural hover oscillation
      const baseAltitude = 2.4;
      drone.position.y = baseAltitude + Math.sin(time * 3.2) * 0.14;

      // Apply rotation to drone mesh
      drone.rotation.y = yaw;
      drone.rotation.z = roll;
      drone.rotation.x = pitch;

      // Keep within sector boundaries
      const bound = 90;
      drone.position.x = Math.max(-bound, Math.min(bound, drone.position.x));
      drone.position.z = Math.max(-bound, Math.min(bound, drone.position.z));

      // Spin rotors faster when moving
      const rotorSpeed = 0.5 + Math.abs(speed) * 1.5;
      rotorMeshes.forEach((blade, i) => {
        blade.rotation.y += (i % 2 === 0 ? 1 : -1) * rotorSpeed;
      });

      // ── Third-Person Follow Camera ──
      const camDist = 9.5;
      const camHeight = 4.2;
      const targetCamX = drone.position.x - forwardX * camDist;
      const targetCamZ = drone.position.z - forwardZ * camDist;
      const targetCamY = drone.position.y + camHeight;

      camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.08);

      // Smooth camera look-ahead
      const lookAhead = 6;
      const targetLook = new THREE.Vector3(
        drone.position.x + forwardX * lookAhead,
        drone.position.y + 0.5,
        drone.position.z + forwardZ * lookAhead
      );
      camera.lookAt(targetLook);

      // ── Interactive Scanner Pulse ──
      if (actionInput && !isScanning) {
        isScanning = true;
        scanRingScale = 1;
        scanRingMat.opacity = 0.9;
        reclamationAudio.playScannerPing(true);
      }

      if (isScanning) {
        scanRingScale += 0.8;
        scanRing.scale.set(scanRingScale, scanRingScale, 1);
        scanRingMat.opacity *= 0.92;
        if (scanRingMat.opacity <= 0.04) {
          isScanning = false;
          scanRingMat.opacity = 0;
        }
      }

      // ── Animate CRT Screen Canvas ──
      if (frame % 8 === 0 && screenCtx) {
        screenCtx.fillStyle = '#011206';
        screenCtx.fillRect(0, 0, 512, 256);

        screenCtx.fillStyle = '#50fa7b';
        screenCtx.font = 'bold 22px monospace';
        screenCtx.fillText('STDERR // FILE DESCRIPTOR 2', 24, 38);

        screenCtx.font = '16px monospace';
        screenCtx.fillStyle = '#8be9fd';
        screenCtx.fillText(`DRONE POS: [${drone.position.x.toFixed(1)}, ${drone.position.z.toFixed(1)}]`, 24, 75);
        screenCtx.fillText(`SPEED: ${(Math.abs(speed) * 45).toFixed(1)} km/h`, 24, 102);

        const remaining = disksRef.current.filter((d) => !d.collected).length;
        screenCtx.fillStyle = remaining === 0 ? '#50fa7b' : '#ffb86c';
        screenCtx.fillText(`LOST MEMORY BLOCKS: ${3 - remaining} / 3 SALVAGED`, 24, 138);

        if (remaining === 0) {
          screenCtx.fillStyle = '#50fa7b';
          screenCtx.fillText('STATUS: PORTAL RESTORED. FLY TO GATEWAY.', 24, 175);
        } else {
          screenCtx.fillStyle = '#ff5555';
          screenCtx.fillText('KERNEL PANIC: ROUTE MISSING IN FOLIAGE', 24, 175);
        }

        // Draw scanlines on the canvas
        screenCtx.fillStyle = 'rgba(0,0,0,0.25)';
        for (let y = 0; y < 256; y += 4) {
          screenCtx.fillRect(0, y, 512, 2);
        }

        screenTexture.needsUpdate = true;
      }

      // ── Disk Logic & Proximity Check ──
      let nearestDist = 9999;
      let nearestName = 'SCANNING...';

      diskMeshes.forEach(({ group, beaconRing, light, item, index }) => {
        if (!item.collected) {
          // Rotate beacon rings
          beaconRing.rotation.z += 0.04;
          beaconRing.rotation.y += 0.02;
          group.position.y = item.pos[1] + Math.sin(time * 2.5 + index) * 0.3;

          const dx = drone.position.x - group.position.x;
          const dz = drone.position.z - group.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist < nearestDist) {
            nearestDist = dist;
            nearestName = `${item.id} (${item.name})`;
          }

          // Collection trigger: within 3.8 units or within 6 units while pulse scanning
          if (dist < 3.8 || (dist < 6.5 && isScanning)) {
            item.collected = true;
            disksRef.current[index].collected = true;
            group.visible = false;
            reclamationAudio.playCollectSound();
            onCollectDisk(item, index);

            // Check if all collected
            const remainingCount = disksRef.current.filter((d) => !d.collected).length;
            if (remainingCount === 0 && !allCollectedRef.current) {
              allCollectedRef.current = true;
              reclamationAudio.playWarpPortalSound();
              vortexMat.color.setHex(0x50fa7b);
              vortexMat.opacity = 0.85;
              portalLight.intensity = 6.0;
              portalLight.color.setHex(0x50fa7b);
            }
          }
        }
      });

      // ── Check Portal Entry (Victory) ──
      if (allCollectedRef.current) {
        vortexMesh.rotation.z += 0.05;
        const pDx = drone.position.x - portalGroup.position.x;
        const pDz = drone.position.z - portalGroup.position.z;
        const pDist = Math.sqrt(pDx * pDx + pDz * pDz);

        if (pDist < 9.0) {
          onEnterPortal();
        }
      }

      // ── Drift Spores & Fireflies ──
      const pAttr = sporeGeo.attributes.position;
      for (let i = 0; i < sporeCount; i++) {
        let py = pAttr.getY(i) + 0.025;
        if (py > 20) py = 0.5;
        pAttr.setY(i, py);
      }
      pAttr.needsUpdate = true;

      // ── Send Telemetry to HUD ──
      if (frame % 4 === 0) {
        onUpdateTelemetry({
          speed: Math.abs(speed) * 45, // km/h
          altitude: drone.position.y,
          heading: Math.round(((yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) * (180 / Math.PI)),
          nearestDist: Math.round(nearestDist),
          nearestName,
        });
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(render);

    // Window resize handler
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
  }, [onCollectDisk, onEnterPortal, onUpdateTelemetry, virtualInput]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-screen overflow-hidden bg-[#020503]"
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#010603] z-50">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin mb-4" />
          <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase">
            CALIBRATING 3D BIO-TELEMETRY RUINS...
          </span>
        </div>
      )}
    </div>
  );
}
