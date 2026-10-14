import type { Metadata } from "next";
import Link from "next/link";
import { EPISODES, UES } from "@/content/episodes";
import { PROGRAMME, type Notion } from "@/content/programme";
import styles from "@/components/coach.module.css";

// Tableau de suivi de production (non lié depuis l'appli) : couverture du programme « zéro impasse ».
export const metadata: Metadata = { title: "Production · Memoson", robots: { index: false, follow: false } };

const FREQ = { forte: "Tombe souvent", moyenne: "Tombe parfois", rare: "Tombe rarement" } as const;

function etat(no: Notion) {
  const eps = (no.episodes?.length ? no.episodes : [no.id]).map((id) => EPISODES.find((e) => e.id === id)).filter(Boolean);
  if (eps.some((e) => e!.status === "live")) return { code: "live" as const, ep: eps.find((e) => e!.status === "live")! };
  if (eps.some((e) => e!.status === "ecrit")) return { code: "ecrit" as const, ep: eps[0]! };
  return { code: "soon" as const, ep: null };
}

export default function Production() {
  const toutes = Object.values(PROGRAMME).flat() as Notion[];
  const nb = (c: string) => toutes.filter((no) => etat(no).code === c).length;
  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <span className="label">Suivi de production</span>
        <h1>Programme zéro impasse</h1>
        <p className={styles.lead}>
          {toutes.length} notions au programme (UE1, UE2, UE4, UE5) · {nb("live")} en ligne · {nb("ecrit")} écrites, voix à générer · {nb("soon")} à écrire.
          L&apos;UE3 sera ajoutée avec les nouveaux cours.
        </p>
      </header>
      {UES.filter((u) => PROGRAMME[u.id]).map((u) => {
        const notions = PROGRAMME[u.id]!;
        const live = notions.filter((no) => etat(no).code === "live").length;
        const ecrit = notions.filter((no) => etat(no).code === "ecrit").length;
        const parties = [...new Set(notions.map((no) => no.partie))];
        return (
          <section key={u.id} className={styles.block}>
            <div className={styles.blockHead}>
              <h2>{u.short} · {u.name}</h2>
              <span className={styles.meta}>{live + ecrit}/{notions.length} notions traitées</span>
            </div>
            <div className={styles.cov}>
              <div className={styles.covHead}><span>En ligne</span><span>{live}/{notions.length}</span></div>
              <div className={styles.bar}><span style={{ width: `${(live / notions.length) * 100}%` }} /></div>
              <div className={styles.covHead}><span>Écrites (en ligne + voix à générer)</span><span>{live + ecrit}/{notions.length}</span></div>
              <div className={styles.bar}><span style={{ width: `${((live + ecrit) / notions.length) * 100}%` }} /></div>
            </div>
            {parties.map((p) => (
              <div key={p}>
                <span className="label">{p}</span>
                <ul className={styles.items}>
                  {notions.filter((no) => no.partie === p).map((no) => {
                    const st = etat(no);
                    return (
                      <li key={no.id}>
                        <div className={styles.item}>
                          <i className={st.code === "live" ? styles.tagRev : styles.tagNew} style={st.code === "soon" ? { opacity: 0.45 } : undefined}>
                            {st.code === "live" ? "En ligne" : st.code === "ecrit" ? "Écrit" : "À écrire"}
                          </i>
                          <span>{st.code === "live" ? <Link href={`/episode/${st.ep!.id}`}>{no.titre}</Link> : no.titre}</span>
                          <small>{FREQ[no.freq]}{st.ep && !st.ep.reviewedBy ? " · relecture à faire" : ""}</small>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
