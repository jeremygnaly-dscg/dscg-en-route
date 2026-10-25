"use client";
// « Dessine-moi la compta » : chaque ligne d'écriture vient se coller, comme un post-it,
// dans la bonne case (actif, passif, charges, produits), avec un + ou un −, et son pourquoi écrit à la main.
// La règle est toujours la même : actif et charges augmentent au débit, passif et produits au crédit.
import { useEffect, useMemo, useRef, useState } from "react";
import type { Ecriture, LigneEcriture } from "@/content/types";
import styles from "./schema.module.css";

type Zone = "actif" | "passif" | "charges" | "produits" | "autre";
const NOMS: Record<Zone, string> = { actif: "Actif", passif: "Passif", charges: "Charges", produits: "Produits", autre: "Autres" };

// Où va le compte ? (classes du PCG ; les comptes 28, 29, 39, 49, 59 diminuent l'actif, au crédit)
export function zoneDe(compte: string): Zone {
  if (!/^\d/.test(compte)) return "autre";
  const c = compte;
  if (/^(28|29|39|49|59)/.test(c)) return "actif";
  if (c[0] === "1") return "passif";
  if (c[0] === "2" || c[0] === "3" || c[0] === "5") return "actif";
  if (c[0] === "6") return "charges";
  if (c[0] === "7") return "produits";
  if (c[0] === "4") {
    if (/^409/.test(c)) return "actif";
    if (/^40/.test(c)) return "passif";
    if (/^419/.test(c)) return "passif";
    if (/^41/.test(c)) return "actif";
    if (/^4(2|3)/.test(c)) return "passif";
    if (/^(4456|44567|44586|441)/.test(c)) return "actif";
    if (/^44/.test(c)) return "passif";
    if (/^45/.test(c)) return "passif";
    if (/^46(2|7)/.test(c)) return "actif";
    if (/^46/.test(c)) return "passif";
    if (/^476/.test(c)) return "actif";
    if (/^477/.test(c)) return "passif";
    if (/^486/.test(c)) return "actif";
    if (/^487/.test(c)) return "passif";
  }
  return "autre";
}
// Débit : actif et charges augmentent, passif et produits diminuent. Crédit : l'inverse.
export const effet = (z: Zone, l: LigneEcriture) => {
  const debit = l.debit !== undefined;
  if (z === "autre") return debit ? "D" : "C";
  return (z === "actif" || z === "charges") === debit ? "+" : "−";
};

const eur = (n = 0) => {
  const [e, d] = (Number.isInteger(n) ? String(n) : n.toFixed(2)).split(".");
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (d ? "," + d : "") + " €";
};

// Cadre « dessiné à la main » : un rectangle légèrement tremblé, stable pour une même graine
function Cadre({ graine, className }: { graine: number; className?: string }) {
  const path = useMemo(() => {
    let s = graine * 9301 + 49297;
    const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 - 0.5; };
    const p = (x: number, y: number) => `${(x + r() * 1.6).toFixed(1)} ${(y + r() * 1.6).toFixed(1)}`;
    return `M${p(2, 2)} Q${p(50, 0)} ${p(98, 2)} Q${p(100, 50)} ${p(98, 98)} Q${p(50, 100)} ${p(2, 98)} Q${p(0, 50)} ${p(2, 2)}`;
  }, [graine]);
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <path d={path} pathLength={1} />
    </svg>
  );
}

interface Etape { e: number; l: number; ligne: LigneEcriture; zone: Zone; signe: string }

export function SchemaCompta({ ecritures, progression, auto = false, pas = 2600 }: {
  ecritures: Ecriture[];
  progression?: number;  // 0 à 1, piloté par l'audio
  auto?: boolean;        // lecture automatique (fiche, démo)
  pas?: number;          // millisecondes par ligne en lecture automatique
}) {
  const etapes: Etape[] = useMemo(() => ecritures.flatMap((w, e) => w.lignes.map((ligne, l) => {
    const zone = zoneDe(ligne.compte);
    return { e, l, ligne, zone, signe: effet(zone, ligne) };
  })), [ecritures]);
  const [n, setN] = useState(auto ? 0 : etapes.length);
  const [enCours, setEnCours] = useState(auto);
  const minuteur = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (progression === undefined) return;
    setN(Math.min(etapes.length, Math.floor(progression * (etapes.length + 0.999))));
  }, [progression, etapes.length]);

  useEffect(() => {
    if (!enCours) return;
    minuteur.current = setInterval(() => setN((x) => {
      if (x >= etapes.length) { setEnCours(false); return x; }
      return x + 1;
    }), pas);
    return () => { if (minuteur.current) clearInterval(minuteur.current); };
  }, [enCours, etapes.length, pas]);

  const vues = etapes.slice(0, n);
  const courante = vues[vues.length - 1];
  const ecr = courante ? ecritures[courante.e] : ecritures[0];
  const totD = vues.filter((v) => v.e === courante?.e).reduce((s, v) => s + (v.ligne.debit ?? 0), 0);
  const totC = vues.filter((v) => v.e === courante?.e).reduce((s, v) => s + (v.ligne.credit ?? 0), 0);
  const zonesUtiles: Zone[] = etapes.some((x) => x.zone === "autre") ? ["actif", "passif", "charges", "produits", "autre"] : ["actif", "passif", "charges", "produits"];

  const notes = (z: Zone) => vues.filter((v) => v.zone === z).map((v, i) => (
    <div key={`${v.e}-${v.l}`} className={`${styles.note} ${v.signe === "+" ? styles.plus : v.signe === "−" ? styles.moins : ""} ${v === courante ? styles.neuve : ""}`}
      style={{ transform: `rotate(${((v.e * 7 + v.l * 13 + i) % 5) - 2}deg)` }}>
      <b>{v.signe === "D" || v.signe === "C" ? v.signe : v.signe} {eur(v.ligne.debit ?? v.ligne.credit)}</b>
      <span>{v.ligne.compte} · {v.ligne.intitule}</span>
    </div>
  ));

  return (
    <section className={styles.tableau} aria-label="Schéma animé de l'écriture">
      <div className={styles.entete}>
        <span className={styles.titreMain}>{ecr?.titre}</span>
        {auto && (
          <button className={styles.rejouer} onClick={() => { setN(0); setEnCours(true); }}>
            {enCours ? "En cours…" : n >= etapes.length ? "↺ Rejouer" : "▶ Lancer"}
          </button>
        )}
      </div>

      <div className={styles.planches}>
        <div className={styles.planche}>
          <span className={styles.nomPlanche}>Bilan</span>
          <div className={styles.colonnes}>
            {(["actif", "passif"] as Zone[]).map((z, i) => (
              <div key={z} className={styles.colonne}>
                <Cadre graine={i + 1} className={styles.cadre} />
                <span className={styles.nomZone}>{NOMS[z]}</span>
                <span className={styles.regle}>{z === "actif" ? "+ au débit" : "+ au crédit"}</span>
                {notes(z)}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.planche}>
          <span className={styles.nomPlanche}>Compte de résultat</span>
          <div className={styles.colonnes}>
            {(["charges", "produits"] as Zone[]).map((z, i) => (
              <div key={z} className={styles.colonne}>
                <Cadre graine={i + 3} className={styles.cadre} />
                <span className={styles.nomZone}>{NOMS[z]}</span>
                <span className={styles.regle}>{z === "charges" ? "+ au débit" : "+ au crédit"}</span>
                {notes(z)}
              </div>
            ))}
          </div>
        </div>
        {zonesUtiles.includes("autre") && vues.some((v) => v.zone === "autre") && (
          <div className={styles.planche}>
            <span className={styles.nomPlanche}>Retraitements</span>
            <div className={styles.colonne}><Cadre graine={7} className={styles.cadre} />{notes("autre")}</div>
          </div>
        )}
      </div>

      <div className={styles.bulle} aria-live="polite">
        {courante ? (
          <>
            <span className={courante.ligne.debit !== undefined ? styles.d : styles.c}>{courante.ligne.debit !== undefined ? "Débit" : "Crédit"}</span>
            <p>{courante.ligne.pourquoi ?? `${courante.ligne.intitule} : ${NOMS[courante.zone].toLowerCase()} ${courante.signe === "+" ? "qui augmente" : "qui diminue"}.`}</p>
          </>
        ) : <p>Chaque ligne va venir se coller dans la bonne case. Regarde où, et pourquoi.</p>}
      </div>

      <div className={styles.balance}>
        <span>Débit <b>{eur(totD)}</b></span>
        <span className={totD === totC && totD > 0 ? styles.egal : ""}>{totD === totC && totD > 0 ? "=" : "≠"}</span>
        <span>Crédit <b>{eur(totC)}</b></span>
      </div>
    </section>
  );
}
