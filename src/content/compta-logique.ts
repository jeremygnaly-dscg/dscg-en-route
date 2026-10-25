// Compta approfondie (DCG UE10) et DSCG UE4 : avant chaque écriture, la règle de droit comptable
// qui l'autorise ; puis, ligne par ligne, pourquoi ce compte et pourquoi ce sens.
// Clé : id de l'épisode ; une entrée par écriture, dans l'ordre ; « pourquoi » dans l'ordre des lignes.
// Ajout texte uniquement : n'affecte pas les voix déjà enregistrées. À FAIRE RELIRE.

export const LOGIQUE: Record<string, { droit: string; pourquoi: string[] }[]> = {
  "provision-litige": [
    { droit: "PCG, art. 321-1 et s. : on comptabilise une provision si, à la clôture, il existe une obligation envers un tiers, qu'elle provoquera probablement une sortie de ressources sans contrepartie, et que son montant peut être estimé de façon fiable. Sinon, c'est un passif éventuel, mentionné en annexe.",
      pourquoi: ["La charge probable est rattachée à l'exercice où naît l'obligation.", "Passif : l'obligation existe à la clôture, seul son montant est incertain."] },
    { droit: "Au jugement, la dette devient certaine et chiffrée : on enregistre la charge réelle par nature.",
      pourquoi: ["La condamnation est une charge de l'exercice où elle est prononcée.", "Nous devons l'indemnité : dette certaine envers le salarié."] },
    { droit: "Une provision est reprise lorsqu'elle devient sans objet.",
      pourquoi: ["Le passif provisionné disparaît : il diminue, au débit.", "Produit qui neutralise la dotation de l'an dernier."] },
  ],
  "ecart-acquisition": [
    { droit: "Règl. ANC 2020-01 : à l'acquisition, les actifs et passifs identifiables de la filiale sont évalués à leur valeur d'entrée ; l'excédent du coût des titres sur la quote-part acquise de cet actif net est l'écart d'acquisition.",
      pourquoi: ["Les capitaux propres de la filiale ne sont pas ceux du groupe : on les élimine.", "Actif : ce que le groupe a payé en plus de l'actif net, pour des avantages futurs (clientèle, synergies).", "Les titres de la mère sont remplacés par les actifs et passifs de la filiale : ils disparaissent.", "Part des capitaux propres revenant aux autres actionnaires de la filiale."] },
  ],
  "fusion-parite-prime": [
    { droit: "PCG, titre VII (règl. ANC 2017-01) : en cas de contrôle distinct, les apports sont évalués à leur valeur réelle. L'absorbante augmente son capital du nominal des titres émis ; l'excédent est une prime de fusion.",
      pourquoi: ["La dette d'apport envers la société absorbée est réglée par la remise de titres : elle s'éteint.", "Nouveau capital : nombre de titres émis × nominal ; les capitaux propres augmentent.", "Excédent de la valeur des apports sur le nominal : capitaux propres."] },
  ],
  "impots-differes": [
    { droit: "Règl. ANC 2020-01 : les écritures passées pour la seule application de la législation fiscale sont éliminées en consolidation, et un impôt différé est constaté sur les différences temporaires.",
      pourquoi: ["Le dérogatoire est purement fiscal : on l'élimine du passif.", "Sans lui, les capitaux propres du groupe sont plus élevés, nets d'impôt.", "Impôt latent : le dérogatoire sera repris et imposé plus tard, c'est une dette future envers le fisc."] },
  ],
  "mali-technique": [
    { droit: "PCG, art. 745-1 et s. : à valeur comptable, l'écart entre l'actif net reçu et les titres annulés est un mali. La part qui correspond aux plus-values latentes des actifs apportés est un mali technique, affecté à ces actifs ; le reste est une charge financière.",
      pourquoi: ["On reprend l'actif net comptable de l'absorbée.", "Plus-value latente du terrain : le mali technique est inscrit à l'actif, en sous-compte du bien.", "Partie du mali sans justification par des plus-values : charge financière.", "Les titres de l'absorbée détenus par l'absorbante sont annulés : l'actif disparaît."] },
  ],
  "ifrs-16": [
    { droit: "IFRS 16 : à la date de début, le preneur comptabilise un droit d'utilisation et une dette locative égale à la valeur actuelle des loyers restant à payer.",
      pourquoi: ["Actif : le preneur contrôle l'usage de l'entrepôt pendant le contrat.", "Passif : obligation de payer les loyers."] },
    { droit: "La dette locative est évaluée au coût amorti, avec les intérêts au taux du contrat ; le droit d'utilisation est amorti sur la durée du contrat.",
      pourquoi: ["Coût du financement de la période.", "Part du loyer qui rembourse la dette : le passif diminue.", "Le loyer est payé : la trésorerie diminue.", "Consommation du droit d'utilisation : charge.", "Correcteur d'actif : le droit d'utilisation s'use."] },
  ],
  "eliminations-intragroupe": [
    { droit: "Règl. ANC 2020-01 : les marges réalisées entre sociétés du groupe et encore en stock sont éliminées ; un impôt différé est constaté.",
      pourquoi: ["La marge n'est pas réalisée avec l'extérieur : le résultat du groupe baisse.", "Le stock revient à son coût pour le groupe.", "L'impôt payé sur une marge éliminée sera récupéré plus tard : créance d'impôt future.", "La charge d'impôt du groupe diminue d'autant."] },
  ],
  "ifrs15-revenus": [
    { droit: "IFRS 15 : le revenu est reconnu quand, ou à mesure que, chaque obligation de prestation est remplie ; le prix est réparti selon les prix de vente séparés.",
      pourquoi: ["Le client a tout payé : la trésorerie augmente.", "La licence est livrée : obligation remplie, revenu reconnu.", "Encaissé pour une maintenance pas encore rendue : obligation envers le client, au passif."] },
    { droit: "Le revenu de maintenance est reconnu au fil du service rendu.",
      pourquoi: ["L'obligation envers le client diminue à mesure que le service est rendu.", "Revenu de la période."] },
  ],
  "mise-en-equivalence": [
    { droit: "Règl. ANC 2020-01 : en cas d'influence notable, les titres sont remplacés par la quote-part des capitaux propres de la société, résultat compris, majorée de l'écart d'acquisition.",
      pourquoi: ["Nouvelle valeur des titres : quote-part des capitaux propres et écart d'acquisition.", "Les titres à leur coût historique disparaissent.", "Part du groupe dans le résultat de l'entreprise associée."] },
  ],
  "ias16-ias36": [
    { droit: "IAS 36 : un actif est déprécié quand sa valeur comptable dépasse sa valeur recouvrable, la plus élevée de la juste valeur diminuée des coûts de sortie et de la valeur d'utilité.",
      pourquoi: ["La perte de valeur est une charge de l'exercice.", "Correcteur d'actif : la ligne vaut moins que sa valeur comptable."] },
  ],
  "retraitements-obligatoires": [
    { droit: "Règl. ANC 2020-01 : élimination des écritures purement fiscales, avec constatation d'impôts différés.",
      pourquoi: ["Le dérogatoire est purement fiscal : on l'élimine du passif.", "Impôt latent sur la reprise future du dérogatoire.", "Dotations des exercices passés annulées, nettes d'impôt : elles reviennent aux réserves.", "Dotation de l'exercice annulée, nette d'impôt : le résultat augmente."] },
  ],
  "cessions-internes-dividendes": [
    { droit: "Règl. ANC 2020-01 : les dividendes reçus d'une société consolidée sont éliminés du résultat : ce bénéfice a déjà été compté dans le résultat de la filiale.",
      pourquoi: ["Produit interne au groupe : il sort du résultat.", "Il reste dans les capitaux propres du groupe, en réserves."] },
    { droit: "Les plus-values de cession interne sont éliminées : l'actif revient à son coût pour le groupe, avec un impôt différé.",
      pourquoi: ["La plus-value interne n'est pas réalisée avec l'extérieur.", "L'impôt payé sur cette plus-value sera récupéré : créance future.", "Le terrain revient à son coût d'origine pour le groupe.", "La charge d'impôt du groupe diminue d'autant."] },
  ],
  "partage-capitaux-propres": [
    { droit: "Règl. ANC 2020-01, intégration globale : les titres de la filiale sont éliminés contre la quote-part de capitaux propres qu'ils représentent ; le reste revient aux intérêts minoritaires.",
      pourquoi: ["Les capitaux propres de la filiale sont éliminés pour être répartis.", "Idem pour ses réserves.", "Idem pour son résultat.", "Les titres détenus par la mère disparaissent.", "Part du groupe dans les réserves accumulées depuis l'acquisition.", "Part du groupe dans le résultat de l'exercice.", "Part des autres actionnaires de la filiale."] },
  ],
  "scission-apa": [
    { droit: "PCG, titre VII : dans un apport partiel d'actif, l'apporteur reçoit des titres en rémunération de la branche apportée ; sous contrôle commun, les apports sont évalués à leur valeur comptable.",
      pourquoi: ["Titres reçus en échange de la branche : nouvel actif financier.", "Les dettes transférées avec la branche sortent du passif.", "Les actifs apportés sortent du bilan."] },
  ],
  "contrats-long-terme-conso": [
    { droit: "En consolidation (règl. ANC 2020-01), les contrats à long terme sont comptabilisés à l'avancement : on retraite ceux tenus à l'achèvement dans les comptes individuels.",
      pourquoi: ["Créance pour la part du contrat déjà réalisée.", "On annule le produit qui valorisait l'en-cours : un produit annulé se débite.", "Revenu reconnu selon l'avancement.", "L'en-cours disparaît de l'actif."] },
    { droit: "Le retraitement crée une différence temporaire entre la base comptable et la base fiscale : impôt différé.",
      pourquoi: ["Charge d'impôt correspondant à la marge reconnue plus tôt.", "Impôt qui sera payé plus tard : dette future."] },
  ],
  "ifrs9-cout-amorti": [
    { droit: "IFRS 9 : une dette financière est d'abord évaluée à sa juste valeur, nette des coûts de transaction, puis au coût amorti selon le taux d'intérêt effectif.",
      pourquoi: ["Les fonds reçus, nets des frais, entrent en trésorerie.", "Dette inscrite pour son montant net, au coût amorti."] },
    { droit: "Charge d'intérêts = coût amorti × taux effectif ; la différence avec le coupon payé augmente la dette.",
      pourquoi: ["Intérêts au taux effectif : le vrai coût du financement.", "Le coupon est payé : la trésorerie diminue.", "La part des intérêts non payée s'ajoute à la dette."] },
  ],
  "fusion-valeur-apports": [
    { droit: "PCG, art. 743-1 et s. : sous contrôle commun, les apports sont évalués à la valeur comptable ; sous contrôle distinct, à la valeur réelle (sauf fusion à l'envers). L'excédent sur le nominal est une prime de fusion.",
      pourquoi: ["La dette d'apport est réglée par la remise de titres : elle s'éteint.", "Nouveau capital : nombre de titres émis × nominal.", "Excédent de la valeur des apports sur le nominal : capitaux propres."] },
  ],
  "dcg-affectation-resultat": [
    { droit: "C. com., art. L. 232-10 : 5 % du bénéfice, diminué des pertes antérieures, va en réserve légale jusqu'à 10 % du capital. Art. L. 232-11 : bénéfice distribuable = bénéfice + report bénéficiaire − pertes antérieures − réserves obligatoires.",
      pourquoi: ["Le résultat est soldé : il est réparti par l'assemblée.", "Le report antérieur est aussi mis à disposition.", "Réserve légale : capitaux propres qui augmentent.", "Réserves libres : capitaux propres.", "Dividendes votés : dette envers les associés.", "Le reliquat reste en report à nouveau."] },
  ],
  "dcg-provisions-avancees": [
    { droit: "PCG, art. 321-1 et s. : une provision pour restructuration n'est constituée que si la restructuration est décidée et annoncée aux personnes concernées avant la clôture. Seules les dépenses directement liées sont retenues, pas les coûts futurs comme la formation des salariés maintenus.",
      pourquoi: ["Charge de l'exercice, classée en exploitation depuis le règl. ANC 2022-06.", "Passif : obligation envers les salariés concernés."] },
  ],
  "dcg-devises-hors-bilan": [
    { droit: "PCG, art. 420-5 : à la clôture, créances et dettes en devises sont converties au cours de clôture ; l'écart va en différences de conversion, sans toucher au résultat.",
      pourquoi: ["Perte latente de change : compte d'attente à l'actif.", "La créance vaut moins en euros au cours de clôture."] },
    { droit: "Prudence : une perte latente de change donne lieu à une provision.",
      pourquoi: ["Charge financière probable.", "Passif : provision pour la perte probable."] },
  ],
  "dcg-associations": [
    { droit: "Règl. ANC 2018-06 : les ressources affectées par les donateurs et non utilisées à la clôture sont inscrites en fonds dédiés.",
      pourquoi: ["On retire du résultat la part des dons pas encore utilisée.", "Passif : engagement d'utiliser ces fonds selon la volonté des donateurs."] },
  ],
};
