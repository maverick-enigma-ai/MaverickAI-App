import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

function Fallback() {
  return (
    <div
      style={{
        color: '#fff',
        padding: 16,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      }}
    >
      Loading application…
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Fallback />}>
      <App />
    </Suspense>
  </StrictMode>
);

// --- Debug-only: clear any old service workers/caches to avoid stale purple screens ---
if (
  import.meta.env.PROD &&
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator
) {
  const idle = (cb: () => void) =>
    ('requestIdleCallback' in window
      ? // @ts-ignore - not in TS lib by default
        window.requestIdleCallback(cb)
      : window.setTimeout(cb, 0));

  idle(() => {
    // Unregister all SWs
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {});

    // Clear caches
    if ('caches' in window) {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .catch(() => {});
    }
  });
}


