"use client";
// Réseau des étudiants : profil public, entraide, défis, messages. Données dans Supabase (supabase/reseau.sql).
import { useCallback, useEffect, useState } from "react";
import { supabase, useSession } from "./compte";

export interface Membre {
  id: string; pseudo: string; prenom?: string | null; diplome: "dcg" | "dscg" | "cca" | "autre"; ues: string[];
  ecole?: string | null; situation?: string | null; bio?: string | null; couleur: number; messages_ouverts: boolean; vu_le?: string;
}
export type Auteur = Pick<Membre, "pseudo" | "couleur" | "diplome">;

export const COULEURS = ["#3340c7", "#c2410c", "#0f766e", "#7c3aed", "#be185d", "#0369a1", "#4d7c0f", "#9a6516"];
export const DIPLOMES_RESEAU: { id: Membre["diplome"]; nom: string }[] = [
  { id: "dscg", nom: "DSCG" }, { id: "dcg", nom: "DCG" }, { id: "cca", nom: "CCA / master" }, { id: "autre", nom: "Autre" },
];
export const nomDiplome = (d?: string) => DIPLOMES_RESEAU.find((x) => x.id === d)?.nom ?? "";

export const ilYa = (iso: string) => {
  const min = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (min < 1) return "à l'instant";
  if (min < 60) return `${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h`;
  const j = Math.round(h / 24);
  if (j < 7) return `${j} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

// Messages d'erreur du réseau en français
export function erreurReseau(e: { message?: string } | null | undefined): string {
  const m = (e?.message ?? "").toLowerCase();
  if (m.includes("debit_depasse")) return "Tu as beaucoup publié en peu de temps. Réessaie dans un moment.";
  if (m.includes("profil_requis")) return "Crée d'abord ton profil dans la Communauté.";
  if (m.includes("bloque")) return "Impossible : l'un de vous a bloqué l'autre.";
  if (m.includes("messages_fermes")) return "Ce membre ne reçoit pas de messages.";
  if (m.includes("membres_pseudo_unique") || m.includes("duplicate key")) return "Ce pseudo est déjà pris.";
  if (m.includes("check constraint")) return "Vérifie le texte : trop court ou trop long.";
  if (m.includes("fetch") || m.includes("network")) return "Pas de connexion. Réessaie.";
  return "Ça n'a pas marché. Réessaie dans un instant.";
}

/** Profil réseau de l'utilisateur connecté (null s'il n'en a pas encore créé). */
export function useMoi() {
  const { session, ready } = useSession();
  const [moi, setMoi] = useState<Membre | null>(null);
  const [charge, setCharge] = useState(false);
  const recharger = useCallback(async () => {
    if (!session) { setMoi(null); setCharge(true); return; }
    const { data } = await supabase.from("membres").select("*").eq("id", session.user.id).maybeSingle();
    setMoi((data as Membre) ?? null);
    setCharge(true);
  }, [session]);
  useEffect(() => { if (ready) void recharger(); }, [ready, recharger]);
  return { moi, charge: ready && charge, session, recharger };
}

/** Signaler un contenu ou un membre (masquage automatique à 3 signalements). */
export async function signaler(cible_type: "question" | "reponse" | "commentaire" | "message" | "membre", cible_id: string | number) {
  const motif = window.prompt("Pourquoi signales-tu ce contenu ? (insulte, harcèlement, spam, contenu illégal, sujet d'examen protégé…)");
  if (!motif?.trim()) return false;
  const { error } = await supabase.from("signalements").insert({ cible_type, cible_id: String(cible_id), motif: motif.trim().slice(0, 500) });
  if (error && !error.message.includes("duplicate")) { window.alert(erreurReseau(error)); return false; }
  window.alert("Merci, c'est signalé. L'équipe Zenvise va regarder.");
  return true;
}

/** Points du défi de la semaine, appelé à la fin de chaque quiz (silencieux si pas de profil réseau). */
export async function gagnerPoints(bonnes: number, total: number): Promise<{ points_jour: number; points_semaine: number; serie: number } | null> {
  try {
    const { data, error } = await supabase.rpc("ajouter_points", { bonnes, total });
    if (error) return null;
    return (data as { points_jour: number; points_semaine: number; serie: number }[])?.[0] ?? null;
  } catch { return null; }
}

/** Nombre de messages non lus, mis à jour en temps réel. */
export function useNonLus() {
  const { session } = useSession();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!session) return;
    let vivant = true;
    const compter = async () => {
      const { data } = await supabase.rpc("mes_conversations");
      if (vivant && Array.isArray(data)) setN((data as { non_lus: number }[]).reduce((s, c) => s + Number(c.non_lus || 0), 0));
    };
    void compter();
    const canal = supabase.channel("non-lus").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => void compter()).subscribe();
    const t = setInterval(compter, 90000);
    window.addEventListener("zenvise-lu", compter);
    return () => { vivant = false; clearInterval(t); window.removeEventListener("zenvise-lu", compter); void supabase.removeChannel(canal); };
  }, [session]);
  return n;
}

/** Lit un paramètre d'URL (?id=…) côté client, compatible avec l'export statique. */
export function useParam(nom: string) {
  const [v, setV] = useState<string | null>(null);
  useEffect(() => { setV(new URLSearchParams(window.location.search).get(nom)); }, [nom]);
  return v;
}
