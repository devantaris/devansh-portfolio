'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Terminal as TerminalIcon, 
  Volume2, 
  VolumeX, 
  Radio, 
  Sparkles, 
  Home, 
  Rocket, 
  CheckCircle2, 
  Disc,
  X,
  Maximize2
} from 'lucide-react';
import { DiskItem, TelemetryData } from './ReclamationGame3D';

interface GameHudOverlayProps {
  telemetry: TelemetryData;
  disks: DiskItem[];
  allCollected: boolean;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
  onVirtualInput: (input: { forward: number; turn: number; action: boolean }) => void;
  onEnterPortal: () => void;
  lastRecoveredItem?: DiskItem | null;
}

export default function GameHudOverlay({
  telemetry,
  disks,
  allCollected,
  isAudioActive,
  onToggleAudio,
  onToggleTerminal,
  isTerminalOpen,
  onVirtualInput,
  onEnterPortal,
  lastRecoveredItem,
}: GameHudOverlayProps) {
  const [touchActive, setTouchActive] = useState(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });

  // Detect mobile touch
  useEffect(() => {
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setTouchActive(true);
    }
  }, []);

  // Handle Touch Joystick
  const handleTouchStart = (e: React.TouchEvent) => {
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touch = e.touches[0];
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const maxRadius = rect.width / 2;

    const dist = Math.min(maxRadius, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);

    const clampedX = Math.cos(angle) * dist;
    const clampedY = Math.sin(angle) * dist;

    setJoystickPos({ x: clampedX, y: clampedY });

    // Normalized inputs
    const forward = -clampedY / maxRadius; // Up is positive forward
    const turn = clampedX / maxRadius;    // Right is positive turn

    onVirtualInput({ forward, turn, action: false });
  };

  const handleTouchEnd = () => {
    setJoystickPos({ x: 0, y: 0 });
    onVirtualInput({ forward: 0, turn: 0, action: false });
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 font-mono select-none overflow-hidden">
      
      {/* ── 1. TOP TELEMETRY BAR ── */}
      <header className="flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Unit Identity & Status */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-black/65 backdrop-blur-md text-xs">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
          <span className="font-bold text-emerald-300 tracking-wider">UNIT-7 // RECLAIMER</span>
          <span className="text-stone-500 hidden sm:inline">|</span>
          <span className="text-stone-400 text-[11px] hidden sm:inline">
            STDERR /dev/fd/2 PROBE
          </span>
        </div>

        {/* Flight Gauges (Heading, Speed, Altitude) */}
        <div className="pointer-events-auto hidden md:flex items-center gap-4 px-4 py-1.5 rounded-lg border border-stone-800 bg-black/65 backdrop-blur-md text-xs">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Compass size={13} className="text-cyan-400" />
            <span>HDG: <strong className="text-stone-100">{telemetry.heading}°</strong></span>
          </div>
          <div className="w-px h-3 bg-stone-800" />
          <div className="text-stone-400">
            SPEED: <strong className="text-stone-100">{telemetry.speed.toFixed(1)}</strong> km/h
          </div>
          <div className="w-px h-3 bg-stone-800" />
          <div className="text-stone-400">
            ALT: <strong className="text-emerald-400">{telemetry.altitude.toFixed(1)}m</strong>
          </div>
        </div>

        {/* Action Controls (Audio, Terminal, Exit) */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Synthesizer */}
          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs tracking-wider transition-all duration-200 cursor-pointer ${
              isAudioActive
                ? 'border-emerald-500/60 bg-emerald-950/60 text-emerald-300'
                : 'border-stone-800 bg-black/65 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle synthesized drone & environmental audio"
          >
            {isAudioActive ? (
              <Volume2 size={13} className="text-emerald-400 animate-pulse" />
            ) : (
              <VolumeX size={13} className="text-stone-500" />
            )}
            <span className="hidden sm:inline">{isAudioActive ? 'AUDIO ON' : 'MUTED'}</span>
          </button>

          {/* Terminal Console Slide-Out Toggle */}
          <button
            onClick={onToggleTerminal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs tracking-wider transition-all duration-200 cursor-pointer ${
              isTerminalOpen
                ? 'border-cyan-500/60 bg-cyan-950/60 text-cyan-300'
                : 'border-stone-800 bg-black/65 text-stone-400 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
          >
            <TerminalIcon size={13} className="text-cyan-400" />
            <span>TERMINAL</span>
            <kbd className="hidden lg:inline px-1 py-0.2 rounded bg-stone-900 border border-stone-700 text-[9px] text-stone-400">
              TAB
            </kbd>
          </button>

          {/* Fast Escape: Return to Civilization */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-800 bg-black/65 text-xs text-stone-400 hover:text-stone-200 hover:border-stone-600 transition-all cursor-pointer"
            title="Return to Devansh Portfolio Home"
          >
            <Home size={13} />
            <span className="hidden sm:inline">EXIT</span>
          </Link>
        </div>
      </header>

      {/* ── 2. CENTER RETICLE / HUD TARGET ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center w-16 h-16 opacity-30">
          <div className="absolute w-full h-px bg-cyan-400" />
          <div className="absolute h-full w-px bg-cyan-400" />
          <div className="w-6 h-6 rounded-full border border-cyan-400" />
        </div>
      </div>

      {/* ── 3. MID-RIGHT: MISSION OBJECTIVES & RADAR ── */}
      <div className="pointer-events-auto flex flex-col gap-3 max-w-[280px] self-end sm:self-auto sm:absolute sm:top-20 sm:right-6">
        <div className="rounded-xl border border-stone-800 bg-black/75 backdrop-blur-md p-3.5 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-stone-800 text-[11px] text-stone-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Radio size={12} className="animate-pulse" />
              SALVAGE OBJECTIVES
            </span>
            <span className="font-bold text-stone-200">
              {disks.filter((d) => d.collected).length} / {disks.length}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {disks.map((disk) => (
              <div
                key={disk.id}
                className={`flex items-center justify-between p-1.5 rounded border transition-all ${
                  disk.collected
                    ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 line-through opacity-80'
                    : 'border-stone-800/80 bg-stone-900/40 text-stone-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Disc size={12} className={disk.collected ? 'text-emerald-400' : 'text-stone-500'} />
                  <span className="font-mono text-[11px]">{disk.id}</span>
                </div>
                {disk.collected ? (
                  <CheckCircle2 size={12} className="text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-amber-400/90 tracking-wider">LOST</span>
                )}
              </div>
            ))}
          </div>

          {/* Proximity Radar */}
          {!allCollected && (
            <div className="mt-3 pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span className="text-stone-500">PROXIMITY:</span>
              <span className="font-bold text-cyan-300 tracking-wider font-mono">
                {telemetry.nearestDist > 0 ? `${telemetry.nearestDist}m` : '0m'}
              </span>
            </div>
          )}
        </div>

        {/* Recently Salvaged Toast notification */}
        {lastRecoveredItem && (
          <div className="animate-bounce rounded-lg border border-emerald-500/60 bg-emerald-950/80 p-2.5 text-xs text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" />
            <div>
              <div className="font-bold">SECTOR SALVAGED!</div>
              <div className="text-[10px] opacity-80 font-mono">{lastRecoveredItem.name}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. VICTORY PORTAL MODAL ── */}
      {allCollected && (
        <div className="pointer-events-auto absolute inset-x-4 top-20 sm:top-24 max-w-lg mx-auto rounded-2xl border-2 border-emerald-400/80 bg-black/90 backdrop-blur-2xl p-6 text-center shadow-[0_0_50px_rgba(16,185,129,0.35)] z-40 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs tracking-widest uppercase mb-3">
            <Sparkles size={14} />
            <span>ALL MEMORY BLOCKS SALVAGED</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 font-normal mb-2">
            Mainframe Restored.
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 mb-5 font-sans leading-relaxed">
            The ancient Warp Gateway has ignited at coordinates <code>(0, -80)</code>. 
            Fly your drone into the swirling green portal or click below to warp out of the ruins!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onEnterPortal}
              className="px-5 py-2.5 rounded-lg border border-emerald-400 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            >
              ← Warp to Home
            </button>

            <Link
              href="/universe"
              className="px-5 py-2.5 rounded-lg border border-cyan-400/60 bg-cyan-950/40 text-cyan-200 hover:bg-cyan-900/50 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all"
            >
              Warp to 3D Universe →
            </Link>
          </div>
        </div>
      )}

      {/* ── 5. BOTTOM BAR & TOUCH CONTROLS ── */}
      <footer className="w-full flex items-end justify-between gap-4">
        
        {/* Desktop Controls Legend */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 px-3.5 py-2 rounded-lg border border-stone-800/80 bg-black/65 backdrop-blur-md text-[11px] text-stone-400">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px]">W</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px]">S</kbd>
            <span>Throttle</span>
          </div>
          <span className="text-stone-700">•</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px]">A</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px]">D</kbd>
            <span>Steer & Bank</span>
          </div>
          <span className="text-stone-700">•</span>
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px]">SPACE</kbd>
            <span>Pulse Scan</span>
          </div>
        </div>

        {/* Mobile Virtual Joystick & Scan Button */}
        {touchActive && (
          <div className="pointer-events-auto flex items-end justify-between w-full pb-2">
            {/* Joystick Pad */}
            <div
              ref={joystickBaseRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-28 h-28 rounded-full border-2 border-emerald-500/40 bg-black/60 backdrop-blur-md flex items-center justify-center touch-none"
            >
              <div
                className="w-12 h-12 rounded-full border border-emerald-400 bg-emerald-500/30 transition-transform duration-75"
                style={{
                  transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                }}
              />
              <span className="absolute bottom-1 text-[9px] text-emerald-500/60 pointer-events-none">
                FLIGHT STICK
              </span>
            </div>

            {/* Action Scan Button */}
            <button
              onTouchStart={() => onVirtualInput({ forward: 0, turn: 0, action: true })}
              onTouchEnd={() => onVirtualInput({ forward: 0, turn: 0, action: false })}
              className="w-20 h-20 rounded-full border-2 border-cyan-400/80 bg-cyan-950/60 backdrop-blur-md text-cyan-200 flex flex-col items-center justify-center text-xs font-bold active:scale-95 transition-transform"
            >
              <Radio size={20} className="mb-0.5 animate-pulse" />
              <span>SCAN</span>
            </button>
          </div>
        )}

        {/* Target Heading / Coords info */}
        <div className="pointer-events-auto hidden sm:block text-right text-[10px] text-stone-500">
          <div>LOCUS: SECTOR_404 // RECLAMATION ZONE</div>
          <div>SYSTEM: /dev/fd/2 [STDERR]</div>
        </div>
      </footer>
    </div>
  );
}
