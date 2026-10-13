"use client";
import Link from "next/link";
import { EPISODES } from "@/content/episodes";
import { useProgress } from "@/lib/prefs";
import { useTheme, type Theme } from "@/lib/theme";
import styles from "./profile.module.css";

const THEMES: [Theme, string][] = [["system", "Auto"], ["light", "Clair"], ["dark", "Sombre"]];

export function Profile() {
  const [progress] = useProgress();
  const [theme, setTheme] = useTheme();
  const done = Object.entries(progress).filter(([, p]) => p.done);
  const live = EPISODES.filter((e) => e.status === "live").length;
  const score = done.length ? done.reduce((s, [, p]) => s + (p.score ?? 0), 0) / done.length : 0;

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div className={styles.avatar} aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
        </div>
        <div className={styles.stats}>
          <div><b>{done.length}</b><span>épisodes</span></div>
          <div><b>{done.length ? score.toFixed(1).replace(".", ",") : "–"}</b><span>score moyen /3</span></div>
          <div><b>{live ? Math.round((done.length / live) * 100) : 0} %</b><span>du contenu</span></div>
        </div>
      </header>
      <div className={styles.identity}>
        <b>Ton profil</b>
        <span>Candidat DSCG · session 2027</span>
      </div>

      <section className={styles.block}>
        <h2>Apparence</h2>
        <div className={styles.seg} role="group" aria-label="Thème">
          {THEMES.map(([v, l]) => (
            <button key={v} aria-pressed={theme === v} onClick={() => setTheme(v)}>{l}</button>
          ))}
        </div>
        <p className={styles.hint}>« Auto » suit le réglage de ton téléphone.</p>
      </section>

      <section className={styles.block}>
        <h2>Ton CV <span className={styles.soon}>bientôt</span></h2>
        <p>
          Chaque mois, un quiz national. Les 10 meilleurs sont présentés à des cabinets partenaires pour un CDI,
          une alternance ou un stage. Avec ton accord, ton CV et ton profil leur seront transmis.
        </p>
        <ul className={styles.list}>
          <li>Photo de profil (facultative)</li>
          <li>CV en PDF</li>
          <li>Ce que tu recherches : CDI, alternance ou stage, et ta région</li>
          <li>Ton choix d&apos;être visible ou non des cabinets</li>
        </ul>
        <Link href="/app/quiz" className={styles.link}>Voir le quiz du mois →</Link>
      </section>

      <p className={styles.legal}>
        Pour l&apos;instant, ta progression reste sur ce téléphone. Les comptes arrivent avec le lancement.{" "}
        <Link href="/confidentialite">Confidentialité</Link>
      </p>
    </div>
  );
}
