import Link from "next/link";
import type { Metadata } from "next";
import { EDITEUR, MISE_A_JOUR } from "@/lib/legal";
import styles from "@/components/legal.module.css";

export const metadata: Metadata = { title: "Règles de la communauté · Zenvise" };

export default function ReglesCommunaute() {
  return (
    <article className={styles.page}>
      <Link href="/app/communaute" className={styles.back}>← Communauté</Link>
      <h1>Règles de la communauté</h1>
      <p className={styles.meta}>Dernière mise à jour : {MISE_A_JOUR}</p>

      <section>
        <h2>L&apos;esprit</h2>
        <p>
          La communauté Zenvise réunit des candidats au DCG, au DSCG et aux examens voisins pour s&apos;entraider. On y pose
          des questions, on explique, on se motive. Chacun y écrit sous un pseudo et reste responsable de ce qu&apos;il publie.
        </p>
      </section>

      <section>
        <h2>Ce qui est attendu</h2>
        <ul>
          <li>Le respect : pas d&apos;insulte, de moquerie, de harcèlement ni de propos discriminatoires.</li>
          <li>Des réponses utiles : la règle, le texte, un exemple. Dire « je ne suis pas sûr » quand c&apos;est le cas.</li>
          <li>Des questions claires, dans la bonne UE, en évitant les doublons.</li>
        </ul>
      </section>

      <section>
        <h2>Ce qui est interdit</h2>
        <ul>
          <li>Tout contenu illicite : diffamation, menaces, contenus haineux ou violents, atteinte à la vie privée d&apos;autrui.</li>
          <li>La copie de contenus protégés : sujets ou corrigés payants, manuels, cours d&apos;organismes de formation. Citer une règle de droit ou un article de loi est bien sûr permis.</li>
          <li>La triche le jour de l&apos;examen et la vente de sujets.</li>
          <li>La publicité, le démarchage et le spam, y compris en messages privés.</li>
          <li>Les fausses identités et l&apos;usurpation d&apos;un autre membre.</li>
          <li>Le partage de données personnelles d&apos;autrui (téléphone, adresse, photo) sans son accord.</li>
        </ul>
      </section>

      <section>
        <h2>Messages privés</h2>
        <p>
          Les messages privés ne sont lus que par les deux participants. Tu peux fermer tes messages dans ton profil, bloquer
          un membre à tout moment, et signaler un message : il est alors masqué et l&apos;équipe peut le consulter pour
          traiter le signalement.
        </p>
      </section>

      <section>
        <h2>Signalements et modération</h2>
        <p>
          Chaque question, réponse, commentaire, message ou profil peut être signalé. Un contenu public signalé par trois
          membres différents est masqué automatiquement en attendant l&apos;examen de l&apos;équipe. Zenvise peut retirer
          un contenu ou suspendre un compte qui ne respecte pas ces règles. En cas de contenu manifestement illicite, tu peux
          aussi écrire à {EDITEUR.email}.
        </p>
        <p>
          Une limite de publication par heure protège la communauté contre le spam. Les points des défis sont plafonnés
          chaque jour pour que le classement reste juste.
        </p>
      </section>

      <section>
        <h2>Ce que voient les autres</h2>
        <p>
          Ton profil public (pseudo, diplôme, UE, situation, école, présentation, couleur), tes questions, réponses et
          commentaires, et ton total de points de la semaine sont visibles par les membres connectés. Ta progression
          détaillée, tes scores par épisode et ton adresse e-mail ne le sont jamais. Voir la <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </section>
    </article>
  );
}
