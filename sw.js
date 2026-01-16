
// Service Worker for Salons Aneri PWA
const CACHE_NAME = 'salons-aneri-v1';

// Install event
self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  // Claim any clients immediately, so the page is controlled by the SW without a reload
  event.waitUntil(clients.claim());
});

// Fetch event - Required for PWA installability
self.addEventListener('fetch', (event) => {
  // Basic pass-through strategy to ensure the app works online without aggressive caching issues.
  // This satisfies the PWA requirement for a fetch handler while ensuring 
  // we don't accidentally break the app with stale cache data.
  event.respondWith(
    fetch(event.request).catch(() => {
      // Optional: Return a custom offline page here if needed in the future
      return caches.match(event.request);
    })
  );
});
