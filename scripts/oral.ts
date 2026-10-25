// Texte adapté à la lecture à voix haute par ElevenLabs.
// - Les numéros de compte se disent comme en cabinet : les trois premiers chiffres, puis le reste
//   (2154 → « deux cent quinze, quatre » ; 44571 → « quatre cent quarante-cinq, soixante et onze »).
// - Tous les nombres sont écrits en toutes lettres, pour que la voix ne les lise pas de travers
//   (montants avec espaces, décimales, pourcentages, millions d'euros, fractions).
// Le texte affiché dans l'appli ne change pas : seule la voix utilise cette version.

const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"];
const DIZAINES = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante"];

function moinsDeCent(n: number): string {
  if (n <= 16) return UNITES[n];
  if (n < 20) return "dix-" + UNITES[n - 10];
  if (n < 70) {
    const d = Math.floor(n / 10), u = n % 10;
    if (u === 0) return DIZAINES[d];
    if (u === 1) return DIZAINES[d] + " et un";
    return DIZAINES[d] + "-" + UNITES[u];
  }
  if (n < 80) return n === 71 ? "soixante et onze" : "soixante-" + moinsDeCent(n - 60);
  if (n === 80) return "quatre-vingts";
  return "quatre-vingt-" + moinsDeCent(n - 80);
}

function moinsDeMille(n: number, final: boolean): string {
  const c = Math.floor(n / 100), r = n % 100;
  let s = "";
  if (c === 1) s = "cent";
  else if (c > 1) s = UNITES[c] + " cent" + (r === 0 && final ? "s" : "");
  if (r) s += (s ? " " : "") + moinsDeCent(r);
  return s || "zéro";
}

export function enLettres(n: number): string {
  if (n === 0) return "zéro";
  const parts: string[] = [];
  const mds = Math.floor(n / 1e9), mil = Math.floor((n % 1e9) / 1e6), k = Math.floor((n % 1e6) / 1000), r = n % 1000;
  if (mds) parts.push(moinsDeMille(mds, true) + (mds > 1 ? " milliards" : " milliard"));
  if (mil) parts.push(moinsDeMille(mil, true) + (mil > 1 ? " millions" : " million"));
  if (k) parts.push(k === 1 ? "mille" : moinsDeMille(k, false) + " mille");
  if (r) parts.push(moinsDeMille(r, true));
  return parts.join(" ");
}

// Partie décimale : « 05 » → « zéro cinq », « 73 » → « soixante-treize »
function decimales(d: string): string {
  const zeros = d.match(/^0*/)![0].length;
  const reste = d.slice(zeros);
  return [...Array(zeros).fill("zéro"), ...(reste ? [enLettres(Number(reste))] : [])].join(" ");
}

const nombre = (entier: string, dec?: string) => enLettres(Number(entier.replace(/\s/g, ""))) + (dec ? " virgule " + decimales(dec) : "");

// Numéro de compte : trois premiers chiffres, puis le reste
export function compteOral(c: string): string {
  if (c.length <= 3) return enLettres(Number(c));
  const reste = c.slice(3);
  const lu = /^0/.test(reste) ? reste.split("").map((x) => UNITES[Number(x)]).join(" ") : enLettres(Number(reste));
  return `${enLettres(Number(c.slice(0, 3)))}, ${lu}`;
}

const ORDINAUX: Record<string, string> = { "1er": "premier", "1re": "première", "2e": "deuxième", "3e": "troisième", "4e": "quatrième", "5e": "cinquième", "6e": "sixième", "7e": "septième", "8e": "huitième", "9e": "neuvième", "10e": "dixième", "36e": "trente-sixième", "43e": "quarante-troisième" };

// Contextes où un nombre de 4 ou 5 chiffres n'est PAS un compte
const PAS_COMPTE = /(article|articles|art\.|L\.|R\.|NEP|IAS|IFRS|ISO|ANC|CRC|n°|loi|décret|ordonnance|règl\.|règlement|SQL|COSO|en|depuis|année|exercice|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*$/i;

export function creerOral(comptesConnus: Set<string>, opts: { nombres?: boolean } = {}) {
  const nombres = opts.nombres ?? true;
  return (t: string): string => {
    let s = t.replace(/`/g, "");
    // Abréviations
    s = s.replace(/\bart\.\s?/g, "article ").replace(/\bC\. com\./g, "Code de commerce").replace(/\bC\. civ\./g, "Code civil");
    if (nombres) s = s.replace(/\bC\. trav\./g, "Code du travail").replace(/\bCGI\b/g, "C G I").replace(/\bLPF\b/g, "L P F");
    // Numéros de compte (4 chiffres et plus), hors références juridiques, années et montants
    s = s.replace(/\b\d{4,6}\b/g, (n: string, off: number, all: string) => {
      if (!comptesConnus.has(n)) return n;
      const avant = all.slice(Math.max(0, off - 25), off);
      const apres = all.slice(off + n.length, off + n.length + 12);
      if (/[\d][\s ]?$|[,.\/-]$/.test(avant)) return n;                 // fin d'un nombre ou d'une référence
      if (/^([\s ]?\d|[,.\/-]\d|\s?(€|%|euros|ans|mois|jours|heures|salariés|actions|titres|unités|kilos|tonnes|bacs|lampes))/.test(apres)) return n;
      const annee = Number(n) >= 1900 && Number(n) <= 2099 && !/compte\s*$/i.test(avant);
      if (annee || PAS_COMPTE.test(avant)) return n;
      return compteOral(n);
    });
    if (!nombres) return s.replace(/\b1\s?M€/g, "1 million d'euros").replace(/(\d)\s?M€/g, "$1 millions d'euros").replace(/(\d)\s?k€/g, "$1 mille euros").replace(/(\d)\s?€/g, "$1 euros").replace(/×/g, " fois ").replace(/\s+/g, " ").trim();
    // Montants et unités
    s = s.replace(/(\d[\d\s ]*)(?:,(\d+))?\s?Md€/g, (_, e, d) => `${nombre(e, d)} milliard${Number(e.replace(/\s/g, "")) > 1 || d ? "s" : ""} d'euros`)
      .replace(/(\d[\d\s ]*)(?:,(\d+))?\s?M€/g, (_, e, d) => `${nombre(e, d)} million${Number(e.replace(/\s/g, "")) > 1 || d ? "s" : ""} d'euros`)
      .replace(/(\d[\d\s ]*)(?:,(\d+))?\s?k€/g, (_, e, d) => d ? `${nombre(e, d)} mille euros` : `${enLettres(Number(e.replace(/\s/g, "")) * 1000)} euros`)
      .replace(/(\d[\d\s ]*),(\d{2})\s?€/g, (_, e, d) => `${nombre(e)} euros ${enLettres(Number(d))}`)
      .replace(/(\d[\d\s ]*)(?:,(\d+))?\s?€/g, (_, e, d) => `${nombre(e, d)} euros`)
      .replace(/(\d[\d\s ]*)(?:,(\d+))?\s?%/g, (_, e, d) => `${nombre(e, d)} pour cent`);
    // Ordinaux, fractions, versions, références composées
    s = s.replace(/\b(1er|1re|\d{1,2}e)\b/g, (m) => ORDINAUX[m] ?? m)
      .replace(/\b(\d+)\/(\d+)\b/g, (_, a, b) => `${enLettres(Number(a))} sur ${enLettres(Number(b))}`)
      .replace(/\b(\d+)\.(\d+)\b/g, (_, a, b) => `${enLettres(Number(a))} point ${decimales(b)}`)
      .replace(/\b(\d+)-(\d+)\b/g, (_, a, b) => `${/^0/.test(a) ? decimales(a) : enLettres(Number(a))}, ${/^0/.test(b) ? decimales(b) : enLettres(Number(b))}`);
    // Nombres restants : entiers avec espaces de milliers, décimales
    s = s.replace(/\d{1,3}(?:[\s ]\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g, (m) => {
      const [e, d] = m.split(",");
      return nombre(e, d);
    });
    return s.replace(/×/g, " fois ").replace(/\s−\s/g, " moins ").replace(/\s+/g, " ").trim();
  };
}
