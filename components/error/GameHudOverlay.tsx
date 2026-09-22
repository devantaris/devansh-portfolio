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
  Sun,
  Users,
  Wifi,
  WifiOff,
  MessageSquare,
  Edit2,
  Check,
  ChevronRight
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

  // Multiplayer status & chat feed
  const [netStatus, setNetStatus] = useState<NetworkStatus>({
    connected: false,
    peerCount: 1,
    ping: 35,
    callsign: gameNetwork.getCallsign(),
    playerId: gameNetwork.getPlayerId(),
  });
  const [chatFeed, setChatFeed] = useState<NetworkEvent[]>([]);
  const [isEditingCallsign, setIsEditingCallsign] = useState(false);
  const [callsignInput, setCallsignInput] = useState(gameNetwork.getCallsign());

  useEffect(() => {
    gameNetwork.onStatusChange = (s) => setNetStatus(s);
    gameNetwork.onEvent = (e) => {
      setChatFeed((prev) => [...prev.slice(-3), e]);
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

  const handleQuickPing = (text: string) => {
    gameNetwork.sendQuickChat(text);
  };

  const shieldPercent = Math.round((telemetry.shields / (telemetry.maxShields || 100)) * 100);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 font-mono select-none overflow-hidden">
      
      {/* Critical damage red pulse vignette */}
      {shieldPercent < 35 && (
        <div className="pointer-events-none absolute inset-0 bg-red-600/20 animate-pulse" />
      )}

      {/* ── 1. SLEEK TOP AEROSPACE STATUS BAR (UNIFIED DARK GLASS) ── */}
      <header className="pointer-events-auto flex items-center justify-between gap-3 w-full max-w-6xl mx-auto px-4 py-2 rounded-2xl bg-neutral-950/80 backdrop-blur-2xl border border-white/15 text-white shadow-2xl">
        
        {/* Left: Pilot Callsign & Squad Presence */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isEditingCallsign ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={callsignInput}
                  onChange={(e) => setCallsignInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveCallsign()}
                  className="px-2 py-0.5 rounded-lg border border-cyan-500 bg-neutral-900 text-white text-xs font-bold outline-none w-28"
                  autoFocus
                />
                <button
                  onClick={handleSaveCallsign}
                  className="p-1 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500"
                >
                  <Check size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingCallsign(true)}
                className="flex items-center gap-1.5 text-xs text-cyan-300 font-bold hover:text-white transition-colors"
                title="Click to edit callsign"
              >
                <span>{netStatus.callsign}</span>
                <Edit2 size={10} className="text-cyan-400 opacity-60" />
              </button>
            )}
          </div>

          <div className="w-px h-3.5 bg-white/15 hidden sm:block" />

          {/* Squad status */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400">
            <Users size={12} className={netStatus.peerCount > 1 ? 'text-cyan-400' : 'text-neutral-500'} />
            <span>
              <strong className="text-white font-bold">{netStatus.peerCount}</strong> {netStatus.peerCount === 1 ? 'PILOT' : 'PILOTS'}
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-[10px] text-neutral-500">{netStatus.ping}ms</span>
          </div>
        </div>

        {/* Center: Difficulty Mode Aerospace Switch */}
        <div className="flex items-center p-0.5 rounded-xl bg-neutral-900 border border-white/10 text-[10px]">
          {(['easy', 'medium', 'hard'] as DifficultyMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onSelectDifficulty(mode)}
              className={`px-3 py-1 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer ${
                difficultyMode === mode
                  ? mode === 'easy'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : mode === 'medium'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Right: Shield Battery Meter & Actions */}
        <div className="flex items-center gap-3">
          {/* Hull Shield Bar */}
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className={shieldPercent < 30 ? 'text-red-400 animate-pulse' : 'text-cyan-400'} />
            <div className="flex flex-col items-end">
              <div className="text-[10px] text-neutral-400 font-bold tracking-wider">
                <span className={shieldPercent < 30 ? 'text-red-400' : 'text-white'}>
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

          <div className="w-px h-3.5 bg-white/15" />

          {/* Audio, Logs & Exit */}
          <div className="flex items-center gap-1">
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
              title="Toggle System Terminal"
            >
              <TerminalIcon size={14} />
            </button>

            <Link
              href="/"
              className="p-1.5 rounded-xl border border-white/10 bg-neutral-900 text-neutral-400 hover:text-white hover:border-white/30 transition-all cursor-pointer"
              title="Return to Home"
            >
              <Home size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── 2. CENTER CROSSHAIR RETICLE ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center w-20 h-20 opacity-30">
          <div className="absolute w-full h-px bg-cyan-400" />
          <div className="absolute h-full w-px bg-cyan-400" />
          <div className="w-10 h-10 rounded-full border border-cyan-400/60" />
        </div>
      </div>

      {/* ── 3. TOP-RIGHT: TACTICAL RADAR & BEACONS ── */}
      <aside className="pointer-events-auto flex flex-col gap-2 max-w-[240px] self-end sm:self-auto sm:absolute sm:top-16 sm:right-5">
        
        {/* Sleek Dark Glass Radar Card */}
        <div className="rounded-2xl border border-white/15 bg-neutral-950/80 backdrop-blur-2xl p-3 text-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px]">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold tracking-wider">
              <Radio size={12} className="animate-pulse" />
              TACTICAL RADAR
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-[10px]">
              {beacons.filter((b) => b.activated).length} / {beacons.length}
            </span>
          </div>

          {/* Horde Threat Status */}
          <div className="flex items-center justify-between text-[10px] text-neutral-300 mb-2 px-1">
            <span className="flex items-center gap-1 text-rose-400">
              <Skull size={11} />
              MUTANTS DETECTED:
            </span>
            <span className="font-bold text-rose-300">
              {telemetry.zombiesChasing > 0 ? `${telemetry.zombiesChasing} HUNTING` : `${telemetry.zombieCount} ROAMING`}
            </span>
          </div>

          {/* Beacons Mini List */}
          <div className="space-y-1 text-[10px]">
            {beacons.map((b) => (
              <div
                key={b.id}
                className={`flex items-center justify-between px-2 py-1 rounded-lg border transition-all ${
                  b.activated
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/5 bg-neutral-900/60 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Crosshair size={11} className={b.activated ? 'text-emerald-400' : 'text-neutral-500'} />
                  <span className="truncate">{b.name}</span>
                </div>
                {b.activated ? (
                  <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                ) : (
                  <span className="text-[9px] text-amber-400 font-bold">READY</span>
                )}
              </div>
            ))}
          </div>

          {/* Nearest Beacon Distance Indicator */}
          {!allActivated && (
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400 px-1">
              <span>NEAREST BEACON:</span>
              <strong className="text-cyan-300 font-bold">
                {telemetry.nearestDist > 0 ? `${telemetry.nearestDist}m` : 'LOCATING...'}
              </strong>
            </div>
          )}
        </div>

        {/* Beacon Activation Alert */}
        {lastActivatedBeacon && (
          <div className="animate-bounce rounded-xl border border-emerald-500/40 bg-emerald-950/80 backdrop-blur-xl p-2.5 text-xs text-emerald-300 shadow-xl flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" />
            <div>
              <div className="font-bold uppercase tracking-wider text-[11px] text-white">
                BEACON {lastActivatedBeacon.id} ONLINE
              </div>
              <div className="text-[9px] text-emerald-400 font-mono">
                Skyward Solar Column Fired
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── 4. LEFT: SQUAD QUICK RADIO PINGS & CHAT ── */}
      <aside className="pointer-events-auto hidden sm:flex flex-col gap-2 max-w-[220px] absolute top-16 left-5">
        {/* Quick Ping Strip */}
        <div className="rounded-2xl border border-white/15 bg-neutral-950/80 backdrop-blur-2xl p-2 text-white shadow-2xl">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 px-1">
            <MessageSquare size={11} className="text-cyan-400" />
            <span>SQUAD RADIO</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[9px]">
            {[
              { label: 'EMP READY', ping: 'EMP Shockwave ready!' },
              { label: 'HOSTILES', ping: 'Mutants swarming my position!' },
              { label: 'BEACON', ping: 'Beacon localized! Moving in.' },
              { label: 'REGROUP', ping: 'Regroup at bridge!' },
            ].map((qp) => (
              <button
                key={qp.label}
                onClick={() => handleQuickPing(qp.ping)}
                className="px-2 py-1 rounded-lg bg-neutral-900 border border-white/10 hover:border-cyan-500/50 hover:text-cyan-300 text-neutral-300 font-bold transition-all cursor-pointer truncate text-left"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Incoming Radio Feed */}
        {chatFeed.length > 0 && (
          <div className="rounded-2xl border border-white/15 bg-neutral-950/80 backdrop-blur-2xl p-2.5 text-[10px] text-neutral-300 shadow-2xl space-y-1">
            {chatFeed.slice(-3).map((msg, i) => (
              <div key={i} className="leading-tight">
                <strong className="text-cyan-300 font-bold">{msg.callsign}:</strong>{' '}
                {msg.text || (msg.type === 'BEACON_ACTIVATE' ? `Synchronized Beacon ${msg.beaconId}!` : 'EMP shockwave fired!')}
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ── 5. VICTORY EVACUATION MODAL ── */}
      {allActivated && (
        <div className="pointer-events-auto absolute inset-x-4 top-24 max-w-lg mx-auto rounded-3xl border-2 border-emerald-500 bg-neutral-950/95 backdrop-blur-2xl p-7 text-center shadow-2xl z-40 animate-fade-in text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs tracking-widest uppercase mb-3 font-bold">
            <Sparkles size={14} />
            <span>ALL BEACONS SYNCHRONIZED ACROSS SQUAD</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2.5">
            Extraction Gateway Online.
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 mb-6 font-sans leading-relaxed">
            The ancient Warp Gateway at <code>(0, 0)</code> is fully charged by the squad&apos;s solar beacons.
            Fly into the turquoise vortex or warp home now:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onEnterPortal}
              className="px-6 py-3 rounded-xl border border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all shadow-lg"
            >
              ← Evacuate to Home (/)
            </button>

            <Link
              href="/universe"
              className="px-6 py-3 rounded-xl border border-white/20 bg-neutral-900 text-white hover:bg-neutral-800 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all shadow-md"
            >
              Escape to 3D Universe →
            </Link>
          </div>
        </div>
      )}

      {/* ── 6. AERODYNAMIC DASHBOARD AT BOTTOM CENTER ── */}
      <footer className="w-full flex items-end justify-between gap-4">
        
        {/* Desktop Keyboard Legend */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-neutral-950/70 backdrop-blur-xl border border-white/10 text-[10px] text-neutral-400">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-white font-bold border border-white/10">W</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-white font-bold border border-white/10">S</kbd>
            <span>Thrust</span>
          </div>
          <span className="text-neutral-600">•</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-white font-bold border border-white/10">A</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-white font-bold border border-white/10">D</kbd>
            <span>Steer</span>
          </div>
          <span className="text-neutral-600">•</span>
          <div className="flex items-center gap-1 text-cyan-300">
            <kbd className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">SHIFT</kbd>
            <span>Turbo</span>
          </div>
          <span className="text-neutral-600">•</span>
          <div className="flex items-center gap-1 text-amber-300">
            <kbd className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-bold">SPACE</kbd>
            <span>EMP</span>
          </div>
        </div>

        {/* Center: High-Speed Flight Telemetry Cluster */}
        <div className="pointer-events-auto flex items-center gap-4 px-4 py-2 rounded-2xl bg-neutral-950/80 backdrop-blur-2xl border border-white/15 text-white shadow-2xl mx-auto md:mx-0">
          
          {/* Digital Speedometer */}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold tracking-tight font-mono text-cyan-300">
                {Math.round(telemetry.speed)}
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">KM/H</span>
            </div>
            {telemetry.speed > 80 && (
              <span className="text-[8px] font-bold text-cyan-400 animate-pulse tracking-widest">
                TURBO ENGAGED
              </span>
            )}
          </div>

          <div className="w-px h-6 bg-white/15" />

          {/* Heading Compass */}
          <div className="flex flex-col items-center text-[10px] text-neutral-400">
            <div className="flex items-center gap-1 text-white font-bold">
              <Compass size={13} className="text-cyan-400" />
              <span>{telemetry.heading}°</span>
            </div>
            <span className="text-[9px] text-neutral-500">HEADING</span>
          </div>

          <div className="w-px h-6 bg-white/15" />

          {/* EMP Shockwave Readiness */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVirtualInput({ forward: 0, turn: 0, action: true })}
              disabled={telemetry.empCooldown < 0.98}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                telemetry.empCooldown >= 0.98
                  ? 'border-cyan-400 bg-cyan-500/30 text-cyan-300 animate-pulse shadow-lg shadow-cyan-500/20'
                  : 'border-white/10 bg-neutral-900 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Zap size={13} className={telemetry.empCooldown >= 0.98 ? 'text-cyan-300' : 'text-neutral-600'} />
              <span>{telemetry.empCooldown >= 0.98 ? 'EMP READY' : 'CHARGING'}</span>
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
                STICK
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

        {/* Environment Specs */}
        <div className="pointer-events-auto hidden sm:block text-right text-[10px] text-neutral-400">
          <div className="font-bold text-white tracking-wider">SUNLIT METROPOLIS // 420m</div>
          <div className="text-neutral-500">LIVE MULTIPLAYER SECTOR</div>
        </div>
      </footer>
    </div>
  );
}
