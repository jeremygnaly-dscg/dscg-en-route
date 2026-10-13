import Link from "next/link";
import styles from "./profile.module.css";

const STEPS = [
  { t: "Le quiz du mois", d: "Une fois par mois, le même quiz pour tous, sur toutes les UE. Chronométré, une seule tentative." },
  { t: "Le classement", d: "Les points tiennent compte des bonnes réponses et du temps. Le classement est publié à la fin du mois." },
  { t: "Le top 10", d: "Les 10 premiers sont présentés à des cabinets partenaires pour un CDI, une alternance ou un stage, s'ils l'acceptent." },
];

export function MonthlyQuiz() {
  return (
    <div className={styles.wrap}>
      <header>
        <h1 style={{ fontSize: 28 }}>Quiz du mois</h1>
        <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>Révise, classe-toi, fais-toi repérer par les cabinets.</p>
      </header>

      <section className={styles.block}>
        <h2>Prochain quiz <span className={styles.soon}>au lancement</span></h2>
        <ol className={styles.list} style={{ color: "var(--fg)" }}>
          {STEPS.map((s) => (
            <li key={s.t}><b>{s.t}.</b> <span style={{ color: "var(--muted)" }}>{s.d}</span></li>
          ))}
        </ol>
      </section>

      <section className={styles.block}>
        <h2>Classement</h2>
        <p style={{ color: "var(--muted)" }}>
          Le premier classement apparaîtra ici après le premier quiz. En attendant, entraîne-toi sur les flashs
          de chaque épisode.
        </p>
        <Link href="/app" className={styles.link}>Réviser maintenant →</Link>
      </section>
    </div>
  );
}
