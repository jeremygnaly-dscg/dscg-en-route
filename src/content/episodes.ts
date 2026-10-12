import type { Episode, Ue } from "./types";

export const UES: Ue[] = [
  { id: "ue1", short: "UE1", name: "Gestion juridique, fiscale et sociale", available: true },
  { id: "ue3", short: "UE3", name: "Contrôle de gestion et stratégie", available: true },
  { id: "ue2", short: "UE2", name: "Finance", available: false },
  { id: "ue4", short: "UE4", name: "Comptabilité et audit", available: false },
  { id: "ue5", short: "UE5", name: "Management des systèmes d'information", available: false },
];

// Contenu démo rédigé à partir du CGI. À FAIRE RELIRE avant toute vente.
export const EPISODES: Episode[] = [
  {
    id: "regime-mere-fille",
    ue: "ue1",
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
  soon("fusion-regime-faveur", "ue1", "Fusion et régime de faveur", "art. 210 A CGI"),
  soon("pactes-associes", "ue1", "Pactes d'associés", "art. 1103 C. civ."),
  soon("procedure-sauvegarde", "ue1", "La procédure de sauvegarde", "art. L620-1 C. com."),
  soon("transfert-contrats", "ue1", "Transfert des contrats de travail", "art. L1224-1 C. trav."),
  soon("ue3-pilotage", "ue3", "Pilotage de la performance", "UE3 · tes cours + sujet zéro"),
  soon("ue3-rse", "ue3", "Contrôle de gestion et RSE", "UE3 · tes cours + sujet zéro"),
];

function soon(id: string, ue: Episode["ue"], title: string, ref: string): Episode {
  return { id, ue, title, ref, minutes: 0, status: "soon", scene: [], cours: [], flash: [] };
}

export const episodesOf = (ue: string) => EPISODES.filter((e) => e.ue === ue);
export const findEpisode = (id: string) => EPISODES.find((e) => e.id === id);
