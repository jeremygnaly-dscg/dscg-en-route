// Service worker : garde l'appli disponible sans réseau (tunnels du RER).
// Règle : seuls les fichiers dont le nom change à chaque mise en ligne (/_next/static, polices)
// sont servis depuis le cache. Tout le reste passe par le réseau d'abord, le cache ne sert
// qu'hors ligne. Ainsi, une mise à jour du site n'est jamais masquée par une vieille copie.
const CACHE = "revizen-v3";
const CORE = ["/", "/app", "/app/fil", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const immuable = (url) => url.pathname.startsWith("/_next/static/") || /\.(woff2?|ttf)$/.test(url.pathname);

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  // Audio (requêtes partielles) : laissé au navigateur, indispensable pour la lecture sur iPhone
  if (req.headers.has("range") || url.pathname.startsWith("/audio/")) return;

  if (immuable(url)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    })));
    return;
  }

  // Pages et données de navigation : réseau d'abord, copie de secours pour le hors-ligne
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((r) => r || (req.mode === "navigate" ? caches.match("/app") : Response.error()))),
  );
});
