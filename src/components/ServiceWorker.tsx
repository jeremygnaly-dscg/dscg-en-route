"use client";
import { useEffect } from "react";

export function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => { /* hors ligne indisponible, l'appli marche quand même */ });
    }
  }, []);
  return null;
}
