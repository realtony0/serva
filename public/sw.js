/**
 * Service Worker pour SERVA PWA
 * 
 * Gère le cache et permet le fonctionnement offline
 */

const CACHE_NAME = 'serva-v1';
const RUNTIME_CACHE = 'serva-runtime-v1';

// Fichiers à mettre en cache lors de l'installation
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/login',
  '/manifest.json',
  '/offline.html',
];

// Installer le service worker et mettre en cache les fichiers statiques
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des fichiers statiques');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activer le service worker et nettoyer les anciens caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Suppression du cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Intercepter les requêtes réseau
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes vers Firebase/Firestore (doivent être en ligne)
  if (event.request.url.includes('firebase') || 
      event.request.url.includes('firestore') ||
      event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si en cache, retourner la version mise en cache
        if (cachedResponse) {
          return cachedResponse;
        }

        // Sinon, faire la requête réseau
        return fetch(event.request)
          .then((response) => {
            // Ne mettre en cache que les réponses valides
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloner la réponse pour la mettre en cache
            const responseToCache = response.clone();

            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Si offline et page HTML, retourner la page offline
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            // Pour les autres ressources, retourner une réponse vide
            return new Response('Ressource non disponible hors ligne', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Gérer les messages depuis l'application
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


