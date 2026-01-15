'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    }

    // Clean up #_ready hash if present
    if (window.location.hash === '#_ready') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  return null;
}
