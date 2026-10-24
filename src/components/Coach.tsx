"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EPISODES, UES, findEpisode, libelleUe, uesDe } from "@/content/episodes";
import { useDiplome } from "@/lib/diplome";
import type { UeId } from "@/content/types";
import { todayIso, useProgress } from "@/lib/prefs";
import { aDeQuoiFaireUnBilan, contexteBilan, useBilan } from "@/lib/bilan";
import {
  CONTEXTES, JOURS, buildPlan, calendrierIcs, couverture, daysBetween, messageCoach, minutesParSemaine,
  type CoachConfig, type Contexte, type Creneau, type Epreuve,
} from "@/lib/coach";
import { EncartRappels } from "./Methode";
import styles from "./coach.module.css";

const KEY = "revizen-coach";
const load = (): CoachConfig | null => { try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch { return null; } };
const save = (c: CoachConfig | null) => {
  try { if (c) localStorage.setItem(KEY, JSON.stringify(c)); else localStorage.removeItem(KEY); } catch { /* stockage indisponible */ }
  void import("@/lib/compte").then((m) => m.pousser()); // sauvegarde dans le compte
};

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const JOURS_LONG = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const dateFr = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return `${d} ${MOIS[m - 1]} ${y}`; };
const jourFr = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); const w = (new Date(y, m - 1, d).getDay() + 6) % 7; return `${JOURS_LONG[w]} ${d} ${MOIS[m - 1]}`; };
const uid = () => Math.random().toString(36).slice(2, 9);

const PRESETS: (Omit<Creneau, "id"> & { nom: string })[] = [
  { nom: "Trajet du matin", jours: [0, 1, 2, 3, 4], heure: "07:45", minutes: 30, contexte: "transport" },
  { nom: "Trajet du soir", jours: [0, 1, 2, 3, 4], heure: "18:30", minutes: 30, contexte: "transport" },
  { nom: "En cuisinant", jours: [0, 1, 2, 3, 4, 5, 6], heure: "19:30", minutes: 15, contexte: "cuisine" },
  { nom: "Pause déjeuner", jours: [0, 1, 2, 3, 4], heure: "12:30", minutes: 15, contexte: "pause" },
  { nom: "Sport du week-end", jours: [5, 6], heure: "10:00", minutes: 40, contexte: "sport" },
];

export function Coach() {
  const [config, setConfig] = useState<CoachConfig | null>(null);
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress] = useProgress();
  const today = todayIso();

  useEffect(() => { const c = load(); setConfig(c); setEditing(!c); setReady(true); }, []);

  if (!ready) return null;
  if (editing || !config) {
    return <Setup initial={config} onCancel={config ? () => setEditing(false) : undefined}
      onSave={(c) => { save(c); setConfig(c); setEditing(false); window.scrollTo({ top: 0 }); }} />;
  }
  return <Dashboard config={config} progress={progress} today={today} onEdit={() => setEditing(true)} />;
}

/* ───────────────────────── Tableau de bord ───────────────────────── */

function Dashboard({ config, progress, today, onEdit }: {
  config: CoachConfig; progress: ReturnType<typeof useProgress>[0]; today: string; onEdit: () => void;
}) {
  const plan = useMemo(() => buildPlan(config, EPISODES, progress, today), [config, progress, today]);
  const cov = useMemo(() => couverture(plan, config, EPISODES, progress), [plan, config, progress]);
  const aujourdhui = plan.filter((s) => s.date === today);
  const prochaines = plan.filter((s) => s.date > today).slice(0, 6);
  const epreuves = [...config.epreuves].sort((a, b) => a.date.localeCompare(b.date));
  const minSem = minutesParSemaine(config);

  const exporter = () => {
    const ics = calendrierIcs(config, window.location.origin, today);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "revizen-rappels.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <span className="label">Ton coach</span>
        <h1>{config.prenom ? `Salut ${config.prenom}` : "Ton programme"}</h1>
        <p className={styles.bubble}>{messageCoach(config, progress, today)}</p>
      </header>

      <EncartRappels />

      <BilanSemaine config={config} progress={progress} today={today} />

      <div className={styles.countdowns}>
        {epreuves.map((e) => {
          const j = daysBetween(today, e.date);
          return (
            <div key={e.ue} className={`${styles.count} ${j <= 21 && j >= 0 ? styles.hot : ""}`}>
              <span>{libelleUe(e.ue)}</span>
              <b>{j >= 0 ? `J-${j}` : "Passée"}</b>
              <small>{dateFr(e.date)}</small>
            </div>
          );
        })}
      </div>

      <section className={styles.block}>
        <div className={styles.blockHead}>
          <h2>Aujourd&apos;hui</h2>
          <span className={styles.meta}>{minSem} min par semaine</span>
        </div>
        {aujourdhui.length === 0 ? (
          <p className={styles.empty}>Pas de créneau prévu aujourd&apos;hui. Si tu as cinq minutes, un quiz de révision fait toujours du bien.</p>
        ) : aujourdhui.map((s, i) => <SeanceCard key={i} s={s} progress={progress} />)}
      </section>

      <section className={styles.block}>
        <h2>Prochaines séances</h2>
        {prochaines.length === 0
          ? <p className={styles.empty}>Tout le contenu disponible est planifié. Les nouveaux épisodes s&apos;ajouteront ici dès leur sortie.</p>
          : prochaines.map((s, i) => <SeanceCard key={i} s={s} progress={progress} compact />)}
      </section>

      <section className={styles.block}>
        <h2>Où tu en seras le jour J</h2>
        {cov.map((c) => {
          const pct = c.disponibles ? Math.round(((c.deja + c.prevus) / c.disponibles) * 100) : 0;
          return (
            <div key={c.ue} className={styles.cov}>
              <div className={styles.covHead}><b>{libelleUe(c.ue)}</b><span>{c.deja + c.prevus}/{c.disponibles} épisodes disponibles</span></div>
              <div className={styles.bar}><span style={{ width: `${Math.min(100, pct)}%` }} /></div>
            </div>
          );
        })}
        <p className={styles.meta}>Chaque épisode revient ensuite en révision à J+1, J+7 et J+21, puis tous les mois. Dans les 3 dernières semaines avant une épreuve, place aux révisions.</p>
      </section>

      <section className={styles.block}>
        <h2>Rappels</h2>
        <p>Ajoute tes créneaux à l&apos;agenda de ton téléphone : il te préviendra à chaque séance, même appli fermée.</p>
        <button className={styles.primary} onClick={exporter}>Ajouter les rappels à mon agenda</button>
        <p className={styles.meta}>Sur iPhone, ouvre le fichier puis touche « Tout ajouter ». Sur Android, ouvre-le avec Google Agenda.</p>
      </section>

      <button className={styles.ghost} onClick={onEdit}>Modifier mes épreuves et mes créneaux</button>
    </div>
  );
}

function BilanSemaine({ config, progress, today }: { config: CoachConfig; progress: ReturnType<typeof useProgress>[0]; today: string }) {
  const { etat, demander } = useBilan(today);
  const contexte = useMemo(() => contexteBilan(config, progress, EPISODES, today), [config, progress, today]);
  if (etat.etat === "chargement") return null;
  return (
    <section className={`${styles.block} ${styles.bilan}`}>
      <div className={styles.blockHead}>
        <h2>Ton bilan de la semaine</h2>
        <span className={styles.meta}>{contexte.plan.joursActifs} jour{contexte.plan.joursActifs > 1 ? "s" : ""} actif{contexte.plan.joursActifs > 1 ? "s" : ""} sur 7</span>
      </div>
      {etat.etat === "pret" ? (
        <div className={styles.bilanTexte}>
          {etat.bilan.texte.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          <p className={styles.meta}>Rédigé par l&apos;IA à partir de tes quiz et de ton programme. Prochain bilan lundi.</p>
        </div>
      ) : etat.etat === "envoi" ? (
        <p className={styles.empty}>Ton coach relit ta semaine…</p>
      ) : (
        <>
          <p>Un retour personnalisé sur tes quiz et sur le respect de ton programme, avec les notions à retravailler. Un bilan par semaine.</p>
          {etat.etat === "erreur" && <p className={styles.meta}>{etat.message}</p>}
          <button className={styles.primary} disabled={!aDeQuoiFaireUnBilan(contexte)} onClick={() => demander(contexte)}>
            {aDeQuoiFaireUnBilan(contexte) ? "Recevoir mon bilan" : "Écoute un épisode pour débloquer ton bilan"}
          </button>
        </>
      )}
    </section>
  );
}

function SeanceCard({ s, progress, compact }: { s: ReturnType<typeof buildPlan>[number]; progress: ReturnType<typeof useProgress>[0]; compact?: boolean }) {
  const ctx = CONTEXTES.find((c) => c.id === s.creneau.contexte)!;
  const total = s.items.reduce((n, i) => n + i.minutes, 0);
  return (
    <div className={styles.seance}>
      <div className={styles.seanceHead}>
        <span className={styles.emoji} aria-hidden="true">{ctx.emoji}</span>
        <div>
          <b>{compact ? `${jourFr(s.date)} · ` : ""}{s.creneau.heure}</b>
          <span>{ctx.label} · {total} min{s.phase === "sprint" ? " · sprint final" : ""}</span>
        </div>
      </div>
      {!compact && (
        <ul className={styles.items}>
          {s.items.map((it, k) => {
            const ep = findEpisode(it.episodeId);
            const fait = it.type === "nouveau" ? progress[it.episodeId]?.done : false;
            return (
              <li key={k}>
                <Link href={`/episode/${it.episodeId}`} className={styles.item}>
                  <i className={it.type === "nouveau" ? styles.tagNew : styles.tagRev}>{it.type === "nouveau" ? "Nouveau" : "Révision"}</i>
                  <span>{ep?.title}</span>
                  <small>{libelleUe(it.ue)} · {it.minutes} min{fait ? " · fait" : ""}</small>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {compact && <p className={styles.meta}>{s.items.filter((i) => i.type === "nouveau").length} nouveau(x) · {s.items.filter((i) => i.type === "revision").length} révision(s)</p>}
    </div>
  );
}

/* ───────────────────────── Questionnaire ───────────────────────── */

function Setup({ initial, onSave, onCancel }: { initial: CoachConfig | null; onSave: (c: CoachConfig) => void; onCancel?: () => void }) {
  const [etape, setEtape] = useState(0);
  const [prenom, setPrenom] = useState(initial?.prenom ?? "");
  const [epreuves, setEpreuves] = useState<Epreuve[]>(initial?.epreuves ?? []);
  const [diplome] = useDiplome();
  const [creneaux, setCreneaux] = useState<Creneau[]>(initial?.creneaux ?? []);

  const toggleUe = (ue: UeId) =>
    setEpreuves((es) => (es.some((e) => e.ue === ue) ? es.filter((e) => e.ue !== ue) : [...es, { ue, date: "" }]));
  const setDate = (ue: UeId, date: string) => setEpreuves((es) => es.map((e) => (e.ue === ue ? { ...e, date } : e)));
  const datesOk = epreuves.length > 0 && epreuves.every((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date) && e.date >= todayIso());

  const addPreset = ({ nom: _nom, ...p }: (typeof PRESETS)[number]) => { void _nom; setCreneaux((cs) => [...cs, { ...p, jours: [...p.jours], id: uid() }]); };
  const upd = (id: string, patch: Partial<Creneau>) => setCreneaux((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const minSem = creneaux.reduce((s, k) => s + k.minutes * k.jours.length, 0);

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <span className="label">Ton coach · étape {etape + 1} sur 3</span>
        <h1>{["Tes épreuves", "Tes moments d'écoute", "C'est parti"][etape]}</h1>
        <p className={styles.lead}>
          {[
            "Choisis les UE que tu passes à la prochaine session et la date de chaque épreuve.",
            "Quand as-tu les mains ou les yeux occupés, mais les oreilles libres ? Ajoute tes créneaux habituels.",
            "Je construis ton programme jusqu'au jour J : nouveaux épisodes, révisions espacées, puis sprint final.",
          ][etape]}
        </p>
      </header>

      {etape === 0 && (
        <section className={styles.block}>
          <label className={styles.field}>
            <span>Ton prénom (facultatif)</span>
            <input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value.slice(0, 30))} placeholder="Prénom" autoComplete="given-name" />
          </label>
          <div className={styles.ueList}>
            {UES.filter((u) => u.diplome === diplome || epreuves.some((x) => x.ue === u.id)).map((u) => {
              const e = epreuves.find((x) => x.ue === u.id);
              return (
                <div key={u.id} className={`${styles.ueRow} ${e ? styles.ueOn : ""}`}>
                  <button className={styles.ueToggle} aria-pressed={!!e} onClick={() => toggleUe(u.id)}>
                    <b>{u.short}</b><span>{u.name}</span>
                  </button>
                  {e && (
                    <label className={styles.dateField}>
                      <span>Date de l&apos;épreuve</span>
                      <input id={`date-${u.id}`} type="date" min={todayIso()} value={e.date} onChange={(ev) => setDate(u.id, ev.target.value)} />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
          <p className={styles.meta}>Les dates de la session 2027 seront fixées par arrêté. Mets une date estimée, tu pourras la corriger à tout moment.</p>
        </section>
      )}

      {etape === 1 && (
        <section className={styles.block}>
          <span className="label">Ajouter un créneau type</span>
          <div className={styles.presets}>
            {PRESETS.map((p, i) => {
              const c = CONTEXTES.find((x) => x.id === p.contexte)!;
              return <button key={i} className={styles.preset} onClick={() => addPreset(p)}>{c.emoji} {p.nom} · {p.minutes} min</button>;
            })}
          </div>
          {creneaux.length === 0 && <p className={styles.empty}>Aucun créneau pour l&apos;instant. Touche une suggestion ci-dessus pour l&apos;ajouter, puis ajuste-la.</p>}
          {creneaux.map((c) => (
            <div key={c.id} className={styles.creneau}>
              <div className={styles.row2}>
                <select id={`ctx-${c.id}`} value={c.contexte} onChange={(e) => upd(c.id, { contexte: e.target.value as Contexte })}>
                  {CONTEXTES.map((x) => <option key={x.id} value={x.id}>{x.emoji} {x.label}</option>)}
                </select>
                <button className={styles.remove} onClick={() => setCreneaux((cs) => cs.filter((x) => x.id !== c.id))} aria-label="Supprimer ce créneau">✕</button>
              </div>
              <div className={styles.days} role="group" aria-label="Jours">
                {JOURS.map((j, i) => (
                  <button key={j} aria-pressed={c.jours.includes(i)}
                    onClick={() => upd(c.id, { jours: c.jours.includes(i) ? c.jours.filter((x) => x !== i) : [...c.jours, i].sort() })}>{j}</button>
                ))}
              </div>
              <div className={styles.row2}>
                <label className={styles.inline}>À <input id={`h-${c.id}`} type="time" value={c.heure} onChange={(e) => upd(c.id, { heure: e.target.value })} /></label>
                <label className={styles.inline}>
                  Durée
                  <select id={`m-${c.id}`} value={c.minutes} onChange={(e) => upd(c.id, { minutes: Number(e.target.value) })}>
                    {[5, 10, 15, 20, 30, 40, 45, 60].map((m) => <option key={m} value={m}>{m} min</option>)}
                  </select>
                </label>
              </div>
            </div>
          ))}
          {creneaux.length > 0 && <p className={styles.meta}>Total : {minSem} min par semaine, soit environ {Math.round(minSem / 10)} épisodes ou révisions.</p>}
        </section>
      )}

      {etape === 2 && (
        <section className={styles.block}>
          <ul className={styles.recap}>
            {[...epreuves].sort((a, b) => a.date.localeCompare(b.date)).map((e) => (
              <li key={e.ue}><b>{libelleUe(e.ue)}</b> le {dateFr(e.date)} · J-{daysBetween(todayIso(), e.date)}</li>
            ))}
          </ul>
          <p>{creneaux.length} créneau{creneaux.length > 1 ? "x" : ""} par semaine, {minSem} minutes d&apos;écoute au total.</p>
          {minSem < 60 && <p className={styles.warn}>Moins d&apos;une heure par semaine, c&apos;est court pour le DSCG. Même 15 minutes de plus en cuisinant feront la différence.</p>}
        </section>
      )}

      <div className={styles.nav}>
        {etape > 0 ? <button className={styles.ghost} onClick={() => setEtape(etape - 1)}>Retour</button>
          : onCancel ? <button className={styles.ghost} onClick={onCancel}>Annuler</button> : <span />}
        {etape < 2 ? (
          <button className={styles.primary} disabled={etape === 0 ? !datesOk : creneaux.length === 0 || creneaux.some((c) => !c.jours.length)}
            onClick={() => setEtape(etape + 1)}>Continuer</button>
        ) : (
          <button className={styles.primary} onClick={() => onSave({ prenom: prenom.trim() || undefined, epreuves, creneaux, creeLe: todayIso() })}>Créer mon programme</button>
        )}
      </div>
      {etape === 0 && !datesOk && epreuves.length > 0 && <p className={styles.meta}>Indique une date à venir pour chaque UE choisie.</p>}
    </div>
  );
}
