// Fil d'actualité : chaque actu renvoie à des notions du programme.
// Règle de rédaction : résumé écrit par nous (jamais l'article copié), lien vers la source.
// Mesures budgétaires : toujours `projet: true` tant que la loi n'est pas votée.

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
  categorie: "Profession" | "Fiscalité" | "Social" | "Entreprises" | "Numérique";
  titre: string;
  resume: string;
  question: string; // ce que l'examen pourrait demander sur ce sujet
  notions: Notion[];
  projet?: boolean; // mesure d'un projet de loi, pas encore votée
  exemple?: boolean; // format de démonstration, pas une vraie info
}

export const ACTUS: Actu[] = [
  {
    id: "rydge-rachats-oct-2026",
    date: "2026-10-08",
    source: "CFNEWS",
    sourceUrl: "https://www.cfnews.net/L-actualite/Build-up/Rydge-ajoute-deux-lignes-a-son-bilan-745176",
    categorie: "Profession",
    titre: "Rydge rapproche quatre cabinets en deux semaines",
    resume:
      "L'ex-activité PME de KPMG, contrôlée par le fonds TowerBrook depuis 2025, enchaîne les rapprochements : Comptastar, Groupe Altitude, MyCFO puis Initia (Rennes). Le groupe revendique près de 4 500 collaborateurs et environ 500 M€ de revenus. Aucun prix n'a été rendu public.",
    question:
      "Un associé de 63 ans cède ses 40 % à un groupe sous LBO, avec un complément de prix. Imposition de sa plus-value ? Le groupe peut-il détenir 100 % du capital du cabinet ?",
    notions: [
      { label: "Plus-value de cession de titres et départ à la retraite", ue: "UE1" },
      { label: "Ouverture du capital des sociétés d'expertise comptable", ue: "UE1" },
      { label: "LBO et holding de reprise", ue: "UE2" },
      { label: "Goodwill et complément de prix en consolidation", ue: "UE4" },
    ],
  },
  {
    id: "consolidation-accru-rsm",
    date: "2026-10-09",
    source: "CFNEWS",
    sourceUrl: "https://www.cfnews.net/L-actualite/International/Operations/Build-up-International/Accru-Partners-poursuit-son-implantation-dans-l-Hexagone-747011",
    categorie: "Profession",
    titre: "Fonds ou Bourse : comment les cabinets financent leur croissance",
    resume:
      "Le suédois Accru Partners, détenu par le fonds Axcel, signe sa deuxième acquisition en France avec le cabinet auvergnat Fuzive. Aux États-Unis, RSM US étudierait une introduction en Bourse pour éviter de passer sous le contrôle d'un fonds, selon le Financial Times.",
    question:
      "Un cabinet de 50 M€ de CA hésite entre un fonds de LBO et une introduction en Bourse pour financer ses rachats. Avantages, limites et contrainte réglementaire sur les droits de vote ?",
    notions: [
      { label: "Croissance externe et build-up", ue: "UE3" },
      { label: "Financement : capital-investissement ou Bourse", ue: "UE2" },
      { label: "Indépendance du commissaire aux comptes", ue: "UE4" },
    ],
  },
  {
    id: "plf-2027-pacte-papin",
    date: "2026-10-01",
    source: "Légifiscal",
    sourceUrl: "https://www.legifiscal.fr/actualites-fiscales/4662-plf-2027-pacte-dutreil-pacte-papin.html",
    categorie: "Fiscalité",
    titre: "Budget 2027 : un abattement doublé pour céder son entreprise à ses salariés",
    resume:
      "Le projet de loi de finances propose un « pacte Papin » : l'abattement du dirigeant qui part à la retraite passerait de 500 000 € à 1 M€ s'il cède à ses salariés, avec des droits d'enregistrement réduits et un suramortissement pour l'entreprise reprise. Règle actuelle : abattement de 500 000 €.",
    question:
      "Le dirigeant cède soit à un groupe industriel, soit à une holding de trois salariés. Compare le coût fiscal pour le cédant dans les deux cas, en droit actuel puis selon le projet.",
    notions: [
      { label: "Abattement du dirigeant partant à la retraite (art. 150-0 D ter CGI)", ue: "UE1" },
      { label: "Droits d'enregistrement sur cession de titres", ue: "UE1" },
      { label: "Reprise par les salariés (LMBO)", ue: "UE2" },
    ],
    projet: true,
  },
  {
    id: "plf-2027-apport-cession",
    date: "2026-10-01",
    source: "Éditions JFA",
    sourceUrl: "https://www.editions-jfa.com/plf-2027-fin-de-la-purge-des-plus-values-en-report-dimposition-cgi-art-150-0-b-ter-en-cas-de-transmission-a-titre-gratuit/",
    categorie: "Fiscalité",
    titre: "Apport-cession : l'impôt en report deviendrait exigible à la donation ou au décès",
    resume:
      "Aujourd'hui, la plus-value placée en report lors d'un apport de titres à une holding contrôlée disparaît au décès de l'apporteur. Le projet de budget 2027 mettrait fin à cette purge : l'impôt serait dû à la donation ou au décès, avec un paiement étalable sur cinq ans.",
    question:
      "Mme Y a réalisé un apport-cession en 2022 et veut donner les titres de sa holding en 2027. Conséquences fiscales en droit actuel, puis selon le projet ?",
    notions: [
      { label: "Report d'imposition (art. 150-0 B ter CGI)", ue: "UE1" },
      { label: "Sursis et report d'imposition", ue: "UE1" },
      { label: "Holding patrimoniale", ue: "UE2" },
    ],
    projet: true,
  },
  {
    id: "plf-2027-surtaxe-is",
    date: "2026-10-01",
    source: "Légifiscal",
    sourceUrl: "https://www.legifiscal.fr/actualites-fiscales/4660-plf-2027-prorogation-contribution-exceptionnelle-benefices-grandes-entreprises-taux-bas.html",
    categorie: "Fiscalité",
    titre: "La surtaxe d'IS des grandes entreprises prolongée d'un an, à taux réduits",
    resume:
      "La contribution exceptionnelle sur les bénéfices des entreprises de plus de 1,5 Md€ de chiffre d'affaires serait reconduite pour 2027, à 15,7 % ou 31,4 % de l'IS selon la taille, contre 20,6 % et 41,2 % auparavant. Rendement attendu : 5 Md€.",
    question:
      "Société de 2,2 Md€ de CA, bénéfice fiscal de 400 M€ : calcule l'IS, la contribution sociale, la contribution exceptionnelle et le taux effectif.",
    notions: [
      { label: "Calcul de l'impôt sur les sociétés", ue: "UE1" },
      { label: "Impôts différés et changement de taux", ue: "UE4" },
      { label: "Coût du capital après impôt", ue: "UE2", episodeId: "cmpc" },
    ],
    projet: true,
  },
  {
    id: "plfss-2027-ruptures",
    date: "2026-10-01",
    source: "Voltaire Avocats",
    sourceUrl: "https://www.voltaire-avocats.com/fr/indemnites-de-rupture-les-projets-de-budgets-pour-2027-prevoient-une-refonte-des-exonerations-fiscales-et-sociales/",
    categorie: "Social",
    titre: "Indemnités de rupture : l'exonération sociale ramenée à un plafond de Sécurité sociale",
    resume:
      "Le projet de financement de la Sécurité sociale prévoit d'exonérer les indemnités de licenciement et de rupture conventionnelle dans la seule limite d'un PASS (48 060 € en 2026), contre deux aujourd'hui, pour les ruptures à compter de 2027.",
    question:
      "Rupture conventionnelle d'un cadre avec 90 000 € d'indemnité : coût employeur et net salarié avant puis après la réforme proposée.",
    notions: [
      { label: "Régime social des indemnités de rupture", ue: "UE1" },
      { label: "Rupture conventionnelle", ue: "UE1" },
      { label: "Provision pour litige ou restructuration", ue: "UE4", episodeId: "provision-litige" },
    ],
    projet: true,
  },
  {
    id: "facture-electronique-bilan",
    date: "2026-10-09",
    source: "Ministère de l'Économie",
    sourceUrl: "https://presse.economie.gouv.fr/facturation-electronique-le-premier-comite-dresse-le-bilan-du-deploiement-et-engage-la-preparation-de-2027/",
    categorie: "Numérique",
    titre: "Facture électronique : 75 % des entreprises ont choisi leur plateforme",
    resume:
      "Premier bilan officiel après le démarrage du 1er septembre : trois entreprises sur quatre redevables de la TVA ont désigné une plateforme de réception, et plus de 20 millions de factures ont circulé. Pas de sanction avant fin 2026. Les PME devront émettre au 1er septembre 2027.",
    question:
      "Une PME de 80 salariés doit émettre ses factures électroniques en septembre 2027. Propose la démarche projet et les risques que le commissaire aux comptes devra apprécier.",
    notions: [
      { label: "Conduite de projet SI et intégration à l'ERP", ue: "UE5" },
      { label: "Obligations de facturation et TVA", ue: "UE1" },
      { label: "Contrôle interne du cycle ventes", ue: "UE4" },
    ],
  },
  {
    id: "lapeyre-mutares",
    date: "2026-10-05",
    source: "CFNEWS",
    sourceUrl: "https://www.cfnews.net/L-actualite/Retournement/Operations/M-A/Lapeyre-ouvre-sa-porte-a-des-italiens-747063",
    categorie: "Entreprises",
    titre: "Mutares cède le contrôle de Lapeyre mais garde une part minoritaire",
    resume:
      "Le fonds allemand, qui avait racheté Lapeyre à Saint-Gobain en 2021, a reçu une offre irrévocable d'entrepreneurs italiens pour une participation majoritaire. Il restera actionnaire minoritaire. Lapeyre a réalisé environ 475 M€ de chiffre d'affaires en 2025. Le prix n'est pas public.",
    question:
      "Le groupe M cède 70 % de sa filiale et garde 30 % avec une influence notable. Écritures de déconsolidation et traitement de la part conservée ?",
    notions: [
      { label: "Notion de contrôle (art. L. 233-3 C. com.)", ue: "UE1" },
      { label: "Consultation du CSE avant une cession", ue: "UE1" },
      { label: "Perte de contrôle et mise en équivalence", ue: "UE4" },
    ],
  },
];
