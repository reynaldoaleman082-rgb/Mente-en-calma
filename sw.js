// Service Worker para Mente en Calma - PWA
// Versión de caché: incrementa esto al hacer cambios para forzar actualización
const CACHE_NAME = 'mente-en-calma-v5';

// Archivos que se cachean inmediatamente al instalar
const STATIC_ASSETS = [
  './',
  './index.html',
  './404.html',
  './manifest.json',
  './css/estilos.css',
  './js/menu.js',
  './js/diario.js',
  './js/frases.js',
  './js/quiz.js',
  './js/scroll.js',
  './js/tabbar.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/marca/isotipo.svg',
  './assets/marca/imagotipo.svg',
  './assets/marca/isologo.svg',
  './assets/marca/logotipo.svg',
  './assets/favicon.svg',
  './assets/og-image.png',
  './assets/patron-topografico.svg',
  './assets/patron-espirales.svg',
  './assets/patron-burbujas.svg',
  './assets/patron-ondas.svg',
  './assets/patron-puntos.svg'
];

// Instalación: cachear assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando assets estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación: limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Eliminando caché antigua:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Estrategia: Network First para HTML, Cache First para assets estáticos
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar peticiones del mismo origen
  if (url.origin !== location.origin) {
    return;
  }

  // HTML: Network First (siempre intentar red, fallback a caché)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Assets estáticos (CSS, JS, imágenes): Cache First
  if (request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image' ||
      request.destination === 'font' ||
      request.url.includes('.svg') ||
      request.url.includes('.png') ||
      request.url.includes('.css') ||
      request.url.includes('.js')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Manifest y otros: Network First
  event.respondWith(networkFirst(request));
});

// Network First: intenta red, si falla usa caché
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Fallback a index.html para navegación offline
    if (request.mode === 'navigate') {
      return cache.match('./index.html');
    }
    throw error;
  }
}

// Cache First: busca en caché, si no está va a red
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    throw error;
  }
}

// Manejar mensajes del cliente (skipWaiting, etc.)
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});