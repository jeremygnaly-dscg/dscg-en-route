// Petits outils d'écriture des lots : lignes de scène et de cours, épisode « écrit » par défaut.
// Un épisode écrit passe automatiquement en ligne quand sa voix studio existe (voir episodes.ts).
import type { Episode, FicheRevision, FlashQuestion, Format, Line, UeId } from "./types";

export const N = (text: string): Line => ({ who: "narrateur", text });
export const D = (text: string): Line => ({ who: "dirigeant", text });
export const X = (text: string): Line => ({ who: "expert", text });
export const C = (text: string, key?: boolean): Line => (key ? { who: "cours", text, key } : { who: "cours", text });
// Les choix sont écrits avec la bonne réponse où l'on veut ; on les fait tourner selon le texte de la question,
// pour que la bonne réponse ne soit pas toujours au même endroit (rotation stable d'une génération à l'autre).
export const Q = (q: string, choices: string[], answer: number, why: string): FlashQuestion => {
  let h = 0;
  for (const ch of q) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const k = h % choices.length;
  const tournes = [...choices.slice(k), ...choices.slice(0, k)];
  return { q, choices: tournes, answer: (answer - k + choices.length) % choices.length, why };
};

export interface Brouillon {
  id: string;
  ue: UeId;
  title: string;
  ref: string;
  notion?: string;
  scene: Line[];
  cours: Line[];
  flash: FlashQuestion[];
  fiche: FicheRevision;
}

export const ecrit = (format: Format, source: string, minutes = 2) => (b: Brouillon): Episode => ({
  ...b, format, source, minutes, status: "live",
});
