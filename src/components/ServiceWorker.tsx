"use client";
import { useEffect } from "react";

export function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      // Une nouvelle version du service worker prend la main : on recharge une fois pour repartir à jour
      const avait = !!navigator.serviceWorker.controller;
      let recharge = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (avait && !recharge) { recharge = true; window.location.reload(); }
      });
      navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
        .then((reg) => reg.update())
        .catch(() => { /* hors ligne indisponible, l'appli marche quand même */ });
    }
  }, []);
  return null;
}
