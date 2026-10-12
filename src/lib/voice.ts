// Voix du téléphone (synthèse vocale du navigateur) : utilisée tant qu'un épisode
// n'a pas encore ses fichiers MP3 produits avec ElevenLabs.

const FEMALE = /am[ée]lie|audrey|aur[ée]lie|marie|virginie|denise|julie|c[ée]line|hortense|l[ée]a\b|claire|chantal|[ée]lo[iï]se|vivienne|brigitte|sylvie|google fran/i;
const MALE = /thomas|henri|paul|nicolas|daniel|jacques|antoine|mathieu|yves|guillaume|r[ée]my|g[ée]rard|j[ée]r[ôo]me|fabrice|alain/i;
const QUALITY = /enhanced|premium|natural|neural|am[ée]lior/i;

export function pickVoice(gender: "f" | "m"): { voice: SpeechSynthesisVoice | null; matched: boolean } {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return { voice: null, matched: false };
  const rx = gender === "f" ? FEMALE : MALE;
  const fr = window.speechSynthesis.getVoices().filter((v) => /^fr/i.test(v.lang));
  const rank = (v: SpeechSynthesisVoice) =>
    (rx.test(v.name) ? 4 : 0) + (QUALITY.test(v.name) ? 2 : 0) + (/fr[-_]FR/i.test(v.lang) ? 1 : 0);
  fr.sort((a, b) => rank(b) - rank(a));
  const voice = fr[0] ?? null;
  return { voice, matched: !!voice && rx.test(voice.name) };
}

export function speakLine(
  text: string,
  opts: { gender: "f" | "m"; tone: "calm" | "lively"; speed: number; speaker: string },
  onEnd: () => void,
  onError: () => void,
) {
  const { voice, matched } = pickVoice(opts.gender);
  const u = new SpeechSynthesisUtterance(text.replace(/`/g, ""));
  if (voice) u.voice = voice;
  u.lang = "fr-FR";
  const base = opts.tone === "calm" ? { r: 0.86, p: 1 } : { r: 0.98, p: 1.03 };
  const genderShift = matched ? 0 : opts.gender === "f" ? 0.12 : -0.1;
  const speakerShift = ({ dirigeant: 0.04, expert: -0.02 } as Record<string, number>)[opts.speaker] ?? 0;
  u.rate = base.r * opts.speed;
  u.pitch = Math.min(1.4, Math.max(0.5, base.p + genderShift + speakerShift));
  u.onend = onEnd;
  u.onerror = onError;
  window.speechSynthesis.speak(u);
}

export const voiceAvailable = () => typeof window !== "undefined" && "speechSynthesis" in window;
