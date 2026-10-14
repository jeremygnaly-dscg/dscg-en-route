"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { messageErreur, supabase } from "@/lib/compte";
import { EDITEUR } from "@/lib/legal";
import styles from "./connexion.module.css";

type Mode = "inscription" | "connexion";

// Après connexion, on revient là où l'utilisateur voulait aller (uniquement des chemins internes)
const destination = () => {
  const s = new URLSearchParams(window.location.search).get("suite") ?? "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/app";
};

export function Connexion() {
  const [mode, setMode] = useState<Mode>("inscription");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [situation, setSituation] = useState("alternance");
  const [accord, setAccord] = useState(false);
  const [etat, setEtat] = useState<"idle" | "envoi" | "verifier">("idle");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("mode") === "connexion" || q.get("suite")) setMode(q.get("mode") === "inscription" ? "inscription" : "connexion");
    // Déjà connecté : direction l'appli
    void supabase.auth.getSession().then(({ data }) => { if (data.session) window.location.replace(destination()); });
  }, []);

  const valider = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    if (mode === "inscription" && mdp.length < 8) return setErreur("Mot de passe trop court : 8 caractères minimum.");
    if (mode === "inscription" && !accord) return setErreur("Coche la case pour accepter les conditions de la bêta.");
    setEtat("envoi");
    const mail = email.trim().toLowerCase();
    const res = mode === "inscription"
      ? await supabase.auth.signUp({ email: mail, password: mdp, options: { data: { prenom: prenom.trim().slice(0, 60), situation } } })
      : await supabase.auth.signInWithPassword({ email: mail, password: mdp });
    if (res.error) { setEtat("idle"); return setErreur(messageErreur(res.error.message)); }
    if (!res.data.session) return setEtat("verifier"); // confirmation par email activée dans Supabase
    window.location.replace(destination());
  };

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.logo}>Zen<span>vise</span></Link>
      <div className={styles.card}>
        <span className={styles.badge}>Bêta gratuite</span>
        <h1>{mode === "inscription" ? "Crée ton compte" : "Content de te revoir"}</h1>
        <p className={styles.lead}>
          {mode === "inscription"
            ? "Accès complet et gratuit pendant la bêta. En échange, dis-nous ce qui marche et ce qui coince."
            : "Connecte-toi pour retrouver tes épisodes, ta progression et ton plan de révision."}
        </p>

        <div className={styles.tabs} role="group" aria-label="Choix">
          <button aria-pressed={mode === "inscription"} onClick={() => { setMode("inscription"); setErreur(""); }}>Créer un compte</button>
          <button aria-pressed={mode === "connexion"} onClick={() => { setMode("connexion"); setErreur(""); }}>J&apos;ai un compte</button>
        </div>

        {etat === "verifier" ? (
          <p className={styles.ok}>
            Presque fini : un email de confirmation vient de partir vers <b>{email}</b>. Clique sur le lien qu&apos;il contient,
            puis reviens te connecter.
          </p>
        ) : (
          <form onSubmit={valider} className={styles.form}>
            {mode === "inscription" && (
              <>
                <label htmlFor="prenom">Prénom</label>
                <input id="prenom" autoComplete="given-name" required maxLength={60} value={prenom} onChange={(e) => setPrenom(e.target.value)} />
              </>
            )}
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom@exemple.fr" />
            <label htmlFor="mdp">Mot de passe</label>
            <input id="mdp" type="password" required minLength={mode === "inscription" ? 8 : undefined}
              autoComplete={mode === "inscription" ? "new-password" : "current-password"} value={mdp} onChange={(e) => setMdp(e.target.value)} />
            {mode === "inscription" && (
              <>
                <span className={styles.hint}>8 caractères minimum.</span>
                <label htmlFor="situation">Tu prépares le DSCG</label>
                <select id="situation" value={situation} onChange={(e) => setSituation(e.target.value)}>
                  <option value="alternance">En alternance</option>
                  <option value="initiale">En formation initiale</option>
                  <option value="libre">En candidat libre</option>
                  <option value="poste">En poste, à côté du travail</option>
                </select>
                <label className={styles.check}>
                  <input type="checkbox" checked={accord} onChange={(e) => setAccord(e.target.checked)} />
                  <span>
                    J&apos;accepte que mon email et ma progression soient conservés pour faire fonctionner mon compte
                    (<Link href="/confidentialite">confidentialité</Link>). Les contenus de la bêta sont en cours de relecture.
                  </span>
                </label>
              </>
            )}
            {erreur && <p className={styles.err}>{erreur}</p>}
            <button type="submit" className={styles.primary} disabled={etat === "envoi"}>
              {etat === "envoi" ? "Un instant…" : mode === "inscription" ? "Créer mon compte gratuit" : "Me connecter"}
            </button>
            {mode === "connexion" && (
              <p className={styles.hint}>Mot de passe oublié ? Écris à {EDITEUR.email}, on le réinitialise pour toi.</p>
            )}
          </form>
        )}
      </div>
      <p className={styles.foot}>
        <Link href="/mentions-legales">Mentions légales</Link> · <Link href="/confidentialite">Confidentialité</Link>
      </p>
    </div>
  );
}
