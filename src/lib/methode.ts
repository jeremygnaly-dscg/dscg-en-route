"use client";
// Rappels de la méthode entonnoir : on se teste de tête (carte de l'UE, notions d'une partie,
// mots-clés d'une notion), puis on s'auto-évalue. Répétition espacée en 5 boîtes.
import { useEffect, useState } from "react";
import { CARTES, MOTS_CLES, carteDe } from "@/content/methode";
import { todayIso, type Progress } from "./prefs";

export type Note = "trouve" | "moitie" | "oublie";
export interface Suivi { boite: number; prochain: string; vu: number; dernier: string }
export type Rappels = Record<string, Suivi>;

const CLE = "zenvise-rappels";
export const INTERVALLES = [1, 3, 7, 21, 60]; // jours, par boîte
export const MAITRISE = 2; // boîte à partir de laquelle on considère l'élément acquis

export const plusJours = (iso: string, j: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  const x = new Date(y, m - 1, d + j);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};

export function noterSuivi(prev: Suivi | undefined, note: Note, today: string): Suivi {
  const b = prev?.boite ?? -1;
  const boite = note === "trouve" ? Math.min(4, b + 1) : note === "moitie" ? Math.max(0, b) : 0;
  const delai = note === "trouve" ? INTERVALLES[boite] : 1;
  return { boite, prochain: plusJours(today, delai), vu: (prev?.vu ?? 0) + 1, dernier: today };
}

const lire = (): Rappels => { try { return JSON.parse(localStorage.getItem(CLE) ?? "{}"); } catch { return {}; } };
const ecrire = (r: Rappels) => { try { localStorage.setItem(CLE, JSON.stringify(r)); } catch { /* stockage indisponible */ } };

export function useRappels() {
  const [rappels, setRappels] = useState<Rappels>({});
  const [pret, setPret] = useState(false);
  useEffect(() => { setRappels(lire()); setPret(true); }, []);
  const noter = (id: string, note: Note) =>
    setRappels((r) => { const next = { ...r, [id]: noterSuivi(r[id], note, todayIso()) }; ecrire(next); return next; });
  return { rappels, noter, pret };
}

export const idCarte = (ue: string) => `carte:${ue}`;
export const idBloc = (ue: string, bloc: string) => `bloc:${ue}:${bloc}`;
export const idNotion = (notion: string) => `notion:${notion}`;

export interface ElementRappel {
  id: string;
  type: "carte" | "bloc" | "notion";
  ue: string;
  titre: string;          // ce qu'on montre
  consigne: string;       // ce qu'on demande
  reponses: string[];     // ce qu'il fallait retrouver
  indice?: string;
  lien?: string;
}

// Tous les éléments qu'on peut réviser, pour une UE qui a une carte
export function elementsDe(ue: string): ElementRappel[] {
  const c = carteDe(ue);
  if (!c) return [];
  const out: ElementRappel[] = [{
    id: idCarte(ue), type: "carte", ue, titre: "La carte de l'UE",
    consigne: `Retrouve les ${c.blocs.length} grandes parties, dans l'ordre.`,
    reponses: c.blocs.map((b) => b.titre), indice: c.phrase, lien: `/app/carte?ue=${ue}`,
  }];
  for (const b of c.blocs) {
    out.push({
      id: idBloc(ue, b.id), type: "bloc", ue, titre: `Partie ${b.numero} · ${b.titre}`,
      consigne: `Retrouve les ${b.notions.length} notions de cette partie.`,
      reponses: b.notions.map((n) => n.titre), indice: b.resume, lien: `/app/carte?ue=${ue}&b=${b.id}`,
    });
    for (const n of b.notions) {
      const mots = MOTS_CLES[n.id];
      if (!mots?.length) continue;
      out.push({
        id: idNotion(n.id), type: "notion", ue, titre: n.titre,
        consigne: "Retrouve les mots-clés, et explique chacun avec tes mots.",
        reponses: mots, indice: `Partie ${b.numero} · ${b.titre}`,
        lien: n.episodes?.[0] ? `/episode/${n.episodes[0]}` : undefined,
      });
    }
  }
  return out;
}

// Éléments à revoir aujourd'hui. Une notion entre dans la boucle le lendemain de l'écoute de son épisode.
export function dus(rappels: Rappels, progress: Progress, today: string, ues: string[] = Object.keys(CARTES)): ElementRappel[] {
  const ordre = { carte: 0, bloc: 1, notion: 2 };
  return ues.flatMap(elementsDe).filter((e) => {
    const s = rappels[e.id];
    if (s) return s.prochain <= today;
    if (e.type !== "notion" || !e.lien?.startsWith("/episode/")) return false;
    const ep = progress[e.lien.slice("/episode/".length)];
    return !!(ep?.done && ep.date && plusJours(ep.date, 1) <= today);
  }).sort((a, b) => ordre[a.type] - ordre[b.type]);
}

export const maitrise = (s?: Suivi) => !!s && s.boite >= MAITRISE;
