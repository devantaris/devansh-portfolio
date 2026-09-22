'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Terminal, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Home, 
  Compass, 
  RotateCcw, 
  Leaf, 
  Cpu, 
  AlertTriangle,
  Radio,
  Gamepad2,
  X
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { withBasePath } from '@/lib/content';
import { reclamationAudio } from '@/lib/audio/reclamationAudio';
import { BioParticles, BioParticlesHandle } from '@/components/error/BioParticles';
import { ProceduralVines, ProceduralVinesHandle } from '@/components/error/ProceduralVines';
import type { BeaconItem, TelemetryData, DifficultyMode } from '@/components/error/ReclamationGame3D';
import GameHudOverlay from '@/components/error/GameHudOverlay';

const ReclamationGame3D = dynamic(
  () => import('@/components/error/ReclamationGame3D'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#010603] z-50">
        <div className="w-12 h-12 rounded-full border-2 border-red-500/20 border-t-red-400 animate-spin mb-4" />
        <span className="text-xs text-red-400 font-mono tracking-widest uppercase">
          CALIBRATING ZOMBIE ARENA & SHADERS...
        </span>
      </div>
    ),
  }
);

interface PostApocalypticErrorProps {
  errorType?: '404' | '500' | 'STDERR' | 'PANIC';
  errorMessage?: string;
  errorDigest?: string;
  reset?: () => void;
}

interface LogEntry {
  id: string;
  type: 'system' | 'stderr' | 'bio' | 'input' | 'output' | 'error';
  text: string;
  timestamp: string;
}

export default function PostApocalypticError({
  errorType = '404',
  errorMessage,
  errorDigest,
  reset,
}: PostApocalypticErrorProps) {
  const router = useRouter();
  const bioRef = useRef<BioParticlesHandle>(null);
  const vinesRef = useRef<ProceduralVinesHandle>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 3D Game vs 2D Relic view mode
  const [viewMode, setViewMode] = useState<'3d-game' | '2d-relic'>('3d-game');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [overgrowthLevel, setOvergrowthLevel] = useState<number>(2);
  const [inputVal, setInputVal] = useState('');
  const [currentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '';
  });
  const [bloomCount, setBloomCount] = useState<number>(0);
  const [glitchActive, setGlitchActive] = useState(false);

  // Difficulty Mode (Easy / Medium / Hard)
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>('medium');

  // 3D Arena states
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    speed: 0,
    altitude: 3.5,
    heading: 0,
    shields: 100,
    maxShields: 100,
    empCooldown: 1,
    nearestDist: 0,
    nearestName: 'SCANNING ARENA...',
    zombieCount: 36,
    zombiesChasing: 0,
    activeBeacons: 0,
    totalBeacons: 4,
  });

  const getBeaconsForMode = (mode: DifficultyMode): BeaconItem[] => {
    const list: BeaconItem[] = [
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
    const count = mode === 'easy' ? 3 : mode === 'medium' ? 4 : 5;
    return list.slice(0, count);
  };

  const [beacons, setBeacons] = useState<BeaconItem[]>(() => getBeaconsForMode('medium'));

  const handleSelectDifficulty = useCallback((mode: DifficultyMode) => {
    setDifficultyMode(mode);
    setBeacons(getBeaconsForMode(mode));
    setAllActivated(false);
    setLastActivatedBeacon(null);
  }, []);

  const [allActivated, setAllActivated] = useState(false);
  const [lastActivatedBeacon, setLastActivatedBeacon] = useState<BeaconItem | null>(null);
  const [virtualInput, setVirtualInput] = useState<{ forward: number; turn: number; action: boolean; boost?: boolean }>({
    forward: 0,
    turn: 0,
    action: false,
  });

  // Initial terminal lore dump
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const initial: LogEntry[] = [
      {
        id: '1',
        type: 'stderr',
        timestamp: '00.000404',
        text: `STDERR (fd 2): ALERT. Route '${errorType === '404' ? 'NOT_FOUND' : 'SEGMENTATION_FAULT'}' lost in the quarantine zone.`,
      },
    ];

    if (errorMessage) {
      initial.push({
        id: 'err-msg',
        type: 'error',
        timestamp: '00.000750',
        text: `EXCEPTION: ${errorMessage}`,
      });
    }

    if (errorDigest) {
      initial.push({
        id: 'err-dig',
        type: 'system',
        timestamp: '00.000980',
        text: `CRASH DIGEST: ${errorDigest}`,
      });
    }

    initial.push(
      {
        id: '2',
        type: 'error',
        timestamp: '00.001290',
        text: 'BIO-ALERT: Bio-cybernetic zombie mutants detected roaming the overgrown metropolis.',
      },
      {
        id: '3',
        type: 'bio',
        timestamp: '00.002450',
        text: 'MISSION: Pilot RECLAIMER drone to synchronize 3 Survival Beacons (Alpha, Beta, Gamma).',
      },
      {
        id: '4',
        type: 'system',
        timestamp: '00.003180',
        text: 'DEFENSE: Use [SPACE] to detonate EMP shockwave and stun chasing mutant hordes.',
      },
      {
        id: '5',
        type: 'output',
        timestamp: '00.004000',
        text: 'Controls: [W/S] Thrust, [A/D] Steer, [SHIFT] Turbo, [SPACE] EMP Shockwave. Press TAB for Console.',
      }
    );

    return initial;
  });

  // Tab key to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll terminal to bottom on log append
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [logs, isTerminalOpen]);

  // Handle audio toggle
  const toggleAudio = async () => {
    const active = await reclamationAudio.toggle();
    setIsAudioActive(active);
  };

  // Trigger glitch flicker
  const triggerGlitch = () => {
    setGlitchActive(true);
    reclamationAudio.playGlitch();
    setTimeout(() => setGlitchActive(false), 240);
  };

  // 3D Arena Callbacks
  const handleActivateBeacon = useCallback((beacon: BeaconItem, index: number) => {
    setBeacons((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], activated: true };
      if (next.every((b) => b.activated)) {
        setAllActivated(true);
      }
      return next;
    });

    setLastActivatedBeacon(beacon);
    setTimeout(() => setLastActivatedBeacon(null), 4500);

    const timestamp = (performance.now() / 1000).toFixed(6);
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'bio',
        timestamp,
        text: `[BEACON ${beacon.id} ONLINE] Sky-laser activated! Massive EMP blast cleared surrounding mutants!`,
      },
    ]);
  }, []);

  const handleEnterPortal = useCallback(() => {
    reclamationAudio.playWarpPortalSound();
    router.push('/');
  }, [router]);

  const handleUpdateTelemetry = useCallback((t: TelemetryData) => {
    setTelemetry(t);
    if (t.activeBeacons >= t.totalBeacons && t.totalBeacons > 0) {
      setAllActivated(true);
    }
  }, []);

  // Interactive Bloom / Click anywhere (2D Mode)
  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('a') || target.closest('.terminal-window')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    vinesRef.current?.bloomAt(x, y);
    bioRef.current?.burst(x, y, 20);
    reclamationAudio.playChime(440 + Math.random() * 380, 0.08);
  };

  // Run terminal command
  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    reclamationAudio.playClick();

    const timestamp = (performance.now() / 1000).toFixed(6);
    const newLogs: LogEntry[] = [
      ...logs,
      {
        id: Math.random().toString(),
        type: 'input',
        timestamp,
        text: `reclaimer@earth-node:~$ ${trimmed}`,
      },
    ];

    const lower = trimmed.toLowerCase();

    if (lower === 'help') {
      newLogs.push({
        id: Math.random().toString(),
        type: 'output',
        timestamp,
        text: `AVAILABLE COMMANDS:
  diagnose  - Hardware telemetry, fungal load & memory status
  bloom     - Sprout bioluminescent flora across the machine
  spores    - Release atmospheric spore cloud
  memdump   - Inspect raw 0x0404 memory sector hex dump
  game      - Switch to full 3D interactive Drone exploration
  relic     - Switch to 2D overgrown terminal view
  clear     - Wipe current diagnostic scrollback
  home      - Return to Civilization (Devansh Portfolio Home)
  universe  - Launch starship to Devantaris 3D Star System`,
      });
    } else if (lower === 'diagnose') {
      triggerGlitch();
      newLogs.push({
        id: Math.random().toString(),
        type: 'bio',
        timestamp,
        text: `[HARDWARE DIAGNOSTIC REPORT]
  CPU 0-7     : 24.2°C (COOLED BY DEW & POLYPORE HYPHAE)
  VRAM BUS    : REPURPOSED AS PHOTOSYNTHETIC CAPACITOR
  DRONE UNIT  : RECLAIMER-04 [ONLINE // PROXIMITY SENSORS ACTIVE]
  BEACONS     : ${beacons.filter((b) => b.activated).length} / ${beacons.length} SYNCHRONIZED
  ERROR STATUS: ${errorType} [DESTINATION CONSUMED BY NATURAL RECLAMATION]`,
      });
    } else if (lower === 'bloom') {
      vinesRef.current?.triggerGlobalBloom();
      reclamationAudio.playBloomChord();
      newLogs.push({
        id: Math.random().toString(),
        type: 'bio',
        timestamp,
        text: 'Cultivating wildflowers and wisteria across circuit traces...',
      });
    } else if (lower === 'spores') {
      bioRef.current?.burst(window.innerWidth / 2, window.innerHeight / 2, 70);
      reclamationAudio.playChime(784, 0.14);
      newLogs.push({
        id: Math.random().toString(),
        type: 'output',
        timestamp,
        text: 'Dispersing bioluminescent spores into atmospheric currents.',
      });
    } else if (lower === 'game' || lower === '3d') {
      setViewMode('3d-game');
      setIsTerminalOpen(false);
      newLogs.push({
        id: Math.random().toString(),
        type: 'output',
        timestamp,
        text: 'Deploying RECLAIMER-04 drone into 3D ruins.',
      });
    } else if (lower === 'relic' || lower === '2d') {
      setViewMode('2d-relic');
      setIsTerminalOpen(false);
      newLogs.push({
        id: Math.random().toString(),
        type: 'output',
        timestamp,
        text: 'Switching to 2D overgrown sanctuary perspective.',
      });
    } else if (lower === 'memdump') {
      triggerGlitch();
      newLogs.push({
        id: Math.random().toString(),
        type: 'stderr',
        timestamp,
        text: `RAW CORE DUMP [SECTOR 0x00000404]:
0x0400: 53 54 44 45 52 52 20 46 41 55 4C 54 20 34 30 34  |STDERR FAULT 404|
0x0410: 52 4F 55 54 45 20 4C 4F 53 54 20 54 4F 20 46 45  |ROUTE LOST TO FE|
0x0420: 52 4E 53 20 41 4E 44 20 53 50 4F 52 45 53 20 00  |RNS AND SPORES .|
0x0430: 4E 41 54 55 52 45 20 41 4C 57 41 59 53 20 57 49  |NATURE ALWAYS WI|
0x0440: 4E 53 20 2D 2D 20 45 41 52 54 48 20 32 33 38 37  |NS -- EARTH 2387|`,
      });
    } else if (lower === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    } else if (lower === 'home' || lower === 'return' || lower === 'cd ~' || lower === 'exit') {
      newLogs.push({
        id: Math.random().toString(),
        type: 'output',
        timestamp,
        text: 'Retreating to civilization uplink...',
      });
      setTimeout(() => router.push('/'), 600);
    } else if (lower === 'universe') {
      newLogs.push({
        id: Math.random().toString(),
        type: 'output',
        timestamp,
        text: 'Launching orbital transfer to Devantaris System...',
      });
      setTimeout(() => router.push('/universe'), 600);
    } else {
      newLogs.push({
        id: Math.random().toString(),
        type: 'error',
        timestamp,
        text: `stderr: command not recognized: '${trimmed}'. Type 'help' for options.`,
      });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  return (
    <main
      className={`relative w-full h-screen overflow-hidden bg-[#020302] text-stone-200 font-mono select-none ${
        glitchActive ? 'filter invert-[0.08] hue-rotate-90' : ''
      }`}
    >
      {/* ── MODE 1: 3D INTERACTIVE WEBGL DRONE GAME ── */}
      {viewMode === '3d-game' ? (
        <div className="relative w-full h-full">
          <ReclamationGame3D
            difficultyMode={difficultyMode}
            onActivateBeacon={handleActivateBeacon}
            onEnterPortal={handleEnterPortal}
            onUpdateTelemetry={handleUpdateTelemetry}
            isAudioActive={isAudioActive}
            virtualInput={virtualInput}
          />

          <GameHudOverlay
            telemetry={telemetry}
            beacons={beacons}
            allActivated={allActivated}
            isAudioActive={isAudioActive}
            difficultyMode={difficultyMode}
            onSelectDifficulty={handleSelectDifficulty}
            onToggleAudio={toggleAudio}
            onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
            isTerminalOpen={isTerminalOpen}
            onVirtualInput={setVirtualInput}
            onEnterPortal={handleEnterPortal}
            lastActivatedBeacon={lastActivatedBeacon}
          />
        </div>
      ) : (
        /* ── MODE 2: 2D MORNING RELIC VIEW ── */
        <div 
          onClick={handleBackgroundClick}
          className="relative w-full h-full overflow-y-auto bg-[#e8f4f8]"
        >
          {/* Cinematic Morning Background Image */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <Image
              src={withBasePath('/images/morning-overgrown-city.jpg')}
              alt="Post-apocalyptic overgrown houses, pathways and morning city"
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-1000 ease-out filter contrast-105"
              style={{ transform: 'scale(1.02)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/30" />
          </div>

          <ProceduralVines ref={vinesRef} overgrowthLevel={overgrowthLevel} onBloomCountChange={setBloomCount} />
          <BioParticles ref={bioRef} />

          {/* 2D Header (Light Mode) */}
          <header className="relative z-30 flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-stone-200/80 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 text-xs text-emerald-800 font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                <span>STDERR // MORNING LIGHT MODE</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('3d-game')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-teal-600 bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 cursor-pointer transition-all shadow-md"
              >
                <Gamepad2 size={14} />
                <span>PILOT 3D DRONE</span>
              </button>

              <button
                onClick={toggleAudio}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs cursor-pointer hover:bg-stone-50 font-semibold"
              >
                {isAudioActive ? <Volume2 size={14} className="text-emerald-600" /> : <VolumeX size={14} />}
                <span>{isAudioActive ? 'AUDIO ON' : 'MUTED'}</span>
              </button>
            </div>
          </header>

          {/* 2D Center Stage (Light Mode) */}
          <div className="relative z-30 max-w-4xl mx-auto px-4 pt-12 pb-24 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-900 text-xs tracking-widest uppercase mb-4 shadow-sm font-semibold">
              <AlertTriangle size={14} className="text-amber-600" />
              <span>SIGNAL ATTEMPT: {currentPath || '/lost-town'} — RECLAIMED BY NATURE</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl text-stone-900 font-normal mb-4 tracking-tight">
              Morning in the Ruins.
            </h1>

            <p className="text-base sm:text-lg text-stone-700 max-w-xl mb-8 font-sans leading-relaxed font-light">
              Sunlight warms the overgrown rooftops, pathways, and cottage gardens. 
              Pilot the RECLAIMER drone across the neighborhood to activate the 3 survival beacons.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setViewMode('3d-game')}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-teal-600 bg-teal-600 text-white hover:bg-teal-700 text-sm tracking-wider uppercase font-bold transition-all shadow-xl cursor-pointer"
              >
                <Gamepad2 size={18} />
                <span>Enter 3D Drone Arena →</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 text-sm tracking-wider uppercase font-semibold transition-all shadow-md cursor-pointer"
              >
                <Home size={17} />
                <span>Return to Civilization</span>
              </Link>
            </div>

            <div className="text-xs text-stone-600 font-medium flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-stone-200">
              <Leaf size={14} className="text-emerald-600" />
              <span>Click anywhere in the morning ruins to cultivate wildflowers ({bloomCount} blossomed)</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. SLIDE-OUT CRT TERMINAL DRAWER (LIGHT MODE) ── */}
      {isTerminalOpen && (
        <div className="absolute inset-x-4 sm:inset-x-auto sm:right-6 bottom-4 sm:bottom-6 z-50 w-auto sm:w-[540px] rounded-2xl border border-emerald-500/50 bg-white/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-slide-up text-stone-900">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-stone-100 border-b border-stone-200 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-[11px] text-stone-800 font-mono font-bold flex items-center gap-1.5">
                <Terminal size={12} className="text-teal-600" />
                STDERR // DAYLIGHT TERMINAL
              </span>
            </div>

            <button
              onClick={() => setIsTerminalOpen(false)}
              className="p-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Terminal Logs */}
          <div
            ref={terminalScrollRef}
            className="p-4 h-[240px] overflow-y-auto font-mono text-xs leading-relaxed custom-scrollbar space-y-1.5 bg-stone-50/50"
          >
            {logs.map((log) => {
              let colorClass = 'text-stone-700';
              if (log.type === 'stderr') colorClass = 'text-amber-800 font-semibold';
              if (log.type === 'bio') colorClass = 'text-emerald-800 font-medium';
              if (log.type === 'system') colorClass = 'text-stone-600';
              if (log.type === 'input') colorClass = 'text-teal-800 font-bold';
              if (log.type === 'error') colorClass = 'text-red-700 font-semibold';

              return (
                <div key={log.id} className={`flex items-start gap-2 ${colorClass}`}>
                  <span className="text-stone-400 select-none text-[10px] min-w-[55px]">
                    [{log.timestamp}]
                  </span>
                  <pre className="font-mono whitespace-pre-wrap break-all flex-1">
                    {log.text}
                  </pre>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-t border-stone-200"
          >
            <span className="text-teal-700 font-bold select-none text-xs">
              reclaimer@town:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="help, diagnose, bloom, spores, memdump..."
              className="flex-1 bg-transparent text-stone-900 placeholder-stone-400 focus:outline-none font-mono text-xs"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-3 py-1 text-[11px] font-bold rounded-lg border border-teal-600 bg-teal-600 text-white hover:bg-teal-700 transition-colors cursor-pointer"
            >
              RUN
            </button>
          </form>

          {/* Quick chips */}
          <div className="px-3 py-1.5 bg-black/80 border-t border-stone-900 flex flex-wrap items-center gap-1 text-[10px]">
            {['help', 'diagnose', 'bloom', 'spores', 'memdump', 'game', 'relic'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
