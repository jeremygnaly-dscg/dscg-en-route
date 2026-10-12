import Link from "next/link";
import type { Metadata } from "next";
import { EDITEUR, MISE_A_JOUR } from "@/lib/legal";
import styles from "@/components/legal.module.css";

export const metadata: Metadata = { title: "Confidentialité · DSCG en route" };

export default function Confidentialite() {
  return (
    <article className={styles.page}>
      <Link href="/" className={styles.back}>← Accueil</Link>
      <h1>Politique de confidentialité</h1>
      <p className={styles.meta}>Dernière mise à jour : {MISE_A_JOUR}</p>

      <section>
        <h2>Qui est responsable de tes données</h2>
        <p>{EDITEUR.nom}, éditeur de DSCG en route. Contact : {EDITEUR.email}.</p>
      </section>

      <section>
        <h2>Ce que nous collectons</h2>
        <p>Quand tu t&apos;inscris sur la liste d&apos;attente :</p>
        <ul>
          <li>ton adresse e-mail ;</li>
          <li>l&apos;UE que tu prépares et ton profil (alternance, formation initiale, candidat libre) ;</li>
          <li>la date d&apos;inscription et la page d&apos;où tu viens (par exemple un lien LinkedIn).</li>
        </ul>
        <p>
          Tes réglages d&apos;écoute et ta progression dans l&apos;appli restent sur ton téléphone. Ils ne sont
          pas envoyés sur nos serveurs.
        </p>
      </section>

      <section>
        <h2>Pourquoi</h2>
        <p>
          Uniquement pour te prévenir du lancement de DSCG en route et de l&apos;offre réservée aux inscrits,
          et pour savoir quelles UE produire en priorité. Ton e-mail n&apos;est ni vendu ni transmis à des tiers.
        </p>
        <p>Base légale : ton consentement, donné en t&apos;inscrivant.</p>
      </section>

      <section>
        <h2>Où et combien de temps</h2>
        <p>
          Les données sont stockées chez Supabase, sur des serveurs situés à Paris. Elles sont conservées
          jusqu&apos;à ta désinscription, et au plus 3 ans après notre dernier contact avec toi.
        </p>
      </section>

      <section>
        <h2>Tes droits</h2>
        <p>
          Tu peux à tout moment demander l&apos;accès à tes données, leur correction ou leur suppression, ou
          retirer ton consentement, en écrivant à {EDITEUR.email}. Réponse sous un mois au plus.
        </p>
        <p>
          Si tu estimes que tes droits ne sont pas respectés, tu peux adresser une réclamation à la CNIL
          (cnil.fr).
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Le site n&apos;utilise ni cookie publicitaire ni outil de mesure d&apos;audience. Il garde seulement tes
          réglages d&apos;écoute dans la mémoire de ton navigateur.
        </p>
      </section>
    </article>
  );
}
