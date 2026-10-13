// Fil d'actualité : chaque actu renvoie à des notions du programme.
// Règle de rédaction : résumé écrit par nous (jamais l'article copié), lien vers la source.
// Les actus ci-dessous sont des EXEMPLES DE FORMAT, pas de vraies informations.

export interface Notion {
  label: string;
  ue: string; // "UE1", "UE4"...
  episodeId?: string; // si un épisode existe, la notion ouvre l'épisode
}

export interface Actu {
  id: string;
  date: string; // AAAA-MM-JJ
  source: string;
  sourceUrl?: string;
  categorie: "Entreprises" | "Fiscalité" | "Marchés" | "Social" | "Profession";
  titre: string;
  resume: string;
  question: string; // ce que l'examen pourrait demander sur ce sujet
  notions: Notion[];
  exemple?: boolean; // true = format de démonstration, pas une vraie info
}

export const ACTUS: Actu[] = [
  {
    id: "dividende-groupe",
    date: "2026-10-13",
    source: "Révizen",
    categorie: "Entreprises",
    titre: "Une filiale remonte 10 M€ de dividendes à sa holding",
    resume:
      "Une holding détenant 80 % d'une société industrielle encaisse 10 M€ de dividendes. Combien d'impôt paie-t-elle vraiment, et comment l'opération apparaît-elle dans les comptes des deux sociétés ?",
    question: "Le régime mère-fille s'applique-t-il, et quel est le montant imposable ?",
    notions: [
      { label: "Régime mère-fille", ue: "UE1", episodeId: "regime-mere-fille" },
      { label: "Affectation du résultat en AGO", ue: "UE1" },
      { label: "Comptabilisation des dividendes reçus", ue: "UE4" },
    ],
    exemple: true,
  },
  {
    id: "taux-bce",
    date: "2026-10-12",
    source: "Révizen",
    categorie: "Marchés",
    titre: "Les taux d'intérêt bougent : ce que ça change pour les projets d'investissement",
    resume:
      "Quand les taux montent, la dette coûte plus cher et les investisseurs exigent davantage. Le coût du capital des entreprises augmente, et certains projets ne passent plus la barre.",
    question: "Recalcule le CMPC avec un taux sans risque et un coût de la dette en hausse d'un point.",
    notions: [
      { label: "Coût moyen pondéré du capital", ue: "UE2", episodeId: "cmpc" },
      { label: "VAN et choix d'investissement", ue: "UE2" },
    ],
    exemple: true,
  },
  {
    id: "prudhommes-pme",
    date: "2026-10-11",
    source: "Révizen",
    categorie: "Social",
    titre: "Une PME risque une condamnation aux prud'hommes avant sa clôture",
    resume:
      "Un ancien salarié conteste son licenciement. Le jugement tombera l'an prochain, mais l'avocat de l'entreprise juge la condamnation probable. Les comptes de l'exercice doivent-ils en tenir compte ?",
    question: "Faut-il constituer une provision ? Passe les écritures de N et de N+1.",
    notions: [
      { label: "Provision pour litige", ue: "UE4", episodeId: "provision-litige" },
      { label: "Rupture du contrat de travail", ue: "UE1" },
    ],
    exemple: true,
  },
  {
    id: "rachat-concurrent",
    date: "2026-10-10",
    source: "Révizen",
    categorie: "Entreprises",
    titre: "Un groupe rachète 100 % d'un concurrent déficitaire",
    resume:
      "Le groupe veut utiliser les pertes de sa nouvelle filiale pour réduire son impôt. Est-ce possible, et à partir de quand ?",
    question: "Les déficits antérieurs de la cible peuvent-ils s'imputer sur le résultat d'ensemble ?",
    notions: [
      { label: "Intégration fiscale", ue: "UE1", episodeId: "integration-fiscale" },
      { label: "Consolidation : intégration globale", ue: "UE4" },
      { label: "Évaluation d'une cible", ue: "UE2" },
    ],
    exemple: true,
  },
];
