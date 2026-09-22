/**
 * Zero-dependency Web Audio API soundscape generator for the post-apocalyptic
 * STDERR error experience. Synthesizes gentle forest wind, organic water/chime
 * drops, and mechanical relay clicks with no external audio files.
 */

class ReclamationAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = true;
  private isRunning: boolean = false;
  private noiseSource: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private chimeTimer: ReturnType<typeof setInterval> | null = null;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public async toggle(): Promise<boolean> {
    this.initContext();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isRunning && !this.isMuted) {
      this.mute();
      return false;
    } else {
      this.unmute();
      return true;
    }
  }

  public unmute() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.isMuted = false;

    if (!this.isRunning) {
      this.startAmbience();
    }

    // Smooth fade in over 1.2s
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setTargetAtTime(0.35, this.ctx.currentTime, 0.4);
    this.playChime(523.25); // C5 welcome chime
  }

  public mute() {
    if (!this.ctx || !this.masterGain) return;
    this.isMuted = true;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.3);
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private startAmbience() {
    if (!this.ctx || !this.masterGain) return;
    this.isRunning = true;

    // 1. Create filtered pink noise for wind / forest rustle
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(400, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.8, this.ctx.currentTime);

    // LFO for breathing wind sensation
    this.lfoOsc = this.ctx.createOscillator();
    this.lfoOsc.type = 'sine';
    this.lfoOsc.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

    this.lfoOsc.connect(lfoGain);
    lfoGain.connect(this.filterNode.frequency);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    this.noiseSource.connect(this.filterNode);
    this.filterNode.connect(windGain);
    windGain.connect(this.masterGain);

    this.noiseSource.start();
    this.lfoOsc.start();

    // 2. Periodic organic dew chime drops
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // Pentatonic C-E-G-C-E-G
    this.chimeTimer = setInterval(() => {
      if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
      if (Math.random() > 0.4) {
        const note = notes[Math.floor(Math.random() * notes.length)];
        this.playChime(note, 0.08);
      }
    }, 3800);
  }

  public playClick() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio safety fallback
    }
  }

  public playChime(freq = 659.25, maxVolume = 0.12) {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(maxVolume, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.85);
    } catch {
      // Audio safety fallback
    }
  }

  public playBloomChord() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    chords.forEach((note, i) => {
      setTimeout(() => this.playChime(note, 0.08), i * 110);
    });
  }

  public playScannerPing(highPitch = false) {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(highPitch ? 1480 : 920, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // Audio safety fallback
    }
  }

  public playCollectSound() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playChime(freq, 0.1);
        }, idx * 70);
      });
    } catch {
      // Audio safety fallback
    }
  }

  public playZombieScreech() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160 + Math.random() * 60, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320 + Math.random() * 100, this.ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.48);
    } catch {
      // Audio safety fallback
    }
  }

  public playShieldHit() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Audio safety fallback
    }
  }

  public playEmpBlast() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.7);
    } catch {
      // Audio safety fallback
    }
  }

  public playBeaconLaser() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const notes = [220, 440, 659.25, 880, 1318.5];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playChime(freq, 0.14);
        }, idx * 90);
      });
    } catch {
      // Audio safety fallback
    }
  }

  public playWarpPortalSound() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.6);
    } catch {
      // Audio safety fallback
    }
  }

  public playGlitch() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const node = this.ctx.createBufferSource();
      const length = Math.floor(this.ctx.sampleRate * 0.08);
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }
      node.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      node.connect(gain);
      gain.connect(this.ctx.destination);
      node.start();
    } catch {
      // Audio safety fallback
    }
  }

  public dispose() {
    if (this.chimeTimer) {
      clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    try {
      if (this.noiseSource) {
        this.noiseSource.stop();
        this.noiseSource.disconnect();
      }
      if (this.lfoOsc) {
        this.lfoOsc.stop();
        this.lfoOsc.disconnect();
      }
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close();
      }
    } catch {
      // Ignore cleanup errors
    }
    this.isRunning = false;
    this.ctx = null;
  }
}

export const reclamationAudio = new ReclamationAudio();
