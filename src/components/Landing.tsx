"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { joinWaitlist, waitlistCount, type JoinResult } from "@/lib/config";
import styles from "./landing.module.css";

const STEPS = [
  { t: "La scène", d: "Un dirigeant expose son problème à son expert-comptable. C'est la situation de l'examen, jouée comme un podcast." },
  { t: "Le cours", d: "La règle, les articles à citer, la méthode de rédaction attendue par le correcteur. Voix douce, rythme posé." },
  { t: "Le flash", d: "Trois questions éclair pour vérifier que la notion est acquise, avant la station suivante." },
];

export function Landing() {
  const [email, setEmail] = useState("");
  const [ue, setUe] = useState("ue1");
  const [profil, setProfil] = useState("alternant");
  const [state, setState] = useState<"idle" | "sending" | JoinResult>("idle");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => { void waitlistCount().then(setCount); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return;
    setState("sending");
    const source = new URLSearchParams(window.location.search).get("src") ?? "direct";
    const r = await joinWaitlist({ email, ue, profil, source: source.slice(0, 100) });
    setState(r);
    if (r === "ok") setCount((c) => (c === null ? c : c + 1));
  };

  const done = state === "ok" || state === "already";

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.kicker}>DSCG · session 2027 · nouveau programme</span>
        <h1>Révise le DSCG <em>dans le RER.</em></h1>
        <p className={styles.lead}>
          Des épisodes audio de 10 minutes construits sur les vrais cas d&apos;examen.
          Une scène, le cours, trois questions. Sans livre, sans écran.
        </p>
        <div className={styles.ctas}>
          <a href="#liste" className={styles.primary}>Rejoindre la liste d&apos;attente</a>
          <Link href="/episode/regime-mere-fille" className={styles.secondary}>Écouter un épisode gratuit</Link>
        </div>
        {count !== null && count > 0 && <p className={styles.count}>{count} candidat{count > 1 ? "s" : ""} déjà inscrit{count > 1 ? "s" : ""}</p>}
      </header>

      <section className={styles.proof} aria-label="Chiffres">
        <div><b>17 281</b><span>candidats au DSCG en 2025</span></div>
        <div><b>8 616</b><span>inscrits à l&apos;UE1, l&apos;épreuve que nous couvrons en premier</span></div>
        <div><b>19 %</b><span>des présents à l&apos;UE1 ont eu la moyenne</span></div>
      </section>
      <p className={styles.src}>Source : rapport du jury national du DSCG, session 2025.</p>

      <section className={styles.how}>
        <h2>Un épisode, trois temps</h2>
        <ol>
          {STEPS.map((s) => (
            <li key={s.t}><b>{s.t}</b><span>{s.d}</span></li>
          ))}
        </ol>
        <p className={styles.note}>
          Voix féminine ou masculine, ton apaisant ou dynamique, fond sonore mer, plage ou méditation.
          Les épisodes se téléchargent pour les tunnels.
        </p>
      </section>

      <section className={styles.pricing}>
        <h2>Prix de lancement</h2>
        <div className={styles.plans}>
          <div className={styles.plan}>
            <span className={styles.planName}>Une UE</span>
            <b>9,99 €<small>/mois</small></b>
            <span>Tous les épisodes de l&apos;UE choisie, mis à jour du programme 2027.</span>
          </div>
          <div className={`${styles.plan} ${styles.featured}`}>
            <span className={styles.planName}>Toutes les UE</span>
            <b>19,99 €<small>/mois</small></b>
            <span>UE1 à UE5. Le bon choix si tu passes plusieurs épreuves dans l&apos;année.</span>
          </div>
        </div>
        <p className={styles.note}>Les inscrits de la liste d&apos;attente auront le premier mois offert.</p>
      </section>

      <section id="liste" className={styles.waitlist}>
        <h2>Être prévenu du lancement</h2>
        {done ? (
          <p className={styles.success}>
            {state === "ok" ? "C'est noté. Tu recevras un e-mail au lancement, avec ton mois offert." : "Tu es déjà sur la liste. On te prévient au lancement."}
          </p>
        ) : (
          <form onSubmit={submit} className={styles.form}>
            <label htmlFor="email">Ton e-mail</label>
            <input id="email" type="email" required autoComplete="email" placeholder="prenom@exemple.fr"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className={styles.twoCols}>
              <div>
                <label htmlFor="ue">UE que tu prépares</label>
                <select id="ue" value={ue} onChange={(e) => setUe(e.target.value)}>
                  <option value="ue1">UE1 · Juridique, fiscal, social</option>
                  <option value="ue2">UE2 · Finance</option>
                  <option value="ue3">UE3 · Contrôle de gestion</option>
                  <option value="ue4">UE4 · Comptabilité et audit</option>
                  <option value="ue5">UE5 · Systèmes d&apos;information</option>
                  <option value="toutes">Plusieurs UE</option>
                </select>
              </div>
              <div>
                <label htmlFor="profil">Tu es</label>
                <select id="profil" value={profil} onChange={(e) => setProfil(e.target.value)}>
                  <option value="alternant">En alternance</option>
                  <option value="initial">En formation initiale</option>
                  <option value="libre">Candidat libre</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Inscription…" : "M'inscrire sur la liste"}
            </button>
            {state === "error" && <p className={styles.error}>L&apos;inscription n&apos;a pas abouti. Vérifie ta connexion et réessaie.</p>}
            {state === "offline" && <p className={styles.error}>La liste d&apos;attente ouvre très bientôt. Reviens dans quelques heures.</p>}
            <p className={styles.legal}>Ton e-mail sert uniquement à te prévenir du lancement. Désinscription sur simple demande.</p>
          </form>
        )}
      </section>

      <footer className={styles.footer}>
        <span>DSCG en route</span>
        <Link href="/app">Ouvrir l&apos;appli</Link>
      </footer>
    </div>
  );
}
