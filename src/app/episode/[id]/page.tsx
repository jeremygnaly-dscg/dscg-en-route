import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EPISODES, findEpisode } from "@/content/episodes";
import { Player } from "@/components/Player";

export function generateStaticParams() {
  return EPISODES.filter((e) => e.status === "live").map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = findEpisode((await params).id);
  return { title: e ? `${e.title} · DSCG en route` : "DSCG en route" };
}

export default async function EpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const episode = findEpisode((await params).id);
  if (!episode || episode.status !== "live") notFound();
  return <Player episode={episode} />;
}
