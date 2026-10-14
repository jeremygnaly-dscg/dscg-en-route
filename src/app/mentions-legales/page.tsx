import Link from "next/link";
import type { Metadata } from "next";
import { EDITEUR, MISE_A_JOUR } from "@/lib/legal";
import styles from "@/components/legal.module.css";

export const metadata: Metadata = { title: "Mentions légales · Zenvise" };

export default function MentionsLegales() {
  return (
    <article className={styles.page}>
      <Link href="/" className={styles.back}>← Accueil</Link>
      <h1>Mentions légales</h1>
      <p className={styles.meta}>Dernière mise à jour : {MISE_A_JOUR}</p>

      <section>
        <h2>Éditeur du site</h2>
        <p>
          {EDITEUR.nom}, {EDITEUR.statut}
          {EDITEUR.siren ? <><br />SIREN : {EDITEUR.siren}</> : <><br />SIREN : en cours d&apos;immatriculation</>}
          {EDITEUR.adresse && <><br />{EDITEUR.adresse}</>}
          <br />Contact : {EDITEUR.email}
        </p>
        <p>Directeur de la publication : {EDITEUR.nom}.</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Site hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).
        </p>
        <p>
          Données de la liste d&apos;attente stockées par Supabase Inc. (supabase.com), sur des serveurs situés
          à Paris (région eu-west-3).
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, scénarios, enregistrements et éléments graphiques de Zenvise sont la propriété de
          leur éditeur. Toute reproduction sans autorisation est interdite. Les textes de loi cités sont issus
          de sources officielles (Légifrance) et restent librement réutilisables.
        </p>
      </section>

      <section>
        <h2>Contenu pédagogique</h2>
        <p>
          Les épisodes sont des outils de révision. Ils ne remplacent ni un enseignement ni un conseil juridique,
          fiscal ou social. Zenvise n&apos;est affilié ni au ministère de l&apos;Enseignement supérieur ni aux jurys des examens.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>Voir la <Link href="/confidentialite">politique de confidentialité</Link>.</p>
      </section>
    </article>
  );
}
