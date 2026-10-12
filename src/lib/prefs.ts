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
}

export const DEFAULT_PREFS: Prefs = { gender: "f", tone: "calm", speed: 1, ambiance: "beach", ambVolume: 0.35 };

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

export type Progress = Record<string, { done: boolean; score?: number }>;

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({});
  useEffect(() => setProgress(read<Progress>("der-progress", {})), []);
  const markDone = (id: string, score: number) =>
    setProgress((p) => { const next = { ...p, [id]: { done: true, score } }; write("der-progress", next); return next; });
  return [progress, markDone] as const;
}
