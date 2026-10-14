import Link from "next/link";
import type { Metadata } from "next";
import { EDITEUR, MEDIATEUR } from "@/lib/legal";
import styles from "@/components/legal.module.css";

export const metadata: Metadata = { title: "Conditions générales de vente · Zenvise" };

const VERSION = "14 octobre 2026";

export default function Cgv() {
  return (
    <article className={styles.page}>
      <Link href="/" className={styles.back}>← Accueil</Link>
      <h1>Conditions générales de vente</h1>
      <p className={styles.meta}>Version du {VERSION}</p>

      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions régissent la vente des abonnements à Zenvise, service en ligne de révision du DSCG :
          épisodes audio, transcriptions, quiz, fiches de révision et outil de planification (Coach). Elles s&apos;appliquent
          à toute souscription faite sur le site ou l&apos;application.
        </p>
      </section>

      <section>
        <h2>2. Vendeur</h2>
        <p>
          {EDITEUR.nom}, {EDITEUR.statut}, SIREN {EDITEUR.siren}
          {EDITEUR.adresse ? <>, {EDITEUR.adresse}</> : null}. Contact : {EDITEUR.email}.
        </p>
      </section>

      <section>
        <h2>3. Offres et prix</h2>
        <p>Abonnement Zenvise : 9,99 € par mois, donnant accès à l&apos;ensemble des contenus, toutes unités d&apos;enseignement confondues.</p>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises. TVA non applicable, article 293 B du Code général des impôts.
          Un épisode par unité d&apos;enseignement reste accessible gratuitement avec un compte.
        </p>
        <p>
          Les contenus s&apos;enrichissent au fil de l&apos;abonnement. Le nombre d&apos;épisodes disponibles pour chaque UE
          est visible dans l&apos;application avant la souscription.
        </p>
      </section>

      <section>
        <h2>4. Souscription et paiement</h2>
        <p>
          La souscription nécessite un compte. Le paiement est effectué par carte bancaire via Stripe, prestataire de paiement
          sécurisé : Zenvise n&apos;a jamais accès aux données de carte. L&apos;abonnement est payé d&apos;avance, au jour de la
          souscription puis chaque mois à la même date. Un reçu est envoyé par e-mail après chaque paiement.
        </p>
        <p>En cas d&apos;échec de paiement, l&apos;accès peut être suspendu jusqu&apos;à régularisation.</p>
      </section>

      <section>
        <h2>5. Durée et résiliation</h2>
        <p>
          L&apos;abonnement est mensuel, sans engagement, et se renouvelle automatiquement chaque mois. Il peut être résilié à
          tout moment depuis l&apos;onglet Profil de l&apos;application, rubrique Abonnement. La résiliation prend effet à la fin
          de la période mensuelle en cours, déjà payée : l&apos;accès est maintenu jusqu&apos;à cette date, sans
          remboursement au prorata.
        </p>
      </section>

      <section>
        <h2>6. Droit de rétractation</h2>
        <p>
          Le consommateur dispose en principe d&apos;un délai de 14 jours pour se rétracter (article L. 221-18 du Code de la
          consommation). Toutefois, les contenus de Zenvise sont des contenus numériques fournis sans support matériel et
          accessibles immédiatement après le paiement.
        </p>
        <p>
          Conformément à l&apos;article L. 221-28 du Code de la consommation, avant de payer, l&apos;abonné demande
          expressément l&apos;accès immédiat aux contenus et reconnaît perdre son droit de rétractation dès le début de cet
          accès. Cet accord est recueilli par une case à cocher et conservé.
        </p>
      </section>

      <section>
        <h2>7. Nature des contenus</h2>
        <p>
          Les contenus sont des supports pédagogiques de révision, rédigés à partir des textes en vigueur à leur date de
          rédaction. Ils ne remplacent ni une formation, ni un conseil juridique, fiscal ou comptable, et ne garantissent pas la
          réussite aux examens. Toute erreur peut être signalée depuis chaque épisode ; elle est corrigée dans les meilleurs délais.
        </p>
      </section>

      <section>
        <h2>8. Utilisation et propriété intellectuelle</h2>
        <p>
          L&apos;abonnement est personnel. Le partage de compte, l&apos;enregistrement, la copie ou la diffusion des contenus
          sont interdits. Les contenus, voix et marques de Zenvise restent la propriété de leur éditeur. En cas de manquement,
          le compte peut être suspendu après avertissement.
        </p>
      </section>

      <section>
        <h2>9. Disponibilité</h2>
        <p>
          Zenvise s&apos;efforce de rendre le service accessible en permanence, mais des interruptions peuvent survenir pour
          maintenance ou en cas d&apos;incident technique. Une interruption de plus de 7 jours consécutifs ouvre droit, sur
          demande, au remboursement de la période concernée.
        </p>
      </section>

      <section>
        <h2>10. Évolution des prix et des conditions</h2>
        <p>
          Toute modification du prix est annoncée par e-mail au moins un mois avant de s&apos;appliquer. L&apos;abonné peut
          résilier avant son entrée en vigueur.
        </p>
      </section>

      <section>
        <h2>11. Données personnelles</h2>
        <p>
          Les données nécessaires à l&apos;abonnement sont traitées comme décrit dans la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </section>

      <section>
        <h2>12. Réclamations et médiation</h2>
        <p>Toute réclamation peut être adressée à {EDITEUR.email}. Une réponse est apportée sous 15 jours.</p>
        <p>
          En cas de litige non résolu, le consommateur peut recourir gratuitement au médiateur de la consommation :{" "}
          {MEDIATEUR.nom ? <>{MEDIATEUR.nom}{MEDIATEUR.site ? ` (${MEDIATEUR.site})` : ""}</> : "en cours de désignation"}.
        </p>
      </section>

      <section>
        <h2>13. Droit applicable</h2>
        <p>Les présentes conditions sont soumises au droit français.</p>
      </section>
    </article>
  );
}
