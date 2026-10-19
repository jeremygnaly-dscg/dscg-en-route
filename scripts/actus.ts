// Robot du fil d'actualité Zenvise : lit des flux RSS/Atom, garde ce qui sert aux candidats DCG/DSCG,
// récupère l'image de chaque article (flux, puis balise og:image de la page) et écrit public/actus.json.
// Si ANTHROPIC_API_KEY est présente, Claude Haiku trie les articles et rédige un résumé original,
// une question d'examen et les UE concernées. Sinon, tri par mots-clés et titre seul.
//
// Règles : on ne recopie jamais le texte des articles ; on affiche titre, image d'aperçu, source et lien.
// Lancement : npx tsx scripts/actus.ts   (workflow .github/workflows/actus.yml, 3 fois par jour)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { ACTUS } from "../src/content/actus";
import { EPISODES } from "../src/content/episodes";

type Categorie = "Fiscalité" | "Social" | "Comptabilité & audit" | "Finance" | "Économie" | "Profession" | "Numérique" | "Droit des affaires";

interface Source { nom: string; urls: string[]; theme?: Categorie; officiel?: boolean }

// Plusieurs adresses possibles par source : la première qui répond est retenue.
const SOURCES: Source[] = [
  { nom: "economie.gouv.fr", urls: ["https://www.economie.gouv.fr/rss/toutesactualites"], theme: "Économie", officiel: true },
  { nom: "Entreprendre Service-Public", urls: ["https://entreprendre.service-public.gouv.fr/actualites.rss", "https://entreprendre.service-public.fr/actualites.rss", "https://www.service-public.fr/abonnements/rss/actu-actu-pro.rss"], theme: "Droit des affaires", officiel: true },
  { nom: "Compta Online", urls: ["https://www.compta-online.com/rss.xml", "https://www.compta-online.com/rss", "https://www.compta-online.com/rss/actualites.xml", "https://www.compta-online.com/feed"], theme: "Profession" },
  { nom: "Village de la Justice", urls: ["https://www.village-justice.com/articles/spip.php?page=backend"], theme: "Droit des affaires" },
  { nom: "Le Monde du Droit", urls: ["https://www.lemondedudroit.fr/?format=feed&type=rss"], theme: "Droit des affaires" },
  { nom: "Les Echos", urls: ["https://services.lesechos.fr/rss/les-echos-economie.xml", "https://services.lesechos.fr/rss/les-echos-finance-marches.xml", "https://syndication.lesechos.fr/rss/rss_economie.xml", "https://syndication.lesechos.fr/rss/rss_une.xml"], theme: "Finance" },
  { nom: "CNIL", urls: ["https://www.cnil.fr/fr/rss.xml"], theme: "Numérique", officiel: true },
  { nom: "Le Monde Économie", urls: ["https://www.lemonde.fr/economie/rss_full.xml"], theme: "Économie" },
  { nom: "Le Figaro Économie", urls: ["https://www.lefigaro.fr/rss/figaro_economie.xml"], theme: "Économie" },
  { nom: "franceinfo Économie", urls: ["https://www.francetvinfo.fr/economie.rss"], theme: "Économie" },
  { nom: "Capital", urls: ["https://feed.prismamediadigital.com/v1/cap/rss?sources=capital"], theme: "Économie" },
];

// Mots-clés et leur poids (tri sans IA, et pré-filtre avant l'IA)
const MOTS: [RegExp, number, Categorie][] = [
  [/expert[- ]comptable|cabinets? (d'expertise|comptables?)|ordre des experts|profession comptable|dcg|dscg|cca\b/i, 4, "Profession"],
  [/commissaires? aux comptes|audit l[ée]gal|auditeurs?|certification des comptes|\bcncc\b|\bh3c\b|haut conseil du commissariat/i, 3, "Comptabilité & audit"],
  [/comptab|comptes annuels|bilan comptable|liasse fiscale|\bifrs\b|normes? comptables?|plan comptable|consolidation des comptes|\bcsrd\b|reporting de durabilit|\besrs\b/i, 3, "Comptabilité & audit"],
  [/fiscal|imp[oô]t sur le revenu|imp[oô]t sur les soci[ée]t[ée]s|\btva\b|\bcgi\b|bofip|dgfip|loi de finances|\bplf\b|niche fiscale|taxe|imp[oô]ts?\b|imposition|budget 2027|contr[oô]le fiscal|redressement fiscal|droits de succession|plus-values?/i, 3, "Fiscalité"],
  [/urssaf|cotisations? sociales|licenci|rupture conventionnelle|code du travail|\bcse\b|prud'?hom|int[ée]ressement|partage de la valeur|contrat de travail|arr[êe]t de travail|t[ée]l[ée]travail/i, 3, "Social"],
  [/salari[ée]s?|smic|ch[oô]mage|retraites?|s[ée]curit[ée] sociale/i, 1, "Social"],
  [/soci[ée]t[ée]s?|sas\b|sarl|assembl[ée]e g[ée]n[ée]rale|dirigeants?|faillite|redressement judiciaire|liquidation|proc[ée]dures? collectives?|sauvegarde|bail commercial|fonds de commerce|cession/i, 2, "Droit des affaires"],
  [/lbo|fusion|acquisition|rachat|lev[ée]e de fonds|capital[- ]investissement|private equity|introduction en bourse|ipo|dividendes?|obligations?|bce|taux directeurs?/i, 2, "Finance"],
  [/inflation|croissance|pib|d[ée]ficit|dette publique|ch[oô]mage|commerce ext[ée]rieur|droits de douane|politique mon[ée]taire/i, 1, "Économie"],
  [/facture? [ée]lectronique|facturation [ée]lectronique|cybers[ée]curit|cyberattaque|rgpd|cnil|intelligence artificielle|\bia\b|donn[ée]es personnelles|blockchain|crypto/i, 2, "Numérique"],
];
const EXCLUS = /football|ligue 1|people|météo|recette|horoscope|immobilier de luxe|bourse en direct|cours de l'or|consultation du public|permis (exclusif )?de recherches?|pillages?|saccages?|cagnotte|concerts?|faits? divers/i;

export interface ItemActu {
  id: string; titre: string; url: string; source: string; officiel?: boolean; date: string; image?: string;
  categorie: Categorie; score: number;
  // champs IA (facultatifs)
  resume?: string; question?: string; diplomes?: ("DCG" | "DSCG")[]; ues?: string[]; episodeId?: string; ia?: boolean;
}

const UA = "Mozilla/5.0 (compatible; ZenviseBot/1.0; +https://zenvise.fr)";
const decode = (s: string) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&nbsp;/g, " ").replace(/&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;|&laquo;|&raquo;/g, "\"")
  .replace(/&eacute;/g, "é").replace(/&egrave;/g, "è").replace(/&agrave;/g, "à").replace(/&ccedil;/g, "ç").replace(/&ecirc;/g, "ê")
  .replace(/&quot;/g, "\"").replace(/&#039;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const texte = (s = "") => decode(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const balise = (bloc: string, nom: string) => bloc.match(new RegExp(`<${nom}(?:\\s[^>]*)?>([\\s\\S]*?)</${nom}>`, "i"))?.[1];
const attr = (bloc: string, re: RegExp) => decode(bloc.match(re)?.[1] ?? "") || undefined;

async function obtenir(url: string, ms = 15000): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.8, */*;q=0.5" }, signal: AbortSignal.timeout(ms), redirect: "follow" });
    if (!r.ok) return null;
    return await r.text();
  } catch { return null; }
}

function imageDuBloc(bloc: string): string | undefined {
  return attr(bloc, /<media:content[^>]*url="([^"]+)"[^>]*(?:medium="image"|type="image)/i)
    ?? attr(bloc, /<media:content[^>]*url="([^"]+\.(?:jpe?g|png|webp)[^"]*)"/i)
    ?? attr(bloc, /<media:thumbnail[^>]*url="([^"]+)"/i)
    ?? attr(bloc, /<enclosure[^>]*url="([^"]+)"[^>]*type="image/i)
    ?? attr(bloc, /<enclosure[^>]*type="image[^"]*"[^>]*url="([^"]+)"/i)
    ?? attr(decode(bloc), /<img[^>]+src="(https?:[^"]+)"/i);
}

function lireFlux(xml: string, source: Source): Omit<ItemActu, "categorie" | "score">[] {
  const blocs = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  return blocs.map((b) => {
    const titre = texte(balise(b, "title"));
    const url = texte(balise(b, "link")) || attr(b, /<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i) || attr(b, /<link[^>]*href="([^"]+)"/i) || "";
    const brute = texte(balise(b, "pubDate") ?? balise(b, "dc:date") ?? balise(b, "published") ?? balise(b, "updated"));
    const d = new Date(brute);
    const desc = texte(balise(b, "description") ?? balise(b, "summary") ?? "").slice(0, 400);
    return {
      id: `${source.nom}|${url}`.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 120),
      titre, url, source: source.nom, officiel: source.officiel, date: isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString(),
      image: imageDuBloc(b), _desc: desc,
    } as Omit<ItemActu, "categorie" | "score"> & { _desc: string };
  }).filter((x) => x.titre && x.url.startsWith("http"));
}

function noter(titre: string, desc: string, theme?: Categorie, officiel?: boolean): { score: number; categorie: Categorie } {
  const t = `${titre} ${desc}`;
  if (EXCLUS.test(t)) return { score: 0, categorie: theme ?? "Économie" };
  let score = 0, fort = false; const parCat = new Map<Categorie, number>();
  for (const [re, poids, cat] of MOTS) if (re.test(t)) { score += poids; if (poids >= 3) fort = true; parCat.set(cat, (parCat.get(cat) ?? 0) + poids); }
  if (!fort && !officiel) score = Math.min(score, 2); // presse généraliste : il faut au moins un mot-clé fort
  const categorie = [...parCat.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? theme ?? "Économie";
  return { score, categorie };
}

async function ogImage(url: string): Promise<string | undefined> {
  const html = await obtenir(url, 10000);
  if (!html) return undefined;
  const tete = html.slice(0, 200000);
  const img = attr(tete, /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i)
    ?? attr(tete, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    ?? attr(tete, /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  if (!img) return undefined;
  try { return new URL(img, url).toString(); } catch { return undefined; }
}

// ── Tri et rédaction par Claude (facultatif) ──
const EPISODES_LIENS = EPISODES.filter((e) => e.status !== "soon").map((e) => `${e.id} | ${e.ue} | ${e.title}`).join("\n");
const CONSIGNE = `Tu es le rédacteur du fil d'actualité de Zenvise, une application de révision pour le DCG et le DSCG (diplômes d'expertise comptable).
Pour chaque article reçu (titre, source, extrait), décide s'il est utile à un candidat DCG ou DSCG (fiscalité, droit des affaires, droit social, comptabilité, audit, finance d'entreprise, économie générale, systèmes d'information, profession comptable).
Réponds UNIQUEMENT par un tableau JSON, un objet par article, avec :
- "id" : l'id reçu
- "garder" : true ou false (false pour les faits divers, la politique pure, la Bourse au jour le jour, ce qui n'a aucun lien avec le programme)
- "categorie" : une de "Fiscalité", "Social", "Comptabilité & audit", "Finance", "Économie", "Profession", "Numérique", "Droit des affaires"
- "diplomes" : sous-ensemble de ["DCG","DSCG"]
- "ues" : liste courte de libellés, ex. ["DCG UE4","DSCG UE1"]
- "resume" : 2 phrases maximum, dans tes propres mots, sans recopier l'extrait, factuel, sans inventer de chiffre absent de l'extrait
- "question" : une question d'examen plausible inspirée du sujet (1 phrase)
- "episodeId" : l'id d'un épisode de la liste ci-dessous seulement s'il traite exactement de la notion, sinon null
Si l'article n'est pas gardé, mets seulement "id" et "garder".
Épisodes disponibles (id | UE | titre) :
${EPISODES_LIENS}`;

async function enrichir(items: (ItemActu & { _desc?: string })[]): Promise<void> {
  const cle = process.env.ANTHROPIC_API_KEY;
  if (!cle || !items.length) return;
  const UES_OK = /^(DCG UE(1[0-3]|[1-9])|DSCG UE[1-5])$/;
  for (let i = 0; i < items.length; i += 15) {
    const lot = items.slice(i, i + 15);
    const corps = lot.map((x) => JSON.stringify({ id: x.id, titre: x.titre, source: x.source, extrait: (x._desc ?? "").slice(0, 300) })).join("\n");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": cle, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-5-5", max_tokens: 4000, system: CONSIGNE, messages: [{ role: "user", content: `<articles>\n${corps}\n</articles>` }] }),
        signal: AbortSignal.timeout(60000),
      });
      if (!r.ok) { console.log(`::warning::Claude ${r.status} : ${(await r.text()).slice(0, 200)}`); return; }
      const rep = await r.json();
      const brut = (rep.content ?? []).map((b: { text?: string }) => b.text ?? "").join("");
      const tableau = JSON.parse(brut.slice(brut.indexOf("["), brut.lastIndexOf("]") + 1)) as Record<string, unknown>[];
      for (const a of tableau) {
        const it = lot.find((x) => x.id === a.id);
        if (!it) continue;
        it.ia = true;
        if (a.garder === false) { it.score = -1; continue; }
        if (typeof a.categorie === "string") it.categorie = a.categorie as Categorie;
        if (typeof a.resume === "string") it.resume = a.resume.slice(0, 400);
        if (typeof a.question === "string") it.question = a.question.slice(0, 300);
        if (Array.isArray(a.diplomes)) it.diplomes = a.diplomes.filter((d) => d === "DCG" || d === "DSCG") as ("DCG" | "DSCG")[];
        if (Array.isArray(a.ues)) it.ues = (a.ues as string[]).filter((u) => UES_OK.test(u)).slice(0, 4);
        if (typeof a.episodeId === "string" && EPISODES.some((e) => e.id === a.episodeId)) it.episodeId = a.episodeId;
        it.score = Math.max(it.score, 3);
      }
    } catch (e) { console.log(`::warning::Claude : ${(e as Error).message}`); }
  }
}

async function main() {
  const fichier = "public/actus.json";
  const avant: { items?: ItemActu[]; images?: Record<string, string>; ecartes?: string[] } = existsSync(fichier) ? JSON.parse(readFileSync(fichier, "utf8")) : {};
  const deja = new Map((avant.items ?? []).map((x) => [x.id, x]));
  const ecartes = new Set(avant.ecartes ?? []); // articles déjà écartés par l'IA : on ne les renvoie pas
  const limite = Date.now() - 21 * 86400000;
  const etat: { nom: string; url?: string; ok: boolean; articles: number }[] = [];
  const nouveaux: (ItemActu & { _desc?: string })[] = [];

  for (const s of SOURCES) {
    let xml: string | null = null, urlOk: string | undefined;
    for (const u of s.urls) { xml = await obtenir(u); if (xml && /<(rss|feed|rdf:RDF)[\s>]/i.test(xml)) { urlOk = u; break; } xml = null; }
    if (!xml) { etat.push({ nom: s.nom, ok: false, articles: 0 }); console.log(`::warning::Source injoignable : ${s.nom}`); continue; }
    const lus = lireFlux(xml, s);
    let gardes = 0;
    for (const x of lus) {
      if (new Date(x.date).getTime() < limite || deja.has(x.id) || ecartes.has(x.id)) continue;
      const desc = (x as { _desc?: string })._desc ?? "";
      const { score, categorie } = noter(x.titre, desc, s.theme, s.officiel);
      const seuil = s.officiel ? 2 : 3;
      if (score < seuil) continue;
      nouveaux.push({ ...x, categorie, score, _desc: desc });
      gardes++;
    }
    etat.push({ nom: s.nom, url: urlOk, ok: true, articles: gardes });
    console.log(`${s.nom} : ${lus.length} lus, ${gardes} retenus (${urlOk})`);
  }

  // Les meilleurs d'abord, au plus 8 par source et 40 par passage
  const parSource = new Map<string, number>();
  const retenus = nouveaux.sort((a, b) => b.score - a.score || b.date.localeCompare(a.date)).filter((x) => {
    const n = (parSource.get(x.source) ?? 0) + 1; parSource.set(x.source, n); return n <= 8;
  }).slice(0, 40);

  await enrichir(retenus);
  const vus = new Set([...deja.values()].map((x) => x.titre.toLowerCase().replace(/[^a-z]/g, "").slice(0, 40)));
  const finaux = retenus.filter((x) => {
    if (x.score < 0) return false;
    const cle = x.titre.toLowerCase().replace(/[^a-z]/g, "").slice(0, 40);
    if (vus.has(cle)) return false; // doublon (même article relayé deux fois)
    vus.add(cle); return true;
  });
  for (const x of retenus) if (x.score < 0) ecartes.add(x.id);

  // Images manquantes : balise og:image de l'article
  await Promise.all(finaux.filter((x) => !x.image).map(async (x) => { x.image = await ogImage(x.url); }));
  for (const x of finaux) delete (x as { _desc?: string })._desc;

  // Images des décryptages Zenvise (actus rédigées à la main)
  const images: Record<string, string> = { ...(avant.images ?? {}) };
  for (const a of ACTUS) if (a.sourceUrl && !images[a.id]) { const img = await ogImage(a.sourceUrl); if (img) images[a.id] = img; }

  const items = [...finaux, ...deja.values()]
    .filter((x) => new Date(x.date).getTime() >= limite)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 80);

  const sortie = { majLe: new Date().toISOString(), sources: etat, images, items, ecartes: [...ecartes].slice(-400) };
  writeFileSync(fichier, JSON.stringify(sortie, null, 1) + "\n");
  const avecImage = items.filter((x) => x.image).length;
  console.log(`::notice::${finaux.length} nouveaux articles, ${items.length} au total, ${avecImage} avec image, ${Object.keys(images).length} décryptages illustrés. IA : ${process.env.ANTHROPIC_API_KEY ? "oui" : "non"}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
