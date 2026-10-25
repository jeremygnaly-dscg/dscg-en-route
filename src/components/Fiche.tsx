"use client";
import { Fragment, useState } from "react";
import { SchemaCompta } from "./SchemaCompta";
import type { Ecriture, Episode, Formule } from "@/content/types";
import { libelleUe } from "@/content/episodes";
import styles from "./player.module.css";

// Formatage identique côté serveur et téléphone (évite les écarts d'espaces de toLocaleString)
const eur = (n?: number) => {
  if (n === undefined) return "";
  const [ent, dec] = (Number.isInteger(n) ? String(n) : n.toFixed(2)).split(".");
  return ent.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") + (dec ? "," + dec : "");
};

export function Formules({ items }: { items: Formule[] }) {
  return (
    <div className={styles.fiche}>
      {items.map((f) => (
        <div key={f.nom} className={styles.card}>
          <span className="label">{f.nom}</span>
          <div className={styles.formula}>{f.formule}</div>
          {f.legende && (
            <ul className={styles.legend}>
              {f.legende.map((l) => <li key={l}>{l}</li>)}
            </ul>
          )}
          {f.piege && <p className={styles.trap}><b>Piège :</b> {f.piege}</p>}
        </div>
      ))}
    </div>
  );
}

function Dessin({ ecriture }: { ecriture: Ecriture }) {
  const [ouvert, setOuvert] = useState(false);
  return ouvert
    ? <SchemaCompta ecritures={[ecriture]} auto pas={2200} />
    : <button className={styles.dessin} data-noprint onClick={() => setOuvert(true)}>✎ Dessine-moi cette écriture</button>;
}

export function Ecritures({ items }: { items: Ecriture[] }) {
  return (
    <div className={styles.fiche}>
      {items.map((e) => {
        const d = e.lignes.reduce((s, l) => s + (l.debit ?? 0), 0);
        const c = e.lignes.reduce((s, l) => s + (l.credit ?? 0), 0);
        return (
          <div key={e.titre} className={styles.card}>
            <span className="label">{e.titre}</span>
            {e.droit && <p className={styles.droit}><b>La règle :</b> {e.droit}</p>}
            <div className={styles.journalWrap}>
              <table className={styles.journal}>
                <thead>
                  <tr><th>Compte</th><th>Intitulé</th><th>Débit</th><th>Crédit</th></tr>
                </thead>
                <tbody>
                  {e.lignes.map((l, i) => (
                    <Fragment key={i}>
                      <tr className={l.pourquoi ? styles.avecPourquoi : ""}>
                        <td className={styles.acct}>{l.compte}</td>
                        <td className={l.credit !== undefined ? styles.indent : ""}>{l.intitule}</td>
                        <td className={styles.num}>{eur(l.debit)}</td>
                        <td className={styles.num}>{eur(l.credit)}</td>
                      </tr>
                      {l.pourquoi && (
                        <tr className={styles.pourquoi}>
                          <td></td>
                          <td colSpan={3}><span className={l.debit !== undefined ? styles.sensD : styles.sensC}>{l.debit !== undefined ? "Débit" : "Crédit"}</span> {l.pourquoi}</td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td></td><td>Total</td><td className={styles.num}>{eur(d)}</td><td className={styles.num}>{eur(c)}</td></tr>
                </tfoot>
              </table>
            </div>
            {e.regle && <p className={styles.rule}>{e.regle}</p>}
            <Dessin ecriture={e} />
          </div>
        );
      })}
    </div>
  );
}

// Fiche de révision complète : l'essentiel, à retenir, méthode, formules, écritures, pièges
export function FicheRevision({ episode }: { episode: Episode }) {
  const f = episode.fiche;
  const keys = episode.cours.filter((l) => l.key).map((l) => l.text.replace(/`/g, ""));
  return (
    <div className={styles.fiche}>
      <div className={styles.ficheHead}>
        <span className="label">{libelleUe(episode.ue)} · Fiche de révision</span>
        <h2>{episode.title}</h2>
        <span className={styles.ref}>{episode.ref}</span>
      </div>
      {f && <p className={styles.essentiel}>{f.essentiel}</p>}
      <div className={styles.card}>
        <span className="label">À retenir</span>
        <ul className={styles.points}>{(f?.points ?? keys).map((p) => <li key={p}>{p}</li>)}</ul>
      </div>
      {f?.methode && (
        <div className={styles.card}>
          <span className="label">Méthode à l&apos;examen</span>
          <ol className={styles.points}>{f.methode.map((m) => <li key={m}>{m}</li>)}</ol>
        </div>
      )}
      {episode.formules && <Formules items={episode.formules} />}
      {episode.ecritures && <Ecritures items={episode.ecritures} />}
      {f?.pieges?.map((p) => <p key={p} className={styles.trap}><b>Piège :</b> {p}</p>)}
    </div>
  );
}
