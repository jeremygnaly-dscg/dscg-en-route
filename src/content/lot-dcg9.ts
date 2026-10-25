// DCG UE9 · Introduction à la comptabilité — épisodes « logique comptable ».
// Chaque écriture s'explique : l'opération, les comptes et leur nature (actif, passif, charge, produit),
// puis le sens de chaque ligne et pourquoi. Le candidat comprend au lieu de réciter.
// PCG à jour du règlement ANC 2022-06 (exercices ouverts depuis le 1er janvier 2025).
// À FAIRE RELIRE avant génération des voix et vente.
import type { Episode, Ecriture, LigneEcriture } from "./types";
import { C, D, N, Q, X, ecrit } from "./lot-outils";

const K = ecrit("comptable", "Cas Zenvise, programme DCG 2027");
const d = (compte: string, intitule: string, debit: number, pourquoi: string): LigneEcriture => ({ compte, intitule, debit, pourquoi });
const c = (compte: string, intitule: string, credit: number, pourquoi: string): LigneEcriture => ({ compte, intitule, credit, pourquoi });
const E = (titre: string, lignes: LigneEcriture[], regle?: string): Ecriture => ({ titre, lignes, regle });

export const LOT_DCG9: Episode[] = [
  // ───────────── Les bases ─────────────
  {
    ...K({
      id: "dcg-logique-comptable", ue: "dcg9", notion: "dcg-normalisation",
      title: "Débit, crédit : la logique des comptes", ref: "PCG, art. 211-1 et 212-1 (définitions de l'actif et du passif)",
      scene: [
        N("Lyon. Première semaine de stage dans un cabinet. Inès doit saisir une facture de vente."),
        D("J'ai appris par cœur que le client se met au débit. Mais je ne sais pas pourquoi, alors je me trompe dès que ça change."),
        X("Oublie le par cœur. Pose-toi deux questions : ce compte, c'est quoi ? Et il augmente ou il diminue ?"),
        N("À l'examen : chaque ligne d'écriture doit pouvoir se justifier en une phrase."),
      ],
      cours: [
        C("Un actif est une ressource contrôlée par l'entreprise, dont elle attend des avantages économiques futurs, souvent une entrée d'argent. Un client qui nous doit de l'argent, c'est un actif. Article `211-1` du PCG.", true),
        C("Un passif est une obligation envers un tiers qui provoquera une sortie de ressources, sans contrepartie équivalente. Une dette fournisseur ou la TVA due à l'État, c'est un passif. Article `212-1`."),
        C("La règle des sens : un actif augmente au débit et diminue au crédit. Un passif, et les capitaux propres, augmentent au crédit et diminuent au débit.", true),
        C("Les charges, en classe 6, appauvrissent l'entreprise : elles se débitent. Les produits, en classe 7, l'enrichissent : ils se créditent. Exception : un 9 en troisième position, comme `609` ou `709`, signale un compte qui corrige le précédent, et se passe dans le sens inverse.", true),
        C("Les comptes de dépréciation et d'amortissement, `28`, `29`, `39`, `49`, `59`, diminuent un actif : ils se créditent."),
        C("Le réflexe : pour chaque ligne, dis la nature du compte, s'il augmente ou diminue, et déduis-en le sens. Puis vérifie que le total des débits égale le total des crédits."),
      ],
      flash: [
        Q("Une créance client est :", ["Un actif", "Un passif", "Une charge"], 0, "Ressource contrôlée qui procurera une entrée d'argent."),
        Q("Le compte 709 Rabais accordés se passe :", ["Au crédit, comme un produit", "Au débit, car il corrige un produit", "Jamais"], 1, "Un 9 en troisième position inverse le sens."),
        Q("Une dette augmente :", ["Au débit", "Au crédit", "Au débit ou au crédit selon le montant"], 1, "Passif : augmentation au crédit."),
      ],
      fiche: {
        essentiel: "Nature du compte, puis augmentation ou diminution : actif et charges au débit, passif, capitaux propres et produits au crédit.",
        points: [
          "Actif (art. 211-1 PCG) : ressource contrôlée, avantages économiques futurs attendus.",
          "Passif (art. 212-1) : obligation envers un tiers, sortie de ressources sans contrepartie équivalente.",
          "Actif ↑ débit, ↓ crédit ; passif et capitaux propres ↑ crédit, ↓ débit.",
          "Classe 6 au débit, classe 7 au crédit ; 6x9 et 7x9 en sens inverse.",
          "Comptes 28, 29, 39, 49, 59 : diminuent l'actif, au crédit.",
        ],
        methode: ["Quelle est l'opération ?", "Nature de chaque compte", "Augmente ou diminue : le sens", "Débit = crédit"],
        pieges: ["Apprendre les écritures par cœur sans savoir les justifier."],
      },
    }),
    ecritures: [
      E("Exemple · Vente au comptant de 1 000 € HT, TVA 20 %", [
        d("512", "Banque", 1200, "La banque est un actif ; l'argent arrive, l'actif augmente."),
        c("707", "Ventes de marchandises", 1000, "Un produit enrichit l'entreprise : classe 7 au crédit."),
        c("44571", "TVA collectée", 200, "La TVA encaissée est due à l'État : c'est un passif qui augmente."),
      ], "Total des débits 1 200 = total des crédits 1 200."),
    ],
  },
  {
    ...K({
      id: "dcg-normalisation", ue: "dcg9",
      title: "Normalisation et principes comptables", ref: "art. L. 123-12 à L. 123-23 C. com. · PCG (règl. ANC 2014-03)",
      scene: [
        N("Nantes, janvier. La fondatrice de Kiosque Vert prépare un rendez-vous avec sa banque."),
        D("Le stock de l'ancienne collection ne vaut plus grand-chose. Mais si je le laisse à son coût, mon bilan est plus joli pour le banquier."),
        X("Ce n'est pas un choix. La prudence impose de constater la perte probable dès maintenant."),
        D("Et si je compense avec la créance que j'ai sur mon fournisseur ?"),
        X("Non plus : on ne compense pas un actif et un passif. Chacun reste à sa place."),
        N("À l'examen : nommer le principe en cause, citer le texte, et en tirer la conséquence sur les comptes."),
      ],
      cours: [
        C("En France, la norme comptable est fixée par l'Autorité des normes comptables. Ses règlements, homologués par arrêté, forment le Plan comptable général. Le Code de commerce pose les principes."),
        C("L'objectif : des comptes réguliers, sincères, qui donnent une image fidèle du patrimoine, de la situation financière et du résultat. Article `L. 123-14` du Code de commerce.", true),
        C("Prudence : on ne retient que les bénéfices réalisés, mais on tient compte des pertes probables, même connues après la clôture. Article `L. 123-20`.", true),
        C("Non-compensation : aucune compensation entre actif et passif, ni entre charges et produits. Article `L. 123-19`."),
        C("Pour Kiosque Vert : le stock démodé doit être déprécié. La dépréciation est une charge, au débit, et vient diminuer l'actif stock, au crédit d'un compte `39`.", true),
      ],
      flash: [
        Q("Qui fixe la norme comptable française ?", ["L'Autorité des normes comptables", "L'Ordre des experts-comptables", "La DGFiP"], 0, "L'ANC établit le PCG par règlements homologués."),
        Q("Une perte probable connue après la clôture, avant l'arrêté des comptes :", ["On en tient compte", "On l'ignore", "On attend l'exercice suivant"], 0, "Prudence, art. L. 123-20 C. com."),
        Q("Compenser une dette fournisseur avec une créance sur ce même fournisseur au bilan :", ["Interdit", "Obligatoire", "Libre"], 0, "Non-compensation, art. L. 123-19 C. com."),
      ],
      fiche: {
        essentiel: "Les comptes doivent être réguliers, sincères et donner une image fidèle ; les principes comptables sont les moyens d'y parvenir.",
        points: [
          "ANC : règlements homologués, réunis dans le PCG (règl. 2014-03 modifié notamment par le règl. 2022-06).",
          "Image fidèle, régularité, sincérité : art. L. 123-14 C. com.",
          "Prudence : pertes probables prises en compte, gains seulement réalisés.",
          "Non-compensation, permanence des méthodes, indépendance des exercices.",
          "Intangibilité du bilan d'ouverture, continuité d'exploitation, coût historique.",
        ],
        methode: ["Identifier le fait comptable", "Nommer le principe et citer l'article", "Conséquence sur les comptes"],
        pieges: ["Confondre prudence et sous-évaluation volontaire."],
      },
    }),
    ecritures: [
      E("31/12 · Dépréciation du stock démodé (coût 8 000 €, valeur probable 5 000 €)", [
        d("6817", "Dotations aux dépréciations des actifs circulants", 3000, "La perte de valeur appauvrit l'entreprise : c'est une charge."),
        c("397", "Dépréciations des stocks de marchandises", 3000, "Compte correcteur : il diminue l'actif stock sans toucher au compte de stock."),
      ], "Prudence : la perte probable est constatée dès la clôture."),
    ],
  },
  // ───────────── Les opérations courantes ─────────────
  {
    ...K({
      id: "dcg-ventes", ue: "dcg9", notion: "dcg-ventes-achats",
      title: "Comptabiliser une vente de marchandises, puis un avoir", ref: "PCG, comptes 411, 707, 709, 44571",
      scene: [
        N("Bordeaux. La société Cuisines Arnaud vend à un restaurant du matériel de cuisine : cinq mille euros, remise de dix pour cent sur la facture."),
        D("Comment je comptabilise cette vente ?"),
        X("On part de ce qui se passe : vous vendez, le client vous doit de l'argent, et vous devez la TVA à l'État. Chaque fait donne une ligne."),
        D("Et si le client obtient ensuite un rabais pour un défaut ?"),
        X("Alors on fait un avoir, et là, les sens s'inversent."),
        N("À l'examen : reconstituer la facture, puis justifier chaque ligne de l'écriture."),
      ],
      cours: [
        C("L'opération : une vente de marchandises à crédit. Prix brut cinq mille, remise de dix pour cent : net commercial quatre mille cinq cents. TVA à vingt pour cent : neuf cents. Total TTC : `5 400 €`. Une remise figurant sur la facture d'origine ne se comptabilise pas.", true),
        C("Le compte `411` Clients est au débit : le client nous doit de l'argent. C'est un actif, une ressource dont on attend une entrée de trésorerie. L'actif augmente, donc débit, pour le TTC.", true),
        C("Le compte `707` Ventes de marchandises est au crédit : c'est un produit, il enrichit l'entreprise. Pour le hors-taxe, car la TVA n'est pas à nous."),
        C("Le compte `44571` TVA collectée est au crédit : cette TVA, encaissée pour le compte de l'État, devra lui être reversée. C'est un passif qui augmente.", true),
        C("L'avoir pour un rabais de trois cents euros hors taxes : on inverse. Le `709` Rabais accordés se débite, car avec son 9 en troisième position il corrige le compte de ventes. La TVA collectée diminue, au débit. Et la créance client diminue, au crédit : `360 €`.", true),
      ],
      flash: [
        Q("Pourquoi le compte 411 est-il débité lors d'une facture de vente ?", ["C'est un actif qui augmente", "C'est une charge", "C'est un passif qui diminue"], 0, "Le client nous doit de l'argent : créance à l'actif."),
        Q("La TVA collectée est :", ["Un passif envers l'État", "Un produit", "Un actif"], 0, "Elle sera reversée au Trésor."),
        Q("Sur un avoir pour rabais, le 709 est :", ["Débité", "Crédité", "Non utilisé"], 0, "Il corrige les ventes : sens inverse d'un produit."),
      ],
      fiche: {
        essentiel: "Facture de vente : client au débit (actif qui augmente), ventes et TVA collectée au crédit ; l'avoir inverse les sens, avec le 709 au débit.",
        points: [
          "Remise sur facture d'origine : on comptabilise directement le net commercial.",
          "411 Clients : actif, débité du TTC.",
          "707 Ventes : produit, crédité du HT.",
          "44571 TVA collectée : passif envers l'État, créditée.",
          "Avoir : 709 et 44571 au débit, 411 au crédit.",
        ],
        methode: ["Reconstituer la facture", "Nature et sens de chaque compte", "Équilibre débit-crédit"],
        pieges: ["Créditer le 707 du TTC.", "Comptabiliser en 709 une remise déjà déduite sur la facture."],
      },
    }),
    ecritures: [
      E("Facture de vente n° 214", [
        d("411", "Clients", 5400, "Le client nous doit 5 400 € : créance, donc actif qui augmente."),
        c("707", "Ventes de marchandises", 4500, "Produit de la vente, au net commercial hors taxes."),
        c("44571", "TVA collectée", 900, "Dette envers l'État : passif qui augmente."),
      ], "Remise de 10 % sur la facture d'origine : déjà déduite, aucune ligne."),
      E("Avoir n° 31 · Rabais pour défaut", [
        d("709", "Rabais, remises et ristournes accordés", 300, "Compte en 9 : il réduit les ventes, donc il se débite."),
        d("44571", "TVA collectée", 60, "La TVA due à l'État diminue : passif qui diminue, au débit."),
        c("411", "Clients", 360, "Le client nous doit 360 € de moins : actif qui diminue."),
      ]),
    ],
  },
  {
    ...K({
      id: "dcg-ventes-achats", ue: "dcg9",
      title: "Comptabiliser une facture d'achat : réductions, escompte et port", ref: "PCG, comptes 401, 607, 609, 6241, 765 · art. 267 CGI",
      scene: [
        N("Lyon. Le comptable de la quincaillerie Ferrand saisit une facture de son grossiste."),
        D("Prix catalogue dix mille euros, remise de dix pour cent, escompte de deux pour cent si je paie comptant, et deux cents euros de port. Je mets quoi en achats ?"),
        X("L'achat s'enregistre au net commercial : neuf mille euros. L'escompte, lui, est un produit financier."),
        N("À l'examen : reconstituer la facture ligne par ligne, puis justifier chaque compte."),
      ],
      cours: [
        C("L'opération : un achat de marchandises à crédit. Cascade : brut dix mille, remise mille, net commercial neuf mille ; escompte de deux pour cent, cent quatre-vingts ; port deux cents. Base de TVA : neuf mille vingt. TVA : mille huit cent quatre. Total : `10 824 €`.", true),
        C("Le `607` Achats de marchandises est au débit : c'est une charge, elle appauvrit l'entreprise. On l'enregistre au net commercial, la remise sur facture n'apparaît pas."),
        C("Le `44566` TVA déductible est au débit : c'est une créance sur l'État, que l'on récupérera. C'est un actif qui augmente.", true),
        C("L'escompte obtenu, `765`, est au crédit : c'est un produit financier, il récompense un paiement rapide. Le `401` Fournisseurs est au crédit : nous devons de l'argent, c'est un passif qui augmente.", true),
        C("Si une réduction arrive après, par avoir, elle va au `609`, au crédit : avec son 9 en troisième position, il corrige les achats."),
      ],
      flash: [
        Q("Pourquoi le 401 est-il crédité ?", ["C'est une dette qui augmente", "C'est une charge", "C'est un actif qui augmente"], 0, "Nous devons de l'argent au fournisseur."),
        Q("Chez l'acheteur, l'escompte de règlement est :", ["Un produit financier (765)", "Une réduction d'achat (609)", "Une charge (665)"], 0, "Réduction financière."),
        Q("La TVA déductible est :", ["Une créance sur l'État, au débit", "Une dette, au crédit", "Une charge"], 0, "Actif récupérable."),
      ],
      fiche: {
        essentiel: "Achat : charge au débit au net commercial, TVA déductible au débit, escompte en produit financier, fournisseur au crédit.",
        points: [
          "607 Achats : charge au débit.",
          "44566 TVA déductible : créance sur l'État, au débit.",
          "765 Escomptes obtenus : produit financier, au crédit.",
          "401 Fournisseurs : dette, au crédit.",
          "Avoir ultérieur : 609 au crédit ; port : 6241 au débit.",
        ],
        methode: ["Cascade de la facture", "Nature et sens de chaque compte", "Équilibre"],
        pieges: ["Calculer l'escompte sur le brut.", "Oublier le port dans la base de TVA."],
      },
    }),
    ecritures: [
      E("Chez Ferrand · Facture du grossiste", [
        d("607", "Achats de marchandises", 9000, "Charge d'achat, au net commercial."),
        d("6241", "Transports sur achats", 200, "Le port facturé est une charge."),
        d("44566", "TVA déductible sur ABS", 1804, "Créance sur l'État : actif qui augmente."),
        c("765", "Escomptes obtenus", 180, "Produit financier : récompense du paiement comptant."),
        c("401", "Fournisseurs", 10824, "Nous devons cette somme : passif qui augmente."),
      ], "Base TVA = 9 000 − 180 + 200 = 9 020 ; TVA 1 804."),
    ],
    formules: [
      { nom: "Cascade de la facture", formule: "Brut − réductions commerciales = net commercial − escompte = net financier + port = base HT", legende: ["10 000 − 1 000 = 9 000 − 180 = 8 820 + 200 = 9 020"], piege: "Calculer l'escompte sur le brut." },
    ],
  },
  {
    ...K({
      id: "dcg-tva-comptable", ue: "dcg9",
      title: "Comptabiliser et liquider la TVA", ref: "art. 269 et 271 CGI · PCG, comptes 445",
      scene: [
        N("Toulouse, début avril. Atelier Brique prépare sa déclaration de TVA de mars."),
        D("Vingt-quatre mille de TVA facturée, neuf mille cinq cents payée sur mes achats, quatre mille sur une machine, et un crédit de mille cinq cents du mois dernier."),
        X("Alors vous devez neuf mille euros. On solde chaque compte de TVA, et la différence va en TVA à décaisser."),
        N("À l'examen : l'écriture de liquidation, en justifiant chaque sens, puis le paiement."),
      ],
      cours: [
        C("La TVA collectée, `44571`, est une dette envers l'État : un passif, inscrit au crédit tout le mois. La TVA déductible, `44566` et `44562` pour les immobilisations, est une créance : un actif, inscrit au débit.", true),
        C("Liquider, c'est solder ces comptes. Pour solder un compte créditeur, on le débite : le `44571` passe au débit de vingt-quatre mille. Pour solder un compte débiteur, on le crédite : les TVA déductibles et le crédit antérieur passent au crédit.", true),
        C("La différence, neuf mille euros, est ce que l'on doit réellement : `44551` TVA à décaisser, une dette, au crédit. Si la différence était inverse, ce serait un crédit de TVA, `44567`, une créance, au débit."),
        C("Au paiement, la dette disparaît, `44551` au débit, et la banque diminue, `512` au crédit.", true),
        C("Exigibilité : livraisons de biens à la livraison, services à l'encaissement sauf option pour les débits. Article `269` du CGI."),
      ],
      flash: [
        Q("Pour solder le compte 44571 lors de la liquidation, on le :", ["Débite", "Crédite", "Laisse tel quel"], 0, "Il est créditeur : on le débite pour le solder."),
        Q("La TVA à décaisser (44551) est :", ["Une dette, au crédit", "Une créance, au débit", "Une charge"], 0, "Somme due au Trésor."),
        Q("La TVA sur l'achat d'une machine va au compte :", ["44562", "44566", "44571"], 0, "TVA déductible sur immobilisations."),
      ],
      fiche: {
        essentiel: "Liquider la TVA, c'est solder les comptes de TVA : la collectée au débit, les déductibles au crédit, la différence en TVA à décaisser ou en crédit.",
        points: [
          "44571 collectée : passif ; 44566 et 44562 déductibles : actifs.",
          "Solder un compte = le passer dans le sens opposé à son solde.",
          "44551 TVA à décaisser (dette) ou 44567 crédit de TVA (créance).",
          "Paiement : 44551 au débit, 512 au crédit.",
          "Exigibilité : biens à la livraison, services à l'encaissement.",
        ],
        methode: ["Totaliser chaque compte", "Solder", "Différence et paiement"],
        pieges: ["Oublier le crédit de TVA du mois précédent."],
      },
    }),
    ecritures: [
      E("Fin mars · Liquidation de la TVA", [
        d("44571", "TVA collectée", 24000, "On solde la dette du mois : compte créditeur, donc débité."),
        c("44566", "TVA déductible sur ABS", 9500, "On solde la créance : compte débiteur, donc crédité."),
        c("44562", "TVA déductible sur immobilisations", 4000, "Idem : la créance est imputée sur la dette."),
        c("44567", "Crédit de TVA à reporter", 1500, "Le crédit du mois précédent est utilisé : la créance diminue."),
        c("44551", "TVA à décaisser", 9000, "Reste dû à l'État : passif qui apparaît."),
      ], "24 000 − 9 500 − 4 000 − 1 500 = 9 000."),
      E("Avril · Paiement", [
        d("44551", "TVA à décaisser", 9000, "La dette est payée : le passif diminue."),
        c("512", "Banque", 9000, "L'argent sort : l'actif banque diminue."),
      ]),
    ],
  },
  // ───────────── Investissement ─────────────
  {
    ...K({
      id: "dcg-acquisition-immo", ue: "dcg9",
      title: "Acquisition d'une immobilisation : le coût d'acquisition", ref: "PCG, art. 213-8 et s. (coût d'entrée)",
      scene: [
        N("Saint-Étienne. L'imprimerie Lamy achète une presse numérique."),
        D("Cinquante mille euros, cinq pour cent de remise, douze cents de transport, deux mille trois cents d'installation, et mille euros pour former mes opérateurs."),
        X("Tout ce qui sert à mettre la presse en état de fonctionner entre dans son coût. Pour la formation, le plan comptable vous laisse le choix : ici, on la passe en charges."),
        N("À l'examen : trier les coûts, calculer le coût d'acquisition, et justifier l'écriture."),
      ],
      cours: [
        C("L'opération : un achat qui va servir plusieurs années. Ce n'est pas une charge de l'exercice, c'est un actif durable, une immobilisation, en classe 2. Il est contrôlé et procurera des avantages économiques sur plusieurs exercices.", true),
        C("Son coût d'acquisition : le prix net de remises, plus les coûts directement attribuables pour le mettre en état de fonctionner. Ici : quarante-sept mille cinq cents, plus le transport, plus l'installation : `51 000 €`.", true),
        C("La formation des opérateurs est un cas à part : le PCG permet, sur option, de l'inclure dans le coût, ou de la passer en charges. L'entreprise retient ici les charges, en classe 6. Article 213-8 du PCG."),
        C("L'écriture : `2154` Matériel industriel au débit, un actif qui augmente. TVA déductible sur immobilisations, `44562`, au débit, une créance sur l'État. Et `404` Fournisseurs d'immobilisations au crédit, une dette qui augmente.", true),
        C("On utilise le `404` et non le `401` : on distingue les dettes liées aux investissements de celles liées à l'exploitation. L'amortissement commencera à la mise en service."),
      ],
      flash: [
        Q("Pourquoi la presse va-t-elle à l'actif et non en charges ?", ["Elle servira plusieurs exercices", "Elle est chère", "Elle est payée à crédit"], 0, "Ressource durable : immobilisation."),
        Q("Les frais externes de formation nécessaires à la mise en service :", ["Sont toujours une charge", "Peuvent, sur option, s'ajouter au coût ou aller en charges", "Sont un actif séparé"], 1, "PCG, art. 213-8."),
        Q("Dette envers le vendeur de la presse :", ["404", "401", "411"], 0, "Fournisseurs d'immobilisations."),
      ],
      fiche: {
        essentiel: "Un bien durable est un actif ; il entre au coût d'acquisition : prix net + coûts directement attribuables à sa mise en état de fonctionner.",
        points: [
          "Inclus : transport, installation, montage, essais, honoraires techniques.",
          "Exclus : frais administratifs, coûts de démarrage. Formation nécessaire à la mise en service : option coût ou charges (art. 213-8).",
          "Frais d'acquisition (droits, honoraires, commissions) : option incorporation ou charges.",
          "2154 au débit (actif), 44562 au débit (créance), 404 au crédit (dette).",
          "Amortissement à partir de la mise en service.",
        ],
        methode: ["Actif ou charge ?", "Coût d'acquisition", "Écriture justifiée"],
        pieges: ["Utiliser 401 au lieu de 404.", "Oublier de justifier l'option retenue pour la formation."],
      },
    }),
    ecritures: [
      E("Réception de la presse", [
        d("2154", "Matériel industriel", 51000, "Ressource durable contrôlée : l'actif immobilisé augmente."),
        d("44562", "TVA déductible sur immobilisations", 10200, "Créance sur l'État, récupérable : actif."),
        c("404", "Fournisseurs d'immobilisations", 61200, "Nous devons le prix TTC : dette liée à un investissement."),
      ], "47 500 + 1 200 + 2 300 = 51 000 ; la formation (1 000) va en charges, selon l'option retenue."),
    ],
  },
  {
    ...K({
      id: "dcg-amortissements", ue: "dcg9",
      title: "Amortissement linéaire, dégressif et dérogatoire", ref: "PCG, amortissement des actifs · art. 39 A CGI",
      scene: [
        N("La presse de l'imprimerie Lamy est mise en service le premier avril. Elle coûte cinquante et un mille euros et doit durer cinq ans."),
        D("Pourquoi je passe une charge alors que je n'ai rien payé cette année ?"),
        X("Parce que la presse s'use. L'amortissement répartit son coût sur les années où elle vous sert."),
        N("À l'examen : un plan d'amortissement, puis l'écriture justifiée."),
      ],
      cours: [
        C("L'opération : la presse perd de la valeur en servant. Cette consommation de l'actif est une charge de l'exercice : la dotation aux amortissements, `6811`, au débit.", true),
        C("En face, on ne touche pas au compte de la presse : on crédite un compte correcteur, `28154`, qui diminue la valeur de l'actif. Au bilan, on lira le coût, moins les amortissements cumulés : la valeur nette comptable.", true),
        C("Linéaire : vingt pour cent par an, soit dix mille deux cents. Pour neuf mois en année un : `7 650 €`."),
        C("Fiscalement, le dégressif permet d'aller plus vite : coefficient `1,75` pour cinq ans, soit trente-cinq pour cent, et `13 387,50 €` en année un. L'écart, `5 737,50 €`, est l'amortissement dérogatoire.", true),
        C("Le dérogatoire n'est pas une vraie usure : c'est un avantage fiscal. Il se passe en charge exceptionnelle, `6872`, au débit, et au crédit du `145`, une provision réglementée inscrite dans les capitaux propres."),
      ],
      flash: [
        Q("Pourquoi crédite-t-on le 28154 et non le 2154 ?", ["Pour garder le coût d'origine visible et diminuer l'actif par un compte correcteur", "Parce que c'est une dette", "Par erreur"], 0, "Le 28 est un compte correcteur d'actif."),
        Q("Coefficient dégressif pour un bien de 5 ans :", ["1,75", "1,25", "2,25"], 0, "5 ou 6 ans."),
        Q("L'amortissement dérogatoire se comptabilise en :", ["6872 / 145", "6811 / 28", "6816 / 29"], 0, "Provision réglementée."),
      ],
      fiche: {
        essentiel: "L'amortissement constate l'usure : charge au débit, compte correcteur d'actif au crédit ; le dérogatoire isole l'avantage fiscal.",
        points: [
          "6811 au débit (charge) ; 28 au crédit (diminue l'actif).",
          "Linéaire : prorata depuis la mise en service.",
          "Dégressif : 1,25 / 1,75 / 2,25 ; prorata depuis le 1er jour du mois d'acquisition.",
          "Dérogatoire = fiscal − comptable : 6872 / 145 ; reprise 145 / 7872.",
          "VNC = coût − amortissements cumulés.",
        ],
        methode: ["Base, durée, date", "Plans comptable et fiscal", "Écritures justifiées"],
        pieges: ["Créditer directement le compte d'immobilisation.", "Passer le dérogatoire en 6811."],
      },
    }),
    ecritures: [
      E("31/12/N · Amortissement comptable", [
        d("6811", "Dotations aux amortissements des immobilisations", 7650, "L'usure de la presse est une charge de l'exercice."),
        c("28154", "Amortissements du matériel industriel", 7650, "Compte correcteur : il diminue la valeur de l'actif sans effacer son coût."),
      ], "51 000 × 20 % × 9/12."),
      E("31/12/N · Amortissement dérogatoire", [
        d("6872", "Dotations aux provisions réglementées (immobilisations)", 5737.5, "Charge exceptionnelle : l'avantage fiscal du dégressif."),
        c("145", "Amortissements dérogatoires", 5737.5, "Provision réglementée, dans les capitaux propres : elle augmente."),
      ], "13 387,50 − 7 650."),
    ],
  },
  // ───────────── Inventaire ─────────────
  {
    ...K({
      id: "dcg-regularisations", ue: "dcg9",
      title: "Régularisations : charges et produits constatés d'avance, à payer, à recevoir", ref: "Indépendance des exercices · PCG, comptes 408, 418, 486, 487",
      scene: [
        N("Rennes, 31 décembre. Le cabinet de conseil Boussole clôture son exercice."),
        D("J'ai payé l'assurance annuelle en octobre, deux mille quatre cents euros. Et la facture d'électricité de décembre n'est pas arrivée."),
        X("Neuf mois d'assurance concernent l'an prochain. Et l'électricité de décembre est bien une charge de cette année."),
        N("À l'examen : rattacher chaque charge et chaque produit au bon exercice, en justifiant chaque compte."),
      ],
      cours: [
        C("Le principe : chaque exercice ne supporte que ses propres charges et ses propres produits, quelle que soit la date de la facture. C'est l'indépendance des exercices.", true),
        C("Assurance payée d'avance : neuf mois sur douze, `1 800 €`, ne sont pas une charge de cette année. On diminue la charge, `616` au crédit, et on constate un droit à être couvert l'an prochain : `486` Charges constatées d'avance, un actif, au débit.", true),
        C("Électricité de décembre non facturée : c'est une charge de l'exercice, au débit. En face, nous devons de l'argent même sans facture : `408` Fournisseurs, factures non parvenues, une dette, au crédit. La TVA attendue va en `44586`, au débit."),
        C("Mission réalisée en décembre, facturée en janvier : c'est un produit de cette année, `706` au crédit. Le client nous le doit déjà : `418` Clients, factures à établir, un actif, au débit.", true),
        C("Au premier jour de l'exercice suivant, on contrepasse ces écritures, pour que les vraies factures se saisissent sans doublon."),
      ],
      flash: [
        Q("Pourquoi le 486 est-il débité ?", ["C'est un actif : un droit à une prestation future déjà payée", "C'est une charge", "C'est une dette"], 0, "Charge constatée d'avance."),
        Q("Le 408 est :", ["Une dette, au crédit", "Une créance, au débit", "Un produit"], 0, "Facture non parvenue : nous devons."),
        Q("Une prestation faite en décembre, facturée en janvier :", ["418 au débit, 706 au crédit au 31/12", "Produit de janvier", "487 au crédit"], 0, "Le produit appartient à l'exercice de réalisation."),
      ],
      fiche: {
        essentiel: "Chaque exercice supporte ses charges et produits : on corrige à la clôture avec des comptes d'actif ou de passif, puis on contrepasse.",
        points: [
          "486 CCA : actif (prestation payée d'avance) ; charge diminuée au crédit.",
          "487 PCA : passif (produit encaissé d'avance) ; produit diminué au débit.",
          "408 + 44586 : dette de l'exercice sans facture.",
          "418 + 44587 : créance de l'exercice sans facture.",
          "Contrepassation au premier jour de l'exercice suivant.",
        ],
        methode: ["Quel exercice ?", "Nature du compte de régularisation", "Montant prorata temporis"],
        pieges: ["Mettre de la TVA sur une charge constatée d'avance.", "Oublier la contrepassation."],
      },
    }),
    ecritures: [
      E("31/12/N · Charge constatée d'avance", [
        d("486", "Charges constatées d'avance", 1800, "Droit à 9 mois de couverture l'an prochain, déjà payé : actif."),
        c("616", "Primes d'assurance", 1800, "La charge de l'exercice est réduite de ce qui concerne l'an prochain."),
      ], "2 400 × 9/12."),
      E("31/12/N · Facture d'électricité non parvenue", [
        d("6061", "Fournitures non stockables", 600, "Consommation de décembre : charge de cet exercice."),
        d("44586", "TVA sur factures non parvenues", 120, "TVA que l'on pourra déduire : créance."),
        c("408", "Fournisseurs, factures non parvenues", 720, "Nous devons cette somme, même sans facture : dette."),
      ]),
      E("31/12/N · Mission réalisée non facturée", [
        d("418", "Clients, factures à établir", 4800, "Le client nous doit déjà la prestation : créance."),
        c("706", "Prestations de services", 4000, "Produit réalisé cette année."),
        c("44587", "TVA sur factures à établir", 800, "TVA que nous devrons reverser : dette."),
      ]),
    ],
  },
  {
    ...K({
      id: "dcg-creances-douteuses", ue: "dcg9",
      title: "Créances douteuses et irrécouvrables", ref: "PCG, comptes 416, 491, 654 · art. 272 CGI",
      scene: [
        N("Lille, décembre. Le client Dupont doit douze mille euros TTC à Textila. Il vient d'être placé en redressement judiciaire."),
        D("Mon avocat pense que je récupérerai soixante pour cent. Je perds quarante pour cent tout de suite ?"),
        X("On isole la créance en douteux, puis on la déprécie de la perte probable. Mais sur le hors-taxe : la TVA, vous la récupérerez si la perte devient définitive."),
        N("À l'examen : transfert, dépréciation, puis l'année suivante perte et reprise, chaque fois justifiés."),
      ],
      cours: [
        C("La créance reste un actif, mais son recouvrement devient incertain. On la reclasse : `416` Clients douteux au débit, `411` au crédit, pour le TTC. Ce n'est qu'un changement d'étiquette entre deux actifs.", true),
        C("La perte probable appauvrit l'entreprise : charge, `6817`, au débit. On ne réduit pas la créance elle-même, on la corrige : `491` Dépréciations des comptes clients, au crédit. Sur le hors-taxe, car la TVA sera récupérable : dix mille fois quarante pour cent, `4 000 €`.", true),
        C("L'année suivante, Dupont paie trois mille euros et le reste est perdu. La perte définitive est une charge : `654`, au débit, pour sept mille cinq cents hors taxes. La TVA reversée à tort est récupérée : `44571` au débit, mille cinq cents. La créance disparaît : `416` au crédit.", true),
        C("La dépréciation n'a plus d'objet : on la reprend. `491` au débit, `7817` Reprises au crédit, un produit qui annule la charge de l'an dernier."),
        C("Sur deux ans, le résultat supporte bien la perte réelle hors taxes : quatre mille, puis trois mille cinq cents."),
      ],
      flash: [
        Q("Pourquoi crédite-t-on le 491 plutôt que le 416 ?", ["La perte n'est que probable : on corrige l'actif sans l'éteindre", "Le 491 est une dette", "Par simplification"], 0, "Compte correcteur d'actif."),
        Q("La dépréciation se calcule sur :", ["Le HT", "Le TTC", "La TVA seule"], 0, "La TVA sera récupérée en cas de perte définitive."),
        Q("Le 7817 Reprises est :", ["Un produit", "Une charge", "Un passif"], 0, "Il annule la dotation devenue sans objet."),
      ],
      fiche: {
        essentiel: "Créance incertaine : reclassement en 416, dépréciation du HT par un compte correcteur ; perte définitive en 654 avec récupération de la TVA, puis reprise.",
        points: [
          "411 → 416 pour le TTC (actif → actif).",
          "6817 (charge) / 491 (correcteur d'actif), sur le HT.",
          "Perte : 654 (HT) + 44571 (TVA récupérée) / 416.",
          "Reprise : 491 / 7817.",
          "Impact cumulé = perte réelle HT.",
        ],
        methode: ["TTC, HT, TVA", "Dépréciation", "Année suivante : encaissement, perte, reprise"],
        pieges: ["Déprécier le TTC.", "Oublier la reprise."],
      },
    }),
    ecritures: [
      E("31/12/N · Reclassement en douteux", [
        d("416", "Clients douteux", 12000, "La créance reste un actif, mais on l'isole : elle est incertaine."),
        c("411", "Clients", 12000, "Elle quitte les créances ordinaires."),
      ]),
      E("31/12/N · Dépréciation", [
        d("6817", "Dotations aux dépréciations des actifs circulants", 4000, "Perte probable : charge de l'exercice."),
        c("491", "Dépréciations des comptes clients", 4000, "Correcteur d'actif : la créance vaut moins, sans être éteinte."),
      ], "10 000 HT × 40 %."),
      E("N+1 · Perte définitive après encaissement de 3 000 € TTC", [
        d("654", "Pertes sur créances irrécouvrables", 7500, "Perte réelle, hors taxes : charge."),
        d("44571", "TVA collectée", 1500, "La TVA reversée sur une vente non payée est récupérée : la dette envers l'État diminue."),
        c("416", "Clients douteux", 9000, "La créance restante disparaît : l'actif diminue."),
      ], "Art. 272 CGI."),
      E("N+1 · Reprise de la dépréciation", [
        d("491", "Dépréciations des comptes clients", 4000, "La correction n'a plus d'objet : on l'annule."),
        c("7817", "Reprises sur dépréciations des actifs circulants", 4000, "Produit qui neutralise la dotation de l'an dernier."),
      ]),
    ],
  },
  {
    ...K({
      id: "dcg-titres", ue: "dcg9",
      title: "Valeurs mobilières de placement : achat, dépréciation, cession", ref: "PCG, comptes 503, 590, 667, 767",
      scene: [
        N("Grenoble. La PME Alpimat place sa trésorerie : mille actions cotées à quarante-deux euros, plus trois cents euros de frais."),
        D("Au 31 décembre, l'action vaut trente-huit euros. Je n'ai rien vendu, je dois constater quelque chose ?"),
        X("Oui : une dépréciation. La moins-value latente se constate, la plus-value latente jamais."),
        N("À l'examen : classer les titres, les évaluer, traiter la cession, en justifiant chaque ligne."),
      ],
      cours: [
        C("L'opération : on transforme de la trésorerie en titres. Un actif en remplace un autre : `503` Actions au débit, `512` Banque au crédit. Les frais d'acquisition peuvent être passés en charges, au débit du `627`.", true),
        C("À la clôture, le cours moyen du dernier mois, trente-huit euros, est inférieur au coût. Par prudence, la perte latente est une charge financière, `6866`, au débit. Et on corrige l'actif par le `590`, au crédit : `4 000 €`.", true),
        C("En mars, on vend six cents titres à quarante-cinq euros. La banque augmente de vingt-sept mille, au débit. Les titres sortent à leur coût d'entrée, vingt-cinq mille deux cents, au crédit du `503`. L'écart, mille huit cents, est un gain : `767` au crédit, un produit financier.", true),
        C("La dépréciation des titres vendus, deux mille quatre cents, n'a plus d'objet : `590` au débit, `7866` au crédit."),
        C("Retiens : la plus-value se calcule toujours sur le coût d'entrée, jamais sur le cours du 31 décembre."),
      ],
      flash: [
        Q("À l'achat des titres, la banque est :", ["Créditée : l'actif trésorerie diminue", "Débitée", "Inchangée"], 0, "L'argent sort."),
        Q("Le 590 est :", ["Un compte correcteur d'actif, crédité", "Une dette", "Un produit"], 0, "Dépréciation des VMP."),
        Q("Le résultat de cession se calcule sur :", ["Le coût d'entrée", "Le cours du 31 décembre", "La valeur après dépréciation"], 0, "La dépréciation est reprise à part."),
      ],
      fiche: {
        essentiel: "Achat : un actif remplace un autre ; clôture : moins-value latente en charge avec un compte correcteur ; cession : gain sur le coût d'entrée, puis reprise.",
        points: [
          "503 au débit, 512 au crédit ; frais en 627 ou incorporés.",
          "Dépréciation : 6866 / 590.",
          "Cession : 512 au débit, 503 au crédit (coût), 767 ou 667 pour l'écart.",
          "Reprise sur titres cédés : 590 / 7866.",
          "Plus-values latentes jamais constatées.",
        ],
        methode: ["Classer le titre", "Coût d'entrée", "Clôture", "Cession et reprise"],
        pieges: ["Calculer la plus-value à partir du cours du 31 décembre."],
      },
    }),
    ecritures: [
      E("Mars N · Achat", [
        d("503", "Actions", 42000, "Nouveau placement : l'actif titres augmente."),
        d("627", "Services bancaires et assimilés", 300, "Frais d'achat, passés en charges sur option."),
        c("512", "Banque", 42300, "L'argent sort : la trésorerie diminue."),
      ]),
      E("31/12/N · Dépréciation", [
        d("6866", "Dotations aux dépréciations des éléments financiers", 4000, "Perte latente : charge financière, par prudence."),
        c("590", "Dépréciations des valeurs mobilières de placement", 4000, "Correcteur d'actif : les titres valent moins que leur coût."),
      ], "(42 − 38) × 1 000."),
      E("Mars N+1 · Cession de 600 titres à 45 €", [
        d("512", "Banque", 27000, "Le prix de vente entre en trésorerie."),
        c("503", "Actions", 25200, "Les titres sortent à leur coût d'entrée."),
        c("767", "Produits nets sur cessions de VMP", 1800, "Le gain est un produit financier."),
      ]),
      E("Mars N+1 · Reprise sur les titres cédés", [
        d("590", "Dépréciations des valeurs mobilières de placement", 2400, "La correction des titres vendus disparaît."),
        c("7866", "Reprises sur dépréciations des éléments financiers", 2400, "Produit qui annule la dotation correspondante."),
      ]),
    ],
  },
  {
    ...K({
      id: "dcg-depreciations", ue: "dcg9",
      title: "Dépréciations des immobilisations et des stocks", ref: "PCG, valeur actuelle · comptes 29, 39",
      scene: [
        N("Brest, clôture. La conserverie Kerlo s'interroge sur une ligne de production et sur un stock de boîtes."),
        D("La ligne vaut trente mille en net comptable. Je la revendrais vingt-deux mille, mais elle me rapportera encore vingt-quatre mille si je la garde."),
        X("On retient la plus élevée des deux : vingt-quatre mille. La ligne perd six mille euros de valeur."),
        N("À l'examen : calculer la valeur actuelle, la comparer, puis justifier l'écriture."),
      ],
      cours: [
        C("La valeur actuelle est la plus élevée de la valeur vénale, ce qu'on tirerait de la vente, et de la valeur d'usage, ce que le bien rapportera. Ici, vingt-quatre mille.", true),
        C("Si elle est inférieure à la valeur nette comptable, l'actif ne vaut plus ce qu'indique le bilan. La perte est une charge, `6816`, au débit, de `6 000 €`.", true),
        C("On ne touche pas au compte de l'immobilisation : on crédite un compte correcteur, `2915`. Comme l'amortissement, il diminue l'actif. Mais l'amortissement constate une usure prévue, la dépréciation une perte de valeur imprévue et réversible.", true),
        C("Les stocks se comparent à leur valeur nette de réalisation, prix de vente moins frais de vente. Stock à dix-huit mille, réalisable à quinze mille cinq cents : `6817` au débit, `397` au crédit, deux mille cinq cents."),
        C("Après une dépréciation d'immobilisation, le plan d'amortissement est recalculé sur la nouvelle base."),
      ],
      flash: [
        Q("Valeur vénale 22 000, valeur d'usage 24 000 : valeur actuelle ?", ["24 000", "22 000", "23 000"], 0, "On retient la plus élevée."),
        Q("Différence entre amortissement et dépréciation :", ["Usure prévue contre perte de valeur imprévue et réversible", "Aucune", "L'un est un actif, l'autre un passif"], 0, "Deux corrections d'actif de nature différente."),
        Q("Dépréciation d'une immobilisation corporelle :", ["6816 / 29", "6811 / 28", "6817 / 39"], 0, "6811/28 est l'amortissement ; 6817/39 les stocks."),
      ],
      fiche: {
        essentiel: "On déprécie quand la valeur actuelle passe sous la VNC : charge au débit, compte correcteur 29 ou 39 au crédit.",
        points: [
          "Valeur actuelle = max (valeur vénale ; valeur d'usage).",
          "Immobilisations : 6816 / 29 ; reprise 29 / 7816.",
          "Stocks : coût contre valeur nette de réalisation ; 6817 / 39.",
          "Amortissement = usure prévue ; dépréciation = perte imprévue, réversible.",
          "Plan d'amortissement révisé après dépréciation.",
        ],
        methode: ["VNC", "Valeur actuelle", "Écart et écriture justifiée"],
        pieges: ["Retenir la plus faible des deux valeurs.", "Créditer directement le compte d'immobilisation."],
      },
    }),
    ecritures: [
      E("31/12/N · Dépréciation de la ligne de production", [
        d("6816", "Dotations aux dépréciations des immobilisations", 6000, "Perte de valeur : charge de l'exercice."),
        c("2915", "Dépréciations des installations techniques", 6000, "Correcteur d'actif : la ligne vaut moins que sa VNC."),
      ], "VNC 30 000 − valeur actuelle 24 000."),
      E("31/12/N · Dépréciation du stock", [
        d("6817", "Dotations aux dépréciations des actifs circulants", 2500, "Perte probable sur la vente du stock : charge."),
        c("397", "Dépréciations des stocks de marchandises", 2500, "Correcteur d'actif sur le stock."),
      ], "18 000 − 15 500."),
    ],
    formules: [
      { nom: "Valeur actuelle", formule: "Valeur actuelle = max (valeur vénale ; valeur d'usage)", piege: "Retenir la plus faible des deux." },
    ],
  },
];
