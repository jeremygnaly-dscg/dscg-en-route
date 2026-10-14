"use client";
// Vente des abonnements. Tant que VENTE_ACTIVE vaut false, tout est gratuit (bêta) : rien n'est bloqué.
// Pour ouvrir la vente : renseigner les liens Stripe ci-dessous, puis passer VENTE_ACTIVE à true.
// Aperçu avant l'ouverture : /app/abonnement?test=1 active le mode payant sur ce seul téléphone.
import { useEffect, useState } from "react";
import type { Episode, UeId } from "@/content/types";
import { EPISODES } from "@/content/episodes";
import { supabase, useSession } from "./compte";

export const VENTE_ACTIVE = false;

// Lien de paiement Stripe (Payment Link), à coller ici une fois créé dans Stripe.
// Offre unique pour l'instant : 9,99 €/mois, toutes les UE. (La formule « une UE » reste prévue dans le code, inactive.)
export const LIENS_STRIPE = {
  ue: "", // non proposé pour l'instant
  toutes: "", // abonnement Révizen, toutes les UE, 9,99 €/mois
};
export const PORTAIL_STRIPE = ""; // lien du portail client Stripe (gérer ou résilier son abonnement)

export const PRIX = { ue: "", toutes: "9,99 €" };

export interface Abonnement {
  stripe_subscription: string;
  formule: "ue" | "toutes";
  ue: UeId | null;
  statut: string;
  fin_periode: string | null;
  resiliation_prevue: boolean;
}

const TEST = "revizen-test-vente";
export function venteActive() {
  if (VENTE_ACTIVE) return true;
  try { return localStorage.getItem(TEST) === "1"; } catch { return false; }
}
export function modeTest(actif: boolean) {
  try { if (actif) localStorage.setItem(TEST, "1"); else localStorage.removeItem(TEST); } catch { /* rien */ }
}

// Un épisode gratuit par UE : le premier en ligne, pour découvrir avant de payer
const GRATUITS = new Set(
  (["ue1", "ue2", "ue3", "ue4", "ue5"] as UeId[])
    .map((ue) => EPISODES.find((e) => e.ue === ue && e.status === "live")?.id)
    .filter(Boolean) as string[],
);
export const estGratuit = (e: Episode) => GRATUITS.has(e.id);

// Un abonnement donne accès tant qu'il est actif, ou jusqu'à la fin de la période payée
export function valide(a: Abonnement) {
  if (["active", "trialing", "past_due"].includes(a.statut)) return true;
  return !!a.fin_periode && new Date(a.fin_periode) > new Date();
}

export function aAcces(e: Episode, abos: Abonnement[]) {
  if (!venteActive() || estGratuit(e)) return true;
  return abos.some((a) => valide(a) && (a.formule === "toutes" || a.ue === e.ue));
}

let cache: { uid: string; abos: Abonnement[] } | null = null;

export function useAbonnements() {
  const { session } = useSession();
  const uid = session?.user.id;
  const [abos, setAbos] = useState<Abonnement[]>(cache && cache.uid === uid ? cache.abos : []);
  const [charge, setCharge] = useState(!!(cache && cache.uid === uid));

  const recharger = async () => {
    if (!uid) return;
    const { data } = await supabase.from("abonnements").select("stripe_subscription, formule, ue, statut, fin_periode, resiliation_prevue").eq("user_id", uid);
    cache = { uid, abos: (data as Abonnement[]) ?? [] };
    setAbos(cache.abos);
    setCharge(true);
  };

  useEffect(() => { void recharger(); }, [uid]); // eslint-disable-line react-hooks/exhaustive-deps
  return { abos, charge, recharger };
}

// Lien de paiement : Stripe renvoie client_reference_id au webhook, qui active l'accès
export function lienPaiement(formule: "ue" | "toutes", ue: UeId | null, userId: string, email?: string) {
  const base = LIENS_STRIPE[formule];
  if (!base) return null;
  const ref = `${userId}__${formule}__${formule === "ue" ? ue : "all"}`;
  const q = new URLSearchParams({ client_reference_id: ref });
  if (email) q.set("prefilled_email", email);
  return `${base}${base.includes("?") ? "&" : "?"}${q.toString()}`;
}

export async function enregistrerConsentement(objet: string) {
  const { error } = await supabase.from("consentements").insert({ objet: objet.slice(0, 500) });
  return !error;
}
