const CACHE_NAME = 'meds-loading-v10';
const LOADING_PAGE = '/loading.html';

// Install: cache the loading page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(LOADING_PAGE))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name.startsWith('meds-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch: race network vs timeout for navigation requests
self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;

  const url = new URL(event.request.url);

  // Don't intercept auth routes - OAuth callbacks are sensitive
  if (url.pathname.startsWith('/api/auth/')) {
    return;
  }

  console.log('[SW] racing for:', event.request.url);

  // Skip race if loading page confirmed server is awake
  if (url.hash === '#_ready') {
    return; // Let browser handle normally - server is awake
  }

  event.respondWith(
    Promise.race([
      fetch(event.request).then((r) => (r.ok ? r : caches.match(LOADING_PAGE))),
      new Promise((resolve) =>
        setTimeout(() => resolve(caches.match(LOADING_PAGE)), 500)
      ),
    ]).catch(() => caches.match(LOADING_PAGE))
  );
});
