"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UES, episodesOf, findEpisode } from "@/content/episodes";
import { useProgress, useQuizAttente } from "@/lib/prefs";
import { Installer } from "./Installer";
import { aAcces, estGratuit, useAbonnements, venteActive } from "@/lib/vente";
import styles from "./home.module.css";

export function Home() {
  const [ue, setUe] = useState("ue1");
  const [progress] = useProgress();
  const [attente] = useQuizAttente();
  const { abos } = useAbonnements();
  const quizAFaire = attente.map(findEpisode).filter((e) => e && e.status === "live" && !progress[e.id]?.done);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("ue");
    if (q && UES.some((u) => u.id === q && u.available)) setUe(q);
  }, []);

  const current = UES.find((u) => u.id === ue)!;
  const list = [...episodesOf(ue)].sort((a, b) => (a.status === b.status ? 0 : a.status === "live" ? -1 : 1));
  const live = list.filter((e) => e.status === "live");
  const aVenir = list.filter((e) => e.status !== "live");
  const doneCount = live.filter((e) => progress[e.id]?.done).length;

  return (
    <div className={styles.wrap}>
      <header className={styles.brand}>
        <h1>Memo<span>son</span></h1>
        <p>Un cas d&apos;examen, le cours, trois questions. Dans le RER, sans livre.</p>
      </header>

      <Installer />

      {quizAFaire.length > 0 && (
        <section className={styles.attente}>
          <b>{quizAFaire.length} quiz t&apos;attend{quizAFaire.length > 1 ? "ent" : ""}</b>
          <span>Épisodes écoutés jusqu&apos;au bout : trois questions chacun pour ancrer la notion.</span>
          <div>
            {quizAFaire.map((e) => (
              <Link key={e!.id} href={`/episode/${e!.id}?p=flash`}>{e!.title} ›</Link>
            ))}
          </div>
        </section>
      )}

      <div className={styles.ues} role="group" aria-label="Unités d'enseignement">
        {UES.map((u) => (
          <button key={u.id} className={styles.ue} aria-pressed={u.id === ue} disabled={!u.available}
            onClick={() => { setUe(u.id); history.replaceState(null, "", `/app?ue=${u.id}`); }}>
            {u.short} <small>{u.available ? u.name.split(" ")[0] : "bientôt"}</small>
          </button>
        ))}
      </div>

      <section>
        <div className={styles.listHead}>
          <h2>{current.name}</h2>
          {live.length > 0 && <span className={styles.count}>{doneCount}/{live.length} écoutés</span>}
        </div>
        <p className={styles.sub}>Classés par fréquence à l&apos;examen. Programme de la session 2027.</p>
        <div className={styles.list}>
          {live.map((e, i) => (
            <Link key={e.id} href={`/episode/${e.id}`} className={styles.ep}>
              <span className={styles.n}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.t}><b>{e.title}</b><span>{e.ref}</span></span>
              {!aAcces(e, abos)
                ? <span className={styles.pill}>🔒 Abonnés</span>
                : progress[e.id]?.done
                ? <span className={`${styles.pill} ${styles.done}`}>Écouté · {progress[e.id]?.score}/3</span>
                : <span className={`${styles.pill} ${styles.free}`}>{venteActive() && estGratuit(e) ? "Gratuit · " : ""}{e.minutes} min</span>}
            </Link>
          ))}
        </div>
        {aVenir.length > 0 && (
          <details className={styles.avenir}>
            <summary>{aVenir.length} notion{aVenir.length > 1 ? "s" : ""} en préparation · zéro impasse</summary>
            <div className={styles.list}>
              {aVenir.map((e) => (
                <div key={e.id} className={`${styles.ep} ${styles.locked}`}>
                  <span className={styles.n}>·</span>
                  <span className={styles.t}><b>{e.title}</b><span>{e.ref}</span></span>
                  <span className={styles.pill}>bientôt</span>
                </div>
              ))}
            </div>
          </details>
        )}
      </section>
    </div>
  );
}
