// DSCG UE4 · Comptabilité et audit — suite du programme (IFRS, gouvernance).
// Format « logique comptable » : la règle de droit comptable avant chaque écriture, puis le pourquoi de chaque ligne.
// Cas Zenvise originaux. À FAIRE RELIRE avant vente.
import type { Episode } from "./types";
import { C, D, N, Q, X, ecrit } from "./lot-outils";

const K = ecrit("comptable", "Cas Zenvise, programme DSCG UE4");

export const LOT_DSCG_UE4_B: Episode[] = [
  K({
    id: "ias1-etats-financiers", ue: "ue4",
    title: "IAS 1 : présenter les états financiers", ref: "IAS 1",
    scene: [
      N("Nantes. Atlantique Composants prépare ses premiers états financiers IFRS."),
      D("On garde notre bilan habituel, actif immobilisé et actif circulant ?"),
      X("En IFRS, on raisonne en courant et non courant. Et on peut présenter les charges par nature ou par fonction."),
      N("À l'examen : les principes généraux, puis le classement courant et non courant."),
    ],
    cours: [
      C("IAS 1 fixe les principes généraux : image fidèle, continuité d'exploitation, comptabilité d'engagement, importance relative, non-compensation et permanence de la présentation.", true),
      C("Au bilan, actifs et passifs sont classés en courants et non courants. Est courant ce qui sera réalisé ou réglé dans le cycle d'exploitation, ou dans les `12 mois` suivant la clôture.", true),
      C("Une dette dont l'échéance est dans plus de douze mois est non courante. Sa part remboursable dans l'année passe en courant."),
      C("Au compte de résultat, l'entreprise présente ses charges par nature, comme achats ou salaires, ou par fonction, comme coût des ventes ou frais commerciaux. Par fonction, l'annexe détaille aussi les natures."),
      C("Le résultat global ajoute au résultat net les autres éléments du résultat global, ceux qui vont directement en capitaux propres.", true),
    ],
    flash: [
      Q("Un actif est courant s'il est réalisé :", ["Dans les 12 mois ou le cycle d'exploitation", "Dans les 5 ans", "Dès qu'il est payé"], 0, "IAS 1."),
      Q("Présentation des charges en IFRS :", ["Par nature uniquement", "Par nature ou par fonction", "Par fonction uniquement"], 1, "Avec des informations complémentaires si par fonction."),
      Q("La non-compensation signifie :", ["On ne compense pas actifs et passifs, ni produits et charges", "On ne paie pas d'impôt", "On ne réévalue pas"], 0, "Sauf si une norme l'exige ou l'autorise."),
    ],
    fiche: {
      essentiel: "IAS 1 : principes généraux, bilan courant / non courant (12 mois ou cycle), charges par nature ou par fonction, résultat global.",
      points: [
        "Image fidèle, continuité, engagement, importance relative.",
        "Non-compensation, permanence de présentation.",
        "Courant : cycle d'exploitation ou 12 mois.",
        "Charges par nature ou par fonction.",
        "Résultat global = résultat net + autres éléments du résultat global.",
      ],
      methode: ["Principes", "Classement au bilan", "Présentation du résultat"],
      pieges: ["Garder le classement actif immobilisé / circulant."],
    },
  }),
  K({
    id: "ifrs8-ifrs1", ue: "ue4",
    title: "IFRS 8 et IFRS 1 : secteurs et première adoption", ref: "IFRS 8, IFRS 1",
    scene: [
      N("Lyon. Gourmet Group, qui vient d'entrer en Bourse, passe aux IFRS. Il vend des plats cuisinés, des glaces et des boissons."),
      D("Il faut détailler chaque activité dans nos comptes ?"),
      X("Oui, par secteur opérationnel, tel que votre direction les suit. Et pour la première année, IFRS 1 vous dit comment basculer."),
      N("À l'examen : identifier les secteurs, puis les règles de la première adoption."),
    ],
    cours: [
      C("IFRS 8 s'applique aux sociétés cotées. Un secteur opérationnel est une composante dont les résultats sont revus régulièrement par le principal décideur opérationnel.", true),
      C("Un secteur est à présenter s'il dépasse `10 %` du chiffre d'affaires, du résultat ou des actifs. Les secteurs présentés doivent couvrir au moins `75 %` du chiffre d'affaires externe.", true),
      C("IFRS 1 : le premier bilan IFRS est établi à la date de transition, le début de la première période comparative présentée."),
      C("Principe : appliquer rétrospectivement les normes en vigueur à la clôture. Les écarts avec les anciens comptes sont imputés en capitaux propres.", true),
      C("Il existe des exemptions facultatives, comme retenir la juste valeur comme coût présumé d'une immobilisation, et des exceptions obligatoires, comme l'interdiction de revoir les estimations avec le recul."),
    ],
    flash: [
      Q("Seuil de présentation d'un secteur :", ["5 %", "10 %", "25 %"], 1, "Du chiffre d'affaires, du résultat ou des actifs."),
      Q("Les secteurs présentés couvrent au moins :", ["50 % du CA externe", "75 % du CA externe", "100 %"], 1, "IFRS 8."),
      Q("Première adoption : les écarts de transition vont :", ["En résultat", "En capitaux propres", "En annexe seulement"], 1, "Au bilan d'ouverture."),
    ],
    fiche: {
      essentiel: "IFRS 8 : secteurs suivis par le décideur, seuil de 10 %, couverture de 75 % ; IFRS 1 : bascule rétrospective, écarts en capitaux propres.",
      points: [
        "Secteur : résultats revus par le principal décideur opérationnel.",
        "Seuils de 10 % ; couverture d'au moins 75 % du CA externe.",
        "Date de transition : début de la première période comparative.",
        "Application rétrospective ; écarts en capitaux propres.",
        "Exemptions facultatives, exceptions obligatoires.",
      ],
      methode: ["Secteurs à présenter", "Date de transition", "Retraitements et exemptions"],
      pieges: ["Passer les écarts de première adoption en résultat."],
    },
  }),
  K({
    id: "ias40-immeubles", ue: "ue4",
    title: "IAS 40 : les immeubles de placement", ref: "IAS 40",
    scene: [
      N("Bordeaux. Garonne Patrimoine possède un immeuble de bureaux qu'elle loue à des entreprises. Sa valeur a augmenté de 50 000 euros."),
      D("On l'amortit comme nos locaux ?"),
      X("Vous pouvez. Mais IAS 40 vous laisse le choix : coût amorti, ou juste valeur sans amortissement."),
      N("À l'examen : reconnaître un immeuble de placement, puis appliquer le modèle de la juste valeur."),
    ],
    cours: [
      C("Un immeuble de placement est détenu pour en retirer des loyers, ou pour valoriser le capital. Il n'est pas utilisé pour la production ou l'administration, ni destiné à la vente courante.", true),
      C("L'entreprise choisit un modèle pour tous ses immeubles de placement : le modèle du coût, avec amortissement, ou le modèle de la juste valeur.", true),
      C("Avec la juste valeur, l'immeuble n'est pas amorti. Les variations de juste valeur passent directement en résultat."),
      C("Ici, la juste valeur passe de 1 000 000 à `1 050 000 €` : un produit de 50 000 euros est constaté.", true),
      C("Un immeuble occupé par l'entreprise elle-même relève d'IAS 16, pas d'IAS 40."),
    ],
    ecritures: [
      {
        titre: "Clôture · Hausse de juste valeur",
        droit: "IAS 40 : au modèle de la juste valeur, l'immeuble de placement n'est pas amorti ; la variation de juste valeur est comptabilisée en résultat de l'exercice.",
        lignes: [
          { compte: "—", intitule: "Immeuble de placement", debit: 50000, pourquoi: "L'immeuble vaut plus : l'actif augmente, au débit." },
          { compte: "—", intitule: "Variation de juste valeur (produit)", credit: 50000, pourquoi: "IAS 40 fait passer la hausse en résultat : un produit, au crédit." },
        ],
      },
    ],
    flash: [
      Q("Un immeuble loué à des tiers relève :", ["D'IAS 16", "D'IAS 40", "D'IFRS 16"], 1, "Détenu pour les loyers."),
      Q("Au modèle de la juste valeur, l'immeuble :", ["Est amorti", "N'est pas amorti", "Est déprécié chaque année"], 1, "Seules les variations de juste valeur sont comptabilisées."),
      Q("Les variations de juste valeur vont :", ["En capitaux propres", "En résultat", "En annexe"], 1, "Différence avec la réévaluation IAS 16."),
    ],
    fiche: {
      essentiel: "Immeuble détenu pour loyers ou valorisation ; modèle du coût ou de la juste valeur ; à la juste valeur, pas d'amortissement et variations en résultat.",
      points: [
        "Définition : loyers ou valorisation du capital.",
        "Choix d'un modèle pour tous les immeubles de placement.",
        "Juste valeur : pas d'amortissement.",
        "Variations de juste valeur en résultat.",
        "Immeuble occupé par l'entreprise : IAS 16.",
      ],
      methode: ["Qualification", "Modèle retenu", "Calcul de la variation", "Écriture"],
      pieges: ["Mettre la variation de juste valeur en capitaux propres."],
    },
  }),
  K({
    id: "ias2-stocks", ue: "ue4",
    title: "IAS 2 : évaluer et déprécier les stocks", ref: "IAS 2, PCG art. 213-31",
    scene: [
      N("Lille. Nord Textile a en stock une collection d'hiver qui a coûté 100 000 euros. Elle ne se vendra qu'avec de fortes remises."),
      D("On la garde à 100 000, c'est ce qu'elle nous a coûté."),
      X("Non. Si vous ne pouvez plus en tirer que 85 000, c'est cette valeur qui compte. Le stock est au plus bas des deux."),
      N("À l'examen : le coût, la valeur nette de réalisation, puis la dépréciation."),
    ],
    cours: [
      C("Les stocks sont évalués au plus faible du coût et de la valeur nette de réalisation.", true),
      C("Le coût comprend le coût d'achat, les coûts de transformation et les autres coûts pour amener le stock à l'endroit et dans l'état où il se trouve. Les frais de stockage, l'administration générale et la sous-activité en sont exclus.", true),
      C("Méthodes autorisées : premier entré, premier sorti, ou coût moyen pondéré. Le dernier entré, premier sorti est interdit."),
      C("La valeur nette de réalisation, c'est le prix de vente estimé, moins les coûts d'achèvement et les coûts de vente. Ici : `85 000 €`."),
      C("Le coût de 100 000 dépasse la valeur nette de réalisation : on déprécie le stock de `15 000 €`.", true),
    ],
    ecritures: [
      {
        titre: "Clôture · Dépréciation du stock",
        droit: "IAS 2 et PCG : à la clôture, si la valeur nette de réalisation est inférieure au coût, le stock est ramené à cette valeur par une dépréciation.",
        lignes: [
          { compte: "6817", intitule: "Dotations aux dépréciations des actifs circulants", debit: 15000, pourquoi: "La perte de valeur est une charge de l'exercice où elle apparaît." },
          { compte: "397", intitule: "Dépréciations des stocks de marchandises", credit: 15000, pourquoi: "Corrige la valeur du stock à l'actif : un compte 39 se crédite." },
        ],
      },
    ],
    flash: [
      Q("Les stocks sont évalués :", ["Au coût", "Au plus faible du coût et de la valeur nette de réalisation", "À la juste valeur"], 1, "IAS 2."),
      Q("Méthode interdite :", ["Premier entré, premier sorti", "Coût moyen pondéré", "Dernier entré, premier sorti"], 2, "Interdite en IFRS et en PCG."),
      Q("Les frais de stockage sont :", ["Inclus dans le coût", "Exclus du coût", "Au choix"], 1, "Sauf s'ils sont nécessaires au processus de production."),
    ],
    fiche: {
      essentiel: "Stock au plus faible du coût et de la valeur nette de réalisation ; la différence est une dépréciation.",
      points: [
        "Coût : achat, transformation, autres coûts nécessaires.",
        "Exclus : stockage, administration générale, sous-activité.",
        "Méthodes : premier entré, premier sorti ou coût moyen ; pas de dernier entré.",
        "Valeur nette de réalisation = prix de vente − coûts d'achèvement et de vente.",
        "Dépréciation : 6817 au débit, 39 au crédit.",
      ],
      methode: ["Coût", "Valeur nette de réalisation", "Comparaison", "Écriture"],
      pieges: ["Inclure les frais de sous-activité dans le coût."],
    },
  }),
  K({
    id: "ifrs2-paiements-actions", ue: "ue4",
    title: "IFRS 2 : stock-options et actions gratuites", ref: "IFRS 2",
    scene: [
      N("Grenoble. La start-up Alpes Data, cotée, attribue 10 000 stock-options à ses cadres. Ils pourront les exercer s'ils restent trois ans."),
      D("Ça ne nous coûte rien, on ne sort pas d'argent."),
      X("En IFRS, si. Vous payez vos cadres avec des options : c'est une charge de personnel, étalée sur les trois ans."),
      N("À l'examen : la valeur à retenir, l'étalement, puis l'écriture."),
    ],
    cours: [
      C("IFRS 2 traite les paiements fondés sur des actions : les options et actions gratuites rémunèrent un service. Ce service est une charge.", true),
      C("Si le paiement est réglé en instruments de capitaux propres, on retient la juste valeur des options à la date d'attribution. Elle n'est plus jamais réévaluée.", true),
      C("La charge est étalée sur la période d'acquisition des droits, en contrepartie des capitaux propres. Elle est ajustée du nombre d'options qu'on pense réellement acquises."),
      C("Alpes Data : 10 000 options, d'une juste valeur de 12 euros, soit 120 000 euros, sur 3 ans. Charge annuelle : `40 000 €`.", true),
      C("Si le paiement est réglé en trésorerie, la contrepartie est une dette, réévaluée à chaque clôture."),
    ],
    ecritures: [
      {
        titre: "Fin d'année 1 · Charge de l'exercice",
        droit: "IFRS 2 : les services reçus en échange d'instruments de capitaux propres sont évalués à la juste valeur des instruments à la date d'attribution, et comptabilisés sur la période d'acquisition des droits, en contrepartie des capitaux propres.",
        lignes: [
          { compte: "—", intitule: "Charges de personnel (paiements en actions)", debit: 40000, pourquoi: "Un tiers du service rendu par les cadres cette année : une charge." },
          { compte: "—", intitule: "Réserve pour paiements en actions (capitaux propres)", credit: 40000, pourquoi: "Payé en options, pas en argent : les capitaux propres augmentent au crédit." },
        ],
      },
    ],
    flash: [
      Q("La juste valeur des options réglées en actions est retenue :", ["À chaque clôture", "À la date d'attribution", "À l'exercice des options"], 1, "Elle n'est pas réévaluée."),
      Q("120 000 € sur 3 ans : charge annuelle ?", ["40 000", "120 000", "12 000"], 0, "Étalement sur la période d'acquisition."),
      Q("Contrepartie d'un paiement réglé en actions :", ["Une dette", "Les capitaux propres", "La trésorerie"], 1, "Réglé en trésorerie : une dette."),
    ],
    fiche: {
      essentiel: "Options et actions gratuites : charge de personnel à la juste valeur d'attribution, étalée sur la période d'acquisition, en contrepartie des capitaux propres.",
      points: [
        "Le service rendu est une charge.",
        "Réglé en actions : juste valeur à l'attribution, non réévaluée.",
        "Étalement sur la période d'acquisition des droits.",
        "Ajustement selon le nombre d'options attendues.",
        "Réglé en trésorerie : dette réévaluée.",
      ],
      methode: ["Mode de règlement", "Juste valeur totale", "Étalement", "Écriture"],
      pieges: ["Réévaluer les options réglées en actions à chaque clôture."],
    },
  }),
  K({
    id: "ias20-ias23", ue: "ue4",
    title: "IAS 20 et IAS 23 : subventions et coûts d'emprunt", ref: "IAS 20, IAS 23",
    scene: [
      N("Rouen. Seine Recyclage achète une machine de 300 000 euros, amortie sur 5 ans. La région lui verse une subvention de 60 000 euros."),
      D("En France, on a une subvention en capitaux propres. En IFRS aussi ?"),
      X("Non. IAS 20 interdit de la mettre directement en capitaux propres. Elle passe en résultat, au rythme de l'amortissement."),
      N("À l'examen : traiter la subvention, puis les intérêts d'un emprunt qui finance un actif."),
    ],
    cours: [
      C("Une subvention est comptabilisée quand il existe une assurance raisonnable que l'entreprise respectera les conditions, et qu'elle la recevra.", true),
      C("Elle n'est jamais inscrite directement en capitaux propres. Une subvention liée à un actif est présentée en produit différé, ou en déduction du coût de l'actif.", true),
      C("Seine Recyclage : produit différé de 60 000, repris en résultat au rythme de l'amortissement sur 5 ans, soit `12 000 €` par an."),
      C("IAS 23 : les coûts d'emprunt directement attribuables à la construction ou l'acquisition d'un actif qualifié, qui demande une longue préparation, sont obligatoirement incorporés à son coût.", true),
      C("Les autres coûts d'emprunt sont des charges."),
    ],
    ecritures: [
      {
        titre: "Réception de la subvention",
        droit: "IAS 20 : une subvention liée à un actif est présentée en produit différé ; elle ne peut pas être inscrite directement en capitaux propres.",
        lignes: [
          { compte: "512", intitule: "Banque", debit: 60000, pourquoi: "La région verse l'argent : la trésorerie augmente, au débit." },
          { compte: "487", intitule: "Produit différé (subvention)", credit: 60000, pourquoi: "Produit pas encore gagné : on l'étale, c'est un passif en attendant." },
        ],
      },
      {
        titre: "Fin d'année 1 · Reprise au rythme de l'amortissement",
        droit: "La subvention est rapportée au résultat sur la durée d'utilité de l'actif financé, au même rythme que son amortissement.",
        lignes: [
          { compte: "487", intitule: "Produit différé (subvention)", debit: 12000, pourquoi: "Un cinquième est gagné cette année : le passif diminue, au débit." },
          { compte: "747", intitule: "Quote-part de subvention virée au résultat", credit: 12000, pourquoi: "Le produit compense l'amortissement de la machine : au crédit." },
        ],
      },
    ],
    flash: [
      Q("En IFRS, une subvention d'investissement en capitaux propres :", ["Obligatoire", "Interdite", "Au choix"], 1, "Produit différé ou déduction du coût."),
      Q("60 000 de subvention pour un actif amorti sur 5 ans : reprise annuelle ?", ["12 000", "60 000", "20 000"], 0, "Au rythme de l'amortissement."),
      Q("Intérêts d'un emprunt finançant un actif qualifié :", ["Toujours en charges", "Incorporés au coût de l'actif", "En capitaux propres"], 1, "IAS 23, obligatoire."),
    ],
    fiche: {
      essentiel: "IAS 20 : subvention en produit différé ou en déduction de l'actif, jamais en capitaux propres ; IAS 23 : coûts d'emprunt incorporés aux actifs qualifiés.",
      points: [
        "Comptabilisation : assurance raisonnable de respect des conditions et de réception.",
        "Pas de subvention directement en capitaux propres.",
        "Reprise au rythme de l'amortissement.",
        "Actif qualifié : longue période de préparation.",
        "Coûts d'emprunt attribuables : incorporation obligatoire.",
      ],
      methode: ["Type de subvention", "Présentation", "Reprise", "Coûts d'emprunt"],
      pieges: ["Garder la présentation française en capitaux propres."],
    },
  }),
  K({
    id: "gouvernance-risques", ue: "ue4",
    title: "Gouvernement d'entreprise, comité d'audit et gestion des risques", ref: "art. L. 225-37 C. com., COSO ERM",
    scene: [
      N("Paris. Le conseil de Cité Banque, entité d'intérêt public, prépare son rapport annuel."),
      D("On doit vraiment avoir un comité d'audit ? Le conseil fait déjà tout."),
      X("Pour une entité d'intérêt public, oui. Et le rapport sur le gouvernement d'entreprise doit dire quel code vous suivez."),
      N("À l'examen : le rapport, le comité d'audit, puis l'organisation de la maîtrise des risques."),
    ],
    cours: [
      C("Dans les SA, le conseil présente un rapport sur le gouvernement d'entreprise : mandats des dirigeants, conventions, délégations en matière de capital, et pour les sociétés cotées, les rémunérations.", true),
      C("Les sociétés cotées se réfèrent à un code de gouvernance, comme l'AFEP-MEDEF ou Middlenext, selon la règle « appliquer ou expliquer »."),
      C("Les entités d'intérêt public doivent avoir un comité d'audit. Il suit l'élaboration de l'information financière, l'efficacité du contrôle interne et de la gestion des risques, et l'indépendance des commissaires aux comptes.", true),
      C("La gestion des risques identifie, évalue et traite les risques qui menacent les objectifs. Le référentiel COSO ERM l'intègre à la stratégie."),
      C("Le modèle des trois lignes : les opérationnels gèrent les risques, les fonctions risques et conformité les surveillent, l'audit interne donne une assurance indépendante.", true),
    ],
    flash: [
      Q("La règle des codes de gouvernance :", ["Appliquer ou payer", "Appliquer ou expliquer", "Appliquer obligatoirement"], 1, "AFEP-MEDEF, Middlenext."),
      Q("Le comité d'audit est obligatoire pour :", ["Toutes les SA", "Les entités d'intérêt public", "Les SAS"], 1, "Banques, assurances, sociétés cotées."),
      Q("Dans les trois lignes, l'audit interne est :", ["La première ligne", "La deuxième ligne", "La troisième ligne"], 2, "Assurance indépendante."),
    ],
    fiche: {
      essentiel: "Rapport sur le gouvernement d'entreprise, code « appliquer ou expliquer », comité d'audit pour les entités d'intérêt public, maîtrise des risques en trois lignes.",
      points: [
        "Rapport : mandats, conventions, délégations, rémunérations (cotées).",
        "Codes AFEP-MEDEF ou Middlenext : appliquer ou expliquer.",
        "Comité d'audit : information financière, contrôle interne, risques, indépendance des CAC.",
        "COSO ERM : gestion des risques intégrée à la stratégie.",
        "Trois lignes : opérationnels, fonctions de contrôle, audit interne.",
      ],
      methode: ["Obligations de l'entité", "Organes", "Dispositif de maîtrise des risques"],
      pieges: ["Imposer un comité d'audit à toute société."],
    },
  }),
  K({
    id: "fusion-fiscal-comptable", ue: "ue4",
    title: "Fusion : traitement comptable et fiscal du boni et du mali", ref: "PCG art. 745-1 et s., art. 210 A CGI",
    scene: [
      N("Dijon. Bourgogne Holding absorbe sa filiale à 100 %, Côte Vins, à la valeur comptable. Les titres annulés valaient 500 000 euros ; l'actif net reçu, 700 000."),
      D("On gagne 200 000 euros sur la fusion. C'est un produit imposable ?"),
      X("Comptablement, une partie va en résultat, l'autre en capitaux propres. Fiscalement, sous le régime de faveur, le boni n'est pas imposé."),
      N("À l'examen : découper le boni, puis traiter le mali, en comptabilité et en fiscalité."),
    ],
    cours: [
      C("Le boni de fusion est l'excédent de l'actif net reçu sur la valeur des titres de l'absorbée annulés. Ici, 700 000 moins 500 000 : `200 000 €`.", true),
      C("Comptablement, la part du boni qui correspond aux résultats accumulés par l'absorbée depuis l'acquisition, et non distribués, va en résultat financier. Le reste va en capitaux propres. Ici, 120 000 en produits, 80 000 en prime.", true),
      C("Fiscalement, sous le régime de faveur de l'article 210 A, le boni n'est pas imposable : la part comptabilisée en produit est déduite extra-comptablement."),
      C("Le mali technique, lié aux plus-values latentes des actifs de l'absorbée, est inscrit à l'actif. Il n'est pas déductible immédiatement ; il est pris en compte fiscalement lors de la cession de l'actif auquel il est affecté.", true),
      C("Le vrai mali, qui ne correspond à aucune plus-value latente, est une charge financière en comptabilité, mais il n'est pas déductible fiscalement : on le réintègre."),
    ],
    ecritures: [
      {
        titre: "Chez l'absorbante · Annulation des titres et boni",
        droit: "PCG, titre VII : à la valeur comptable, l'écart positif entre l'actif net reçu et les titres annulés est un boni ; la part correspondant aux résultats accumulés depuis l'acquisition et non distribués est un produit financier, le surplus va en capitaux propres.",
        lignes: [
          { compte: "2 à 5", intitule: "Actifs reçus, nets des dettes reprises", debit: 700000, pourquoi: "L'absorbante reçoit le patrimoine de sa filiale : l'actif augmente." },
          { compte: "261", intitule: "Titres de participation Côte Vins", credit: 500000, pourquoi: "Les titres de la filiale sont annulés : l'actif disparaît, au crédit." },
          { compte: "76", intitule: "Produits financiers (boni sur résultats accumulés)", credit: 120000, pourquoi: "Ces bénéfices auraient pu être distribués en dividendes : un produit financier." },
          { compte: "1042", intitule: "Prime de fusion (boni restant)", credit: 80000, pourquoi: "Le surplus du boni n'est pas un revenu : il va en capitaux propres." },
        ],
      },
    ],
    flash: [
      Q("Part du boni correspondant aux résultats accumulés non distribués :", ["En capitaux propres", "En résultat financier", "En provision"], 1, "Le surplus en capitaux propres."),
      Q("Fiscalement, sous le régime de faveur, le boni est :", ["Imposable", "Non imposable", "Imposé à 15 %"], 1, "Déduction extra-comptable de la part en produit."),
      Q("Le vrai mali de fusion est fiscalement :", ["Déductible", "Non déductible", "Amortissable"], 1, "On le réintègre."),
    ],
    fiche: {
      essentiel: "Boni : résultats accumulés en produit financier, surplus en capitaux propres, non imposable sous 210 A ; mali technique à l'actif ; vrai mali en charge, non déductible.",
      points: [
        "Boni = actif net reçu − titres annulés.",
        "Part des résultats accumulés depuis l'acquisition : résultat financier.",
        "Surplus : capitaux propres.",
        "Régime de faveur : boni non imposable (déduction extra-comptable).",
        "Mali technique : actif, pris en compte à la cession du bien.",
        "Vrai mali : charge financière, réintégrée fiscalement.",
      ],
      methode: ["Calcul du boni ou du mali", "Ventilation comptable", "Écriture", "Retraitements fiscaux"],
      pieges: ["Imposer la part du boni comptabilisée en produit."],
    },
  }),
];
