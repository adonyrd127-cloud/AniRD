const CACHE_NAME = "anird-shell-v1";
const SHELL_ASSETS = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (e) =>
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(SHELL_ASSETS)))
);

self.addEventListener("fetch", (e) => {
  // Solo cachear assets estáticos del mismo origen
  if (e.request.url.includes("/api/") || e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
