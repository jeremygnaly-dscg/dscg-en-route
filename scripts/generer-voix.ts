// Génère les MP3 « voix studio » avec l'API ElevenLabs, puis met à jour src/content/audio.ts.
// Lancé par GitHub Actions (workflow « Générer les voix »), jamais depuis le site.
//
// Variables attendues :
//   ELEVENLABS_API_KEY  (secret)            clé API ElevenLabs
//   VOICE_COURS                             voix du cours (apaisante)
//   VOICE_NARRATRICE   (facultatif)         sinon VOICE_COURS
//   VOICE_DIRIGEANT, VOICE_EXPERT           voix de la scène
//   EPISODES            "all" ou liste d'ids séparés par des virgules
//   FORCE               "true" pour régénérer des fichiers existants
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { EPISODES } from "../src/content/episodes";
import type { Line } from "../src/content/types";

const KEY = process.env.ELEVENLABS_API_KEY ?? "";
const V = {
  cours: process.env.VOICE_COURS ?? "",
  narrateur: process.env.VOICE_NARRATRICE || process.env.VOICE_COURS || "",
  dirigeant: process.env.VOICE_DIRIGEANT ?? "",
  expert: process.env.VOICE_EXPERT ?? "",
};
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
const FORCE = process.env.FORCE === "true";
const OUT = path.join(process.cwd(), "public", "audio");
const TMP = path.join(process.cwd(), ".voix-tmp");

if (!KEY) throw new Error("Secret ELEVENLABS_API_KEY manquant (Settings → Secrets and variables → Actions).");
for (const [k, v] of Object.entries(V)) if (!v) throw new Error(`Variable de voix manquante : ${k === "cours" ? "VOICE_COURS" : "VOICE_" + k.toUpperCase()}`);

// Texte adapté à la lecture à voix haute
const oral = (t: string) => t
  .replace(/`/g, "")
  .replace(/\b1\s?M€/g, "1 million d'euros")
  .replace(/(\d)\s?M€/g, "$1 millions d'euros").replace(/(\d)\s?k€/g, "$1 mille euros").replace(/(\d)\s?€/g, "$1 euros")
  .replace(/\bart\.\s?/g, "article ").replace(/\bC\. com\./g, "Code de commerce").replace(/\bC\. civ\./g, "Code civil")
  .replace(/×/g, " fois ").replace(/\s+/g, " ").trim();

const VOICE_SETTINGS = {
  cours: { stability: 0.6, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 0.95 },
  scene: { stability: 0.45, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true, speed: 1 },
};

async function tts(text: string, voice: string, settings: object, file: string) {
  for (let essai = 1; essai <= 4; essai++) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: MODEL, language_code: "fr", voice_settings: settings }),
    });
    if (res.ok) { fs.writeFileSync(file, Buffer.from(await res.arrayBuffer())); return; }
    const msg = await res.text();
    if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 4000 * essai)); continue; }
    throw new Error(`ElevenLabs ${res.status} : ${msg.slice(0, 300)}`);
  }
  throw new Error("ElevenLabs ne répond pas après 4 essais.");
}

// Assemble des MP3 avec un court silence entre chaque, au même format
function assembler(parts: string[], silence: number, out: string) {
  const sil = path.join(TMP, `silence-${silence}.mp3`);
  if (!fs.existsSync(sil)) {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", String(silence), "-c:a", "libmp3lame", "-b:a", "128k", sil]);
  }
  const list = path.join(TMP, "liste.txt");
  const lines = parts.flatMap((p, i) => (i ? [sil, p] : [p])).map((p) => `file '${p}'`);
  fs.writeFileSync(list, lines.join("\n"));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-ac", "1", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "128k", out]);
}

async function piste(id: string, kind: "scene" | "cours", lines: Line[]) {
  const out = path.join(OUT, `${id}-${kind}.mp3`);
  if (fs.existsSync(out) && !FORCE) { console.log(`  = ${id}-${kind}.mp3 existe déjà`); return; }
  const parts: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const voice = kind === "cours" ? V.cours : V[l.who as keyof typeof V] ?? V.narrateur;
    const f = path.join(TMP, `${id}-${kind}-${String(i).padStart(2, "0")}.mp3`);
    const brut = f.replace(/\.mp3$/, "-brut.mp3");
    await tts(oral(l.text), voice, kind === "cours" ? VOICE_SETTINGS.cours : VOICE_SETTINGS.scene, brut);
    // Même volume pour toutes les voix (-16 LUFS), pour qu'aucun personnage ne paraisse plus bas
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", brut, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "128k", f]);
    parts.push(f);
  }
  assembler(parts, kind === "cours" ? 0.8 : 0.45, out);
  console.log(`  ✓ ${id}-${kind}.mp3`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(TMP, { recursive: true });
  const demande = (process.env.EPISODES || "all").trim();
  const ids = demande === "all" ? null : demande.split(",").map((s) => s.trim()).filter(Boolean);
  const cibles = EPISODES.filter((e) => e.status === "live" && (!ids || ids.includes(e.id)));
  if (!cibles.length) throw new Error(`Aucun épisode trouvé pour : ${demande}`);
  const chars = cibles.reduce((n, e) => n + [...e.scene, ...e.cours].reduce((m, l) => m + oral(l.text).length, 0), 0);
  console.log(`${cibles.length} épisode(s), environ ${chars} caractères (≈ crédits ElevenLabs).`);

  let erreur: unknown = null;
  try {
    for (const e of cibles) {
      console.log(`→ ${e.title}`);
      await piste(e.id, "scene", e.scene);
      await piste(e.id, "cours", e.cours);
    }
  } catch (e) {
    erreur = e; // on enregistre quand même ce qui a été produit
  }

  // Déclare les épisodes dont les deux pistes existent
  const dispo = EPISODES.filter((e) => ["scene", "cours"].every((k) => fs.existsSync(path.join(OUT, `${e.id}-${k}.mp3`)))).map((e) => e.id);
  fs.writeFileSync(
    path.join(process.cwd(), "src", "content", "audio.ts"),
    `// Épisodes dont les MP3 ElevenLabs sont dans /public/audio/ (mis à jour par scripts/generer-voix.ts).\n` +
      `// Convention de nom : <id>-scene.mp3 et <id>-cours.mp3\n` +
      `export const AUDIO_DISPO: string[] = ${JSON.stringify(dispo, null, 2)};\n`,
  );
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`Voix studio disponibles pour ${dispo.length} épisode(s).`);
  if (erreur) throw erreur;
}

main().catch((e) => { console.error(e.message ?? e); process.exit(1); });
