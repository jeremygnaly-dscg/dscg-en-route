"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { UeId } from "@/content/types";
import { useSession } from "@/lib/compte";
import {
  PORTAIL_STRIPE, PRIX, VENTE_ACTIVE, enregistrerConsentement, lienPaiement, modeTest, useAbonnements, valide, venteActive,
} from "@/lib/vente";
import styles from "./abonnement.module.css";

const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "");

export function Abonnement() {
  const { session } = useSession();
  const { abos, recharger } = useAbonnements();
  const [actif, setActif] = useState(false);
  const [merci, setMerci] = useState(false);
  const ue: UeId | null = null; // offre unique : toutes les UE
  const [cgv, setCgv] = useState(false);
  const [renonce, setRenonce] = useState(false);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("test") === "1") modeTest(true);
    if (q.get("test") === "0") modeTest(false);
    setActif(venteActive());
    if (q.get("merci") === "1") {
      setMerci(true);
      // Le webhook Stripe active l'accès en quelques secondes : on revérifie
      let n = 0;
      const t = setInterval(() => { void recharger(); if (++n >= 10) clearInterval(t); }, 3000);
      return () => clearInterval(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const valides = abos.filter(valide);

  const payer = async (formule: "ue" | "toutes") => {
    setErreur("");
    if (!cgv || !renonce) return setErreur("Coche les deux cases pour continuer.");
    const lien = session && lienPaiement(formule, ue, session.user.id, session.user.email);
    if (!lien) return setErreur("Le paiement en ligne n'est pas encore ouvert.");
    setEnvoi(true);
    await enregistrerConsentement(
      `CGV acceptées et renonciation au droit de rétractation (accès immédiat) · abonnement ${formule} ${PRIX.toutes}/mois · ${new Date().toISOString()}`,
    );
    window.location.href = lien;
  };

  return (
    <div className={styles.wrap}>
      <header>
        <span className="label">Abonnement</span>
        <h1>Révise tout le programme</h1>
        <p className={styles.lead}>Sans engagement : tu résilies quand tu veux, en deux clics.</p>
      </header>

      {!actif && (
        <p className={styles.beta}>
          <b>Bêta gratuite.</b> Pendant la bêta, tous les épisodes sont ouverts : tu n&apos;as rien à payer.
          {!VENTE_ACTIVE && <> <button className={styles.lienTexte} onClick={() => { modeTest(true); setActif(true); }}>Voir l&apos;offre payante (aperçu)</button></>}
        </p>
      )}
      {actif && !VENTE_ACTIVE && (
        <p className={styles.beta}>
          <b>Aperçu.</b> Le mode payant est simulé sur ce téléphone seulement.{" "}
          <button className={styles.lienTexte} onClick={() => { modeTest(false); setActif(false); }}>Revenir à la bêta gratuite</button>
        </p>
      )}

      {merci && (
        <p className={styles.ok}>
          {valides.length ? "C'est fait : ton abonnement est actif. Bonnes révisions !" : "Paiement reçu. Ton accès s'active dans quelques secondes…"}
        </p>
      )}

      {valides.length > 0 && (
        <section className={styles.carte}>
          <span className="label">Ton abonnement</span>
          {valides.map((a) => (
            <p key={a.stripe_subscription} className={styles.abo}>
              <b>{a.formule === "toutes" ? "Toutes les UE" : `UE ${a.ue?.slice(2)}`}</b>
              <span>
                {a.resiliation_prevue ? `Résilié : accès jusqu'au ${date(a.fin_periode)}` : `Renouvelé le ${date(a.fin_periode)}`}
                {a.statut === "past_due" ? " · paiement en échec, mets à jour ta carte" : ""}
              </span>
            </p>
          ))}
          {PORTAIL_STRIPE && <a className={styles.secondaire} href={PORTAIL_STRIPE}>Gérer ou résilier mon abonnement</a>}
        </section>
      )}

      <div className={styles.cases}>
        <span className="label">Avant de choisir</span>
        <label><input type="checkbox" checked={cgv} onChange={(e) => setCgv(e.target.checked)} /> <span>J&apos;accepte les <Link href="/cgv">conditions générales de vente</Link>.</span></label>
        <label><input type="checkbox" checked={renonce} onChange={(e) => setRenonce(e.target.checked)} /> <span>Je demande l&apos;accès immédiat aux contenus et je reconnais perdre mon droit de rétractation dès cet accès.</span></label>
        {erreur && <p className={styles.err}>{erreur}</p>}
      </div>
      <section className={styles.offres} style={{ gridTemplateColumns: "1fr" }}>
        <div className={`${styles.offre} ${styles.vedette}`}>
          <span className={styles.nom}>Abonnement Révizen</span>
          <b className={styles.prix}>{PRIX.toutes}<small>/mois</small></b>
          <span>Toutes les UE : épisodes, quiz, fiches de révision et Coach, et les nouveaux épisodes chaque semaine.</span>
          <button className={styles.principal} disabled={envoi || !actif} onClick={() => payer("toutes")}>M&apos;abonner</button>
        </div>
      </section>

      <p className={styles.note}>Paiement sécurisé par Stripe. Révizen ne voit jamais ton numéro de carte. Un épisode par UE reste gratuit sans abonnement.</p>
    </div>
  );
}
