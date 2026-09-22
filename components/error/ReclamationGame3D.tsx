'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { reclamationAudio } from '@/lib/audio/reclamationAudio';
import { gameNetwork, RemotePlayerState, NetworkEvent } from '@/lib/multiplayer/gameNetwork';

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
  maxShields: number;
  empCooldown: number; // 0 to 1 (1 = ready)
  nearestDist: number;
  nearestName: string;
  zombieCount: number;
  zombiesChasing: number;
  activeBeacons: number;
  totalBeacons: number;
}

export type DifficultyMode = 'easy' | 'medium' | 'hard';

interface ReclamationGame3DProps {
  difficultyMode?: DifficultyMode;
  onActivateBeacon: (beacon: BeaconItem, index: number) => void;
  onEnterPortal: () => void;
  onUpdateTelemetry: (telemetry: TelemetryData) => void;
  onDamageTaken?: (shields: number) => void;
  isAudioActive: boolean;
  virtualInput?: { forward: number; turn: number; action: boolean; boost?: boolean };
  onModeChange?: (mode: DifficultyMode) => void;
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
  isBrute?: boolean;
  isSprinter?: boolean;
}

interface RemoteDroneVisual {
  group: THREE.Group;
  rotors: THREE.Mesh[];
  labelSprite: THREE.Sprite;
  targetPos: THREE.Vector3;
  targetRotY: number;
  targetPitch: number;
  targetRoll: number;
  shields: number;
  color: number;
  callsign: string;
}

export default function ReclamationGame3D({
  difficultyMode = 'medium',
  onActivateBeacon,
  onEnterPortal,
  onUpdateTelemetry,
  onDamageTaken,
  virtualInput,
}: ReclamationGame3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Difficulty configurations
  const modeSettings = {
    easy: {
      maxShields: 200,
      empCooldownRate: 1 / 3.2,
      zombieCount: 20,
      zombieBaseSpeed: 1.8,
      chaseRadius: 22,
      beaconCount: 3,
      fogDensity: 0.0035,
    },
    medium: {
      maxShields: 100,
      empCooldownRate: 1 / 5.5,
      zombieCount: 36,
      zombieBaseSpeed: 2.6,
      chaseRadius: 30,
      beaconCount: 4,
      fogDensity: 0.0055,
    },
    hard: {
      maxShields: 60,
      empCooldownRate: 1 / 8.5,
      zombieCount: 56,
      zombieBaseSpeed: 3.6,
      chaseRadius: 40,
      beaconCount: 5,
      fogDensity: 0.008,
    },
  }[difficultyMode];

  // Beacons distributed across the expanded 420x420 metropolis
  const allPossibleBeacons: BeaconItem[] = [
    {
      id: 'ALPHA',
      name: 'SUBURBAN PLAZA',
      location: 'RESIDENTIAL BOULEVARD // 0x404_A',
      pos: [-55, 3.2, -45],
      activated: false,
      color: 0x00b4d8,
    },
    {
      id: 'BETA',
      name: 'RIVER ARCH BRIDGE',
      location: 'CANAL CROSSING // 0x404_B',
      pos: [-28, 4.0, 18],
      activated: false,
      color: 0x2ec4b6,
    },
    {
      id: 'GAMMA',
      name: 'SKYSCRAPER PLAZA',
      location: 'TECH CORE MONOLITH // 0x404_C',
      pos: [65, 3.5, -60],
      activated: false,
      color: 0xff9f1c,
    },
    {
      id: 'DELTA',
      name: 'BOTANICAL OVERLOOK',
      location: 'VALLEY RIDGE // 0x404_D',
      pos: [80, 5.8, 75],
      activated: false,
      color: 0xe0aaff,
    },
    {
      id: 'EPSILON',
      name: 'HIGHWAY RUINS',
      location: 'ELEVATED FREEWAY // 0x404_E',
      pos: [-95, 4.5, 90],
      activated: false,
      color: 0xff4d6d,
    },
  ];

  const activeBeaconsList = allPossibleBeacons.slice(0, modeSettings.beaconCount);
  const beaconsRef = useRef<BeaconItem[]>(activeBeaconsList);

  useEffect(() => {
    beaconsRef.current = allPossibleBeacons.slice(0, modeSettings.beaconCount);
  }, [difficultyMode, modeSettings.beaconCount]);

  const allActivatedRef = useRef(false);
  const shieldsRef = useRef(modeSettings.maxShields);
  const maxShieldsRef = useRef(modeSettings.maxShields);
  const empCooldownRef = useRef(1);
  const lastDamageTimeRef = useRef(0);

  useEffect(() => {
    shieldsRef.current = modeSettings.maxShields;
    maxShieldsRef.current = modeSettings.maxShields;
  }, [modeSettings.maxShields]);

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

  // Three.js Scene Setup (Expanded 420x420 Open World + Multiplayer)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // Connect to multiplayer network
    gameNetwork.connect();

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaed9e0); // Morning azure sky
    scene.fog = new THREE.FogExp2(0xb8e0d2, modeSettings.fogDensity);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(56, width / height, 0.1, 750);
    camera.position.set(0, 9, 18);

    // 3. Renderer
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
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Morning Sunlight & Daylight Fill
    const ambientLight = new THREE.AmbientLight(0xe8f5e9, 1.5);
    scene.add(ambientLight);

    const morningSun = new THREE.DirectionalLight(0xfff4d6, 3.0);
    morningSun.position.set(140, 95, -110);
    morningSun.castShadow = true;
    morningSun.shadow.mapSize.width = 2048;
    morningSun.shadow.mapSize.height = 2048;
    morningSun.shadow.camera.near = 15;
    morningSun.shadow.camera.far = 480;
    const sD = 180;
    morningSun.shadow.camera.left = -sD;
    morningSun.shadow.camera.right = sD;
    morningSun.shadow.camera.top = sD;
    morningSun.shadow.camera.bottom = -sD;
    scene.add(morningSun);

    const hemiLight = new THREE.HemisphereLight(0xaed9e0, 0x52b788, 1.2);
    scene.add(hemiLight);

    // 5. Vast Undulating Terrain & Riverbed (420x420)
    const mapSize = 440;
    const terrainGeo = new THREE.PlaneGeometry(mapSize, mapSize, 110, 110);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);

    // Height generator helper
    const getTerrainHeight = (gx: number, gz: number) => {
      // River channel cutting diagonally
      const riverDist = Math.abs(gz - (gx * 0.75 + 15));
      if (riverDist < 18) {
        return -2.6 + Math.sin(gx * 0.1) * 0.4;
      }
      // Gentle rolling hills
      const hill =
        Math.sin(gx * 0.02) * Math.cos(gz * 0.02) * 3.8 +
        Math.sin(gx * 0.04 + gz * 0.03) * 1.5;
      return Math.max(-0.2, hill);
    };

    for (let i = 0; i < posAttr.count; i++) {
      const gx = posAttr.getX(i);
      const gz = posAttr.getZ(i);
      const h = getTerrainHeight(gx, gz);
      posAttr.setY(i, h);

      // Distinguish roads, paths, riverbanks, and lush grass
      const riverDist = Math.abs(gz - (gx * 0.75 + 15));
      const isMainAvenue = Math.abs(gx) < 7 && gz > -160 && gz < 160;
      const isCrossBoulevard = Math.abs(gz) < 7 && gx > -160 && gx < 160;
      const isPathway = Math.abs(gx - 45) < 3 || Math.abs(gx + 45) < 3 || Math.abs(gz - 50) < 3;

      if (riverDist < 18) {
        // Riverbed wet pebbles & sand
        colors[i * 3] = 0.2;
        colors[i * 3 + 1] = 0.28;
        colors[i * 3 + 2] = 0.25;
      } else if (riverDist < 26) {
        // Lush riverbank reed verge
        colors[i * 3] = 0.3;
        colors[i * 3 + 1] = 0.58;
        colors[i * 3 + 2] = 0.28;
      } else if (isMainAvenue || isCrossBoulevard) {
        // Cracked asphalt highway
        colors[i * 3] = 0.24;
        colors[i * 3 + 1] = 0.26;
        colors[i * 3 + 2] = 0.25;
      } else if (isPathway) {
        // Cobblestone walking promenade
        colors[i * 3] = 0.56;
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 0.52;
      } else {
        // Fresh morning green meadow with clover
        const v = 0.2 + (Math.sin(gx * 0.1) * 0.05);
        colors[i * 3] = v;
        colors[i * 3 + 1] = 0.64;
        colors[i * 3 + 2] = 0.32;
      }
    }

    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.8,
      metalness: 0.08,
    });
    const metropolisTerrain = new THREE.Mesh(terrainGeo, terrainMat);
    metropolisTerrain.receiveShadow = true;
    scene.add(metropolisTerrain);

    // 6. Flowing Daylight River (Animated Water Surface)
    const riverGeo = new THREE.PlaneGeometry(420, 32, 60, 10);
    riverGeo.rotateX(-Math.PI / 2);
    riverGeo.rotateY(0.64);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x1d7874,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88,
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.position.set(0, -1.8, 15);
    riverMesh.receiveShadow = true;
    scene.add(riverMesh);

    // 7. Stone Arched Bridges over the River
    const bridgeGroup = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6c757d, roughness: 0.7 });
    const railingMat = new THREE.MeshStandardMaterial({ color: 0x343a40, roughness: 0.5 });

    const createStoneBridge = (bx: number, bz: number, angle: number) => {
      const bridge = new THREE.Group();
      bridge.position.set(bx, 1.2, bz);
      bridge.rotation.y = angle;

      // Road deck
      const deck = new THREE.Mesh(new THREE.BoxGeometry(11, 1.2, 38), stoneMat);
      deck.castShadow = true;
      deck.receiveShadow = true;
      bridge.add(deck);

      // Stone piers
      [-12, 0, 12].forEach((pz) => {
        const pier = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 3.5), stoneMat);
        pier.position.set(0, -2.8, pz);
        pier.castShadow = true;
        bridge.add(pier);
      });

      // Side safety railings
      [-5.6, 5.6].forEach((rx) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.3, 38), railingMat);
        rail.position.set(rx, 1.2, 0);
        rail.castShadow = true;
        bridge.add(rail);
      });

      return bridge;
    };

    bridgeGroup.add(createStoneBridge(-28, 18, -0.9));
    bridgeGroup.add(createStoneBridge(65, 95, -0.9));
    scene.add(bridgeGroup);

    // 8. Perimeter Defensive Laser Posts (420x420 Arena Bounds)
    const perimeterGroup = new THREE.Group();
    const fenceMat = new THREE.MeshBasicMaterial({ color: 0x00b4d8, transparent: true, opacity: 0.65 });
    const postMat = new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.5 });

    const townBound = 200;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
      const px = Math.cos(angle) * townBound;
      const pz = Math.sin(angle) * townBound;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 9, 8), postMat);
      post.position.set(px, 4.5, pz);
      post.castShadow = true;
      perimeterGroup.add(post);

      const beaconTip = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), fenceMat);
      beaconTip.position.set(px, 9.2, pz);
      perimeterGroup.add(beaconTip);
    }
    scene.add(perimeterGroup);

    // 9. Realistic Residential Houses ("House Stuff")
    const housesGroup = new THREE.Group();
    const wallMats = [
      new THREE.MeshStandardMaterial({ color: 0xf4f1de, roughness: 0.65 }), // Warm cream siding
      new THREE.MeshStandardMaterial({ color: 0xd8e2dc, roughness: 0.7 }), // Morning sage
      new THREE.MeshStandardMaterial({ color: 0xe07a5f, roughness: 0.75 }), // Terracotta red brick
      new THREE.MeshStandardMaterial({ color: 0xffe5d9, roughness: 0.7 }), // Rose sunlit wood
      new THREE.MeshStandardMaterial({ color: 0x81b29a, roughness: 0.7 }), // Muted olive
    ];

    const roofMats = [
      new THREE.MeshStandardMaterial({ color: 0x9d0208, roughness: 0.55 }), // Terracotta shingles
      new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.6 }), // Dark charcoal slate
      new THREE.MeshStandardMaterial({ color: 0x495057, roughness: 0.65 }), // Weathered cedar
    ];

    const woodTrimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const ivyMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.85 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x90e0ef, roughness: 0.1, metalness: 0.9 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x3d405b, roughness: 0.5 });

    const createRealisticHouse = (x: number, z: number, rotation: number, scale = 1, styleIdx = 0) => {
      const house = new THREE.Group();
      house.position.set(x, 0, z);
      house.rotation.y = rotation;
      house.scale.set(scale, scale, scale);

      const hw = 9.5;
      const hd = 8.2;
      const hh = 5.2;

      // Foundation base
      const fGeo = new THREE.BoxGeometry(hw + 0.5, 0.6, hd + 0.5);
      const foundation = new THREE.Mesh(fGeo, stoneMat);
      foundation.position.y = 0.3;
      foundation.receiveShadow = true;
      house.add(foundation);

      // Main house body
      const bodyGeo = new THREE.BoxGeometry(hw, hh, hd);
      const bodyMat = wallMats[styleIdx % wallMats.length];
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = hh / 2 + 0.6;
      body.castShadow = true;
      body.receiveShadow = true;
      house.add(body);

      // Pitched Gabled Shingle Roof
      const roofGeo = new THREE.ConeGeometry(hw * 0.76, 3.8, 4);
      const roofMat = roofMats[styleIdx % roofMats.length];
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = hh + 2.5;
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(1.15, 1, 0.95);
      roof.castShadow = true;
      roof.receiveShadow = true;
      house.add(roof);

      // Attic Dormer Window
      const dormer = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 2.0), bodyMat);
      dormer.position.set(0, hh + 1.8, hd / 2 - 0.5);
      dormer.castShadow = true;
      house.add(dormer);
      const dormerWin = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.0), glassMat);
      dormerWin.position.set(0, hh + 1.8, hd / 2 + 0.55);
      house.add(dormerWin);

      // Front Porch & Wooden Balustrades
      const porchDeck = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 3.0), woodTrimMat);
      porchDeck.position.set(0, 0.6, hd / 2 + 1.5);
      porchDeck.castShadow = true;
      house.add(porchDeck);

      const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 3.0), roofMat);
      porchRoof.position.set(0, 3.4, hd / 2 + 1.5);
      porchRoof.castShadow = true;
      house.add(porchRoof);

      [-2.8, 0, 2.8].forEach((px) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 0.2), woodTrimMat);
        post.position.set(px, 2.0, hd / 2 + 2.8);
        post.castShadow = true;
        house.add(post);
      });

      // Front Door
      const door = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.4), doorMat);
      door.position.set(0, 1.8, hd / 2 + 0.05);
      house.add(door);

      // Windows with morning glints
      [-2.8, 2.8].forEach((wx) => {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.8), glassMat);
        win.position.set(wx, 2.6, hd / 2 + 0.05);
        house.add(win);
      });

      // Brick Chimney
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.0, 1.4), roofMats[0]);
      chimney.position.set(3.2, hh + 2.4, -1.8);
      chimney.castShadow = true;
      house.add(chimney);

      // Garage Annex on the side
      const garage = new THREE.Mesh(new THREE.BoxGeometry(6.0, 3.6, 7.5), bodyMat);
      garage.position.set(hw / 2 + 3.0, 1.8, 0);
      garage.castShadow = true;
      house.add(garage);
      const garageDoor = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.8), woodTrimMat);
      garageDoor.position.set(hw / 2 + 3.0, 1.5, 7.5 / 2 + 0.05);
      house.add(garageDoor);

      // Climbing Ivy
      for (let v = 0; v < 3; v++) {
        const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, hh + 2, 6), ivyMat);
        vine.position.set((v - 1) * 3.4, (hh + 2) / 2, hd / 2 + 0.15);
        vine.rotation.z = (v - 1) * 0.06;
        house.add(vine);
      }

      // Mailbox and walkway fence
      const mailbox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.7), woodTrimMat);
      mailbox.position.set(4.2, 1.3, hd / 2 + 3.8);
      house.add(mailbox);

      return house;
    };

    // Populate 18+ houses across residential sectors
    const houseConfigs = [
      { x: -75, z: -75, r: 0.1, s: 1.0, idx: 0 },
      { x: -50, z: -80, r: -0.05, s: 1.05, idx: 1 },
      { x: -25, z: -80, r: 0.1, s: 0.95, idx: 2 },
      { x: -80, z: -45, r: Math.PI / 2, s: 1.0, idx: 3 },
      { x: -80, z: -20, r: Math.PI / 2 - 0.1, s: 1.0, idx: 4 },
      { x: -55, z: -25, r: Math.PI - 0.1, s: 1.05, idx: 0 },
      { x: -30, z: -25, r: Math.PI + 0.05, s: 0.95, idx: 1 },
      { x: -55, z: 0, r: 0.05, s: 1.0, idx: 2 },
      { x: -80, z: 25, r: Math.PI / 2, s: 1.0, idx: 3 },
      { x: -55, z: 35, r: -0.1, s: 1.05, idx: 4 },
      // East Riverside Suburb
      { x: 45, z: -25, r: -Math.PI / 2, s: 1.0, idx: 0 },
      { x: 45, z: 0, r: -Math.PI / 2 + 0.05, s: 1.05, idx: 1 },
      { x: 45, z: 25, r: -Math.PI / 2 - 0.05, s: 0.95, idx: 2 },
      { x: 80, z: -25, r: Math.PI / 2, s: 1.0, idx: 3 },
      { x: 80, z: 0, r: Math.PI / 2, s: 1.0, idx: 4 },
      { x: 80, z: 25, r: Math.PI / 2, s: 1.05, idx: 0 },
      { x: 105, z: 10, r: -0.2, s: 1.0, idx: 1 },
      { x: 105, z: 35, r: 0.15, s: 0.95, idx: 2 },
    ];

    houseConfigs.forEach((h) => {
      housesGroup.add(createRealisticHouse(h.x, h.z, h.r, h.s, h.idx));
    });
    scene.add(housesGroup);

    // 10. Multi-Storey Commercial & Tech Core (14+ Skyscraper Towers)
    const towersGroup = new THREE.Group();
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x8d99ae, roughness: 0.6, metalness: 0.2 });
    const darkTowerMat = new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.5, metalness: 0.4 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x4a4e69, roughness: 0.4, metalness: 0.8 });
    const warningRedMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });

    const createMultiStoreyTower = (
      tx: number,
      tz: number,
      floors: number,
      width: number,
      depth: number,
      style: 'glass' | 'brutalist' | 'industrial'
    ) => {
      const tower = new THREE.Group();
      tower.position.set(tx, 0, tz);

      const floorHeight = 4.2;
      const totalH = floors * floorHeight;

      // Tower Core
      const coreMat = style === 'glass' ? glassMat : style === 'brutalist' ? concreteMat : darkTowerMat;
      const core = new THREE.Mesh(new THREE.BoxGeometry(width, totalH, depth), coreMat);
      core.position.y = totalH / 2;
      core.castShadow = true;
      core.receiveShadow = true;
      tower.add(core);

      // Floor Slabs & Horizontal Louvers
      for (let f = 1; f < floors; f++) {
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(width + 0.6, 0.4, depth + 0.6),
          concreteMat
        );
        slab.position.y = f * floorHeight;
        slab.castShadow = true;
        tower.add(slab);
      }

      // Exterior Fire Escape on one side
      const feX = width / 2 + 0.6;
      for (let f = 1; f < floors; f += 2) {
        const platform = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 3.2), metalMat);
        platform.position.set(feX, f * floorHeight, 0);
        tower.add(platform);

        const ladder = new THREE.Mesh(new THREE.BoxGeometry(0.15, floorHeight * 2, 0.8), metalMat);
        ladder.position.set(feX, (f + 1) * floorHeight, 1.2);
        tower.add(ladder);
      }

      // Rooftop Equipment (Water Tower, Chiller, Antenna)
      const roofH = totalH;

      // Rooftop Penthouse
      const ph = new THREE.Mesh(new THREE.BoxGeometry(width * 0.45, 3.2, depth * 0.45), concreteMat);
      ph.position.set(0, roofH + 1.6, 0);
      ph.castShadow = true;
      tower.add(ph);

      // Water Tower on Stilts
      const tankStilts = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.0, 4), metalMat);
      tankStilts.position.set(width * 0.25, roofH + 1.5, depth * 0.25);
      const waterTank = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 2.4, 12), roofMats[0]);
      waterTank.position.set(width * 0.25, roofH + 3.8, depth * 0.25);
      waterTank.castShadow = true;
      tower.add(tankStilts);
      tower.add(waterTank);

      // Tall Antenna with Blinking Aviation Light
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 9.0, 6), metalMat);
      antenna.position.set(-width * 0.2, roofH + 4.5, -depth * 0.2);
      const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), warningRedMat);
      beaconLight.position.set(-width * 0.2, roofH + 9.0, -depth * 0.2);
      tower.add(antenna);
      tower.add(beaconLight);

      // Rooftop Overgrowth
      const roofGrass = new THREE.Mesh(new THREE.BoxGeometry(width * 0.35, 0.4, depth * 0.35), ivyMat);
      roofGrass.position.set(-width * 0.2, roofH + 0.2, depth * 0.2);
      tower.add(roofGrass);

      return tower;
    };

    // Skyscraper Metropolis Cluster (Northeast Core)
    const towerConfigs = [
      { x: 35, z: -85, f: 8, w: 16, d: 16, s: 'glass' as const },
      { x: 65, z: -90, f: 12, w: 18, d: 18, s: 'brutalist' as const },
      { x: 95, z: -85, f: 14, w: 20, d: 20, s: 'glass' as const }, // Apex Tower
      { x: 35, z: -55, f: 6, w: 14, d: 14, s: 'industrial' as const },
      { x: 70, z: -55, f: 10, w: 17, d: 17, s: 'glass' as const },
      { x: 105, z: -55, f: 8, w: 15, d: 15, s: 'brutalist' as const },
      // Secondary City Blocks
      { x: -110, z: -80, f: 7, w: 16, d: 16, s: 'industrial' as const },
      { x: -110, z: -45, f: 9, w: 18, d: 18, s: 'brutalist' as const },
      { x: -110, z: 45, f: 8, w: 16, d: 16, s: 'glass' as const },
      { x: -110, z: 80, f: 11, w: 19, d: 19, s: 'brutalist' as const },
      // Southern Highway Block
      { x: 20, z: 125, f: 7, w: 15, d: 15, s: 'industrial' as const },
      { x: 55, z: 130, f: 9, w: 17, d: 17, s: 'glass' as const },
    ];

    towerConfigs.forEach((tc) => {
      towersGroup.add(createMultiStoreyTower(tc.x, tc.z, tc.f, tc.w, tc.d, tc.s));
    });

    // Skybridge connecting the two towers at (35, -85) and (65, -90)
    const skybridge = new THREE.Mesh(new THREE.BoxGeometry(24, 3.8, 3.8), glassMat);
    skybridge.position.set(50, 24, -87.5);
    skybridge.castShadow = true;
    towersGroup.add(skybridge);

    scene.add(towersGroup);

    // 11. Realistic Procedural Trees & Botany
    const treesGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
    const oakLeafMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.8 });
    const goldenLeafMat = new THREE.MeshStandardMaterial({ color: 0x55a630, roughness: 0.75 });
    const willowLeafMat = new THREE.MeshStandardMaterial({ color: 0x74c69d, roughness: 0.8 });
    const pineLeafMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.7 });
    const wisteriaLeafMat = new THREE.MeshStandardMaterial({ color: 0x9d4edd, roughness: 0.75 });

    // Procedural Tree Generator (Multi-tiered canopy)
    const createRealisticTree = (
      tx: number,
      tz: number,
      type: 'oak' | 'willow' | 'pine' | 'wisteria',
      scale = 1
    ) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);
      tree.scale.set(scale, scale, scale);

      if (type === 'pine') {
        // Conifer / Pine
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 9.5, 8), trunkMat);
        trunk.position.y = 4.75;
        trunk.castShadow = true;
        tree.add(trunk);

        [
          { y: 4.5, r: 3.8, h: 4.2 },
          { y: 7.2, r: 3.0, h: 3.8 },
          { y: 9.8, r: 2.1, h: 3.4 },
          { y: 12.0, r: 1.2, h: 2.8 },
        ].forEach((tier) => {
          const cone = new THREE.Mesh(new THREE.ConeGeometry(tier.r, tier.h, 7), pineLeafMat);
          cone.position.y = tier.y;
          cone.castShadow = true;
          tree.add(cone);
        });
      } else if (type === 'willow') {
        // Weeping willow along river
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.8, 6.5, 8), trunkMat);
        trunk.position.y = 3.25;
        trunk.castShadow = true;
        tree.add(trunk);

        const dome = new THREE.Mesh(new THREE.SphereGeometry(4.2, 10, 8), willowLeafMat);
        dome.position.y = 7.5;
        dome.scale.set(1.2, 0.9, 1.2);
        dome.castShadow = true;
        tree.add(dome);

        // Hanging vine tendrils
        for (let a = 0; a < 8; a++) {
          const ang = (a / 8) * Math.PI * 2;
          const tendril = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.8, 4), ivyMat);
          tendril.position.set(Math.cos(ang) * 3.8, 4.5, Math.sin(ang) * 3.8);
          tree.add(tendril);
        }
      } else {
        // Broadleaf Oak or Wisteria
        const lMat = type === 'wisteria' ? wisteriaLeafMat : Math.random() > 0.5 ? oakLeafMat : goldenLeafMat;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.85, 7.0, 8), trunkMat);
        trunk.position.y = 3.5;
        trunk.castShadow = true;
        tree.add(trunk);

        // Branch clusters
        [
          { x: 0, y: 8.5, z: 0, r: 3.8 },
          { x: -2.2, y: 7.2, z: 1.5, r: 2.8 },
          { x: 2.2, y: 7.6, z: -1.2, r: 2.9 },
          { x: 0.8, y: 8.0, z: 2.0, r: 2.7 },
        ].forEach((cl) => {
          const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(cl.r, 1), lMat);
          foliage.position.set(cl.x, cl.y, cl.z);
          foliage.castShadow = true;
          tree.add(foliage);
        });
      }

      return tree;
    };

    // Plant trees across the open landscape
    const treeLocs: [number, number, 'oak' | 'willow' | 'pine' | 'wisteria'][] = [
      [-15, -45, 'oak'], [-15, -15, 'wisteria'], [-15, 15, 'oak'],
      [15, -45, 'wisteria'], [15, -15, 'oak'], [15, 15, 'wisteria'],
      // River willows
      [-38, 8, 'willow'], [-15, 26, 'willow'], [8, 42, 'willow'], [32, 60, 'willow'],
      [58, 80, 'willow'], [85, 105, 'willow'],
      // Pine hills
      [-95, -110, 'pine'], [-75, -115, 'pine'], [-55, -110, 'pine'],
      [115, -110, 'pine'], [135, -95, 'pine'], [145, -70, 'pine'],
      [-120, 110, 'pine'], [-100, 125, 'pine'], [-80, 135, 'pine'],
      [110, 85, 'oak'], [125, 60, 'wisteria'], [135, 30, 'oak'],
    ];

    treeLocs.forEach(([tx, tz, tType]) => {
      treesGroup.add(createRealisticTree(tx, tz, tType, 1.0 + Math.random() * 0.3));
    });
    scene.add(treesGroup);

    // 12. Abandoned Rusted Vehicles (Cars, Pickups)
    const vehiclesGroup = new THREE.Group();
    const carMat = new THREE.MeshStandardMaterial({ color: 0x5c677d, roughness: 0.7, metalness: 0.3 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

    const createAbandonedCar = (vx: number, vz: number, rot: number) => {
      const car = new THREE.Group();
      car.position.set(vx, 0.8, vz);
      car.rotation.y = rot;

      // Chassis
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 4.8), carMat);
      body.castShadow = true;
      car.add(body);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.9, 2.5), glassMat);
      cabin.position.set(0, 0.95, -0.2);
      cabin.castShadow = true;
      car.add(cabin);

      // Wheels
      [
        [-1.25, -0.35, 1.4],
        [1.25, -0.35, 1.4],
        [-1.25, -0.35, -1.4],
        [1.25, -0.35, -1.4],
      ].forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.35, 8), tireMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, wy, wz);
        car.add(wheel);
      });

      // Moss patch on roof
      const moss = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 1.8), ivyMat);
      moss.position.set(0, 1.45, -0.2);
      car.add(moss);

      return car;
    };

    [
      [-4, -35, 0.2],
      [4, 28, -0.4],
      [-42, 0, 1.6],
      [55, 0, -1.4],
      [-75, 85, 0.8],
    ].forEach(([cx, cz, crot]) => {
      vehiclesGroup.add(createAbandonedCar(cx, cz, crot));
    });
    scene.add(vehiclesGroup);

    // 13. The Survival Beacons (Synchronized in Multiplayer)
    const beaconsGroup = new THREE.Group();
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

      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.4, 1.2, 8), stoneMat);
      base.castShadow = true;
      bGroup.add(base);

      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 4.5, 8), metalMat);
      pillar.position.y = 2.4;
      pillar.castShadow = true;
      bGroup.add(pillar);

      const orbMat = new THREE.MeshBasicMaterial({ color: item.color });
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), orbMat);
      orb.position.y = 4.8;
      bGroup.add(orb);

      const ringMat = new THREE.MeshBasicMaterial({ color: item.color, wireframe: true });
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.08, 8, 24), ringMat);
      ring1.position.y = 4.8;
      bGroup.add(ring1);

      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.08, 8, 24), ringMat);
      ring2.position.y = 4.8;
      ring2.rotation.x = Math.PI / 2;
      bGroup.add(ring2);

      const laserGeo = new THREE.CylinderGeometry(0.35, 0.7, 180, 8);
      laserGeo.translate(0, 90, 0);
      const laserMat = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: item.activated ? 0.95 : 0.08,
      });
      const laserPillar = new THREE.Mesh(laserGeo, laserMat);
      bGroup.add(laserPillar);

      const bLight = new THREE.PointLight(item.color, item.activated ? 8.0 : 1.2, 35);
      bLight.position.y = 5.0;
      bGroup.add(bLight);

      beaconsGroup.add(bGroup);
      beaconMeshes.push({
        group: bGroup,
        item,
        index,
        rings: [ring1, ring2],
        laserPillar,
        light: bLight,
      });
    });
    scene.add(beaconsGroup);

    // 14. Evacuation Portal Vortex
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 3.5, 0);
    const vortexGeo = new THREE.RingGeometry(3.5, 8.5, 32);
    const vortexMat = new THREE.MeshBasicMaterial({
      color: 0x90e0ef,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const portalVortex = new THREE.Mesh(vortexGeo, vortexMat);
    portalVortex.rotation.x = -Math.PI / 2;
    portalGroup.add(portalVortex);

    const portalLight = new THREE.PointLight(0x00b4d8, 1.5, 45);
    portalGroup.add(portalLight);
    scene.add(portalGroup);

    // 15. Player Reconnaissance Drone Model
    const drone = new THREE.Group();
    drone.position.set(0, 4.5, 15);

    const droneBodyMat = new THREE.MeshStandardMaterial({
      color: 0x2b2d42,
      metalness: 0.85,
      roughness: 0.25,
    });
    const droneAccentMat = new THREE.MeshStandardMaterial({
      color: gameNetwork.getLocalColor(),
      metalness: 0.9,
      roughness: 0.2,
      emissive: gameNetwork.getLocalColor(),
      emissiveIntensity: 0.6,
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 1.9), droneBodyMat);
    body.castShadow = true;
    drone.add(body);

    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), glassMat);
    cockpit.position.set(0, 0.28, 0.2);
    drone.add(cockpit);

    const rotorBlades: THREE.Mesh[] = [];
    const armCoords = [
      [-1.3, 0, 1.2],
      [1.3, 0, 1.2],
      [-1.3, 0, -1.2],
      [1.3, 0, -1.2],
    ];

    armCoords.forEach(([ax, ay, az]) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 6), metalMat);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = Math.atan2(az, ax);
      arm.position.set(ax * 0.5, 0.05, az * 0.5);
      drone.add(arm);

      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.35, 8), droneAccentMat);
      motor.position.set(ax, ay + 0.15, az);
      drone.add(motor);

      const blade = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.03, 0.18), droneBodyMat);
      blade.position.set(ax, ay + 0.35, az);
      drone.add(blade);
      rotorBlades.push(blade);
    });

    const droneHeadlight = new THREE.SpotLight(0xfff4d6, 5.0, 45, Math.PI / 5, 0.4);
    droneHeadlight.position.set(0, 0, 0.9);
    droneHeadlight.target.position.set(0, -2, 12);
    drone.add(droneHeadlight);
    drone.add(droneHeadlight.target);

    scene.add(drone);

    // 16. Multiplayer Remote Players Visualization
    const remoteDrones = new Map<string, RemoteDroneVisual>();

    // Helper to generate a crisp 3D CanvasTexture label sprite
    const createPlayerLabel = (callsign: string, colorHex: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.roundRect(4, 4, 248, 56, 12);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = colorHex;
        ctx.stroke();

        ctx.font = 'bold 22px monospace';
        ctx.fillStyle = '#111827';
        ctx.textAlign = 'center';
        ctx.fillText(callsign, 128, 38);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(4.8, 1.2, 1.0);
      sprite.position.y = 2.4;
      return sprite;
    };

    const createRemoteDroneMesh = (player: RemotePlayerState): RemoteDroneVisual => {
      const rGroup = new THREE.Group();
      rGroup.position.set(player.x, player.y, player.z);

      const rMat = new THREE.MeshStandardMaterial({
        color: player.color,
        emissive: player.color,
        emissiveIntensity: 0.5,
      });

      const rBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 1.8), rMat);
      rBody.castShadow = true;
      rGroup.add(rBody);

      const rRotors: THREE.Mesh[] = [];
      armCoords.forEach(([ax, ay, az]) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.18), droneBodyMat);
        b.position.set(ax, ay + 0.35, az);
        rGroup.add(b);
        rRotors.push(b);
      });

      const colorHex = '#' + player.color.toString(16).padStart(6, '0');
      const label = createPlayerLabel(player.callsign, colorHex);
      rGroup.add(label);

      scene.add(rGroup);

      return {
        group: rGroup,
        rotors: rRotors,
        labelSprite: label,
        targetPos: new THREE.Vector3(player.x, player.y, player.z),
        targetRotY: player.rotY,
        targetPitch: player.pitch,
        targetRoll: player.roll,
        shields: player.shields,
        color: player.color,
        callsign: player.callsign,
      };
    };

    // Network callbacks
    gameNetwork.onPlayersUpdate = (players) => {
      // Add or update remote player drones
      const activeIds = new Set<string>();

      players.forEach((p) => {
        activeIds.add(p.id);
        let visual = remoteDrones.get(p.id);
        if (!visual) {
          visual = createRemoteDroneMesh(p);
          remoteDrones.set(p.id, visual);
        }
        visual.targetPos.set(p.x, p.y, p.z);
        visual.targetRotY = p.rotY;
        visual.targetPitch = p.pitch;
        visual.targetRoll = p.roll;
        visual.shields = p.shields;
      });

      // Remove disconnected players
      for (const [id, visual] of remoteDrones.entries()) {
        if (!activeIds.has(id)) {
          scene.remove(visual.group);
          remoteDrones.delete(id);
        }
      }
    };

    gameNetwork.onEvent = (event: NetworkEvent) => {
      if (event.type === 'BEACON_ACTIVATE' && event.beaconId) {
        const b = beaconMeshes.find((bm) => bm.item.id === event.beaconId);
        if (b && !b.item.activated) {
          b.item.activated = true;
          beaconsRef.current[b.index].activated = true;
          reclamationAudio.playBeaconLaser();
          b.laserPillar.scale.set(3.5, 1, 3.5);
          (b.laserPillar.material as THREE.MeshBasicMaterial).opacity = 0.95;
          b.light.intensity = 8.0;
        }
      }
      if (event.type === 'EMP_BLAST' && event.x !== undefined && event.z !== undefined) {
        reclamationAudio.playEmpBlast();
      }
    };

    // 17. EMP Shockwave Ring
    const shockwaveGeo = new THREE.RingGeometry(0.4, 1.8, 36);
    shockwaveGeo.rotateX(-Math.PI / 2);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    scene.add(shockwaveMesh);
    let shockwaveRadius = 0;
    let isEmpExpanding = false;

    // 18. Bio-Cyber Zombies Swarm
    const zombiesGroup = new THREE.Group();
    const zombies: ZombieState[] = [];
    const zombieCount = modeSettings.zombieCount;

    const zombieSkinMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.9 });
    const cyberJointMat = new THREE.MeshStandardMaterial({ color: 0x3a0ca3, metalness: 0.8, roughness: 0.3 });

    for (let i = 0; i < zombieCount; i++) {
      const zGroup = new THREE.Group();
      const ang = Math.random() * Math.PI * 2;
      const rad = 25 + Math.random() * (townBound - 35);
      const zx = Math.cos(ang) * rad;
      const zz = Math.sin(ang) * rad;
      zGroup.position.set(zx, 0, zz);

      const isBrute = difficultyMode === 'hard' && i < 6;
      const isSprinter = difficultyMode === 'hard' && i >= 6 && i < 16;
      const zScale = isBrute ? 2.2 : isSprinter ? 0.9 : 1.0;
      zGroup.scale.set(zScale, zScale, zScale);

      // Torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.5), zombieSkinMat);
      torso.position.y = 1.3;
      torso.castShadow = true;
      zGroup.add(torso);

      // Head
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.55), zombieSkinMat);
      head.position.y = 2.3;
      head.castShadow = true;
      zGroup.add(head);

      // Cyber Glowing Eyes
      const eyeMat = new THREE.MeshBasicMaterial({ color: isSprinter ? 0xff0054 : isBrute ? 0x00f5d4 : 0xff1744 });
      [-0.14, 0.14].forEach((ex) => {
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.1), eyeMat);
        eye.position.set(ex, 2.35, 0.28);
        zGroup.add(eye);
      });

      // Flailing arms
      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.1, 0.24), cyberJointMat);
      leftArm.position.set(-0.55, 1.5, 0.35);
      leftArm.rotation.x = -0.6;
      leftArm.castShadow = true;
      zGroup.add(leftArm);

      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.1, 0.24), cyberJointMat);
      rightArm.position.set(0.55, 1.5, 0.35);
      rightArm.rotation.x = -0.6;
      rightArm.castShadow = true;
      zGroup.add(rightArm);

      zombiesGroup.add(zGroup);

      const speed = isSprinter
        ? modeSettings.zombieBaseSpeed * 1.6
        : isBrute
        ? modeSettings.zombieBaseSpeed * 0.75
        : modeSettings.zombieBaseSpeed * (0.8 + Math.random() * 0.4);

      zombies.push({
        mesh: zGroup,
        eyeMat,
        leftArm,
        rightArm,
        pos: new THREE.Vector3(zx, 0, zz),
        velocity: new THREE.Vector3(),
        speed,
        state: 'idle',
        stunTimer: 0,
        screeched: false,
        wanderAngle: Math.random() * Math.PI * 2,
        isBrute,
        isSprinter,
      });
    }
    scene.add(zombiesGroup);

    setIsLoaded(true);

    // 19. Physics & Game Loop
    let speed = 0;
    let yaw = 0;
    let pitch = 0;
    let roll = 0;
    const velocity = new THREE.Vector3();
    let prevTime = performance.now();
    let animId: number;
    let frame = 0;

    const render = (timeMs: number) => {
      animId = requestAnimationFrame(render);
      frame++;

      const delta = Math.min((timeMs - prevTime) / 1000, 0.1);
      prevTime = timeMs;
      const time = timeMs * 0.001;

      // River wave vertex ripple
      const riverPos = riverGeo.attributes.position;
      for (let r = 0; r < riverPos.count; r++) {
        const u = riverPos.getX(r);
        riverPos.setZ(r, Math.sin(u * 0.15 + time * 2.5) * 0.35);
      }
      riverGeo.computeVertexNormals();
      riverGeo.attributes.position.needsUpdate = true;

      // Input handling
      const keys = keysRef.current;
      const vIn = virtualInput || { forward: 0, turn: 0, action: false, boost: false };

      const forwardInput = (keys.forward ? 1 : 0) - (keys.backward ? 0.7 : 0) || vIn.forward;
      const turnInput = (keys.right ? 1 : 0) - (keys.left ? 1 : 0) || vIn.turn;
      const isBoosting = keys.boost || vIn.boost || false;
      const triggerAction = keys.action || vIn.action;

      // EMP Shockwave activation
      if (empCooldownRef.current < 1) {
        empCooldownRef.current = Math.min(1, empCooldownRef.current + delta * modeSettings.empCooldownRate);
      }

      if (triggerAction && empCooldownRef.current >= 0.98) {
        empCooldownRef.current = 0;
        shockwaveRadius = 1.0;
        isEmpExpanding = true;
        shockwaveMesh.position.copy(drone.position);
        shockwaveMesh.position.y = 0.4;
        reclamationAudio.playEmpBlast();
        gameNetwork.sendEmpBlast(drone.position.x, drone.position.z);
      }

      // Expand EMP shockwave
      if (isEmpExpanding) {
        shockwaveRadius += delta * 55;
        shockwaveMesh.scale.set(shockwaveRadius, shockwaveRadius, 1);
        shockwaveMat.opacity = Math.max(0, 1 - shockwaveRadius / 38);

        zombies.forEach((z) => {
          if (drone.position.distanceTo(z.pos) < shockwaveRadius + 2.5) {
            z.state = 'stunned';
            z.stunTimer = 4.5;
            z.eyeMat.color.setHex(0x00f5d4);
            z.velocity.add(
              z.pos.clone().sub(drone.position).normalize().multiplyScalar(isBoosting ? 26 : 18)
            );
          }
        });

        if (shockwaveRadius >= 38) {
          isEmpExpanding = false;
          shockwaveMat.opacity = 0;
        }
      }

      // Drone flight dynamics (tuned for slow, smooth, cinematic and controlled flight)
      const maxForwardSpeed = isBoosting ? 12.0 : 6.8;
      const maxReverseSpeed = -3.2;
      const accel = isBoosting ? 16 : 8.5;

      speed += forwardInput * accel * delta;
      speed *= Math.pow(0.80, delta * 60);
      speed = Math.max(maxReverseSpeed, Math.min(maxForwardSpeed, speed));
      yaw -= turnInput * 2.0 * delta;

      pitch = THREE.MathUtils.lerp(pitch, forwardInput * -0.2, delta * 6);
      roll = THREE.MathUtils.lerp(roll, -turnInput * 0.3, delta * 6);

      velocity.set(Math.sin(yaw) * speed, 0, Math.cos(yaw) * speed);
      drone.position.addScaledVector(velocity, delta);

      // Keep within bounds
      drone.position.x = Math.max(-townBound + 5, Math.min(townBound - 5, drone.position.x));
      drone.position.z = Math.max(-townBound + 5, Math.min(townBound - 5, drone.position.z));

      // Terrain altitude adaptation
      const gHeight = getTerrainHeight(drone.position.x, drone.position.z);
      const targetAltitude = Math.max(3.2, gHeight + 3.8 + Math.sin(time * 3.5) * 0.2);
      drone.position.y = THREE.MathUtils.lerp(drone.position.y, targetAltitude, delta * 4);

      drone.rotation.set(pitch, yaw, roll);

      // Spin propellers
      const rotorSpeed = (isBoosting ? 55 : 28) * delta;
      rotorBlades.forEach((r, idx) => {
        r.rotation.y += (idx % 2 === 0 ? 1 : -1) * rotorSpeed;
      });

      // Camera follow with cinematic morning framing
      const camOffset = new THREE.Vector3(
        -Math.sin(yaw) * 11.5,
        4.8 + Math.max(0, -pitch * 3),
        -Math.cos(yaw) * 11.5
      );
      const targetCamPos = drone.position.clone().add(camOffset);
      camera.position.lerp(targetCamPos, delta * 5.5);
      camera.lookAt(drone.position.clone().add(new THREE.Vector3(0, 0.8, 0)));

      // Broadcast local drone telemetry to multiplayer network (10Hz)
      if (frame % 6 === 0) {
        gameNetwork.broadcastTelemetry({
          x: drone.position.x,
          y: drone.position.y,
          z: drone.position.z,
          rotY: yaw,
          pitch,
          roll,
          speed,
          shields: shieldsRef.current,
          maxShields: maxShieldsRef.current,
          empActive: isEmpExpanding,
        });
      }

      // Smooth interpolation for remote player drones
      remoteDrones.forEach((visual) => {
        visual.group.position.lerp(visual.targetPos, delta * 12);
        visual.group.rotation.y = THREE.MathUtils.lerp(visual.group.rotation.y, visual.targetRotY, delta * 12);
        visual.group.rotation.x = THREE.MathUtils.lerp(visual.group.rotation.x, visual.targetPitch, delta * 12);
        visual.group.rotation.z = THREE.MathUtils.lerp(visual.group.rotation.z, visual.targetRoll, delta * 12);

        // Spin remote rotors
        visual.rotors.forEach((r) => {
          r.rotation.y += delta * 30;
        });
      });

      // Shield regeneration
      if (time - lastDamageTimeRef.current > 4.5 && shieldsRef.current < maxShieldsRef.current) {
        shieldsRef.current = Math.min(maxShieldsRef.current, shieldsRef.current + delta * 12);
      }

      // Zombie AI (Flocking + Chasing + Attack)
      let chasingCount = 0;
      zombies.forEach((z, idx) => {
        z.mesh.position.copy(z.pos);

        // Velocity knockback decay
        if (z.velocity.lengthSq() > 0.01) {
          z.pos.addScaledVector(z.velocity, delta);
          z.velocity.multiplyScalar(0.9);
        }

        const distToDrone = drone.position.distanceTo(z.pos);

        if (z.state === 'stunned') {
          z.stunTimer -= delta;
          z.leftArm.rotation.x = Math.sin(time * 20) * 0.2;
          z.rightArm.rotation.x = Math.sin(time * 20) * 0.2;
          if (z.stunTimer <= 0) {
            z.state = 'idle';
            z.eyeMat.color.setHex(z.isSprinter ? 0xff0054 : z.isBrute ? 0x00f5d4 : 0xff1744);
          }
          return;
        }

        const isNear = distToDrone < modeSettings.chaseRadius;
        if (isNear) {
          z.state = 'chase';
          chasingCount++;

          if (!z.screeched && Math.random() < 0.12) {
            z.screeched = true;
            reclamationAudio.playZombieScreech();
          }

          const dir = drone.position.clone().sub(z.pos);
          dir.y = 0;
          dir.normalize();

          // Flocking separation
          const separation = new THREE.Vector3();
          zombies.forEach((other, oIdx) => {
            if (idx !== oIdx) {
              const d = z.pos.distanceTo(other.pos);
              if (d < 3.5 && d > 0) {
                separation.add(z.pos.clone().sub(other.pos).normalize().multiplyScalar((3.5 - d) * 0.8));
              }
            }
          });

          dir.add(separation).normalize();

          const currentZSpeed = z.speed * (distToDrone < 10 ? 1.35 : 1.0);
          z.pos.add(dir.multiplyScalar(currentZSpeed * delta));
          z.mesh.lookAt(new THREE.Vector3(drone.position.x, z.pos.y, drone.position.z));

          z.leftArm.rotation.x = -0.5 + Math.sin(time * 9 + idx) * 0.6;
          z.rightArm.rotation.x = -0.5 - Math.sin(time * 9 + idx) * 0.6;

          // Drone damage contact
          if (distToDrone < 3.8) {
            const damagePerSec = z.isBrute ? 35 : 20;
            shieldsRef.current = Math.max(0, shieldsRef.current - delta * damagePerSec);
            lastDamageTimeRef.current = time;
            if (onDamageTaken) onDamageTaken(Math.round(shieldsRef.current));
            if (frame % 20 === 0) reclamationAudio.playShieldHit();
          }
        } else {
          z.state = 'idle';
          z.screeched = false;
          z.wanderAngle += (Math.random() - 0.5) * 0.1;
          z.pos.x += Math.cos(z.wanderAngle) * 0.04;
          z.pos.z += Math.sin(z.wanderAngle) * 0.04;
        }

        z.pos.x = Math.max(-townBound, Math.min(townBound, z.pos.x));
        z.pos.z = Math.max(-townBound, Math.min(townBound, z.pos.z));
      });

      // Beacon Activation & Synchronization
      let nearestDist = 9999;
      let nearestName = 'SCANNING ARENA...';

      beaconMeshes.forEach(({ group, item, index, rings, laserPillar, light }) => {
        rings[0].rotation.z += 0.03;
        rings[1].rotation.y += 0.02;

        const dist = drone.position.distanceTo(group.position);
        if (!item.activated && dist < nearestDist) {
          nearestDist = dist;
          nearestName = `${item.id}: ${item.name}`;
        }

        if (!item.activated && (dist < 5.2 || (dist < 18 && isEmpExpanding))) {
          item.activated = true;
          beaconsRef.current[index].activated = true;
          reclamationAudio.playBeaconLaser();
          gameNetwork.sendBeaconActivated(item.id);
          onActivateBeacon(item, index);

          laserPillar.scale.set(3.5, 1, 3.5);
          (laserPillar.material as THREE.MeshBasicMaterial).opacity = 0.95;
          light.intensity = 8.0;

          // Clear nearby zombies
          zombies.forEach((z) => {
            if (group.position.distanceTo(z.pos) < 30) {
              z.state = 'stunned';
              z.stunTimer = 5.0;
              z.velocity.add(z.pos.clone().sub(group.position).normalize().multiplyScalar(18));
            }
          });

          const remaining = beaconsRef.current.filter((b) => !b.activated).length;
          if (remaining === 0 && !allActivatedRef.current) {
            allActivatedRef.current = true;
            reclamationAudio.playWarpPortalSound();
            (portalVortex.material as THREE.MeshBasicMaterial).color.setHex(0x2ec4b6);
            (portalVortex.material as THREE.MeshBasicMaterial).opacity = 0.9;
            portalLight.intensity = 8.0;
          }
        }
      });

      // Portal Entry
      if (allActivatedRef.current) {
        portalVortex.rotation.z += 0.04;
        if (drone.position.distanceTo(portalGroup.position) < 10) {
          onEnterPortal();
        }
      }

      // Update Telemetry
      if (frame % 4 === 0) {
        const activeCount = beaconsRef.current.filter((b) => b.activated).length;
        onUpdateTelemetry({
          speed: Math.abs(speed) * 3.6,
          altitude: drone.position.y,
          heading: Math.round((((yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI)),
          shields: Math.round(shieldsRef.current),
          maxShields: maxShieldsRef.current,
          empCooldown: empCooldownRef.current,
          nearestDist: Math.round(nearestDist),
          nearestName,
          zombieCount,
          zombiesChasing: chasingCount,
          activeBeacons: activeCount,
          totalBeacons: beaconsRef.current.length,
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
      gameNetwork.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    difficultyMode,
    modeSettings.beaconCount,
    modeSettings.chaseRadius,
    modeSettings.empCooldownRate,
    modeSettings.fogDensity,
    modeSettings.maxShields,
    modeSettings.zombieBaseSpeed,
    modeSettings.zombieCount,
    onActivateBeacon,
    onDamageTaken,
    onEnterPortal,
    onUpdateTelemetry,
    virtualInput,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-screen overflow-hidden bg-[#aed9e0]"
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#b8e0d2] z-50">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-600/30 border-t-emerald-600 animate-spin mb-4" />
          <span className="text-xs text-emerald-900 font-mono tracking-widest uppercase font-bold">
            EXPANDING VAST METROPOLIS & MULTIPLAYER RADAR...
          </span>
        </div>
      )}
    </div>
  );
}
