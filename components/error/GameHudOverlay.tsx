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
  Check
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
      setChatFeed((prev) => [...prev.slice(-4), e]);
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
      
      {/* Red damage vignette flash when shields fall below 35% */}
      {shieldPercent < 35 && (
        <div className="pointer-events-none absolute inset-0 bg-red-600/15 animate-pulse" />
      )}

      {/* ── 1. TOP BAR: IDENTITY, DIFFICULTY, MULTIPLAYER SQUAD & CONTROLS ── */}
      <header className="flex flex-wrap items-center justify-between gap-2.5 w-full">
        
        {/* Unit Identity & Callsign */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/60 bg-white/85 backdrop-blur-md shadow-lg text-xs">
          <div className="flex items-center gap-1.5 text-amber-600 font-bold">
            <Sun size={14} className="animate-spin text-amber-500" style={{ animationDuration: '14s' }} />
            <span className="text-stone-900 tracking-wider">SUNLIT METROPOLIS</span>
          </div>

          <div className="w-px h-3 bg-stone-300 hidden sm:inline" />

          {/* Callsign Editor */}
          {isEditingCallsign ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={callsignInput}
                onChange={(e) => setCallsignInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveCallsign()}
                className="px-1.5 py-0.5 rounded border border-teal-500 bg-white text-stone-900 text-[11px] font-bold outline-none w-28"
                autoFocus
              />
              <button
                onClick={handleSaveCallsign}
                className="p-1 rounded bg-teal-600 text-white cursor-pointer hover:bg-teal-700"
              >
                <Check size={12} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingCallsign(true)}
              className="flex items-center gap-1 text-[11px] text-teal-800 font-bold bg-teal-50/80 px-2 py-0.5 rounded-lg border border-teal-200 cursor-pointer hover:bg-teal-100/90 transition-all"
              title="Click to edit player callsign"
            >
              <span>{netStatus.callsign}</span>
              <Edit2 size={10} className="text-teal-600 ml-0.5 opacity-60" />
            </div>
          )}
        </div>

        {/* Difficulty Mode Selector Pills */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl border border-white/60 bg-white/85 backdrop-blur-md shadow-lg text-[10px]">
          {(['easy', 'medium', 'hard'] as DifficultyMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onSelectDifficulty(mode)}
              className={`px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer ${
                difficultyMode === mode
                  ? mode === 'easy'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : mode === 'medium'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-red-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-white/60'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Real-Time Multiplayer Squad Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/60 bg-white/85 backdrop-blur-md shadow-lg text-xs">
          <div className="flex items-center gap-1.5">
            <Users size={13} className={netStatus.peerCount > 1 ? 'text-teal-600 animate-pulse' : 'text-stone-400'} />
            <span className="text-[11px] text-stone-800 font-bold">
              SQUAD: <strong className="text-teal-700">{netStatus.peerCount} PILOTS</strong>
            </span>
          </div>

          <div className="w-px h-3 bg-stone-300" />

          <div className="flex items-center gap-1 text-[10px] text-stone-500">
            {netStatus.connected ? (
              <Wifi size={12} className="text-emerald-500" />
            ) : (
              <WifiOff size={12} className="text-amber-500" />
            )}
            <span className="font-mono">{netStatus.ping}ms</span>
          </div>
        </div>

        {/* Shield / Hull Integrity Gauge */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-white/60 bg-white/85 backdrop-blur-md shadow-lg text-xs">
          <ShieldAlert size={14} className={shieldPercent < 30 ? 'text-red-500 animate-bounce' : 'text-emerald-600'} />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-stone-700 font-bold">SHIELD</span>
              <span className={shieldPercent < 30 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                {telemetry.shields} / {telemetry.maxShields} HP
              </span>
            </div>
            <div className="w-20 sm:w-28 h-1.5 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
              <div
                className={`h-full transition-all duration-300 ${
                  shieldPercent < 30 ? 'bg-red-500' : shieldPercent < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${shieldPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Audio, Console & Home Exit */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-xl border text-xs transition-all duration-200 cursor-pointer shadow-md ${
              isAudioActive
                ? 'border-emerald-500/80 bg-emerald-50 text-emerald-800'
                : 'border-white/60 bg-white/85 text-stone-700 hover:bg-white'
            }`}
            title="Toggle Web Audio"
          >
            {isAudioActive ? <Volume2 size={14} className="text-emerald-600 animate-pulse" /> : <VolumeX size={14} className="text-stone-400" />}
          </button>

          <button
            onClick={onToggleTerminal}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs tracking-wider transition-all cursor-pointer shadow-md ${
              isTerminalOpen
                ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold'
                : 'border-white/60 bg-white/85 text-stone-700 hover:bg-white'
            }`}
          >
            <TerminalIcon size={14} className="text-teal-600" />
            <span className="hidden sm:inline">LOGS</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/60 bg-white/85 text-xs text-stone-700 hover:text-stone-950 hover:bg-white transition-all shadow-md cursor-pointer font-semibold"
          >
            <Home size={14} />
            <span className="hidden sm:inline">EXIT</span>
          </Link>
        </div>
      </header>

      {/* ── 2. CENTER RETICLE ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center w-16 h-16 opacity-35">
          <div className="absolute w-full h-px bg-teal-700" />
          <div className="absolute h-full w-px bg-teal-700" />
          <div className="w-8 h-8 rounded-full border border-teal-700" />
        </div>
      </div>

      {/* ── 3. MID-LEFT: MULTIPLAYER SQUAD CHAT & QUICK PING WHEEL ── */}
      <div className="pointer-events-auto hidden sm:flex flex-col gap-2 max-w-[240px] absolute top-20 left-5">
        {/* Quick Ping / Radio Buttons */}
        <div className="rounded-2xl border border-white/60 bg-white/85 backdrop-blur-md p-2.5 shadow-lg">
          <div className="text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <MessageSquare size={11} className="text-teal-600" />
            <span>SQUAD QUICK PING</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'EMP READY', ping: 'EMP Shockwave ready!' },
              { label: 'HOSTILES', ping: 'Zombies swarming my position!' },
              { label: 'BEACON', ping: 'Beacon located! Moving in.' },
              { label: 'REGROUP', ping: 'Regroup at bridge!' },
            ].map((qp) => (
              <button
                key={qp.label}
                onClick={() => handleQuickPing(qp.ping)}
                className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-teal-50 hover:text-teal-900 border border-stone-200 text-[9px] font-bold text-stone-700 transition-all cursor-pointer text-left truncate"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Multiplayer Feed */}
        {chatFeed.length > 0 && (
          <div className="rounded-2xl border border-white/60 bg-white/85 backdrop-blur-md p-2.5 shadow-lg space-y-1 text-[10px]">
            {chatFeed.slice(-3).map((item, idx) => (
              <div key={idx} className="leading-tight text-stone-700">
                <strong className="text-teal-800 font-bold">{item.callsign}:</strong>{' '}
                {item.text || (item.type === 'BEACON_ACTIVATE' ? `Activated Beacon ${item.beaconId}!` : 'Detonated EMP!')}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 4. MID-RIGHT: RADAR & SURVIVAL BEACONS ── */}
      <div className="pointer-events-auto flex flex-col gap-2.5 max-w-[270px] self-end sm:self-auto sm:absolute sm:top-20 sm:right-5">
        
        {/* Zombie Horde Radar */}
        <div className="rounded-2xl border border-red-200 bg-white/90 backdrop-blur-md p-3 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-stone-200 text-[10px]">
            <span className="flex items-center gap-1 text-red-600 font-bold">
              <Skull size={13} className="animate-pulse" />
              MUTANT HORDE
            </span>
            <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200">
              {telemetry.zombiesChasing} HUNTING
            </span>
          </div>
          <div className="text-[10px] text-stone-600 flex items-center justify-between">
            <span>MUTANTS IN 420m ARENA:</span>
            <strong className="text-stone-900">{telemetry.zombieCount}</strong>
          </div>
        </div>

        {/* Survival Beacons Card */}
        <div className="rounded-2xl border border-white/60 bg-white/90 backdrop-blur-md p-3.5 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-stone-200 text-[11px] text-stone-700 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-teal-700 font-bold">
              <Radio size={13} className="animate-pulse text-teal-600" />
              SURVIVAL BEACONS
            </span>
            <span className="font-bold text-stone-900 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {beacons.filter((b) => b.activated).length} / {beacons.length}
            </span>
          </div>

          <div className="space-y-1.5 text-xs max-h-40 overflow-y-auto pr-1">
            {beacons.map((beacon) => (
              <div
                key={beacon.id}
                className={`flex items-center justify-between p-1.5 rounded-xl border transition-all ${
                  beacon.activated
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-stone-200 bg-stone-50/70 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Crosshair size={12} className={beacon.activated ? 'text-emerald-600' : 'text-stone-400'} />
                  <span className="font-mono text-[10px]">{beacon.name}</span>
                </div>
                {beacon.activated ? (
                  <CheckCircle2 size={13} className="text-emerald-600" />
                ) : (
                  <span className="text-[9px] text-amber-600 font-bold tracking-wider">OFFLINE</span>
                )}
              </div>
            ))}
          </div>

          {!allActivated && (
            <div className="mt-2.5 pt-2 border-t border-stone-200 text-[10px] text-stone-600 flex items-center justify-between">
              <span>TARGET BEACON:</span>
              <strong className="text-teal-700 tracking-wider font-mono">
                {telemetry.nearestDist > 0 ? `${telemetry.nearestDist}m` : 'LOCATING...'}
              </strong>
            </div>
          )}
        </div>

        {/* Last Activated Beacon Alert */}
        {lastActivatedBeacon && (
          <div className="animate-bounce rounded-xl border border-emerald-400 bg-emerald-50 p-2.5 text-xs text-emerald-900 shadow-lg flex items-center gap-2">
            <Sparkles size={15} className="text-emerald-600" />
            <div>
              <div className="font-bold uppercase tracking-wider text-emerald-800 text-[11px]">
                BEACON {lastActivatedBeacon.id} ACTIVE!
              </div>
              <div className="text-[9px] text-emerald-700 font-mono">
                Solar Skyward Laser Fired
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. VICTORY EVACUATION MODAL ── */}
      {allActivated && (
        <div className="pointer-events-auto absolute inset-x-4 top-20 sm:top-24 max-w-lg mx-auto rounded-3xl border-2 border-emerald-500 bg-white/95 backdrop-blur-2xl p-6 sm:p-7 text-center shadow-2xl z-40 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs tracking-widest uppercase mb-3 font-bold">
            <Sparkles size={14} />
            <span>ALL BEACONS SYNCHRONIZED ACROSS SQUAD</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mb-2.5">
            Extraction Gateway Online.
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 mb-6 font-sans leading-relaxed">
            The ancient Warp Gateway at <code>(0, 0)</code> is fully charged by the squad&apos;s solar beacons.
            Fly into the turquoise vortex or warp home now:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onEnterPortal}
              className="px-6 py-3 rounded-xl border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 text-xs tracking-wider uppercase font-bold cursor-pointer transition-all shadow-lg"
            >
              ← Evacuate to Home (/)
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

      {/* ── 6. FOOTER: FLIGHT GAUGES, KEYBOARD & TOUCH CONTROLS ── */}
      <footer className="w-full flex items-end justify-between gap-3">
        
        {/* Flight Gauges (Heading, Speed, EMP) */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 px-3.5 py-2 rounded-xl border border-white/60 bg-white/85 backdrop-blur-md shadow-lg text-xs text-stone-800">
          <div className="flex items-center gap-1.5">
            <Compass size={14} className="text-teal-600" />
            <span>HDG: <strong className="text-stone-950 font-bold">{telemetry.heading}°</strong></span>
          </div>
          <div className="w-px h-3 bg-stone-300" />
          <div>
            SPEED: <strong className="text-stone-950 font-bold">{telemetry.speed.toFixed(1)}</strong> km/h
          </div>
          <div className="w-px h-3 bg-stone-300" />
          <div className="flex items-center gap-1.5">
            <Zap size={14} className={telemetry.empCooldown >= 1 ? 'text-cyan-600 animate-pulse' : 'text-stone-400'} />
            <span className={telemetry.empCooldown >= 1 ? 'text-teal-700 font-bold' : 'text-stone-400'}>
              {telemetry.empCooldown >= 1 ? 'EMP READY (SPACE)' : 'CHARGING'}
            </span>
          </div>
        </div>

        {/* Mobile Virtual Touch Joystick */}
        {touchActive && (
          <div className="pointer-events-auto flex items-end justify-between w-full pb-2">
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

        {/* Environment Specs */}
        <div className="pointer-events-auto hidden sm:block text-right text-[10px] text-stone-600">
          <div className="font-semibold text-stone-900">ENVIRONMENT: 420m SUNLIT METROPOLIS</div>
          <div>REALISTIC HOUSES, SKYSCRAPERS & RIVER VALLEY</div>
        </div>
      </footer>
    </div>
  );
}
