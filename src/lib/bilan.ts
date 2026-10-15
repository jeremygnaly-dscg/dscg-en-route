// Bilan hebdomadaire du Coach, rédigé par l'IA (Claude) à partir de la semaine de l'élève.
// L'appli prépare un résumé chiffré de la semaine ; la fonction serveur « coach-bilan » le transmet à Claude,
// vérifie le quota (1 bilan par semaine par défaut) et enregistre le bilan dans la table `bilans`.
// Aucune donnée d'identité n'est envoyée à Claude : seulement le prénom choisi dans le Coach (facultatif) et l'activité.
import { useEffect, useState } from "react";
import type { Episode } from "@/content/types";
import { libelleUe, UES } from "@/content/episodes";
import { addDays, daysBetween, type CoachConfig } from "./coach";
import type { Progress } from "./prefs";
import { supabase } from "./compte";

export interface ContexteBilan {
  prenom?: string;
  epreuves: { ue: string; matiere: string; jours: number }[];
  plan: { seancesPrevues: number; minutesPrevues: number; joursActifs: number };
  ecoutes: { titre: string; ue: string; score: number }[];
  revisions: { titre: string; ue: string; score: number }[];
  erreurs: { notion: string; question: string; bonneReponse: string }[];
  restants: { ue: string; episodes: number }[];
}

export interface Bilan { semaine: string; texte: string; cree_le: string }

const lundi = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return addDays(iso, -((new Date(y, m - 1, d).getDay() + 6) % 7));
};

/** Résumé des 7 derniers jours, construit uniquement à partir des données de l'élève. */
export function contexteBilan(config: CoachConfig, progress: Progress, episodes: Episode[], today: string): ContexteBilan {
  const debut = addDays(today, -6);
  const dansSemaine = (d?: string) => !!d && d >= debut && d <= today;
  const ep = (id: string) => episodes.find((e) => e.id === id);
  const ueVue = (e: Episode) => libelleUe([e.ue, ...(e.aussi ?? [])].find((u) => config.epreuves.some((x) => x.ue === u)) ?? e.ue);

  // Plan : créneaux prévus sur les 7 derniers jours
  let seancesPrevues = 0, minutesPrevues = 0;
  for (let i = 0; i < 7; i++) {
    const jour = addDays(debut, i);
    const [y, m, d] = jour.split("-").map(Number);
    const wd = (new Date(y, m - 1, d).getDay() + 6) % 7;
    for (const c of config.creneaux) if (c.jours.includes(wd)) { seancesPrevues++; minutesPrevues += c.minutes; }
  }

  const actifs = new Set<string>();
  const ecoutes: ContexteBilan["ecoutes"] = [];
  const revisions: ContexteBilan["revisions"] = [];
  const erreurs: ContexteBilan["erreurs"] = [];
  for (const [id, r] of Object.entries(progress)) {
    const e = ep(id);
    if (!e) continue;
    const essaisSemaine = (r.essais ?? []).filter((x) => dansSemaine(x.d));
    const dernier = essaisSemaine.at(-1);
    const score = dernier ? e.flash.length - dernier.ko.length : r.score ?? 0;
    if (dansSemaine(r.date)) { actifs.add(r.date!); ecoutes.push({ titre: e.title, ue: ueVue(e), score }); }
    const revs = (r.reviews ?? []).filter(dansSemaine);
    revs.forEach((d) => actifs.add(d));
    if (revs.length && !dansSemaine(r.date)) revisions.push({ titre: e.title, ue: ueVue(e), score });
    // Questions ratées à la dernière tentative de la semaine (ce qui reste à retravailler)
    for (const i of dernier?.ko ?? []) {
      const q = e.flash[i];
      if (q) erreurs.push({ notion: e.title, question: q.q, bonneReponse: q.choices[q.answer] });
    }
  }

  const epreuves = config.epreuves
    .map((x) => ({ ue: libelleUe(x.ue), matiere: UES.find((u) => u.id === x.ue)?.name ?? "", jours: daysBetween(today, x.date) }))
    .filter((x) => x.jours >= 0);
  const restants = config.epreuves.map((x) => ({
    ue: libelleUe(x.ue),
    episodes: episodes.filter((e) => (e.ue === x.ue || e.aussi?.includes(x.ue)) && e.status === "live" && !progress[e.id]?.done).length,
  }));

  return {
    prenom: config.prenom?.slice(0, 40) || undefined,
    epreuves,
    plan: { seancesPrevues, minutesPrevues, joursActifs: actifs.size },
    ecoutes: ecoutes.slice(0, 20),
    revisions: revisions.slice(0, 20),
    erreurs: erreurs.slice(0, 12),
    restants,
  };
}

export const aDeQuoiFaireUnBilan = (c: ContexteBilan) => c.ecoutes.length + c.revisions.length > 0;

type Etat =
  | { etat: "chargement" }
  | { etat: "aucun" }
  | { etat: "pret"; bilan: Bilan }
  | { etat: "envoi" }
  | { etat: "erreur"; message: string };

const MESSAGES: Record<string, string> = {
  quota: "Tu as déjà reçu ton bilan cette semaine. Le prochain sera disponible lundi.",
  vide: "Écoute au moins un épisode cette semaine pour recevoir un bilan.",
  non_configure: "Les bilans arrivent très bientôt.",
  limite_globale: "Les bilans sont très demandés ce mois-ci. Réessaie dans quelques jours.",
  connexion: "Connecte-toi pour recevoir ton bilan.",
};

/** Bilan de la semaine en cours : lecture, puis génération à la demande. */
export function useBilan(today: string) {
  const [etat, setEtat] = useState<Etat>({ etat: "chargement" });
  const semaine = lundi(today);

  useEffect(() => {
    let annule = false;
    (async () => {
      const { data } = await supabase.from("bilans").select("semaine, texte, cree_le")
        .eq("semaine", semaine).order("cree_le", { ascending: false }).limit(1);
      if (annule) return;
      setEtat(data?.[0] ? { etat: "pret", bilan: data[0] as Bilan } : { etat: "aucun" });
    })().catch(() => !annule && setEtat({ etat: "aucun" }));
    return () => { annule = true; };
  }, [semaine]);

  const demander = async (contexte: ContexteBilan) => {
    setEtat({ etat: "envoi" });
    try {
      const { data, error } = await supabase.functions.invoke("coach-bilan", { body: contexte });
      if (data?.texte) return setEtat({ etat: "pret", bilan: data as Bilan });
      let code = data?.erreur as string | undefined;
      if (!code && error && "context" in error) {
        try { code = (await (error.context as Response).json())?.erreur; } catch { /* réponse non JSON */ }
      }
      setEtat({ etat: "erreur", message: MESSAGES[code ?? ""] ?? "Le bilan n'a pas pu être préparé. Réessaie plus tard." });
    } catch {
      setEtat({ etat: "erreur", message: "Le bilan n'a pas pu être préparé. Vérifie ta connexion." });
    }
  };

  return { etat, demander };
}
