"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Episode } from "@/content/types";
import { EPISODES } from "@/content/episodes";
import { ambient, AMBIANCES } from "@/lib/ambient";
import { usePrefs, useProgress, useQuizAttente, type Progress } from "@/lib/prefs";
import { Quiz } from "./Quiz";
import { FicheRevision } from "./Fiche";
import { Signaler } from "./Signaler";
import { aAcces, useAbonnements } from "@/lib/vente";
import styles from "./player.module.css";

// Déroulé d'un épisode : on écoute (scène puis cours), on se teste, on relit la fiche.
type Part = "scene" | "cours" | "flash" | "fiche";
type AudioPart = "scene" | "cours";
const isAudio = (p: Part): p is AudioPart => p === "scene" || p === "cours";

const PARTS: { id: Part; label: string; hint: string }[] = [
  { id: "scene", label: "Scène", hint: "Le cas" },
  { id: "cours", label: "Cours", hint: "La règle" },
  { id: "flash", label: "Quiz", hint: "3 questions" },
  { id: "fiche", label: "Fiche", hint: "À relire" },
];
const WHO: Record<string, string> = { dirigeant: "Dirigeant·e", expert: "Expert-comptable" };

function Rich({ text }: { text: string }) {
  return <>{text.split(/(`[^`]+`)/).map((s, i) => (s.startsWith("`") ? <code key={i}>{s.slice(1, -1)}</code> : s))}</>;
}

// Épisode suivant de la même UE : d'abord ceux pas encore écoutés
function suivant(e: Episode, progress: Progress, ouvert: (x: Episode) => boolean = () => true): Episode | null {
  const all = EPISODES.filter((x) => x.ue === e.ue && x.status === "live" && (x.id === e.id || ouvert(x)));
  const i = all.findIndex((x) => x.id === e.id);
  const ordre = [...all.slice(i + 1), ...all.slice(0, Math.max(i, 0))];
  return ordre.find((x) => !progress[x.id]?.done) ?? ordre[0] ?? null;
}

export function Player({ episode }: { episode: Episode }) {
  const [prefs, setPrefs] = usePrefs();
  const [progress, markDone] = useProgress();
  const [, addAttente, removeAttente] = useQuizAttente();
  const [ep, setEp] = useState(episode);
  const { abos } = useAbonnements();
  const ouvert = (x: Episode) => aAcces(x, abos);
  const [part, setPart] = useState<Part>("scene");
  const [playing, setPlaying] = useState(false);
  const [ratio, setRatio] = useState(0); // avancement de la piste en cours
  const [fini, setFini] = useState(false); // écoute terminée
  const [quizFini, setQuizFini] = useState(false);
  const audioEl = useRef<HTMLAudioElement>(null);

  // Lien direct vers le quiz (quiz en attente) : /episode/<id>?p=flash
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("p");
    if (p === "flash" || p === "fiche") setPart(p);
  }, []);

  // Écran verrouillé / casque : titre de l'épisode
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: ep.title, artist: "Révizen", album: ep.ref,
      artwork: [{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }],
    });
  }, [ep]);

  useEffect(() => () => { audioEl.current?.pause(); ambient?.stop(); }, []);

  const lancer = (p: AudioPart, e: Episode = ep) => {
    const a = audioEl.current, file = e.audio?.[p];
    if (!a || !file) return;
    if (!a.src.endsWith(file)) { a.src = file; setRatio(0); }
    a.playbackRate = prefs.speed;
    void a.play();
    setPlaying(true);
    if (!playing) { ambient?.setVolume(prefs.ambVolume); ambient?.play(prefs.ambiance); }
  };

  const pause = () => { audioEl.current?.pause(); setPlaying(false); ambient?.stop(); };

  const play = () => {
    setFini(false);
    if (isAudio(part)) return lancer(part);
    setPart("scene"); lancer("scene");
  };

  // Passe à un autre épisode sans changer de page : la lecture continue même écran verrouillé
  const allerA = (e: Episode, autoplay: boolean) => {
    setEp(e); setPart("scene"); setFini(false); setQuizFini(false); setRatio(0);
    history.replaceState(null, "", `/episode/${e.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (autoplay) lancer("scene", e);
    else { audioEl.current?.pause(); setPlaying(false); ambient?.stop(); }
  };

  const onEnded = () => {
    if (part === "scene") { setPart("cours"); lancer("cours"); return; }
    if (part !== "cours") return;
    // Fin du cours
    addAttente(ep.id);
    const next = suivant(ep, progress, ouvert);
    if (prefs.apres === "suite" && next) { allerA(next, true); return; }
    setPlaying(false);
    ambient?.fadeOut(4);
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "none";
    setFini(true);
    setPart("flash");
  };

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    const next = suivant(ep, progress, ouvert);
    navigator.mediaSession.setActionHandler("nexttrack", next ? () => allerA(next, true) : null);
  });

  const goPart = (p: Part) => {
    if (playing && isAudio(p) && p !== part) { setPart(p); lancer(p); return; }
    if (playing && !isAudio(p)) pause();
    setPart(p);
  };

  const change = (patch: Parameters<typeof setPrefs>[0]) => {
    setPrefs(patch);
    if (patch.ambVolume !== undefined) ambient?.setVolume(patch.ambVolume);
    if (patch.ambiance !== undefined && playing) ambient?.play(patch.ambiance);
    if (patch.speed && audioEl.current) audioEl.current.playbackRate = patch.speed;
  };

  const finirQuiz = (score: number) => { markDone(ep.id, score); removeAttente(ep.id); setQuizFini(true); };

  const done = progress[ep.id]?.done;
  const order = PARTS.map((x) => x.id);
  const pct = (p: Part) => {
    if (p === part) return isAudio(p) ? Math.round(ratio * 100) : quizFini || (p === "fiche") ? 100 : 0;
    if (order.indexOf(p) < order.indexOf(part)) return 100;
    return done && p !== "fiche" ? 100 : 0;
  };
  const next = suivant(ep, progress, ouvert);

  if (!ouvert(ep)) {
    return (
      <div className={styles.wrap}>
        <Link href={`/app?ue=${ep.ue}`} className={styles.back}>← Épisodes {ep.ue.toUpperCase()}</Link>
        <section className={styles.player}>
          <div className={styles.head}>
            <span className="label">{ep.ue.toUpperCase()} · {ep.minutes} min d&apos;écoute</span>
            <h1>{ep.title}</h1>
            <span className={styles.ref}>{ep.ref}</span>
          </div>
          <div className={styles.fin}>
            <b>🔒 Épisode réservé aux abonnés</b>
            <span>Cet épisode, son quiz et sa fiche font partie de l&apos;abonnement Révizen à 9,99 €/mois, toutes UE comprises. Le premier épisode de chaque UE reste gratuit.</span>
          </div>
          <div className={styles.actions}>
            <Link href={`/app/abonnement?ue=${ep.ue}`} className={styles.primary}>Voir les abonnements</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <Link href={`/app?ue=${ep.ue}`} className={styles.back} data-noprint>← Épisodes {ep.ue.toUpperCase()}</Link>

      <section className={styles.player} aria-label="Lecteur" data-noprint>
        <div className={styles.head}>
          <span className="label">{ep.ue.toUpperCase()} · {ep.minutes} min d&apos;écoute · {ep.format === "comptable" ? "comptabilité" : ep.format === "technique" ? "technique" : "juridique"}</span>
          <h1>{ep.title}</h1>
          <span className={styles.ref}>{ep.ref}</span>
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
          <button className={styles.play} onClick={playing ? pause : play} aria-label={playing ? "Pause" : "Lecture"}>
            <svg viewBox="0 0 24 24">{playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4.5v15l13-7.5z" />}</svg>
          </button>
          <button className={styles.ghost} onClick={() => { if (audioEl.current) audioEl.current.currentTime = 0; setPart("scene"); if (playing) lancer("scene"); }}>↺ Reprendre au début</button>
          {next && <button className={styles.ghost} onClick={() => allerA(next, playing)}>Épisode suivant ›</button>}
        </div>

        <div className={styles.settings}>
          <Seg label="Après" value={prefs.apres} onChange={(v) => change({ apres: v as "quiz" | "suite" })}
            options={[["quiz", "Quiz et fiche"], ["suite", "Enchaîner"]]} />
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
          {prefs.apres === "suite" ? "En voiture ou dans les transports : les épisodes s'enchaînent, les quiz t'attendent dans Réviser." : ""}
        </p>
        <audio ref={audioEl} preload="none" onEnded={onEnded}
          onTimeUpdate={(e) => { const a = e.currentTarget; if (a.duration) setRatio(a.currentTime / a.duration); }} />
      </section>

      <section className={styles.panel} aria-live="polite">
        {part === "flash" ? (
          <>
            {fini && (
              <div className={styles.fin}>
                <b>Écoute terminée</b>
                <span>Trois questions pour ancrer la notion, puis ta fiche de révision.</span>
              </div>
            )}
            <span className="label">Quiz · 3 questions</span>
            <Quiz key={ep.id} questions={ep.flash} onFinish={finirQuiz} />
            <div className={styles.actions}>
              <button className={quizFini ? styles.primary : styles.ghost} onClick={() => goPart("fiche")}>Voir la fiche de révision →</button>
            </div>
          </>
        ) : part === "fiche" ? (
          <>
            <FicheRevision episode={ep} />
            <div className={styles.actions} data-noprint>
              <button className={styles.ghost} onClick={() => window.print()}>Imprimer ou enregistrer en PDF</button>
              {next && <button className={styles.primary} onClick={() => allerA(next, true)}>Épisode suivant : {next.title} ›</button>}
            </div>
          </>
        ) : (
          <>
            <span className="label">Transcription · {part === "scene" ? "Scène" : "Cours"}</span>
            <div className={styles.lines}>
              {ep[part].map((l, i) => (
                <p key={i} className={[styles.line, styles[l.who], l.key ? styles.key : ""].join(" ")}>
                  {WHO[l.who] && <span className={styles.who}>{WHO[l.who]}</span>}
                  <Rich text={l.text} />
                </p>
              ))}
            </div>
          </>
        )}
      </section>

      <Signaler key={ep.id} episodeId={ep.id} partie={part} />
      <p className={styles.foot} data-noprint>
        {ep.reviewedBy ? `Relu par ${ep.reviewedBy}.` : "Contenu en cours de relecture."} {ep.source}
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
