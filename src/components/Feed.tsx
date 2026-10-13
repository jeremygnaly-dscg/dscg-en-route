"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ACTUS } from "@/content/actus";
import { EPISODES } from "@/content/episodes";
import styles from "./feed.module.css";

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const dateFr = (iso: string) => { const [, m, d] = iso.split("-").map(Number); return `${d} ${MOIS[m - 1]}`; };

const UE_STORIES = [
  { id: "ue1", label: "UE1", sub: "Juridique" },
  { id: "ue2", label: "UE2", sub: "Finance" },
  { id: "ue3", label: "UE3", sub: "Gestion" },
  { id: "ue4", label: "UE4", sub: "Compta" },
  { id: "ue5", label: "UE5", sub: "SI" },
];

export function Feed() {
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem("revizen-saved") ?? "[]")); } catch { /* vide */ }
  }, []);
  const toggleSave = (id: string) =>
    setSaved((s) => {
      const next = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
      try { localStorage.setItem("revizen-saved", JSON.stringify(next)); } catch { /* stockage indisponible */ }
      return next;
    });

  return (
    <div className={styles.wrap}>
      <header className={styles.top}>
        <span className={styles.logo}>Révi<span>zen</span></span>
      </header>

      <div className={styles.stories} aria-label="Unités d'enseignement">
        {UE_STORIES.map((u) => {
          const live = EPISODES.some((e) => e.ue === u.id && e.status === "live");
          return (
            <Link key={u.id} href={`/app?ue=${u.id}`} className={styles.story} aria-disabled={!live}>
              <span className={live ? styles.ring : `${styles.ring} ${styles.ringOff}`}><span>{u.label}</span></span>
              <small>{u.sub}</small>
            </Link>
          );
        })}
      </div>

      {[...ACTUS].sort((x, y) => y.date.localeCompare(x.date)).map((a) => (
        <article key={a.id} className={styles.post}>
          <div className={styles.postHead}>
            <span className={styles.avatar} aria-hidden="true">{a.categorie.slice(0, 1)}</span>
            <div className={styles.who}>
              <b>{a.categorie}</b>
              <span>{a.source} · {dateFr(a.date)}</span>
            </div>
            {a.projet && <span className={styles.badge}>Projet non voté</span>}
            {a.exemple && <span className={styles.badge}>Exemple</span>}
          </div>

          <h2>{a.titre}</h2>
          <p className={styles.resume}>{a.resume}</p>

          <div className={styles.exam}>
            <span className="label">La question d&apos;examen</span>
            <p>{a.question}</p>
          </div>

          <div className={styles.notions}>
            <span className="label">Notions liées</span>
            <div className={styles.chips}>
              {a.notions.map((n) =>
                n.episodeId ? (
                  <Link key={n.label} href={`/episode/${n.episodeId}`} className={`${styles.chip} ${styles.chipLive}`}>
                    <i>{n.ue}</i>{n.label}<span aria-hidden="true">▸</span>
                  </Link>
                ) : (
                  <span key={n.label} className={styles.chip}><i>{n.ue}</i>{n.label}</span>
                ),
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={() => toggleSave(a.id)} aria-pressed={saved.includes(a.id)} className={styles.save}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" /></svg>
              {saved.includes(a.id) ? "Enregistré" : "Enregistrer"}
            </button>
            {a.sourceUrl && <a href={a.sourceUrl} target="_blank" rel="noreferrer" className={styles.src}>Lire la source</a>}
          </div>
        </article>
      ))}
    </div>
  );
}
