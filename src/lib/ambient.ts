// Ambiances sonores générées en Web Audio (aucun fichier).
// À remplacer plus tard par de vrais enregistrements libres de droits dans /public/ambiances.

export type Ambiance = "none" | "sea" | "beach" | "zen";

export const AMBIANCES: { id: Ambiance; label: string }[] = [
  { id: "none", label: "Aucune" },
  { id: "sea", label: "Mer" },
  { id: "beach", label: "Plage & oiseaux" },
  { id: "zen", label: "Nappe zen" },
];

type Stoppable = AudioNode & { stop?: () => void };

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: Stoppable[] = [];
  private timers: ReturnType<typeof setTimeout>[] = [];
  private volume = 0.35;

  private ensure() {
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume * 0.6;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.ctx && this.master) this.master.gain.setTargetAtTime(v * 0.6, this.ctx.currentTime, 0.1);
  }

  stop() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.nodes.forEach((n) => {
      try { n.stop?.(); } catch { /* déjà arrêté */ }
      try { n.disconnect(); } catch { /* déjà déconnecté */ }
    });
    this.nodes = [];
  }

  // Fin d'épisode : le fond s'éteint doucement au lieu de tourner dans le vide
  fadeOut(seconds = 4) {
    if (!this.ctx || !this.master || !this.nodes.length) return;
    const g = this.master.gain, t = this.ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(0.0001, t + seconds);
    this.timers.push(setTimeout(() => this.stop(), seconds * 1000 + 100));
  }

  play(kind: Ambiance) {
    this.stop();
    if (kind === "none") return;
    const ctx = this.ensure();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    // Rétablit le volume si un fondu de fin était en cours
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    this.master!.gain.setValueAtTime(this.volume * 0.6, ctx.currentTime);
    if (kind === "sea") this.waves(1);
    if (kind === "beach") { this.waves(0.75); this.birds(); }
    if (kind === "zen") { this.drone(); this.waves(0.35); }
  }

  private noise() {
    const ctx = this.ctx!;
    const len = ctx.sampleRate * 6;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < len; i++) {
        last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; // bruit brun, doux
        d[i] = last * 3.5;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.start();
    this.nodes.push(src);
    return src;
  }

  private waves(level: number) {
    const ctx = this.ctx!;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 650;
    const g = ctx.createGain();
    g.gain.value = 0.15 * level;
    this.noise().connect(lp);
    lp.connect(g);
    g.connect(this.master!);
    this.nodes.push(lp, g);
    const swell = () => {
      const t = ctx.currentTime, up = 2.5 + Math.random() * 2, down = 4 + Math.random() * 3;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime((0.55 + Math.random() * 0.35) * level, t + up);
      g.gain.linearRampToValueAtTime(0.12 * level, t + up + down);
      lp.frequency.setValueAtTime(lp.frequency.value, t);
      lp.frequency.linearRampToValueAtTime(900 + Math.random() * 500, t + up);
      lp.frequency.linearRampToValueAtTime(500, t + up + down);
      this.timers.push(setTimeout(swell, (up + down) * 1000 + Math.random() * 1500));
    };
    swell();
  }

  private birds() {
    const ctx = this.ctx!;
    const chirp = () => {
      const n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const t = ctx.currentTime + 0.05 + i * (0.12 + Math.random() * 0.1);
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const p = ctx.createStereoPanner();
        const f = 2600 + Math.random() * 1600;
        o.type = "sine";
        o.frequency.setValueAtTime(f, t);
        o.frequency.exponentialRampToValueAtTime(f * (1.2 + Math.random() * 0.4), t + 0.07);
        o.frequency.exponentialRampToValueAtTime(f * 0.9, t + 0.13);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.035, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        p.pan.value = Math.random() * 1.6 - 0.8;
        o.connect(g); g.connect(p); p.connect(this.master!);
        o.start(t); o.stop(t + 0.16);
      }
      this.timers.push(setTimeout(chirp, 3500 + Math.random() * 7000));
    };
    this.timers.push(setTimeout(chirp, 1500));
  }

  private drone() {
    const ctx = this.ctx!;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 3);
    lp.connect(g); g.connect(this.master!);
    this.nodes.push(lp, g);
    [110, 164.8, 220, 277.2].forEach((f, i) => {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = i % 2 ? "triangle" : "sine";
      o.frequency.value = f;
      o.detune.value = (Math.random() - 0.5) * 8;
      og.gain.value = i === 0 ? 0.5 : 0.22;
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.frequency.value = 0.05 + Math.random() * 0.07;
      lg.gain.value = 0.15;
      lfo.connect(lg); lg.connect(og.gain);
      o.connect(og); og.connect(lp);
      o.start(); lfo.start();
      this.nodes.push(o, og, lfo, lg);
    });
  }
}

export const ambient = typeof window !== "undefined" ? new AmbientEngine() : null;
