"use client";
// Diplôme préparé (DSCG ou DCG) : il filtre les UE affichées dans Réviser et le Coach.
import { useEffect, useState } from "react";
import type { Diplome } from "@/content/types";

const CLE = "zenvise-diplome";
const lire = (): Diplome => {
  try { return localStorage.getItem(CLE) === "dcg" ? "dcg" : "dscg"; } catch { return "dscg"; }
};
export function enregistrerDiplome(d: Diplome) {
  try { localStorage.setItem(CLE, d); } catch { /* stockage indisponible */ }
  window.dispatchEvent(new Event("zenvise-diplome"));
}
export function diplomeConnu() {
  try { return localStorage.getItem(CLE) !== null; } catch { return false; }
}

export function useDiplome() {
  const [d, setD] = useState<Diplome>("dscg");
  useEffect(() => {
    setD(lire());
    const maj = () => setD(lire());
    window.addEventListener("zenvise-diplome", maj);
    return () => window.removeEventListener("zenvise-diplome", maj);
  }, []);
  const changer = (n: Diplome) => {
    enregistrerDiplome(n);
    void import("./compte").then(({ supabase }) => supabase.auth.updateUser({ data: { diplome: n } })).catch(() => {});
  };
  return [d, changer] as const;
}
