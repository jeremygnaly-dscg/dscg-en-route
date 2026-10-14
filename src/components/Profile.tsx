"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { envoyerAvis, seDeconnecter, supabase, supprimerCompte, useSession } from "@/lib/compte";
import { EPISODES } from "@/content/episodes";
import { useProgress } from "@/lib/prefs";
import { useTheme, type Theme } from "@/lib/theme";
import styles from "./profile.module.css";

const THEMES: [Theme, string][] = [["system", "Auto"], ["light", "Clair"], ["dark", "Sombre"]];

export function Profile() {
  const [progress] = useProgress();
  const [theme, setTheme] = useTheme();
  const { session } = useSession();
  const [prenom, setPrenom] = useState("");
  const [note, setNote] = useState<number | null>(null);
  const [avis, setAvis] = useState("");
  const [avisEtat, setAvisEtat] = useState<"idle" | "envoi" | "ok" | "ko">("idle");
  const uid = session?.user.id;

  useEffect(() => {
    if (!uid) return;
    void supabase.from("profils").select("prenom").eq("id", uid).maybeSingle().then(({ data }) => setPrenom(data?.prenom ?? ""));
  }, [uid]);

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avis.trim()) return;
    setAvisEtat("envoi");
    const ok = await envoyerAvis(note, avis.trim(), "profil");
    setAvisEtat(ok ? "ok" : "ko");
    if (ok) { setAvis(""); setNote(null); }
  };

  const supprimer = async () => {
    if (!window.confirm("Supprimer définitivement ton compte et ta progression ? Cette action est irréversible.")) return;
    if (await supprimerCompte()) window.location.replace("/");
    else window.alert("La suppression n'a pas abouti. Réessaie ou écris-nous.");
  };
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
        <b>{prenom || "Ton profil"}</b>
        <span>{session?.user.email} · bêta-testeur</span>
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
        <h2>Ton avis sur la bêta</h2>
        <p>Un épisode qui t&apos;a aidé, une erreur dans un cours, une notion qui manque : tout nous sert.</p>
        {avisEtat === "ok" ? (
          <p className={styles.merci}>Merci ! Ton avis est bien arrivé.</p>
        ) : (
          <form onSubmit={envoyer} className={styles.avis}>
            <div className={styles.seg} role="group" aria-label="Note">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} aria-pressed={note === n} onClick={() => setNote(n)}>{n} ★</button>
              ))}
            </div>
            <textarea rows={4} maxLength={2000} value={avis} onChange={(e) => setAvis(e.target.value)}
              placeholder="Ce qui marche, ce qui coince, ce qui manque…" aria-label="Ton avis" />
            {avisEtat === "ko" && <p className={styles.hint}>L&apos;envoi n&apos;a pas marché. Vérifie ta connexion.</p>}
            <button type="submit" className={styles.btn} disabled={avisEtat === "envoi" || !avis.trim()}>
              {avisEtat === "envoi" ? "Envoi…" : "Envoyer mon avis"}
            </button>
          </form>
        )}
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

      <section className={styles.block}>
        <h2>Ton compte</h2>
        <p className={styles.hint}>Ta progression et ton plan du Coach sont sauvegardés dans ton compte : tu les retrouves sur tous tes appareils.</p>
        <div className={styles.compte}>
          <button className={styles.btnGhost} onClick={async () => { await seDeconnecter(); window.location.replace("/"); }}>Me déconnecter</button>
          <button className={styles.btnDanger} onClick={supprimer}>Supprimer mon compte</button>
        </div>
      </section>

      <p className={styles.legal}>
        Accès gratuit pendant la bêta.{" "}
        <Link href="/confidentialite">Confidentialité</Link> · <Link href="/mentions-legales">Mentions légales</Link>
      </p>
    </div>
  );
}
