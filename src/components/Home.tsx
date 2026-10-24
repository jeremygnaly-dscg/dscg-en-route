"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DIPLOMES, UES, diplomeDe, episodesOf, findEpisode, uesDe } from "@/content/episodes";
import { useDiplome } from "@/lib/diplome";
import { useProgress, useQuizAttente } from "@/lib/prefs";
import { Installer } from "./Installer";
import { arborescence } from "@/content/methode";
import type { Episode } from "@/content/types";
import { aAcces, estGratuit, useAbonnements, venteActive } from "@/lib/vente";
import styles from "./home.module.css";

export function Home() {
  const [diplome, setDiplome] = useDiplome();
  const [ue, setUe] = useState("ue1");
  const [progress] = useProgress();
  const [attente] = useQuizAttente();
  const { abos } = useAbonnements();
  const quizAFaire = attente.map(findEpisode).filter((e) => e && e.status === "live" && !progress[e.id]?.done);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("ue");
    if (q && UES.some((u) => u.id === q && u.available)) { setUe(q); if (diplomeDe(q) !== diplome) setDiplome(diplomeDe(q)); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Changement de diplôme : on affiche sa première UE
  useEffect(() => {
    if (diplomeDe(ue) !== diplome) setUe(uesDe(diplome)[0].id);
  }, [diplome]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = UES.find((u) => u.id === ue)!;
  const list = [...episodesOf(ue)].sort((a, b) => (a.status === b.status ? 0 : a.status === "live" ? -1 : 1));
  const live = list.filter((e) => e.status === "live");
  const doneCount = live.filter((e) => progress[e.id]?.done).length;

  const [ouverts, setOuverts] = useState<Set<string>>(new Set());
  useEffect(() => {
    try { setOuverts(new Set(JSON.parse(localStorage.getItem(`zenvise-arbre-${ue}`) ?? "[]"))); } catch { setOuverts(new Set()); }
  }, [ue]);
  const basculer = (id: string) => setOuverts((o) => {
    const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id);
    try { localStorage.setItem(`zenvise-arbre-${ue}`, JSON.stringify([...n])); } catch { /* stockage indisponible */ }
    return n;
  });
  const arbre = useMemo(() => arborescence(ue), [ue]);

  const ligne = (e: Episode) => {
    if (e.status !== "live") {
      return (
        <div key={e.id} className={`${styles.ep} ${styles.locked}`}>
          <span className={styles.n}>·</span>
          <span className={styles.t}><b>{e.title}</b><span>{e.cas2027 && <em className={styles.z27}>Format 2027</em>}{e.ref}</span></span>
          <span className={styles.pill}>bientôt</span>
        </div>
      );
    }
    return (
      <Link key={e.id} href={e.ue === ue ? `/episode/${e.id}` : `/episode/${e.id}?ue=${ue}`} className={styles.ep}>
        <span className={styles.n}>{progress[e.id]?.done ? "✓" : "▶"}</span>
        <span className={styles.t}><b>{e.title}</b><span>{e.cas2027 && <em className={styles.z27}>Format 2027</em>}{e.ref}</span></span>
        {!aAcces(e, abos)
          ? <span className={styles.pill}>🔒 Abonnés</span>
          : progress[e.id]?.done
          ? <span className={`${styles.pill} ${styles.done}`}>Écouté · {progress[e.id]?.score}/3</span>
          : <span className={`${styles.pill} ${styles.free}`}>{venteActive() && estGratuit(e) ? "Gratuit · " : ""}{e.minutes} min</span>}
      </Link>
    );
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.brand}>
        <h1>Zen<span>vise</span></h1>
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

      <div className={styles.diplomes} role="group" aria-label="Diplôme">
        {DIPLOMES.map((d) => (
          <button key={d.id} aria-pressed={diplome === d.id} onClick={() => setDiplome(d.id)}>{d.nom}</button>
        ))}
      </div>

      <div className={styles.ues} role="group" aria-label="Unités d'enseignement">
        {uesDe(diplome).map((u) => (
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
        <p className={styles.sub}>Choisis la partie du programme sur laquelle tu veux t&apos;entraîner. Programme de la session 2027.</p>

        {arbre ? (
          <div className={styles.arbre}>
            {arbre.map((b) => {
              const open = ouverts.has(b.id);
              const enLigne = b.episodes.filter((x) => x.e.status === "live");
              const faits = enLigne.filter((x) => progress[x.e.id]?.done).length;
              return (
                <div key={b.id} className={`${styles.partie} ${open ? styles.partieOpen : ""}`}>
                  <button className={styles.partieHead} aria-expanded={open} onClick={() => basculer(b.id)}>
                    <span className={styles.partieNum}>{b.numero}</span>
                    <span className={styles.partieTitre}>
                      <b>{b.titre}</b>
                      <span>{enLigne.length > 0 ? `${enLigne.length} épisode${enLigne.length > 1 ? "s" : ""} · ${faits} écouté${faits > 1 ? "s" : ""}` : "Épisodes en préparation"}</span>
                    </span>
                    {enLigne.length > 0 && <span className={styles.partieBar}><span style={{ width: `${Math.round((faits / enLigne.length) * 100)}%` }} /></span>}
                    <span className={styles.chev} aria-hidden>{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className={styles.partieCorps}>
                      {b.resume && <p className={styles.resume}>{b.resume}</p>}
                      {b.groupes.map((g) => (
                        <div key={g.nom} className={styles.groupe}>
                          {b.groupes.length > 1 && <span className={styles.groupeNom}>{g.nom}</span>}
                          <div className={styles.list}>
                            {g.episodes.map(({ e }) => ligne(e))}
                          </div>
                        </div>
                      ))}
                      {b.numero > 0 && <Link href={`/app/carte?ue=${ue}&b=${b.id}`} className={styles.tester}>Me tester sur cette partie ›</Link>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.list}>
            {list.map(ligne)}
          </div>
        )}
      </section>
    </div>
  );
}
