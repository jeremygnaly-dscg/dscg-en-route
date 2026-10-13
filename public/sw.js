// Service worker : garde l'appli et les épisodes déjà ouverts disponibles sans réseau
// (tunnels du RER). Changer CACHE à chaque mise en ligne majeure.
const CACHE = "revizen-v2";
const CORE = ["/", "/app", "/app/fil", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const isPage = req.mode === "navigate";
  // Pages : réseau d'abord, cache si hors ligne. Fichiers (JS, CSS, MP3) : cache d'abord.
  e.respondWith(
    isPage
      ? fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
          .catch(() => caches.match(req).then((r) => r || caches.match("/app")))
      : caches.match(req).then((hit) => hit || fetch(req).then((res) => {
          if (res.ok && !req.headers.has("range")) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        })),
  );
});
