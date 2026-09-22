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
  Sun
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

      {/* ── 1. TOP TELEMETRY BAR (LIGHT MODE FROSTED GLASS) ── */}
      <header className="flex flex-wrap items-center justify-between gap-3 w-full">
        
        {/* Unit Identity & Morning Status */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-white/60 bg-white/85 backdrop-blur-md shadow-lg text-xs">
          <div className="flex items-center gap-1.5 text-amber-600 font-bold">
            <Sun size={14} className="animate-spin text-amber-500" style={{ animationDuration: '14s' }} />
            <span className="text-stone-900 tracking-wider">MORNING RECLAMATION</span>
          </div>
          <span className="text-stone-300 hidden sm:inline">|</span>
          <span className="text-stone-600 text-[11px] hidden sm:inline font-semibold">
            SECTOR 04 // HOUSES & PATHWAYS
          </span>
        </div>

        {/* Shield / Hull Integrity Gauge */}
        <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-xl border border-white/60 bg-white/85 backdrop-blur-md shadow-lg text-xs">
          <ShieldAlert size={15} className={telemetry.shields < 30 ? 'text-red-500 animate-bounce' : 'text-emerald-600'} />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-stone-700 font-bold">HULL INTEGRITY</span>
              <span className={telemetry.shields < 30 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                {telemetry.shields}%
              </span>
            </div>
            <div className="w-24 sm:w-32 h-1.5 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
              <div
                className={`h-full transition-all duration-300 ${
                  telemetry.shields < 30 ? 'bg-red-500' : telemetry.shields < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${telemetry.shields}%` }}
              />
            </div>
          </div>
        </div>

        {/* Flight Gauges (Heading, Speed, EMP) */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3.5 px-4 py-2 rounded-xl border border-white/60 bg-white/85 backdrop-blur-md shadow-lg text-xs text-stone-800">
          <div className="flex items-center gap-1.5">
            <Compass size={14} className="text-teal-600" />
            <span>HDG: <strong className="text-stone-950 font-bold">{telemetry.heading}°</strong></span>
          </div>
          <div className="w-px h-3 bg-stone-300" />
          <div>
            SPEED: <strong className="text-stone-950 font-bold">{telemetry.speed.toFixed(1)}</strong> km/h
          </div>
          <div className="w-px h-3 bg-stone-300" />
          {/* EMP Cooldown Gauge */}
          <div className="flex items-center gap-1.5">
            <Zap size={14} className={telemetry.empCooldown >= 1 ? 'text-cyan-600 animate-pulse' : 'text-stone-400'} />
            <span className={telemetry.empCooldown >= 1 ? 'text-teal-700 font-bold' : 'text-stone-400'}>
              {telemetry.empCooldown >= 1 ? 'EMP READY' : 'CHARGING'}
            </span>
          </div>
        </div>

        {/* Action Controls (Audio, Terminal, Exit) */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Synthesizer */}
          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
              isAudioActive
                ? 'border-emerald-500/80 bg-emerald-50 text-emerald-800 font-bold'
                : 'border-white/60 bg-white/85 text-stone-700 hover:bg-white'
            }`}
          >
            {isAudioActive ? (
              <Volume2 size={14} className="text-emerald-600 animate-pulse" />
            ) : (
              <VolumeX size={14} className="text-stone-400" />
            )}
            <span className="hidden sm:inline">{isAudioActive ? 'AUDIO ON' : 'MUTED'}</span>
          </button>

          {/* Terminal Console Slide-Out Toggle */}
          <button
            onClick={onToggleTerminal}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
              isTerminalOpen
                ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold'
                : 'border-white/60 bg-white/85 text-stone-700 hover:bg-white'
            }`}
          >
            <TerminalIcon size={14} className="text-teal-600" />
            <span>CONSOLE</span>
          </button>

          {/* Quick Exit to Home */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/60 bg-white/85 text-xs text-stone-700 hover:text-stone-950 hover:bg-white transition-all shadow-md cursor-pointer font-semibold"
            title="Exit game to home"
          >
            <Home size={14} />
            <span className="hidden sm:inline">EXIT</span>
          </Link>
        </div>
      </header>

      {/* ── 2. CENTER HUD RETICLE (CLEAN DAYLIGHT CYAN) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center w-16 h-16 opacity-40">
          <div className="absolute w-full h-px bg-teal-600" />
          <div className="absolute h-full w-px bg-teal-600" />
          <div className="w-8 h-8 rounded-full border border-teal-600" />
        </div>
      </div>

      {/* ── 3. MID-RIGHT: 3 BEACONS & ZOMBIE RADAR (LIGHT MODE) ── */}
      <div className="pointer-events-auto flex flex-col gap-3 max-w-[280px] self-end sm:self-auto sm:absolute sm:top-20 sm:right-6">
        
        {/* Horde Alert Card */}
        <div className="rounded-2xl border border-red-200 bg-white/90 backdrop-blur-md p-3.5 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-stone-200 text-[11px]">
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <Skull size={14} className="animate-pulse" />
              ZOMBIE HORDE RADAR
            </span>
            <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              {telemetry.zombiesChasing} HUNTING
            </span>
          </div>
          <div className="text-[10px] text-stone-600 flex items-center justify-between">
            <span>MUTANTS IN NEIGHBORHOOD:</span>
            <span className="font-bold text-stone-900">{telemetry.zombieCount}</span>
          </div>
        </div>

        {/* 3 Survival Beacons Status */}
        <div className="rounded-2xl border border-white/60 bg-white/90 backdrop-blur-md p-4 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-stone-200 text-[11px] text-stone-700 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-teal-700 font-bold">
              <Radio size={13} className="animate-pulse text-teal-600" />
              SURVIVAL BEACONS
            </span>
            <span className="font-bold text-stone-900 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {beacons.filter((b) => b.activated).length} / {beacons.length}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {beacons.map((beacon) => (
              <div
                key={beacon.id}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                  beacon.activated
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-stone-200 bg-stone-50/70 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Crosshair size={13} className={beacon.activated ? 'text-emerald-600' : 'text-stone-400'} />
                  <span className="font-mono text-[11px]">{beacon.name}</span>
                </div>
                {beacon.activated ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <span className="text-[10px] text-amber-600 font-bold tracking-wider">OFFLINE</span>
                )}
              </div>
            ))}
          </div>

          {/* Proximity to nearest beacon */}
          {!allActivated && (
            <div className="mt-3 pt-2.5 border-t border-stone-200 text-[11px] text-stone-600 flex items-center justify-between">
              <span>NEAREST BEACON:</span>
              <span className="font-bold text-teal-700 tracking-wider font-mono">
                {telemetry.nearestDist > 0 ? `${telemetry.nearestDist}m` : 'LOCATING...'}
              </span>
            </div>
          )}
        </div>

        {/* Beacon Activation Banner */}
        {lastActivatedBeacon && (
          <div className="animate-bounce rounded-xl border border-emerald-400 bg-emerald-50 p-3 text-xs text-emerald-900 shadow-xl flex items-center gap-2.5">
            <Sparkles size={16} className="text-emerald-600" />
            <div>
              <div className="font-bold uppercase tracking-wider text-emerald-800">
                BEACON {lastActivatedBeacon.id} ONLINE!
              </div>
              <div className="text-[10px] text-emerald-700 font-mono">
                Golden Sky-Laser Fired • Mutants Repelled
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. VICTORY EVACUATION MODAL (LIGHT MODE DAYLIGHT) ── */}
      {allActivated && (
        <div className="pointer-events-auto absolute inset-x-4 top-20 sm:top-24 max-w-lg mx-auto rounded-3xl border-2 border-emerald-500 bg-white/95 backdrop-blur-2xl p-7 text-center shadow-2xl z-40 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs tracking-widest uppercase mb-3 font-bold">
            <Sparkles size={14} />
            <span>ALL BEACONS SYNCHRONIZED</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mb-2.5">
            Extraction Gateway Online.
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 mb-6 font-sans leading-relaxed">
            The morning solar array has fully powered the town&apos;s ancient Warp Gateway at <code>(0, -65)</code>.
            Fly into the turquoise vortex or choose your destination:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onEnterPortal}
              className="px-6 py-3 rounded-xl border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all shadow-lg"
            >
              ← Evacuate to Main Home (/)
            </button>

            <Link
              href="/universe"
              className="px-6 py-3 rounded-xl border border-stone-300 bg-white text-stone-900 hover:bg-stone-50 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all shadow-md"
            >
              Escape to 3D Universe →
            </Link>
          </div>
        </div>
      )}

      {/* ── 5. BOTTOM BAR & TOUCH CONTROLS ── */}
      <footer className="w-full flex items-end justify-between gap-4">
        
        {/* Desktop Controls Legend */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/60 bg-white/85 backdrop-blur-md shadow-lg text-[11px] text-stone-700">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-800 text-[10px] font-bold">W</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-800 text-[10px] font-bold">S</kbd>
            <span>Thrust</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-800 text-[10px] font-bold">A</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-800 text-[10px] font-bold">D</kbd>
            <span>Steer</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-800 text-[10px] font-bold">SHIFT</kbd>
            <span>Turbo</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1 text-teal-800 font-bold">
            <kbd className="px-2 py-0.5 rounded bg-teal-100 border border-teal-300 text-teal-900 text-[10px]">SPACE</kbd>
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
              className="relative w-28 h-28 rounded-full border-2 border-emerald-600/40 bg-white/85 backdrop-blur-md shadow-xl flex items-center justify-center touch-none"
            >
              <div
                className="w-12 h-12 rounded-full border border-emerald-600 bg-emerald-500/30 transition-transform duration-75"
                style={{
                  transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                }}
              />
              <span className="absolute bottom-1 text-[9px] text-emerald-800 pointer-events-none font-bold">
                DRONE STICK
              </span>
            </div>

            {/* Mobile EMP Shockwave Button */}
            <button
              onTouchStart={() => onVirtualInput({ forward: 0, turn: 0, action: true })}
              onTouchEnd={() => onVirtualInput({ forward: 0, turn: 0, action: false })}
              className={`w-20 h-20 rounded-full border-2 backdrop-blur-md flex flex-col items-center justify-center text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-xl ${
                telemetry.empCooldown >= 1
                  ? 'border-teal-500 bg-teal-500 text-white shadow-teal-500/30'
                  : 'border-stone-300 bg-white/80 text-stone-400'
              }`}
            >
              <Zap size={20} className={telemetry.empCooldown >= 1 ? 'mb-0.5 animate-pulse' : 'mb-0.5'} />
              <span>EMP</span>
            </button>
          </div>
        )}

        {/* Daylight Sector Info */}
        <div className="pointer-events-auto hidden sm:block text-right text-[10px] text-stone-600">
          <div className="font-semibold">ENVIRONMENT: MORNING SUNLIGHT</div>
          <div>OVERGROWN HOUSES, PATHWAYS & TOWN</div>
        </div>
      </footer>
    </div>
  );
}
