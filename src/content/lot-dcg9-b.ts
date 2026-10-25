// DCG UE9 · Introduction à la comptabilité — suite des épisodes « logique comptable ».
// Comptes à jour du PCG 2025 (règl. ANC 2022-06) : cessions d'immobilisations en 657/757,
// quote-part de subvention d'investissement en 747, écarts de change commerciaux en 656/756.
// À FAIRE RELIRE avant génération des voix et vente.
import type { Episode, Ecriture, LigneEcriture } from "./types";
import { C, D, N, Q, X, ecrit } from "./lot-outils";

const K = ecrit("comptable", "Cas Zenvise, programme DCG 2027");
const d = (compte: string, intitule: string, debit: number, pourquoi: string): LigneEcriture => ({ compte, intitule, debit, pourquoi });
const c = (compte: string, intitule: string, credit: number, pourquoi: string): LigneEcriture => ({ compte, intitule, credit, pourquoi });
const E = (titre: string, lignes: LigneEcriture[], regle?: string): Ecriture => ({ titre, lignes, regle });

export const LOT_DCG9_B: Episode[] = [
  {
    ...K({
      id: "dcg-devises", ue: "dcg9",
      title: "Ventes et achats en devises", ref: "PCG, comptes 656, 756 (écarts de change commerciaux)",
      scene: [
        N("Marseille. Une PME vend des machines à un client américain : dix mille dollars, payables dans deux mois."),
        D("Je facture en dollars, mais je tiens ma comptabilité en euros. Je prends quel cours ?"),
        X("Le cours du jour de la vente. Et si le dollar baisse avant le paiement, vous encaisserez moins d'euros : ce sera une perte de change."),
        N("À l'examen : convertir au cours du jour, puis traiter l'écart au règlement."),
      ],
      cours: [
        C("La comptabilité se tient en euros. Une opération en devises est convertie au cours du jour où elle a lieu : dix mille dollars à zéro virgule quatre-vingt-douze, `9 200 €`.", true),
        C("Le `411` Clients est au débit pour neuf mille deux cents : c'est une créance, un actif qui augmente. Le `707` Ventes est au crédit : c'est un produit. La vente est exportée hors de l'Union : elle est exonérée de TVA, donc pas de TVA collectée."),
        C("Deux mois plus tard, le dollar vaut zéro virgule quatre-vingt-dix. La banque reçoit `9 000 €` : elle augmente, au débit. La créance de neuf mille deux cents disparaît entièrement : `411` au crédit.", true),
        C("Il manque deux cents euros : c'est une perte de change. Elle vient d'une opération commerciale, donc elle reste en résultat d'exploitation : `656` Pertes de change sur créances et dettes commerciales, au débit. Un gain irait au `756`, au crédit.", true),
        C("Chez un acheteur, c'est l'inverse : si la devise baisse avant le paiement, il paie moins d'euros que prévu, c'est un gain de change."),
      ],
      flash: [
        Q("Une facture en dollars se comptabilise :", ["Au cours du jour de l'opération", "Au cours du paiement", "Au cours du 31 décembre"], 0, "Conversion à la date de l'opération."),
        Q("Une perte de change sur une vente se passe en :", ["656, au débit", "756, au crédit", "666, au crédit"], 0, "Écart de change commercial : résultat d'exploitation."),
        Q("Une exportation hors de l'Union européenne :", ["Est exonérée de TVA", "Supporte la TVA française", "Supporte la TVA du pays acheteur, facturée par le vendeur"], 0, "Exonération des exportations."),
      ],
      fiche: {
        essentiel: "On convertit au cours du jour de l'opération ; l'écart constaté au règlement est un gain ou une perte de change.",
        points: [
          "Conversion au cours du jour de l'opération.",
          "Créance client : actif, au débit ; vente : produit, au crédit.",
          "Règlement : banque au montant réel reçu, créance soldée pour son montant d'origine.",
          "Écart commercial : 656 (perte) ou 756 (gain).",
          "Export hors UE : exonéré de TVA.",
        ],
        methode: ["Montant en devises × cours du jour", "Écriture de vente", "Règlement et écart de change"],
        pieges: ["Comptabiliser la vente au cours du paiement.", "Solder la créance pour le montant encaissé."],
      },
    }),
    ecritures: [
      E("Vente · 10 000 USD à 0,92", [
        d("411", "Clients", 9200, "Le client nous doit la contre-valeur en euros : créance, actif qui augmente."),
        c("707", "Ventes de marchandises", 9200, "Produit de la vente, converti au cours du jour."),
      ], "Export hors UE : exonéré de TVA."),
      E("Encaissement · 10 000 USD à 0,90", [
        d("512", "Banque", 9000, "L'argent réellement reçu en euros : la trésorerie augmente."),
        d("656", "Pertes de change sur créances et dettes commerciales", 200, "Le dollar a baissé : perte, charge d'exploitation."),
        c("411", "Clients", 9200, "La créance est éteinte pour son montant d'origine."),
      ]),
    ],
  },
  {
    ...K({
      id: "dcg-tresorerie-banque", ue: "dcg9",
      title: "Effets de commerce et escompte", ref: "PCG, comptes 413, 5114, 627, 6616",
      scene: [
        N("Dijon. Un grossiste a vendu pour cinq mille euros à un client qui paiera dans soixante jours, par lettre de change."),
        D("J'ai besoin de la trésorerie maintenant. La banque peut m'avancer l'argent ?"),
        X("Oui, en escomptant l'effet. Elle vous verse le montant, moins des intérêts et une commission."),
        N("À l'examen : suivre l'effet, de sa création à l'escompte, en justifiant chaque compte."),
      ],
      cours: [
        C("La créance client change de forme : elle devient un effet à recevoir, un titre que l'on peut céder. `413` Effets à recevoir au débit, `411` Clients au crédit. Un actif en remplace un autre.", true),
        C("Le grossiste remet l'effet à sa banque pour escompte. L'effet sort du portefeuille, `413` au crédit, et devient un effet remis à l'escompte, `5114`, au débit. Il attend l'avis de la banque."),
        C("La banque crédite le compte du net : cinq mille, moins quarante euros d'intérêts et dix euros de commission hors taxes, plus deux euros de TVA. La banque augmente de `4 948 €`, au débit.", true),
        C("Les intérêts d'escompte sont une charge financière, `6616`, au débit, sans TVA. La commission est un service bancaire, `627`, au débit, soumise à TVA récupérable, `44566`. Et l'effet remis à l'escompte est soldé : `5114` au crédit.", true),
        C("L'escompte est un financement : si le client ne paie pas à l'échéance, la banque se retournera contre le grossiste."),
      ],
      flash: [
        Q("Quand le client accepte une lettre de change, le 413 est :", ["Débité, le 411 crédité", "Crédité, le 411 débité", "Inchangé"], 0, "La créance change de forme : effet à recevoir."),
        Q("Les intérêts d'escompte vont en :", ["6616, sans TVA", "627, avec TVA", "765"], 0, "Charge financière exonérée de TVA."),
        Q("Pourquoi la banque est-elle débitée du net ?", ["L'argent reçu est la valeur de l'effet moins les agios", "Pour le nominal de l'effet", "Pour les seuls intérêts"], 0, "La banque prélève intérêts et commission."),
      ],
      fiche: {
        essentiel: "L'effet est une créance mobilisable : 413 à la création, 5114 à la remise à l'escompte, puis banque au net et agios en charges.",
        points: [
          "Création : 413 au débit, 411 au crédit.",
          "Remise à l'escompte : 5114 au débit, 413 au crédit.",
          "Avis de crédit : 512 (net), 6616 (intérêts), 627 + 44566 (commission) / 5114.",
          "Intérêts exonérés de TVA ; commissions soumises.",
          "Recours de la banque si le client ne paie pas.",
        ],
        methode: ["Suivre l'effet étape par étape", "Calculer le net", "Justifier chaque compte"],
        pieges: ["Appliquer la TVA aux intérêts d'escompte."],
      },
    }),
    ecritures: [
      E("Acceptation de la lettre de change", [
        d("413", "Clients, effets à recevoir", 5000, "La créance prend la forme d'un effet : actif qui augmente."),
        c("411", "Clients", 5000, "La créance ordinaire est remplacée : elle diminue."),
      ]),
      E("Remise à l'escompte", [
        d("5114", "Effets remis à l'escompte", 5000, "L'effet est chez la banque, en attente de son avis."),
        c("413", "Clients, effets à recevoir", 5000, "Il quitte le portefeuille de l'entreprise."),
      ]),
      E("Avis de crédit de la banque", [
        d("512", "Banque", 4948, "Somme réellement versée : la trésorerie augmente."),
        d("6616", "Intérêts bancaires et sur opérations de financement", 40, "Prix du financement : charge financière, sans TVA."),
        d("627", "Services bancaires et assimilés", 10, "Commission : charge de service."),
        d("44566", "TVA déductible sur ABS", 2, "TVA sur la commission, récupérable : créance."),
        c("5114", "Effets remis à l'escompte", 5000, "L'opération est dénouée : le compte d'attente est soldé."),
      ], "5 000 − 40 − 10 − 2 = 4 948."),
    ],
  },
  {
    ...K({
      id: "dcg-paie", ue: "dcg9",
      title: "Comptabiliser la paie", ref: "PCG, comptes 421, 431, 437, 442, 641, 645",
      scene: [
        N("Nancy. Fin du mois dans une agence de communication. La comptable reçoit le journal de paie : trois mille euros brut pour un salarié."),
        D("Le salarié touche moins de trois mille, et l'entreprise paie plus. Comment tout ça s'enregistre ?"),
        X("Le brut est la charge de salaire. Les cotisations salariales sont retenues sur le brut et reversées aux organismes. Les cotisations patronales s'ajoutent, en charges."),
        N("À l'examen : la charge de personnel, les dettes envers le salarié et les organismes, puis les paiements."),
      ],
      cours: [
        C("Le salaire brut, `3 000 €`, est une charge : `641` Rémunérations du personnel, au débit. C'est ce que coûte le travail du salarié, avant toute retenue.", true),
        C("Sur ce brut, l'employeur retient les cotisations salariales, ici six cent soixante euros pour simplifier. Il ne les garde pas : il les doit aux organismes sociaux. C'est une dette, `431` Sécurité sociale, au crédit.", true),
        C("Le salarié doit recevoir le reste, deux mille trois cent quarante euros : c'est une dette envers lui, `421` Personnel, rémunérations dues, au crédit. Le prélèvement à la source, retenu pour l'État, irait au `442`, également au crédit."),
        C("Les cotisations patronales, ici mille deux cent soixante euros, sont une charge supplémentaire, `645` Charges de sécurité sociale, au débit, et une dette envers les organismes, au crédit.", true),
        C("Au paiement, chaque dette disparaît, au débit, et la banque diminue, au crédit. Coût total du salarié pour l'entreprise : quatre mille deux cent soixante euros."),
      ],
      flash: [
        Q("Le salaire brut va au compte :", ["641, au débit", "421, au crédit", "431, au crédit"], 0, "Charge de personnel."),
        Q("Pourquoi le 421 est-il crédité ?", ["L'entreprise doit le net au salarié : dette", "C'est un produit", "C'est une créance"], 0, "Rémunération due."),
        Q("Les cotisations patronales sont :", ["Une charge en plus du brut", "Retenues sur le brut", "Un produit"], 0, "645 au débit."),
      ],
      fiche: {
        essentiel: "Le brut est une charge ; les retenues et le net sont des dettes ; les cotisations patronales s'ajoutent en charges.",
        points: [
          "641 au débit : salaire brut.",
          "431 (et 437) au crédit : cotisations dues aux organismes.",
          "442 au crédit : prélèvement à la source dû à l'État.",
          "421 au crédit : net à payer au salarié.",
          "645 au débit : cotisations patronales ; paiements : dettes au débit, 512 au crédit.",
        ],
        methode: ["Brut, retenues, net", "Écriture de salaire", "Charges patronales", "Paiements"],
        pieges: ["Enregistrer le net en charge au lieu du brut."],
      },
    }),
    ecritures: [
      E("Fin de mois · Salaire", [
        d("641", "Rémunérations du personnel", 3000, "Le coût du travail, avant retenues : charge."),
        c("431", "Sécurité sociale", 660, "Cotisations salariales retenues, à reverser : dette."),
        c("421", "Personnel, rémunérations dues", 2340, "Net dû au salarié : dette."),
      ], "Taux simplifiés pour l'exercice : 22 % salarial, 42 % patronal."),
      E("Fin de mois · Cotisations patronales", [
        d("645", "Charges de sécurité sociale et de prévoyance", 1260, "Coût supplémentaire pour l'employeur : charge."),
        c("431", "Sécurité sociale", 1260, "À verser aux organismes : dette."),
      ]),
      E("Paiement du salaire", [
        d("421", "Personnel, rémunérations dues", 2340, "La dette envers le salarié est réglée."),
        c("512", "Banque", 2340, "L'argent sort : la trésorerie diminue."),
      ]),
    ],
  },
  {
    ...K({
      id: "dcg-emprunt-creditbail", ue: "dcg9",
      title: "Emprunt et crédit-bail", ref: "PCG, comptes 164, 1688, 6611, 612",
      scene: [
        N("Rennes. Une menuiserie emprunte soixante mille euros sur cinq ans pour acheter une machine, et prend une camionnette en crédit-bail."),
        D("Les deux, ce sont des financements. Pourquoi l'un va au bilan et l'autre non ?"),
        X("Avec l'emprunt, vous devez l'argent et vous possédez la machine. En crédit-bail, la camionnette appartient au bailleur : vous payez des loyers."),
        N("À l'examen : l'emprunt, ses échéances, les intérêts courus, puis les redevances de crédit-bail."),
      ],
      cours: [
        C("Quand la banque verse les fonds, la trésorerie augmente, `512` au débit, et l'entreprise contracte une dette, `164` Emprunts, au crédit. Ce n'est pas un produit : l'argent devra être rendu.", true),
        C("À chaque échéance, la part de capital remboursée diminue la dette, `164` au débit. Les intérêts sont le prix de l'argent emprunté : une charge financière, `6611`, au débit. La banque diminue du total."),
        C("Pour cet emprunt de soixante mille euros à quatre pour cent, remboursé par amortissements constants de douze mille euros par an, la première échéance comprend deux mille quatre cents euros d'intérêts.", true),
        C("À la clôture, si l'échéance tombe en juillet, six mois d'intérêts courent déjà sur cet exercice sans être payés : ce sont des intérêts courus. Charge `6611` au débit, dette `1688` au crédit."),
        C("Le crédit-bail est une location : la camionnette n'entre pas à l'actif. Chaque redevance est une charge, `612`, avec la TVA déductible, et une dette fournisseur. Les loyers restant dus figurent en annexe, comme engagement. Si l'option d'achat est levée, le bien entre à l'actif pour son prix de levée.", true),
      ],
      flash: [
        Q("Le versement des fonds d'un emprunt :", ["512 au débit, 164 au crédit", "512 au débit, 7xx au crédit", "164 au débit, 512 au crédit"], 0, "Une dette, pas un produit."),
        Q("Le bien pris en crédit-bail, dans les comptes individuels :", ["N'est pas à l'actif", "Est à l'actif dès la signature", "Est en stock"], 0, "Location : redevances en charges."),
        Q("Les intérêts courus non échus à la clôture vont en :", ["6611 / 1688", "1688 / 6611", "164 / 512"], 0, "Charge de l'exercice et dette."),
      ],
      fiche: {
        essentiel: "L'emprunt est une dette remboursée en capital, les intérêts sont une charge ; le crédit-bail reste hors bilan, ses redevances sont des charges.",
        points: [
          "Fonds reçus : 512 / 164.",
          "Échéance : 164 (capital) + 6611 (intérêts) / 512.",
          "Clôture : intérêts courus 6611 / 1688.",
          "Crédit-bail : redevances 612 + 44566 / 401 ; engagements en annexe.",
          "Levée d'option : immobilisation au prix de levée.",
        ],
        methode: ["Tableau d'emprunt", "Écritures d'échéance", "Intérêts courus à la clôture"],
        pieges: ["Mettre l'emprunt reçu en produit.", "Inscrire le bien en crédit-bail à l'actif dans les comptes individuels."],
      },
    }),
    ecritures: [
      E("Versement des fonds", [
        d("512", "Banque", 60000, "L'argent emprunté arrive : la trésorerie augmente."),
        c("164", "Emprunts auprès des établissements de crédit", 60000, "L'entreprise devra le rendre : dette."),
      ]),
      E("1er juillet N+1 · Première échéance", [
        d("164", "Emprunts auprès des établissements de crédit", 12000, "Le capital remboursé diminue la dette."),
        d("6611", "Intérêts des emprunts et dettes", 2400, "Prix de l'argent emprunté : charge financière."),
        c("512", "Banque", 14400, "L'échéance est payée : la trésorerie diminue."),
      ], "60 000 × 4 % ; amortissement constant de 12 000."),
      E("Chaque mois · Redevance de crédit-bail", [
        d("612", "Redevances de crédit-bail", 1500, "Loyer d'un bien qui ne nous appartient pas : charge."),
        d("44566", "TVA déductible sur ABS", 300, "TVA récupérable : créance."),
        c("401", "Fournisseurs", 1800, "Nous devons le loyer au bailleur : dette."),
      ]),
    ],
  },
  {
    ...K({
      id: "dcg-subventions", ue: "dcg9",
      title: "Subventions d'investissement et d'exploitation", ref: "PCG, comptes 131, 139, 74, 747",
      scene: [
        N("Clermont-Ferrand. Une imprimerie reçoit vingt mille euros de la région pour financer une machine de cinquante mille, amortie sur cinq ans."),
        D("Vingt mille euros en plus, c'est un produit de l'année, non ?"),
        X("Non : la subvention finance un bien qui sert cinq ans. On l'étale au même rythme que la machine."),
        N("À l'examen : distinguer subvention d'investissement et d'exploitation, et étaler la première."),
      ],
      cours: [
        C("La subvention d'investissement finance l'achat d'une immobilisation. À la réception, elle va dans les capitaux propres : `131` Subventions d'équipement, au crédit. L'entreprise n'a rien à rendre, ce n'est pas une dette ; mais ce n'est pas encore un produit.", true),
        C("Chaque année, on en transfère une part au résultat, au rythme de l'amortissement de la machine : vingt mille sur cinq ans, `4 000 €` par an.", true),
        C("On diminue les capitaux propres par le `139`, au débit, compte qui vient corriger le 131. Et on enregistre un produit, `747` Quote-part des subventions d'investissement virée au résultat, au crédit. Depuis 2025, ce n'est plus un produit exceptionnel."),
        C("Ainsi, chaque année, la dotation aux amortissements de la machine est en partie compensée par ce produit : le résultat supporte seulement le coût net de la subvention.", true),
        C("La subvention d'exploitation, elle, compense des charges ou un manque de recettes de l'exercice : c'est directement un produit, en `74`, au crédit."),
      ],
      flash: [
        Q("À la réception, une subvention d'investissement va en :", ["Capitaux propres (131)", "Produit (74)", "Dette (164)"], 0, "Elle n'est ni une dette ni encore un produit."),
        Q("La quote-part annuelle virée au résultat va en :", ["747, au crédit", "777, au débit", "131, au crédit"], 0, "Compte 747 depuis le PCG 2025."),
        Q("Une subvention pour compenser des charges de l'exercice :", ["Subvention d'exploitation, en 74", "Subvention d'investissement, en 131", "Emprunt"], 0, "Produit de l'exercice."),
      ],
      fiche: {
        essentiel: "La subvention d'investissement entre en capitaux propres puis passe au résultat au rythme de l'amortissement ; la subvention d'exploitation est un produit immédiat.",
        points: [
          "Réception : 512 (ou 441) / 131.",
          "Quote-part annuelle : 139 / 747, au rythme de l'amortissement.",
          "747 : produit courant depuis le règl. ANC 2022-06.",
          "Subvention d'exploitation : 74 au crédit.",
          "Effet : la dotation est compensée en partie chaque année.",
        ],
        methode: ["Nature de la subvention", "Réception", "Étalement"],
        pieges: ["Mettre toute la subvention d'investissement en produit l'année de la réception."],
      },
    }),
    ecritures: [
      E("Réception de la subvention", [
        d("512", "Banque", 20000, "L'argent de la région arrive : la trésorerie augmente."),
        c("131", "Subventions d'équipement", 20000, "Ressource définitive liée à un investissement : capitaux propres."),
      ]),
      E("31/12 · Quote-part de l'exercice", [
        d("139", "Subventions d'investissement inscrites au compte de résultat", 4000, "Corrige le 131 : la part transférée au résultat sort des capitaux propres."),
        c("747", "Quote-part des subventions d'investissement virée au résultat", 4000, "Produit de l'exercice, au rythme de l'amortissement."),
      ], "20 000 / 5 ans."),
    ],
  },
  {
    ...K({
      id: "dcg-cessions-immo", ue: "dcg9",
      title: "Céder une immobilisation", ref: "PCG, comptes 462, 657, 757 (règl. ANC 2022-06)",
      scene: [
        N("Tours. Une entreprise de transport revend une remorque achetée trente mille euros, amortie à hauteur de dix-huit mille."),
        D("Je la vends dix mille euros hors taxes. Je gagne de l'argent ou j'en perds ?"),
        X("Comparez au prix de vente ce qu'elle vaut encore dans vos comptes : douze mille. Vous perdez deux mille euros."),
        N("À l'examen : sortir le bien, constater le prix de cession, et lire le résultat de cession."),
      ],
      cours: [
        C("D'abord, on complète les amortissements jusqu'à la date de cession. La valeur nette comptable est alors le coût moins les amortissements : trente mille moins dix-huit mille, `12 000 €`.", true),
        C("On sort le bien du bilan. Le compte d'immobilisation est soldé, au crédit, pour son coût d'origine. Les amortissements, qui le corrigeaient, sont soldés au débit. La différence, la valeur nette comptable, devient une charge : `657` Valeurs comptables des immobilisations cédées, au débit.", true),
        C("Le prix de vente est un produit : `757` Produits des cessions d'immobilisations, au crédit, pour dix mille euros hors taxes. L'acheteur nous doit le prix TTC : `462` Créances sur cessions d'immobilisations, au débit. La TVA collectée est au crédit."),
        C("Le résultat de cession se lit en comparant les deux : produit de dix mille, charge de douze mille, perte de `2 000 €`.", true),
        C("Depuis le PCG 2025, ces opérations ne sont plus exceptionnelles : comptes `657` et `757`, au lieu de 675 et 775."),
      ],
      flash: [
        Q("La valeur nette comptable du bien cédé va en :", ["657, au débit", "757, au crédit", "675, au crédit"], 0, "Depuis le PCG 2025."),
        Q("Le prix de cession hors taxes va en :", ["757, au crédit", "707, au crédit", "462, au crédit"], 0, "Produit de cession d'immobilisation."),
        Q("Coût 30 000, amortissements 18 000, prix 10 000 : résultat de cession ?", ["Perte de 2 000", "Gain de 10 000", "Gain de 2 000"], 0, "10 000 − 12 000."),
      ],
      fiche: {
        essentiel: "Céder, c'est sortir le bien (VNC en 657) et constater le prix (757) ; la différence est le résultat de cession.",
        points: [
          "Compléter les amortissements à la date de cession.",
          "Sortie : 28 au débit, 657 au débit (VNC), 2 au crédit (coût).",
          "Prix : 462 (TTC) / 757 (HT) et 44571.",
          "Résultat de cession = prix − VNC.",
          "657/757 remplacent 675/775 depuis le règl. ANC 2022-06.",
        ],
        methode: ["Dotation complémentaire", "Sortie du bien", "Prix de cession", "Résultat"],
        pieges: ["Oublier la dotation complémentaire.", "Utiliser les anciens comptes 675/775."],
      },
    }),
    ecritures: [
      E("Sortie de la remorque", [
        d("28182", "Amortissements du matériel de transport", 18000, "Les amortissements qui corrigeaient le bien sont soldés."),
        d("657", "Valeurs comptables des immobilisations cédées", 12000, "Ce que le bien valait encore devient une charge."),
        c("2182", "Matériel de transport", 30000, "Le bien quitte l'actif pour son coût d'origine."),
      ]),
      E("Prix de cession", [
        d("462", "Créances sur cessions d'immobilisations", 12000, "L'acheteur nous doit le prix TTC : créance."),
        c("757", "Produits des cessions d'immobilisations", 10000, "Prix de vente hors taxes : produit."),
        c("44571", "TVA collectée", 2000, "TVA due à l'État : dette."),
      ], "Résultat de cession : 10 000 − 12 000 = perte de 2 000."),
    ],
  },
  {
    ...K({
      id: "dcg-provisions", ue: "dcg9",
      title: "Provisions pour risques et charges", ref: "PCG, art. 321-1 et s. · comptes 151, 6815, 7815",
      scene: [
        N("Lyon. Un fabricant de vélos électriques garantit ses batteries deux ans. Chaque année, environ deux pour cent reviennent en panne."),
        D("Je ne sais pas encore quels clients reviendront. Je dois quand même comptabiliser quelque chose ?"),
        X("Oui : vous êtes déjà engagé envers eux. Le coût probable des réparations futures se provisionne dès cette année."),
        N("À l'examen : vérifier les conditions, évaluer, puis passer et reprendre la provision."),
      ],
      cours: [
        C("Une provision est un passif dont l'échéance ou le montant est incertain. On la constate si trois conditions sont réunies à la clôture : une obligation envers un tiers, une sortie de ressources probable, et un montant estimable.", true),
        C("Ici, la garantie vendue crée l'obligation, l'expérience montre que des pannes surviendront, et on peut estimer le coût : `3 000 €`."),
        C("La charge probable appartient à l'exercice des ventes : `6815` Dotations aux provisions d'exploitation, au débit. En face, le passif augmente : `1512` Provisions pour garanties données aux clients, au crédit.", true),
        C("L'an prochain, les réparations réelles sont enregistrées normalement en charges. La provision, devenue sans objet, est reprise : `1512` au débit, le passif diminue, et `7815` Reprises, au crédit, un produit qui neutralise la dotation.", true),
        C("Si l'une des trois conditions manque, pas de provision : on informe dans l'annexe."),
      ],
      flash: [
        Q("Pourquoi le 1512 est-il crédité ?", ["C'est un passif qui augmente", "C'est une charge", "C'est un actif"], 0, "Obligation probable envers les clients."),
        Q("Les trois conditions d'une provision :", ["Obligation, sortie probable, montant estimable", "Facture, paiement, TVA", "Actif, passif, résultat"], 0, "PCG, art. 321-1 et s."),
        Q("Quand la provision devient sans objet :", ["1512 au débit, 7815 au crédit", "6815 au crédit", "On la garde"], 0, "Reprise de provision."),
      ],
      fiche: {
        essentiel: "Obligation à la clôture, sortie probable, montant estimable : on provisionne (6815 / 15), puis on reprend quand le risque disparaît (15 / 7815).",
        points: [
          "Provision = passif à échéance ou montant incertain.",
          "Trois conditions cumulatives.",
          "Dotation : 6815 / 151x.",
          "Reprise : 151x / 7815.",
          "Condition manquante : information en annexe.",
        ],
        methode: ["Vérifier les trois conditions", "Évaluer", "Dotation, puis reprise"],
        pieges: ["Provisionner une simple éventualité.", "Oublier la reprise."],
      },
    }),
    ecritures: [
      E("31/12/N · Provision pour garanties", [
        d("6815", "Dotations aux provisions d'exploitation", 3000, "Coût probable des réparations, rattaché à l'exercice des ventes."),
        c("1512", "Provisions pour garanties données aux clients", 3000, "Obligation probable envers les clients : passif."),
      ]),
      E("31/12/N+1 · Reprise", [
        d("1512", "Provisions pour garanties données aux clients", 3000, "Le risque de l'an dernier est éteint : le passif diminue."),
        c("7815", "Reprises sur provisions d'exploitation", 3000, "Produit qui neutralise la dotation."),
      ]),
    ],
  },
  {
    ...K({
      id: "dcg-stocks", ue: "dcg9",
      title: "Stocks : inventaire et variation", ref: "PCG, comptes 37, 6037",
      scene: [
        N("Angers. Une boutique de jeux avait huit mille euros de marchandises au 1er janvier. Au 31 décembre, l'inventaire en compte dix mille."),
        D("J'ai acheté cinquante mille euros de marchandises cette année. Ma charge, c'est cinquante mille ?"),
        X("Non : vous n'avez pas tout vendu. Ce qui reste en stock n'est pas une charge de cette année."),
        N("À l'examen : annuler le stock initial, constater le stock final, et calculer le coût d'achat des marchandises vendues."),
      ],
      cours: [
        C("En inventaire intermittent, les achats vont en charges toute l'année. À la clôture, on corrige avec le stock, un actif.", true),
        C("Le stock initial de huit mille a été consommé pendant l'année : il sort de l'actif, `37` au crédit, et devient une charge, `6037` Variation des stocks de marchandises, au débit."),
        C("Le stock final de dix mille est encore là : c'est un actif, `37` au débit. Il n'est pas une charge de l'année : on la diminue, `6037` au crédit.", true),
        C("Le 6037 a un solde créditeur de deux mille : il vient réduire les achats. Coût d'achat des marchandises vendues : cinquante mille, plus huit mille, moins dix mille, `48 000 €`.", true),
        C("Le stock est évalué à son coût d'achat, selon le coût moyen unitaire pondéré ou le premier entré, premier sorti, et déprécié si sa valeur de vente nette devient inférieure."),
      ],
      flash: [
        Q("Le stock final se comptabilise :", ["37 au débit, 6037 au crédit", "6037 au débit, 37 au crédit", "607 au crédit"], 0, "Actif qui apparaît, charge diminuée."),
        Q("Achats 50 000, stock initial 8 000, stock final 10 000 : coût d'achat des marchandises vendues ?", ["48 000", "52 000", "50 000"], 0, "50 000 + 8 000 − 10 000."),
        Q("Pourquoi le stock initial passe-t-il en charges ?", ["Il a été consommé pendant l'exercice", "Il est perdu", "Par prudence"], 0, "Il a servi aux ventes de l'année."),
      ],
      fiche: {
        essentiel: "On annule le stock initial (consommé) et on constate le stock final (encore à l'actif) : la variation corrige les achats.",
        points: [
          "Stock initial : 6037 / 37.",
          "Stock final : 37 / 6037.",
          "Coût d'achat des marchandises vendues = achats + SI − SF.",
          "Évaluation : CMUP ou FIFO.",
          "Dépréciation si la valeur nette de réalisation est inférieure au coût.",
        ],
        methode: ["Annuler le SI", "Constater le SF", "Calculer le coût des ventes"],
        pieges: ["Inverser les sens de la variation de stock."],
      },
    }),
    ecritures: [
      E("31/12 · Annulation du stock initial", [
        d("6037", "Variation des stocks de marchandises", 8000, "Le stock du début a été vendu : il devient une charge."),
        c("37", "Stocks de marchandises", 8000, "Il sort de l'actif."),
      ]),
      E("31/12 · Constatation du stock final", [
        d("37", "Stocks de marchandises", 10000, "Marchandises encore présentes : actif."),
        c("6037", "Variation des stocks de marchandises", 10000, "Ces achats ne sont pas une charge de l'année : la charge diminue."),
      ]),
    ],
  },
  {
    ...K({
      id: "dcg-documents-synthese", ue: "dcg9",
      title: "De la balance au bilan et au compte de résultat", ref: "C. com., art. L. 123-12 · PCG, comptes annuels",
      scene: [
        N("Limoges. Fin d'exercice dans une PME. La balance des comptes est équilibrée."),
        D("Et maintenant, comment j'en tire mon bilan et mon compte de résultat ?"),
        X("Chaque classe de comptes a sa place. Et le résultat fait le lien entre les deux."),
        N("À l'examen : classer les comptes, calculer le résultat, et vérifier que le bilan s'équilibre."),
      ],
      cours: [
        C("Les comptes annuels comprennent le bilan, le compte de résultat et l'annexe. Article `L. 123-12` du Code de commerce.", true),
        C("Les classes 1 à 5 vont au bilan : capitaux propres et dettes au passif, immobilisations, stocks, créances et trésorerie à l'actif. Les classes 6 et 7 vont au compte de résultat."),
        C("Résultat = produits moins charges. Ici, cinq cent mille euros de produits, quatre cent soixante mille de charges : bénéfice de `40 000 €`.", true),
        C("Le bénéfice appartient aux associés : il augmente les capitaux propres. Il s'inscrit au passif, compte `120`, au crédit. Une perte irait au `129`, au débit."),
        C("C'est pour ça que le bilan s'équilibre : le résultat du compte de résultat est le même que celui du bilan. Si les deux ne coïncident pas, il y a une erreur.", true),
      ],
      flash: [
        Q("Le compte 120 Résultat (bénéfice) est :", ["Au passif, dans les capitaux propres", "À l'actif", "Au compte de résultat"], 0, "Le bénéfice revient aux associés."),
        Q("Les comptes de classe 6 et 7 vont :", ["Au compte de résultat", "Au bilan", "À l'annexe"], 0, "Charges et produits."),
        Q("Produits 500 000, charges 460 000 :", ["Bénéfice de 40 000", "Perte de 40 000", "Bénéfice de 960 000"], 0, "Résultat = produits − charges."),
      ],
      fiche: {
        essentiel: "Classes 1 à 5 au bilan, 6 et 7 au compte de résultat ; le résultat relie les deux et s'inscrit dans les capitaux propres.",
        points: [
          "Comptes annuels : bilan, compte de résultat, annexe (art. L. 123-12).",
          "Bilan : classes 1 à 5.",
          "Compte de résultat : classes 6 et 7.",
          "Bénéfice : 120 au crédit ; perte : 129 au débit.",
          "Même résultat dans les deux documents.",
        ],
        methode: ["Classer la balance", "Calculer le résultat", "Contrôler l'équilibre du bilan"],
        pieges: ["Mettre le bénéfice à l'actif."],
      },
    }),
    ecritures: [
      E("Clôture · Détermination du résultat (vue d'ensemble)", [
        d("7", "Total des produits de l'exercice", 500000, "On solde les produits, créditeurs toute l'année."),
        c("6", "Total des charges de l'exercice", 460000, "On solde les charges, débitrices toute l'année."),
        c("120", "Résultat de l'exercice (bénéfice)", 40000, "Le bénéfice enrichit les associés : capitaux propres."),
      ], "Écriture pédagogique de synthèse : produits − charges = résultat."),
    ],
  },
  {
    ...K({
      id: "dcg-environnement-numerique", ue: "dcg9",
      title: "La comptabilité à l'ère numérique", ref: "Facturation électronique (réforme 2026-2027) · FEC (art. L. 47 A LPF)",
      scene: [
        N("Paris. Dans un cabinet, les factures fournisseurs arrivent désormais au format électronique, et l'écriture se propose toute seule."),
        D("Si le logiciel saisit à ma place, à quoi je sers ?"),
        X("À vérifier que chaque ligne a du sens. Un logiciel qui se trompe de compte se trompe des milliers de fois."),
        N("À l'examen : connaître les outils, et savoir contrôler une écriture générée automatiquement."),
      ],
      cours: [
        C("La facturation électronique devient obligatoire entre entreprises assujetties à la TVA en France. Toutes doivent pouvoir recevoir des factures électroniques à partir du `1er septembre 2026`. L'émission devient obligatoire à cette date pour les grandes entreprises et les ETI, et en septembre 2027 pour les PME et microentreprises.", true),
        C("Les factures transitent par des plateformes agréées. Le logiciel lit les données structurées, propose les comptes, et prépare le lettrage avec les paiements."),
        C("Le fichier des écritures comptables, le FEC, doit pouvoir être remis à l'administration en cas de contrôle. Article `L. 47 A` du Livre des procédures fiscales.", true),
        C("Le rôle du comptable change : il paramètre les règles d'affectation, contrôle les anomalies et analyse les comptes. Il doit toujours savoir dire pourquoi un compte est au débit ou au crédit.", true),
        C("Exemple de contrôle : une facture d'ordinateur portable proposée en charge, alors qu'elle dépasse le seuil d'immobilisation retenu par l'entreprise et servira plusieurs années, doit être reclassée à l'actif."),
      ],
      flash: [
        Q("Date à partir de laquelle toutes les entreprises doivent pouvoir recevoir des factures électroniques :", ["1er septembre 2026", "1er janvier 2025", "1er septembre 2030"], 0, "Calendrier de la réforme."),
        Q("Le FEC est :", ["Le fichier des écritures comptables à remettre en cas de contrôle", "Une facture électronique", "Un logiciel"], 0, "Art. L. 47 A LPF."),
        Q("Une écriture proposée automatiquement :", ["Doit être contrôlée", "Est toujours juste", "N'a pas besoin de pièce"], 0, "Le comptable reste responsable."),
      ],
      fiche: {
        essentiel: "Factures électroniques, plateformes agréées et écritures automatiques : le comptable paramètre et contrôle, en sachant justifier chaque ligne.",
        points: [
          "Réception obligatoire au 1er septembre 2026 pour toutes les entreprises.",
          "Émission : grandes entreprises et ETI en 2026, PME et microentreprises en 2027.",
          "Plateformes agréées ; données structurées ; lettrage automatique.",
          "FEC : art. L. 47 A LPF.",
          "Contrôle des affectations : charge ou immobilisation, compte de TVA.",
        ],
        methode: ["Identifier l'outil", "Contrôler l'écriture proposée", "Corriger et justifier"],
        pieges: ["Valider sans contrôle une écriture générée par le logiciel."],
      },
    }),
    ecritures: [
      E("Écriture proposée, après correction · Ordinateur de 1 400 € HT", [
        d("2183", "Matériel de bureau et informatique", 1400, "Il servira plusieurs années : actif, et non charge comme le proposait le logiciel."),
        d("44562", "TVA déductible sur immobilisations", 280, "TVA sur une immobilisation : créance, compte dédié."),
        c("404", "Fournisseurs d'immobilisations", 1680, "Dette liée à un investissement."),
      ], "Le logiciel avait proposé 6063 et 44566 : à corriger."),
    ],
  },
];
