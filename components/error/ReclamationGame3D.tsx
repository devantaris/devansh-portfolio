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

  // Beacons state in the morning suburban town
  const beaconsRef = useRef<BeaconItem[]>([
    {
      id: 'ALPHA',
      name: 'TOWN SQUARE PLAZA',
      location: 'CLOCKTOWER AVENUE // 0x404_A',
      pos: [-35, 3.5, -28],
      activated: false,
      color: 0x00b4d8, // Morning sky cyan
    },
    {
      id: 'BETA',
      name: 'SUBURBAN CUL-DE-SAC',
      location: 'OVERGROWN COTTAGES // 0x404_B',
      pos: [38, 2.0, -18],
      activated: false,
      color: 0x2ec4b6, // Emerald mint
    },
    {
      id: 'GAMMA',
      name: 'HILLSIDE OVERLOOK',
      location: 'HIGHWAY VIEWPOINT // 0x404_C',
      pos: [-14, 2.5, 42],
      activated: false,
      color: 0xff9f1c, // Golden dawn amber
    },
  ]);

  const allActivatedRef = useRef(false);
  const shieldsRef = useRef(100);
  const empCooldownRef = useRef(1);
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

  // Three.js Scene Setup (Morning Light Mode)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene & Morning Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaed9e0); // Crisp morning sky blue
    scene.fog = new THREE.FogExp2(0xb8e0d2, 0.0075); // Soft morning haze

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 500);
    camera.position.set(0, 8, 16);

    // 3. Renderer (Light Mode Tone Mapping)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0xaed9e0, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 4. Morning Sunlight & Ambient Fill
    const ambientLight = new THREE.AmbientLight(0xe8f5e9, 1.4); // Fresh morning dew green fill
    scene.add(ambientLight);

    const morningSun = new THREE.DirectionalLight(0xfff4d6, 2.8); // Radiant morning golden sun
    morningSun.position.set(75, 48, -50);
    morningSun.castShadow = true;
    morningSun.shadow.mapSize.width = 1024;
    morningSun.shadow.mapSize.height = 1024;
    morningSun.shadow.camera.near = 10;
    morningSun.shadow.camera.far = 190;
    const sD = 85;
    morningSun.shadow.camera.left = -sD;
    morningSun.shadow.camera.right = sD;
    morningSun.shadow.camera.top = sD;
    morningSun.shadow.camera.bottom = -sD;
    scene.add(morningSun);

    const hemiLight = new THREE.HemisphereLight(0xaed9e0, 0x52b788, 1.1); // Morning azure sky + vibrant grass bounce
    scene.add(hemiLight);

    // 5. Ground, Pathways & Roads
    const townSize = 240;
    const terrainGeo = new THREE.PlaneGeometry(townSize, townSize, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);

    for (let i = 0; i < posAttr.count; i++) {
      const gx = posAttr.getX(i);
      const gz = posAttr.getZ(i);

      // Gentle undulating hills & roads
      const h = Math.sin(gx * 0.035) * Math.cos(gz * 0.035) * 1.6;
      posAttr.setY(i, h);

      // Roadway coordinates
      const isMainRoad = Math.abs(gx) < 6 && gz > -80 && gz < 80;
      const isCrossRoad = Math.abs(gz) < 6 && gx > -80 && gx < 80;
      const isPathway = Math.abs(gx - 25) < 2.5 || Math.abs(gx + 25) < 2.5;

      if (isMainRoad || isCrossRoad) {
        // Cracked asphalt road
        colors[i * 3] = 0.22;
        colors[i * 3 + 1] = 0.25;
        colors[i * 3 + 2] = 0.24;
      } else if (isPathway) {
        // Cobblestone pedestrian path
        colors[i * 3] = 0.58;
        colors[i * 3 + 1] = 0.62;
        colors[i * 3 + 2] = 0.56;
      } else {
        // Lush green grass with clover
        colors[i * 3] = 0.24;
        colors[i * 3 + 1] = 0.62;
        colors[i * 3 + 2] = 0.32;
      }
    }

    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.8,
      metalness: 0.1,
    });
    const townTerrain = new THREE.Mesh(terrainGeo, terrainMat);
    townTerrain.receiveShadow = true;
    scene.add(townTerrain);

    // 6. Residential Houses & "House Stuff" (Suburban Neighborhood)
    const housesGroup = new THREE.Group();

    const wallMats = [
      new THREE.MeshStandardMaterial({ color: 0xeae2b7, roughness: 0.7 }), // Cream clapboard
      new THREE.MeshStandardMaterial({ color: 0xd8e2dc, roughness: 0.7 }), // Pale morning sage
      new THREE.MeshStandardMaterial({ color: 0xf4a261, roughness: 0.75 }), // Warm brick terracotta
      new THREE.MeshStandardMaterial({ color: 0xffe5d9, roughness: 0.7 }), // Sunlit rose
    ];

    const roofMats = [
      new THREE.MeshStandardMaterial({ color: 0x9d0208, roughness: 0.6 }), // Terracotta roof
      new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.6 }), // Dark slate shingle
      new THREE.MeshStandardMaterial({ color: 0x6c757d, roughness: 0.65 }), // Weathered grey slate
    ];

    const woodTrimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const ivyMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.9 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x90e0ef, roughness: 0.1, metalness: 0.9 });

    // Procedural House Generator
    const createHouse = (x: number, z: number, rotation: number, scale = 1, styleIdx = 0) => {
      const house = new THREE.Group();
      house.position.set(x, 0, z);
      house.rotation.y = rotation;
      house.scale.set(scale, scale, scale);

      const hw = 9;
      const hd = 7.5;
      const hh = 4.8;

      // 1. House main body
      const bodyGeo = new THREE.BoxGeometry(hw, hh, hd);
      const bodyMat = wallMats[styleIdx % wallMats.length];
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = hh / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      house.add(body);

      // 2. Pitched Gabled Roof
      const roofGeo = new THREE.ConeGeometry(hw * 0.72, 3.4, 4);
      const roofMat = roofMats[styleIdx % roofMats.length];
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = hh + 1.7;
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(1.1, 1, 0.9);
      roof.castShadow = true;
      roof.receiveShadow = true;
      house.add(roof);

      // 3. Front Porch with pillars & overhang
      const porchRoofGeo = new THREE.BoxGeometry(5.2, 0.4, 2.6);
      const porchRoof = new THREE.Mesh(porchRoofGeo, roofMat);
      porchRoof.position.set(0, 3.1, hd / 2 + 1.2);
      porchRoof.castShadow = true;
      house.add(porchRoof);

      [-2.1, 2.1].forEach((px) => {
        const pillarGeo = new THREE.CylinderGeometry(0.14, 0.14, 3.1, 8);
        const pillar = new THREE.Mesh(pillarGeo, woodTrimMat);
        pillar.position.set(px, 1.55, hd / 2 + 2.2);
        pillar.castShadow = true;
        house.add(pillar);
      });

      // 4. Brick Chimney
      const chimneyGeo = new THREE.BoxGeometry(1.2, 4.2, 1.2);
      const chimney = new THREE.Mesh(chimneyGeo, roofMats[0]);
      chimney.position.set(2.8, hh + 2.0, -1.5);
      chimney.castShadow = true;
      house.add(chimney);

      // 5. Windows with morning sunlight glare
      [-2.6, 2.6].forEach((wx) => {
        const winGeo = new THREE.PlaneGeometry(1.4, 1.6);
        const win = new THREE.Mesh(winGeo, glassMat);
        win.position.set(wx, 2.6, hd / 2 + 0.05);
        house.add(win);
      });

      // 6. Overgrown Ivy climbing over the roof & porch
      for (let v = 0; v < 3; v++) {
        const vineGeo = new THREE.CylinderGeometry(0.18, 0.18, hh + 2, 6);
        const vine = new THREE.Mesh(vineGeo, ivyMat);
        vine.position.set((v - 1) * 3.2, (hh + 2) / 2, hd / 2 + 0.1);
        vine.rotation.z = (v - 1) * 0.08;
        house.add(vine);
      }

      // 7. Mailbox along the path
      const mailboxPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 6), woodTrimMat);
      mailboxPole.position.set(3.8, 0.6, hd / 2 + 3.4);
      const mailboxBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.7), woodTrimMat);
      mailboxBox.position.set(3.8, 1.2, hd / 2 + 3.4);
      house.add(mailboxPole);
      house.add(mailboxBox);

      return house;
    };

    // Place houses along streets and cul-de-sacs
    const housePositions = [
      { x: -18, z: -25, r: 0.1, s: 1.0, idx: 0 },
      { x: -18, z: 0, r: -0.05, s: 1.05, idx: 1 },
      { x: -18, z: 25, r: 0.15, s: 0.95, idx: 2 },
      { x: 18, z: -25, r: Math.PI - 0.1, s: 1.0, idx: 3 },
      { x: 18, z: 0, r: Math.PI + 0.05, s: 1.05, idx: 0 },
      { x: 18, z: 25, r: Math.PI - 0.15, s: 0.95, idx: 1 },
      { x: -38, z: -10, r: Math.PI / 2, s: 1.0, idx: 2 },
      { x: -38, z: 15, r: Math.PI / 2, s: 1.0, idx: 3 },
      { x: 42, z: -5, r: -Math.PI / 2, s: 1.0, idx: 0 },
      { x: 42, z: 20, r: -Math.PI / 2, s: 1.0, idx: 1 },
    ];

    housePositions.forEach((h) => {
      housesGroup.add(createHouse(h.x, h.z, h.r, h.s, h.idx));
    });
    scene.add(housesGroup);

    // 7. Downtown Skyline Buildings in the Distance
    const cityGroup = new THREE.Group();
    const cityBuildingMat = new THREE.MeshStandardMaterial({ color: 0x94d2bd, roughness: 0.5, metalness: 0.3 });

    [
      [-55, -60, 16, 16, 38],
      [-28, -75, 14, 14, 32],
      [0, -78, 18, 18, 45], // Main Central Tower
      [30, -75, 15, 15, 36],
      [58, -60, 18, 18, 40],
    ].forEach(([cx, cz, cw, cd, ch]) => {
      const bGeo = new THREE.BoxGeometry(cw, ch, cd);
      const building = new THREE.Mesh(bGeo, cityBuildingMat);
      building.position.set(cx, ch / 2, cz);
      building.castShadow = true;
      building.receiveShadow = true;

      // Climbing greenery
      const greenCap = new THREE.Mesh(new THREE.BoxGeometry(cw + 0.4, 2, cd + 0.4), ivyMat);
      greenCap.position.y = ch;
      building.add(greenCap);

      cityGroup.add(building);
    });
    scene.add(cityGroup);

    // 8. Flowering Trees & Wisteria Canopies
    const treesGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
    const foliageMatGreen = new THREE.MeshStandardMaterial({ color: 0x38b000, roughness: 0.75 });
    const foliageMatPink = new THREE.MeshStandardMaterial({ color: 0xff758f, roughness: 0.75 }); // Flowering wisteria

    const treeCoords = [
      [-10, -12], [-10, 12], [10, -12], [10, 12],
      [-28, -35], [28, -35], [-28, 38], [28, 38],
      [0, 32], [0, -32],
    ];

    treeCoords.forEach(([tx, tz], i) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 4.5, 8), trunkMat);
      trunk.position.set(tx, 2.25, tz);
      trunk.castShadow = true;

      const folMat = i % 3 === 0 ? foliageMatPink : foliageMatGreen;
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(2.4, 12, 12), folMat);
      canopy.position.set(tx, 5.0, tz);
      canopy.castShadow = true;

      treesGroup.add(trunk);
      treesGroup.add(canopy);
    });
    scene.add(treesGroup);

    // 9. The 3 Morning Survival Beacons
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

      // Spire Tower in sunlit white and bronze
      const towerGeo = new THREE.CylinderGeometry(0.7, 1.4, 6.5, 8);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0xd8f3dc, roughness: 0.4, metalness: 0.6 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 3.25;
      tower.castShadow = true;
      bGroup.add(tower);

      // Rotating holographic morning rings
      const rings: THREE.Mesh[] = [];
      for (let r = 0; r < 2; r++) {
        const rGeo = new THREE.TorusGeometry(2.2 + r * 0.65, 0.08, 8, 32);
        const rMat = new THREE.MeshBasicMaterial({ color: item.color, transparent: true, opacity: 0.9 });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.position.y = 5.8;
        ring.rotation.x = Math.PI / 2;
        bGroup.add(ring);
        rings.push(ring);
      }

      // Skyward Laser Pillar (fires upon activation)
      const laserGeo = new THREE.CylinderGeometry(0.35, 0.35, 140, 8);
      const laserMat = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.35,
      });
      const laserPillar = new THREE.Mesh(laserGeo, laserMat);
      laserPillar.position.y = 70;
      bGroup.add(laserPillar);

      const bLight = new THREE.PointLight(item.color, 3.5, 20);
      bLight.position.y = 5.8;
      bGroup.add(bLight);

      scene.add(bGroup);
      beaconMeshes.push({ group: bGroup, item, index, rings, laserPillar, light: bLight });
    });

    // 10. Extraction Evacuation Gateway (North Plaza)
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 6.5, -65);

    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(8.5, 1.1, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.4, metalness: 0.8 })
    );
    portalGroup.add(arch);

    const portalVortex = new THREE.Mesh(
      new THREE.CircleGeometry(7.6, 32),
      new THREE.MeshBasicMaterial({ color: 0x2ec4b6, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
    );
    portalGroup.add(portalVortex);

    const portalLight = new THREE.PointLight(0x2ec4b6, 2.5, 32);
    portalGroup.add(portalLight);
    scene.add(portalGroup);

    // 11. Bio-Cyber Zombie Horde (Daylight Stalkers)
    const zombieCount = 26;
    const zombies: ZombieState[] = [];

    const zombieMat = new THREE.MeshStandardMaterial({ color: 0x3d405b, roughness: 0.7 });
    const zombieTorsoGeo = new THREE.BoxGeometry(0.95, 1.7, 0.65);
    const zombieHeadGeo = new THREE.SphereGeometry(0.38, 12, 12);
    const zombieArmGeo = new THREE.BoxGeometry(0.28, 1.3, 0.28);

    for (let z = 0; z < zombieCount; z++) {
      const zGroup = new THREE.Group();

      const torso = new THREE.Mesh(zombieTorsoGeo, zombieMat);
      torso.position.y = 1.15;
      torso.rotation.x = 0.22;
      torso.castShadow = true;
      zGroup.add(torso);

      const head = new THREE.Mesh(zombieHeadGeo, zombieMat);
      head.position.set(0, 2.15, 0.22);
      zGroup.add(head);

      // Glowing crimson red eyes that contrast with morning sunlight
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
      eyeL.position.set(0.13, 2.2, 0.55);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
      eyeR.position.set(-0.13, 2.2, 0.55);
      zGroup.add(eyeL);
      zGroup.add(eyeR);

      const leftArm = new THREE.Mesh(zombieArmGeo, zombieMat);
      leftArm.position.set(-0.62, 1.35, 0.3);
      leftArm.rotation.x = -0.5;
      zGroup.add(leftArm);

      const rightArm = new THREE.Mesh(zombieArmGeo, zombieMat);
      rightArm.position.set(0.62, 1.35, 0.3);
      rightArm.rotation.x = -0.5;
      zGroup.add(rightArm);

      // Spawn around house yards and sidewalks
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 58 + 15;
      zGroup.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      scene.add(zGroup);

      zombies.push({
        mesh: zGroup,
        eyeMat,
        leftArm,
        rightArm,
        pos: zGroup.position,
        velocity: new THREE.Vector3(),
        speed: Math.random() * 0.04 + 0.07,
        state: 'idle',
        stunTimer: 0,
        screeched: false,
        wanderAngle: Math.random() * Math.PI * 2,
      });
    }

    // 12. Solarpunk Player Drone: RECLAIMER-04 (Daylight Edition)
    const drone = new THREE.Group();
    drone.position.set(0, 2.6, 0);

    // Clean white & emerald solarpunk hull
    const podMat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.3, metalness: 0.7 });
    const pod = new THREE.Mesh(new THREE.DodecahedronGeometry(0.92, 1), podMat);
    pod.castShadow = true;
    drone.add(pod);

    // Emerald solarpunk wing stripe
    const solarStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.12, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x2ec4b6, roughness: 0.2, metalness: 0.8 })
    );
    solarStripe.position.y = 0.4;
    drone.add(solarStripe);

    // Optical camera lens
    const lens = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00b4d8 })
    );
    lens.position.set(0, 0.1, 0.88);
    drone.add(lens);

    // Daytime searchlight
    const daylightSearchlight = new THREE.SpotLight(0xffffff, 4.0, 52, Math.PI / 4.5, 0.3, 1.2);
    daylightSearchlight.position.set(0, 0.2, 0.6);
    daylightSearchlight.target.position.set(0, -0.6, 16);
    daylightSearchlight.castShadow = true;
    drone.add(daylightSearchlight);
    drone.add(daylightSearchlight.target);

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
        new THREE.MeshStandardMaterial({ color: 0x2b2d42 })
      );
      arm.position.set(rx * 0.5, ry * 0.5, rz * 0.5);
      arm.rotation.z = rx > 0 ? -Math.PI / 4 : Math.PI / 4;
      drone.add(arm);

      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.04, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x2ec4b6, roughness: 0.2 })
      );
      blade.position.set(rx, ry + 0.2, rz);
      drone.add(blade);
      rotorMeshes.push(blade);
    });

    // EMP Shockwave visual ring
    const empRingGeo = new THREE.RingGeometry(0.5, 1.2, 32);
    const empRingMat = new THREE.MeshBasicMaterial({
      color: 0x00b4d8,
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

    // 13. Game & AI Simulation Loop
    let animId: number;
    const clock = new THREE.Clock();
    let frame = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();
      frame++;

      const keys = keysRef.current;
      const vInput = virtualInput;

      const isBoosting = keys.boost || vInput?.boost;
      const currentMaxSpeed = isBoosting ? 0.95 : 0.55;
      const currentAccel = isBoosting ? 0.045 : 0.026;

      const forwardInput = keys.forward ? 1 : keys.backward ? -1 : (vInput?.forward ?? 0);
      const turnInput = keys.left ? 1 : keys.right ? -1 : -(vInput?.turn ?? 0);
      const actionInput = keys.action || (vInput?.action ?? false);

      // Steering & movement
      yaw += turnInput * 0.038;
      if (forwardInput !== 0) {
        speed = Math.max(-currentMaxSpeed * 0.6, Math.min(currentMaxSpeed, speed + forwardInput * currentAccel));
      } else {
        speed *= 0.94;
      }

      roll = THREE.MathUtils.lerp(roll, -turnInput * 0.45, 0.12);
      pitch = THREE.MathUtils.lerp(pitch, -forwardInput * 0.35, 0.12);

      const forwardX = Math.sin(yaw);
      const forwardZ = Math.cos(yaw);
      drone.position.x += forwardX * speed;
      drone.position.z += forwardZ * speed;
      drone.position.y = 2.4 + Math.sin(time * 3.2) * 0.14;

      drone.rotation.y = yaw;
      drone.rotation.z = roll;
      drone.rotation.x = pitch;

      // Keep inside town borders
      const townBound = 95;
      drone.position.x = Math.max(-townBound, Math.min(townBound, drone.position.x));
      drone.position.z = Math.max(-townBound, Math.min(townBound, drone.position.z));

      // Rotor animation
      const rotorSpeed = 0.5 + Math.abs(speed) * 2.0;
      rotorMeshes.forEach((blade, i) => {
        blade.rotation.y += (i % 2 === 0 ? 1 : -1) * rotorSpeed;
      });

      // Third-person chase camera
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
      empCooldownRef.current = Math.min(1, empCooldownRef.current + delta * 0.25);

      if (actionInput && empCooldownRef.current >= 1 && !isEmpExpanding) {
        empCooldownRef.current = 0;
        isEmpExpanding = true;
        empRadius = 1;
        empRingMat.opacity = 0.95;
        reclamationAudio.playEmpBlast();

        zombies.forEach((z) => {
          const dist = drone.position.distanceTo(z.pos);
          if (dist < 18) {
            z.state = 'stunned';
            z.stunTimer = 3.5;
            z.eyeMat.color.setHex(0x00b4d8);
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

      // ── Zombie AI & Chasing ──
      let chasingCount = 0;
      zombies.forEach((z, idx) => {
        z.pos.add(z.velocity.clone().multiplyScalar(delta));
        z.velocity.multiplyScalar(0.88);

        const distToDrone = drone.position.distanceTo(z.pos);

        if (z.state === 'stunned') {
          z.stunTimer -= delta;
          z.leftArm.rotation.x = Math.sin(time * 20) * 0.2;
          z.rightArm.rotation.x = Math.sin(time * 20) * 0.2;
          if (z.stunTimer <= 0) {
            z.state = 'idle';
            z.eyeMat.color.setHex(0xff1744);
          }
          return;
        }

        const isNear = distToDrone < 28;
        if (isNear) {
          z.state = 'chase';
          chasingCount++;

          if (!z.screeched && Math.random() < 0.15) {
            z.screeched = true;
            reclamationAudio.playZombieScreech();
          }

          const dir = drone.position.clone().sub(z.pos);
          dir.y = 0;
          dir.normalize();

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

          z.pos.add(dir.multiplyScalar(z.speed * (distToDrone < 8 ? 1.4 : 1.0)));
          z.mesh.lookAt(new THREE.Vector3(drone.position.x, z.pos.y, drone.position.z));

          z.leftArm.rotation.x = -0.5 + Math.sin(time * 8 + idx) * 0.6;
          z.rightArm.rotation.x = -0.5 - Math.sin(time * 8 + idx) * 0.6;

          if (distToDrone < 3.4) {
            shieldsRef.current = Math.max(0, shieldsRef.current - delta * 22);
            lastDamageTimeRef.current = time;
            if (onDamageTaken) onDamageTaken(Math.round(shieldsRef.current));
            if (frame % 20 === 0) reclamationAudio.playShieldHit();
          }
        } else {
          z.state = 'idle';
          z.screeched = false;
          z.wanderAngle += (Math.random() - 0.5) * 0.1;
          z.pos.x += Math.cos(z.wanderAngle) * 0.02;
          z.pos.z += Math.sin(z.wanderAngle) * 0.02;
        }

        z.pos.x = Math.max(-townBound, Math.min(townBound, z.pos.x));
        z.pos.z = Math.max(-townBound, Math.min(townBound, z.pos.z));
      });

      // ── Beacon Activation ──
      let nearestDist = 9999;
      let nearestName = 'SCANNING TOWN...';

      beaconMeshes.forEach(({ group, item, index, rings, laserPillar, light }) => {
        rings[0].rotation.z += 0.03;
        rings[1].rotation.y += 0.02;

        const dist = drone.position.distanceTo(group.position);
        if (!item.activated && dist < nearestDist) {
          nearestDist = dist;
          nearestName = `${item.id}: ${item.name}`;
        }

        if (!item.activated && (dist < 4.8 || (dist < 16 && isEmpExpanding))) {
          item.activated = true;
          beaconsRef.current[index].activated = true;
          reclamationAudio.playBeaconLaser();
          onActivateBeacon(item, index);

          laserPillar.scale.set(3.5, 1, 3.5);
          (laserPillar.material as THREE.MeshBasicMaterial).opacity = 0.95;
          light.intensity = 8.0;

          // Clear nearby zombies
          zombies.forEach((z) => {
            if (group.position.distanceTo(z.pos) < 26) {
              z.state = 'stunned';
              z.stunTimer = 5.0;
              z.velocity.add(z.pos.clone().sub(group.position).normalize().multiplyScalar(16));
            }
          });

          const remaining = beaconsRef.current.filter((b) => !b.activated).length;
          if (remaining === 0 && !allActivatedRef.current) {
            allActivatedRef.current = true;
            reclamationAudio.playWarpPortalSound();
            (portalVortex.material as THREE.MeshBasicMaterial).color.setHex(0x2ec4b6);
            (portalVortex.material as THREE.MeshBasicMaterial).opacity = 0.9;
            portalLight.intensity = 7.0;
          }
        }
      });

      // ── Portal Entry ──
      if (allActivatedRef.current) {
        portalVortex.rotation.z += 0.04;
        if (drone.position.distanceTo(portalGroup.position) < 9.5) {
          onEnterPortal();
        }
      }

      // ── Telemetry Update ──
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
      className="relative w-full h-full min-h-screen overflow-hidden bg-[#aed9e0]"
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#b8e0d2] z-50">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-600/30 border-t-emerald-600 animate-spin mb-4" />
          <span className="text-xs text-emerald-800 font-mono tracking-widest uppercase font-bold">
            WARMING SUNLIGHT & OVERGROWN TOWN...
          </span>
        </div>
      )}
    </div>
  );
}
