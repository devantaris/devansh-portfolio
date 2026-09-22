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

  // Difficulty configurations (fast, responsive, balanced)
  const modeSettings = {
    easy: {
      maxShields: 200,
      empCooldownRate: 1 / 3.0,
      zombieCount: 20,
      zombieBaseSpeed: 8.5,
      chaseRadius: 28,
      beaconCount: 3,
      fogDensity: 0.003,
    },
    medium: {
      maxShields: 100,
      empCooldownRate: 1 / 5.0,
      zombieCount: 36,
      zombieBaseSpeed: 13.0,
      chaseRadius: 36,
      beaconCount: 4,
      fogDensity: 0.0045,
    },
    hard: {
      maxShields: 60,
      empCooldownRate: 1 / 7.5,
      zombieCount: 56,
      zombieBaseSpeed: 18.0,
      chaseRadius: 48,
      beaconCount: 5,
      fogDensity: 0.0065,
    },
  }[difficultyMode];

  // Beacons distributed across the expanded 420x420 metropolis
  const allPossibleBeacons: BeaconItem[] = [
    {
      id: 'ALPHA',
      name: 'SUBURBAN PLAZA',
      location: 'RESIDENTIAL BOULEVARD // 0x404_A',
      pos: [-60, 3.2, -55],
      activated: false,
      color: 0x00f5d4,
    },
    {
      id: 'BETA',
      name: 'RIVER ARCH BRIDGE',
      location: 'CANAL CROSSING // 0x404_B',
      pos: [-30, 4.0, 22],
      activated: false,
      color: 0x70d6ff,
    },
    {
      id: 'GAMMA',
      name: 'SKYSCRAPER PLAZA',
      location: 'TECH CORE MONOLITH // 0x404_C',
      pos: [75, 3.5, -65],
      activated: false,
      color: 0xff9e00,
    },
    {
      id: 'DELTA',
      name: 'BOTANICAL OVERLOOK',
      location: 'VALLEY RIDGE // 0x404_D',
      pos: [85, 5.8, 80],
      activated: false,
      color: 0xe0aaff,
    },
    {
      id: 'EPSILON',
      name: 'HIGHWAY RUINS',
      location: 'ELEVATED FREEWAY // 0x404_E',
      pos: [-100, 4.5, 95],
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

    gameNetwork.connect();

    // 1. Scene & Crisp Morning Sky
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7ec8e3);
    scene.fog = new THREE.FogExp2(0x9bd7e8, modeSettings.fogDensity);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 800);
    camera.position.set(0, 9, 20);

    // 3. Renderer with High-End Tonemapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x7ec8e3, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 4. Balanced Daylight Lighting
    const ambientLight = new THREE.AmbientLight(0xdcebf7, 0.55);
    scene.add(ambientLight);

    const morningSun = new THREE.DirectionalLight(0xfff6e6, 2.0);
    morningSun.position.set(120, 110, -90);
    morningSun.castShadow = true;
    morningSun.shadow.mapSize.width = 2048;
    morningSun.shadow.mapSize.height = 2048;
    morningSun.shadow.camera.near = 10;
    morningSun.shadow.camera.far = 400;
    morningSun.shadow.bias = -0.0006;
    const sD = 75; // Sharp shadow radius centered around player
    morningSun.shadow.camera.left = -sD;
    morningSun.shadow.camera.right = sD;
    morningSun.shadow.camera.top = sD;
    morningSun.shadow.camera.bottom = -sD;
    scene.add(morningSun);
    scene.add(morningSun.target);

    const hemiLight = new THREE.HemisphereLight(0x7ec8e3, 0x2d6a4f, 0.4);
    scene.add(hemiLight);

    // 5. Vast Undulating Terrain (420x420)
    const mapSize = 440;
    const terrainGeo = new THREE.PlaneGeometry(mapSize, mapSize, 110, 110);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);

    const getTerrainHeight = (gx: number, gz: number) => {
      const riverDist = Math.abs(gz - (gx * 0.75 + 20));
      if (riverDist < 18) {
        return -2.6 + Math.sin(gx * 0.1) * 0.4;
      }
      const hill =
        Math.sin(gx * 0.02) * Math.cos(gz * 0.02) * 3.8 +
        Math.sin(gx * 0.04 + gz * 0.03) * 1.4;
      return Math.max(-0.2, hill);
    };

    for (let i = 0; i < posAttr.count; i++) {
      const gx = posAttr.getX(i);
      const gz = posAttr.getZ(i);
      const h = getTerrainHeight(gx, gz);
      posAttr.setY(i, h);

      const riverDist = Math.abs(gz - (gx * 0.75 + 20));
      const isMainAvenue = Math.abs(gx) < 7 && gz > -160 && gz < 160;
      const isCrossBoulevard = Math.abs(gz) < 7 && gx > -160 && gx < 160;
      const isPathway = Math.abs(gx - 45) < 3 || Math.abs(gx + 45) < 3 || Math.abs(gz - 50) < 3;

      if (riverDist < 18) {
        // Wet river pebble slate
        colors[i * 3] = 0.16;
        colors[i * 3 + 1] = 0.24;
        colors[i * 3 + 2] = 0.22;
      } else if (riverDist < 26) {
        // Lush riverbank grass
        colors[i * 3] = 0.22;
        colors[i * 3 + 1] = 0.50;
        colors[i * 3 + 2] = 0.26;
      } else if (isMainAvenue || isCrossBoulevard) {
        // Dark asphalt tarmac
        colors[i * 3] = 0.14;
        colors[i * 3 + 1] = 0.15;
        colors[i * 3 + 2] = 0.16;
      } else if (isPathway) {
        // Cobblestone walking path
        colors[i * 3] = 0.45;
        colors[i * 3 + 1] = 0.48;
        colors[i * 3 + 2] = 0.43;
      } else {
        // Rich vibrant green meadow
        const noise = Math.sin(gx * 0.2) * 0.04;
        colors[i * 3] = 0.18 + noise;
        colors[i * 3 + 1] = 0.52 + noise;
        colors[i * 3 + 2] = 0.22;
      }
    }

    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.05,
    });
    const metropolisTerrain = new THREE.Mesh(terrainGeo, terrainMat);
    metropolisTerrain.receiveShadow = true;
    scene.add(metropolisTerrain);

    // 6. Flowing Daylight River
    const riverGeo = new THREE.PlaneGeometry(420, 32, 60, 10);
    riverGeo.rotateX(-Math.PI / 2);
    riverGeo.rotateY(0.64);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x1d7874,
      roughness: 0.12,
      metalness: 0.9,
      transparent: true,
      opacity: 0.9,
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.position.set(0, -1.8, 20);
    riverMesh.receiveShadow = true;
    scene.add(riverMesh);

    // 7. Stone Arched Bridges
    const bridgeGroup = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x5a6065, roughness: 0.75 });
    const railingMat = new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.6 });

    const createStoneBridge = (bx: number, bz: number, angle: number) => {
      const bridge = new THREE.Group();
      bridge.position.set(bx, 1.2, bz);
      bridge.rotation.y = angle;

      const deck = new THREE.Mesh(new THREE.BoxGeometry(11, 1.2, 38), stoneMat);
      deck.castShadow = true;
      deck.receiveShadow = true;
      bridge.add(deck);

      [-12, 0, 12].forEach((pz) => {
        const pier = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 3.5), stoneMat);
        pier.position.set(0, -2.8, pz);
        pier.castShadow = true;
        bridge.add(pier);
      });

      [-5.6, 5.6].forEach((rx) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.3, 38), railingMat);
        rail.position.set(rx, 1.2, 0);
        rail.castShadow = true;
        bridge.add(rail);
      });

      return bridge;
    };

    bridgeGroup.add(createStoneBridge(-30, 22, -0.9));
    bridgeGroup.add(createStoneBridge(65, 95, -0.9));
    scene.add(bridgeGroup);

    // 8. Perimeter Defensive Laser Posts (420x420)
    const perimeterGroup = new THREE.Group();
    const fenceMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.7 });
    const postMat = new THREE.MeshStandardMaterial({ color: 0x1b263b, roughness: 0.5 });

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

    // 9. Realistic Residential Houses
    const housesGroup = new THREE.Group();
    const wallMats = [
      new THREE.MeshStandardMaterial({ color: 0xf4f1de, roughness: 0.65 }),
      new THREE.MeshStandardMaterial({ color: 0xd8e2dc, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xbc6c25, roughness: 0.75 }),
      new THREE.MeshStandardMaterial({ color: 0xdda15e, roughness: 0.7 }),
    ];

    const roofMats = [
      new THREE.MeshStandardMaterial({ color: 0x780000, roughness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0x495057, roughness: 0.65 }),
    ];

    const woodTrimMat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.5 });
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

      const fGeo = new THREE.BoxGeometry(hw + 0.5, 0.6, hd + 0.5);
      const foundation = new THREE.Mesh(fGeo, stoneMat);
      foundation.position.y = 0.3;
      foundation.receiveShadow = true;
      house.add(foundation);

      const bodyGeo = new THREE.BoxGeometry(hw, hh, hd);
      const bodyMat = wallMats[styleIdx % wallMats.length];
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = hh / 2 + 0.6;
      body.castShadow = true;
      body.receiveShadow = true;
      house.add(body);

      const roofGeo = new THREE.ConeGeometry(hw * 0.76, 3.8, 4);
      const roofMat = roofMats[styleIdx % roofMats.length];
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = hh + 2.5;
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(1.15, 1, 0.95);
      roof.castShadow = true;
      roof.receiveShadow = true;
      house.add(roof);

      const dormer = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 2.0), bodyMat);
      dormer.position.set(0, hh + 1.8, hd / 2 - 0.5);
      dormer.castShadow = true;
      house.add(dormer);
      const dormerWin = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.0), glassMat);
      dormerWin.position.set(0, hh + 1.8, hd / 2 + 0.55);
      house.add(dormerWin);

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

      const door = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.4), doorMat);
      door.position.set(0, 1.8, hd / 2 + 0.05);
      house.add(door);

      [-2.8, 2.8].forEach((wx) => {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.8), glassMat);
        win.position.set(wx, 2.6, hd / 2 + 0.05);
        house.add(win);
      });

      const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.0, 1.4), roofMats[0]);
      chimney.position.set(3.2, hh + 2.4, -1.8);
      chimney.castShadow = true;
      house.add(chimney);

      const garage = new THREE.Mesh(new THREE.BoxGeometry(6.0, 3.6, 7.5), bodyMat);
      garage.position.set(hw / 2 + 3.0, 1.8, 0);
      garage.castShadow = true;
      house.add(garage);
      const garageDoor = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.8), woodTrimMat);
      garageDoor.position.set(hw / 2 + 3.0, 1.5, 7.5 / 2 + 0.05);
      house.add(garageDoor);

      for (let v = 0; v < 3; v++) {
        const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, hh + 2, 6), ivyMat);
        vine.position.set((v - 1) * 3.4, (hh + 2) / 2, hd / 2 + 0.15);
        vine.rotation.z = (v - 1) * 0.06;
        house.add(vine);
      }

      const mailbox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.7), woodTrimMat);
      mailbox.position.set(4.2, 1.3, hd / 2 + 3.8);
      house.add(mailbox);

      return house;
    };

    const houseConfigs = [
      { x: -75, z: -75, r: 0.1, s: 1.0, idx: 0 },
      { x: -50, z: -80, r: -0.05, s: 1.05, idx: 1 },
      { x: -25, z: -80, r: 0.1, s: 0.95, idx: 2 },
      { x: -80, z: -45, r: Math.PI / 2, s: 1.0, idx: 3 },
      { x: -80, z: -20, r: Math.PI / 2 - 0.1, s: 1.0, idx: 0 },
      { x: -55, z: -25, r: Math.PI - 0.1, s: 1.05, idx: 1 },
      { x: -30, z: -25, r: Math.PI + 0.05, s: 0.95, idx: 2 },
      { x: -55, z: 0, r: 0.05, s: 1.0, idx: 3 },
      { x: -80, z: 25, r: Math.PI / 2, s: 1.0, idx: 0 },
      { x: -55, z: 35, r: -0.1, s: 1.05, idx: 1 },
      { x: 50, z: -25, r: -Math.PI / 2, s: 1.0, idx: 0 },
      { x: 50, z: 0, r: -Math.PI / 2 + 0.05, s: 1.05, idx: 1 },
      { x: 50, z: 25, r: -Math.PI / 2 - 0.05, s: 0.95, idx: 2 },
      { x: 85, z: -25, r: Math.PI / 2, s: 1.0, idx: 3 },
      { x: 85, z: 0, r: Math.PI / 2, s: 1.0, idx: 0 },
      { x: 85, z: 25, r: Math.PI / 2, s: 1.05, idx: 1 },
    ];

    houseConfigs.forEach((h) => {
      housesGroup.add(createRealisticHouse(h.x, h.z, h.r, h.s, h.idx));
    });
    scene.add(housesGroup);

    // 10. Multi-Storey Skyscrapers & Commercial Core
    const towersGroup = new THREE.Group();
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x6c757d, roughness: 0.6, metalness: 0.2 });
    const darkTowerMat = new THREE.MeshStandardMaterial({ color: 0x1b263b, roughness: 0.4, metalness: 0.5 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x415a77, roughness: 0.35, metalness: 0.8 });
    const warningRedMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });

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

      const coreMat = style === 'glass' ? glassMat : style === 'brutalist' ? concreteMat : darkTowerMat;
      const core = new THREE.Mesh(new THREE.BoxGeometry(width, totalH, depth), coreMat);
      core.position.y = totalH / 2;
      core.castShadow = true;
      core.receiveShadow = true;
      tower.add(core);

      for (let f = 1; f < floors; f++) {
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(width + 0.6, 0.4, depth + 0.6),
          concreteMat
        );
        slab.position.y = f * floorHeight;
        slab.castShadow = true;
        tower.add(slab);
      }

      const feX = width / 2 + 0.6;
      for (let f = 1; f < floors; f += 2) {
        const platform = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 3.2), metalMat);
        platform.position.set(feX, f * floorHeight, 0);
        tower.add(platform);

        const ladder = new THREE.Mesh(new THREE.BoxGeometry(0.15, floorHeight * 2, 0.8), metalMat);
        ladder.position.set(feX, (f + 1) * floorHeight, 1.2);
        tower.add(ladder);
      }

      const roofH = totalH;
      const ph = new THREE.Mesh(new THREE.BoxGeometry(width * 0.45, 3.2, depth * 0.45), concreteMat);
      ph.position.set(0, roofH + 1.6, 0);
      ph.castShadow = true;
      tower.add(ph);

      const tankStilts = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.0, 4), metalMat);
      tankStilts.position.set(width * 0.25, roofH + 1.5, depth * 0.25);
      const waterTank = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 2.4, 12), roofMats[0]);
      waterTank.position.set(width * 0.25, roofH + 3.8, depth * 0.25);
      waterTank.castShadow = true;
      tower.add(tankStilts);
      tower.add(waterTank);

      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 9.0, 6), metalMat);
      antenna.position.set(-width * 0.2, roofH + 4.5, -depth * 0.2);
      const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), warningRedMat);
      beaconLight.position.set(-width * 0.2, roofH + 9.0, -depth * 0.2);
      tower.add(antenna);
      tower.add(beaconLight);

      return tower;
    };

    const towerConfigs = [
      { x: 40, z: -85, f: 8, w: 16, d: 16, s: 'glass' as const },
      { x: 70, z: -90, f: 12, w: 18, d: 18, s: 'brutalist' as const },
      { x: 100, z: -85, f: 14, w: 20, d: 20, s: 'glass' as const },
      { x: 40, z: -55, f: 6, w: 14, d: 14, s: 'industrial' as const },
      { x: 75, z: -55, f: 10, w: 17, d: 17, s: 'glass' as const },
      { x: 110, z: -55, f: 8, w: 15, d: 15, s: 'brutalist' as const },
      { x: -115, z: -80, f: 7, w: 16, d: 16, s: 'industrial' as const },
      { x: -115, z: -45, f: 9, w: 18, d: 18, s: 'brutalist' as const },
      { x: -115, z: 45, f: 8, w: 16, d: 16, s: 'glass' as const },
      { x: -115, z: 80, f: 11, w: 19, d: 19, s: 'brutalist' as const },
      { x: 25, z: 125, f: 7, w: 15, d: 15, s: 'industrial' as const },
      { x: 60, z: 130, f: 9, w: 17, d: 17, s: 'glass' as const },
    ];

    towerConfigs.forEach((tc) => {
      towersGroup.add(createMultiStoreyTower(tc.x, tc.z, tc.f, tc.w, tc.d, tc.s));
    });

    const skybridge = new THREE.Mesh(new THREE.BoxGeometry(24, 3.8, 3.8), glassMat);
    skybridge.position.set(55, 24, -87.5);
    skybridge.castShadow = true;
    towersGroup.add(skybridge);
    scene.add(towersGroup);

    // 11. Realistic Organic Trees (Well Away From Spawn Area)
    const treesGroup = new THREE.Group();
    const oakTrunkMat = new THREE.MeshStandardMaterial({ color: 0x2b1d14, roughness: 0.9 });
    const leafForestMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.8 });
    const leafSunMat = new THREE.MeshStandardMaterial({ color: 0x40916c, roughness: 0.75 });
    const leafWillowMat = new THREE.MeshStandardMaterial({ color: 0x52b788, roughness: 0.8 });
    const leafPineMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.7 });

    const createRealisticTree = (
      tx: number,
      tz: number,
      type: 'oak' | 'willow' | 'pine',
      scale = 1
    ) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);
      tree.scale.set(scale, scale, scale);

      if (type === 'pine') {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.5, 10, 8), oakTrunkMat);
        trunk.position.y = 5;
        trunk.castShadow = true;
        tree.add(trunk);

        [
          { y: 5.0, r: 3.6, h: 4.0 },
          { y: 7.6, r: 2.8, h: 3.5 },
          { y: 10.0, r: 2.0, h: 3.0 },
          { y: 12.2, r: 1.1, h: 2.4 },
        ].forEach((tier) => {
          const cone = new THREE.Mesh(new THREE.ConeGeometry(tier.r, tier.h, 7), leafPineMat);
          cone.position.y = tier.y;
          cone.castShadow = true;
          tree.add(cone);
        });
      } else if (type === 'willow') {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.7, 6.0, 8), oakTrunkMat);
        trunk.position.y = 3.0;
        trunk.castShadow = true;
        tree.add(trunk);

        const dome = new THREE.Mesh(new THREE.SphereGeometry(3.6, 12, 10), leafWillowMat);
        dome.position.y = 6.8;
        dome.scale.set(1.2, 0.85, 1.2);
        dome.castShadow = true;
        tree.add(dome);

        for (let a = 0; a < 6; a++) {
          const ang = (a / 6) * Math.PI * 2;
          const tendril = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4.0, 4), leafWillowMat);
          tendril.position.set(Math.cos(ang) * 3.2, 4.0, Math.sin(ang) * 3.2);
          tree.add(tendril);
        }
      } else {
        // Natural broadleaf oak
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.8, 7.0, 8), oakTrunkMat);
        trunk.position.y = 3.5;
        trunk.castShadow = true;
        tree.add(trunk);

        // Clustered leafy puffs
        [
          { x: 0, y: 8.0, z: 0, r: 3.2, m: leafForestMat },
          { x: -1.8, y: 7.0, z: 1.2, r: 2.4, m: leafSunMat },
          { x: 1.8, y: 7.2, z: -1.0, r: 2.5, m: leafForestMat },
          { x: 0.6, y: 7.6, z: 1.8, r: 2.2, m: leafSunMat },
        ].forEach((cl) => {
          const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(cl.r, 2), cl.m);
          puff.position.set(cl.x, cl.y, cl.z);
          puff.castShadow = true;
          tree.add(puff);
        });
      }

      return tree;
    };

    // Planted safely away from spawn (0, 0)
    const treeLocs: [number, number, 'oak' | 'willow' | 'pine'][] = [
      [-40, -45, 'oak'], [-40, -15, 'oak'], [-40, 15, 'oak'],
      [40, -45, 'oak'], [40, -15, 'oak'], [40, 15, 'oak'],
      // River willows
      [-38, 10, 'willow'], [-15, 30, 'willow'], [12, 46, 'willow'], [38, 65, 'willow'],
      // Hills conifers
      [-95, -110, 'pine'], [-75, -115, 'pine'], [-55, -110, 'pine'],
      [115, -110, 'pine'], [135, -95, 'pine'], [145, -70, 'pine'],
      [-120, 110, 'pine'], [-100, 125, 'pine'],
      [110, 85, 'oak'], [135, 30, 'oak'],
    ];

    treeLocs.forEach(([tx, tz, tType]) => {
      treesGroup.add(createRealisticTree(tx, tz, tType, 1.0 + Math.random() * 0.25));
    });
    scene.add(treesGroup);

    // 12. The Survival Beacons
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

    // 13. Evacuation Portal Vortex
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 3.5, 0);
    const vortexGeo = new THREE.RingGeometry(3.5, 8.5, 32);
    const vortexMat = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const portalVortex = new THREE.Mesh(vortexGeo, vortexMat);
    portalVortex.rotation.x = -Math.PI / 2;
    portalGroup.add(portalVortex);

    const portalLight = new THREE.PointLight(0x00f5d4, 1.5, 45);
    portalGroup.add(portalLight);
    scene.add(portalGroup);

    // 14. Sleek Aerodynamic Recon Drone
    const drone = new THREE.Group();
    drone.position.set(0, 4.5, 0);

    const droneBodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a24,
      metalness: 0.9,
      roughness: 0.2,
    });
    const droneAccentMat = new THREE.MeshStandardMaterial({
      color: gameNetwork.getLocalColor(),
      metalness: 0.95,
      roughness: 0.15,
      emissive: gameNetwork.getLocalColor(),
      emissiveIntensity: 0.8,
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 1.8), droneBodyMat);
    body.castShadow = true;
    drone.add(body);

    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.5, 14, 14), glassMat);
    cockpit.position.set(0, 0.26, 0.2);
    drone.add(cockpit);

    const rotorBlades: THREE.Mesh[] = [];
    const armCoords = [
      [-1.25, 0, 1.15],
      [1.25, 0, 1.15],
      [-1.25, 0, -1.15],
      [1.25, 0, -1.15],
    ];

    armCoords.forEach(([ax, ay, az]) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.4, 6), metalMat);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = Math.atan2(az, ax);
      arm.position.set(ax * 0.5, 0.05, az * 0.5);
      drone.add(arm);

      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.32, 8), droneAccentMat);
      motor.position.set(ax, ay + 0.15, az);
      drone.add(motor);

      const blade = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.025, 0.16), droneBodyMat);
      blade.position.set(ax, ay + 0.32, az);
      drone.add(blade);
      rotorBlades.push(blade);
    });

    const droneHeadlight = new THREE.SpotLight(0xfff6e6, 4.5, 55, Math.PI / 5, 0.4);
    droneHeadlight.position.set(0, 0, 0.9);
    droneHeadlight.target.position.set(0, -2, 14);
    drone.add(droneHeadlight);
    drone.add(droneHeadlight.target);

    scene.add(drone);

    // 15. Multiplayer Remote Players Visualization
    const remoteDrones = new Map<string, RemoteDroneVisual>();

    const createPlayerLabel = (callsign: string, colorHex: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(10, 15, 25, 0.88)';
        ctx.roundRect(4, 4, 248, 56, 12);
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = colorHex;
        ctx.stroke();

        ctx.font = 'bold 20px monospace';
        ctx.fillStyle = '#ffffff';
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
        emissiveIntensity: 0.6,
      });

      const rBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 1.8), rMat);
      rBody.castShadow = true;
      rGroup.add(rBody);

      const rRotors: THREE.Mesh[] = [];
      armCoords.forEach(([ax, ay, az]) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.16), droneBodyMat);
        b.position.set(ax, ay + 0.32, az);
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

    gameNetwork.onPlayersUpdate = (players) => {
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

    // 16. EMP Shockwave Ring
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

    // 17. Sleek Cyber-Revenant Mutant Swarm
    const zombiesGroup = new THREE.Group();
    const zombies: ZombieState[] = [];
    const zombieCount = modeSettings.zombieCount;

    const exoMat = new THREE.MeshStandardMaterial({ color: 0x161a1d, roughness: 0.4, metalness: 0.8 });
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });

    for (let i = 0; i < zombieCount; i++) {
      const zGroup = new THREE.Group();
      const ang = Math.random() * Math.PI * 2;
      const rad = 30 + Math.random() * (townBound - 40);
      const zx = Math.cos(ang) * rad;
      const zz = Math.sin(ang) * rad;
      zGroup.position.set(zx, 0, zz);

      const isBrute = difficultyMode === 'hard' && i < 6;
      const isSprinter = difficultyMode === 'hard' && i >= 6 && i < 16;
      const zScale = isBrute ? 2.0 : isSprinter ? 0.9 : 1.0;
      zGroup.scale.set(zScale, zScale, zScale);

      // Armored Torso with glowing core
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.45), exoMat);
      torso.position.y = 1.3;
      torso.castShadow = true;
      zGroup.add(torso);

      const reactorCore = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.48), coreMat);
      reactorCore.position.set(0, 1.4, 0.05);
      zGroup.add(reactorCore);

      // Sleek Cyber Head with Visor Slit
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.5), exoMat);
      head.position.y = 2.25;
      head.castShadow = true;
      zGroup.add(head);

      const eyeMat = new THREE.MeshBasicMaterial({ color: isSprinter ? 0xff0054 : isBrute ? 0x00f5d4 : 0xff1744 });
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.1), eyeMat);
      visor.position.set(0, 2.3, 0.26);
      zGroup.add(visor);

      // Hydraulic arms
      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.0, 0.2), exoMat);
      leftArm.position.set(-0.5, 1.4, 0.25);
      leftArm.rotation.x = -0.5;
      leftArm.castShadow = true;
      zGroup.add(leftArm);

      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.0, 0.2), exoMat);
      rightArm.position.set(0.5, 1.4, 0.25);
      rightArm.rotation.x = -0.5;
      rightArm.castShadow = true;
      zGroup.add(rightArm);

      zombiesGroup.add(zGroup);

      const speed = isSprinter
        ? modeSettings.zombieBaseSpeed * 1.5
        : isBrute
        ? modeSettings.zombieBaseSpeed * 0.75
        : modeSettings.zombieBaseSpeed * (0.85 + Math.random() * 0.3);

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

    // 18. Physics & Game Loop (High-Speed, Exhilarating Flight Dynamics)
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

      if (isEmpExpanding) {
        shockwaveRadius += delta * 60;
        shockwaveMesh.scale.set(shockwaveRadius, shockwaveRadius, 1);
        shockwaveMat.opacity = Math.max(0, 1 - shockwaveRadius / 42);

        zombies.forEach((z) => {
          if (drone.position.distanceTo(z.pos) < shockwaveRadius + 2.5) {
            z.state = 'stunned';
            z.stunTimer = 4.5;
            z.eyeMat.color.setHex(0x00f5d4);
            z.velocity.add(
              z.pos.clone().sub(drone.position).normalize().multiplyScalar(isBoosting ? 28 : 20)
            );
          }
        });

        if (shockwaveRadius >= 42) {
          isEmpExpanding = false;
          shockwaveMat.opacity = 0;
        }
      }

      // HIGH-SPEED RESPONSIVE DRONE FLIGHT DYNAMICS
      const targetSpeed = forwardInput > 0
        ? (isBoosting ? 38.0 : 22.0) * forwardInput
        : forwardInput < 0
        ? -11.0 * Math.abs(forwardInput)
        : 0;

      // Snappy acceleration and smooth aerodynamic deceleration
      speed = THREE.MathUtils.damp(speed, targetSpeed, forwardInput !== 0 ? 8.0 : 4.5, delta);
      yaw -= turnInput * 3.2 * delta;

      pitch = THREE.MathUtils.lerp(pitch, (speed / 38) * -0.35, delta * 8);
      roll = THREE.MathUtils.lerp(roll, -turnInput * 0.45, delta * 8);

      velocity.set(Math.sin(yaw) * speed, 0, Math.cos(yaw) * speed);
      drone.position.addScaledVector(velocity, delta);

      // Keep within bounds
      drone.position.x = Math.max(-townBound + 5, Math.min(townBound - 5, drone.position.x));
      drone.position.z = Math.max(-townBound + 5, Math.min(townBound - 5, drone.position.z));

      // Terrain altitude adaptation
      const gHeight = getTerrainHeight(drone.position.x, drone.position.z);
      const targetAltitude = Math.max(3.2, gHeight + 3.8 + Math.sin(time * 3.5) * 0.15);
      drone.position.y = THREE.MathUtils.lerp(drone.position.y, targetAltitude, delta * 5);

      drone.rotation.set(pitch, yaw, roll);

      // Spin propellers with speed intensity
      const rotorSpeed = (isBoosting ? 65 : 35) * delta;
      rotorBlades.forEach((r, idx) => {
        r.rotation.y += (idx % 2 === 0 ? 1 : -1) * rotorSpeed;
      });

      // Cinematic Dynamic Camera Follow with Turbo Speed FOV Kickback
      const targetFov = isBoosting ? 68 : 58;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 4);
      camera.updateProjectionMatrix();

      const camDistance = isBoosting ? 13.5 : 11.0;
      const camOffset = new THREE.Vector3(
        -Math.sin(yaw) * camDistance,
        4.5 + Math.max(0, -pitch * 3),
        -Math.cos(yaw) * camDistance
      );
      const targetCamPos = drone.position.clone().add(camOffset);
      camera.position.lerp(targetCamPos, delta * 7.0);
      camera.lookAt(drone.position.clone().add(new THREE.Vector3(0, 0.8, 0)));

      // Keep sun focused on drone for razor-sharp real-time shadows
      morningSun.target.position.copy(drone.position);

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

        visual.rotors.forEach((r) => {
          r.rotation.y += delta * 30;
        });
      });

      // Shield regeneration
      if (time - lastDamageTimeRef.current > 4.0 && shieldsRef.current < maxShieldsRef.current) {
        shieldsRef.current = Math.min(maxShieldsRef.current, shieldsRef.current + delta * 14);
      }

      // Zombie AI (Intense swarm chase)
      let chasingCount = 0;
      zombies.forEach((z, idx) => {
        z.mesh.position.copy(z.pos);

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

          const currentZSpeed = z.speed * (distToDrone < 12 ? 1.25 : 1.0);
          z.pos.add(dir.multiplyScalar(currentZSpeed * delta));
          z.mesh.lookAt(new THREE.Vector3(drone.position.x, z.pos.y, drone.position.z));

          z.leftArm.rotation.x = -0.5 + Math.sin(time * 9 + idx) * 0.6;
          z.rightArm.rotation.x = -0.5 - Math.sin(time * 9 + idx) * 0.6;

          if (distToDrone < 3.8) {
            const damagePerSec = z.isBrute ? 40 : 22;
            shieldsRef.current = Math.max(0, shieldsRef.current - delta * damagePerSec);
            lastDamageTimeRef.current = time;
            if (onDamageTaken) onDamageTaken(Math.round(shieldsRef.current));
            if (frame % 18 === 0) reclamationAudio.playShieldHit();
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

        if (!item.activated && (dist < 5.5 || (dist < 22 && isEmpExpanding))) {
          item.activated = true;
          beaconsRef.current[index].activated = true;
          reclamationAudio.playBeaconLaser();
          gameNetwork.sendBeaconActivated(item.id);
          onActivateBeacon(item, index);

          laserPillar.scale.set(3.5, 1, 3.5);
          (laserPillar.material as THREE.MeshBasicMaterial).opacity = 0.95;
          light.intensity = 8.0;

          zombies.forEach((z) => {
            if (group.position.distanceTo(z.pos) < 32) {
              z.state = 'stunned';
              z.stunTimer = 5.0;
              z.velocity.add(z.pos.clone().sub(group.position).normalize().multiplyScalar(22));
            }
          });

          const remaining = beaconsRef.current.filter((b) => !b.activated).length;
          if (remaining === 0 && !allActivatedRef.current) {
            allActivatedRef.current = true;
            reclamationAudio.playWarpPortalSound();
            (portalVortex.material as THREE.MeshBasicMaterial).color.setHex(0x00f5d4);
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

      // Update Telemetry with real-world km/h
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
      className="relative w-full h-full min-h-screen overflow-hidden bg-[#7ec8e3]"
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111827] z-50">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mb-4" />
          <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase font-bold">
            CALIBRATING HIGH-SPEED METROPOLIS & MULTIPLAYER SENSORS...
          </span>
        </div>
      )}
    </div>
  );
}
