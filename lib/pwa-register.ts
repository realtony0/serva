/**
 * Enregistrement du Service Worker pour PWA
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined') {
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker enregistré avec succès:', registration.scope);

          // Vérifier les mises à jour périodiquement
          setInterval(() => {
            registration.update();
          }, 60000); // Toutes les minutes

          // Écouter les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nouvelle version disponible
                  console.log('[PWA] Nouvelle version disponible');
                  // Optionnel: afficher une notification à l'utilisateur
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[PWA] Erreur lors de l\'enregistrement du Service Worker:', error);
        });
    });

    // Gérer l'événement de mise à jour
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}

/**
 * Désinstaller le Service Worker (pour le développement)
 */
export function unregisterServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.unregister();
    })
    .catch((error) => {
      console.error('[PWA] Erreur lors de la désinstallation:', error);
    });
}


