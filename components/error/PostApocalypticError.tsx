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
import type { DiskItem, TelemetryData } from '@/components/error/ReclamationGame3D';
import GameHudOverlay from '@/components/error/GameHudOverlay';

const ReclamationGame3D = dynamic(
  () => import('@/components/error/ReclamationGame3D'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#010603] z-50">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin mb-4" />
        <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase">
          INITIALIZING 3D RECLAIMER SHADERS...
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
  const [overgrowthLevel, setOvergrowthLevel] = useState<number>(2); // 0=crash, 1=decade, 2=symbiosis
  const [inputVal, setInputVal] = useState('');
  const [currentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '';
  });
  const [bloomCount, setBloomCount] = useState<number>(0);
  const [glitchActive, setGlitchActive] = useState(false);

  // 3D Game states
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    speed: 0,
    altitude: 2.4,
    heading: 0,
    nearestDist: 0,
    nearestName: 'SEARCHING...',
  });

  const [disks, setDisks] = useState<DiskItem[]>([
    {
      id: '/dev/sda',
      name: 'KERNEL BIOS CORE',
      tag: '0x00404_VFS',
      pos: [-32, 1.8, -18],
      collected: false,
      color: 0x00e5ff,
    },
    {
      id: '/dev/sdb',
      name: 'INODE ROUTE TABLE',
      tag: '0x00404_ROUTE',
      pos: [36, 1.8, -38],
      collected: false,
      color: 0x50fa7b,
    },
    {
      id: '/dev/sdc',
      name: 'QUANTUM NEURAL CACHE',
      tag: '0x00404_NEURAL',
      pos: [-10, 1.8, 32],
      collected: false,
      color: 0xffb86c,
    },
  ]);

  const [allCollected, setAllCollected] = useState(false);
  const [lastRecoveredItem, setLastRecoveredItem] = useState<DiskItem | null>(null);
  const [virtualInput, setVirtualInput] = useState<{ forward: number; turn: number; action: boolean }>({
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
        text: `STDERR (fd 2): KERNEL PANIC. Inode '${errorType === '404' ? 'NOT_FOUND' : 'SEGMENTATION_FAULT'}' unreachable.`,
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
        type: 'system',
        timestamp: '00.001290',
        text: 'VFS: Root partition /dev/sda1 submerged under wild wisteria & lichen roots.',
      },
      {
        id: '3',
        type: 'bio',
        timestamp: '00.002450',
        text: 'BIO-SENSORS: Chloroplast conductivity 98.4%. Mycelial bus bridging logic gates.',
      },
      {
        id: '4',
        type: 'system',
        timestamp: '00.003180',
        text: 'RECLAIMER-04 DRONE: Deployed. Pilot through the ruins to salvage lost memory cores.',
      },
      {
        id: '5',
        type: 'output',
        timestamp: '00.004000',
        text: "Controls: [W/S] Thrust, [A/D] Steer & Bank, [SPACE/E] Pulse Scanner. Press TAB to toggle terminal.",
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

  // 3D Game Callbacks
  const handleCollectDisk = useCallback((disk: DiskItem, index: number) => {
    setDisks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], collected: true };
      const remaining = next.filter((d) => !d.collected).length;
      if (remaining === 0) {
        setAllCollected(true);
      }
      return next;
    });

    setLastRecoveredItem(disk);
    setTimeout(() => setLastRecoveredItem(null), 4000);

    const timestamp = (performance.now() / 1000).toFixed(6);
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'bio',
        timestamp,
        text: `[SALVAGED] Memory core ${disk.id} (${disk.name}) restored to index table!`,
      },
    ]);
  }, []);

  const handleEnterPortal = useCallback(() => {
    reclamationAudio.playWarpPortalSound();
    router.push('/');
  }, [router]);

  const handleUpdateTelemetry = useCallback((t: TelemetryData) => {
    setTelemetry(t);
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
  SALVAGED    : ${disks.filter((d) => d.collected).length} / ${disks.length} MEMORY CORES
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
            onCollectDisk={handleCollectDisk}
            onEnterPortal={handleEnterPortal}
            onUpdateTelemetry={handleUpdateTelemetry}
            isAudioActive={isAudioActive}
            virtualInput={virtualInput}
          />

          <GameHudOverlay
            telemetry={telemetry}
            disks={disks}
            allCollected={allCollected}
            isAudioActive={isAudioActive}
            onToggleAudio={toggleAudio}
            onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
            isTerminalOpen={isTerminalOpen}
            onVirtualInput={setVirtualInput}
            onEnterPortal={handleEnterPortal}
            lastRecoveredItem={lastRecoveredItem}
          />
        </div>
      ) : (
        /* ── MODE 2: 2D RELIC VIEW ── */
        <div 
          onClick={handleBackgroundClick}
          className="relative w-full h-full overflow-y-auto"
        >
          {/* Cinematic Background Image */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <Image
              src={withBasePath('/images/overgrown-tech-404.jpg')}
              alt="Post-apocalyptic overgrown computer servers and robotic ruins"
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-1000 ease-out filter contrast-110 saturate-125"
              style={{ transform: 'scale(1.02)' }}
            />
            <div className="absolute inset-0 bg-radial-vignette opacity-85" 
                 style={{ background: 'radial-gradient(circle at 50% 40%, rgba(2,3,4,0.3) 0%, rgba(1,4,2,0.92) 85%, #010402 100%)' }} />
          </div>

          <ProceduralVines ref={vinesRef} overgrowthLevel={overgrowthLevel} onBloomCountChange={setBloomCount} />
          <BioParticles ref={bioRef} />

          {/* 2D Header */}
          <header className="relative z-30 flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-emerald-950/60 bg-black/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-emerald-500/30 bg-emerald-950/40 text-[11px] text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>STDERR // FILE DESCRIPTOR 2</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('3d-game')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900/50 cursor-pointer transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
              >
                <Gamepad2 size={13} />
                <span>PILOT 3D DRONE</span>
              </button>

              <button
                onClick={toggleAudio}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-stone-800 bg-stone-900/60 text-stone-400 text-xs cursor-pointer hover:text-stone-200"
              >
                {isAudioActive ? <Volume2 size={13} className="text-emerald-400" /> : <VolumeX size={13} />}
                <span>{isAudioActive ? 'AUDIO ON' : 'MUTED'}</span>
              </button>
            </div>
          </header>

          {/* 2D Center Stage */}
          <div className="relative z-30 max-w-4xl mx-auto px-4 pt-12 pb-24 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/30 text-amber-400 text-xs tracking-widest uppercase mb-3">
              <AlertTriangle size={13} />
              <span>SIGNAL ATTEMPT: {currentPath || '/lost-sector'} — DECAYED</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl text-stone-100 font-extralight mb-4">
              Lost to the Wild.
            </h1>

            <p className="text-sm sm:text-base text-stone-400 max-w-lg mb-8 font-sans leading-relaxed">
              The sector you requested was claimed by moss, roots, and time centuries ago. 
              Step into the pilot cockpit of RECLAIMER-04 to salvage lost memory cores.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setViewMode('3d-game')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-cyan-400/80 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 text-xs sm:text-sm tracking-wider uppercase font-bold transition-all shadow-[0_0_25px_rgba(0,229,255,0.25)] cursor-pointer"
              >
                <Gamepad2 size={16} />
                <span>Enter 3D Drone Game →</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-emerald-500/40 bg-emerald-950/30 text-emerald-200 hover:bg-emerald-900/40 text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer"
              >
                <Home size={15} />
                <span>Return to Civilization</span>
              </Link>
            </div>

            <div className="text-[11px] text-stone-500 flex items-center gap-2">
              <Leaf size={12} className="text-emerald-500/70" />
              <span>Click anywhere in the ruins to cultivate flowers ({bloomCount} sprouted)</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. SLIDE-OUT / FLOATING CRT TERMINAL DRAWER ── */}
      {isTerminalOpen && (
        <div className="absolute inset-x-4 sm:inset-x-auto sm:right-6 bottom-4 sm:bottom-6 z-50 w-auto sm:w-[540px] rounded-xl border border-emerald-500/40 bg-black/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] overflow-hidden animate-slide-up">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950/90 border-b border-emerald-950/80 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <Terminal size={12} />
                STDERR // FILE DESCRIPTOR 2 CONSOLE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTerminalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
                title="Close terminal (TAB)"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Terminal Logs */}
          <div
            ref={terminalScrollRef}
            className="p-4 h-[240px] overflow-y-auto font-mono text-xs leading-relaxed custom-scrollbar space-y-1.5"
            style={{ textShadow: '0 0 8px rgba(80, 250, 123, 0.4)' }}
          >
            {logs.map((log) => {
              let colorClass = 'text-stone-300';
              if (log.type === 'stderr') colorClass = 'text-amber-400 font-medium';
              if (log.type === 'bio') colorClass = 'text-emerald-300';
              if (log.type === 'system') colorClass = 'text-stone-400';
              if (log.type === 'input') colorClass = 'text-cyan-300 font-semibold';
              if (log.type === 'error') colorClass = 'text-rose-400';

              return (
                <div key={log.id} className={`flex items-start gap-2 ${colorClass}`}>
                  <span className="text-stone-600 select-none text-[10px] min-w-[55px]">
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
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-950 border-t border-emerald-950/80"
          >
            <span className="text-emerald-400 font-bold select-none text-xs">
              reclaimer@earth:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="help, diagnose, bloom, spores, memdump..."
              className="flex-1 bg-transparent text-emerald-200 placeholder-stone-600 focus:outline-none font-mono text-xs"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-2.5 py-1 text-[10px] rounded border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/70 transition-colors cursor-pointer"
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
