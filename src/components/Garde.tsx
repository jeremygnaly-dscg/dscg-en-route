"use client";
// L'appli est réservée aux inscrits (bêta gratuite). Sans compte : page de connexion.
import { useEffect, useState } from "react";
import { synchroniser, useSession } from "@/lib/compte";

let synchroFaite = false; // une fusion de progression par ouverture de l'appli
let synchroEnCours: Promise<void> | null = null;

export function Garde({ children }: { children: React.ReactNode }) {
  const { session, ready } = useSession();
  const [pret, setPret] = useState(synchroFaite);

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      const suite = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.replace(`/connexion?suite=${suite}`);
      return;
    }
    if (synchroFaite) { setPret(true); return; }
    // Hors ligne ou serveur lent : on n'attend pas plus de 3 secondes
    const delai = setTimeout(() => setPret(true), 3000);
    synchroEnCours ??= synchroniser(session.user.id).catch(() => {}).finally(() => { synchroFaite = true; });
    void synchroEnCours.then(() => { clearTimeout(delai); setPret(true); });
    return () => clearTimeout(delai);
  }, [ready, session]);

  if (!ready || !session || !pret) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "var(--muted)", fontWeight: 600 }}>
        Zenvise…
      </div>
    );
  }
  return <>{children}</>;
}
