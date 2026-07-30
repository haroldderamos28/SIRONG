self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Sirong', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'Sirong';
  const options = {
    body: data.body || '',
    icon: '/icon-192-v2.png',
    badge: '/icon-192-v2.png',
    data: { url: data.url || '/app.html' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/app.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes('app.html') && 'focus' in client) {
          if ('navigate' in client) {
            return client.navigate(url).then((c) => c && c.focus());
          }
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
