// Méthode « entonnoir » : on part de la matière entière, on zoome sur une partie, puis sur chaque notion.
// À chaque niveau, le même rituel : d'abord les titres, puis les mots-clés, puis le contenu.
// Les cartes regroupent les « parties » du programme (programme.ts) en grandes parties d'UE.
import type { UeId } from "./types";
import { PROGRAMME, type Notion } from "./programme";
import { episodesOf } from "./episodes";
import type { Episode } from "./types";
import { CARTES_DSCG, MOTS_CLES_DSCG } from "./methode-dscg";
import { CARTES_DCG, MOTS_CLES_DCG } from "./methode-dcg";

export interface Bloc {
  id: string;
  titre: string;
  resume: string;      // une phrase simple qui résume la partie
  parties: string[];   // valeurs de Notion.partie regroupées dans ce bloc
  ids?: string[];      // ou liste explicite de notions, quand une partie du programme doit être découpée
}
export interface Carte { phrase: string; blocs: Bloc[] }

const CARTES_UE1: Partial<Record<UeId, Carte>> = {
  ue1: {
    phrase: "D'abord le cadre, puis la croissance, la frontière, le groupe, la crise, la sortie, et enfin le non-lucratif.",
    blocs: [
      { id: "cadre", titre: "L'entreprise et son environnement", parties: ["Contrats", "Droit pénal", "Concurrence", "Administration fiscale"],
        resume: "Les règles du jeu : les contrats que l'entreprise signe, ses risques pénaux, la concurrence et ses relations avec le fisc." },
      { id: "croissance", titre: "Le développement de l'entreprise", parties: ["Développement", "Financement", "Pérennité"],
        resume: "Choisir sa société, la gouverner, la financer et rester conforme en grandissant." },
      { id: "frontiere", titre: "L'entreprise à l'international", parties: ["Territorialité", "Fiscalité"],
        resume: "Où sont taxés les bénéfices et la TVA quand l'entreprise passe les frontières." },
      { id: "groupe", titre: "Groupes et restructurations", parties: ["Groupe", "Restructurations"],
        resume: "Organiser un groupe, faire remonter les dividendes, intégrer fiscalement, puis fusionner ou scinder." },
      { id: "crise", titre: "L'entreprise en difficulté", parties: ["Difficultés"],
        resume: "Prévenir puis traiter les difficultés, de l'alerte jusqu'à la liquidation." },
      { id: "sortie", titre: "La transmission de l'entreprise", parties: ["Transmission"],
        resume: "Céder, donner ou dissoudre : passer le relais ou fermer proprement." },
      { id: "nonlucratif", titre: "Le secteur non lucratif", parties: ["Associations"],
        resume: "Associations, fondations et fonds de dotation : un régime juridique et fiscal à part." },
    ],
  },
};

// 3 à 5 mots-clés par notion : ce qu'il faut savoir retrouver et expliquer, pas réciter.
const MOTS_CLES_UE1: Record<string, string[]> = {
  // UE1 · L'entreprise et son environnement
  "contrat-formation": ["Pourparlers et rupture fautive", "Offre et acceptation", "Vices du consentement", "Devoir d'information"],
  "contrat-inexecution": ["Force obligatoire", "Exception d'inexécution", "Résolution", "Imprévision"],
  "contrat-vente": ["Transfert de propriété", "Délivrance conforme", "Garantie des vices cachés", "Réserve de propriété"],
  "contrat-entreprise": ["Maître d'ouvrage", "Prix et devis", "Sous-traitance (loi de 1975)", "Action directe"],
  "distribution-franchise": ["Concession exclusive", "Savoir-faire", "Information précontractuelle", "Non-concurrence"],
  "assurance-transaction": ["Risque et prime", "Déclaration du risque", "Concessions réciproques", "Fin du litige"],
  "cautionnement": ["Obligation accessoire", "Mention exigée de la caution", "Proportionnalité", "Mise en garde"],
  "penal-responsabilite": ["Éléments légal, matériel, moral", "Organe ou représentant", "Amende quintuplée", "Peines complémentaires"],
  "procedure-penale": ["Action publique", "Constitution de partie civile", "Juge d'instruction", "Prescription"],
  "abus-biens-sociaux": ["Contraire à l'intérêt social", "Dirigeant de SARL, SA ou SAS", "Mauvaise foi", "Prescription à la découverte"],
  "dividendes-fictifs": ["Pas d'inventaire ou inventaire frauduleux", "Bénéfice distribuable", "Comptes infidèles", "Image fidèle"],
  "infractions-affaires": ["Banqueroute", "Cessation des paiements", "Délit d'initié", "Information privilégiée"],
  "concurrence-deloyale": ["Responsabilité civile", "Dénigrement", "Confusion", "Parasitisme"],
  "pratiques-restrictives": ["Rupture brutale", "Préavis écrit", "Déséquilibre significatif", "Avantage sans contrepartie"],
  "transparence-delais": ["Conditions générales de vente", "Convention unique", "Délais de paiement plafonnés", "Pénalités de retard"],
  "ententes-abus": ["Entente", "Position dominante", "Autorité de la concurrence", "Clémence"],
  "controle-concentrations": ["Notion de concentration", "Seuils de chiffre d'affaires", "Notification préalable", "Engagements"],
  "rescrit-agrement": ["Prise de position formelle", "Silence de 3 mois", "Garantie contre les rehaussements", "Agrément préalable"],
  "controle-fiscal": ["Vérification de comptabilité", "Droit de reprise", "Garanties du contribuable", "Charte du contribuable"],
  "procedure-rectification": ["Proposition de rectification", "30 jours pour répondre", "Commission des impôts", "Abus de droit"],
  "contentieux-fiscal": ["Réclamation préalable", "Délai de réclamation", "Tribunal administratif", "Sursis de paiement"],
  // UE1 · Le développement de l'entreprise
  "societe-regles-communes": ["Contrat de société", "Apports", "Personnalité morale", "Nullités"],
  "transformation-societe": ["Pas de personne morale nouvelle", "Majorité requise", "Commissaire à la transformation", "Conséquences fiscales"],
  "fiscalite-apports": ["Apport pur et simple", "Apport à titre onéreux", "Droits d'enregistrement", "Plus-values d'apport"],
  "calcul-is": ["Résultat comptable", "Réintégrations et déductions", "Taux normal et taux réduit", "Acomptes"],
  "sa-conseil-administration": ["Conseil d'administration", "Président et directeur général", "Conventions réglementées", "Révocation ad nutum"],
  "sa-directoire": ["Directoire", "Conseil de surveillance", "Gestion séparée du contrôle", "Révocation pour juste motif"],
  "pactes-associes": ["Liberté statutaire", "Président obligatoire", "Agrément, exclusion, inaliénabilité", "Pacte extrastatutaire"],
  "societes-cotees": ["Information permanente", "Information périodique", "AMF", "Manquement d'initié"],
  "information-durabilite": ["CSRD", "Double matérialité", "Rapport de durabilité", "Certification"],
  "rgpd-plateforme": ["Données personnelles", "Base légale et consentement", "DPO", "Sanctions de la CNIL"],
  "appels-offres": ["Commande publique", "Mise en concurrence", "Critères d'attribution", "Groupement d'entreprises"],
  "franchise-rupture-brutale": ["Relation commerciale établie", "Préavis raisonnable", "Contrat de franchise", "Dommages-intérêts"],
  "augmentation-capital-juridique": ["AGE", "Droit préférentiel de souscription", "Libération des apports", "Délégation de compétence"],
  "emprunt-obligataire": ["Obligations", "Masse des obligataires", "Représentant de la masse", "Émission"],
  "financement-bancaire": ["Crédit-bail", "Affacturage", "Sûretés", "Covenants"],
  "offre-au-public-amf": ["Offre au public", "Prospectus", "Approbation de l'AMF", "Placement privé"],
  "conformite-sapin-lcb": ["Loi Sapin 2", "Cartographie des risques", "Vigilance LCB-FT", "CJIP"],
  "vigilance-mission": ["Plan de vigilance", "Raison d'être", "Société à mission", "Critères ESG"],
  // UE1 · L'international
  "territorialite-is": ["Territorialité de l'IS", "Établissement stable", "Domicile fiscal", "Conventions fiscales"],
  "tva-intracom-biens": ["Livraison intracommunautaire exonérée", "Acquisition intracommunautaire", "Autoliquidation", "État récapitulatif"],
  "tva-territorialite": ["B to B : lieu du preneur", "B to C : lieu du prestataire", "Autoliquidation", "Règles dérogatoires"],
  "vente-distance-ue": ["Seuil de 10 000 €", "TVA du pays de l'acheteur", "Guichet unique OSS", "Plateformes"],
  "prix-transfert-fiscal": ["Pleine concurrence", "Article 57 du CGI", "Documentation", "Conventions fiscales"],
  // UE1 · Groupes et restructurations
  "cession-titres-agrement": ["Clause d'agrément", "Cession de parts ou d'actions", "Droits d'enregistrement", "Plus-value de cession"],
  "participations-seuils": ["Filiale : plus de 50 %", "Participation : 10 à 50 %", "Franchissement de seuils", "Participations croisées"],
  "regime-mere-fille": ["Au moins 5 % du capital", "Titres conservés 2 ans", "Quote-part de 5 %", "Option"],
  "integration-fiscale": ["Société tête de groupe", "Détention d'au moins 95 %", "Résultat d'ensemble", "Neutralisations"],
  "droit-travail-groupe": ["Comité de groupe", "Mise à disposition", "Co-emploi", "Reclassement"],
  "transfert-contrats-travail": ["Article L. 1224-1", "Entité économique autonome", "Maintien des contrats", "Statut collectif"],
  "gie-location-gerance": ["GIE : prolonger l'activité", "Responsabilité solidaire", "Location-gérance", "Redevance"],
  "fusion-regime-faveur": ["Article 210 A", "Plus-values en sursis", "Engagements de l'absorbante", "Déficits sur agrément"],
  "fusion-procedure": ["Projet de fusion", "Rapport d'échange", "Transmission universelle", "Date d'effet"],
  "fusion-juridique-sociale": ["Commissaire à la fusion", "Consultation du CSE", "Opposition des créanciers", "Transfert des salariés"],
  "scission-apa-juridique": ["Scission", "Apport partiel d'actif", "Branche complète d'activité", "Régime des scissions sur option"],
  "tup": ["Associé unique personne morale", "Dissolution sans liquidation", "Opposition des créanciers", "Transmission du patrimoine"],
  // UE1 · Difficultés, transmission, non-lucratif
  "prevention-difficultes": ["Procédure d'alerte", "Mandat ad hoc", "Conciliation", "Confidentialité"],
  "procedures-collectives": ["Cessation des paiements", "Sauvegarde", "Redressement judiciaire", "Liquidation judiciaire"],
  "plans-sauvegarde-cession": ["Période d'observation", "Classes de parties affectées", "Plan de cession", "Application forcée interclasses"],
  "insolvabilite-europe": ["Règlement européen de 2015", "Centre des intérêts principaux", "Procédure principale", "Procédure secondaire"],
  "cession-fonds-commerce": ["Éléments du fonds", "Mentions et publicité", "Opposition des créanciers", "Droits d'enregistrement"],
  "transmission-gratuite": ["Donation", "Droits de mutation", "Pacte Dutreil", "Abattement de 75 %"],
  "dissolution-liquidation": ["Causes de dissolution", "Liquidateur", "Boni de liquidation", "Radiation"],
  "associations": ["Loi de 1901", "But non lucratif", "Gestion désintéressée", "Règle des 4 P"],
  "fondations-fonds-dotation": ["Utilité publique", "Fonds de dotation", "Fonds de pérennité", "Mécénat"],
};

export const CARTES: Partial<Record<UeId, Carte>> = { ...CARTES_UE1, ...CARTES_DSCG, ...CARTES_DCG };
export const MOTS_CLES: Record<string, string[]> = { ...MOTS_CLES_UE1, ...MOTS_CLES_DSCG, ...MOTS_CLES_DCG };

export interface BlocDetaille extends Bloc { numero: number; notions: Notion[]; groupes: { nom: string; notions: Notion[] }[] }

export function carteDe(ue: string): (Omit<Carte, "blocs"> & { blocs: BlocDetaille[] }) | null {
  const c = CARTES[ue as UeId];
  if (!c) return null;
  const notions = PROGRAMME[ue as UeId] ?? [];
  return {
    ...c,
    blocs: c.blocs.map((b, i) => {
      const groupes = b.ids
        ? [{ nom: b.titre, notions: b.ids.map((id) => notions.find((n) => n.id === id)).filter((n): n is Notion => !!n) }]
        : b.parties.map((p) => ({ nom: p, notions: notions.filter((n) => n.partie === p) }));
      return { ...b, numero: i + 1, groupes, notions: groupes.flatMap((g) => g.notions) };
    }),
  };
}

// Notion (et bloc) traitée par un épisode, pour afficher son plan en mots-clés avant l'écoute
export function notionDeEpisode(ue: string, episodeId: string) {
  const carte = carteDe(ue);
  if (!carte) return null;
  for (const b of carte.blocs) {
    const n = b.notions.find((x) => x.episodes?.includes(episodeId) || x.id === episodeId);
    if (n) return { notion: n, bloc: b, motsCles: MOTS_CLES[n.id] ?? [] };
  }
  return null;
}

// Les épisodes d'une UE classés dans l'arborescence du programme : grande partie, puis sous-partie,
// dans l'ordre du programme. Les épisodes venus d'une autre UE et sans notion ici vont en « Compléments ».
export interface BrancheEpisodes { id: string; numero: number; titre: string; resume?: string; episodes: { e: Episode }[]; groupes: { nom: string; episodes: { e: Episode }[] }[] }

export function arborescence(ue: string): BrancheEpisodes[] | null {
  const carte = carteDe(ue);
  if (!carte) return null;
  const eps = episodesOf(ue);
  const place = new Set<string>();
  const branches: BrancheEpisodes[] = carte.blocs.map((b) => {
    const groupes = b.groupes.map((g) => {
      const episodes: { e: Episode }[] = [];
      for (const n of g.notions) {
        for (const e of eps) {
          if (place.has(e.id)) continue;
          if (n.episodes?.includes(e.id) || n.id === e.id) { episodes.push({ e }); place.add(e.id); }
        }
      }
      return { nom: g.nom, episodes };
    }).filter((g) => g.episodes.length > 0);
    return { id: b.id, numero: b.numero, titre: b.titre, resume: b.resume, groupes, episodes: groupes.flatMap((g) => g.episodes) };
  });
  const reste = eps.filter((e) => !place.has(e.id)).map((e) => ({ e }));
  if (reste.length) branches.push({ id: "complements", numero: 0, titre: "Compléments d'autres UE", resume: "Des épisodes d'une autre UE, utiles aussi pour celle-ci.", episodes: reste, groupes: [{ nom: "Compléments", episodes: reste }] });
  return branches.filter((b) => b.episodes.length > 0);
}
