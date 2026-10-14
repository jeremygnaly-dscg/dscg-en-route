"use client";
// « Signaler une erreur » : les bêta-testeurs relèvent les erreurs d'un épisode.
// Les signalements arrivent dans la table `avis` de Supabase (page = signalement:<épisode>:<partie>).
import { useState } from "react";
import { envoyerAvis } from "@/lib/compte";
import styles from "./player.module.css";

const TYPES = ["Erreur dans le cours", "Question du quiz fausse", "Article ou chiffre périmé", "Problème de son", "Autre"];

export function Signaler({ episodeId, partie }: { episodeId: string; partie: string }) {
  const [ouvert, setOuvert] = useState(false);
  const [type, setType] = useState(TYPES[0]);
  const [texte, setTexte] = useState("");
  const [etat, setEtat] = useState<"idle" | "envoi" | "ok" | "ko">("idle");

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texte.trim()) return;
    setEtat("envoi");
    const ok = await envoyerAvis(null, `[${type}] ${texte.trim()}`, `signalement:${episodeId}:${partie}`);
    setEtat(ok ? "ok" : "ko");
    if (ok) setTexte("");
  };

  if (!ouvert) {
    return (
      <button className={styles.signalerLien} onClick={() => { setOuvert(true); setEtat("idle"); }} data-noprint>
        ⚑ Signaler une erreur
      </button>
    );
  }
  return (
    <form onSubmit={envoyer} className={styles.signaler} data-noprint>
      {etat === "ok" ? (
        <p className={styles.merci}>Merci ! On vérifie et on corrige.</p>
      ) : (
        <>
          <span className="label">Signaler une erreur</span>
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Type d'erreur">
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <textarea rows={3} maxLength={1500} value={texte} onChange={(e) => setTexte(e.target.value)}
            placeholder="Qu'est-ce qui ne va pas ? Si tu connais la bonne réponse, indique-la." aria-label="Description" />
          {etat === "ko" && <p className={styles.notice}>L&apos;envoi n&apos;a pas marché. Vérifie ta connexion.</p>}
          <div className={styles.actions}>
            <button type="submit" className={styles.primary} disabled={etat === "envoi" || !texte.trim()}>
              {etat === "envoi" ? "Envoi…" : "Envoyer"}
            </button>
            <button type="button" className={styles.ghost} onClick={() => setOuvert(false)}>Annuler</button>
          </div>
        </>
      )}
    </form>
  );
}
