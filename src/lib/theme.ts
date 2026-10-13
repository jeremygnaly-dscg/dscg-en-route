"use client";
import { useEffect, useState } from "react";

export type Theme = "system" | "light" | "dark";
const KEY = "revizen-theme";

// La même clé est lue avant l'affichage par le script de layout.tsx (pas de flash de thème).

export function applyTheme(t: Theme) {
  const el = document.documentElement;
  if (t === "system") delete el.dataset.theme;
  else el.dataset.theme = t;
  try { localStorage.setItem(KEY, t); } catch { /* stockage indisponible */ }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => {
    try {
      const t = localStorage.getItem(KEY);
      if (t === "light" || t === "dark") setTheme(t);
    } catch { /* stockage indisponible */ }
  }, []);
  const change = (t: Theme) => { setTheme(t); applyTheme(t); };
  return [theme, change] as const;
}
