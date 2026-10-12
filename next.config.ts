import type { NextConfig } from "next";

// Export statique : l'appli est un ensemble de fichiers, hébergeable gratuitement (Vercel, Netlify…).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
