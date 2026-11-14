// service-worker.js — gerado pelo Mini SK em 14/11/2026, 07:13:22
// Não precisa mexer: ele guarda sozinho o que o app usa.
const PREFIXO = 'sk-codigos-ai-code-studio-2-modul-';
const CACHE = PREFIXO + 'mwg8zmnv';
// Lista feita automaticamente (para funcionar sem internet logo após instalar)
const GUARDAR = [
  "./",
  "./ai-code-studio-2-modular/css/01-estilo.css",
  "./ai-code-studio-2-modular/css/02-estilo.css",
  "./ai-code-studio-2-modular/favicon.ico",
  "./ai-code-studio-2-modular/icons/apple-touch-icon.png",
  "./ai-code-studio-2-modular/icons/icon-16.png",
  "./ai-code-studio-2-modular/icons/icon-32.png",
  "./ai-code-studio-2-modular/icons/icon-48.png",
  "./ai-code-studio-2-modular/icons/icon-72.png",
  "./ai-code-studio-2-modular/icons/icon-96.png",
  "./ai-code-studio-2-modular/icons/icon-128.png",
  "./ai-code-studio-2-modular/icons/icon-144.png",
  "./ai-code-studio-2-modular/icons/icon-152.png",
  "./ai-code-studio-2-modular/icons/icon-180.png",
  "./ai-code-studio-2-modular/icons/icon-192.png",
  "./ai-code-studio-2-modular/icons/icon-384.png",
  "./ai-code-studio-2-modular/icons/icon-512.png",
  "./ai-code-studio-2-modular/icons/icon.svg",
  "./ai-code-studio-2-modular/icons/maskable-192.png",
  "./ai-code-studio-2-modular/icons/maskable-512.png",
  "./ai-code-studio-2-modular/icons/maskable.svg",
  "./ai-code-studio-2-modular/index.html",
  "./ai-code-studio-2-modular/js/01-utilitarios.js",
  "./ai-code-studio-2-modular/js/02-renderizacao-de-mensagens-mark.js",
  "./ai-code-studio-2-modular/js/03-editor-de-codigo-previa-ao-viv.js",
  "./ai-code-studio-2-modular/js/04-inicializacao.js",
  "./ai-code-studio-2-modular/js/05-utilitarios.js",
  "./ai-code-studio-2-modular/js/06-provedores-de-ia.js",
  "./ai-code-studio-2-modular/js/07-estado.js",
  "./ai-code-studio-2-modular/js/08-armazenamento.js",
  "./ai-code-studio-2-modular/js/09-selecao-de-provedor-modelo.js",
  "./ai-code-studio-2-modular/js/10-chamadas-de-ia.js",
  "./ai-code-studio-2-modular/js/11-contexto-a-ia-nao-caducar.js",
  "./ai-code-studio-2-modular/js/12-cerebro-memoria.js",
  "./ai-code-studio-2-modular/js/13-renderizacao-de-mensagens-mark.js",
  "./ai-code-studio-2-modular/js/14-chat.js",
  "./ai-code-studio-2-modular/js/15-editor-de-codigo-previa-ao-viv.js",
  "./ai-code-studio-2-modular/js/16-voz-tts-neural-ditado-modo-con.js",
  "./ai-code-studio-2-modular/js/17-configuracoes.js",
  "./ai-code-studio-2-modular/js/18-ui.js",
  "./ai-code-studio-2-modular/js/19-inicializacao.js",
  "./ai-code-studio-2-modular/manifest.json",
  "./ai-code-studio-2-modular/PLANO.md",
  "./ai-code-studio-2-modular/service-worker.js",
  "./favicon.ico",
  "./icons/apple-touch-icon.png",
  "./icons/icon-16.png",
  "./icons/icon-32.png",
  "./icons/icon-48.png",
  "./icons/icon-72.png",
  "./icons/icon-96.png",
  "./icons/icon-128.png",
  "./icons/icon-144.png",
  "./icons/icon-152.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-384.png",
  "./icons/icon-512.png",
  "./icons/icon.svg",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./icons/maskable.svg",
  "./index.html",
  "./manifest.json",
  "./PLANO.md"
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(GUARDAR.map((u) => c.add(u).catch(() => null)))));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k.startsWith(PREFIXO) && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Primeiro a internet (sempre a versão nova); sem internet, a cópia guardada.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
      // Igual ao Workbox da Replit: página que não existe (rota do app) abre o index
      if (res.status === 404 && req.mode === 'navigate') return caches.match('./').then((r) => r || fetch('./'));
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || (req.mode === 'navigate' ? caches.match('./') : undefined)))
  );
});
