"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UES, findEpisode } from "@/content/episodes";
import { MOTS_CLES, carteDe } from "@/content/methode";
import { todayIso, useProgress } from "@/lib/prefs";
import { useParam } from "@/lib/reseau";
import {
  dus, elementsDe, idBloc, idCarte, maitrise, useRappels,
  type ElementRappel, type Note, type Suivi,
} from "@/lib/methode";
import styles from "./methode.module.css";

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const dateCourte = (iso: string) => { const [, m, d] = iso.split("-").map(Number); return `${d} ${MOIS[m - 1]}`; };

function Etat({ s, today }: { s?: Suivi; today: string }) {
  if (!s) return <span className={styles.etat}>Jamais testé</span>;
  if (s.prochain <= today) return <span className={`${styles.etat} ${styles.du}`}>À revoir aujourd&apos;hui</span>;
  if (maitrise(s)) return <span className={`${styles.etat} ${styles.ok}`}>Acquis · revu le {dateCourte(s.prochain)}</span>;
  return <span className={styles.etat}>Prochain rappel le {dateCourte(s.prochain)}</span>;
}

/* ───────────── Exercice de rappel : de tête, puis on révèle, puis on s'évalue ───────────── */

export function Rappel({ el, onNote, fermer }: { el: ElementRappel; onNote: (n: Note) => void; fermer?: () => void }) {
  const [vus, setVus] = useState<Set<number>>(new Set());
  const [indice, setIndice] = useState(false);
  useEffect(() => { setVus(new Set()); setIndice(false); }, [el.id]);
  const tout = vus.size === el.reponses.length;
  const voir = (i: number) => setVus((v) => new Set(v).add(i));

  return (
    <section className={styles.rappel} aria-label={`Rappel : ${el.titre}`}>
      <div className={styles.rappelHead}>
        <span className="label">{el.type === "carte" ? "Niveau 1 · la matière" : el.type === "bloc" ? "Niveau 2 · la partie" : "Niveau 3 · la notion"}</span>
        {fermer && <button className={styles.x} onClick={fermer} aria-label="Fermer">×</button>}
      </div>
      <h3>{el.titre}</h3>
      <p className={styles.consigne}>{el.consigne} Pas besoin du mot pour mot : l&apos;idée suffit.</p>
      {el.indice && (indice
        ? <p className={styles.indice}>{el.indice}</p>
        : <button className={styles.lien} onClick={() => setIndice(true)}>Besoin d&apos;un indice ?</button>)}
      <ol className={styles.reponses}>
        {el.reponses.map((r, i) => (
          <li key={i}>
            {vus.has(i)
              ? <span className={styles.revele}>{r}</span>
              : <button className={styles.cache} onClick={() => voir(i)} aria-label={`Révéler la réponse ${i + 1}`}>Touche pour vérifier</button>}
          </li>
        ))}
      </ol>
      {!tout && <button className={styles.secondaire} onClick={() => setVus(new Set(el.reponses.map((_, i) => i)))}>Tout révéler</button>}
      {tout && (
        <div className={styles.notes}>
          <p>Tu avais retrouvé combien ?</p>
          <div>
            <button onClick={() => onNote("oublie")} className={styles.n0}>Peu</button>
            <button onClick={() => onNote("moitie")} className={styles.n1}>La moitié</button>
            <button onClick={() => onNote("trouve")} className={styles.n2}>Presque tout</button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ───────────── Carte de l'UE ───────────── */

export function CarteUe() {
  const ue = useParam("ue");
  const bParam = useParam("b");
  const [progress] = useProgress();
  const { rappels, noter, pret } = useRappels();
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [exo, setExo] = useState<string | null>(null);
  const [mots, setMots] = useState<Set<string>>(new Set());
  const today = todayIso();
  const carte = useMemo(() => (ue ? carteDe(ue) : null), [ue]);
  const elements = useMemo(() => (ue ? elementsDe(ue) : []), [ue]);
  const nom = UES.find((u) => u.id === ue);

  useEffect(() => {
    if (!bParam) return;
    setOuvert(bParam);
    setTimeout(() => document.getElementById(`bloc-${bParam}`)?.scrollIntoView({ block: "start" }), 50);
  }, [bParam]);

  if (ue === null || !pret) return null;
  if (!carte || !nom) {
    return (
      <div className={styles.wrap}>
        <Link href="/app" className={styles.back}>← Épisodes</Link>
        <h1>Carte bientôt disponible</h1>
        <p className={styles.lead}>La méthode entonnoir arrive d&apos;abord sur l&apos;UE1 du DSCG, puis sur les autres UE.</p>
        <Link className={styles.primaire} href="/app/carte?ue=ue1">Voir la carte de l&apos;UE1</Link>
      </div>
    );
  }

  const elDe = (id: string) => elements.find((e) => e.id === id)!;
  const noterEt = (id: string, n: Note) => { noter(id, n); setExo(null); };
  const acquis = carte.blocs.filter((b) => maitrise(rappels[idBloc(ue, b.id)])).length;
  const motsVus = (id: string) => setMots((m) => { const x = new Set(m); if (x.has(id)) x.delete(id); else x.add(id); return x; });

  return (
    <div className={styles.wrap}>
      <Link href={`/app?ue=${ue}`} className={styles.back}>← Épisodes {nom.short}</Link>

      <header className={styles.head}>
        <span className="label">Méthode entonnoir · {nom.short}</span>
        <h1>{nom.name}</h1>
        <p className={styles.lead}>D&apos;abord la vue d&apos;ensemble, puis une partie, puis chaque notion. À chaque niveau : les titres, puis les mots-clés, puis le contenu.</p>
        <ol className={styles.entonnoir} aria-label="Les trois niveaux">
          <li><b>1</b> La matière</li>
          <li><b>2</b> La partie</li>
          <li><b>3</b> La notion</li>
        </ol>
      </header>

      <section className={styles.bloc1}>
        <div className={styles.rowHead}>
          <h2>Niveau 1 · la vue d&apos;ensemble</h2>
          <Etat s={rappels[idCarte(ue)]} today={today} />
        </div>
        <p className={styles.phrase}>« {carte.phrase} »</p>
        <p className={styles.meta}>Une phrase pour tout retenir : chaque mot ouvre une grande partie. {acquis}/{carte.blocs.length} parties acquises.</p>
        {exo === idCarte(ue)
          ? <Rappel el={elDe(idCarte(ue))} onNote={(n) => noterEt(idCarte(ue), n)} fermer={() => setExo(null)} />
          : <button className={styles.primaire} onClick={() => setExo(idCarte(ue))}>Teste-toi sur la carte</button>}
      </section>

      <section className={styles.blocs}>
        <h2>Niveau 2 · les parties</h2>
        {carte.blocs.map((b) => {
          const open = ouvert === b.id;
          const idb = idBloc(ue, b.id);
          const ecoutes = b.notions.filter((n) => n.episodes?.some((e) => progress[e]?.done)).length;
          return (
            <article key={b.id} id={`bloc-${b.id}`} className={`${styles.partie} ${open ? styles.open : ""}`}>
              <button className={styles.partieHead} aria-expanded={open} onClick={() => setOuvert(open ? null : b.id)}>
                <span className={styles.num}>{b.numero}</span>
                <span className={styles.partieTitre}>
                  <b>{b.titre}</b>
                  <span>{b.notions.length} notions · {ecoutes} écoutée{ecoutes > 1 ? "s" : ""}</span>
                </span>
                <span className={styles.chev} aria-hidden>{open ? "−" : "+"}</span>
              </button>
              {open && (
                <div className={styles.partieCorps}>
                  <p className={styles.resume}>{b.resume}</p>
                  <div className={styles.rowHead}>
                    <Etat s={rappels[idb]} today={today} />
                  </div>
                  {exo === idb
                    ? <Rappel el={elDe(idb)} onNote={(n) => noterEt(idb, n)} fermer={() => setExo(null)} />
                    : <button className={styles.secondaire} onClick={() => setExo(idb)}>Teste-toi sur cette partie</button>}

                  <h3 className={styles.niv3}>Niveau 3 · les notions</h3>
                  {b.parties.map((p) => {
                    const ns = b.notions.filter((n) => n.partie === p);
                    if (!ns.length) return null;
                    return (
                      <div key={p} className={styles.sous}>
                        {b.parties.length > 1 && <span className={styles.sousTitre}>{p}</span>}
                        <ul className={styles.notions}>
                          {ns.map((n) => {
                            const ep = n.episodes?.map(findEpisode).find((e) => e && e.status === "live");
                            const mc = MOTS_CLES[n.id] ?? [];
                            return (
                              <li key={n.id} className={styles.notion}>
                                <div className={styles.notionHead}>
                                  <span className={`${styles.freq} ${styles[n.freq]}`} title={`Fréquence ${n.freq}`} />
                                  <b>{n.titre}</b>
                                  {ep
                                    ? <Link href={`/episode/${ep.id}`} className={styles.ecouter}>{progress[ep.id]?.done ? "Réécouter" : "Écouter"} ›</Link>
                                    : <span className={styles.bientot}>bientôt</span>}
                                </div>
                                {mc.length > 0 && (mots.has(n.id)
                                  ? <div className={styles.chips}>{mc.map((m) => <span key={m}>{m}</span>)}</div>
                                  : <button className={styles.lien} onClick={() => motsVus(n.id)}>Voir les mots-clés</button>)}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </section>

      <p className={styles.meta}>Pas de par cœur : le but est de retrouver les mots-clés et de savoir expliquer ce qu&apos;il y a derrière. Tes rappels reviennent à J+1, J+3, J+7, J+21 puis J+60.</p>
    </div>
  );
}

/* ───────────── File des rappels du jour ───────────── */

export function RappelsDuJour() {
  const [progress] = useProgress();
  const { rappels, noter, pret } = useRappels();
  const today = todayIso();
  // La file est figée à l'ouverture : on avance dedans même si les dates changent en notant
  const [file, setFile] = useState<ElementRappel[] | null>(null);
  const [i, setI] = useState(0);
  const [bilan, setBilan] = useState({ trouve: 0, moitie: 0, oublie: 0 });

  useEffect(() => {
    if (pret && file === null) setFile(dus(rappels, progress, today));
  }, [pret, rappels, progress, today, file]);

  if (!file) return null;
  const fini = i >= file.length;

  return (
    <div className={styles.wrap}>
      <Link href="/app/coach" className={styles.back}>← Coach</Link>
      <header className={styles.head}>
        <span className="label">Rappels du jour</span>
        <h1>{file.length === 0 ? "Rien à revoir aujourd'hui" : fini ? "Rappels terminés" : `${i + 1} sur ${file.length}`}</h1>
        {!fini && file.length > 0 && <div className={styles.progression}><span style={{ width: `${(i / file.length) * 100}%` }} /></div>}
      </header>

      {file.length === 0 && (
        <section className={styles.bloc1}>
          <p>Tes rappels arrivent le lendemain de chaque épisode écouté, ou dès que tu te testes sur une carte d&apos;UE.</p>
          <Link className={styles.primaire} href="/app/carte?ue=ue1">Ouvrir la carte de l&apos;UE1</Link>
        </section>
      )}

      {!fini && file[i] && (
        <>
          <Rappel el={file[i]} onNote={(n) => {
            noter(file[i].id, n);
            setBilan((b) => ({ ...b, [n]: b[n] + 1 }));
            setI((x) => x + 1);
            window.scrollTo({ top: 0 });
          }} />
          {file[i].lien && <Link className={styles.lienBas} href={file[i].lien!}>{file[i].type === "notion" ? "Réécouter l'épisode" : "Ouvrir la carte"} ›</Link>}
        </>
      )}

      {fini && file.length > 0 && (
        <section className={styles.bloc1}>
          <p><b>{bilan.trouve}</b> presque tout · <b>{bilan.moitie}</b> à moitié · <b>{bilan.oublie}</b> à reprendre</p>
          <p className={styles.meta}>Ce que tu as bien retrouvé reviendra plus tard. Le reste revient dès demain.</p>
          <Link className={styles.primaire} href="/app/coach">Retour au Coach</Link>
        </section>
      )}
    </div>
  );
}

/* ───────────── Encarts : Coach et lecteur ───────────── */

export function EncartRappels() {
  const [progress] = useProgress();
  const { rappels, pret } = useRappels();
  if (!pret) return null;
  const n = dus(rappels, progress, todayIso()).length;
  return (
    <section className={styles.encart}>
      <div>
        <b>{n > 0 ? `${n} rappel${n > 1 ? "s" : ""} aujourd'hui` : "Méthode entonnoir"}</b>
        <span>{n > 0 ? "Deux minutes de tête : la carte, les parties, les mots-clés." : "Vue d'ensemble, partie, notion : révise du général au détail."}</span>
      </div>
      <Link href={n > 0 ? "/app/rappels" : "/app/carte?ue=ue1"} className={styles.primaire}>{n > 0 ? "Commencer" : "Voir la carte"}</Link>
    </section>
  );
}

export function PlanMotsCles({ ue, motsCles, bloc, numero, blocId }: { ue: string; motsCles: string[]; bloc: string; numero: number; blocId: string }) {
  if (!motsCles.length) return null;
  return (
    <section className={styles.plan} aria-label="Plan en mots-clés">
      <div className={styles.rowHead}>
        <span className="label">Le plan en mots-clés</span>
        <Link href={`/app/carte?ue=${ue}&b=${blocId}`} className={styles.lien}>Partie {numero} · {bloc} ›</Link>
      </div>
      <div className={styles.chips}>{motsCles.map((m) => <span key={m}>{m}</span>)}</div>
      <p className={styles.meta}>Lis-les avant d&apos;écouter. Après l&apos;épisode, essaie d&apos;expliquer chacun avec tes mots.</p>
    </section>
  );
}
