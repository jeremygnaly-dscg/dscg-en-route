"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ACTUS } from "@/content/actus";
import { EPISODES, findEpisode, libelleUe, uesDe } from "@/content/episodes";
import type { Episode } from "@/content/types";
import { useDiplome } from "@/lib/diplome";
import { useProgress } from "@/lib/prefs";
import styles from "./feed.module.css";

// Fil d'actualité vivant : articles collectés automatiquement (public/actus.json, 3 fois par jour)
// + décryptages Zenvise rédigés à la main, entrecoupés de cartes à jouer (quiz flash, épisode du jour).

type Cat = "Fiscalité" | "Social" | "Comptabilité & audit" | "Finance" | "Économie" | "Profession" | "Numérique" | "Droit des affaires";
const CATS: Cat[] = ["Fiscalité", "Comptabilité & audit", "Droit des affaires", "Social", "Finance", "Économie", "Profession", "Numérique"];
const TEINTE: Record<Cat, string> = {
  "Fiscalité": "#c2410c", "Comptabilité & audit": "#3340c7", "Droit des affaires": "#7c3aed", "Social": "#0f766e",
  "Finance": "#0369a1", "Économie": "#9a6516", "Profession": "#be185d", "Numérique": "#4d7c0f",
};
const ANCIENNES: Record<string, Cat> = { Profession: "Profession", Fiscalité: "Fiscalité", Social: "Social", Entreprises: "Droit des affaires", Numérique: "Numérique" };

interface Carte {
  kind: "decryptage" | "actu";
  id: string; date: string; titre: string; source: string; url?: string; image?: string; officiel?: boolean;
  categorie: Cat; resume?: string; question?: string; diplomes?: ("DCG" | "DSCG")[]; ues?: string[]; episodeId?: string;
  notions?: { label: string; ue: string; episodeId?: string }[]; projet?: boolean; exemple?: boolean;
}
interface Fichier { majLe?: string; images?: Record<string, string>; items?: Omit<Carte, "kind">[] }

const ilYa = (iso: string, maintenant: number) => {
  const t = new Date(iso.length === 10 ? `${iso}T08:00:00` : iso).getTime();
  const min = Math.max(0, Math.round((maintenant - t) / 60000));
  if (min < 2) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const j = Math.round(h / 24);
  if (j === 1) return "hier";
  if (j < 7) return `il y a ${j} jours`;
  return new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};
const lire = <T,>(cle: string, def: T): T => { try { const v = localStorage.getItem(cle); return v ? (JSON.parse(v) as T) : def; } catch { return def; } };
const ecrire = (cle: string, v: unknown) => { try { localStorage.setItem(cle, JSON.stringify(v)); } catch { /* stockage indisponible */ } };
const jourDuJour = () => { const d = new Date(); return d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate(); };

export function Feed() {
  const [diplome] = useDiplome();
  const [progress] = useProgress();
  const [fichier, setFichier] = useState<Fichier>({});
  const [filtre, setFiltre] = useState<string>("tout");
  const [saved, setSaved] = useState<string[]>([]);
  const [nb, setNb] = useState(14);
  const [derniereVisite, setDerniereVisite] = useState(0);
  const [maintenant, setMaintenant] = useState(() => Date.now());

  useEffect(() => {
    setSaved(lire("revizen-saved", []));
    setDerniereVisite(lire("zenvise-fil-vu", 0));
    const t = setTimeout(() => ecrire("zenvise-fil-vu", Date.now()), 4000);
    const horloge = setInterval(() => setMaintenant(Date.now()), 60000);
    fetch("/actus.json", { cache: "no-store" }).then((r) => (r.ok ? r.json() : {})).then(setFichier).catch(() => {});
    return () => { clearTimeout(t); clearInterval(horloge); };
  }, []);

  const toggleSave = (id: string) => setSaved((s) => { const n = s.includes(id) ? s.filter((x) => x !== id) : [...s, id]; ecrire("revizen-saved", n); return n; });
  const partager = async (c: Carte) => {
    const url = c.url ?? window.location.href;
    try { if (navigator.share) await navigator.share({ title: c.titre, url }); else await navigator.clipboard.writeText(url); } catch { /* annulé */ }
  };

  const cartes = useMemo<Carte[]>(() => {
    const deco: Carte[] = ACTUS.map((a) => ({
      kind: "decryptage", id: a.id, date: a.date, titre: a.titre, source: a.source, url: a.sourceUrl, image: fichier.images?.[a.id],
      categorie: ANCIENNES[a.categorie] ?? "Profession", resume: a.resume, question: a.question, notions: a.notions,
      diplomes: ["DSCG"], projet: a.projet, exemple: a.exemple,
    }));
    const auto: Carte[] = (fichier.items ?? []).map((x) => ({ ...x, kind: "actu" as const, categorie: (CATS.includes(x.categorie) ? x.categorie : "Économie") }));
    return [...auto, ...deco].sort((a, b) => b.date.localeCompare(a.date));
  }, [fichier]);

  const DIP = diplome.toUpperCase() as "DCG" | "DSCG";
  const visibles = cartes.filter((c) =>
    filtre === "tout" ? true
    : filtre === "moi" ? !c.diplomes?.length || c.diplomes.includes(DIP)
    : filtre === "decryptages" ? c.kind === "decryptage" || !!c.question
    : filtre === "enregistres" ? saved.includes(c.id)
    : c.categorie === filtre);
  const [une, ...reste] = visibles;
  const nouveaux = cartes.filter((c) => derniereVisite && new Date(c.date).getTime() > derniereVisite).length;

  // Cartes à jouer, tirées du programme du diplôme choisi (changent chaque jour)
  const uesDip = uesDe(diplome).map((u) => u.id as string);
  const jouables = EPISODES.filter((e) => e.status === "live" && [e.ue, ...(e.aussi ?? [])].some((u) => uesDip.includes(u)));
  const graine = jourDuJour();
  const quizEp = jouables.length ? jouables[graine % jouables.length] : undefined;
  const aEcouter = jouables.filter((e) => !progress[e.id]?.done);
  const epJour = aEcouter.length ? aEcouter[(graine * 7) % aEcouter.length] : jouables[(graine * 7) % Math.max(1, jouables.length)];

  return (
    <div className={styles.wrap}>
      <header className={styles.top}>
        <span className={styles.logo}>Zen<span>vise</span></span>
        <span className={styles.live}><i aria-hidden="true" />En direct{fichier.majLe ? ` · ${ilYa(fichier.majLe, maintenant)}` : ""}</span>
      </header>

      <div className={styles.stories} aria-label="Unités d'enseignement">
        {uesDe(diplome).map((u) => {
          const live = EPISODES.some((e) => (e.ue === u.id || e.aussi?.includes(u.id)) && e.status === "live");
          return (
            <Link key={u.id} href={`/app?ue=${u.id}`} className={styles.story} aria-disabled={!live}>
              <span className={live ? styles.ring : `${styles.ring} ${styles.ringOff}`}><span>{u.short}</span></span>
              <small>{u.name.split(" ")[0]}</small>
            </Link>
          );
        })}
      </div>

      <div className={styles.filtres} role="tablist" aria-label="Filtrer le fil">
        {[["tout", "Tout"], ["moi", `Mon ${DIP}`], ["decryptages", "Questions d'examen"], ...CATS.map((c) => [c, c]), ["enregistres", "Enregistrés"]].map(([v, l]) => (
          <button key={v} role="tab" aria-selected={filtre === v} onClick={() => { setFiltre(v); setNb(14); }}>{l}</button>
        ))}
      </div>

      {nouveaux > 0 && filtre === "tout" && <p className={styles.nouveaux}>{nouveaux} nouvel{nouveaux > 1 ? "les" : "le"} actu{nouveaux > 1 ? "s" : ""} depuis ta dernière visite</p>}

      {!une && <p className={styles.vide}>{filtre === "enregistres" ? "Rien d'enregistré pour l'instant. Touche « Enregistrer » sous une actu pour la retrouver ici." : "Pas d'actu dans cette rubrique pour le moment."}</p>}

      {une && <ALaUne c={une} maintenant={maintenant} neuf={!!derniereVisite && new Date(une.date).getTime() > derniereVisite} />}

      {reste.slice(0, nb).map((c, i) => (
        <div key={c.id} className={styles.bloc}>
          <Article c={c} maintenant={maintenant} saved={saved.includes(c.id)} onSave={() => toggleSave(c.id)} onShare={() => partager(c)}
            neuf={!!derniereVisite && new Date(c.date).getTime() > derniereVisite} />
          {i === 1 && quizEp && <QuizFlash ep={quizEp} graine={graine} />}
          {i === 5 && epJour && <EpisodeDuJour ep={epJour} />}
        </div>
      ))}

      {reste.length > nb && <button className={styles.plus} onClick={() => setNb((n) => n + 14)}>Voir plus d&apos;actus</button>}
      {visibles.length > 0 && <p className={styles.mention}>Actus résumées par Zenvise à partir des sources citées. Images et articles appartiennent à leurs éditeurs.</p>}
    </div>
  );
}

function Couverture({ c, grande }: { c: Carte; grande?: boolean }) {
  const [ko, setKo] = useState(false);
  const teinte = TEINTE[c.categorie];
  return (
    <div className={grande ? `${styles.cover} ${styles.coverUne}` : styles.cover} style={{ ["--teinte" as string]: teinte }}>
      {c.image && !ko
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={c.image} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setKo(true)} />
        : <span className={styles.motif} aria-hidden="true">{c.categorie}</span>}
      <span className={styles.cat}>{c.categorie}</span>
    </div>
  );
}

function ALaUne({ c, maintenant, neuf }: { c: Carte; maintenant: number; neuf: boolean }) {
  const contenu = (
    <>
      <Couverture c={c} grande />
      <div className={styles.uneTexte}>
        <span className="label">À la une{neuf ? " · nouveau" : ""}</span>
        <h2>{c.titre}</h2>
        {c.resume && <p>{c.resume}</p>}
        <span className={styles.meta}>{c.source} · {ilYa(c.date, maintenant)}</span>
      </div>
    </>
  );
  return c.url
    ? <a href={c.url} target="_blank" rel="noreferrer" className={styles.une}>{contenu}</a>
    : <article className={styles.une}>{contenu}</article>;
}

function Article({ c, maintenant, saved, onSave, onShare, neuf }: { c: Carte; maintenant: number; saved: boolean; onSave: () => void; onShare: () => void; neuf: boolean }) {
  const ep = c.episodeId ? findEpisode(c.episodeId) : undefined;
  return (
    <article className={styles.post}>
      {c.url ? <a href={c.url} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true"><Couverture c={c} /></a> : <Couverture c={c} />}
      <div className={styles.corps}>
        <div className={styles.postHead}>
          <span className={styles.meta}>
            {c.kind === "decryptage" && <b className={styles.zv}>Décryptage Zenvise</b>}
            {c.officiel && <b className={styles.off}>Source officielle</b>}
            {c.source} · {ilYa(c.date, maintenant)}
          </span>
          {neuf && <span className={styles.neuf}>Nouveau</span>}
          {c.projet && <span className={styles.badge}>Projet non voté</span>}
          {c.exemple && <span className={styles.badge}>Exemple</span>}
        </div>
        <h3>{c.url ? <a href={c.url} target="_blank" rel="noreferrer">{c.titre}</a> : c.titre}</h3>
        {c.resume && <p className={styles.resume}>{c.resume}</p>}

        {c.question && (
          <div className={styles.exam}>
            <span className="label">La question d&apos;examen</span>
            <p>{c.question}</p>
          </div>
        )}

        {(c.notions?.length || c.ues?.length || ep) ? (
          <div className={styles.chips}>
            {ep && ep.status === "live" && <Link href={`/episode/${ep.id}`} className={`${styles.chip} ${styles.chipLive}`}><i>{libelleUe(ep.ue)}</i>Écouter l&apos;épisode<span aria-hidden="true">▸</span></Link>}
            {c.ues?.map((u) => <span key={u} className={styles.chip}><i>{u}</i></span>)}
            {c.notions?.map((n) => n.episodeId && findEpisode(n.episodeId)?.status === "live"
              ? <Link key={n.label} href={`/episode/${n.episodeId}`} className={`${styles.chip} ${styles.chipLive}`}><i>{n.ue}</i>{n.label}<span aria-hidden="true">▸</span></Link>
              : <span key={n.label} className={styles.chip}><i>{n.ue}</i>{n.label}</span>)}
          </div>
        ) : null}

        <div className={styles.actions}>
          <button onClick={onSave} aria-pressed={saved} className={styles.act}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" /></svg>{saved ? "Enregistré" : "Enregistrer"}
          </button>
          <button onClick={onShare} className={styles.act}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6" /></svg>Partager
          </button>
          {c.url && <a href={c.url} target="_blank" rel="noreferrer" className={styles.src}>Lire</a>}
        </div>
      </div>
    </article>
  );
}

function QuizFlash({ ep, graine }: { ep: Episode; graine: number }) {
  const q = ep.flash[graine % ep.flash.length];
  const [choix, setChoix] = useState<number | null>(null);
  if (!q) return null;
  return (
    <section className={styles.jeu} aria-label="Quiz flash">
      <span className="label">Quiz flash · {libelleUe(ep.ue)}</span>
      <h3>{q.q}</h3>
      <div className={styles.reponses}>
        {q.choices.map((c, i) => (
          <button key={i} disabled={choix !== null}
            className={choix === null ? "" : i === q.answer ? styles.bon : i === choix ? styles.faux : ""}
            onClick={() => setChoix(i)}>{c}</button>
        ))}
      </div>
      {choix !== null && (
        <p className={styles.pourquoi}>
          <b>{choix === q.answer ? "Bien vu. " : "Pas tout à fait. "}</b>{q.why}{" "}
          <Link href={`/episode/${ep.id}`}>Écouter l&apos;épisode ▸</Link>
        </p>
      )}
    </section>
  );
}

function EpisodeDuJour({ ep }: { ep: Episode }) {
  return (
    <Link href={`/episode/${ep.id}`} className={styles.jour}>
      <span className={styles.play} aria-hidden="true">▶</span>
      <span>
        <span className="label">L&apos;épisode du jour · {libelleUe(ep.ue)} · {ep.minutes} min</span>
        <b>{ep.title}</b>
        <small>{ep.ref}</small>
      </span>
    </Link>
  );
}
