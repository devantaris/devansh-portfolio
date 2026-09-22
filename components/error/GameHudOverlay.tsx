'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Users, 
  MessageSquare, 
  Edit2, 
  Check, 
  Flame, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { BeaconItem, TelemetryData, DifficultyMode } from './ReclamationGame3D';
import { gameNetwork, NetworkStatus, NetworkEvent } from '@/lib/multiplayer/gameNetwork';

interface GameHudOverlayProps {
  telemetry: TelemetryData;
  beacons: BeaconItem[];
  allActivated: boolean;
  isAudioActive: boolean;
  difficultyMode: DifficultyMode;
  onSelectDifficulty: (mode: DifficultyMode) => void;
  onToggleAudio: () => void;
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
  onVirtualInput: (input: { forward: number; turn: number; action: boolean; boost?: boolean }) => void;
  onEnterPortal: () => void;
  lastActivatedBeacon?: BeaconItem | null;
}

interface RadioMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  type?: string;
}

export default function GameHudOverlay({
  telemetry,
  beacons,
  allActivated,
  isAudioActive,
  difficultyMode,
  onSelectDifficulty,
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

  // Multiplayer status & real-time radio transmissions
  const [netStatus, setNetStatus] = useState<NetworkStatus>({
    connected: false,
    peerCount: 1,
    ping: 32,
    callsign: gameNetwork.getCallsign(),
    playerId: gameNetwork.getPlayerId(),
  });
  const [floatingTransmissions, setFloatingTransmissions] = useState<RadioMessage[]>([]);
  const [isEditingCallsign, setIsEditingCallsign] = useState(false);
  const [callsignInput, setCallsignInput] = useState(gameNetwork.getCallsign());

  // Subscribe to multiplayer events and produce floating military toasts
  useEffect(() => {
    gameNetwork.onStatusChange = (s) => setNetStatus(s);
    gameNetwork.onEvent = (e) => {
      const newMsg: RadioMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: e.callsign,
        text: e.text || (e.type === 'BEACON_ACTIVATE' ? `Synchronized Beacon ${e.beaconId}!` : 'EMP shockwave discharged!'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: e.type,
      };

      setFloatingTransmissions((prev) => [...prev.slice(-3), newMsg]);

      // Auto dismiss message after 4.5 seconds
      setTimeout(() => {
        setFloatingTransmissions((prev) => prev.filter((m) => m.id !== newMsg.id));
      }, 4500);
    };
  }, []);

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

  const handleSaveCallsign = () => {
    if (callsignInput.trim()) {
      gameNetwork.setCallsign(callsignInput.trim());
      setIsEditingCallsign(false);
    }
  };

  const handleSendPing = (text: string) => {
    gameNetwork.sendQuickChat(text);
  };

  const shieldPercent = Math.round((telemetry.shields / (telemetry.maxShields || 100)) * 100);
  const activeBeaconsCount = beacons.filter((b) => b.activated).length;

  // Real-Time Circular Radar Mathematical Plotting
  const radarBlips = useMemo(() => {
    const px = telemetry.dronePos ? telemetry.dronePos[0] : 0;
    const pz = telemetry.dronePos ? telemetry.dronePos[2] : 0;
    const playerHeadingRad = (telemetry.heading * Math.PI) / 180;
    const radarRadiusPx = 68; // Radar radius in pixels
    const maxRadarRangeMeters = 160;

    return beacons.map((beacon) => {
      const dx = beacon.pos[0] - px;
      const dz = beacon.pos[2] - pz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      // Angle in world coordinates (0 = North/-z, PI/2 = East/+x)
      const worldAngle = Math.atan2(dx, -dz);
      // Relative bearing to drone's forward heading
      const relAngle = worldAngle - playerHeadingRad;

      const clampedDistFraction = Math.min(dist / maxRadarRangeMeters, 0.92);
      const bx = Math.sin(relAngle) * (clampedDistFraction * radarRadiusPx);
      const by = -Math.cos(relAngle) * (clampedDistFraction * radarRadiusPx);

      return {
        id: beacon.id,
        name: beacon.name,
        activated: beacon.activated,
        colorHex: beacon.color,
        bx,
        by,
        dist: Math.round(dist),
      };
    });
  }, [telemetry.dronePos, telemetry.heading, beacons]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 font-mono select-none overflow-hidden">
      
      {/* Critical damage red pulse vignette */}
      {shieldPercent < 35 && (
        <div className="pointer-events-none absolute inset-0 bg-red-600/20 animate-pulse pointer-events-none" />
      )}

      {/* ── 1. UNIFIED CYBER-AEROSPACE TOP VISOR BAR ── */}
      <header className="pointer-events-auto relative flex items-center justify-between gap-3 w-full max-w-7xl mx-auto px-4 py-2.5 rounded-2xl bg-neutral-950/80 backdrop-blur-2xl border border-white/15 text-white shadow-2xl overflow-hidden">
        
        {/* Subtle Top Cyber Accent Hairline */}
        <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

        {/* Left Wing: Callsign, Edit & Live Squad Count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-neutral-900/90 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>

            {isEditingCallsign ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={callsignInput}
                  onChange={(e) => setCallsignInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveCallsign()}
                  className="px-1.5 py-0.5 rounded border border-cyan-500 bg-neutral-950 text-white text-xs font-bold outline-none w-24"
                  autoFocus
                />
                <button
                  onClick={handleSaveCallsign}
                  className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
                >
                  <Check size={11} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingCallsign(true)}
                className="flex items-center gap-1.5 text-xs text-neutral-200 font-bold hover:text-cyan-300 transition-colors cursor-pointer group"
                title="Click to edit callsign"
              >
                <span className="tracking-wide text-cyan-300">{netStatus.callsign}</span>
                <Edit2 size={10} className="text-neutral-500 group-hover:text-cyan-300 transition-colors" />
              </button>
            )}
          </div>

          <div className="w-px h-3.5 bg-white/15 hidden sm:block" />

          {/* Squad presence pill */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-400 px-2 py-1 rounded-xl bg-neutral-900/60 border border-white/5">
            <Users size={12} className={netStatus.peerCount > 1 ? 'text-cyan-400' : 'text-neutral-500'} />
            <span>
              <strong className="text-white font-bold">{netStatus.peerCount}</strong> {netStatus.peerCount === 1 ? 'PILOT' : 'PILOTS'}
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-[10px] text-neutral-500">{netStatus.ping}ms</span>
          </div>
        </div>

        {/* Center: Aerospace Mode Selector */}
        <div className="flex items-center p-0.5 rounded-xl bg-neutral-900/90 border border-white/10 text-[10px]">
          {(['easy', 'medium', 'hard'] as DifficultyMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onSelectDifficulty(mode)}
              className={`px-3 py-1 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer ${
                difficultyMode === mode
                  ? mode === 'easy'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : mode === 'medium'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {mode === 'easy' ? 'SURVEY' : mode === 'medium' ? 'TACTICAL' : 'INVASION'}
            </button>
          ))}
        </div>

        {/* Right Wing: Shield Integrator & Action Controls */}
        <div className="flex items-center gap-3">
          {/* Hull Shield Bar */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-neutral-900/90 border border-white/10">
            <ShieldAlert size={13} className={shieldPercent < 30 ? 'text-red-400 animate-pulse' : 'text-cyan-400'} />
            <div className="flex flex-col items-end">
              <div className="text-[10px] text-neutral-400 font-bold tracking-wider">
                <span className={shieldPercent < 30 ? 'text-red-400 font-bold' : 'text-white'}>
                  {telemetry.shields}
                </span>
                <span className="text-neutral-500"> / {telemetry.maxShields} HP</span>
              </div>
              <div className="w-16 sm:w-24 h-1.5 rounded-full bg-neutral-800 overflow-hidden border border-white/10">
                <div
                  className={`h-full transition-all duration-300 ${
                    shieldPercent < 30 ? 'bg-red-500' : shieldPercent < 60 ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                  }`}
                  style={{ width: `${shieldPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="w-px h-3.5 bg-white/15 hidden sm:block" />

          {/* Audio, Logs & Exit */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleAudio}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isAudioActive
                  ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                  : 'border-white/10 bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
              title="Toggle Audio Synthesizer"
            >
              {isAudioActive ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
            </button>

            <button
              onClick={onToggleTerminal}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isTerminalOpen
                  ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-400'
                  : 'border-white/10 bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
              title="Toggle Diagnostic Terminal"
            >
              <TerminalIcon size={14} />
            </button>

            <Link
              href="/"
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-300 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer text-xs font-bold"
              title="Warp to Safety (Homepage)"
            >
              <Home size={13} />
              <span className="hidden md:inline text-[10px]">HOME</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── 2. CENTER TACTICAL RETICLE ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center w-24 h-24 opacity-35">
          {/* Subtle Outer Reticle Ring */}
          <div className="absolute w-20 h-20 rounded-full border border-cyan-400/40" />
          <div className="absolute w-6 h-6 rounded-full border border-cyan-400/80" />
          {/* Crosshair Ticks */}
          <div className="absolute top-0 w-[1px] h-3 bg-cyan-400" />
          <div className="absolute bottom-0 w-[1px] h-3 bg-cyan-400" />
          <div className="absolute left-0 w-3 h-[1px] bg-cyan-400" />
          <div className="absolute right-0 w-3 h-[1px] bg-cyan-400" />
          {/* Center Pip */}
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </div>
      </div>

      {/* ── 3. TOP-RIGHT: CIRCULAR HOLOGRAPHIC RADAR & OBJECTIVES ── */}
      <aside className="pointer-events-auto absolute top-16 right-3 sm:right-6 flex flex-col items-end gap-2.5">
        
        {/* Holographic Circular Radar Display */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-neutral-950/85 backdrop-blur-2xl border border-cyan-500/30 p-2 shadow-2xl overflow-hidden flex items-center justify-center">
          
          {/* Outer Compass Degree Ticks (N, E, S, W) */}
          <span className="absolute top-1 text-[8px] text-cyan-300 font-bold tracking-wider">N</span>
          <span className="absolute bottom-1 text-[8px] text-neutral-500 font-bold tracking-wider">S</span>
          <span className="absolute left-1.5 text-[8px] text-neutral-500 font-bold tracking-wider">W</span>
          <span className="absolute right-1.5 text-[8px] text-neutral-500 font-bold tracking-wider">E</span>

          {/* Range rings (50m, 100m, 150m) */}
          <div className="absolute w-28 h-28 rounded-full border border-white/5" />
          <div className="absolute w-20 h-20 rounded-full border border-cyan-500/10" />
          <div className="absolute w-10 h-10 rounded-full border border-cyan-500/20" />

          {/* Crosshair Grids */}
          <div className="absolute w-full h-[1px] bg-white/10" />
          <div className="absolute h-full w-[1px] bg-white/10" />

          {/* Rotating Holographic Radar Sweep Beam */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none animate-spin origin-center opacity-40"
            style={{
              animationDuration: '4s',
              background: 'conic-gradient(from 0deg, rgba(0,245,212,0.3) 0deg, transparent 60deg, transparent 360deg)',
            }}
          />

          {/* Center Player Drone Indicator (Arrow pointing UP) */}
          <div className="relative z-10 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-cyan-400" />

          {/* Dynamically Plotted Beacon Blips */}
          {radarBlips.map((blip) => (
            <div
              key={blip.id}
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
              style={{
                left: `calc(50% + ${blip.bx}px)`,
                top: `calc(50% + ${blip.by}px)`,
              }}
              title={`${blip.name}: ${blip.dist}m`}
            >
              {blip.activated ? (
                <div className="w-2.5 h-2.5 rotate-45 rounded-[1px] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute w-3 h-3 rounded-full bg-cyan-400 opacity-60" />
                  <div className="w-2 h-2 rotate-45 rounded-[1px] bg-cyan-400 shadow-[0_0_6px_rgba(0,245,212,0.9)]" />
                </div>
              )}
            </div>
          ))}

          {/* Dynamic Threat Blips when Mutants are hunting */}
          {telemetry.zombiesChasing > 0 && (
            <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-rose-500 animate-ping shadow-[0_0_6px_#f43f5e]" />
          )}
        </div>

        {/* Minimalist Objective Badge under Radar */}
        <div className="w-40 sm:w-44 rounded-2xl bg-neutral-950/85 backdrop-blur-xl border border-white/10 p-2.5 text-[10px] space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between text-neutral-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-cyan-400">
              <Radio size={11} className="animate-pulse" />
              BEACONS
            </span>
            <span className="text-white font-bold">{activeBeaconsCount} / {beacons.length}</span>
          </div>

          {/* Diamond Pip Indicators */}
          <div className="flex items-center justify-between py-0.5">
            {beacons.map((b) => (
              <div
                key={b.id}
                className={`w-3 h-3 rotate-45 rounded-[1px] transition-all ${
                  b.activated
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    : 'border border-white/30 bg-neutral-800'
                }`}
              />
            ))}
          </div>

          {/* Nearest Target Readout */}
          <div className="flex items-center justify-between text-neutral-300 pt-1 border-t border-white/10">
            <span className="truncate max-w-[90px]">{telemetry.nearestName || 'SCANNING...'}</span>
            <span className="text-cyan-300 font-bold">{telemetry.nearestDist > 0 ? `${telemetry.nearestDist}m` : '--'}</span>
          </div>

          {/* Threat Indicator */}
          <div className={`flex items-center justify-between text-[9px] font-bold ${telemetry.zombiesChasing > 0 ? 'text-rose-400' : 'text-neutral-500'}`}>
            <span>{telemetry.zombiesChasing > 0 ? '● MUTANTS CHASING' : '○ AREA CLEAR'}</span>
            <span>{telemetry.zombiesChasing > 0 ? `${telemetry.zombiesChasing} HOSTILES` : `${telemetry.zombieCount} ROAMING`}</span>
          </div>
        </div>

        {/* Beacon Activated Toast Alert */}
        {lastActivatedBeacon && (
          <div className="animate-bounce rounded-xl border border-emerald-500/40 bg-emerald-950/90 backdrop-blur-xl p-2.5 text-xs text-emerald-300 shadow-xl flex items-center gap-2 max-w-[200px]">
            <Sparkles size={14} className="text-emerald-400 shrink-0" />
            <div className="truncate">
              <div className="font-bold uppercase tracking-wider text-[10px] text-white">
                BEACON ONLINE
              </div>
              <div className="text-[9px] text-emerald-400 truncate">
                {lastActivatedBeacon.name}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── 4. LEFT: SQUAD QUICK COMM PINGS & FLOATING TRANSMISSIONS ── */}
      <aside className="pointer-events-auto absolute top-16 left-3 sm:left-6 flex flex-col gap-2 max-w-[240px]">
        
        {/* Quick Comms Dock */}
        <div className="flex flex-col gap-1 p-1.5 rounded-2xl bg-neutral-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-400 uppercase tracking-wider px-1.5 py-0.5">
            <MessageSquare size={10} className="text-cyan-400" />
            <span>SQUAD COMMS</span>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[9px]">
            {[
              { label: '⚡ EMP READY', ping: 'EMP Shockwave charged & ready!' },
              { label: '⚠️ SWARM', ping: 'Mutant swarm on my position!' },
              { label: '📍 BEACON', ping: 'Beacon localized! Moving in.' },
              { label: '🛡️ REGROUP', ping: 'Regroup at bridge!' },
            ].map((qp) => (
              <button
                key={qp.label}
                onClick={() => handleSendPing(qp.ping)}
                className="px-2 py-1 rounded-lg bg-neutral-900/90 border border-white/5 hover:border-cyan-500/40 hover:text-cyan-300 text-neutral-300 font-bold transition-all cursor-pointer truncate text-left"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Military Transmission Cards (Auto-dismiss after 4.5s) */}
        <div className="space-y-1.5 mt-1">
          {floatingTransmissions.map((msg) => (
            <div
              key={msg.id}
              className="animate-slide-in rounded-xl border border-cyan-500/30 bg-neutral-950/90 backdrop-blur-2xl p-2 text-[10px] text-neutral-200 shadow-2xl flex flex-col gap-0.5"
            >
              <div className="flex items-center justify-between text-[9px] text-cyan-400 font-bold">
                <span>// {msg.sender}</span>
                <span className="text-neutral-500 text-[8px]">{msg.time}</span>
              </div>
              <p className="text-white text-[10px] leading-tight">
                {msg.text}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* ── 5. VICTORY EVACUATION GATEWAY MODAL ── */}
      {allActivated && (
        <div className="pointer-events-auto absolute inset-x-4 top-20 max-w-lg mx-auto rounded-3xl border-2 border-emerald-500 bg-neutral-950/95 backdrop-blur-2xl p-6 text-center shadow-2xl z-40 animate-fade-in text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] tracking-widest uppercase mb-2.5 font-bold">
            <Sparkles size={13} />
            <span>ALL BEACONS SYNCHRONIZED ACROSS SQUAD</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2">
            Stargate Vortex Online.
          </h2>

          <p className="text-xs text-neutral-300 mb-5 font-sans leading-relaxed">
            The North Plaza Stargate at <code>(0, 5.5, -110)</code> has been fully charged. Fly into the turquoise stargate or warp home:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onEnterPortal}
              className="px-5 py-2.5 rounded-xl border border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all shadow-lg flex items-center gap-1.5"
            >
              <span>Evacuate to Home (/)</span>
              <ArrowRight size={13} />
            </button>

            <Link
              href="/universe"
              className="px-5 py-2.5 rounded-xl border border-white/20 bg-neutral-900 text-white hover:bg-neutral-800 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all shadow-md"
            >
              Escape to 3D Universe
            </Link>
          </div>
        </div>
      )}

      {/* ── 6. AERODYNAMIC COCKPIT FLIGHT CLUSTER AT BOTTOM ── */}
      <footer className="w-full flex items-end justify-between gap-4">
        
        {/* Desktop Controls Ribbon (No clunky boxes) */}
        <div className="pointer-events-auto hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950/60 backdrop-blur-xl border border-white/10 text-[10px] text-neutral-400">
          <span><strong className="text-white">W/S</strong> Thrust</span>
          <span className="text-neutral-600">•</span>
          <span><strong className="text-white">A/D</strong> Bank & Steer</span>
          <span className="text-neutral-600">•</span>
          <span className="text-cyan-300"><strong className="text-cyan-300">SHIFT</strong> Turbo Boost</span>
          <span className="text-neutral-600">•</span>
          <span className="text-amber-300"><strong className="text-amber-300">SPACE</strong> EMP Blast</span>
        </div>

        {/* Center Cockpit Telemetry Cluster */}
        <div className="pointer-events-auto flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-neutral-950/85 backdrop-blur-2xl border border-white/15 text-white shadow-2xl mx-auto lg:mx-0">
          
          {/* Digital Speedometer with Turbo Glow */}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono transition-colors ${
                telemetry.speed > 80 ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'text-cyan-300'
              }`}>
                {Math.round(telemetry.speed)}
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">KM/H</span>
            </div>
            {telemetry.speed > 80 ? (
              <span className="flex items-center gap-1 text-[8px] font-bold text-amber-400 animate-pulse tracking-widest">
                <Flame size={10} />
                TURBO ENGAGED
              </span>
            ) : (
              <span className="text-[8px] text-neutral-500 font-bold tracking-wider">
                CRUISE SPEED
              </span>
            )}
          </div>

          <div className="w-px h-7 bg-white/15" />

          {/* Compass Ribbon */}
          <div className="flex flex-col items-center text-[10px] text-neutral-400">
            <div className="flex items-center gap-1 text-white font-bold">
              <Compass size={13} className="text-cyan-400" />
              <span>{telemetry.heading}°</span>
            </div>
            <span className="text-[8px] text-neutral-500 font-bold">
              {telemetry.heading >= 315 || telemetry.heading < 45
                ? 'NORTH'
                : telemetry.heading < 135
                ? 'EAST'
                : telemetry.heading < 225
                ? 'SOUTH'
                : 'WEST'}
            </span>
          </div>

          <div className="w-px h-7 bg-white/15" />

          {/* EMP Shockwave Readiness Trigger */}
          <div className="flex items-center">
            <button
              onClick={() => onVirtualInput({ forward: 0, turn: 0, action: true })}
              disabled={telemetry.empCooldown < 0.98}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                telemetry.empCooldown >= 0.98
                  ? 'border-cyan-400 bg-cyan-500/30 text-cyan-200 animate-pulse shadow-lg shadow-cyan-500/20'
                  : 'border-white/10 bg-neutral-900 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Zap size={13} className={telemetry.empCooldown >= 0.98 ? 'text-cyan-300' : 'text-neutral-600'} />
              <span>{telemetry.empCooldown >= 0.98 ? 'EMP READY [SPACE]' : 'CHARGING'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Virtual Touch Joystick */}
        {touchActive && (
          <div className="pointer-events-auto flex items-end justify-between w-full pb-2 md:hidden">
            <div
              ref={joystickBaseRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-28 h-28 rounded-full border-2 border-cyan-500/40 bg-neutral-950/80 backdrop-blur-xl shadow-xl flex items-center justify-center touch-none"
            >
              <div
                className="w-12 h-12 rounded-full border border-cyan-400 bg-cyan-500/40 transition-transform duration-75"
                style={{
                  transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                }}
              />
              <span className="absolute bottom-1 text-[8px] text-cyan-300 pointer-events-none font-bold">
                FLIGHT STICK
              </span>
            </div>

            <button
              onTouchStart={() => onVirtualInput({ forward: 0, turn: 0, action: true })}
              onTouchEnd={() => onVirtualInput({ forward: 0, turn: 0, action: false })}
              className={`w-20 h-20 rounded-full border-2 backdrop-blur-xl flex flex-col items-center justify-center text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-2xl ${
                telemetry.empCooldown >= 0.98
                  ? 'border-cyan-400 bg-cyan-500/40 text-cyan-200'
                  : 'border-white/10 bg-neutral-900 text-neutral-500'
              }`}
            >
              <Zap size={20} className={telemetry.empCooldown >= 0.98 ? 'animate-pulse text-cyan-300' : ''} />
              <span>EMP</span>
            </button>
          </div>
        )}

        {/* Sector Metadata Tag */}
        <div className="pointer-events-auto hidden lg:block text-right text-[10px] text-neutral-400">
          <div className="font-bold text-white tracking-wider">SUNLIT METROPOLIS // 420m</div>
          <div className="text-neutral-500">LIVE MULTIPLAYER SECTOR</div>
        </div>
      </footer>
    </div>
  );
}
