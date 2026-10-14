import type { Metadata } from "next";
import { Connexion } from "@/components/Connexion";

export const metadata: Metadata = { title: "Connexion · Memoson", robots: { index: false, follow: false } };

export default function Page() {
  return <Connexion />;
}
