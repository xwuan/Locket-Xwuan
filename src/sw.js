import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// Service Worker for Locket Xwuan
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// Precache and cleanup
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// SPA Navigation fallback
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));

// Cache fonts
registerRoute(
  ({ request }) => request.destination === "font",
  new CacheFirst({
    cacheName: "xwuan-fonts-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      }),
    ],
  })
);

// Cache static images
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "xwuan-images-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// Push Notification handler
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const notificationTitle = data.title || "🔔 Thông báo Locket Xwuan";
  const notificationOptions = {
    body: data.body || "Bạn có khoảnh khắc mới!",
    data: { url: data.url || "/" },
    icon: "/android-chrome-192x192.png",
    badge: "/maskable-icon-512x512.png",
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
