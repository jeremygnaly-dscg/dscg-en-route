// Rend les images d'une vidéo TikTok (30 images/s) à partir de la page générée par fabriquer.py.
// Usage : node tiktok/rendu.mjs <id> [stills]
import { createRequire } from "module";
const { chromium } = createRequire(import.meta.url)("playwright");
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const D = path.dirname(fileURLToPath(import.meta.url));
const [id, mode] = process.argv.slice(2);
let b;
try { b = await chromium.launch(); } catch { b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); }
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on("pageerror", (e) => console.log("ERR", e.message));
await p.goto("file://" + path.join(D, `${id}.gen.html`));
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
const duree = await p.evaluate(() => window.DUREE);
const out = path.join(D, ".travail", "frames-" + id); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
if (mode === "stills") {
  const segs = await p.evaluate(() => window.SEG);
  const ts = [0.8, ...segs.map(([a, b]) => b - 0.2), await p.evaluate(() => window.T_FIN + 1.5)];
  for (const t of ts) { await p.evaluate((t) => render(t), t); await p.screenshot({ path: `${out}/s${t.toFixed(1)}.png` }); }
} else {
  const n = Math.ceil(duree * 30);
  for (let i = 0; i < n; i++) { await p.evaluate((t) => render(t), i / 30); await p.screenshot({ path: `${out}/${String(i).padStart(4, "0")}.jpg`, type: "jpeg", quality: 92 }); }
}
console.log(id, "durée", duree.toFixed(1));
await b.close();
