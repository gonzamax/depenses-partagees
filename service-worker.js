// Service Worker pour Dépenses Partagées
// Support des badges et notifications

const CACHE_NAME = 'depenses-v1';
const BADGE_KEY = 'notification-badge-count';

// Installation
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation');
  self.skipWaiting();
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activation');
  event.waitUntil(self.clients.claim());
});

// Écouter les messages de l'app
self.addEventListener('message', async (event) => {
  console.log('📨 Service Worker: Message reçu', event.data);
  
  if (event.data && event.data.type === 'UPDATE_BADGE') {
    const count = event.data.count || 0;
    
    try {
      // Mettre à jour le badge
      if ('setAppBadge' in navigator) {
        if (count > 0) {
          await navigator.setAppBadge(count);
          console.log(`✅ Badge mis à jour: ${count}`);
        } else {
          await navigator.clearAppBadge();
          console.log('✅ Badge effacé');
        }
      } else {
        console.log('⚠️ API Badge non supportée');
      }
      
      // Répondre à l'app
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true, count });
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour badge:', error);
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: false, error: error.message });
      }
    }
  }
});

// Fetch (pas de cache pour le moment, juste passer les requêtes)
self.addEventListener('fetch', (event) => {
  // Laisser passer toutes les requêtes normalement
  event.respondWith(fetch(event.request));
});
