// DSCG UE4 · Comptabilité et audit — notions prioritaires (consolidation, fusions, IFRS, audit).
// Format « logique comptable » : la règle de droit comptable avant chaque écriture, puis le pourquoi de chaque ligne.
// Cas Zenvise originaux. À FAIRE RELIRE avant vente.
import type { Episode } from "./types";
import { C, D, N, Q, X, ecrit } from "./lot-outils";

const K = ecrit("comptable", "Cas Zenvise, programme DSCG UE4");

export const LOT_DSCG_UE4_A: Episode[] = [
  K({
    id: "methodes-preferentielles", ue: "ue4",
    title: "Consolidation : retraiter le crédit-bail", ref: "Règl. ANC 2020-01",
    scene: [
      N("Angers. Le groupe Loire Industrie consolide sa filiale, qui utilise une machine de 100 000 euros en crédit-bail."),
      D("Dans les comptes de la filiale, on a juste une redevance en charges. Ça ne suffit pas ?"),
      X("Non. En consolidation, le crédit-bail est retraité : la machine va à l'actif, et la dette au passif, comme si le groupe l'avait achetée à crédit."),
      N("À l'examen : la règle, puis les deux écritures de retraitement."),
    ],
    cours: [
      C("Depuis le règlement ANC 2020-01, certaines anciennes méthodes préférentielles sont obligatoires en consolidation. Notamment le retraitement des contrats de location-financement, et la provision pour retraites.", true),
      C("Retraiter le crédit-bail, c'est faire primer la réalité économique : le groupe utilise la machine comme s'il en était propriétaire."),
      C("La machine est inscrite à l'actif pour `100 000 €`, avec en face un emprunt du même montant.", true),
      C("La redevance annuelle de `25 046 €` disparaît. Elle est remplacée par 8 000 euros d'intérêts, à 8 %, et 17 046 euros de remboursement de l'emprunt."),
      C("La machine est amortie sur 5 ans : `20 000 €` par an. Les charges consolidées passent de 25 046 à 28 000 euros : un impôt différé actif est constaté sur l'écart.", true),
    ],
    ecritures: [
      {
        titre: "Début du contrat · Machine à l'actif",
        droit: "Règl. ANC 2020-01 : en consolidation, les biens pris en location-financement sont obligatoirement inscrits à l'actif, avec une dette financière en contrepartie.",
        lignes: [
          { compte: "2154", intitule: "Matériel industriel", debit: 100000, pourquoi: "Le groupe contrôle la machine : c'est un actif, il augmente au débit." },
          { compte: "164", intitule: "Emprunts auprès des établissements de crédit", credit: 100000, pourquoi: "Les redevances futures sont une dette : le passif augmente au crédit." },
        ],
      },
      {
        titre: "Fin d'année 1 · Annuler la redevance",
        droit: "La redevance est un remboursement d'emprunt avec ses intérêts : on l'élimine des charges.",
        lignes: [
          { compte: "164", intitule: "Emprunts", debit: 17046, pourquoi: "Part de capital remboursée : la dette diminue, au débit." },
          { compte: "661", intitule: "Charges d'intérêts", debit: 8000, pourquoi: "8 % de 100 000 : le coût du financement, une charge au débit." },
          { compte: "612", intitule: "Redevances de crédit-bail", credit: 25046, pourquoi: "On annule la charge de loyer des comptes sociaux : une charge diminue au crédit." },
        ],
      },
      {
        titre: "Fin d'année 1 · Amortir la machine",
        droit: "Le bien inscrit à l'actif est amorti sur sa durée d'utilisation, comme un bien acheté.",
        lignes: [
          { compte: "6811", intitule: "Dotations aux amortissements", debit: 20000, pourquoi: "La consommation de la machine sur l'année : une charge, au débit." },
          { compte: "28154", intitule: "Amortissements du matériel", credit: 20000, pourquoi: "Diminue la valeur de l'actif : un compte 28 se crédite." },
        ],
      },
    ],
    flash: [
      Q("En consolidation selon l'ANC 2020-01, le retraitement du crédit-bail est :", ["Interdit", "Facultatif", "Obligatoire"], 2, "Ancienne méthode préférentielle devenue obligatoire."),
      Q("La redevance de crédit-bail est remplacée par :", ["Une provision", "Des intérêts, un remboursement d'emprunt et un amortissement", "Une charge exceptionnelle"], 1, "Comme un achat financé à crédit."),
      Q("Le compte 28154 est crédité parce que :", ["C'est un passif", "Il diminue la valeur de l'actif", "C'est un produit"], 1, "Les comptes 28 sont des corrections de l'actif."),
    ],
    fiche: {
      essentiel: "En consolidation, le crédit-bail est obligatoirement retraité : actif + emprunt, puis intérêts, remboursement et amortissement à la place de la redevance.",
      points: [
        "ANC 2020-01 : retraitement du crédit-bail et provision pour retraites obligatoires.",
        "Entrée : 2154 au débit, 164 au crédit.",
        "Redevance annulée : 164 et 661 au débit, 612 au crédit.",
        "Amortissement : 6811 au débit, 28154 au crédit.",
        "Écart de résultat : impôt différé.",
      ],
      methode: ["Règle applicable", "Inscription à l'actif", "Annulation de la redevance", "Amortissement", "Impôt différé"],
      pieges: ["Oublier de séparer intérêts et capital dans la redevance."],
    },
  }),
  K({
    id: "variation-pourcentage", ue: "ue4",
    title: "Racheter les minoritaires : variation du pourcentage d'intérêt", ref: "Règl. ANC 2020-01, IFRS 10",
    scene: [
      N("Strasbourg. La société Rhin Holding détient 70 % de sa filiale Vosges. Elle rachète 10 % de plus aux minoritaires pour 150 000 euros."),
      D("On contrôlait déjà Vosges. Ce rachat crée un nouvel écart d'acquisition ?"),
      X("Non. Le contrôle ne change pas : c'est une transaction entre actionnaires. L'écart passe en capitaux propres."),
      N("À l'examen : distinguer les cas, puis passer l'écriture."),
    ],
    cours: [
      C("Une fois le contrôle exclusif acquis, un achat complémentaire de titres ne modifie pas le contrôle. C'est une transaction entre actionnaires du groupe.", true),
      C("On ne réévalue pas les actifs, et on ne crée pas de nouvel écart d'acquisition. La différence entre le prix payé et la quote-part de capitaux propres rachetée est imputée sur les capitaux propres du groupe.", true),
      C("Vosges a 1 000 000 d'euros de capitaux propres. Les 10 % rachetés représentent `100 000 €` d'intérêts minoritaires. Le prix est de 150 000 : l'écart de `50 000 €` diminue les réserves du groupe."),
      C("En IFRS 10, c'est la même logique, et une cession partielle sans perte de contrôle se traite aussi en capitaux propres."),
      C("En cas de perte de contrôle, au contraire, on constate un résultat de cession, et en IFRS, la participation conservée est réévaluée à sa juste valeur.", true),
    ],
    ecritures: [
      {
        titre: "Rachat de 10 % aux minoritaires",
        droit: "Règl. ANC 2020-01 et IFRS 10 : sans changement de contrôle, l'écart entre le prix et la quote-part acquise est imputé en capitaux propres, sans nouvel écart d'acquisition.",
        lignes: [
          { compte: "—", intitule: "Intérêts minoritaires", debit: 100000, pourquoi: "Les minoritaires ont 10 % de moins : leur part des capitaux propres diminue, au débit." },
          { compte: "—", intitule: "Réserves consolidées (part du groupe)", debit: 50000, pourquoi: "Surcoût payé aux minoritaires : il réduit les capitaux propres du groupe." },
          { compte: "512", intitule: "Banque", credit: 150000, pourquoi: "Le groupe paie : la trésorerie, un actif, diminue au crédit." },
        ],
      },
    ],
    flash: [
      Q("Rachat de minoritaires sans changement de contrôle :", ["Nouvel écart d'acquisition", "Écart imputé en capitaux propres", "Produit exceptionnel"], 1, "Transaction entre actionnaires."),
      Q("Quote-part rachetée de 10 % sur 1 000 000 de capitaux propres :", ["10 000", "100 000", "150 000"], 1, "Elle sort des intérêts minoritaires."),
      Q("Perte de contrôle : en IFRS, la participation conservée est :", ["Gardée à son coût", "Réévaluée à la juste valeur", "Annulée"], 1, "Et un résultat de cession est constaté."),
    ],
    fiche: {
      essentiel: "Sans changement de contrôle, une variation de pourcentage est une transaction entre actionnaires, en capitaux propres ; la perte de contrôle génère un résultat.",
      points: [
        "Contrôle maintenu : pas de réévaluation, pas de nouvel écart d'acquisition.",
        "Écart prix / quote-part : en capitaux propres du groupe.",
        "Les intérêts minoritaires diminuent de la quote-part rachetée.",
        "IFRS 10 : même logique, y compris pour les cessions partielles.",
        "Perte de contrôle : résultat de cession, réévaluation du reliquat en IFRS.",
      ],
      methode: ["Le contrôle change-t-il ?", "Quote-part rachetée", "Écart en capitaux propres", "Écriture"],
      pieges: ["Calculer un écart d'acquisition complémentaire."],
    },
  }),
  K({
    id: "conversion-comptes", ue: "ue4",
    title: "Convertir les comptes d'une filiale étrangère", ref: "Règl. ANC 2020-01, IAS 21",
    scene: [
      N("Paris. Le groupe Seine Media consolide sa filiale américaine, détenue à 80 %, qui tient ses comptes en dollars."),
      D("On prend un seul taux de change pour tout ?"),
      X("Non. Bilan au cours de clôture, résultat au cours moyen, capitaux propres au cours historique. Et l'écart qui en résulte va en capitaux propres."),
      N("À l'examen : choisir la méthode, puis calculer l'écart de conversion."),
    ],
    cours: [
      C("Une filiale autonome, qui opère dans sa propre monnaie, est convertie par la méthode du cours de clôture. En IFRS, sa monnaie fonctionnelle est le dollar.", true),
      C("Actifs et passifs : au cours de clôture. Produits et charges : au cours moyen de l'exercice. Capitaux propres d'origine : au cours historique.", true),
      C("Exemple. Capitaux propres d'origine : 1 000 milliers de dollars à 1 dollar pour 1 euro, soit 1 000 milliers d'euros. Résultat : 200 milliers de dollars au cours moyen de 1,25, soit 160."),
      C("Actif net à la clôture : 1 200 milliers de dollars au cours de 1,50, soit 800. L'écart : 800 moins 1 160, soit `moins 360`. Il est inscrit en capitaux propres, partagé entre le groupe pour 288 et les minoritaires pour 72.", true),
      C("Une filiale non autonome, simple prolongement de la mère, utilise la méthode du cours historique : l'écart passe alors en résultat."),
    ],
    flash: [
      Q("Filiale autonome : le résultat est converti au :", ["Cours de clôture", "Cours moyen", "Cours historique"], 1, "Le bilan au cours de clôture."),
      Q("Méthode du cours de clôture : l'écart de conversion va :", ["En résultat", "En capitaux propres", "En provision"], 1, "Partagé entre groupe et minoritaires."),
      Q("Écart total de −360, mère à 80 % : part du groupe ?", ["−360", "−288", "−72"], 1, "80 % de −360."),
    ],
    fiche: {
      essentiel: "Filiale autonome : bilan au cours de clôture, résultat au cours moyen, capitaux propres au cours historique ; l'écart va en capitaux propres.",
      points: [
        "Autonome (IAS 21 : monnaie fonctionnelle locale) : cours de clôture.",
        "Actifs et passifs : cours de clôture.",
        "Résultat : cours moyen.",
        "Capitaux propres d'origine : cours historique.",
        "Écart en capitaux propres, partagé groupe / minoritaires.",
        "Non autonome : cours historique, écart en résultat.",
      ],
      methode: ["Autonome ou non ?", "Convertir chaque bloc", "Calculer l'écart", "Le partager"],
      pieges: ["Mettre l'écart en résultat avec la méthode du cours de clôture."],
    },
  }),
  K({
    id: "documents-consolides", ue: "ue4",
    title: "Les documents de synthèse consolidés", ref: "Règl. ANC 2020-01, IAS 1",
    scene: [
      N("Clermont-Ferrand. Première consolidation pour le groupe Volcans Distribution."),
      D("Un bilan et un compte de résultat consolidés, et c'est bon ?"),
      X("Il en faut cinq. Et la part des minoritaires doit apparaître partout."),
      N("À l'examen : citer les documents, et savoir où vont les intérêts minoritaires."),
    ],
    cours: [
      C("En règles françaises, les comptes consolidés comprennent cinq documents : le bilan, le compte de résultat, le tableau des flux de trésorerie, le tableau de variation des capitaux propres et l'annexe.", true),
      C("Le tableau des flux de trésorerie et le tableau de variation des capitaux propres sont obligatoires en consolidation, alors qu'ils ne le sont pas dans les comptes individuels."),
      C("En IFRS, IAS 1 prévoit l'état de la situation financière, l'état du résultat net et des autres éléments du résultat global, la variation des capitaux propres, les flux de trésorerie et les notes.", true),
      C("Les autres éléments du résultat global regroupent ce qui ne passe pas par le résultat : écarts de conversion, écarts actuariels, certaines réévaluations."),
      C("Partout, on distingue la part du groupe et la part des minoritaires : dans les capitaux propres, et dans le résultat.", true),
    ],
    flash: [
      Q("En consolidation française, le tableau des flux de trésorerie est :", ["Facultatif", "Obligatoire", "Interdit"], 1, "Avec le tableau de variation des capitaux propres."),
      Q("Combien de documents dans les comptes consolidés français ?", ["Trois", "Cinq", "Sept"], 1, "Bilan, résultat, flux, variation des capitaux propres, annexe."),
      Q("Un écart actuariel en IFRS figure dans :", ["Le résultat net", "Les autres éléments du résultat global", "L'annexe seulement"], 1, "Il ne passe pas par le résultat net."),
    ],
    fiche: {
      essentiel: "Cinq documents consolidés, dont le tableau des flux et la variation des capitaux propres ; part du groupe et part des minoritaires toujours distinguées.",
      points: [
        "ANC 2020-01 : bilan, compte de résultat, flux de trésorerie, variation des capitaux propres, annexe.",
        "IAS 1 : situation financière, résultat global, variation des capitaux propres, flux, notes.",
        "Autres éléments du résultat global : conversion, écarts actuariels, réévaluations.",
        "Part du groupe et intérêts minoritaires présentés séparément.",
      ],
      methode: ["Référentiel", "Liste des documents", "Présentation des minoritaires"],
      pieges: ["Oublier le tableau de variation des capitaux propres."],
    },
  }),
  K({
    id: "fusion-retroactivite", ue: "ue4",
    title: "Traité de fusion : date d'effet et rétroactivité", ref: "art. L. 236-4 C. com., PCG titre VII",
    scene: [
      N("Rennes. Breizh Alim absorbe Armor Frais. Le traité est signé en avril, la fusion approuvée en juin, avec effet au 1er janvier."),
      D("Les ventes d'Armor entre janvier et juin, elles sont à qui ?"),
      X("À vous. Avec la rétroactivité, Armor a travaillé pour votre compte depuis le 1er janvier."),
      N("À l'examen : les dates, la limite légale, et le sort des opérations intercalaires."),
    ],
    cours: [
      C("On distingue la date juridique de la fusion, celle de la dernière assemblée qui l'approuve, et la date d'effet comptable et fiscale, fixée par le traité.", true),
      C("Le traité peut prévoir un effet rétroactif. Limite : la date d'effet ne peut pas être antérieure à la clôture du dernier exercice clos de l'absorbée, ni postérieure à la clôture de l'exercice en cours de l'absorbante.", true),
      C("Les opérations réalisées par l'absorbée entre la date d'effet et la date juridique sont les opérations intercalaires. Elles sont réputées faites pour le compte de l'absorbante."),
      C("Le résultat intercalaire de l'absorbée est donc repris dans le résultat de l'absorbante. Fiscalement, la rétroactivité est admise dans les mêmes limites.", true),
      C("Les apports sont évalués à la date d'effet. Le traité doit en indiquer la méthode, la parité d'échange et le montant de la prime de fusion."),
    ],
    flash: [
      Q("La date d'effet rétroactive ne peut pas être antérieure :", ["À la création de l'absorbée", "À la clôture du dernier exercice clos de l'absorbée", "À la signature du traité"], 1, "Art. L. 236-4 C. com."),
      Q("Les opérations intercalaires sont faites pour le compte :", ["De l'absorbée", "De l'absorbante", "Des associés"], 1, "Effet de la rétroactivité."),
      Q("La date juridique de la fusion est en principe :", ["La signature du traité", "La date de la dernière assemblée", "Le 1er janvier"], 1, "Sauf date convenue dans le traité."),
    ],
    fiche: {
      essentiel: "La fusion peut rétroagir au plus tôt à la clôture du dernier exercice clos de l'absorbée ; les opérations intercalaires sont faites pour le compte de l'absorbante.",
      points: [
        "Date juridique : dernière assemblée, sauf date convenue.",
        "Date d'effet comptable et fiscale : fixée par le traité.",
        "Limites de l'art. L. 236-4 C. com.",
        "Résultat intercalaire repris par l'absorbante.",
        "Traité : méthode d'évaluation, parité, prime de fusion.",
      ],
      methode: ["Dates", "Rétroactivité possible ?", "Opérations intercalaires", "Conséquences comptables"],
      pieges: ["Faire rétroagir avant la clôture du dernier exercice clos."],
    },
  }),
  K({
    id: "fusion-renonciation", ue: "ue4",
    title: "Fusion-renonciation : quand l'absorbante détient déjà des titres", ref: "PCG titre VII, art. L. 236-3 C. com.",
    scene: [
      N("Metz. Lorraine Acier absorbe Moselle Tubes, dont elle détient déjà 20 %."),
      D("On va s'attribuer nos propres actions en échange de nos titres Moselle ?"),
      X("Non, ce serait absurde. Vous renoncez à émettre des titres pour vous-même. Seuls les autres associés sont rémunérés."),
      N("À l'examen : calculer le nombre de titres à créer, puis la prime de fusion."),
    ],
    cours: [
      C("Une société ne peut pas recevoir ses propres actions en échange des titres qu'elle détient dans l'absorbée. L'absorbante renonce donc à la part qui lui reviendrait : c'est la fusion-renonciation.", true),
      C("Moselle Tubes : 10 000 actions, apports évalués à `2 000 000 €`. Parité : 1 action Lorraine pour 2 actions Moselle. Lorraine détient 2 000 actions Moselle."),
      C("Seules les 8 000 actions des autres associés sont échangées : on crée `4 000` actions Lorraine, de 100 euros de nominal, soit 400 000 euros d'augmentation de capital.", true),
      C("Les 80 % d'apports rémunérés valent 1 600 000 : la prime de fusion est de 1 200 000. Les 20 % restants, 400 000, remplacent les titres Moselle annulés, inscrits 300 000 : boni de `100 000 €`.", true),
      C("Ici, à valeur réelle, ce boni est inscrit en capitaux propres, sauf la part qui correspond à des résultats accumulés depuis l'acquisition, inscrite en produits financiers."),
      C("La fusion-allotissement, c'est l'inverse : l'absorbée détient des titres de l'absorbante et les attribue directement à ses associés."),
    ],
    ecritures: [
      {
        titre: "Chez Lorraine Acier · Réalisation de la fusion",
        droit: "PCG, titre VII : entre sociétés sous contrôle distinct, les apports sont évalués à leur valeur réelle. L'absorbante n'émet pas de titres pour elle-même : les titres qu'elle détient sur l'absorbée sont annulés.",
        lignes: [
          { compte: "2 à 5", intitule: "Actifs apportés, nets des dettes reprises", debit: 2000000, pourquoi: "On reçoit tout le patrimoine de Moselle : l'actif augmente, au débit." },
          { compte: "101", intitule: "Capital", credit: 400000, pourquoi: "4 000 actions nouvelles × 100 € : les capitaux propres augmentent au crédit." },
          { compte: "1042", intitule: "Prime de fusion", credit: 1200000, pourquoi: "Excédent des apports rémunérés sur le nominal : capitaux propres." },
          { compte: "261", intitule: "Titres de participation Moselle", credit: 300000, pourquoi: "Les titres détenus sont annulés : l'actif disparaît, au crédit." },
          { compte: "1042", intitule: "Boni de fusion (en prime)", credit: 100000, pourquoi: "Quote-part d'apports supérieure au coût des titres annulés : capitaux propres." },
        ],
      },
    ],
    flash: [
      Q("Dans une fusion-renonciation, l'absorbante :", ["Reçoit ses propres actions", "Renonce aux titres qui lui reviendraient", "Rachète les minoritaires"], 1, "Elle ne peut pas s'attribuer ses propres titres."),
      Q("Combien de titres créer (8 000 actions échangées, parité 1 pour 2) ?", ["2 000", "4 000", "5 000"], 1, "8 000 ÷ 2."),
      Q("Prime de fusion (1 600 000 d'apports rémunérés, capital créé 400 000) :", ["400 000", "1 200 000", "1 600 000"], 1, "Apports rémunérés moins nominal."),
    ],
    fiche: {
      essentiel: "L'absorbante qui détient déjà des titres ne s'en attribue pas : seuls les autres associés sont rémunérés, et ses titres sont annulés (boni ou mali).",
      points: [
        "Titres à créer = actions des autres associés ÷ parité.",
        "Prime de fusion = apports rémunérés − augmentation de capital.",
        "Titres détenus annulés : boni ou mali.",
        "Boni : capitaux propres, sauf résultats accumulés depuis l'acquisition.",
        "Fusion-allotissement : l'absorbée attribue ses titres de l'absorbante à ses associés.",
      ],
      methode: ["Titres à échanger", "Augmentation de capital", "Prime de fusion", "Boni ou mali", "Écriture"],
      pieges: ["Créer des titres pour toutes les actions de l'absorbée."],
    },
  }),
  K({
    id: "commissaire-fusion", ue: "ue4",
    title: "Commissaire à la fusion et commissaire aux apports", ref: "art. L. 236-10 et L. 225-147 C. com.",
    scene: [
      N("Toulouse. Deux sociétés fusionnent. Leurs dirigeants ont fixé la parité à 3 pour 2."),
      D("On a fait la valorisation entre nous. Pourquoi un contrôle extérieur ?"),
      X("Parce que les associés minoritaires doivent être sûrs que la parité est équitable et que les apports ne sont pas surévalués."),
      N("À l'examen : distinguer les deux missions, et savoir quand on peut s'en passer."),
    ],
    cours: [
      C("Le commissaire à la fusion vérifie que les valeurs relatives attribuées aux actions des sociétés sont pertinentes, et que le rapport d'échange est équitable.", true),
      C("Il est désigné par décision de justice, et soumis aux mêmes incompatibilités qu'un commissaire aux comptes. Il ne peut pas être le commissaire aux comptes de l'une des sociétés."),
      C("Il apprécie aussi, sous sa responsabilité, la valeur des apports en nature. Son rapport est mis à disposition des associés avant les assemblées.", true),
      C("Le commissaire aux apports intervient, lui, dans une augmentation de capital par apport en nature hors fusion : il vérifie que les apports ne sont pas surévalués."),
      C("Les associés de toutes les sociétés concernées peuvent, à l'unanimité, décider de ne pas désigner de commissaire à la fusion. Et il n'en faut pas quand l'absorbante détient déjà 100 % de l'absorbée.", true),
    ],
    flash: [
      Q("Le commissaire à la fusion vérifie surtout :", ["La sincérité des comptes", "Le caractère équitable de la parité", "La TVA"], 1, "Et la valeur des apports en nature."),
      Q("Il est désigné par :", ["Le dirigeant", "Décision de justice", "Le CSE"], 1, "Pour garantir son indépendance."),
      Q("On peut se passer de commissaire à la fusion :", ["Jamais", "À l'unanimité des associés", "À la majorité simple"], 1, "Ou en cas de fusion à 100 %."),
    ],
    fiche: {
      essentiel: "Le commissaire à la fusion, désigné en justice, contrôle l'équité de la parité et la valeur des apports ; renonciation possible à l'unanimité.",
      points: [
        "Mission : valeurs relatives pertinentes, parité équitable.",
        "Appréciation de la valeur des apports en nature.",
        "Désigné par décision de justice ; incompatibilités du commissaire aux comptes.",
        "Commissaire aux apports : apports en nature hors fusion.",
        "Pas de commissaire : unanimité des associés, ou fusion à 100 %.",
      ],
      methode: ["Quelle opération ?", "Quel commissaire ?", "Mission et rapport", "Dispense possible ?"],
      pieges: ["Confier la mission au commissaire aux comptes de l'une des sociétés."],
    },
  }),
  K({
    id: "responsabilite-cac", ue: "ue4",
    title: "Les responsabilités du commissaire aux comptes", ref: "C. com., livre VIII · art. 226-13 C. pén.",
    scene: [
      N("Nice. Pendant son audit, la commissaire aux comptes de Riviera Hôtels découvre des factures fictives payées à une société du dirigeant."),
      D("Vous allez garder ça pour vous, j'espère ? Vous êtes tenue au secret."),
      X("Le secret ne joue pas contre le procureur. Je dois révéler ces faits délictueux. Si je me tais, c'est moi qui commets un délit."),
      N("À l'examen : les trois responsabilités, civile, pénale et disciplinaire."),
    ],
    cours: [
      C("Responsabilité civile : le commissaire aux comptes répond de ses fautes envers la société et les tiers. Il a une obligation de moyens. Il faut une faute, un préjudice et un lien de causalité.", true),
      C("L'action se prescrit par `3 ans` à compter du fait dommageable, ou de sa révélation s'il a été dissimulé. Le commissaire n'est pas responsable des infractions des dirigeants, sauf s'il en avait connaissance et ne les a pas signalées."),
      C("Responsabilité pénale : ne pas révéler au procureur de la République les faits délictueux dont il a connaissance est puni de `5 ans` d'emprisonnement et de `75 000 €` d'amende. Même peine pour la confirmation d'informations mensongères.", true),
      C("Il est tenu au secret professionnel. Le violer est puni d'un an et 15 000 euros, mais le secret ne lui est pas opposable pour la révélation au procureur."),
      C("Responsabilité disciplinaire : depuis 2024, la Haute autorité de l'audit, la H2A, peut prononcer avertissement, blâme, interdiction temporaire ou radiation.", true),
    ],
    flash: [
      Q("Le commissaire aux comptes a une obligation :", ["De résultat", "De moyens", "De garantie"], 1, "Il faut prouver une faute."),
      Q("Peine pour non-révélation de faits délictueux :", ["1 an et 15 000 €", "5 ans et 75 000 €", "Aucune"], 1, "Délit propre au commissaire aux comptes."),
      Q("L'autorité disciplinaire depuis 2024 :", ["La CNCC", "La H2A", "L'AMF"], 1, "Haute autorité de l'audit, ex-H3C."),
    ],
    fiche: {
      essentiel: "Le commissaire aux comptes engage sa responsabilité civile (obligation de moyens, 3 ans), pénale (non-révélation : 5 ans, 75 000 €) et disciplinaire (H2A).",
      points: [
        "Civile : faute, préjudice, lien ; prescription de 3 ans.",
        "Pas responsable des infractions des dirigeants, sauf s'il ne les a pas signalées en les connaissant.",
        "Pénale : non-révélation, informations mensongères (5 ans, 75 000 €).",
        "Secret professionnel, non opposable au procureur.",
        "Disciplinaire : H2A, de l'avertissement à la radiation.",
      ],
      methode: ["Quelle responsabilité ?", "Conditions", "Sanctions", "Autorité compétente"],
      pieges: ["Opposer le secret professionnel au procureur.", "Parler encore du H3C."],
    },
  }),
  K({
    id: "ias19-avantages", ue: "ue4",
    title: "IAS 19 : les engagements de retraite", ref: "IAS 19",
    scene: [
      N("Lyon. Le groupe Rhône Santé, en IFRS, promet à ses salariés une indemnité de départ en retraite."),
      D("On paiera quand ils partiront. Pourquoi comptabiliser maintenant ?"),
      X("Parce que les salariés acquièrent ce droit chaque année. L'engagement existe dès aujourd'hui, il faut le provisionner."),
      N("À l'examen : distinguer les régimes, puis répartir la variation de l'engagement."),
    ],
    cours: [
      C("IAS 19 distingue quatre catégories : les avantages à court terme, les avantages postérieurs à l'emploi, les autres avantages à long terme, et les indemnités de fin de contrat.", true),
      C("Régime à cotisations définies : l'entreprise paie ses cotisations, et c'est tout. Simple charge. Régime à prestations définies : elle garantit un niveau de prestation, elle porte le risque. Il faut une provision.", true),
      C("L'engagement est calculé par la méthode des unités de crédit projetées : chaque année de service donne droit à une unité de prestation, actualisée."),
      C("Cette année, l'engagement passe de 100 000 à 120 000 euros : `12 000` de coût des services, `3 000` d'intérêts, et `5 000` d'écarts actuariels, dus à la baisse des taux.", true),
      C("Le coût des services et l'intérêt net vont en résultat. Les écarts actuariels vont en autres éléments du résultat global, et ne seront jamais recyclés en résultat.", true),
    ],
    ecritures: [
      {
        titre: "Clôture · Variation de l'engagement",
        droit: "IAS 19 : pour un régime à prestations définies, la dette est égale à la valeur actuelle de l'obligation ; coût des services et intérêt net en résultat, réévaluations en autres éléments du résultat global.",
        lignes: [
          { compte: "—", intitule: "Charges de personnel (coût des services)", debit: 12000, pourquoi: "Les droits acquis par les salariés cette année : une charge de l'exercice." },
          { compte: "—", intitule: "Charges financières (intérêt net)", debit: 3000, pourquoi: "L'engagement se rapproche d'un an de l'échéance : le coût de l'actualisation." },
          { compte: "—", intitule: "Autres éléments du résultat global (écarts actuariels)", debit: 5000, pourquoi: "Changement d'hypothèses : il diminue les capitaux propres sans passer par le résultat." },
          { compte: "—", intitule: "Provision pour avantages du personnel", credit: 20000, pourquoi: "La dette envers les salariés augmente : passif, au crédit." },
        ],
      },
    ],
    flash: [
      Q("Régime à cotisations définies : l'entreprise comptabilise :", ["Une provision", "Une simple charge de cotisation", "Rien"], 1, "Le risque est porté par l'organisme."),
      Q("Les écarts actuariels vont :", ["En résultat", "En autres éléments du résultat global", "En annexe"], 1, "Et ne sont jamais recyclés."),
      Q("Méthode de calcul de l'engagement :", ["Coût historique", "Unités de crédit projetées", "Premier entré, premier sorti"], 1, "Avec actualisation."),
    ],
    fiche: {
      essentiel: "Prestations définies : provision calculée par les unités de crédit projetées ; services et intérêts en résultat, écarts actuariels en autres éléments du résultat global.",
      points: [
        "Quatre catégories d'avantages.",
        "Cotisations définies : charge ; prestations définies : provision.",
        "Unités de crédit projetées, actualisation.",
        "Coût des services et intérêt net en résultat.",
        "Écarts actuariels en OCI, non recyclables.",
      ],
      methode: ["Type de régime", "Variation de l'engagement", "Ventilation", "Écriture"],
      pieges: ["Passer les écarts actuariels en résultat."],
    },
  }),
  K({
    id: "ias38-incorporelles", ue: "ue4",
    title: "IAS 38 : recherche, développement et incorporels", ref: "IAS 38, PCG art. 212-3",
    scene: [
      N("Sophia Antipolis. La société Azur Logiciel a dépensé 200 000 euros pour développer un nouveau logiciel qu'elle va vendre."),
      D("C'est de la charge, non ? On a payé des développeurs."),
      X("Si les six critères du développement sont remplis, en IFRS, vous n'avez pas le choix : c'est un actif."),
      N("À l'examen : séparer recherche et développement, puis passer l'écriture."),
    ],
    cours: [
      C("Une immobilisation incorporelle est un actif non monétaire sans substance physique, identifiable, contrôlé, et porteur d'avantages économiques futurs.", true),
      C("Les dépenses de recherche sont toujours des charges. Les dépenses de développement sont obligatoirement immobilisées en IFRS si six critères sont remplis.", true),
      C("Les six critères : faisabilité technique, intention d'achever, capacité à utiliser ou vendre, avantages économiques probables, ressources disponibles, et évaluation fiable des dépenses."),
      C("Une marque, une liste de clients ou un fonds commercial créés en interne ne sont jamais immobilisés. Un incorporel à durée indéterminée n'est pas amorti, mais testé chaque année.", true),
      C("En règles françaises, l'immobilisation des frais de développement est une option, présentée comme la méthode de référence."),
    ],
    ecritures: [
      {
        titre: "En cours d'année · Développement immobilisé",
        droit: "IAS 38 : les dépenses de développement qui remplissent les six critères sont immobilisées. Elles sont produites en interne : on les sort des charges par la production immobilisée.",
        lignes: [
          { compte: "232", intitule: "Immobilisations incorporelles en cours", debit: 200000, pourquoi: "Le logiciel en développement apportera des avantages futurs : c'est un actif, au débit." },
          { compte: "721", intitule: "Production immobilisée, incorporelle", credit: 200000, pourquoi: "Les salaires sont déjà en charges : ce produit les neutralise, au crédit." },
        ],
      },
      {
        titre: "Mise en service du logiciel",
        droit: "Une fois achevée, l'immobilisation en cours est reclassée dans son compte définitif, puis amortie.",
        lignes: [
          { compte: "203", intitule: "Frais de développement", debit: 200000, pourquoi: "L'actif est terminé : il passe dans son compte définitif." },
          { compte: "232", intitule: "Immobilisations incorporelles en cours", credit: 200000, pourquoi: "Le compte d'attente est soldé : il diminue, au crédit." },
        ],
      },
    ],
    flash: [
      Q("En IFRS, les dépenses de recherche sont :", ["Immobilisées", "Des charges", "Au choix"], 1, "Seul le développement peut être immobilisé."),
      Q("Développement remplissant les six critères, en IFRS :", ["Immobilisation obligatoire", "Option", "Charge"], 0, "En règles françaises, c'est une option."),
      Q("Une marque créée en interne :", ["Est immobilisée", "N'est jamais immobilisée", "Est amortie sur 10 ans"], 1, "IAS 38 l'interdit."),
    ],
    fiche: {
      essentiel: "Recherche en charges ; développement immobilisé obligatoirement en IFRS si six critères ; marques et clientèles internes jamais immobilisées.",
      points: [
        "Définition : identifiable, contrôlé, avantages futurs.",
        "Six critères du développement.",
        "IFRS : immobilisation obligatoire ; PCG : option (méthode de référence).",
        "Écriture : 232 au débit, 721 au crédit ; puis 203.",
        "Durée indéterminée : pas d'amortissement, test annuel.",
      ],
      methode: ["Recherche ou développement ?", "Six critères", "Écriture", "Amortissement ou test"],
      pieges: ["Immobiliser une marque créée en interne."],
    },
  }),
  K({
    id: "cadre-conceptuel-ifrs", ue: "ue4",
    title: "Cadre conceptuel IFRS et juste valeur", ref: "Cadre conceptuel IASB, IFRS 13",
    scene: [
      N("Lille. Le groupe Nord Invest passe aux normes IFRS et détient un immeuble et des actions cotées."),
      D("La juste valeur, c'est le prix qu'on a payé ?"),
      X("Non. C'est le prix auquel vous pourriez vendre aujourd'hui, entre acteurs du marché. Un prix de sortie."),
      N("À l'examen : les qualités de l'information, les définitions, puis la hiérarchie de la juste valeur."),
    ],
    cours: [
      C("Le cadre conceptuel fixe l'objectif des états financiers : fournir une information utile aux investisseurs et aux prêteurs pour leurs décisions.", true),
      C("Deux qualités fondamentales : la pertinence et la représentation fidèle. Quatre qualités auxiliaires : comparabilité, vérifiabilité, rapidité et compréhensibilité."),
      C("Un actif est une ressource économique actuelle, contrôlée du fait d'événements passés. Un passif est une obligation actuelle de transférer une ressource économique.", true),
      C("IFRS 13 : la juste valeur est le prix qui serait reçu pour vendre un actif, ou payé pour transférer un passif, lors d'une transaction normale entre intervenants du marché, à la date d'évaluation.", true),
      C("Trois niveaux. Niveau 1 : prix cotés sur un marché actif, comme les actions. Niveau 2 : données observables, comme le prix au mètre carré d'immeubles comparables. Niveau 3 : données non observables, comme un modèle interne."),
    ],
    flash: [
      Q("La juste valeur selon IFRS 13 est :", ["Un prix d'entrée", "Un prix de sortie", "Le coût historique"], 1, "Prix reçu pour vendre l'actif."),
      Q("Des actions cotées sur un marché actif relèvent du :", ["Niveau 1", "Niveau 2", "Niveau 3"], 0, "Prix cotés non ajustés."),
      Q("Les deux qualités fondamentales de l'information :", ["Prudence et coût historique", "Pertinence et représentation fidèle", "Rapidité et clarté"], 1, "Les autres sont auxiliaires."),
    ],
    fiche: {
      essentiel: "Information utile aux investisseurs, pertinente et fidèle ; la juste valeur est un prix de sortie, hiérarchisé en trois niveaux.",
      points: [
        "Objectif : utilité pour investisseurs et prêteurs.",
        "Fondamentales : pertinence, représentation fidèle.",
        "Auxiliaires : comparabilité, vérifiabilité, rapidité, compréhensibilité.",
        "Actif : ressource contrôlée ; passif : obligation actuelle.",
        "IFRS 13 : prix de sortie ; niveaux 1, 2, 3.",
      ],
      methode: ["Définition", "Niveau de juste valeur", "Justification par les données"],
      pieges: ["Confondre juste valeur et prix d'acquisition."],
    },
  }),
  K({
    id: "autres-missions-cac", ue: "ue4",
    title: "La procédure d'alerte et les autres missions du commissaire aux comptes", ref: "art. L. 234-1 C. com.",
    scene: [
      N("Le Mans. Le commissaire aux comptes de Sarthe Mobilier voit la trésorerie fondre, et la banque vient de couper sa ligne de crédit."),
      D("Ce n'est pas votre rôle de gérer notre trésorerie."),
      X("Non, mais quand la continuité d'exploitation est menacée, la loi m'oblige à déclencher l'alerte."),
      N("À l'examen : les étapes de l'alerte, puis les autres interventions du commissaire."),
    ],
    cours: [
      C("Le commissaire aux comptes déclenche la procédure d'alerte lorsqu'il relève des faits de nature à compromettre la continuité d'exploitation.", true),
      C("Dans une SA, quatre étapes. Un : il informe le président, qui a `15 jours` pour répondre. Deux : si la réponse est insuffisante, il demande que le conseil délibère. Trois : il établit un rapport spécial présenté à l'assemblée.", true),
      C("Quatre : si la continuité reste compromise, il informe le président du tribunal de commerce. Celui-ci peut convoquer les dirigeants."),
      C("Le commissaire aux comptes intervient aussi dans d'autres opérations : suppression du droit préférentiel de souscription, transformation, acompte sur dividendes, conventions réglementées."),
      C("Enfin, il peut fournir des services autres que la certification, les SACC, à condition qu'ils ne menacent pas son indépendance.", true),
    ],
    flash: [
      Q("L'alerte du commissaire aux comptes est déclenchée quand :", ["Le résultat baisse", "La continuité d'exploitation est compromise", "Un associé le demande"], 1, "Faits de nature à compromettre la continuité."),
      Q("Délai de réponse du président dans la SA :", ["8 jours", "15 jours", "1 mois"], 1, "Première phase de l'alerte."),
      Q("Dernière étape de l'alerte :", ["Information du procureur", "Information du président du tribunal de commerce", "Démission du commissaire"], 1, "Qui peut convoquer les dirigeants."),
    ],
    fiche: {
      essentiel: "Continuité compromise : alerte en quatre étapes, du président au président du tribunal de commerce ; le commissaire intervient aussi dans des opérations particulières et peut fournir des SACC.",
      points: [
        "Déclencheur : faits compromettant la continuité d'exploitation.",
        "1 : information du président (réponse sous 15 jours).",
        "2 : délibération du conseil.",
        "3 : rapport spécial à l'assemblée.",
        "4 : information du président du tribunal de commerce.",
        "SACC possibles, sous réserve d'indépendance.",
      ],
      methode: ["Faits constatés", "Étapes de l'alerte", "Autres interventions"],
      pieges: ["Sauter directement à l'information du tribunal."],
    },
  }),
];
