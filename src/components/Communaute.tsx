"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { libelleUe, uesDe } from "@/content/episodes";
import { supabase } from "@/lib/compte";
import { useDiplome } from "@/lib/diplome";
import {
  COULEURS, DIPLOMES_RESEAU, erreurReseau, ilYa, nomDiplome, useMoi, useNonLus, useParam,
  type Auteur, type Membre,
} from "@/lib/reseau";
import styles from "./reseau.module.css";

export function Avatar({ m, grand }: { m?: Pick<Membre, "pseudo" | "couleur"> | null; grand?: boolean }) {
  return (
    <span className={grand ? `${styles.avatar} ${styles.avatarG}` : styles.avatar} style={{ background: COULEURS[m?.couleur ?? 0] }} aria-hidden="true">
      {m?.pseudo?.slice(0, 1) ?? "?"}
    </span>
  );
}

export function Qui({ m, id, sous }: { m?: Auteur | null; id?: string; sous?: string }) {
  const contenu = (
    <>
      <Avatar m={m} />
      <span>
        <b>{m?.pseudo ?? "Membre"}{m?.diplome && <i className={styles.dip}>{nomDiplome(m.diplome)}</i>}</b>
        {sous && <small>{sous}</small>}
      </span>
    </>
  );
  return id ? <Link href={`/app/communaute/membre?id=${id}`} className={styles.qui}>{contenu}</Link> : <span className={styles.qui}>{contenu}</span>;
}

const ONGLETS = [
  { id: "entraide", nom: "Entraide" },
  { id: "defis", nom: "Défis" },
  { id: "membres", nom: "Membres" },
  { id: "messages", nom: "Messages" },
] as const;
type Onglet = (typeof ONGLETS)[number]["id"];

export function Communaute() {
  const { moi, charge, recharger } = useMoi();
  const t = useParam("t");
  const [onglet, setOnglet] = useState<Onglet>("entraide");
  const [edition, setEdition] = useState(false);
  const [pouls, setPouls] = useState<{ membres: number; actifs_semaine: number } | null>(null);
  const nonLus = useNonLus();

  useEffect(() => { if (t && ONGLETS.some((o) => o.id === t)) setOnglet(t as Onglet); }, [t]);
  useEffect(() => {
    void supabase.rpc("pouls_reseau").then(({ data }) => { if (Array.isArray(data) && data[0]) setPouls(data[0]); });
  }, []);
  const changer = (o: Onglet) => { setOnglet(o); window.history.replaceState(null, "", `?t=${o}`); };

  if (!charge) return null;
  if (!moi || edition) {
    return (
      <div className={styles.wrap}>
        <div className={styles.top}><h1>{moi ? "Mon profil" : "Communauté"}</h1></div>
        {!moi && (
          <div className={styles.carte}>
            <h2>Rejoins les étudiants DCG et DSCG</h2>
            <p>Pose tes questions par UE, aide les autres, compare tes scores chaque semaine et échange avec ceux qui préparent les mêmes épreuves que toi.</p>
          </div>
        )}
        <ProfilForm moi={moi} onFini={() => { setEdition(false); void recharger(); }} onAnnuler={moi ? () => setEdition(false) : undefined} />
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <h1>Communauté</h1>
        {pouls && <span className={styles.pouls}><b>{pouls.membres}</b> membres<br /><b>{pouls.actifs_semaine}</b> actifs cette semaine</span>}
      </div>
      <Link href={`/app/communaute/membre?id=${moi.id}`} className={styles.carte} style={{ flexDirection: "row", alignItems: "center" }}>
        <Qui m={moi} sous={[moi.situation, moi.ecole].filter(Boolean).join(" · ") || "Voir mon profil public"} />
        <span style={{ marginLeft: "auto" }} className={styles.lien} onClick={(e) => { e.preventDefault(); setEdition(true); }}>Modifier</span>
      </Link>

      <div className={styles.onglets} role="tablist">
        {ONGLETS.map((o) => (
          <button key={o.id} role="tab" aria-selected={onglet === o.id} onClick={() => changer(o.id)}>
            {o.nom}{o.id === "messages" && nonLus > 0 && <span className={styles.pastille}>{nonLus}</span>}
          </button>
        ))}
      </div>

      {onglet === "entraide" && <Entraide moi={moi} />}
      {onglet === "defis" && <Defis moi={moi} />}
      {onglet === "membres" && <Membres moi={moi} />}
      {onglet === "messages" && <Messages />}
    </div>
  );
}

/* ───────────── Profil ───────────── */
const SITUATIONS = ["Formation initiale", "Alternance", "Candidat libre", "En poste"];

function ProfilForm({ moi, onFini, onAnnuler }: { moi: Membre | null; onFini: () => void; onAnnuler?: () => void }) {
  const [dipApp] = useDiplome();
  const [f, setF] = useState({
    pseudo: moi?.pseudo ?? "", prenom: moi?.prenom ?? "", diplome: moi?.diplome ?? dipApp, ues: moi?.ues ?? [],
    situation: moi?.situation ?? "", ecole: moi?.ecole ?? "", bio: moi?.bio ?? "", couleur: moi?.couleur ?? Math.floor(Math.random() * 8),
    messages_ouverts: moi?.messages_ouverts ?? true,
  });
  const [accord, setAccord] = useState(!!moi);
  const [err, setErr] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const ues = f.diplome === "dcg" || f.diplome === "dscg" ? uesDe(f.diplome) : [];
  const pseudoOk = /^[A-Za-z0-9_.-]{3,20}$/.test(f.pseudo);

  const enregistrer = async () => {
    setEnvoi(true); setErr("");
    const { data: s } = await supabase.auth.getSession();
    const ligne = { ...f, id: s.session?.user.id, ues: f.ues.filter((u) => ues.some((x) => x.id === u)), prenom: f.prenom || null, situation: f.situation || null, ecole: f.ecole || null, bio: f.bio || null };
    const { error } = moi ? await supabase.from("membres").update(ligne).eq("id", moi.id) : await supabase.from("membres").insert(ligne);
    setEnvoi(false);
    if (error) setErr(erreurReseau(error)); else onFini();
  };

  return (
    <div className={`${styles.carte} ${styles.form}`}>
      <label>Pseudo (visible par les membres)
        <input value={f.pseudo} maxLength={20} autoCapitalize="off" onChange={(e) => setF({ ...f, pseudo: e.target.value.replace(/\s/g, "") })} placeholder="ex. sam_dscg" />
      </label>
      {f.pseudo && !pseudoOk && <p className={styles.erreur}>3 à 20 caractères : lettres, chiffres, point, tiret ou _</p>}
      <label>Prénom (facultatif)<input value={f.prenom} maxLength={40} onChange={(e) => setF({ ...f, prenom: e.target.value })} /></label>
      <label>Diplôme préparé
        <select value={f.diplome} onChange={(e) => setF({ ...f, diplome: e.target.value as Membre["diplome"], ues: [] })}>
          {DIPLOMES_RESEAU.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
        </select>
      </label>
      {ues.length > 0 && (
        <label>UE que tu prépares en ce moment
          <span className={styles.chips} style={{ margin: 0, padding: 0, flexWrap: "wrap" }}>
            {ues.map((u) => (
              <button type="button" key={u.id} aria-pressed={f.ues.includes(u.id)}
                onClick={() => setF({ ...f, ues: f.ues.includes(u.id) ? f.ues.filter((x) => x !== u.id) : [...f.ues, u.id] })}>{u.short}</button>
            ))}
          </span>
        </label>
      )}
      <label>Situation
        <select value={f.situation} onChange={(e) => setF({ ...f, situation: e.target.value })}>
          <option value="">Non précisé</option>
          {SITUATIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label>École ou organisme (facultatif)<input value={f.ecole} maxLength={80} onChange={(e) => setF({ ...f, ecole: e.target.value })} placeholder="ex. INTEC, IAE, CNAM…" /></label>
      <label>En quelques mots (facultatif)<textarea rows={2} maxLength={280} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></label>
      <label>Couleur
        <span className={styles.couleurs}>
          {COULEURS.map((c, i) => <button type="button" key={c} aria-label={`Couleur ${i + 1}`} aria-pressed={f.couleur === i} style={{ background: c }} onClick={() => setF({ ...f, couleur: i })} />)}
        </span>
      </label>
      <label className={styles.coche}><input type="checkbox" checked={f.messages_ouverts} onChange={(e) => setF({ ...f, messages_ouverts: e.target.checked })} />Les membres peuvent m&apos;envoyer des messages privés</label>
      {!moi && <label className={styles.coche}><input type="checkbox" checked={accord} onChange={(e) => setAccord(e.target.checked)} />J&apos;accepte les <Link href="/communaute-regles" target="_blank">règles de la communauté</Link> : respect, entraide, pas de contenu illicite ni de sujets protégés.</label>}
      {err && <p className={styles.erreur}>{err}</p>}
      <div className={styles.actionsLigne}>
        <button className={styles.btn} disabled={!pseudoOk || !accord || envoi} onClick={enregistrer}>{moi ? "Enregistrer" : "Rejoindre la communauté"}</button>
        {onAnnuler && <button className={styles.ghost} onClick={onAnnuler}>Annuler</button>}
      </div>
    </div>
  );
}

/* ───────────── Entraide ───────────── */
interface Question { id: number; ue: string; titre: string; corps: string; nb_reponses: number; nb_utiles: number; meilleure_reponse: number | null; cree_le: string; auteur: string; masque: boolean; membres: Auteur | null }

function useBloques() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => { void supabase.from("blocages").select("bloque").then(({ data }) => setIds((data ?? []).map((x: { bloque: string }) => x.bloque))); }, []);
  return ids;
}

function Entraide({ moi }: { moi: Membre }) {
  const dip = moi.diplome === "dcg" || moi.diplome === "dscg" ? moi.diplome : "dscg";
  const ues = uesDe(dip);
  const [ue, setUe] = useState<string>("toutes");
  const [liste, setListe] = useState<Question[] | null>(null);
  const [form, setForm] = useState(false);
  const bloques = useBloques();

  const charger = useCallback(async () => {
    let q = supabase.from("questions").select("id, ue, titre, corps, nb_reponses, nb_utiles, meilleure_reponse, cree_le, auteur, masque, membres(pseudo, couleur, diplome)")
      .order("cree_le", { ascending: false }).limit(50);
    q = ue === "toutes" ? q.in("ue", ues.map((u) => u.id)) : ue === "sans" ? q.in("ue", ues.map((u) => u.id)).eq("nb_reponses", 0) : q.eq("ue", ue);
    const { data } = await q;
    setListe((data as unknown as Question[]) ?? []);
  }, [ue, dip]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { void charger(); }, [charger]);

  return (
    <>
      <div className={styles.chips}>
        {[["toutes", "Toutes"], ["sans", "Sans réponse"], ...ues.map((u) => [u.id, u.short])].map(([v, l]) => (
          <button key={v} aria-pressed={ue === v} onClick={() => setUe(v)}>{l}</button>
        ))}
      </div>
      {form ? <NouvelleQuestion ues={ues} ueDefaut={ue.startsWith("ue") || ue.startsWith("dcg") ? ue : moi.ues[0] ?? ues[0].id} onFini={() => { setForm(false); void charger(); }} onAnnuler={() => setForm(false)} />
        : <button className={`${styles.btn} ${styles.btnPlein}`} onClick={() => setForm(true)}>Poser une question</button>}
      {liste === null ? null : liste.length === 0 ? <p className={styles.vide}>Aucune question ici pour l&apos;instant. Lance la discussion !</p>
        : liste.filter((q) => !bloques.includes(q.auteur)).map((q) => (
          <Link key={q.id} href={`/app/communaute/question?id=${q.id}`} className={`${styles.carte} ${q.masque ? styles.masque : ""}`}>
            <Qui m={q.membres} sous={`${libelleUe(q.ue)} · ${ilYa(q.cree_le)}`} />
            <h3>{q.titre}</h3>
            {q.corps && <p className={styles.extrait}>{q.corps}</p>}
            <div className={styles.pied}>
              <span>💬 {q.nb_reponses} réponse{q.nb_reponses > 1 ? "s" : ""}</span>
              <span>👍 {q.nb_utiles}</span>
              {q.meilleure_reponse && <span className={styles.resolue}>✓ Résolue</span>}
              {q.masque && <span>Masquée après signalements</span>}
            </div>
          </Link>
        ))}
    </>
  );
}

function NouvelleQuestion({ ues, ueDefaut, onFini, onAnnuler }: { ues: { id: string; short: string; name: string }[]; ueDefaut: string; onFini: () => void; onAnnuler: () => void }) {
  const [ue, setUe] = useState(ueDefaut);
  const [titre, setTitre] = useState("");
  const [corps, setCorps] = useState("");
  const [err, setErr] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const envoyer = async () => {
    setEnvoi(true); setErr("");
    const { error } = await supabase.from("questions").insert({ ue, titre: titre.trim(), corps: corps.trim() });
    setEnvoi(false);
    if (error) setErr(erreurReseau(error)); else onFini();
  };
  return (
    <div className={`${styles.carte} ${styles.form}`}>
      <label>UE<select value={ue} onChange={(e) => setUe(e.target.value)}>{ues.map((u) => <option key={u.id} value={u.id}>{u.short} · {u.name}</option>)}</select></label>
      <label>Ta question<input value={titre} maxLength={140} onChange={(e) => setTitre(e.target.value)} placeholder="ex. Comment traiter le mali technique ?" /></label>
      <label>Détails (facultatif)<textarea rows={4} maxLength={3000} value={corps} onChange={(e) => setCorps(e.target.value)} placeholder="Ce que tu as compris, là où tu bloques, l'énoncé du cas…" /></label>
      <p className={styles.regles}>Pas de copie de sujets ou de corrigés payants. <Link href="/communaute-regles">Règles</Link></p>
      {err && <p className={styles.erreur}>{err}</p>}
      <div className={styles.actionsLigne}>
        <button className={styles.btn} disabled={titre.trim().length < 8 || envoi} onClick={envoyer}>Publier</button>
        <button className={styles.ghost} onClick={onAnnuler}>Annuler</button>
      </div>
    </div>
  );
}

/* ───────────── Défis ───────────── */
interface Rang { membre: string; pseudo: string; couleur: number; diplome: string; points: number; rang: number }

function Defis({ moi }: { moi: Membre }) {
  const [stats, setStats] = useState<{ points_jour: number; points_semaine: number; serie: number } | null>(null);
  const [portee, setPortee] = useState<"diplome" | "amis">("diplome");
  const [rangs, setRangs] = useState<Rang[] | null>(null);
  useEffect(() => { void supabase.rpc("mes_points").then(({ data }) => setStats((data as typeof stats[])?.[0] ?? null)); }, []);
  useEffect(() => {
    setRangs(null);
    void supabase.rpc("classement", { p_diplome: portee === "diplome" ? moi.diplome : null, p_suivis: portee === "amis" })
      .then(({ data }) => setRangs((data as Rang[]) ?? []));
  }, [portee, moi.diplome]);

  return (
    <>
      <div className={styles.score}>
        <div><b>{stats?.points_semaine ?? 0}</b><span>points cette semaine</span></div>
        <div><b>{stats?.points_jour ?? 0}</b><span>aujourd&apos;hui</span></div>
        <div><b>{stats?.serie ?? 0}🔥</b><span>jours d&apos;affilée</span></div>
      </div>
      <p className={styles.regles}>Chaque quiz terminé rapporte 10 points, plus 5 par bonne réponse. Le classement repart à zéro chaque lundi.</p>
      <div className={styles.actionsLigne}>
        <Link href="/app" className={styles.btn}>Faire un épisode et son quiz</Link>
        <Link href="/app/quiz" className={styles.ghost}>Quiz du mois</Link>
      </div>
      <div className={styles.carte}>
        <div className={styles.chips} style={{ margin: 0, padding: 0 }}>
          <button aria-pressed={portee === "diplome"} onClick={() => setPortee("diplome")}>Classement {nomDiplome(moi.diplome)}</button>
          <button aria-pressed={portee === "amis"} onClick={() => setPortee("amis")}>Entre amis</button>
        </div>
        {rangs === null ? null : rangs.length === 0
          ? <p className={styles.vide}>{portee === "amis" ? "Suis des membres pour vous défier entre amis." : "Personne n'a encore marqué de points cette semaine. À toi !"}</p>
          : rangs.map((r) => (
            <Link key={r.membre} href={`/app/communaute/membre?id=${r.membre}`}
              className={`${styles.rang} ${r.membre === moi.id ? styles.moiRang : ""} ${r.rang <= 3 ? styles[`podium${r.rang}`] : ""}`}>
              <b>{r.rang}</b>
              <Qui m={{ pseudo: r.pseudo, couleur: r.couleur, diplome: r.diplome as Membre["diplome"] }} />
              <b>{r.points} pts</b>
            </Link>
          ))}
      </div>
    </>
  );
}

/* ───────────── Membres ───────────── */
function Membres({ moi }: { moi: Membre }) {
  const [filtre, setFiltre] = useState<"ue" | "diplome" | "suivis" | "tous">(moi.ues.length ? "ue" : "diplome");
  const [cherche, setCherche] = useState("");
  const [liste, setListe] = useState<Membre[] | null>(null);
  const [suivis, setSuivis] = useState<string[]>([]);

  useEffect(() => { void supabase.from("suivis").select("suivi").eq("suiveur", moi.id).then(({ data }) => setSuivis((data ?? []).map((x: { suivi: string }) => x.suivi))); }, [moi.id]);
  useEffect(() => {
    const t = setTimeout(async () => {
      let q = supabase.from("membres").select("*").neq("id", moi.id).order("vu_le", { ascending: false }).limit(60);
      if (cherche.trim()) q = q.ilike("pseudo", `%${cherche.trim().replace(/[%_]/g, "")}%`);
      else if (filtre === "ue" && moi.ues.length) q = q.overlaps("ues", moi.ues);
      else if (filtre === "diplome") q = q.eq("diplome", moi.diplome);
      else if (filtre === "suivis") q = q.in("id", suivis.length ? suivis : ["00000000-0000-0000-0000-000000000000"]);
      const { data } = await q;
      setListe((data as Membre[]) ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [filtre, cherche, moi, suivis]);

  const basculer = async (id: string) => {
    if (suivis.includes(id)) { await supabase.from("suivis").delete().eq("suiveur", moi.id).eq("suivi", id); setSuivis(suivis.filter((x) => x !== id)); }
    else { await supabase.from("suivis").insert({ suivi: id }); setSuivis([...suivis, id]); }
  };

  return (
    <>
      <input className={styles.champ} placeholder="Chercher un pseudo" value={cherche} onChange={(e) => setCherche(e.target.value)} />
      <div className={styles.chips}>
        {moi.ues.length > 0 && <button aria-pressed={filtre === "ue"} onClick={() => setFiltre("ue")}>Mêmes UE</button>}
        <button aria-pressed={filtre === "diplome"} onClick={() => setFiltre("diplome")}>{nomDiplome(moi.diplome)}</button>
        <button aria-pressed={filtre === "suivis"} onClick={() => setFiltre("suivis")}>Suivis</button>
        <button aria-pressed={filtre === "tous"} onClick={() => setFiltre("tous")}>Tous</button>
      </div>
      {liste === null ? null : liste.length === 0 ? <p className={styles.vide}>Personne pour l&apos;instant. Invite ta promo !</p>
        : liste.map((m) => (
          <div key={m.id} className={styles.carte} style={{ flexDirection: "row", alignItems: "center" }}>
            <Qui m={m} id={m.id} sous={[m.ues.map((u) => libelleUe(u).replace(/^(DCG|DSCG) /, "")).join(", "), m.situation, m.ecole].filter(Boolean).join(" · ") || ilYa(m.vu_le ?? new Date().toISOString())} />
            <button style={{ marginLeft: "auto" }} className={styles.ghost} aria-pressed={suivis.includes(m.id)} onClick={() => basculer(m.id)}>
              {suivis.includes(m.id) ? "Suivi" : "Suivre"}
            </button>
          </div>
        ))}
    </>
  );
}

/* ───────────── Messages ───────────── */
interface ConvResume { id: number; autre: string; pseudo: string; couleur: number; diplome: string; dernier: string | null; dernier_le: string; non_lus: number; bloque: boolean }

function Messages() {
  const [convs, setConvs] = useState<ConvResume[] | null>(null);
  useEffect(() => {
    const charger = () => void supabase.rpc("mes_conversations").then(({ data }) => setConvs((data as ConvResume[]) ?? []));
    charger();
    const canal = supabase.channel("liste-messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, charger).subscribe();
    return () => { void supabase.removeChannel(canal); };
  }, []);
  if (convs === null) return null;
  if (!convs.length) return <p className={styles.vide}>Aucune conversation. Ouvre le profil d&apos;un membre pour lui écrire.</p>;
  return (
    <div className={`${styles.carte} ${styles.convs}`}>
      {convs.map((c) => (
        <Link key={c.id} href={`/app/communaute/messages?c=${c.id}`} className={styles.conv}>
          <Avatar m={c} />
          <span><b>{c.pseudo}</b><small>{c.bloque ? "Conversation bloquée" : c.dernier ?? "Nouvelle conversation"}</small></span>
          <i>{ilYa(c.dernier_le)}{Number(c.non_lus) > 0 && <><br /><b>{c.non_lus}</b></>}</i>
        </Link>
      ))}
    </div>
  );
}
