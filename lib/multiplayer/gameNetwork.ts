'use client';

import Paho from 'paho-mqtt';

export interface RemotePlayerState {
  id: string;
  callsign: string;
  x: number;
  y: number;
  z: number;
  rotY: number;
  pitch: number;
  roll: number;
  speed: number;
  shields: number;
  maxShields: number;
  empActive: boolean;
  color: number;
  lastSeen: number;
  isAI?: boolean;
}

export type NetworkEventType =
  | 'BEACON_ACTIVATE'
  | 'EMP_BLAST'
  | 'QUICK_CHAT'
  | 'PLAYER_JOIN'
  | 'PLAYER_LEAVE';

export interface NetworkEvent {
  type: NetworkEventType;
  beaconId?: string;
  playerId: string;
  callsign: string;
  text?: string;
  x?: number;
  z?: number;
  timestamp: number;
}

export interface NetworkStatus {
  connected: boolean;
  peerCount: number;
  ping: number;
  callsign: string;
  playerId: string;
}

const BROKER_HOST = 'broker.hivemq.com';
const BROKER_PORT = 8884;
const BROKER_PATH = '/mqtt';
const TOPIC_PREFIX = 'devantaris/portfolio/arena/v2';
const TOPIC_PLAYERS = `${TOPIC_PREFIX}/players`;
const TOPIC_EVENTS = `${TOPIC_PREFIX}/events`;

const CALLSIGN_ADJECTIVES = [
  'Apex', 'Vanguard', 'Specter', 'Echo', 'Falcon', 'Nova', 'Cyber', 'Solar',
  'Ghost', 'Orion', 'Zenith', 'Phantom', 'Cobalt', 'Ranger', 'Striker', 'Aero'
];

const CALLSIGN_NOUNS = [
  'Wing', 'Drone', 'Pilot', 'One', 'Seven', 'Alpha', 'Beta', 'Prime',
  'Scout', 'Overwatch', 'Striker', 'Zero', 'Recon', 'Vector'
];

const PLAYER_COLORS = [
  0x00f5d4, // Cyan mint
  0x70d6ff, // Sky blue
  0xff9e00, // Amber solar
  0xff5400, // Blaze orange
  0xe0aaff, // Lavender
  0x38b000, // Emerald
  0xff4d6d, // Rose neon
];

export class GameNetworkManager {
  private client: Paho.Client | null = null;
  private localPlayerId: string;
  private localCallsign: string;
  private localColor: number;
  private isConnected = false;
  private remotePlayers = new Map<string, RemotePlayerState>();
  private lastBroadcastTime = 0;
  private pruneInterval: any = null;
  private aiInterval: any = null;
  private lastPingTime = 0;
  private currentPing = 35;

  public onPlayersUpdate?: (players: RemotePlayerState[]) => void;
  public onEvent?: (event: NetworkEvent) => void;
  public onStatusChange?: (status: NetworkStatus) => void;

  constructor() {
    this.localPlayerId = this.initPlayerId();
    this.localCallsign = this.initCallsign();
    this.localColor = PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
  }

  private initPlayerId(): string {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('dp_player_id');
      if (stored) return stored;
      const gen = 'pilot_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('dp_player_id', gen);
      return gen;
    }
    return 'pilot_' + Math.random().toString(36).substring(2, 9);
  }

  private initCallsign(): string {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dp_player_callsign');
      if (stored) return stored;
    }
    const adj = CALLSIGN_ADJECTIVES[Math.floor(Math.random() * CALLSIGN_ADJECTIVES.length)];
    const noun = CALLSIGN_NOUNS[Math.floor(Math.random() * CALLSIGN_NOUNS.length)];
    const gen = `${adj}-${noun}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dp_player_callsign', gen);
    }
    return gen;
  }

  public setCallsign(newCallsign: string) {
    this.localCallsign = newCallsign.trim() || this.localCallsign;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dp_player_callsign', this.localCallsign);
    }
    this.notifyStatus();
  }

  public getCallsign(): string {
    return this.localCallsign;
  }

  public getPlayerId(): string {
    return this.localPlayerId;
  }

  public getLocalColor(): number {
    return this.localColor;
  }

  public connect() {
    if (typeof window === 'undefined') return;
    if (this.client && this.isConnected) return;

    try {
      const clientId = `dp_${this.localPlayerId}_${Date.now().toString(36)}`;
      this.client = new Paho.Client(BROKER_HOST, BROKER_PORT, BROKER_PATH, clientId);

      this.client.onConnectionLost = () => {
        this.isConnected = false;
        this.notifyStatus();
        setTimeout(() => {
          if (!this.isConnected) {
            this.connect();
          }
        }, 3000);
      };

      this.client.onMessageArrived = (message) => {
        this.handleMessage(message.destinationName, message.payloadString);
      };

      this.client.connect({
        useSSL: true,
        timeout: 8,
        keepAliveInterval: 20,
        cleanSession: true,
        onSuccess: () => {
          this.isConnected = true;
          this.currentPing = Date.now() - this.lastPingTime || 42;

          this.client?.subscribe(`${TOPIC_PLAYERS}/+`, { qos: 0 });
          this.client?.subscribe(TOPIC_EVENTS, { qos: 0 });

          this.broadcastEvent({
            type: 'PLAYER_JOIN',
            playerId: this.localPlayerId,
            callsign: this.localCallsign,
            timestamp: Date.now(),
          });

          this.notifyStatus();
          this.startPruneLoop();
          this.startSimulatedSquadLoop();
        },
        onFailure: () => {
          this.isConnected = false;
          this.notifyStatus();
          setTimeout(() => this.connect(), 5000);
        },
      });

      this.lastPingTime = Date.now();
    } catch (e) {
      console.warn('Multiplayer connection attempt error:', e);
    }
  }

  public disconnect() {
    if (this.pruneInterval) clearInterval(this.pruneInterval);
    if (this.aiInterval) clearInterval(this.aiInterval);

    if (this.client && this.isConnected) {
      try {
        this.broadcastEvent({
          type: 'PLAYER_LEAVE',
          playerId: this.localPlayerId,
          callsign: this.localCallsign,
          timestamp: Date.now(),
        });
        this.client.disconnect();
      } catch (e) {}
    }
    this.isConnected = false;
    this.remotePlayers.clear();
    this.notifyStatus();
  }

  private handleMessage(topic: string, payloadStr: string) {
    try {
      const data = JSON.parse(payloadStr);

      if (topic === TOPIC_EVENTS) {
        const event = data as NetworkEvent;
        if (event.playerId === this.localPlayerId) return;

        if (event.type === 'PLAYER_LEAVE') {
          this.remotePlayers.delete(event.playerId);
          this.notifyPlayers();
        }

        if (this.onEvent) {
          this.onEvent(event);
        }
        return;
      }

      if (topic.startsWith(TOPIC_PLAYERS)) {
        const player = data as RemotePlayerState;
        if (player.id === this.localPlayerId) return;

        player.lastSeen = Date.now();
        this.remotePlayers.set(player.id, player);
        this.notifyPlayers();
      }
    } catch (e) {}
  }

  public broadcastTelemetry(state: {
    x: number;
    y: number;
    z: number;
    rotY: number;
    pitch: number;
    roll: number;
    speed: number;
    shields: number;
    maxShields: number;
    empActive: boolean;
  }) {
    const now = Date.now();
    if (now - this.lastBroadcastTime < 95) return;
    this.lastBroadcastTime = now;

    if (!this.client || !this.isConnected) return;

    try {
      const payload: RemotePlayerState = {
        id: this.localPlayerId,
        callsign: this.localCallsign,
        x: Math.round(state.x * 100) / 100,
        y: Math.round(state.y * 100) / 100,
        z: Math.round(state.z * 100) / 100,
        rotY: Math.round(state.rotY * 1000) / 1000,
        pitch: Math.round(state.pitch * 1000) / 1000,
        roll: Math.round(state.roll * 1000) / 1000,
        speed: Math.round(state.speed * 10) / 10,
        shields: Math.round(state.shields),
        maxShields: Math.round(state.maxShields),
        empActive: state.empActive,
        color: this.localColor,
        lastSeen: now,
      };

      const msg = new Paho.Message(JSON.stringify(payload));
      msg.destinationName = `${TOPIC_PLAYERS}/${this.localPlayerId}`;
      msg.qos = 0;
      this.client.send(msg);
    } catch (e) {}
  }

  public broadcastEvent(event: NetworkEvent) {
    if (!this.client || !this.isConnected) return;
    try {
      const msg = new Paho.Message(JSON.stringify(event));
      msg.destinationName = TOPIC_EVENTS;
      msg.qos = 0;
      this.client.send(msg);
    } catch (e) {}
  }

  public sendQuickChat(text: string) {
    const event: NetworkEvent = {
      type: 'QUICK_CHAT',
      playerId: this.localPlayerId,
      callsign: this.localCallsign,
      text,
      timestamp: Date.now(),
    };
    this.broadcastEvent(event);
    if (this.onEvent) {
      this.onEvent(event);
    }
  }

  public sendEmpBlast(x: number, z: number) {
    const event: NetworkEvent = {
      type: 'EMP_BLAST',
      playerId: this.localPlayerId,
      callsign: this.localCallsign,
      x,
      z,
      timestamp: Date.now(),
    };
    this.broadcastEvent(event);
  }

  public sendBeaconActivated(beaconId: string) {
    const event: NetworkEvent = {
      type: 'BEACON_ACTIVATE',
      beaconId,
      playerId: this.localPlayerId,
      callsign: this.localCallsign,
      timestamp: Date.now(),
    };
    this.broadcastEvent(event);
    if (this.onEvent) {
      this.onEvent(event);
    }
  }

  private startPruneLoop() {
    if (this.pruneInterval) clearInterval(this.pruneInterval);
    this.pruneInterval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [id, player] of this.remotePlayers.entries()) {
        if (!player.isAI && now - player.lastSeen > 4500) {
          this.remotePlayers.delete(id);
          changed = true;
        }
      }
      if (changed) {
        this.notifyPlayers();
        this.notifyStatus();
      }
    }, 2000);
  }

  private startSimulatedSquadLoop() {
    if (this.aiInterval) clearInterval(this.aiInterval);

    const aiSquad: RemotePlayerState[] = [
      {
        id: 'ai_wing_echo01',
        callsign: 'Echo-Wing // AI',
        x: -45,
        y: 6.2,
        z: -30,
        rotY: 0,
        pitch: 0,
        roll: 0,
        speed: 7.5,
        shields: 100,
        maxShields: 100,
        empActive: false,
        color: 0x00f5d4,
        lastSeen: Date.now(),
        isAI: true,
      },
      {
        id: 'ai_wing_valk02',
        callsign: 'Valkyrie-02 // AI',
        x: 40,
        y: 8.5,
        z: 45,
        rotY: Math.PI / 2,
        pitch: 0,
        roll: 0,
        speed: 6.8,
        shields: 100,
        maxShields: 100,
        empActive: false,
        color: 0xffb703,
        lastSeen: Date.now(),
        isAI: true,
      },
    ];

    let t = 0;
    this.aiInterval = setInterval(() => {
      t += 0.018;
      const humanCount = Array.from(this.remotePlayers.values()).filter((p) => !p.isAI).length;

      if (humanCount >= 2) {
        let removed = false;
        for (const ai of aiSquad) {
          if (this.remotePlayers.has(ai.id)) {
            this.remotePlayers.delete(ai.id);
            removed = true;
          }
        }
        if (removed) this.notifyPlayers();
        return;
      }

      const ai1 = aiSquad[0];
      const r1 = 80;
      ai1.x = Math.sin(t * 0.4) * r1 - 15;
      ai1.z = Math.cos(t * 0.4) * r1 + 10;
      ai1.y = 5.5 + Math.sin(t * 1.2) * 1.5;
      ai1.rotY = t * 0.4 + Math.PI / 2;
      ai1.speed = 4.2;
      ai1.lastSeen = Date.now();
      this.remotePlayers.set(ai1.id, { ...ai1 });

      const ai2 = aiSquad[1];
      const r2 = 110;
      ai2.x = Math.cos(t * 0.3) * r2 + 25;
      ai2.z = Math.sin(t * 0.3 * 1.3) * (r2 * 0.8) - 20;
      ai2.y = 7.0 + Math.cos(t * 0.9) * 1.2;
      ai2.rotY = -t * 0.3;
      ai2.speed = 3.8;
      ai2.lastSeen = Date.now();
      this.remotePlayers.set(ai2.id, { ...ai2 });

      this.notifyPlayers();
    }, 150);
  }

  private notifyPlayers() {
    if (this.onPlayersUpdate) {
      this.onPlayersUpdate(Array.from(this.remotePlayers.values()));
    }
  }

  private notifyStatus() {
    if (this.onStatusChange) {
      this.onStatusChange({
        connected: this.isConnected,
        peerCount: this.remotePlayers.size + 1,
        ping: this.currentPing,
        callsign: this.localCallsign,
        playerId: this.localPlayerId,
      });
    }
  }
}

export const gameNetwork = new GameNetworkManager();
