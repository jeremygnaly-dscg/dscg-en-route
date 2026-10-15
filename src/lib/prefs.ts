"use client";
import { useEffect, useState } from "react";
import type { Ambiance } from "./ambient";

// Réglages et progression, gardés sur le téléphone de l'utilisateur.
// Quand les comptes Supabase arriveront, la progression sera synchronisée.

export interface Prefs {
  gender: "f" | "m";
  tone: "calm" | "lively";
  speed: number;
  ambiance: Ambiance;
  ambVolume: number; // 0 à 1
  apres: "quiz" | "suite"; // fin d'épisode : quiz et fiche, ou épisode suivant (voiture, transports)
}

export const DEFAULT_PREFS: Prefs = { gender: "f", tone: "calm", speed: 1, ambiance: "beach", ambVolume: 0.35, apres: "quiz" };

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? { ...fallback, ...JSON.parse(v) } : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* stockage indisponible */ }
}

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  useEffect(() => setPrefs(read("der-prefs", DEFAULT_PREFS)), []);
  const update = (patch: Partial<Prefs>) =>
    setPrefs((p) => { const next = { ...p, ...patch }; write("der-prefs", next); return next; });
  return [prefs, update] as const;
}

// date : AAAA-MM-JJ de la première écoute complète ; reviews : dates des révisions faites
// essais : dernières tentatives au quiz (date + numéros des questions ratées), pour le bilan du Coach
export type Essai = { d: string; ko: number[] };
export type Progress = Record<string, { done: boolean; score?: number; date?: string; reviews?: string[]; essais?: Essai[] }>;
const MAX_ESSAIS = 6;

export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({});
  useEffect(() => setProgress(read<Progress>("der-progress", {})), []);
  const markDone = (id: string, score: number, ko: number[] = []) =>
    setProgress((p) => {
      const prev = p[id];
      const day = todayIso();
      // Déjà écouté : c'est une révision (utile au Coach pour espacer les rappels)
      const entry = prev?.done
        ? { ...prev, score: Math.max(prev.score ?? 0, score), reviews: [...(prev.reviews ?? []), day] }
        : { done: true, score, date: day, reviews: [] };
      (entry as Progress[string]).essais = [...(prev?.essais ?? []), { d: day, ko }].slice(-MAX_ESSAIS);
      const next = { ...p, [id]: entry };
      write("der-progress", next);
      void import("./compte").then((m) => m.pousser()); // sauvegarde dans le compte
      return next;
    });
  return [progress, markDone] as const;
}

// Épisodes écoutés jusqu'au bout dont le quiz n'est pas encore fait (ex. écoute en voiture)
const ATTENTE = "revizen-quiz-attente";
export function useQuizAttente() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try { setIds(JSON.parse(localStorage.getItem(ATTENTE) ?? "[]")); } catch { /* vide */ }
  }, []);
  const save = (next: string[]) => { write(ATTENTE, next); return next; };
  const add = (id: string) => setIds((p) => (p.includes(id) ? p : save([...p, id])));
  const remove = (id: string) => setIds((p) => save(p.filter((x) => x !== id)));
  return [ids, add, remove] as const;
}
