"use client";
// Page « Dessine-moi la compta » : toutes les écritures d'un épisode, en lecture automatique.
import Link from "next/link";
import { findEpisode } from "@/content/episodes";
import { useParam } from "@/lib/reseau";
import { SchemaCompta } from "./SchemaCompta";

export function DemoSchema() {
  const id = useParam("id");
  const pas = Number(useParam("pas") ?? "") || 2600;
  if (id === null) return null;
  const ep = findEpisode(id);
  if (!ep?.ecritures?.length) return <p>Pas d&apos;écriture pour cet épisode. <Link href="/app">Retour</Link></p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span className="label">Dessine-moi la compta</span>
      <h1 style={{ fontSize: 24 }}>{ep.title}</h1>
      <SchemaCompta ecritures={ep.ecritures} auto pas={pas} />
    </div>
  );
}
