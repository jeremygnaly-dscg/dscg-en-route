"use client";
// Invite à installer Zenvise sur l'écran d'accueil : plein écran, icône, lecture plus fiable.
import { useEffect, useState } from "react";
import styles from "./home.module.css";

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const CLE = "revizen-install-ignore";

export function Installer() {
  const [mode, setMode] = useState<"rien" | "ios" | "android">("rien");
  const [evt, setEvt] = useState<PromptEvent | null>(null);

  useEffect(() => {
    const installee = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    let ignoree = false;
    try { ignoree = localStorage.getItem(CLE) === "1"; } catch { /* rien */ }
    if (installee || ignoree) return;
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    if (ios) { setMode("ios"); return; }
    const capter = (e: Event) => { e.preventDefault(); setEvt(e as PromptEvent); setMode("android"); };
    window.addEventListener("beforeinstallprompt", capter);
    return () => window.removeEventListener("beforeinstallprompt", capter);
  }, []);

  const ignorer = () => { try { localStorage.setItem(CLE, "1"); } catch { /* rien */ } setMode("rien"); };

  if (mode === "rien") return null;
  return (
    <section className={styles.installer}>
      <b>Installe Zenvise sur ton téléphone</b>
      {mode === "ios" ? (
        <span>
          Dans Safari, touche le bouton <strong>Partager</strong> (le carré avec une flèche), puis
          <strong> « Sur l&apos;écran d&apos;accueil »</strong>. Zenvise s&apos;ouvrira en plein écran, comme une appli.
          Tu te reconnecteras une fois dans l&apos;appli installée.
        </span>
      ) : (
        <span>Plein écran, icône sur ton téléphone, lecture plus fiable écran verrouillé.</span>
      )}
      <div>
        {mode === "android" && evt && (
          <button className={styles.installBtn} onClick={async () => { await evt.prompt(); await evt.userChoice; setMode("rien"); }}>Installer</button>
        )}
        <button className={styles.installIgnore} onClick={ignorer}>Plus tard</button>
      </div>
    </section>
  );
}
