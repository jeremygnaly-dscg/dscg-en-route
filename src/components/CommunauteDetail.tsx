"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { libelleUe } from "@/content/episodes";
import { supabase } from "@/lib/compte";
import { erreurReseau, ilYa, nomDiplome, signaler, useMoi, useParam, type Auteur, type Membre } from "@/lib/reseau";
import { Avatar, Qui } from "./Communaute";
import styles from "./reseau.module.css";

/* ───────────── Une question et ses réponses ───────────── */
interface Q { id: number; ue: string; titre: string; corps: string; nb_utiles: number; meilleure_reponse: number | null; cree_le: string; auteur: string; masque: boolean; membres: Auteur | null }
interface R { id: number; corps: string; nb_utiles: number; cree_le: string; auteur: string; masque: boolean; membres: Auteur | null }

export function QuestionDetail() {
  const id = useParam("id");
  const router = useRouter();
  const { moi } = useMoi();
  const [q, setQ] = useState<Q | null | undefined>(undefined);
  const [reps, setReps] = useState<R[]>([]);
  const [mesUtiles, setMesUtiles] = useState<string[]>([]);
  const [texte, setTexte] = useState("");
  const [err, setErr] = useState("");

  const charger = useCallback(async () => {
    if (!id) return;
    const sel = "membres(pseudo, couleur, diplome)";
    const [{ data: qd }, { data: rd }] = await Promise.all([
      supabase.from("questions").select(`id, ue, titre, corps, nb_utiles, meilleure_reponse, cree_le, auteur, masque, ${sel}`).eq("id", id).maybeSingle(),
      supabase.from("reponses").select(`id, corps, nb_utiles, cree_le, auteur, masque, ${sel}`).eq("question_id", id).order("cree_le"),
    ]);
    setQ((qd as unknown as Q) ?? null);
    setReps((rd as unknown as R[]) ?? []);
    if (moi) {
      const { data: re } = await supabase.from("reactions").select("cible_type, cible_id").eq("auteur", moi.id).in("cible_type", ["question", "reponse"]);
      setMesUtiles((re ?? []).map((x: { cible_type: string; cible_id: string }) => `${x.cible_type}:${x.cible_id}`));
    }
  }, [id, moi]);
  useEffect(() => { void charger(); }, [charger]);

  const utile = async (type: "question" | "reponse", cid: number) => {
    if (!moi) return;
    const cle = `${type}:${cid}`;
    if (mesUtiles.includes(cle)) await supabase.from("reactions").delete().match({ cible_type: type, cible_id: String(cid), auteur: moi.id });
    else await supabase.from("reactions").insert({ cible_type: type, cible_id: String(cid) });
    await charger();
  };
  const repondre = async () => {
    setErr("");
    const { error } = await supabase.from("reponses").insert({ question_id: Number(id), corps: texte.trim() });
    if (error) setErr(erreurReseau(error)); else { setTexte(""); await charger(); }
  };
  const choisir = async (rid: number | null) => { await supabase.from("questions").update({ meilleure_reponse: rid }).eq("id", id!); await charger(); };
  const supprimer = async (table: "questions" | "reponses", cid: number) => {
    if (!window.confirm("Supprimer définitivement ?")) return;
    await supabase.from(table).delete().eq("id", cid);
    if (table === "questions") router.push("/app/communaute"); else await charger();
  };

  if (q === undefined) return null;
  if (q === null) return <div className={styles.wrap}><Link href="/app/communaute" className={styles.retour}>← Communauté</Link><p className={styles.vide}>Cette question n&apos;existe plus.</p></div>;
  const auteurQ = moi?.id === q.auteur;
  const tri = [...reps].sort((a, b) => (b.id === q.meilleure_reponse ? 1 : 0) - (a.id === q.meilleure_reponse ? 1 : 0) || b.nb_utiles - a.nb_utiles);

  return (
    <div className={styles.wrap}>
      <Link href="/app/communaute?t=entraide" className={styles.retour}>← Entraide</Link>
      <article className={styles.carte}>
        <Qui m={q.membres} id={q.auteur} sous={`${libelleUe(q.ue)} · ${ilYa(q.cree_le)}`} />
        <h1 style={{ fontSize: 22 }}>{q.titre}</h1>
        {q.corps && <p style={{ whiteSpace: "pre-wrap" }}>{q.corps}</p>}
        <div className={styles.actionsLigne}>
          <button className={styles.utile} aria-pressed={mesUtiles.includes(`question:${q.id}`)} onClick={() => utile("question", q.id)}>👍 Utile · {q.nb_utiles}</button>
          {auteurQ ? <button className={styles.lien} onClick={() => supprimer("questions", q.id)}>Supprimer</button>
            : <button className={styles.lien} onClick={() => signaler("question", q.id)}>Signaler</button>}
        </div>
      </article>

      <h2 style={{ fontSize: 18 }}>{reps.length} réponse{reps.length > 1 ? "s" : ""}</h2>
      {tri.map((r) => (
        <div key={r.id} className={`${styles.carte} ${r.id === q.meilleure_reponse ? styles.meilleure : ""} ${r.masque ? styles.masque : ""}`}>
          <Qui m={r.membres} id={r.auteur} sous={ilYa(r.cree_le)} />
          {r.id === q.meilleure_reponse && <span className={styles.resolue} style={{ fontWeight: 800, fontSize: 13 }}>✓ Meilleure réponse</span>}
          <p style={{ whiteSpace: "pre-wrap" }}>{r.corps}</p>
          <div className={styles.actionsLigne}>
            <button className={styles.utile} aria-pressed={mesUtiles.includes(`reponse:${r.id}`)} onClick={() => utile("reponse", r.id)}>👍 {r.nb_utiles}</button>
            {auteurQ && <button className={styles.lien} onClick={() => choisir(r.id === q.meilleure_reponse ? null : r.id)}>{r.id === q.meilleure_reponse ? "Retirer « meilleure »" : "Meilleure réponse"}</button>}
            {moi?.id === r.auteur ? <button className={styles.lien} onClick={() => supprimer("reponses", r.id)}>Supprimer</button>
              : <button className={styles.lien} onClick={() => signaler("reponse", r.id)}>Signaler</button>}
          </div>
        </div>
      ))}

      {moi ? (
        <div className={`${styles.carte} ${styles.form}`}>
          <textarea rows={3} maxLength={3000} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Ta réponse : la règle, le texte, un exemple…" />
          {err && <p className={styles.erreur}>{err}</p>}
          <button className={styles.btn} disabled={!texte.trim() || !moi} onClick={repondre}>Répondre</button>
        </div>
      ) : <Link href="/app/communaute" className={styles.btn}>Crée ton profil pour répondre</Link>}
    </div>
  );
}

/* ───────────── Profil d'un membre ───────────── */
export function MembreDetail() {
  const id = useParam("id");
  const router = useRouter();
  const { moi } = useMoi();
  const [m, setM] = useState<Membre | null | undefined>(undefined);
  const [suivi, setSuivi] = useState(false);
  const [bloque, setBloque] = useState(false);
  const [nb, setNb] = useState({ abonnes: 0, questions: 0 });
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const [{ data }, { count: abonnes }, { count: questions }] = await Promise.all([
        supabase.from("membres").select("*").eq("id", id).maybeSingle(),
        supabase.from("suivis").select("suiveur", { count: "exact", head: true }).eq("suivi", id),
        supabase.from("questions").select("id", { count: "exact", head: true }).eq("auteur", id),
      ]);
      setM((data as Membre) ?? null);
      setNb({ abonnes: abonnes ?? 0, questions: questions ?? 0 });
    })();
  }, [id]);
  useEffect(() => {
    if (!id || !moi) return;
    void supabase.from("suivis").select("suivi").eq("suiveur", moi.id).eq("suivi", id).then(({ data }) => setSuivi(!!data?.length));
    void supabase.from("blocages").select("bloque").eq("bloque", id).then(({ data }) => setBloque(!!data?.length));
  }, [id, moi]);

  if (m === undefined) return null;
  if (m === null) return <div className={styles.wrap}><Link href="/app/communaute?t=membres" className={styles.retour}>← Membres</Link><p className={styles.vide}>Ce profil n&apos;existe plus.</p></div>;
  const soi = moi?.id === m.id;

  const suivre = async () => {
    if (!moi) return;
    if (suivi) await supabase.from("suivis").delete().eq("suiveur", moi.id).eq("suivi", m.id);
    else await supabase.from("suivis").insert({ suivi: m.id });
    setSuivi(!suivi); setNb((n) => ({ ...n, abonnes: n.abonnes + (suivi ? -1 : 1) }));
  };
  const ecrire = async () => {
    setErr("");
    const { data, error } = await supabase.rpc("ouvrir_conversation", { autre: m.id });
    if (error) setErr(erreurReseau(error)); else router.push(`/app/communaute/messages?c=${data}`);
  };
  const basculerBlocage = async () => {
    if (!bloque && !window.confirm(`Bloquer ${m.pseudo} ? Vous ne pourrez plus vous écrire et tu ne verras plus ses questions.`)) return;
    if (bloque) await supabase.from("blocages").delete().eq("bloque", m.id); else await supabase.from("blocages").insert({ bloque: m.id });
    setBloque(!bloque);
  };

  return (
    <div className={styles.wrap}>
      <Link href="/app/communaute?t=membres" className={styles.retour}>← Membres</Link>
      <div className={`${styles.carte} ${styles.profil}`}>
        <Avatar m={m} grand />
        <h1>{m.pseudo}</h1>
        <p>{[m.prenom, nomDiplome(m.diplome), m.situation, m.ecole].filter(Boolean).join(" · ")}</p>
        {m.ues.length > 0 && <p>Prépare : {m.ues.map((u) => libelleUe(u)).join(", ")}</p>}
        {m.bio && <p style={{ color: "var(--fg)" }}>{m.bio}</p>}
        <p><b style={{ color: "var(--fg)" }}>{nb.abonnes}</b> abonné{nb.abonnes > 1 ? "s" : ""} · <b style={{ color: "var(--fg)" }}>{nb.questions}</b> question{nb.questions > 1 ? "s" : ""} · actif {ilYa(m.vu_le ?? new Date().toISOString())}</p>
        {!soi && moi && (
          <div className={styles.actionsLigne} style={{ justifyContent: "center" }}>
            <button className={styles.ghost} aria-pressed={suivi} onClick={suivre}>{suivi ? "Suivi" : "Suivre"}</button>
            {m.messages_ouverts && !bloque && <button className={styles.btn} onClick={ecrire}>Envoyer un message</button>}
          </div>
        )}
        {err && <p className={styles.erreur}>{err}</p>}
        {!soi && moi && (
          <div className={styles.actionsLigne} style={{ justifyContent: "center" }}>
            <button className={styles.lien} onClick={basculerBlocage}>{bloque ? "Débloquer" : "Bloquer"}</button>
            <button className={styles.lien} onClick={() => signaler("membre", m.id)}>Signaler ce profil</button>
          </div>
        )}
        {soi && <Link href="/app/communaute" className={styles.ghost}>Modifier mon profil</Link>}
      </div>
    </div>
  );
}

/* ───────────── Conversation privée ───────────── */
interface Msg { id: number; auteur: string; corps: string; cree_le: string; lu_le: string | null; masque: boolean }

export function Conversation() {
  const c = useParam("c");
  const { moi } = useMoi();
  const [autre, setAutre] = useState<Pick<Membre, "id" | "pseudo" | "couleur" | "diplome"> | null>(null);
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const [texte, setTexte] = useState("");
  const [err, setErr] = useState("");
  const bas = useRef<HTMLDivElement>(null);

  const charger = useCallback(async () => {
    if (!c) return;
    const { data } = await supabase.from("messages").select("id, auteur, corps, cree_le, lu_le, masque").eq("conversation_id", c).order("cree_le").limit(300);
    setMsgs((data as Msg[]) ?? []);
    await supabase.rpc("marquer_lu", { conv: Number(c) });
    window.dispatchEvent(new Event("zenvise-lu"));
  }, [c]);

  useEffect(() => {
    if (!c || !moi) return;
    void (async () => {
      const { data: conv } = await supabase.from("conversations").select("a, b").eq("id", c).maybeSingle();
      if (!conv) { setMsgs([]); return; }
      const autreId = conv.a === moi.id ? conv.b : conv.a;
      const { data: m } = await supabase.from("membres").select("id, pseudo, couleur, diplome").eq("id", autreId).maybeSingle();
      setAutre(m as Membre);
    })();
    void charger();
    const canal = supabase.channel(`conv-${c}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${c}` }, () => void charger())
      .subscribe();
    return () => { void supabase.removeChannel(canal); };
  }, [c, moi, charger]);

  useEffect(() => { bas.current?.scrollIntoView({ block: "end" }); }, [msgs?.length]);

  const envoyer = async () => {
    const corps = texte.trim();
    if (!corps) return;
    setErr(""); setTexte("");
    const { error } = await supabase.from("messages").insert({ conversation_id: Number(c), corps });
    if (error) { setErr(erreurReseau(error)); setTexte(corps); } else await charger();
  };

  if (!moi) return null;
  return (
    <div className={styles.wrap}>
      <div className={styles.top} style={{ alignItems: "center" }}>
        <Link href="/app/communaute?t=messages" className={styles.retour}>←</Link>
        {autre ? <Qui m={autre} id={autre.id} sous={nomDiplome(autre.diplome)} /> : <span />}
        <span style={{ marginLeft: "auto" }} />
      </div>
      <div className={styles.fil}>
        {msgs?.length === 0 && <p className={styles.vide}>Dis bonjour ! Restez bienveillants : les messages peuvent être signalés.</p>}
        {msgs?.map((m) => {
          const mien = m.auteur === moi.id;
          return (
            <div key={m.id} className={mien ? `${styles.bulle} ${styles.bulleMoi}` : styles.bulle}>
              {m.masque ? <i>Message masqué après signalement</i> : m.corps}
              <small>
                {ilYa(m.cree_le)}{mien && m.lu_le ? " · lu" : ""}
                {!mien && !m.masque && <> · <button className={styles.lien} style={{ fontSize: 11 }} onClick={async () => { if (await signaler("message", m.id)) void charger(); }}>signaler</button></>}
              </small>
            </div>
          );
        })}
        {err && <p className={styles.erreur}>{err}</p>}
        <div ref={bas} />
      </div>
      <div className={styles.saisie}>
        <textarea rows={1} maxLength={2000} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Message"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void envoyer(); } }} />
        <button onClick={envoyer} aria-label="Envoyer" disabled={!texte.trim()}>➤</button>
      </div>
    </div>
  );
}
