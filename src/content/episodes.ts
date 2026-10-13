import type { Episode, Ue } from "./types";
import { LOT1 } from "./lot1";
import { LOT2 } from "./lot2";
import { LOT3 } from "./lot3";
import { LOT4 } from "./lot4";
import { AUDIO_DISPO } from "./audio";

export const UES: Ue[] = [
  { id: "ue1", short: "UE1", name: "Gestion juridique, fiscale et sociale", available: true },
  { id: "ue3", short: "UE3", name: "Contrôle de gestion et stratégie", available: true },
  { id: "ue2", short: "UE2", name: "Finance", available: true },
  { id: "ue4", short: "UE4", name: "Comptabilité et audit", available: true },
  { id: "ue5", short: "UE5", name: "Management des systèmes d'information", available: true },
];

// Contenu démo rédigé à partir du CGI. À FAIRE RELIRE avant toute vente.
export const EPISODES: Episode[] = [
  {
    id: "regime-mere-fille",
    ue: "ue1",
    format: "juridique",
    title: "Le régime mère-fille",
    ref: "art. 145 et 216 CGI",
    minutes: 8,
    status: "live",
    source: "Cas inventé, inspiré des situations types de l'épreuve",
    scene: [
      { who: "narrateur", text: "Lyon, un lundi matin. Bureau de Claire Morel, présidente de Batisud, une PME du bâtiment." },
      { who: "dirigeant", text: "Notre filiale Isoplus va nous verser 200 000 euros de dividendes. On m'a dit qu'on pouvait ne presque rien payer d'impôt dessus. C'est vrai ?" },
      { who: "expert", text: "C'est possible. Batisud détient quelle part du capital d'Isoplus ?" },
      { who: "dirigeant", text: "12 %, depuis trois ans. Les titres sont au nominatif." },
      { who: "expert", text: "Alors on regarde le régime mère-fille. Si les conditions sont réunies, ce dividende sera presque entièrement exonéré." },
      { who: "narrateur", text: "À l'examen, le sujet vous pose exactement cette question : qualifier, vérifier les conditions, chiffrer." },
    ],
    cours: [
      { who: "cours", text: "Le régime mère-fille est prévu aux articles `145` et `216` du Code général des impôts.", key: true },
      { who: "cours", text: "Son objectif : éviter qu'un même bénéfice soit imposé deux fois, une première fois chez la filiale, une seconde chez la mère quand il remonte sous forme de dividendes." },
      { who: "cours", text: "C'est un régime sur option. Il s'applique si quatre conditions sont réunies." },
      { who: "cours", text: "Un : la société mère est soumise à l'impôt sur les sociétés." },
      { who: "cours", text: "Deux : elle détient au moins `5 %` du capital de la filiale.", key: true },
      { who: "cours", text: "Trois : les titres sont nominatifs, ou déposés auprès d'un établissement désigné par l'administration." },
      { who: "cours", text: "Quatre : la mère conserve les titres au moins `deux ans`. Si elle les cède avant, l'avantage est remis en cause.", key: true },
      { who: "cours", text: "L'effet : le dividende est retiré du résultat fiscal, mais on réintègre une quote-part de frais et charges égale à `5 %` du dividende brut, crédits d'impôt compris.", key: true },
      { who: "cours", text: "Dans un groupe fiscalement intégré, cette quote-part est ramenée à 1 %, sous conditions." },
      { who: "cours", text: "Pour Batisud : on déduit 200 000 euros, on réintègre 10 000 euros. Seuls 10 000 euros sont donc soumis à l'impôt sur les sociétés." },
      { who: "cours", text: "Méthode d'examen : la règle avec l'article, l'application aux faits du cas, puis une conclusion chiffrée. Toujours dans cet ordre." },
    ],
    flash: [
      { q: "Quel pourcentage minimal du capital la mère doit-elle détenir ?", choices: ["2 %", "5 %", "10 %"], answer: 1, why: "Au moins 5 % du capital de la filiale (art. 145 CGI)." },
      { q: "Combien de temps les titres doivent-ils être conservés ?", choices: ["1 an", "2 ans", "5 ans"], answer: 1, why: "Deux ans au minimum, sinon l'exonération est remise en cause." },
      { q: "Hors groupe intégré, quelle quote-part de frais et charges réintègre-t-on ?", choices: ["1 %", "5 %", "12 %"], answer: 1, why: "5 % du produit brut des participations, crédits d'impôt compris (art. 216 CGI)." },
    ],
  },
  {
    id: "integration-fiscale",
    ue: "ue1",
    format: "juridique",
    title: "L'intégration fiscale",
    ref: "art. 223 A et s. CGI",
    minutes: 9,
    status: "live",
    source: "Cas inventé, inspiré des situations types de l'épreuve",
    scene: [
      { who: "narrateur", text: "Lille. Réunion de clôture chez Verdal, holding d'un petit groupe logistique." },
      { who: "dirigeant", text: "Logifret, détenue à 97 %, fait 300 000 euros de bénéfice. Atelier Nord, détenue à 100 %, perd 120 000 euros. Et on va payer l'impôt plein pot sur Logifret ?" },
      { who: "expert", text: "Pas forcément. Avec l'intégration fiscale, la perte d'Atelier Nord peut venir réduire le bénéfice de Logifret." },
      { who: "dirigeant", text: "Toutes les sociétés clôturent au 31 décembre. Ça compte ?" },
      { who: "expert", text: "Oui, c'est même une des conditions. Voyons-les ensemble." },
      { who: "narrateur", text: "Groupe, seuil de détention, compensation des résultats : un grand classique de l'UE1." },
    ],
    cours: [
      { who: "cours", text: "L'intégration fiscale est prévue aux articles `223 A` et suivants du Code général des impôts.", key: true },
      { who: "cours", text: "La société mère se constitue seule redevable de l'impôt sur les sociétés dû par l'ensemble du groupe." },
      { who: "cours", text: "Condition clé : la mère détient au moins `95 %` du capital de chaque filiale, directement ou indirectement par des sociétés du groupe.", key: true },
      { who: "cours", text: "Toutes les sociétés du périmètre sont soumises à l'impôt sur les sociétés, avec des exercices de même durée et à la même date de clôture." },
      { who: "cours", text: "La mère ne doit pas être elle-même détenue à 95 % ou plus par une autre société soumise à l'impôt sur les sociétés en France." },
      { who: "cours", text: "L'option vaut pour `cinq exercices`, renouvelable.", key: true },
      { who: "cours", text: "Chaque société calcule son résultat comme si elle était imposée seule. La mère additionne ensuite tous les résultats : c'est le résultat d'ensemble." },
      { who: "cours", text: "Certaines opérations entre sociétés du groupe sont neutralisées, pour éviter les doubles impositions." },
      { who: "cours", text: "Attention : les déficits d'une filiale antérieurs à son entrée dans le groupe ne s'imputent que sur ses propres bénéfices.", key: true },
      { who: "cours", text: "Pour Verdal, en supposant un résultat nul pour la holding : 300 000 moins 120 000, soit un résultat d'ensemble de 180 000 euros, avant retraitements." },
      { who: "cours", text: "Sans intégration, Logifret serait imposée sur 300 000 euros, et la perte d'Atelier Nord resterait bloquée chez elle." },
    ],
    flash: [
      { q: "Quel seuil de détention ouvre l'intégration fiscale ?", choices: ["50 %", "75 %", "95 %"], answer: 2, why: "Au moins 95 % du capital, directement ou indirectement." },
      { q: "Pour combien d'exercices l'option est-elle prise ?", choices: ["3", "5", "10"], answer: 1, why: "Cinq exercices, renouvelable." },
      { q: "Un déficit d'une filiale antérieur à son entrée dans le groupe s'impute…", choices: ["Sur le résultat d'ensemble", "Sur ses propres bénéfices", "Nulle part"], answer: 1, why: "Uniquement sur les bénéfices propres de la filiale." },
    ],
  },
  soon("pactes-associes", "ue1", "Pactes d'associés", "art. 1103 C. civ."),
  {
    id: "cmpc",
    ue: "ue2",
    format: "technique",
    title: "Le coût moyen pondéré du capital",
    ref: "CMPC · MEDAF",
    minutes: 9,
    status: "live",
    source: "Cas inventé, inspiré des situations types de l'épreuve",
    scene: [
      { who: "narrateur", text: "Nantes. Salle de réunion de Navalis, un équipementier pour chantiers navals." },
      { who: "dirigeant", text: "On hésite à racheter un concurrent. Mon banquier me dit de comparer la rentabilité du projet à notre coût du capital. C'est quoi, concrètement ?" },
      { who: "expert", text: "C'est le rendement minimum que vos financeurs attendent, actionnaires et banques réunis. Si le projet rapporte moins, il détruit de la valeur." },
      { who: "dirigeant", text: "Nos capitaux propres valent 6 millions sur le marché, notre dette 4 millions à 5 %. On est imposés à 25 %." },
      { who: "expert", text: "Il me manque le risque de l'action. Votre bêta est de 1,2, le taux sans risque de 3 %, la prime de marché de 6 %. On a tout." },
      { who: "narrateur", text: "À l'examen : calculer le coût des capitaux propres, puis le CMPC, puis conclure sur le projet." },
    ],
    cours: [
      { who: "cours", text: "Le CMPC est le taux d'actualisation des flux de trésorerie disponibles de l'entreprise. C'est le taux qui sert à juger un investissement.", key: true },
      { who: "cours", text: "Il pondère deux coûts : le coût des capitaux propres, et le coût de la dette après impôt." },
      { who: "cours", text: "Étape un : le coût des capitaux propres, avec le MEDAF. Taux sans risque, plus bêta multiplié par la prime de risque du marché." },
      { who: "cours", text: "Pour Navalis : `3 %` plus `1,2` fois `6 %`, soit `10,2 %`.", key: true },
      { who: "cours", text: "Étape deux : le coût de la dette après impôt. Les intérêts sont déductibles, donc on multiplie le taux par un moins le taux d'impôt." },
      { who: "cours", text: "Pour Navalis : `5 %` fois `0,75`, soit `3,75 %`.", key: true },
      { who: "cours", text: "Étape trois : les poids, en valeurs de marché. Capitaux propres 6 sur 10, soit 60 %. Dette 4 sur 10, soit 40 %." },
      { who: "cours", text: "CMPC : `10,2 %` fois `0,6`, plus `3,75 %` fois `0,4`. Soit `6,12 %` plus `1,5 %`, donc `7,62 %`.", key: true },
      { who: "cours", text: "Conclusion type : le rachat crée de la valeur si sa rentabilité attendue dépasse 7,62 %, ou si sa VAN calculée à ce taux est positive." },
      { who: "cours", text: "Les correcteurs sanctionnent deux erreurs : oublier l'économie d'impôt sur la dette, et pondérer avec les valeurs comptables au lieu des valeurs de marché." },
    ],
    formules: [
      {
        nom: "Coût des capitaux propres (MEDAF)",
        formule: "kcp = rf + β × [E(Rm) − rf]",
        legende: ["rf : taux sans risque", "β : sensibilité de l'action au marché", "E(Rm) − rf : prime de risque du marché"],
      },
      {
        nom: "Coût de la dette après impôt",
        formule: "kd net = kd × (1 − t)",
        legende: ["kd : taux d'intérêt de la dette", "t : taux d'impôt sur les sociétés"],
        piege: "Oublier le (1 − t) : les intérêts sont déductibles.",
      },
      {
        nom: "Coût moyen pondéré du capital",
        formule: "CMPC = kcp × CP / (CP + D) + kd × (1 − t) × D / (CP + D)",
        legende: ["CP : valeur de marché des capitaux propres", "D : valeur de marché de la dette nette"],
        piege: "Pondérer avec les valeurs comptables au lieu des valeurs de marché.",
      },
    ],
    flash: [
      { q: "β = 1,2, rf = 3 %, prime de marché 6 %. Coût des capitaux propres ?", choices: ["7,2 %", "9 %", "10,2 %"], answer: 2, why: "3 % + 1,2 × 6 % = 10,2 %." },
      { q: "Dette à 5 %, IS à 25 %. Coût de la dette après impôt ?", choices: ["3,75 %", "5 %", "6,25 %"], answer: 0, why: "5 % × (1 − 0,25) = 3,75 %." },
      { q: "Pour pondérer le CMPC, on retient…", choices: ["Les valeurs comptables", "Les valeurs de marché", "La moyenne des deux"], answer: 1, why: "Les valeurs de marché, qui reflètent les attentes actuelles des financeurs." },
    ],
  },
  {
    id: "provision-litige",
    ue: "ue4",
    format: "comptable",
    title: "La provision pour litige",
    ref: "PCG art. 321-1 et s.",
    minutes: 9,
    status: "live",
    source: "Cas inventé, inspiré des situations types de l'épreuve",
    scene: [
      { who: "narrateur", text: "Rennes, mi-janvier. Clôture des comptes de Granitec, une PME de travaux publics." },
      { who: "dirigeant", text: "Un ancien salarié nous attaque aux prud'hommes. Notre avocat pense qu'on va perdre, autour de 40 000 euros. Le jugement tombera en N+1. Je fais quoi dans les comptes de N ?" },
      { who: "expert", text: "Le procès a commencé quand ?" },
      { who: "dirigeant", text: "La saisine date d'octobre N." },
      { who: "expert", text: "Alors l'obligation existe à la clôture. On regarde si les conditions d'une provision sont réunies, et on la chiffre." },
      { who: "narrateur", text: "À l'examen : justifier la provision par le PCG, l'évaluer, passer les écritures de N et de N+1." },
    ],
    cours: [
      { who: "cours", text: "Une provision est un passif dont l'échéance ou le montant n'est pas fixé de façon précise. Articles `321-1` et suivants du PCG.", key: true },
      { who: "cours", text: "Un passif, c'est une obligation à l'égard d'un tiers, qui provoquera probablement ou certainement une sortie de ressources sans contrepartie au moins équivalente." },
      { who: "cours", text: "Trois conditions, à vérifier une par une sur la copie." },
      { who: "cours", text: "Un : une obligation envers un tiers existe à la clôture, du fait d'un événement passé. Ici, l'action intentée par le salarié en octobre N.", key: true },
      { who: "cours", text: "Deux : la sortie de ressources est probable. L'avocat estime la condamnation probable." },
      { who: "cours", text: "Trois : le montant peut être estimé de façon fiable. L'avocat l'évalue à 40 000 euros." },
      { who: "cours", text: "Évaluation : la meilleure estimation de la sortie de ressources nécessaire pour éteindre l'obligation, selon les règles d'évaluation des passifs du PCG.", key: true },
      { who: "cours", text: "Comptabilisation en N : on débite le compte `6815`, dotations aux provisions d'exploitation, et on crédite le compte `1511`, provisions pour litiges." },
      { who: "cours", text: "En N+1, la provision est reprise quand le risque disparaît. Granitec est condamnée à 35 000 euros : on paie la charge réelle, et on reprend la totalité de la provision." },
      { who: "cours", text: "Point de vigilance : si le risque n'est que possible, et pas probable, aucune provision. On mentionne seulement un passif éventuel dans l'annexe.", key: true },
    ],
    ecritures: [
      {
        titre: "31/12/N · Constitution de la provision",
        regle: "Obligation à la clôture, sortie de ressources probable, montant estimable (PCG, passifs).",
        lignes: [
          { compte: "6815", intitule: "Dotations aux provisions d'exploitation", debit: 40000 },
          { compte: "1511", intitule: "Provisions pour litiges", credit: 40000 },
        ],
      },
      {
        titre: "N+1 · Jugement : condamnation à 35 000 €",
        regle: "La charge réelle est enregistrée par nature au moment où elle est due. Compte à valider par le relecteur selon la nature de l'indemnité.",
        lignes: [
          { compte: "6788", intitule: "Charges exceptionnelles diverses", debit: 35000 },
          { compte: "4xx", intitule: "Tiers (salarié)", credit: 35000 },
        ],
      },
      {
        titre: "31/12/N+1 · Reprise de la provision devenue sans objet",
        regle: "Le risque a disparu : la provision est reprise en totalité.",
        lignes: [
          { compte: "1511", intitule: "Provisions pour litiges", debit: 40000 },
          { compte: "7815", intitule: "Reprises sur provisions d'exploitation", credit: 40000 },
        ],
      },
    ],
    flash: [
      { q: "Le risque de condamnation est seulement possible. Que fait-on ?", choices: ["Une provision", "Une mention en annexe", "Rien du tout"], answer: 1, why: "Sans sortie de ressources probable, pas de provision : on informe en annexe (passif éventuel)." },
      { q: "Quel compte crédite-t-on pour constater la provision ?", choices: ["6815", "1511", "7815"], answer: 1, why: "1511 Provisions pour litiges, en contrepartie de 6815." },
      { q: "Comment évalue-t-on la provision ?", choices: ["Au montant maximal réclamé", "À la meilleure estimation de la sortie de ressources", "Au montant minimal"], answer: 1, why: "Meilleure estimation de la sortie de ressources nécessaire pour éteindre l'obligation." },
    ],
  },
  ...LOT1,
  ...LOT2,
  ...LOT3,
  ...LOT4,
  soon("ue4-scission-apa", "ue4", "Scission et apport partiel d'actif", "Règlement ANC 2014-03"),
  soon("ue1-sauvegarde-plan", "ue1", "Le plan de sauvegarde et de cession", "C. com."),
  soon("ue1-contrats-speciaux", "ue1", "Contrats de distribution et franchise", "C. com."),
  soon("ue3-pilotage", "ue3", "Pilotage de la performance", "UE3 · tes cours + sujet zéro"),
  soon("ue3-rse", "ue3", "Contrôle de gestion et RSE", "UE3 · tes cours + sujet zéro"),
];

function soon(id: string, ue: Episode["ue"], title: string, ref: string): Episode {
  const format = ue === "ue1" ? "juridique" : ue === "ue4" ? "comptable" : "technique";
  return { id, ue, format, title, ref, minutes: 0, status: "soon", scene: [], cours: [], flash: [] };
}

// Voix studio : branche automatiquement les MP3 déclarés dans audio.ts
// Règle produit : un épisode n'est jouable qu'avec la voix studio. Sinon il reste « bientôt disponible ».
for (const e of EPISODES) {
  if (AUDIO_DISPO.includes(e.id)) e.audio = { scene: `/audio/${e.id}-scene.mp3`, cours: `/audio/${e.id}-cours.mp3` };
  else if (e.status === "live") e.status = "ecrit";
}

export const episodesOf = (ue: string) => EPISODES.filter((e) => e.ue === ue);
export const findEpisode = (id: string) => EPISODES.find((e) => e.id === id);
