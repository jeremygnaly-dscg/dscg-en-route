// Voix des vidéos TikTok « Dessine-moi la compta » : une phrase = un MP3, voix de l'expert-comptable.
// Lancé par GitHub Actions (workflow « Voix des vidéos TikTok »). Les phrases déjà générées
// sont retéléchargées depuis l'historique ElevenLabs, sans dépenser de crédit.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const KEY = process.env.ELEVENLABS_API_KEY ?? "";
const VOIX = process.env.VOICE_EXPERT ?? "";
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
const DEMANDE = (process.env.VIDEOS || "all").split(",").map((s) => s.trim()).filter(Boolean);
if (!KEY || !VOIX) throw new Error("ELEVENLABS_API_KEY ou VOICE_EXPERT manquant.");

// « Zenvise » se prononce à l'anglaise : on l'écrit phonétiquement pour la voix
export const FIN = "Zenvaïze. Bientôt sur vos écrans.";
const REGLAGES = { stability: 0.45, similarity_boost: 0.75, style: 0.2, use_speaker_boost: true, speed: 1.03 };
const DOSSIER = path.join(process.cwd(), "media", "tiktok");
const videos = JSON.parse(fs.readFileSync(path.join(DOSSIER, "videos.json"), "utf8")) as { id: string; segments: { voix: string }[] }[];

const histo = new Map<string, string>();
async function historique() {
  let after: string | undefined;
  for (let p = 0; p < 50; p++) {
    const r = await fetch(`https://api.elevenlabs.io/v1/history?page_size=1000${after ? `&start_after_history_item_id=${after}` : ""}`, { headers: { "xi-api-key": KEY } });
    if (!r.ok) return;
    const d = (await r.json()) as { history: { history_item_id: string; voice_id: string; text: string }[]; has_more: boolean; last_history_item_id?: string };
    for (const h of d.history) if (!histo.has(`${h.voice_id}|${h.text}`)) histo.set(`${h.voice_id}|${h.text}`, h.history_item_id);
    if (!d.has_more || !d.last_history_item_id) break;
    after = d.last_history_item_id;
  }
}

let payes = 0;
async function phrase(texte: string, fichier: string) {
  const brut = fichier.replace(/\.mp3$/, "-brut.mp3");
  const id = histo.get(`${VOIX}|${texte}`);
  let ok = false;
  if (id) {
    const r = await fetch(`https://api.elevenlabs.io/v1/history/${id}/audio`, { headers: { "xi-api-key": KEY } });
    if (r.ok) { fs.writeFileSync(brut, Buffer.from(await r.arrayBuffer())); ok = true; }
  }
  for (let essai = 1; !ok && essai <= 4; essai++) {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOIX}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text: texte, model_id: MODEL, language_code: "fr", voice_settings: REGLAGES }),
    });
    if (r.ok) { fs.writeFileSync(brut, Buffer.from(await r.arrayBuffer())); ok = true; payes += texte.length; break; }
    const msg = await r.text();
    if (r.status === 429 || r.status >= 500) { await new Promise((s) => setTimeout(s, 4000 * essai)); continue; }
    throw new Error(`ElevenLabs ${r.status} : ${msg.slice(0, 300)}`);
  }
  if (!ok) throw new Error("ElevenLabs ne répond pas.");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", brut, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "160k", fichier]);
  fs.rmSync(brut);
}

async function main() {
  await historique();
  for (const v of videos) {
    if (!DEMANDE.includes("all") && !DEMANDE.includes(v.id)) continue;
    const dir = path.join(DOSSIER, v.id);
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < v.segments.length; i++) await phrase(v.segments[i].voix, path.join(dir, `${String(i).padStart(2, "0")}.mp3`));
    await phrase(FIN, path.join(dir, "fin.mp3"));
    console.log(`✓ ${v.id}`);
  }
  console.log(`Caractères facturés : ${payes}`);
  console.log(`::notice title=Crédits::${payes} caractères facturés`);
}
main().catch((e) => { console.error(e); process.exit(1); });
