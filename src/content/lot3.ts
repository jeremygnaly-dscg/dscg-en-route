import type { Episode } from "./types";

// LOT 3 — rédigé par Memoson à partir des textes officiels (IFRS, C. com., CGI).
// Cours CNAM utilisés comme plan de travail uniquement. À FAIRE RELIRE avant vente.

const SRC = "Cas Memoson, inspiré des thèmes les plus fréquents aux sujets 2014-2025";

export const LOT3: Episode[] = [
  // ───────────────────────── UE4 ─────────────────────────
  {
    id: "ifrs-16",
    ue: "ue4",
    format: "comptable",
    title: "IFRS 16 : les contrats de location chez le preneur",
    ref: "IFRS 16",
    minutes: 10,
    status: "live",
    source: SRC + " (normes IFRS : 83 % des sujets)",
    scene: [
      { who: "narrateur", text: "Lyon. Le groupe Pharmalia, coté, prépare ses comptes consolidés en normes IFRS." },
      { who: "dirigeant", text: "On loue un entrepôt 10 000 euros par an pendant cinq ans. En comptes sociaux, c'est une charge de loyer. Pourquoi ça change en IFRS ?" },
      { who: "expert", text: "Parce qu'IFRS 16 considère que vous contrôlez un actif pendant cinq ans, financé par une dette. Il faut les deux au bilan." },
      { who: "dirigeant", text: "Et le loyer disparaît du compte de résultat ?" },
      { who: "expert", text: "Il est remplacé par un amortissement et des intérêts. Votre EBITDA va monter mécaniquement." },
      { who: "narrateur", text: "À l'examen : évaluer la dette locative, le droit d'utilisation, puis passer les écritures de la première année." },
    ],
    cours: [
      { who: "cours", text: "Chez le preneur, IFRS 16 supprime la distinction entre location simple et location-financement. Tout contrat de location est inscrit au bilan.", key: true },
      { who: "cours", text: "À la date de début, le preneur comptabilise une dette locative égale à la valeur actuelle des loyers restant à payer, et un droit d'utilisation à l'actif du même montant, ajusté des coûts directs initiaux." },
      { who: "cours", text: "Taux d'actualisation : le taux implicite du contrat s'il est connu, sinon le taux d'emprunt marginal du preneur." },
      { who: "cours", text: "Pharmalia : 10 000 euros par an, payés en fin d'année, pendant 5 ans, à 5 %. Valeur actuelle : `43 295 €`.", key: true },
      { who: "cours", text: "Fin d'année 1 : intérêts de 5 % sur 43 295, soit `2 165 €`. Amortissement linéaire du droit d'utilisation sur 5 ans, soit `8 659 €`." },
      { who: "cours", text: "La dette devient 43 295 plus 2 165 moins 10 000, soit `35 460 €`. Les charges sont plus élevées en début de contrat qu'en fin : c'est l'effet des intérêts dégressifs.", key: true },
      { who: "cours", text: "Deux exemptions possibles : les contrats de 12 mois ou moins, et les actifs de faible valeur. Leurs loyers restent en charges." },
      { who: "cours", text: "Effets à commenter : hausse de l'endettement, hausse de l'EBITDA, et dans le tableau de flux, le remboursement de la dette passe en flux de financement." },
    ],
    ecritures: [
      {
        titre: "Date de début · Inscription au bilan",
        regle: "Droit d'utilisation et dette locative égaux à la valeur actuelle des loyers (5 %, 5 ans).",
        lignes: [
          { compte: "—", intitule: "Droit d'utilisation (entrepôt)", debit: 43295 },
          { compte: "—", intitule: "Dette locative", credit: 43295 },
        ],
      },
      {
        titre: "31/12 année 1 · Intérêts, paiement, amortissement",
        regle: "Le loyer payé rembourse la dette et ses intérêts ; le droit d'utilisation est amorti sur la durée du contrat.",
        lignes: [
          { compte: "—", intitule: "Charges d'intérêts", debit: 2165 },
          { compte: "—", intitule: "Dette locative", debit: 7835 },
          { compte: "—", intitule: "Trésorerie", credit: 10000 },
          { compte: "—", intitule: "Dotation aux amortissements", debit: 8659 },
          { compte: "—", intitule: "Amortissement du droit d'utilisation", credit: 8659 },
        ],
      },
    ],
    flash: [
      { q: "Chez le preneur, IFRS 16 conduit à…", choices: ["Une charge de loyer", "Un droit d'utilisation et une dette au bilan", "Une simple mention en annexe"], answer: 1, why: "Tout contrat de location (hors exemptions) est inscrit au bilan." },
      { q: "Contrat de 10 mois : traitement possible ?", choices: ["Exemption, loyers en charges", "Obligatoirement au bilan", "Provision"], answer: 0, why: "Exemption pour les contrats de 12 mois ou moins." },
      { q: "Effet d'IFRS 16 sur l'EBITDA du preneur ?", choices: ["Il baisse", "Il augmente", "Aucun"], answer: 1, why: "Le loyer disparaît de l'EBITDA, remplacé par un amortissement et des intérêts." },
    ],
  },
  {
    id: "cac-nomination-mission",
    ue: "ue4",
    format: "comptable",
    title: "Le commissaire aux comptes : quand le nommer, que fait-il ?",
    ref: "C. com. · décret n° 2024-152 · NEP",
    minutes: 9,
    status: "live",
    source: SRC + " (commissariat aux comptes : 100 % des sujets UE4, 67 % en UE1)",
    scene: [
      { who: "narrateur", text: "Tours. Assemblée annuelle de Loire Bio, SAS de 45 salariés." },
      { who: "dirigeant", text: "On vient de clôturer à 11 millions de chiffre d'affaires et 4,5 millions de total de bilan. Mon banquier dit qu'il nous faut un commissaire aux comptes. C'est vrai ?" },
      { who: "expert", text: "On vérifie les trois critères : bilan, chiffre d'affaires, salariés. Il en faut deux sur trois dépassés." },
      { who: "dirigeant", text: "Le chiffre d'affaires, oui. Le bilan et l'effectif, non." },
      { who: "expert", text: "Alors un seul critère : pas d'obligation. Mais rien ne vous empêche d'en nommer un volontairement." },
      { who: "narrateur", text: "À l'examen : appliquer les seuils, puis décrire la mission, l'indépendance et la fin du mandat." },
    ],
    cours: [
      { who: "cours", text: "Une société doit nommer un commissaire aux comptes lorsqu'elle dépasse, à la clôture d'un exercice, deux des trois seuils suivants : `5 M€` de total de bilan, `10 M€` de chiffre d'affaires hors taxes, `50` salariés.", key: true },
      { who: "cours", text: "Ces seuils ont été relevés de 25 % par le décret du 28 février 2024, pour les exercices ouverts depuis le 1er janvier 2024." },
      { who: "cours", text: "Dans un groupe, les filiales significatives ont des seuils divisés par deux : 2,5 M€ de bilan, 5 M€ de chiffre d'affaires, 25 salariés." },
      { who: "cours", text: "Le mandat dure `six exercices`. Le commissaire aux comptes certifie que les comptes sont réguliers, sincères et donnent une image fidèle.", key: true },
      { who: "cours", text: "Il doit être indépendant : il ne peut pas fournir à l'entité des services qui le mettraient en situation d'auto-révision, comme tenir sa comptabilité." },
      { who: "cours", text: "Missions légales associées : la procédure d'alerte en cas de faits de nature à compromettre la continuité d'exploitation, et la révélation au procureur des faits délictueux.", key: true },
      { who: "cours", text: "Il vérifie aussi certaines informations : le rapport de gestion, les conventions réglementées, l'égalité entre actionnaires." },
      { who: "cours", text: "Loire Bio : un seul seuil dépassé. Pas d'obligation, mais un audit volontaire peut rassurer la banque." },
    ],
    formules: [
      { nom: "Nomination obligatoire", formule: "2 critères sur 3 dépassés à la clôture : bilan > 5 M€ · CA HT > 10 M€ · effectif > 50", piege: "Utiliser les anciens seuils de la loi PACTE (4 M€ et 8 M€)." },
    ],
    flash: [
      { q: "Bilan 4,5 M€, CA 11 M€, 45 salariés. CAC obligatoire ?", choices: ["Oui", "Non", "Seulement en SA"], answer: 1, why: "Un seul critère dépassé (le CA) sur les deux requis." },
      { q: "Durée du mandat du commissaire aux comptes ?", choices: ["3 exercices", "6 exercices", "Illimitée"], answer: 1, why: "Six exercices." },
      { q: "Le CAC découvre un délit. Il doit…", choices: ["Se taire (secret professionnel)", "Le révéler au procureur", "Démissionner"], answer: 1, why: "Obligation de révélation des faits délictueux au procureur de la République." },
    ],
  },

  // ───────────────────────── UE1 ─────────────────────────
  {
    id: "tva-territorialite",
    ue: "ue1",
    format: "juridique",
    title: "TVA : où est taxée une prestation de services ?",
    ref: "art. 259, 259 A et 283-2 CGI",
    minutes: 9,
    status: "live",
    source: SRC + " (TVA : 42 % des sujets)",
    scene: [
      { who: "narrateur", text: "Paris. Cabinet de conseil Numéris, qui travaille avec des clients en Allemagne." },
      { who: "dirigeant", text: "J'ai facturé une mission à une société de Munich, et une autre à un particulier allemand. Je mets 20 % de TVA française sur les deux ?" },
      { who: "expert", text: "Non. Pour une entreprise cliente, la prestation est taxée chez elle, en Allemagne. C'est elle qui paie la TVA." },
      { who: "dirigeant", text: "Et pour le particulier ?" },
      { who: "expert", text: "Là, la règle générale, c'est la TVA française. Sauf exceptions." },
      { who: "narrateur", text: "À l'examen : identifier le client, appliquer le principe ou l'exception, et préciser qui paie la TVA." },
    ],
    cours: [
      { who: "cours", text: "Prestations de services entre assujettis, dites B2B : elles sont taxées au lieu d'établissement du preneur. Article `259` du CGI.", key: true },
      { who: "cours", text: "Si le prestataire n'est pas établi dans ce pays, c'est le client qui autoliquide la TVA. Le prestataire facture hors taxes avec la mention « autoliquidation »." },
      { who: "cours", text: "Le prestataire français déclare la prestation dans la déclaration européenne de services." },
      { who: "cours", text: "Prestations à des non-assujettis, dites B2C : elles sont taxées au lieu d'établissement du prestataire. Numéris facture donc la TVA française au particulier allemand.", key: true },
      { who: "cours", text: "Exceptions fréquentes à l'examen : les prestations se rattachant à un immeuble sont taxées là où il se trouve, article `259 A`." },
      { who: "cours", text: "Les services électroniques, de télécommunication et de radiodiffusion fournis à des particuliers sont taxés dans le pays du client, avec la déclaration par le guichet unique OSS." },
      { who: "cours", text: "Méthode : qui est le client, assujetti ou non ? Existe-t-il une règle particulière pour ce service ? Qui est redevable de la TVA ?", key: true },
    ],
    flash: [
      { q: "Conseil d'un cabinet français à une entreprise allemande. Lieu de taxation ?", choices: ["France", "Allemagne", "Au choix"], answer: 1, why: "B2B : lieu d'établissement du preneur (art. 259 CGI)." },
      { q: "Qui paie la TVA dans ce cas ?", choices: ["Le prestataire français", "Le client allemand, par autoliquidation", "Personne"], answer: 1, why: "Le preneur autoliquide la TVA." },
      { q: "Travaux sur un immeuble situé en Espagne pour une société française. Lieu ?", choices: ["France", "Espagne", "Lieu du prestataire"], answer: 1, why: "Prestations se rattachant à un immeuble : lieu de l'immeuble (art. 259 A)." },
    ],
  },
  {
    id: "abus-biens-sociaux",
    ue: "ue1",
    format: "juridique",
    title: "L'abus de biens sociaux",
    ref: "art. L. 241-3 et L. 242-6 C. com.",
    minutes: 9,
    status: "live",
    source: SRC + " (sanctions civiles et pénales : 75 % des sujets)",
    scene: [
      { who: "narrateur", text: "Bordeaux. Le commissaire aux comptes de la SAS Garonne Négoce relit le grand livre." },
      { who: "dirigeant", text: "Oui, la société a payé les travaux de ma maison de vacances. Mais je suis associé majoritaire, et je comptais rembourser." },
      { who: "expert", text: "Ça ne change rien. La société a une personnalité distincte de la vôtre. Utiliser ses biens pour vous, de mauvaise foi, c'est un abus de biens sociaux." },
      { who: "dirigeant", text: "Et si personne ne porte plainte ?" },
      { who: "expert", text: "Le commissaire aux comptes doit révéler les faits au procureur. Et la prescription ne court qu'à partir de la découverte." },
      { who: "narrateur", text: "À l'examen : qualifier l'infraction élément par élément, puis les sanctions, la prescription et les suites civiles." },
    ],
    cours: [
      { who: "cours", text: "L'abus de biens sociaux est le fait, pour un dirigeant, de faire des biens ou du crédit de la société un usage contraire à l'intérêt social, à des fins personnelles, de mauvaise foi.", key: true },
      { who: "cours", text: "Textes : article `L. 241-3` pour la SARL, article `L. 242-6` pour la SA, applicable aussi aux dirigeants de SAS." },
      { who: "cours", text: "Élément matériel : un usage des biens ou du crédit de la société. Élément moral : la mauvaise foi, et un intérêt personnel, direct ou indirect." },
      { who: "cours", text: "L'accord des associés n'efface pas l'infraction, et l'intention de rembourser non plus." },
      { who: "cours", text: "Peines : `5 ans` d'emprisonnement et `375 000 €` d'amende.", key: true },
      { who: "cours", text: "Prescription : 6 ans à compter du jour où l'infraction est apparue et a pu être constatée, sans dépasser 12 ans après les faits." },
      { who: "cours", text: "Dans un groupe, une aide entre sociétés peut être justifiée si le groupe est structuré, si l'aide sert un intérêt commun avec une contrepartie, et si elle n'excède pas les capacités de la société qui aide. C'est la jurisprudence Rozenblum.", key: true },
      { who: "cours", text: "Suites civiles : la société peut demander réparation, y compris par l'action d'un associé exercée pour son compte." },
    ],
    flash: [
      { q: "Peine maximale pour un abus de biens sociaux ?", choices: ["2 ans et 75 000 €", "5 ans et 375 000 €", "10 ans et 1 M€"], answer: 1, why: "5 ans d'emprisonnement et 375 000 € d'amende." },
      { q: "L'accord unanime des associés…", choices: ["Fait disparaître l'infraction", "N'efface pas l'infraction", "Divise la peine par deux"], answer: 1, why: "La société a un intérêt propre : l'accord des associés n'est pas un fait justificatif." },
      { q: "Point de départ de la prescription ?", choices: ["Le jour des faits", "Le jour où les faits sont apparus et ont pu être constatés", "La clôture de l'exercice"], answer: 1, why: "6 ans à compter de l'apparition des faits, dans la limite de 12 ans après leur commission." },
    ],
  },

  // ───────────────────────── UE2 ─────────────────────────
  {
    id: "roe-roce-structure",
    ue: "ue2",
    format: "technique",
    title: "ROCE, ROE et structure financière",
    ref: "Rentabilité économique et financière · effet de levier",
    minutes: 9,
    status: "live",
    source: SRC + " (fonds propres : 83 %, ROCE/ROE : 42 % des sujets)",
    scene: [
      { who: "narrateur", text: "Nancy. Conseil d'administration de Lorraine Composites." },
      { who: "dirigeant", text: "On emploie 10 millions de capitaux : 6 de fonds propres, 4 de dette à 5 %. Le résultat d'exploitation est de 1,2 million. Nos actionnaires gagnent combien ?" },
      { who: "expert", text: "On calcule d'abord la rentabilité de l'outil industriel, le ROCE. Puis celle des actionnaires, le ROE." },
      { who: "dirigeant", text: "Et s'endetter davantage, c'est une bonne idée ?" },
      { who: "expert", text: "Oui tant que l'outil rapporte plus que la dette ne coûte. Mais le risque augmente aussi." },
      { who: "narrateur", text: "À l'examen : calculer les deux rentabilités, expliquer l'écart par l'effet de levier, et conclure sur la structure financière." },
    ],
    cours: [
      { who: "cours", text: "Le ROCE mesure la rentabilité des capitaux employés : le résultat d'exploitation après impôt, rapporté aux capitaux propres plus la dette nette.", key: true },
      { who: "cours", text: "Lorraine Composites : 1,2 million fois 0,75, soit 900 000 euros, sur 10 millions. ROCE : `9 %`." },
      { who: "cours", text: "Le ROE mesure la rentabilité pour l'actionnaire : le résultat net sur les capitaux propres." },
      { who: "cours", text: "Résultat net : 1,2 million moins 200 000 euros d'intérêts, soit 1 million avant impôt, 750 000 après. ROE : 750 000 sur 6 millions, soit `12,5 %`.", key: true },
      { who: "cours", text: "On retrouve ce chiffre avec l'effet de levier : 9 % plus, 9 % moins 3,75 % de coût de la dette après impôt, multiplié par 4 sur 6. Soit 9 plus 3,5, donc 12,5 %." },
      { who: "cours", text: "Tant que le ROCE dépasse le coût de la dette après impôt, l'endettement augmente le ROE. Mais il augmente aussi le risque financier et la volatilité du ROE.", key: true },
      { who: "cours", text: "Pour conclure sur la structure financière, croisez avec les ratios de solvabilité : dette nette sur EBITDA, dette nette sur capitaux propres, couverture des intérêts." },
    ],
    formules: [
      { nom: "Rentabilité des capitaux employés", formule: "ROCE = résultat d'exploitation × (1 − t) / (capitaux propres + dette nette)" },
      { nom: "Rentabilité des capitaux propres", formule: "ROE = résultat net / capitaux propres" },
      { nom: "Effet de levier (après impôt)", formule: "ROE = ROCE + [ROCE − i × (1 − t)] × D / CP", legende: ["9 % + (9 % − 3,75 %) × 4/6 = 12,5 %"], piege: "Comparer le ROCE au coût de la dette avant impôt." },
    ],
    flash: [
      { q: "REX 1,2 M€, IS 25 %, capitaux employés 10 M€. ROCE ?", choices: ["9 %", "12 %", "12,5 %"], answer: 0, why: "1,2 × 0,75 / 10 = 9 %." },
      { q: "ROCE 9 %, coût de la dette après impôt 3,75 %, D/CP = 4/6. ROE ?", choices: ["9 %", "12,5 %", "15 %"], answer: 1, why: "9 % + 5,25 % × 4/6 = 12,5 %." },
      { q: "L'effet de levier est positif quand…", choices: ["ROCE > coût de la dette après impôt", "ROE < ROCE", "La dette est nulle"], answer: 0, why: "L'outil rapporte plus que la dette ne coûte." },
    ],
  },

  // ───────────────────────── UE5 ─────────────────────────
  {
    id: "alignement-cloud",
    ue: "ue5",
    format: "technique",
    title: "Alignement stratégique et passage au cloud",
    ref: "Modèle d'alignement stratégique · IaaS, PaaS, SaaS",
    minutes: 9,
    status: "live",
    source: SRC + " (alignement stratégique : 67 %, cloud : 67 % des sujets)",
    scene: [
      { who: "narrateur", text: "Lille. Comité stratégique de Nordic Retail, distributeur de 60 magasins." },
      { who: "dirigeant", text: "On veut ouvrir la vente en ligne l'an prochain. Notre DSI propose de tout migrer dans le cloud. On fonce ?" },
      { who: "expert", text: "D'abord une question : votre SI sert-il votre stratégie ? Si l'objectif est le e-commerce, il faut des outils capables de monter en charge vite." },
      { who: "dirigeant", text: "Et nos données clients, elles seront où ?" },
      { who: "expert", text: "C'est justement un critère de choix : localisation, réversibilité, sécurité. Un cloud mal choisi peut créer une dépendance." },
      { who: "narrateur", text: "À l'examen : analyser l'alignement entre stratégie et SI, comparer les modèles de cloud, puis recommander." },
    ],
    cours: [
      { who: "cours", text: "L'alignement stratégique, c'est la cohérence entre la stratégie de l'entreprise et son système d'information. Un SI aligné permet d'exécuter la stratégie ; un SI mal aligné la freine.", key: true },
      { who: "cours", text: "Le modèle de Henderson et Venkatraman croise deux axes : stratégie et infrastructure, métier et informatique. L'alignement se joue entre ces quatre domaines." },
      { who: "cours", text: "Trois modèles de cloud : l'IaaS fournit l'infrastructure, le PaaS une plateforme de développement, le SaaS un logiciel prêt à l'emploi.", key: true },
      { who: "cours", text: "Avantages : coûts variables plutôt qu'investissements, montée en charge rapide, mises à jour assurées par le fournisseur." },
      { who: "cours", text: "Risques : dépendance au fournisseur, réversibilité difficile, localisation des données et exposition aux lois étrangères, coûts qui dérivent sans pilotage." },
      { who: "cours", text: "Le contrat de service, ou SLA, fixe les engagements : disponibilité, délais d'intervention, pénalités, réversibilité en fin de contrat.", key: true },
      { who: "cours", text: "Pour Nordic Retail : le e-commerce justifie une solution SaaS ou PaaS pour la boutique, avec des données hébergées en Europe et une clause de réversibilité négociée." },
    ],
    formules: [
      { nom: "Modèles de cloud", formule: "IaaS : infrastructure · PaaS : plateforme · SaaS : logiciel", legende: ["Plus on va vers le SaaS, moins l'entreprise gère, et plus elle dépend du fournisseur"] },
      { nom: "Contrat de service (SLA)", formule: "Disponibilité · délais d'intervention · pénalités · réversibilité", piege: "Oublier la réversibilité, c'est-à-dire la récupération des données en fin de contrat." },
    ],
    flash: [
      { q: "Un logiciel de paie utilisé en ligne par abonnement, c'est…", choices: ["IaaS", "PaaS", "SaaS"], answer: 2, why: "Logiciel prêt à l'emploi fourni à distance : SaaS." },
      { q: "La clause qui permet de récupérer ses données en fin de contrat cloud ?", choices: ["Réversibilité", "Exclusivité", "Confidentialité"], answer: 0, why: "La réversibilité organise la sortie et la restitution des données." },
      { q: "L'alignement stratégique désigne…", choices: ["La cohérence entre stratégie et SI", "Le choix d'un ERP", "La sécurité du réseau"], answer: 0, why: "Le SI doit servir la stratégie de l'entreprise." },
    ],
  },
];
