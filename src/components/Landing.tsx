"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { nbBeta } from "@/lib/compte";
import styles from "./landing.module.css";

const STEPS = [
  { t: "La scène", d: "Un dirigeant expose son problème à son expert-comptable. C'est la situation de l'examen, jouée comme un podcast." },
  { t: "Le cours", d: "La règle, les articles à citer, la méthode de rédaction attendue par le correcteur. Voix douce, rythme posé." },
  { t: "Le quiz", d: "Trois questions juste après l'écoute : se tester ancre la notion bien mieux que réécouter." },
  { t: "La fiche", d: "L'essentiel en une phrase, les points à retenir, la méthode attendue, les pièges, et selon la matière les formules ou les écritures." },
];

export function Landing() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => { void nbBeta().then(setCount); }, []);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.logo}>Memo<span>son</span></span>
        <span className={styles.kicker}>DSCG · session 2027 · nouveau programme</span>
        <h1>Révise le DSCG <em>dans le RER.</em></h1>
        <p className={styles.lead}>
          Des épisodes audio de 2 à 3 minutes, suivis d&apos;un quiz et d&apos;une fiche, construits sur les vrais cas d&apos;examen.
          Une scène, le cours, la fiche à retenir, trois questions.
        </p>
        <div className={styles.ctas}>
          <Link href="/connexion?mode=inscription" className={styles.primary}>Rejoindre la bêta gratuite</Link>
          <Link href="/connexion?mode=connexion" className={styles.secondary}>J&apos;ai déjà un compte</Link>
        </div>
        {count !== null && count > 0 && <p className={styles.count}>{count} bêta-testeur{count > 1 ? "s" : ""} déjà inscrit{count > 1 ? "s" : ""}</p>}
      </header>

      <section className={styles.proof} aria-label="Chiffres">
        <div><b>17 281</b><span>candidats au DSCG en 2025</span></div>
        <div><b>8 616</b><span>inscrits à l&apos;UE1, l&apos;épreuve la plus redoutée</span></div>
        <div><b>19 %</b><span>des présents à l&apos;UE1 ont eu la moyenne</span></div>
      </section>
      <p className={styles.src}>Source : rapport du jury national du DSCG, session 2025.</p>

      <section className={styles.how}>
        <h2>Comment se passe un épisode</h2>
        <ol>
          {STEPS.map((s) => (
            <li key={s.t}><b>{s.t}</b><span>{s.d}</span></li>
          ))}
        </ol>
        <p className={styles.note}>
          Voix studio, fond sonore mer, plage ou méditation. En voiture ou dans les transports,
          le mode « Enchaîner » lance l&apos;épisode suivant tout seul et garde les quiz pour plus tard.
        </p>
      </section>

      <section className={styles.pricing}>
        <h2>Prix de lancement</h2>
        <div className={styles.plans} style={{ gridTemplateColumns: "1fr" }}>
          <div className={`${styles.plan} ${styles.featured}`}>
            <span className={styles.planName}>Abonnement Memoson</span>
            <b>9,99 €<small>/mois</small></b>
            <span>Toutes les UE, tous les épisodes, quiz et fiches, et les nouveaux chaque semaine. Sans engagement.</span>
          </div>
        </div>
        <p className={styles.note}>
          Gratuit pendant la bêta. Ouverture payante quand les cinq UE écrites du DSCG seront couvertes :
          les bêta-testeurs et les inscrits de la liste d&apos;attente auront le premier mois offert.
          Le DCG, puis la licence et le master CCA, suivront.
        </p>
      </section>

      <section id="beta" className={styles.waitlist}>
        <h2>La bêta est ouverte</h2>
        <p className={styles.note}>
          UE1, UE2, UE4 et UE5 déjà en ligne, de nouveaux épisodes chaque semaine jusqu&apos;à couvrir tout le programme,
          même les notions qui tombent rarement. Accès complet et gratuit, il suffit d&apos;un compte.
        </p>
        <div className={styles.ctas} style={{ marginTop: 16 }}>
          <Link href="/connexion?mode=inscription" className={styles.primary}>Créer mon compte gratuit</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Memoson</span>
        <nav className={styles.footLinks}>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/cgv">CGV</Link>
          <Link href="/connexion?mode=connexion">Se connecter</Link>
        </nav>
      </footer>
    </div>
  );
}
