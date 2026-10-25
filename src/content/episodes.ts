import type { Episode, Ue } from "./types";
import { LOT1 } from "./lot1";
import { LOT2 } from "./lot2";
import { LOT3 } from "./lot3";
import { LOT4 } from "./lot4";
import { LOT5 } from "./lot5";
import { LOT6 } from "./lot6";
import { LOT_DCG1 } from "./lot-dcg1";
import { LOT_DCG9 } from "./lot-dcg9";
import { LOT_DCG9_B } from "./lot-dcg9-b";
import { LOGIQUE } from "./compta-logique";
import { LOT_DCG_AFFAIRES } from "./lot-dcg-affaires";
import { LOT_DCG_SOCIAL } from "./lot-dcg-social";
import { LOT_DCG_FISCAL } from "./lot-dcg-fiscal";
import { LOT_AUTEURS_MANAGEMENT } from "./lot-auteurs-management";
import { LOT_AUTEURS_ECONOMIE } from "./lot-auteurs-economie";
import { LOT_2027 } from "./lot-2027";
import { LOT_DSCG_UE1_A } from "./lot-dscg-ue1-a";
import { LOT_DSCG_UE4_A } from "./lot-dscg-ue4-a";
import { LOT_DSCG_UE4_B } from "./lot-dscg-ue4-b";
import { LOT_DSCG_UE1_B } from "./lot-dscg-ue1-b";
import { LOT_DSCG_UE1_C } from "./lot-dscg-ue1-c";
import { LOT_2027_DCG_A } from "./lot-2027-dcg-a";
import { LOT_2027_DCG_B } from "./lot-2027-dcg-b";
import { AUDIO_DISPO, AUDIO_DUREE } from "./audio";
import { FICHES } from "./fiches";
import { PROGRAMME } from "./programme";

export const UES: Ue[] = [
  { id: "ue1", diplome: "dscg", short: "UE1", name: "Gestion juridique, fiscale et sociale", available: true },
  { id: "ue2", diplome: "dscg", short: "UE2", name: "Finance", available: true },
  { id: "ue3", diplome: "dscg", short: "UE3", name: "Contrôle de gestion et stratégie", available: true },
  { id: "ue4", diplome: "dscg", short: "UE4", name: "Comptabilité et audit", available: true },
  { id: "ue5", diplome: "dscg", short: "UE5", name: "Management des systèmes d'information", available: true },
  { id: "dcg1", diplome: "dcg", short: "UE1", name: "Fondamentaux du droit", available: true },
  { id: "dcg2", diplome: "dcg", short: "UE2", name: "Droit des affaires", available: true },
  { id: "dcg3", diplome: "dcg", short: "UE3", name: "Droit social", available: true },
  { id: "dcg4", diplome: "dcg", short: "UE4", name: "Droit fiscal", available: true },
  { id: "dcg5", diplome: "dcg", short: "UE5", name: "Économie contemporaine", available: true },
  { id: "dcg6", diplome: "dcg", short: "UE6", name: "Finance d'entreprise", available: true },
  { id: "dcg7", diplome: "dcg", short: "UE7", name: "Management des organisations", available: true },
  { id: "dcg8", diplome: "dcg", short: "UE8", name: "Systèmes d'information de gestion", available: true },
  { id: "dcg9", diplome: "dcg", short: "UE9", name: "Introduction à la comptabilité", available: true },
  { id: "dcg10", diplome: "dcg", short: "UE10", name: "Comptabilité approfondie", available: true },
  { id: "dcg11", diplome: "dcg", short: "UE11", name: "Contrôle de gestion", available: true },
  { id: "dcg12", diplome: "dcg", short: "UE12", name: "Anglais des affaires", available: true },
  { id: "dcg13", diplome: "dcg", short: "UE13", name: "Communication professionnelle", available: true },
];

export const DIPLOMES = [
  { id: "dscg" as const, nom: "DSCG" },
  { id: "dcg" as const, nom: "DCG" },
];
export const uesDe = (d: string) => UES.filter((u) => u.diplome === d);
export const diplomeDe = (ue: string) => UES.find((u) => u.id === ue)?.diplome ?? "dscg";
// Libellé lisible : « DSCG UE1 », « DCG UE4 »
export const libelleUe = (ue: string) => {
  const u = UES.find((x) => x.id === ue);
  return u ? `${u.diplome.toUpperCase()} ${u.short}` : ue.toUpperCase();
};

// Épisodes DSCG qui couvrent aussi une notion du DCG : ils apparaissent dans les deux listes
const AUSSI: Record<string, Episode["ue"][]> = {
  "calcul-is": ["dcg4"], "regime-mere-fille": ["dcg4"], "tva-territorialite": ["dcg4"], "tva-intracom-biens": ["dcg4"],
  "controle-fiscal": ["dcg4"], "procedure-rectification": ["dcg4"],
  "cautionnement": ["dcg1"], "concurrence-deloyale": ["dcg1"],
  "abus-biens-sociaux": ["dcg2"], "augmentation-capital-dps": ["dcg2"],
  "cession-titres-agrement": ["dcg2"], "sa-conseil-administration": ["dcg2"], "pactes-associes": ["dcg2"],
  "transfert-contrats-travail": ["dcg3"],
  "van-tri": ["dcg6"], "roe-roce-structure": ["dcg6"], "tableau-flux": ["dcg6"], "cout-financements": ["dcg6"], "cmpc": ["dcg6"],
  "conduite-changement": ["dcg7"],
  "bases-de-donnees": ["dcg8"], "processus-urbanisation": ["dcg8"], "projet-erp": ["dcg8"], "securite-si-rgpd": ["dcg8"],
  "bi-donnees": ["dcg8"], "gestion-projet-agile": ["dcg8"],
  "provision-litige": ["dcg9"], "dcg-budget-tresorerie": ["ue3"], "dcg-ecarts": ["ue3"], "cac-nomination-mission": ["dcg10"], "fusion-parite-prime": ["dcg10"],
};

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
  ...LOT5,
  ...LOT6,
  ...LOT_DCG1,
  ...LOT_DCG9,
  ...LOT_DCG9_B,
  ...LOT_2027,
  ...LOT_2027_DCG_A,
  ...LOT_2027_DCG_B,
  ...LOT_DCG_AFFAIRES,
  ...LOT_DCG_SOCIAL,
  ...LOT_DCG_FISCAL,
  ...LOT_AUTEURS_MANAGEMENT,
  ...LOT_AUTEURS_ECONOMIE,
  ...LOT_DSCG_UE1_A,
  ...LOT_DSCG_UE4_A,
  ...LOT_DSCG_UE4_B,
  ...LOT_DSCG_UE1_B,
  ...LOT_DSCG_UE1_C,
];

function soon(id: string, ue: Episode["ue"], title: string, ref: string): Episode {
  const format = ["ue1", "dcg1", "dcg2", "dcg3", "dcg4"].includes(ue) ? "juridique"
    : ["ue4", "dcg9", "dcg10"].includes(ue) ? "comptable" : "technique";
  return { id, ue, format, title, ref, minutes: 0, status: "soon", scene: [], cours: [], flash: [] };
}

// Programme « zéro impasse » : chaque notion pas encore traitée apparaît comme épisode à venir
for (const [ue, notions] of Object.entries(PROGRAMME)) {
  for (const no of notions ?? []) {
    const couvert = no.episodes?.some((id) => EPISODES.some((e) => e.id === id)) || EPISODES.some((e) => e.id === no.id || e.notion === no.id);
    if (!couvert) EPISODES.push(soon(no.id, ue as Episode["ue"], no.titre, no.partie));
  }
}

// Voix studio : branche automatiquement les MP3 déclarés dans audio.ts
// Règle produit : un épisode n'est jouable qu'avec la voix studio. Sinon il reste « bientôt disponible ».
for (const e of EPISODES) {
  if (!e.fiche && FICHES[e.id]) e.fiche = FICHES[e.id];
  // Compta approfondie : règle de droit comptable avant l'écriture, et pourquoi de chaque ligne
  LOGIQUE[e.id]?.forEach((x, i) => {
    const w = e.ecritures?.[i];
    if (!w) return;
    w.droit ??= x.droit;
    w.lignes.forEach((l, j) => { l.pourquoi ??= x.pourquoi[j]; });
  });
  if (AUSSI[e.id]) e.aussi = [...new Set([...(e.aussi ?? []), ...AUSSI[e.id]])];
  if (AUDIO_DISPO.includes(e.id)) e.audio = { scene: `/audio/${e.id}-scene.mp3`, cours: `/audio/${e.id}-cours.mp3` };
  // Durée affichée = durée réelle d'écoute, arrondie à la minute
  if (AUDIO_DUREE[e.id]) e.minutes = Math.max(1, Math.round(AUDIO_DUREE[e.id] / 60));
  else if (e.status === "live") e.status = "ecrit";
}

export const episodesOf = (ue: string) => EPISODES.filter((e) => e.ue === ue || e.aussi?.includes(ue as Episode["ue"]));
export const findEpisode = (id: string) => EPISODES.find((e) => e.id === id);
