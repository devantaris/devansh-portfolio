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
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Skull,
  Crosshair,
  AlertTriangle
} from 'lucide-react';
import { BeaconItem, TelemetryData } from './ReclamationGame3D';

interface GameHudOverlayProps {
  telemetry: TelemetryData;
  beacons: BeaconItem[];
  allActivated: boolean;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
  onVirtualInput: (input: { forward: number; turn: number; action: boolean; boost?: boolean }) => void;
  onEnterPortal: () => void;
  lastActivatedBeacon?: BeaconItem | null;
}

export default function GameHudOverlay({
  telemetry,
  beacons,
  allActivated,
  isAudioActive,
  onToggleAudio,
  onToggleTerminal,
  isTerminalOpen,
  onVirtualInput,
  onEnterPortal,
  lastActivatedBeacon,
}: GameHudOverlayProps) {
  const [touchActive, setTouchActive] = useState(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setTouchActive(true);
    }
  }, []);

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

    const forward = -clampedY / maxRadius;
    const turn = clampedX / maxRadius;

    onVirtualInput({ forward, turn, action: false });
  };

  const handleTouchEnd = () => {
    setJoystickPos({ x: 0, y: 0 });
    onVirtualInput({ forward: 0, turn: 0, action: false });
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 font-mono select-none overflow-hidden">
      
      {/* Red damage vignette flash when shields fall below 40% */}
      {telemetry.shields < 40 && (
        <div className="pointer-events-none absolute inset-0 bg-red-600/15 animate-pulse" />
      )}

      {/* ── 1. TOP TELEMETRY BAR ── */}
      <header className="flex flex-wrap items-center justify-between gap-3 w-full">
        
        {/* Unit Identity & Status */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-red-500/40 bg-black/75 backdrop-blur-md text-xs">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </div>
          <span className="font-bold text-red-400 tracking-wider">ZOMBIE ARENA // SECTOR 04</span>
          <span className="text-stone-600 hidden sm:inline">|</span>
          <span className="text-stone-400 text-[11px] hidden sm:inline">
            RECLAIMER DRONE PROBE
          </span>
        </div>

        {/* Shield / Hull Integrity Gauge */}
        <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-1.5 rounded-lg border border-stone-800 bg-black/75 backdrop-blur-md text-xs">
          <ShieldAlert size={14} className={telemetry.shields < 30 ? 'text-red-500 animate-bounce' : 'text-emerald-400'} />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-stone-400 font-bold">HULL SHIELDS</span>
              <span className={telemetry.shields < 30 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {telemetry.shields}%
              </span>
            </div>
            <div className="w-24 sm:w-32 h-1.5 rounded-full bg-stone-900 overflow-hidden border border-stone-800">
              <div
                className={`h-full transition-all duration-300 ${
                  telemetry.shields < 30 ? 'bg-red-500' : telemetry.shields < 60 ? 'bg-amber-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${telemetry.shields}%` }}
              />
            </div>
          </div>
        </div>

        {/* Flight Gauges (Heading, Speed, Threat Level) */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-lg border border-stone-800 bg-black/75 backdrop-blur-md text-xs">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Compass size={13} className="text-cyan-400" />
            <span>HDG: <strong className="text-stone-100">{telemetry.heading}°</strong></span>
          </div>
          <div className="w-px h-3 bg-stone-800" />
          <div className="text-stone-400">
            SPEED: <strong className="text-stone-100">{telemetry.speed.toFixed(1)}</strong> km/h
          </div>
          <div className="w-px h-3 bg-stone-800" />
          {/* EMP Cooldown Gauge */}
          <div className="flex items-center gap-1.5">
            <Zap size={13} className={telemetry.empCooldown >= 1 ? 'text-cyan-400 animate-pulse' : 'text-stone-600'} />
            <span className={telemetry.empCooldown >= 1 ? 'text-cyan-300 font-bold' : 'text-stone-500'}>
              {telemetry.empCooldown >= 1 ? 'EMP READY' : 'EMP CHARGING'}
            </span>
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
                : 'border-stone-800 bg-black/75 text-stone-400 hover:text-stone-200'
            }`}
          >
            {isAudioActive ? (
              <Volume2 size={13} className="text-emerald-400 animate-pulse" />
            ) : (
              <VolumeX size={13} className="text-stone-500" />
            )}
            <span className="hidden sm:inline">{isAudioActive ? 'AUDIO' : 'MUTED'}</span>
          </button>

          {/* Terminal Console Slide-Out Toggle */}
          <button
            onClick={onToggleTerminal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs tracking-wider transition-all duration-200 cursor-pointer ${
              isTerminalOpen
                ? 'border-cyan-500/60 bg-cyan-950/60 text-cyan-300'
                : 'border-stone-800 bg-black/75 text-stone-400 hover:text-cyan-300'
            }`}
          >
            <TerminalIcon size={13} className="text-cyan-400" />
            <span>CONSOLE</span>
          </button>

          {/* Fast Escape: Return to Civilization */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-800 bg-black/75 text-xs text-stone-400 hover:text-stone-200 hover:border-stone-600 transition-all cursor-pointer"
            title="Exit game to home"
          >
            <Home size={13} />
            <span className="hidden sm:inline">EXIT</span>
          </Link>
        </div>
      </header>

      {/* ── 2. CENTER HUD RETICLE ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center w-16 h-16 opacity-35">
          <div className="absolute w-full h-px bg-cyan-400" />
          <div className="absolute h-full w-px bg-cyan-400" />
          <div className="w-8 h-8 rounded-full border border-cyan-400" />
        </div>
      </div>

      {/* ── 3. MID-RIGHT: 3 BEACONS TRACKER & HORDE RADAR ── */}
      <div className="pointer-events-auto flex flex-col gap-3 max-w-[280px] self-end sm:self-auto sm:absolute sm:top-20 sm:right-6">
        
        {/* Horde Alert Card */}
        <div className="rounded-xl border border-red-500/30 bg-black/80 backdrop-blur-md p-3 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-stone-800 text-[11px]">
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <Skull size={13} className="animate-pulse" />
              ZOMBIE HORDE RADAR
            </span>
            <span className="text-red-400 font-bold">{telemetry.zombiesChasing} HUNTING</span>
          </div>
          <div className="text-[10px] text-stone-400 flex items-center justify-between">
            <span>MUTANTS IN ARENA:</span>
            <span className="font-bold text-stone-200">{telemetry.zombieCount}</span>
          </div>
        </div>

        {/* 3 Survival Beacons Status */}
        <div className="rounded-xl border border-stone-800 bg-black/80 backdrop-blur-md p-3.5 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-1.5 border-b border-stone-800 text-[11px] text-stone-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <Radio size={12} className="animate-pulse" />
              SURVIVAL BEACONS
            </span>
            <span className="font-bold text-stone-200">
              {beacons.filter((b) => b.activated).length} / {beacons.length}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {beacons.map((beacon) => (
              <div
                key={beacon.id}
                className={`flex items-center justify-between p-1.5 rounded border transition-all ${
                  beacon.activated
                    ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-bold'
                    : 'border-stone-800/80 bg-stone-900/40 text-stone-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Crosshair size={12} className={beacon.activated ? 'text-emerald-400' : 'text-stone-500'} />
                  <span className="font-mono text-[11px]">BEACON {beacon.id}</span>
                </div>
                {beacon.activated ? (
                  <CheckCircle2 size={12} className="text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-amber-400 tracking-wider">OFFLINE</span>
                )}
              </div>
            ))}
          </div>

          {/* Proximity to nearest beacon */}
          {!allActivated && (
            <div className="mt-3 pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span className="text-stone-500">NEAREST BEACON:</span>
              <span className="font-bold text-cyan-300 tracking-wider font-mono">
                {telemetry.nearestDist > 0 ? `${telemetry.nearestDist}m` : 'LOCKING...'}
              </span>
            </div>
          )}
        </div>

        {/* Beacon Activation Banner */}
        {lastActivatedBeacon && (
          <div className="animate-bounce rounded-lg border border-emerald-500/70 bg-emerald-950/90 p-2.5 text-xs text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" />
            <div>
              <div className="font-bold uppercase tracking-wider">BEACON {lastActivatedBeacon.id} ONLINE!</div>
              <div className="text-[10px] opacity-80 font-mono">Sky-Laser Fired • Nearby Mutants Stunned</div>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. VICTORY EVACUATION MODAL (ALL 3 BEACONS ACTIVATED) ── */}
      {allActivated && (
        <div className="pointer-events-auto absolute inset-x-4 top-20 sm:top-24 max-w-lg mx-auto rounded-2xl border-2 border-emerald-400/80 bg-black/95 backdrop-blur-2xl p-6 text-center shadow-[0_0_60px_rgba(16,185,129,0.4)] z-40 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs tracking-widest uppercase mb-3">
            <Sparkles size={14} />
            <span>ALL 3 BEACONS SYNCHRONIZED</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 font-normal mb-2">
            Extraction Portal Online.
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 mb-6 font-sans leading-relaxed">
            The skyward laser array has powered the city&apos;s ancient Warp Gateway at <code>(0, -85)</code>.
            Fly into the vortex or choose your evacuation destination below:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onEnterPortal}
              className="px-6 py-2.5 rounded-lg border border-emerald-400 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              ← Evacuate to Main Home (/)
            </button>

            <Link
              href="/universe"
              className="px-6 py-2.5 rounded-lg border border-cyan-400/60 bg-cyan-950/40 text-cyan-200 hover:bg-cyan-900/50 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all"
            >
              Escape to 3D Universe →
            </Link>
          </div>
        </div>
      )}

      {/* ── 5. BOTTOM BAR & TOUCH CONTROLS ── */}
      <footer className="w-full flex items-end justify-between gap-4">
        
        {/* Desktop Controls Legend */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 px-3.5 py-2 rounded-lg border border-stone-800/80 bg-black/75 backdrop-blur-md text-[11px] text-stone-400">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px]">W</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px]">S</kbd>
            <span>Thrust</span>
          </div>
          <span className="text-stone-700">•</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px]">A</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px]">D</kbd>
            <span>Steer</span>
          </div>
          <span className="text-stone-700">•</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px]">SHIFT</kbd>
            <span>Turbo</span>
          </div>
          <span className="text-stone-700">•</span>
          <div className="flex items-center gap-1 text-cyan-400 font-bold">
            <kbd className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 text-[10px]">SPACE</kbd>
            <span>EMP Shockwave</span>
          </div>
        </div>

        {/* Mobile Virtual Touch Joystick & Action Buttons */}
        {touchActive && (
          <div className="pointer-events-auto flex items-end justify-between w-full pb-2">
            {/* Joystick Pad */}
            <div
              ref={joystickBaseRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-28 h-28 rounded-full border-2 border-emerald-500/40 bg-black/70 backdrop-blur-md flex items-center justify-center touch-none"
            >
              <div
                className="w-12 h-12 rounded-full border border-emerald-400 bg-emerald-500/30 transition-transform duration-75"
                style={{
                  transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                }}
              />
              <span className="absolute bottom-1 text-[9px] text-emerald-500/60 pointer-events-none">
                DRONE STICK
              </span>
            </div>

            {/* Mobile EMP Shockwave Button */}
            <button
              onTouchStart={() => onVirtualInput({ forward: 0, turn: 0, action: true })}
              onTouchEnd={() => onVirtualInput({ forward: 0, turn: 0, action: false })}
              className={`w-20 h-20 rounded-full border-2 backdrop-blur-md flex flex-col items-center justify-center text-xs font-bold active:scale-95 transition-all cursor-pointer ${
                telemetry.empCooldown >= 1
                  ? 'border-cyan-400/90 bg-cyan-950/70 text-cyan-200 shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                  : 'border-stone-800 bg-black/60 text-stone-600'
              }`}
            >
              <Zap size={20} className={telemetry.empCooldown >= 1 ? 'mb-0.5 animate-pulse text-cyan-400' : 'mb-0.5'} />
              <span>EMP</span>
            </button>
          </div>
        )}

        {/* Target Heading / Locus info */}
        <div className="pointer-events-auto hidden sm:block text-right text-[10px] text-stone-500">
          <div>ARENA: LOST CYBER-METROPOLIS</div>
          <div>MISSION: 3 BEACONS TO RESTORE EXTRACTION UPLINK</div>
        </div>
      </footer>
    </div>
  );
}
