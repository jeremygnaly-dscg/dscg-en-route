import type { Metadata } from "next";
import Link from "next/link";
import { EPISODES, UES } from "@/content/episodes";
import styles from "@/components/coach.module.css";

// Tableau de suivi de production (non lié depuis l'appli).
export const metadata: Metadata = { title: "Production · Révizen", robots: { index: false, follow: false } };

const OBJ_LANCEMENT = 15;
const OBJ_PROGRAMME = 30;

const ETAT = {
  live: { label: "En ligne (voix studio)", cls: "tagRev" },
  ecrit: { label: "Écrit · voix à générer", cls: "tagNew" },
  soon: { label: "À écrire", cls: "" },
} as const;

export default function Production() {
  const total = (s: string) => EPISODES.filter((e) => e.status === s).length;
  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <span className="label">Suivi de production</span>
        <h1>Où en est le catalogue</h1>
        <p className={styles.lead}>
          {total("live")} en ligne · {total("ecrit")} écrits en attente de voix · {total("soon")} prévus.
          Objectif lancement : {OBJ_LANCEMENT} épisodes en ligne par UE.
        </p>
      </header>
      {UES.map((u) => {
        const eps = EPISODES.filter((e) => e.ue === u.id);
        const live = eps.filter((e) => e.status === "live").length;
        const ecrit = eps.filter((e) => e.status === "ecrit").length;
        return (
          <section key={u.id} className={styles.block}>
            <div className={styles.blockHead}>
              <h2>{u.short} · {u.name}</h2>
              <span className={styles.meta}>{live} en ligne · {ecrit} écrits</span>
            </div>
            <div className={styles.cov}>
              <div className={styles.covHead}><span>Vers le lancement</span><span>{live + ecrit}/{OBJ_LANCEMENT} écrits</span></div>
              <div className={styles.bar}><span style={{ width: `${Math.min(100, ((live + ecrit) / OBJ_LANCEMENT) * 100)}%` }} /></div>
              <div className={styles.covHead}><span>Programme complet</span><span>{live + ecrit}/{OBJ_PROGRAMME}</span></div>
              <div className={styles.bar}><span style={{ width: `${Math.min(100, ((live + ecrit) / OBJ_PROGRAMME) * 100)}%` }} /></div>
            </div>
            <ul className={styles.items}>
              {eps.map((e) => (
                <li key={e.id}>
                  <div className={styles.item}>
                    <i className={ETAT[e.status].cls ? styles[ETAT[e.status].cls] : styles.tagNew} style={e.status === "soon" ? { opacity: 0.5 } : undefined}>
                      {e.status === "live" ? "En ligne" : e.status === "ecrit" ? "Écrit" : "À écrire"}
                    </i>
                    <span>{e.status === "live" ? <Link href={`/episode/${e.id}`}>{e.title}</Link> : e.title}</span>
                    <small>{ETAT[e.status].label}{e.reviewedBy ? ` · relu par ${e.reviewedBy}` : " · relecture à faire"}</small>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
