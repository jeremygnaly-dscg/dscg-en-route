"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Episode, Line } from "@/content/types";
import { ambient, AMBIANCES } from "@/lib/ambient";
import { usePrefs, useProgress } from "@/lib/prefs";
import { pickVoice, speakLine, voiceAvailable } from "@/lib/voice";
import { Quiz } from "./Quiz";
import styles from "./player.module.css";

type Part = "scene" | "cours" | "flash";
const PARTS: { id: Part; label: string; hint: string }[] = [
  { id: "scene", label: "Scène", hint: "Le cas" },
  { id: "cours", label: "Cours", hint: "La règle" },
  { id: "flash", label: "Flash", hint: "3 questions" },
];
const WHO: Record<string, string> = { dirigeant: "Dirigeant·e", expert: "Expert-comptable" };

function Rich({ text }: { text: string }) {
  return <>{text.split(/(`[^`]+`)/).map((s, i) => (s.startsWith("`") ? <code key={i}>{s.slice(1, -1)}</code> : s))}</>;
}

export function Player({ episode }: { episode: Episode }) {
  const [prefs, setPrefs] = usePrefs();
  const [progress, markDone] = useProgress();
  const [part, setPart] = useState<Part>("scene");
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [voiceName, setVoiceName] = useState<string>("");
  const token = useRef(0);
  const audioEl = useRef<HTMLAudioElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const mp3 = part !== "flash" ? episode.audio?.[part] : undefined;
  const lines: Line[] = part === "flash" ? [] : episode[part];

  // Nom de la voix du téléphone utilisée
  useEffect(() => {
    if (!voiceAvailable()) return;
    const refresh = () => setVoiceName(pickVoice(prefs.gender).voice?.name.replace(/\s*\(.*\)/, "") ?? "");
    refresh();
    window.speechSynthesis.onvoiceschanged = refresh;
  }, [prefs.gender]);

  // Écran verrouillé / casque : titre et commandes
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: episode.title,
      artist: "Révizen",
      album: episode.ref,
      artwork: [{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }],
    });
  }, [episode]);

  const stopAll = useCallback(() => {
    token.current++;
    if (voiceAvailable()) window.speechSynthesis.cancel();
    audioEl.current?.pause();
    setPlaying(false);
  }, []);

  useEffect(() => () => { stopAll(); ambient?.stop(); }, [stopAll]);

  const nextPart = useCallback((from: Part) => {
    if (from === "scene") { setPart("cours"); setIdx(0); return true; }
    setPart("flash"); setIdx(0); setPlaying(false); return false;
  }, []);

  // Lecture ligne par ligne avec la voix du téléphone
  const speakFrom = useCallback((p: Part, i: number) => {
    if (p === "flash") return;
    const ls = episode[p];
    if (i >= ls.length) { if (nextPart(p)) speakFrom("cours", 0); return; }
    const my = ++token.current;
    setIdx(i);
    lineRefs.current[i]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    speakLine(ls[i].text, { ...prefs, speaker: ls[i].who },
      () => { if (my === token.current) speakFrom(p, i + 1); },
      () => { if (my === token.current) setPlaying(false); });
  }, [episode, prefs, nextPart]);

  const start = (from?: Part) => {
    let p = from ?? part;
    if (p === "flash") { p = "scene"; setPart("scene"); setIdx(0); }
    setPlaying(true);
    ambient?.setVolume(prefs.ambVolume);
    ambient?.play(prefs.ambiance);
    const file = episode.audio?.[p as "scene" | "cours"];
    if (file && audioEl.current) {
      audioEl.current.src = file;
      audioEl.current.playbackRate = prefs.speed;
      void audioEl.current.play();
    } else if (voiceAvailable()) {
      window.speechSynthesis.cancel();
      speakFrom(p, !from && part === p ? idx : 0);
    }
  };

  const toggle = () => { if (playing) { stopAll(); ambient?.stop(); } else start(); };
  // (pour la lecture MP3, `idx` n'est pas suivi ligne à ligne : pas de minutage par ligne)

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("play", () => start());
    navigator.mediaSession.setActionHandler("pause", () => { stopAll(); ambient?.stop(); });
  });

  const goPart = (p: Part) => { stopAll(); setPart(p); setIdx(0); };

  // Réglage modifié pendant la lecture : on reprend à la ligne en cours
  const change = (patch: Parameters<typeof setPrefs>[0]) => {
    setPrefs(patch);
    if (patch.ambVolume !== undefined) ambient?.setVolume(patch.ambVolume);
    if (patch.ambiance !== undefined && playing) ambient?.play(patch.ambiance);
    if ((patch.gender || patch.tone || patch.speed) && playing && !mp3) {
      token.current++;
      window.speechSynthesis.cancel();
      setTimeout(() => speakFrom(part, idx), 50);
    }
    if (patch.speed && audioEl.current) audioEl.current.playbackRate = patch.speed;
  };

  const done = progress[episode.id]?.done;
  const pct = (p: Part) => {
    const order: Part[] = ["scene", "cours", "flash"];
    if (done || order.indexOf(p) < order.indexOf(part)) return 100;
    if (p === part && p !== "flash" && lines.length) return Math.round((idx / lines.length) * 100);
    return 0;
  };

  return (
    <div className={styles.wrap}>
      <Link href={`/app?ue=${episode.ue}`} className={styles.back}>← Épisodes {episode.ue.toUpperCase()}</Link>

      <section className={styles.player} aria-label="Lecteur">
        <div className={styles.head}>
          <span className="label">{episode.ue.toUpperCase()} · {episode.minutes} min</span>
          <h1>{episode.title}</h1>
          <span className={styles.ref}>{episode.ref}</span>
        </div>

        <div className={styles.parts} role="tablist">
          {PARTS.map((p) => (
            <button key={p.id} role="tab" aria-selected={part === p.id} className={styles.part} onClick={() => goPart(p.id)}>
              <b>{p.label}</b><i>{p.hint}</i>
              <span className={styles.bar}><span style={{ width: `${pct(p.id)}%` }} /></span>
            </button>
          ))}
        </div>

        <div className={styles.controls}>
          <button className={styles.play} onClick={toggle} aria-label={playing ? "Pause" : "Lecture"}>
            <svg viewBox="0 0 24 24">{playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4.5v15l13-7.5z" />}</svg>
          </button>
          <button className={styles.ghost} onClick={() => { stopAll(); setPart("scene"); setIdx(0); }}>↺ Reprendre au début</button>
        </div>

        <div className={styles.settings}>
          <Seg label="Voix" value={prefs.gender} onChange={(v) => change({ gender: v as "f" | "m" })}
            options={[["f", "Femme"], ["m", "Homme"]]} />
          <Seg label="Ton" value={prefs.tone} onChange={(v) => change({ tone: v as "calm" | "lively" })}
            options={[["calm", "Apaisant"], ["lively", "Dynamique"]]} />
          <Seg label="Vitesse" value={String(prefs.speed)} onChange={(v) => change({ speed: Number(v) })}
            options={[["0.9", "×0,9"], ["1", "×1"], ["1.25", "×1,25"]]} />
          <Seg label="Ambiance" value={prefs.ambiance} onChange={(v) => change({ ambiance: v as typeof prefs.ambiance })}
            options={AMBIANCES.map((a) => [a.id, a.label])} />
          <div className={styles.row}>
            <label className="label" htmlFor="ambVol">Volume du fond</label>
            <input id="ambVol" type="range" min={0} max={100} value={Math.round(prefs.ambVolume * 100)}
              onChange={(e) => change({ ambVolume: Number(e.target.value) / 100 })} />
          </div>
        </div>
        <p className={styles.notice}>
          {mp3 ? "Voix studio." : voiceAvailable()
            ? `Voix du téléphone${voiceName ? ` : ${voiceName}` : ""}. La voix studio arrive avec les épisodes finaux.`
            : "Lecture audio indisponible sur ce navigateur. Le texte reste lisible ci-dessous."}
        </p>
        <audio ref={audioEl} preload="none" onEnded={() => { if (nextPart(part)) start("cours"); }} />
      </section>

      <section className={styles.panel} aria-live="polite">
        <span className="label">{part === "flash" ? "Flash · 3 questions" : `Transcription · ${part === "scene" ? "Scène" : "Cours"}`}</span>
        {part === "flash" ? (
          <Quiz key={episode.id} questions={episode.flash} onFinish={(s) => markDone(episode.id, s)} />
        ) : (
          <div className={styles.lines}>
            {lines.map((l, i) => (
              <p key={i} ref={(el) => { lineRefs.current[i] = el; }}
                className={[styles.line, styles[l.who], l.key ? styles.key : "", playing && i === idx && !mp3 ? styles.now : ""].join(" ")}>
                {WHO[l.who] && <span className={styles.who}>{WHO[l.who]}</span>}
                <Rich text={l.text} />
              </p>
            ))}
          </div>
        )}
      </section>

      <p className={styles.foot}>
        {episode.reviewedBy ? `Relu par ${episode.reviewedBy}.` : "Contenu en cours de relecture."} {episode.source}
      </p>
    </div>
  );
}

function Seg({ label, value, options, onChange }: { label: string; value: string; options: string[][]; onChange: (v: string) => void }) {
  return (
    <div className={styles.row}>
      <span className="label">{label}</span>
      <div className={styles.seg} role="group" aria-label={label}>
        {options.map(([v, l]) => (
          <button key={v} aria-pressed={value === v} onClick={() => onChange(v)}>{l}</button>
        ))}
      </div>
    </div>
  );
}
