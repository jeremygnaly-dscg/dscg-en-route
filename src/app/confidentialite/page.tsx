import Link from "next/link";
import type { Metadata } from "next";
import { EDITEUR, MISE_A_JOUR } from "@/lib/legal";
import styles from "@/components/legal.module.css";

export const metadata: Metadata = { title: "Confidentialité · Révizen" };

export default function Confidentialite() {
  return (
    <article className={styles.page}>
      <Link href="/" className={styles.back}>← Accueil</Link>
      <h1>Politique de confidentialité</h1>
      <p className={styles.meta}>Dernière mise à jour : {MISE_A_JOUR}</p>

      <section>
        <h2>Qui est responsable de tes données</h2>
        <p>{EDITEUR.nom}, éditeur de Révizen. Contact : {EDITEUR.email}.</p>
      </section>

      <section>
        <h2>Ce que nous collectons</h2>
        <p>Quand tu crées un compte (bêta) :</p>
        <ul>
          <li>ton adresse e-mail, ton prénom et ta situation (alternance, formation initiale, candidat libre, en poste) ;</li>
          <li>ton mot de passe, conservé uniquement sous forme chiffrée (nous ne le connaissons pas) ;</li>
          <li>ta progression : épisodes écoutés, scores aux quiz, dates de révision, et le plan du Coach (épreuves, créneaux) ;</li>
          <li>les avis et signalements d&apos;erreur que tu choisis de nous envoyer ;</li>
          <li>si tu t&apos;abonnes : ta formule, le statut et les dates de ton abonnement, et la preuve de ton acceptation des CGV.
            Le paiement est traité par Stripe : nous ne voyons jamais ton numéro de carte.</li>
        </ul>
        <p>Quand tu t&apos;inscris sur la liste d&apos;attente : ton e-mail, l&apos;UE préparée, ton profil, la date et la page d&apos;origine.</p>
        <p>Tes réglages d&apos;écoute (vitesse, ambiance, thème) restent sur ton téléphone.</p>
      </section>

      <section>
        <h2>Pourquoi</h2>
        <p>
          Pour faire fonctionner ton compte : te connecter, sauvegarder ta progression et la retrouver sur tous tes appareils,
          construire ton plan de révision. Tes avis servent à corriger et améliorer les contenus. Pour la liste d&apos;attente :
          te prévenir du lancement. Rien n&apos;est vendu ni transmis à des tiers.
        </p>
        <p>Base légale : l&apos;exécution du service que tu demandes en créant ton compte, et ton consentement pour la liste d&apos;attente.</p>
      </section>

      <section>
        <h2>Où et combien de temps</h2>
        <p>
          Les données sont stockées chez Supabase, sur des serveurs situés à Paris. Le compte et la progression sont conservés
          tant que le compte existe, et supprimés après 2 ans sans connexion. La liste d&apos;attente : jusqu&apos;à ta
          désinscription, et au plus 3 ans après notre dernier contact.
        </p>
      </section>

      <section>
        <h2>Tes droits</h2>
        <p>
          Tu peux à tout moment demander l&apos;accès à tes données, leur correction ou leur suppression, ou
          retirer ton consentement, en écrivant à {EDITEUR.email}. Réponse sous un mois au plus. Tu peux aussi supprimer
          toi-même ton compte et toute ta progression depuis l&apos;onglet Profil de l&apos;appli.
        </p>
        <p>
          Si tu estimes que tes droits ne sont pas respectés, tu peux adresser une réclamation à la CNIL
          (cnil.fr).
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Le site n&apos;utilise ni cookie publicitaire ni outil de mesure d&apos;audience. Il garde dans la mémoire de ton
          navigateur ce qui est strictement nécessaire : ta session de connexion, ta progression et tes réglages d&apos;écoute.
        </p>
      </section>
    </article>
  );
}
