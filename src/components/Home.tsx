"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UES, episodesOf } from "@/content/episodes";
import { useProgress } from "@/lib/prefs";
import styles from "./home.module.css";

export function Home() {
  const [ue, setUe] = useState("ue1");
  const [progress] = useProgress();

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("ue");
    if (q && UES.some((u) => u.id === q && u.available)) setUe(q);
  }, []);

  const current = UES.find((u) => u.id === ue)!;
  const list = [...episodesOf(ue)].sort((a, b) => (a.status === b.status ? 0 : a.status === "live" ? -1 : 1));
  const live = list.filter((e) => e.status === "live");
  const doneCount = live.filter((e) => progress[e.id]?.done).length;

  return (
    <div className={styles.wrap}>
      <header className={styles.brand}>
        <h1>Révi<span>zen</span></h1>
        <p>Un cas d&apos;examen, le cours, trois questions. Dans le RER, sans livre.</p>
      </header>

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
          {list.map((e, i) => {
            const n = String(i + 1).padStart(2, "0");
            const inner = (
              <>
                <span className={styles.n}>{n}</span>
                <span className={styles.t}><b>{e.title}</b><span>{e.ref}</span></span>
                {e.status !== "live" ? <span className={styles.pill}>bientôt disponible</span>
                  : progress[e.id]?.done ? <span className={`${styles.pill} ${styles.done}`}>Écouté · {progress[e.id]?.score}/3</span>
                  : <span className={`${styles.pill} ${styles.free}`}>{e.minutes} min</span>}
              </>
            );
            return e.status === "live"
              ? <Link key={e.id} href={`/episode/${e.id}`} className={styles.ep}>{inner}</Link>
              : <div key={e.id} className={`${styles.ep} ${styles.locked}`}>{inner}</div>;
          })}
        </div>
      </section>
    </div>
  );
}
