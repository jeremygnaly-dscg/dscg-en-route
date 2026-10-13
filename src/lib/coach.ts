// Le Coach : à partir des épreuves à passer et des créneaux disponibles,
// construit un programme de révision jusqu'aux épreuves (fonctions pures, testables).

import type { Episode, UeId } from "@/content/types";
import type { Progress } from "./prefs";

export type Contexte = "transport" | "cuisine" | "sport" | "pause" | "soir" | "autre";

export const CONTEXTES: { id: Contexte; label: string; emoji: string }[] = [
  { id: "transport", label: "Dans les transports", emoji: "🚆" },
  { id: "cuisine", label: "En cuisinant", emoji: "🍳" },
  { id: "sport", label: "Pendant le sport", emoji: "🏃" },
  { id: "pause", label: "Pause déjeuner", emoji: "☕" },
  { id: "soir", label: "Le soir", emoji: "🌙" },
  { id: "autre", label: "Autre moment", emoji: "🎧" },
];

export interface Creneau {
  id: string;
  jours: number[]; // 0 = lundi … 6 = dimanche
  heure: string; // "07:45"
  minutes: number;
  contexte: Contexte;
}

export interface Epreuve {
  ue: UeId;
  date: string; // AAAA-MM-JJ
}

export interface CoachConfig {
  prenom?: string;
  epreuves: Epreuve[];
  creneaux: Creneau[];
  creeLe: string;
}

export type ItemType = "nouveau" | "revision";

export interface Item {
  type: ItemType;
  episodeId: string;
  ue: UeId;
  minutes: number;
}

export interface Seance {
  date: string; // AAAA-MM-JJ
  creneau: Creneau;
  items: Item[];
  phase: "decouverte" | "sprint";
}

export const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
export const MIN_NOUVEAU = 10; // durée d'un épisode complet
export const MIN_REVISION = 4; // réécoute du cours en accéléré + flash
const ESPACEMENT = [1, 7, 21]; // révisions à J+1, J+7, J+21
const SPRINT_JOURS = 21; // les 3 dernières semaines : priorité aux révisions

// ── dates (locales, sans fuseau) ──
const parse = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const addDays = (iso: string, n: number) => { const d = parse(iso); d.setDate(d.getDate() + n); return fmt(d); };
export const daysBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000);
const weekday = (iso: string) => (parse(iso).getDay() + 6) % 7; // lundi = 0

export function minutesParSemaine(c: CoachConfig) {
  return c.creneaux.reduce((s, k) => s + k.minutes * k.jours.length, 0);
}

/**
 * Programme de `today` jusqu'à la dernière épreuve (au plus `maxDays` jours).
 * - Les nouveaux épisodes sont répartis selon l'urgence : épisodes restants / jours restants.
 * - Chaque épisode écouté revient en révision à J+1, J+7 et J+21.
 * - Dans les 3 dernières semaines d'une UE, les révisions de cette UE passent en premier.
 */
export function buildPlan(config: CoachConfig, episodes: Episode[], progress: Progress, today: string, maxDays = 400): Seance[] {
  const epreuves = config.epreuves.filter((e) => daysBetween(today, e.date) >= 0);
  if (!epreuves.length || !config.creneaux.length) return [];
  const examOf = new Map(epreuves.map((e) => [e.ue, e.date]));
  const last = epreuves.map((e) => e.date).sort().at(-1)!;
  const horizon = Math.min(daysBetween(today, last), maxDays);

  // File des nouveaux épisodes par UE (ordre du catalogue = ordre de fréquence)
  const queues = new Map<UeId, Episode[]>();
  for (const e of epreuves) {
    queues.set(e.ue, episodes.filter((x) => x.ue === e.ue && x.status === "live" && !progress[x.id]?.done));
  }
  // Révisions à venir : épisode → dates dues
  type Due = { episodeId: string; ue: UeId; date: string };
  const due: Due[] = [];
  const ecouteLe = new Map<string, string>(); // épisode → jour de première écoute dans le plan
  const pushReviews = (ep: Episode, from: string) => {
    ecouteLe.set(ep.id, from);
    due.push({ episodeId: ep.id, ue: ep.ue, date: addDays(from, ESPACEMENT[0]) });
  };
  // Après une révision : la suivante selon l'espacement, puis entretien tous les 30 jours (7 en sprint)
  const nbRev = new Map<string, number>();
  const planifierSuite = (r: Due, date: string) => {
    const n = (nbRev.get(r.episodeId) ?? 0) + 1;
    nbRev.set(r.episodeId, n);
    const exam = examOf.get(r.ue)!;
    const sprint = daysBetween(date, exam) <= SPRINT_JOURS;
    const gap = n < ESPACEMENT.length ? ESPACEMENT[n] - ESPACEMENT[n - 1] : sprint ? 7 : 30;
    const next = addDays(date, gap);
    if (daysBetween(next, exam) > 0) due.push({ ...r, date: next });
  };
  for (const ep of episodes) {
    const p = progress[ep.id];
    if (!p?.done || !examOf.has(ep.ue)) continue;
    const start = p.date ?? today;
    const doneCount = Math.min(p.reviews?.length ?? 0, ESPACEMENT.length - 1);
    nbRev.set(ep.id, doneCount);
    const d = addDays(p.reviews?.at(-1) ?? start, doneCount === 0 ? ESPACEMENT[0] : ESPACEMENT[doneCount] - ESPACEMENT[doneCount - 1]);
    due.push({ episodeId: ep.id, ue: ep.ue, date: daysBetween(today, d) < 0 ? today : d });
  }

  const seances: Seance[] = [];
  let jourCourant = "";
  let nouveauxDuJour = 0;
  for (let i = 0; i <= horizon; i++) {
    const date = addDays(today, i);
    // Rythme : répartir les épisodes restants jusqu'au début du sprint final (au moins 1 par jour)
    const restants = [...queues.values()].reduce((n, q) => n + q.length, 0);
    const finDecouverte = epreuves.map((e) => addDays(e.date, -SPRINT_JOURS)).sort()[0];
    const joursDispo = Math.max(1, daysBetween(date, finDecouverte));
    const quota = Math.max(1, Math.ceil(restants / joursDispo));
    if (date !== jourCourant) { jourCourant = date; nouveauxDuJour = 0; }
    const wd = weekday(date);
    const slots = config.creneaux.filter((c) => c.jours.includes(wd)).sort((a, b) => a.heure.localeCompare(b.heure));
    for (const creneau of slots) {
      let cap = creneau.minutes;
      const items: Item[] = [];
      const ouvertes = [...examOf.entries()].filter(([, d]) => daysBetween(date, d) > 0);
      if (!ouvertes.length) continue;
      const enSprint = ouvertes.filter(([, d]) => daysBetween(date, d) <= SPRINT_JOURS).map(([u]) => u);

      // 1. Révisions dues (UE en sprint d'abord)
      const dues = due
        .filter((r) => r.date <= date && examOf.has(r.ue) && daysBetween(date, examOf.get(r.ue)!) > 0)
        .sort((a, b) => Number(enSprint.includes(b.ue)) - Number(enSprint.includes(a.ue)) || a.date.localeCompare(b.date));
      for (const r of dues) {
        if (cap < MIN_REVISION) break;
        if (items.some((x) => x.episodeId === r.episodeId)) continue;
        items.push({ type: "revision", episodeId: r.episodeId, ue: r.ue, minutes: MIN_REVISION });
        cap -= MIN_REVISION;
        due.splice(due.indexOf(r), 1);
        planifierSuite(r, date);
      }

      // 2. Nouveaux épisodes, UE la plus urgente d'abord
      while (cap >= MIN_NOUVEAU && nouveauxDuJour < quota) {
        const candidats = ouvertes
          .map(([u, d]) => ({ u, q: queues.get(u)!, urgence: (queues.get(u)!.length || 0) / Math.max(1, daysBetween(date, d)) }))
          .filter((c) => c.q.length > 0)
          .sort((a, b) => b.urgence - a.urgence);
        if (!candidats.length) break;
        const ep = candidats[0].q.shift()!;
        items.push({ type: "nouveau", episodeId: ep.id, ue: ep.ue, minutes: MIN_NOUVEAU });
        cap -= MIN_NOUVEAU;
        nouveauxDuJour++;
        pushReviews(ep, date);
      }

      // 3. Temps restant : révisions un peu anticipées (dues sous 3 jours, jamais le jour de la première écoute)
      const futures = due
        .filter((r) => daysBetween(date, r.date) <= 3 && ecouteLe.get(r.episodeId) !== date && daysBetween(date, examOf.get(r.ue)!) > 0)
        .sort((a, b) => a.date.localeCompare(b.date));
      for (const r of futures) {
        if (cap < MIN_REVISION) break;
        if (items.some((x) => x.episodeId === r.episodeId)) continue;
        items.push({ type: "revision", episodeId: r.episodeId, ue: r.ue, minutes: MIN_REVISION });
        cap -= MIN_REVISION;
        due.splice(due.indexOf(r), 1);
        planifierSuite(r, date);
      }

      if (items.length) seances.push({ date, creneau, items, phase: enSprint.length ? "sprint" : "decouverte" });
    }
  }
  return seances;
}

/** Combien de nouveaux épisodes par UE seront écoutés avant l'épreuve, à ce rythme. */
export function couverture(plan: Seance[], config: CoachConfig, episodes: Episode[], progress: Progress) {
  return config.epreuves.map((e) => {
    const live = episodes.filter((x) => x.ue === e.ue && x.status === "live");
    const deja = live.filter((x) => progress[x.id]?.done).length;
    const prevus = plan.flatMap((s) => s.items).filter((i) => i.ue === e.ue && i.type === "nouveau").length;
    const total = episodes.filter((x) => x.ue === e.ue).length;
    return { ue: e.ue, date: e.date, deja, prevus, disponibles: live.length, prevusAuCatalogue: total };
  });
}

/** Message du coach, selon la régularité et le temps restant. */
export function messageCoach(config: CoachConfig, progress: Progress, today: string): string {
  const prenom = config.prenom ? `${config.prenom}, ` : "";
  const prochaine = config.epreuves.filter((e) => daysBetween(today, e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
  const jours = prochaine ? daysBetween(today, prochaine.date) : null;
  const dates = Object.values(progress).flatMap((p) => [p.date, ...(p.reviews ?? [])]).filter(Boolean) as string[];
  const set = new Set(dates);
  // Série : jours consécutifs avec au moins une écoute (aujourd'hui pas encore fait = série intacte)
  let serie = 0;
  for (let d = set.has(today) ? today : addDays(today, -1); set.has(d); d = addDays(d, -1)) serie++;
  if (jours === null) return `${prenom}ajoute tes épreuves pour que je construise ton programme.`;
  if (jours <= 7) return `${prenom}dernière ligne droite : ${jours} jour${jours > 1 ? "s" : ""}. Révisions et flashs uniquement, et dors bien.`;
  if (serie >= 7) return `${prenom}${serie} jours d'affilée. C'est exactement comme ça qu'on réussit le DSCG.`;
  if (serie >= 3) return `${prenom}${serie} jours de suite, tu tiens le rythme. Garde ce réflexe écouteurs.`;
  if (dates.length === 0) return `${prenom}premier épisode aujourd'hui ? Dix minutes suffisent pour lancer la machine.`;
  if (!set.has(today) && !set.has(addDays(today, -1))) return `${prenom}on reprend doucement : un seul épisode aujourd'hui, et la série repart.`;
  return `${prenom}J-${jours} avant ta prochaine épreuve. Chaque créneau compte, même dix minutes.`;
}

/** Fichier calendrier : un rappel récurrent par créneau, jusqu'à la dernière épreuve. */
export function calendrierIcs(config: CoachConfig, appUrl: string, today: string): string {
  const last = config.epreuves.map((e) => e.date).sort().at(-1) ?? addDays(today, 90);
  const days = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const esc = (s: string) => s.replace(/[,;\\]/g, (m) => "\\" + m);
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Revizen//Coach//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Révizen"];
  for (const c of config.creneaux) {
    // premier jour concerné à partir d'aujourd'hui
    let start = today;
    for (let i = 0; i < 7; i++) { const d = addDays(today, i); if (c.jours.includes(weekday(d))) { start = d; break; } }
    const [h, m] = c.heure.split(":").map(Number);
    const endMin = h * 60 + m + c.minutes;
    const t = (mins: number) => `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}${String(mins % 60).padStart(2, "0")}00`;
    const ctx = CONTEXTES.find((x) => x.id === c.contexte)?.label ?? "";
    lines.push(
      "BEGIN:VEVENT",
      `UID:revizen-${c.id}@revizen`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=Europe/Paris:${start.replace(/-/g, "")}T${t(h * 60 + m)}`,
      `DTEND;TZID=Europe/Paris:${start.replace(/-/g, "")}T${t(endMin)}`,
      `RRULE:FREQ=WEEKLY;BYDAY=${c.jours.map((j) => days[j]).join(",")};UNTIL=${last.replace(/-/g, "")}T235959Z`,
      `SUMMARY:${esc(`🎧 Révizen · ${c.minutes} min`)}`,
      `DESCRIPTION:${esc(`${ctx}. Ta séance du jour t'attend : ${appUrl}/app/coach`)}`,
      `URL:${appUrl}/app/coach`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc("C'est l'heure de réviser : sors tes écouteurs 🎧")}`,
      "TRIGGER:PT0M",
      "END:VALARM",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
