import Link from "next/link";
import styles from "./landing.module.css";

// Page de présentation : pourquoi Zenvise existe et à quoi il sert.
// Le fil conducteur est une journée d'étudiant : on révise dans les moments qui existent déjà.

const JOURNEE = [
  { heure: "07:42", lieu: "Dans le RER", quoi: "Un épisode : le régime mère-fille, en 2 minutes", enCours: true },
  { heure: "12:50", lieu: "À la pause", quoi: "Trois questions sur ce que tu as écouté le matin" },
  { heure: "19:30", lieu: "En cuisinant", quoi: "Trois épisodes enchaînés, sans toucher au téléphone" },
  { heure: "22:15", lieu: "Avant de dormir", quoi: "La fiche de révision, l'essentiel à relire" },
];

const EPISODE = [
  { t: "La scène", d: "Un dirigeant expose son problème à son expert-comptable. C'est le cas d'examen, joué comme un podcast." },
  { t: "Le cours", d: "La règle, les articles à citer, la méthode attendue par le correcteur. Une voix posée, un fond sonore calme." },
  { t: "Le quiz", d: "Trois questions juste après l'écoute. Se tester ancre la notion bien mieux que réécouter." },
  { t: "La fiche", d: "L'essentiel en une phrase, les points à retenir, les pièges, et selon la matière les formules ou les écritures." },
];

export function Landing() {
  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <span className={styles.logo}>Zen<span>vise</span></span>
        <Link href="/connexion?mode=connexion" className={styles.login}>Se connecter</Link>
      </header>

      <section className={styles.hero}>
        <h1>Réviser dans les moments qui existent déjà.</h1>
        <p className={styles.lead}>
          Le trajet du matin, la cuisine du soir, la marche jusqu&apos;au bureau. Zenvise transforme ces minutes en
          révisions : des épisodes audio courts, construits sur des cas d&apos;examen, à écouter attentivement quand tu
          peux te poser, ou en fond quand tes mains sont occupées.
        </p>
        <Link href="/connexion?mode=inscription" className={styles.cta}>Rejoindre la bêta gratuite</Link>

        <ol className={styles.journee} aria-label="Une journée avec Zenvise">
          {JOURNEE.map((m) => (
            <li key={m.heure} className={m.enCours ? styles.enCours : undefined}>
              <time className={styles.heure}>{m.heure}</time>
              <div className={styles.moment}>
                <b>{m.lieu}</b>
                <span>{m.quoi}</span>
                {m.enCours && (
                  <span className={styles.onde} aria-hidden="true">
                    {Array.from({ length: 22 }, (_, i) => <i key={i} style={{ animationDelay: `${((i * 7) % 11) * 0.09}s` }} />)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.bloc}>
        <h2>Pourquoi Zenvise existe</h2>
        <p>
          Préparer un examen à côté d&apos;un travail, d&apos;une alternance ou en candidat libre, c&apos;est réviser avec des
          journées déjà pleines. Les grosses sessions du week-end ne suffisent pas, et les livres restent souvent fermés.
        </p>
        <p>
          Pourtant, on retient mieux en petites doses répétées sur plusieurs semaines qu&apos;en une seule longue séance.
          Zenvise est construit sur cette idée : un peu à la fois, souvent, longtemps. Et dans des moments que tu ne
          comptais pas utiliser.
        </p>
      </section>

      <section className={styles.bloc}>
        <h2>Deux façons d&apos;écouter</h2>
        <div className={styles.deux}>
          <div className={styles.actif}>
            <h3>Quand tu peux te poser</h3>
            <p>Tu écoutes l&apos;épisode, tu réponds aux trois questions, tu relis la fiche. Cinq minutes, et la notion est vraiment travaillée.</p>
          </div>
          <div className={styles.passif}>
            <h3>Quand tes mains sont occupées</h3>
            <p>En voiture, en cuisinant, en marchant : les épisodes s&apos;enchaînent, écran verrouillé. Les quiz t&apos;attendent pour plus tard.</p>
          </div>
        </div>
      </section>

      <section className={styles.bloc}>
        <h2>Sur la durée, pas la veille</h2>
        <p>
          Tu indiques tes épreuves et tes disponibilités. Le Coach te dit chaque jour quoi écouter : les nouvelles notions,
          et les révisions au bon moment, pour que ce que tu écoutes aujourd&apos;hui soit encore là le jour de l&apos;examen.
        </p>
      </section>

      <section className={styles.bloc}>
        <h2>Un épisode, en quatre temps</h2>
        <ol className={styles.etapes}>
          {EPISODE.map((s) => (
            <li key={s.t}><b>{s.t}</b><span>{s.d}</span></li>
          ))}
        </ol>
      </section>

      <section className={styles.bloc}>
        <h2>Prêt pour la réforme 2027</h2>
        <p>
          Le DCG et le DSCG changent à la session 2027 : nouveaux programmes, et des sujets qui demandent davantage
          d&apos;analyser, de justifier et de conseiller. Zenvise suit le nouveau référentiel, UE par UE.
        </p>
        <p>
          Les cas marqués « Format 2027 » reprennent la construction des sujets zéro officiels : une situation de cabinet,
          des documents à exploiter, une réponse argumentée. Avec d&apos;autres entreprises et d&apos;autres chiffres, pour
          s&apos;entraîner sur la méthode plutôt que sur un corrigé appris par cœur.
        </p>
      </section>

      <section className={styles.bloc}>
        <h2>Pour qui</h2>
        <p>
          Les candidats au DCG et au DSCG, en formation initiale, en alternance ou en candidat libre. Toutes les
          notions du programme y passent, même celles qui tombent rarement : zéro impasse quand tu as le temps de
          réviser. D&apos;autres examens suivront.
        </p>
      </section>

      <section className={styles.fin}>
        <h2>Gratuit pendant la bêta</h2>
        <p>Crée ton compte et accède à tous les épisodes. Ensuite, l&apos;abonnement sera à 9,99 € par mois, sans engagement.</p>
        <Link href="/connexion?mode=inscription" className={styles.cta}>Rejoindre la bêta gratuite</Link>
      </section>

      <footer className={styles.footer}>
        <span>Zenvise</span>
        <nav className={styles.footLinks}>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/cgv">CGV</Link>
        </nav>
      </footer>
    </div>
  );
}
