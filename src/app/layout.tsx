import type { Metadata, Viewport } from "next";
// Polices hébergées dans l'appli (fonctionnent hors connexion)
import "@fontsource/bricolage-grotesque/latin-500.css";
import "@fontsource/bricolage-grotesque/latin-700.css";
import "@fontsource/bricolage-grotesque/latin-800.css";
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-600.css";
import "@fontsource/source-sans-3/latin-700.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import { ServiceWorker } from "@/components/ServiceWorker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Révizen",
  description: "Révise l'expertise comptable en audio, dans les transports. DSCG d'abord, puis DCG et master CCA.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Révizen", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f17" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Applique le thème choisi (clair/sombre) avant l'affichage, sans flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("revizen-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}` }} />
      </head>
      <body>
        <main>{children}</main>
        <ServiceWorker />
      </body>
    </html>
  );
}
