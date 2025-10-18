import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
// run once on app start (e.g., in main.tsx)
if (import.meta.env.PROD && typeof window !== "undefined" && "serviceWorker" in navigator) {
  // run after first paint so we don’t block render
  (window.requestIdleCallback ?? setTimeout)(() => {
    navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
    if ("caches" in window) caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  });
}

