// Copia sin internet de la app (ver gana-tu-cas/src/app-instalable.mjs)
const CACHE = 'convocatorias-v1';
const BASICOS = ['./', 'cursos.html', 'practicas.html', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png'];
// Uno por uno: si falta alguna página, la app se instala igual con las demás
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(BASICOS.map(u => c.add(u).catch(() => {}))))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(l => Promise.all(l.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const clave = new URL(r.url);
  clave.search = '';
  clave.hash = '';
  e.respondWith(fetch(r).then(res => {
    if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(clave.href, copia)); }
    return res;
  }).catch(() => caches.match(clave.href).then(c => c || (r.mode === 'navigate' ? caches.match('./') : Response.error()))));
});
