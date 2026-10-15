"use client";
// Comptes bêta (Supabase Auth, email + mot de passe) et synchronisation de la progression.
// La progression reste aussi sur le téléphone : l'appli marche hors ligne, le compte sert de sauvegarde
// et permet de retrouver sa progression sur un autre appareil.
import { useEffect, useState } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { Progress } from "./prefs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "revizen-auth" },
});

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let vivant = true;
    void supabase.auth.getSession().then(({ data }) => { if (vivant) { setSession(data.session); setReady(true); } });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s); setReady(true); });
    return () => { vivant = false; data.subscription.unsubscribe(); };
  }, []);
  return { session, ready };
}

// Messages d'erreur Supabase en français
export function messageErreur(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Email ou mot de passe incorrect.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Un compte existe déjà avec cet email. Connecte-toi.";
  if (m.includes("email not confirmed")) return "Confirme d'abord ton email avec le lien reçu.";
  if (m.includes("password") && (m.includes("6") || m.includes("8") || m.includes("weak"))) return "Mot de passe trop faible : 8 caractères minimum.";
  if (m.includes("rate limit") || m.includes("too many")) return "Trop de tentatives. Réessaie dans quelques minutes.";
  if (m.includes("fetch") || m.includes("network")) return "Pas de connexion. Vérifie ton réseau et réessaie.";
  return "Ça n'a pas marché. Réessaie dans un instant.";
}

// ───────────── Synchronisation de la progression ─────────────
const lire = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const ecrire = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible */ } };

// Fusion sans perte : épisode fait si fait d'un côté, meilleur score, première date, toutes les révisions
export function fusionner(a: Progress, b: Progress): Progress {
  const out: Progress = { ...a };
  for (const [id, r] of Object.entries(b)) {
    const l = out[id];
    if (!l) { out[id] = r; continue; }
    const dates = [l.date, r.date].filter(Boolean).sort() as string[];
    out[id] = {
      done: !!(l.done || r.done),
      score: Math.max(l.score ?? 0, r.score ?? 0),
      date: dates[0],
      reviews: [...new Set([...(l.reviews ?? []), ...(r.reviews ?? [])])].sort(),
    };
    const essais = [...new Map([...(l.essais ?? []), ...(r.essais ?? [])].map((e) => [`${e.d}|${e.ko.join(",")}`, e])).values()]
      .sort((x, y) => x.d.localeCompare(y.d)).slice(-6);
    if (essais.length) out[id].essais = essais;
  }
  return out;
}

// À la connexion : récupère la progression du compte et la fusionne avec celle du téléphone
export async function synchroniser(userId: string) {
  const { data: u } = await supabase.auth.getUser();
  const dip = u.user?.user_metadata?.diplome;
  if (dip === "dcg" || dip === "dscg") {
    const { diplomeConnu, enregistrerDiplome } = await import("./diplome");
    if (!diplomeConnu()) enregistrerDiplome(dip);
  }
  const { data, error } = await supabase.from("profils").select("progression, coach").eq("id", userId).maybeSingle();
  if (error) return;
  const locale = lire<Progress>("der-progress", {});
  const fusion = fusionner(locale, (data?.progression as Progress) ?? {});
  ecrire("der-progress", fusion);
  const coachLocal = lire<unknown>("revizen-coach", null);
  if (!coachLocal && data?.coach) ecrire("revizen-coach", data.coach);
  await supabase.from("profils").upsert({
    id: userId, progression: fusion, coach: coachLocal ?? data?.coach ?? null, maj_le: new Date().toISOString(),
  });
}

// Après chaque quiz ou réglage du Coach : envoi groupé (une fois toutes les 2 secondes au plus)
let attente: ReturnType<typeof setTimeout> | null = null;
export function pousser() {
  if (attente) clearTimeout(attente);
  attente = setTimeout(async () => {
    attente = null;
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return;
    await supabase.from("profils").update({
      progression: lire<Progress>("der-progress", {}), coach: lire<unknown>("revizen-coach", null), maj_le: new Date().toISOString(),
    }).eq("id", uid);
  }, 2000);
}

export async function envoyerAvis(note: number | null, message: string, page: string) {
  const { error } = await supabase.from("avis").insert({ note, message: message.slice(0, 2000), page: page.slice(0, 200) });
  return !error;
}

export async function nbBeta(): Promise<number | null> {
  const { data, error } = await supabase.rpc("nb_beta");
  return error ? null : Number(data);
}

export async function seDeconnecter() {
  await supabase.auth.signOut();
  // La progression est sauvegardée dans le compte : on la retire du téléphone (appareil partagé)
  try { ["der-progress", "revizen-coach", "revizen-quiz-attente"].forEach((k) => localStorage.removeItem(k)); } catch { /* rien */ }
}

export async function supprimerCompte() {
  const { error } = await supabase.rpc("supprimer_mon_compte");
  if (error) return false;
  await seDeconnecter();
  return true;
}
