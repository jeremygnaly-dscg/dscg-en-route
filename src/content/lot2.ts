import type { Episode } from "./types";

// LOT 2 — suite des notions les plus fréquentes aux sujets DSCG 2014-2025.
// Rédigé par Zenvise à partir des textes officiels (CGI, règlements ANC, NEP, RGPD).
// Cours CNAM utilisés comme plan de travail uniquement. À FAIRE RELIRE avant vente.

const SRC = "Cas Zenvise, inspiré des thèmes les plus fréquents aux sujets 2014-2025";

export const LOT2: Episode[] = [
  // ───────────────────────── UE4 ─────────────────────────
  {
    id: "mali-technique",
    ue: "ue4",
    format: "comptable",
    title: "Fusion : boni, mali et mali technique",
    ref: "Règlement ANC n° 2014-03 (art. 745-1 et s.)",
    minutes: 10,
    status: "live",
    source: SRC + " (mali de fusion et mali technique : 83 % des sujets)",
    scene: [
      { who: "narrateur", text: "Marseille. La holding Azur absorbe sa filiale à 100 %, Calanque Immo." },
      { who: "dirigeant", text: "J'ai payé les titres 900 000 euros il y a cinq ans. L'actif net comptable de Calanque n'est que de 600 000. Je perds 300 000 euros dans l'opération ?" },
      { who: "expert", text: "Pas forcément. Le terrain de Calanque vaut 200 000 euros de plus que dans ses comptes. Cette part du mali n'est pas une perte." },
      { who: "dirigeant", text: "Et les 100 000 euros restants ?" },
      { who: "expert", text: "Ça, c'est un vrai mali. Une charge financière." },
      { who: "narrateur", text: "À l'examen : la valeur d'apport, le calcul du mali, sa décomposition, puis les écritures chez l'absorbante." },
    ],
    cours: [
      { who: "cours", text: "Quand l'absorbante détient déjà des titres de l'absorbée, elle annule ces titres. On compare leur valeur comptable à la quote-part d'actif net apporté qu'ils représentent.", key: true },
      { who: "cours", text: "Ici, filiale à 100 % : contrôle commun, donc apports aux valeurs comptables. Actif net apporté : 600 000 euros." },
      { who: "cours", text: "Titres à 900 000 euros contre 600 000 euros d'actif net : `mali de 300 000 €`." },
      { who: "cours", text: "Le mali technique correspond aux plus-values latentes sur les éléments d'actif de l'absorbée, qui n'apparaissent pas à cause des valeurs comptables. Ici, `200 000 €` sur le terrain.", key: true },
      { who: "cours", text: "Le mali technique est inscrit à l'actif, dans un sous-compte rattaché à l'actif sous-jacent, et suit son sort : amortissement, dépréciation, sortie." },
      { who: "cours", text: "Le reste, `100 000 €`, est un vrai mali : il correspond à une perte de valeur réelle. Il est comptabilisé en charge financière.", key: true },
      { who: "cours", text: "Cas inverse : si l'actif net dépasse la valeur des titres, c'est un boni. Il va en produit financier à hauteur des résultats accumulés par l'absorbée depuis l'acquisition et non distribués, le surplus en capitaux propres." },
      { who: "cours", text: "Méthode : toujours calculer d'abord la valeur d'apport selon le contrôle et le sens de l'opération. Toute erreur à ce stade fausse le mali." },
    ],
    ecritures: [
      {
        titre: "Chez Azur · Absorption et annulation des titres",
        regle: "Le mali technique (plus-value latente sur le terrain) va à l'actif ; le vrai mali est une charge financière.",
        lignes: [
          { compte: "2xx-4xx", intitule: "Actifs et passifs apportés (actif net comptable)", debit: 600000 },
          { compte: "2187", intitule: "Mali de fusion sur actifs corporels (terrain)", debit: 200000 },
          { compte: "668", intitule: "Autres charges financières (vrai mali)", debit: 100000 },
          { compte: "261", intitule: "Titres de participation Calanque Immo", credit: 900000 },
        ],
      },
    ],
    formules: [
      { nom: "Mali de fusion", formule: "Mali = valeur comptable des titres − quote-part d'actif net apporté", legende: ["900 000 − 600 000 = 300 000"] },
      { nom: "Décomposition", formule: "Mali = mali technique (plus-values latentes) + vrai mali (charge)", piege: "Le mali technique ne peut pas dépasser les plus-values latentes réellement identifiées." },
    ],
    flash: [
      { q: "Titres 900 k€, actif net apporté 600 k€, plus-value latente 200 k€. Mali technique ?", choices: ["100 k€", "200 k€", "300 k€"], answer: 1, why: "Le mali technique est limité aux plus-values latentes : 200 k€." },
      { q: "Et le vrai mali ?", choices: ["Charge financière de 100 k€", "Actif de 100 k€", "Capitaux propres"], answer: 0, why: "300 − 200 = 100 k€, comptabilisés en charge financière." },
      { q: "Le mali technique suit le sort de…", choices: ["L'actif sous-jacent", "Du fonds commercial seulement", "Du capital"], answer: 0, why: "Il est affecté aux actifs sous-jacents et en suit l'amortissement ou la sortie." },
    ],
  },
  {
    id: "demarche-audit",
    ue: "ue4",
    format: "comptable",
    title: "La démarche d'audit et les NEP",
    ref: "NEP 300, 315, 320, 330, 500, 700",
    minutes: 10,
    status: "live",
    source: SRC + " (démarche générale d'audit : 92 %, NEP : 67 % des sujets)",
    scene: [
      { who: "narrateur", text: "Grenoble. Premier jour de mission du commissaire aux comptes chez Alpitech, fabricant de capteurs." },
      { who: "dirigeant", text: "Vous allez vérifier toutes nos factures ? On en émet 40 000 par an." },
      { who: "expert", text: "Non. Je commence par comprendre votre entreprise et repérer où sont les risques d'anomalies significatives. Je concentre mes travaux là." },
      { who: "dirigeant", text: "Et c'est quoi, une anomalie significative ?" },
      { who: "expert", text: "Une erreur assez importante pour tromper quelqu'un qui lit vos comptes. Je fixe un seuil de signification pour la mesurer." },
      { who: "narrateur", text: "À l'examen : les étapes de la mission, la NEP qui encadre chacune, et le lien entre risque et travaux." },
    ],
    cours: [
      { who: "cours", text: "L'objectif de l'audit légal : obtenir l'assurance raisonnable que les comptes ne comportent pas d'anomalies significatives, puis exprimer une opinion.", key: true },
      { who: "cours", text: "Étape un : la connaissance de l'entité et l'évaluation du risque d'anomalies significatives. NEP `315`." },
      { who: "cours", text: "Étape deux : le seuil de signification, au-delà duquel une erreur influence le jugement d'un utilisateur des comptes. NEP `320`.", key: true },
      { who: "cours", text: "Étape trois : la planification, avec une stratégie générale et un plan de mission. NEP `300`." },
      { who: "cours", text: "Étape quatre : les procédures d'audit mises en œuvre en réponse aux risques, tests de procédures et contrôles de substance. NEP `330`." },
      { who: "cours", text: "Étape cinq : collecter des éléments probants suffisants et appropriés : inspection, observation, confirmation externe, recalcul, procédures analytiques. NEP `500`." },
      { who: "cours", text: "Étape six : le rapport. Certification sans réserve, avec réserve, refus de certifier, ou impossibilité de certifier. NEP `700`.", key: true },
      { who: "cours", text: "Le risque d'audit se décompose en risque inhérent, risque lié au contrôle et risque de non-détection. Plus les deux premiers sont élevés, plus les travaux doivent être poussés pour réduire le troisième." },
    ],
    formules: [
      { nom: "Modèle du risque d'audit", formule: "Risque d'audit = risque inhérent × risque lié au contrôle × risque de non-détection", piege: "Seul le risque de non-détection dépend de l'auditeur : c'est lui qu'on ajuste par l'étendue des travaux." },
    ],
    flash: [
      { q: "Quelle NEP encadre le seuil de signification ?", choices: ["NEP 315", "NEP 320", "NEP 700"], answer: 1, why: "NEP 320 : anomalies significatives et seuil de signification." },
      { q: "Quelle composante du risque d'audit l'auditeur maîtrise-t-il ?", choices: ["Le risque inhérent", "Le risque lié au contrôle", "Le risque de non-détection"], answer: 2, why: "Il le réduit en étendant ou en adaptant ses procédures." },
      { q: "L'audit légal donne une assurance…", choices: ["Absolue", "Raisonnable", "Modérée"], answer: 1, why: "Une assurance raisonnable, élevée mais pas absolue." },
    ],
  },

  // ───────────────────────── UE1 ─────────────────────────
  {
    id: "calcul-is",
    ue: "ue1",
    format: "juridique",
    title: "Du résultat comptable à l'impôt sur les sociétés",
    ref: "art. 39, 209, 216 et 219 CGI",
    minutes: 10,
    status: "live",
    source: SRC + " (impôt sur les sociétés : 58 % des sujets)",
    scene: [
      { who: "narrateur", text: "Dijon. Clôture des comptes de Bourgogne Inox, PME de 40 salariés, 6 millions de chiffre d'affaires." },
      { who: "dirigeant", text: "Notre résultat comptable avant impôt est de 360 000 euros. Donc on paie 25 % de ça ?" },
      { who: "expert", text: "Non. On part de ce résultat avant impôt et on passe au résultat fiscal. Il y a une amende de 5 000 euros, et 100 000 euros de dividendes de votre filiale à 60 %." },
      { who: "dirigeant", text: "Et on est une PME, il n'y a pas un taux réduit ?" },
      { who: "expert", text: "Si, sous conditions, sur les premiers 42 500 euros." },
      { who: "narrateur", text: "À l'examen : un tableau de passage, des réintégrations et des déductions justifiées par un article, puis le calcul de l'impôt." },
    ],
    cours: [
      { who: "cours", text: "Résultat fiscal égale résultat comptable, plus les réintégrations, moins les déductions. On le présente dans un tableau, ligne par ligne, avec le texte qui justifie chaque retraitement.", key: true },
      { who: "cours", text: "Réintégrations classiques : les amendes et pénalités, article `39-2` du CGI, certaines charges somptuaires et la taxe annuelle sur les véhicules. Si l'énoncé donne un résultat après impôt, on réintègre aussi l'IS comptabilisé : il n'est pas déductible de son propre calcul." },
      { who: "cours", text: "Déductions classiques : les dividendes du régime mère-fille, avec réintégration d'une quote-part de frais et charges de 5 %." },
      { who: "cours", text: "Bourgogne Inox : 360 000 de résultat avant impôt, plus 5 000 d'amende, moins 100 000 de dividendes, plus 5 000 de quote-part. Résultat fiscal : `270 000 €`.", key: true },
      { who: "cours", text: "Taux normal : `25 %`. Taux réduit de `15 %` jusqu'à `42 500 €` de bénéfice pour les PME : chiffre d'affaires inférieur à 10 millions, capital entièrement libéré et détenu à au moins 75 % par des personnes physiques. Article `219`.", key: true },
      { who: "cours", text: "Impôt : 42 500 fois 15 %, soit 6 375 euros, plus 227 500 fois 25 %, soit 56 875 euros. Total : `63 250 €`." },
      { who: "cours", text: "Paiement : quatre acomptes, les 15 mars, 15 juin, 15 septembre et 15 décembre, puis le solde le 15 du quatrième mois après la clôture." },
      { who: "cours", text: "Les grandes entreprises paient en plus la contribution sociale de 3,3 %, et le cas échéant la contribution exceptionnelle sur les bénéfices." },
    ],
    formules: [
      { nom: "Résultat fiscal", formule: "RF = résultat comptable + réintégrations − déductions", legende: ["360 000 + 5 000 − 100 000 + 5 000 = 270 000"], piege: "Partir d'un résultat après impôt sans réintégrer l'IS comptabilisé." },
      { nom: "IS d'une PME éligible", formule: "IS = 15 % × 42 500 + 25 % × (RF − 42 500)", legende: ["6 375 + 56 875 = 63 250 €"] },
    ],
    flash: [
      { q: "Une amende fiscale comptabilisée en charge est…", choices: ["Déductible", "Réintégrée", "Déduite deux fois"], answer: 1, why: "Art. 39-2 CGI : amendes et pénalités ne sont pas déductibles." },
      { q: "Plafond de bénéfice imposé à 15 % pour une PME éligible ?", choices: ["38 120 €", "42 500 €", "100 000 €"], answer: 1, why: "42 500 € depuis 2023 (art. 219 CGI)." },
      { q: "Résultat fiscal 270 000 €, PME éligible. IS ?", choices: ["67 500 €", "63 250 €", "40 500 €"], answer: 1, why: "15 % × 42 500 + 25 % × 227 500 = 63 250 €." },
    ],
  },

  // ───────────────────────── UE5 ─────────────────────────
  {
    id: "securite-si-rgpd",
    ue: "ue5",
    format: "technique",
    title: "Sécurité du SI et RGPD",
    ref: "RGPD (règlement UE 2016/679) · PSSI · PCA/PRA",
    minutes: 9,
    status: "live",
    source: SRC + " (sécurité du SI : 67 %, RGPD : 42 % des sujets)",
    scene: [
      { who: "narrateur", text: "Reims. Un lundi matin, les écrans du cabinet comptable Champagne Expertise affichent une demande de rançon." },
      { who: "dirigeant", text: "Tous nos dossiers clients sont chiffrés. Les pirates demandent 50 000 euros. Qu'est-ce qu'on fait ?" },
      { who: "expert", text: "On ne paie pas. On isole le réseau, on restaure les sauvegardes, et on prévient la CNIL : des données personnelles de clients sont touchées." },
      { who: "dirigeant", text: "On a combien de temps pour la CNIL ?" },
      { who: "expert", text: "72 heures après en avoir pris connaissance." },
      { who: "narrateur", text: "À l'examen : identifier les risques, proposer des mesures de sécurité, et rappeler les obligations du RGPD." },
    ],
    cours: [
      { who: "cours", text: "La sécurité du SI protège quatre critères : la disponibilité, l'intégrité, la confidentialité et la preuve, ou traçabilité. On les retient sous le sigle `DICP`.", key: true },
      { who: "cours", text: "La politique de sécurité, ou PSSI, fixe les règles : gestion des accès, mots de passe et double authentification, mises à jour, sensibilisation du personnel." },
      { who: "cours", text: "Plan de continuité et plan de reprise : le PCA maintient l'activité pendant l'incident, le PRA la redémarre ensuite. Les sauvegardes doivent être régulières, testées et pour l'une d'elles hors ligne.", key: true },
      { who: "cours", text: "L'approche Zero Trust ne fait confiance à aucun accès par défaut, même depuis le réseau interne : chaque accès est vérifié." },
      { who: "cours", text: "RGPD : un traitement de données personnelles doit être licite, limité à une finalité, minimisé, exact, conservé pour une durée limitée et sécurisé." },
      { who: "cours", text: "Le responsable de traitement tient un registre des traitements et notifie toute violation de données à la CNIL dans les `72 heures`. Article `33` du RGPD.", key: true },
      { who: "cours", text: "Sanctions : jusqu'à `20 millions d'euros` ou `4 %` du chiffre d'affaires annuel mondial, le montant le plus élevé étant retenu." },
      { who: "cours", text: "À l'examen, classez vos recommandations par critère DICP ou par niveau de priorité, et chiffrez leur coût quand le sujet donne des données." },
    ],
    formules: [
      { nom: "Critères de sécurité", formule: "DICP = Disponibilité · Intégrité · Confidentialité · Preuve", legende: ["Disponibilité : le SI fonctionne quand on en a besoin", "Intégrité : les données ne sont pas altérées", "Confidentialité : seules les personnes autorisées y accèdent", "Preuve : on sait qui a fait quoi"] },
      { nom: "Notification RGPD", formule: "Violation de données → CNIL sous 72 h (art. 33)", piege: "Confondre avec l'information des personnes concernées, exigée seulement en cas de risque élevé (art. 34)." },
    ],
    flash: [
      { q: "Délai de notification d'une violation de données à la CNIL ?", choices: ["24 h", "72 h", "1 mois"], answer: 1, why: "72 heures après en avoir pris connaissance (art. 33 RGPD)." },
      { q: "Le PRA sert à…", choices: ["Maintenir l'activité pendant l'incident", "Redémarrer après l'incident", "Former le personnel"], answer: 1, why: "Le PCA maintient, le PRA redémarre." },
      { q: "Sanction maximale RGPD ?", choices: ["4 % du CA mondial ou 20 M€", "1 M€", "10 % du résultat"], answer: 0, why: "Le plus élevé de 20 M€ ou 4 % du CA annuel mondial." },
    ],
  },

  // ───────────────────────── UE2 ─────────────────────────
  {
    id: "van-tri",
    ue: "ue2",
    format: "technique",
    title: "VAN, TRI et choix d'investissement",
    ref: "Politique d'investissement · flux nets de trésorerie",
    minutes: 10,
    status: "live",
    source: SRC + " (flux de trésorerie : 58 % des sujets, VAN/TRI en 2025)",
    scene: [
      { who: "narrateur", text: "Clermont-Ferrand. Volcania Pneus envisage une nouvelle ligne de rechapage." },
      { who: "dirigeant", text: "La machine coûte 100 000 euros. Elle rapportera 30 000 euros nets par an pendant cinq ans. On a nos 150 000 euros de gains au bout, c'est rentable, non ?" },
      { who: "expert", text: "Un euro dans cinq ans ne vaut pas un euro aujourd'hui. Il faut actualiser au coût du capital. Le vôtre est de 8 %." },
      { who: "dirigeant", text: "Et si on hésite avec un autre projet ?" },
      { who: "expert", text: "On compare les VAN, et on regarde le TRI pour savoir quelle marge de sécurité on a." },
      { who: "narrateur", text: "À l'examen : construire les flux nets de trésorerie, puis la VAN, le TRI et le délai de récupération, et conclure." },
    ],
    cours: [
      { who: "cours", text: "Le flux net de trésorerie d'une année, c'est l'excédent d'exploitation après impôt, plus l'économie d'impôt sur les amortissements, moins la variation du BFR et les investissements.", key: true },
      { who: "cours", text: "La valeur actuelle nette compare l'investissement aux flux futurs actualisés au coût du capital. Un projet est rentable si sa VAN est positive." },
      { who: "cours", text: "Volcania : 30 000 euros par an pendant 5 ans, actualisés à 8 %, valent 119 781 euros. VAN : `19 781 €`. Projet rentable.", key: true },
      { who: "cours", text: "Le taux de rentabilité interne est le taux qui annule la VAN. Ici, environ `15,2 %`, bien au-dessus des 8 % exigés." },
      { who: "cours", text: "L'indice de profitabilité rapporte les flux actualisés à l'investissement : 119 781 sur 100 000, soit 1,20. Utile quand le capital est rationné." },
      { who: "cours", text: "Le délai de récupération indique quand l'investissement est remboursé. Sans actualisation : 100 000 sur 30 000, soit 3 ans et 4 mois." },
      { who: "cours", text: "Deux projets exclusifs peuvent se contredire entre VAN et TRI. On privilégie alors la VAN, qui mesure la création de valeur en euros.", key: true },
      { who: "cours", text: "Pièges : oublier la valeur résiduelle et la récupération du BFR en dernière année, ou actualiser des flux comptables au lieu de flux de trésorerie." },
    ],
    formules: [
      { nom: "Valeur actuelle nette", formule: "VAN = −I₀ + Σ FNTₜ / (1 + k)ᵗ", legende: ["I₀ : investissement initial", "FNTₜ : flux net de trésorerie de l'année t", "k : coût du capital"] },
      { nom: "Flux constants (annuité)", formule: "Σ = FNT × [1 − (1 + k)⁻ⁿ] / k", legende: ["30 000 × 3,9927 = 119 781"] },
      { nom: "Taux de rentabilité interne", formule: "TRI : taux t tel que VAN(t) = 0", piege: "Projets exclusifs : en cas de conflit VAN/TRI, retenir la VAN." },
      { nom: "Indice de profitabilité", formule: "IP = Σ flux actualisés / I₀ = 1 + VAN / I₀" },
    ],
    flash: [
      { q: "VAN positive signifie…", choices: ["Le projet crée de la valeur", "Le TRI est inférieur à k", "Le projet est remboursé en 1 an"], answer: 0, why: "Les flux actualisés dépassent l'investissement." },
      { q: "Projets exclusifs, VAN et TRI se contredisent. On retient…", choices: ["Le TRI", "La VAN", "Le délai de récupération"], answer: 1, why: "La VAN mesure la création de valeur en euros." },
      { q: "Flux de 30 000 €/an, investissement 100 000 €. Délai de récupération non actualisé ?", choices: ["3 ans et 4 mois", "5 ans", "2 ans"], answer: 0, why: "100 000 / 30 000 = 3,33 ans." },
    ],
  },
  {
    id: "evaluation-dcf",
    ue: "ue2",
    format: "technique",
    title: "Évaluer une entreprise par les flux (DCF)",
    ref: "Flux de trésorerie disponibles · Gordon-Shapiro",
    minutes: 11,
    status: "live",
    source: SRC + " (méthodes d'évaluation : 50 % des sujets)",
    scene: [
      { who: "narrateur", text: "Strasbourg. Un fonds veut racheter Rhénatec, éditeur de logiciels industriels." },
      { who: "dirigeant", text: "On génère 1 million de trésorerie disponible cette année, puis 1,1 et 1,2. Ensuite, on croîtra de 2 % par an. Combien je vaux ?" },
      { who: "expert", text: "On actualise ces flux au CMPC, 8 %, et on ajoute une valeur terminale pour l'après." },
      { who: "dirigeant", text: "Et ma dette de 4 millions ?" },
      { who: "expert", text: "On la retire à la fin. Le DCF donne la valeur de l'entreprise. Les actionnaires, eux, récupèrent ce qui reste après la dette nette." },
      { who: "narrateur", text: "À l'examen : calculer les flux disponibles, la valeur terminale, actualiser, puis passer à la valeur des capitaux propres." },
    ],
    cours: [
      { who: "cours", text: "Le flux de trésorerie disponible, c'est l'excédent brut d'exploitation, moins l'impôt sur le résultat d'exploitation, moins les investissements et la variation du BFR. Il revient à tous les financeurs.", key: true },
      { who: "cours", text: "On l'actualise donc au CMPC, qui rémunère actionnaires et prêteurs." },
      { who: "cours", text: "Rhénatec : 1 000 sur 1,08, plus 1 100 sur 1,08 au carré, plus 1 200 sur 1,08 au cube. Soit environ `2 822 k€`." },
      { who: "cours", text: "Valeur terminale avec la formule de Gordon-Shapiro : le flux de l'année suivante, 1 200 fois 1,02, divisé par 8 % moins 2 %. Soit `20 400 k€` à la fin de l'année 3.", key: true },
      { who: "cours", text: "Actualisée sur trois ans : environ 16 194 k€. Valeur de l'entreprise : 2 822 plus 16 194, soit environ `19 016 k€`." },
      { who: "cours", text: "Valeur des capitaux propres : valeur de l'entreprise moins dette nette. 19 016 moins 4 000, soit environ `15 016 k€`.", key: true },
      { who: "cours", text: "La valeur terminale pèse ici plus de 80 % du total. Le correcteur attend un commentaire sur la sensibilité au taux de croissance et au CMPC." },
      { who: "cours", text: "Croisez toujours avec une autre méthode, par les multiples ou patrimoniale, et justifiez l'écart." },
    ],
    formules: [
      { nom: "Flux de trésorerie disponible", formule: "FTD = EBE − IS sur résultat d'exploitation − investissements − Δ BFR" },
      { nom: "Valeur terminale (Gordon-Shapiro)", formule: "VT = FTDₙ₊₁ / (CMPC − g)", legende: ["g : taux de croissance à l'infini, inférieur au CMPC"], piege: "Utiliser FTDₙ au lieu de FTDₙ₊₁ = FTDₙ × (1 + g)." },
      { nom: "Valeur de l'entreprise", formule: "VE = Σ FTDₜ / (1 + CMPC)ᵗ + VT / (1 + CMPC)ⁿ" },
      { nom: "Valeur des capitaux propres", formule: "VCP = VE − dette financière nette" },
    ],
    flash: [
      { q: "Le DCF actualise les flux disponibles au…", choices: ["Coût des capitaux propres", "CMPC", "Taux sans risque"], answer: 1, why: "Les FTD reviennent à tous les financeurs : on actualise au CMPC." },
      { q: "FTD année 3 = 1 200, g = 2 %, CMPC = 8 %. Valeur terminale ?", choices: ["15 000", "20 000", "20 400"], answer: 2, why: "1 200 × 1,02 / (8 % − 2 %) = 20 400." },
      { q: "Valeur des capitaux propres = …", choices: ["VE + dette nette", "VE − dette nette", "VE × CMPC"], answer: 1, why: "On retire la dette financière nette de la valeur de l'entreprise." },
    ],
  },
];
