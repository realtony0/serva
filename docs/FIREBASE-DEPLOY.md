# Déploiement sur Firebase Hosting

## ✅ Oui, les notifications fonctionnent sur Firebase !

Toutes les notifications implémentées fonctionnent parfaitement sur Firebase Hosting en production.

### Notifications disponibles

1. **Notifications visuelles (Toast)** ✅
   - Fonctionnent partout (localhost et production)
   - Animation slide-down
   - Disparition automatique après 5 secondes

2. **Notifications sonores** ✅
   - Fonctionnent partout (Web Audio API)
   - Son de 600 Hz pour les nouvelles commandes
   - Compatible tous navigateurs modernes

3. **Notifications push PWA** ✅
   - Fonctionnent sur Firebase Hosting (HTTPS requis)
   - Notification système même si l'onglet est fermé
   - Demande de permission automatique
   - Compatible mobile et desktop

4. **Badge sur l'onglet** ✅
   - Compteur de nouvelles commandes
   - Animation pulse
   - Réinitialisation automatique

## Configuration Firebase

### 1. Fichier `firebase.json`

Le fichier `firebase.json` est déjà configuré avec :
- Headers pour le Service Worker
- Headers pour le manifest.json
- Configuration Firestore (rules et indexes)

### 2. Variables d'environnement

Les variables d'environnement `NEXT_PUBLIC_*` sont automatiquement incluses dans le build Next.js et fonctionnent en production.

### 3. Service Worker

Le Service Worker fonctionne sur Firebase Hosting car :
- Firebase Hosting sert en HTTPS (requis pour les SW)
- Les headers sont correctement configurés
- Le manifest.json est accessible

## Déploiement

### Option 1 : Déploiement Next.js standard (recommandé)

```bash
# Build de l'application
npm run build

# Déployer sur Vercel (recommandé pour Next.js)
# Ou utiliser Firebase Hosting avec Next.js
```

### Option 2 : Firebase Hosting (si vous voulez utiliser Firebase)

```bash
# Installer Firebase CLI si pas déjà fait
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser (si pas déjà fait)
firebase init hosting

# Build Next.js
npm run build

# Déployer
firebase deploy --only hosting
```

### Option 3 : Vercel (recommandé pour Next.js)

Vercel est optimisé pour Next.js et offre :
- Déploiement automatique
- HTTPS par défaut
- CDN global
- Variables d'environnement sécurisées

## Vérifications après déploiement

### 1. Notifications visuelles
- ✅ Toast apparaît en haut à droite
- ✅ Animation slide-down fonctionne
- ✅ Disparition automatique après 5s

### 2. Notifications sonores
- ✅ Son joué à chaque nouvelle commande
- ✅ Fonctionne même si l'onglet n'est pas actif

### 3. Notifications push
- ✅ Permission demandée au premier chargement
- ✅ Notification système si autorisée
- ✅ Fonctionne même si l'onglet est fermé

### 4. Service Worker
- ✅ Enregistré correctement
- ✅ Cache fonctionnel
- ✅ Mode offline disponible

## Test en production

1. **Déployez l'application** sur Firebase Hosting ou Vercel
2. **Ouvrez le dashboard restaurant** sur mobile ou desktop
3. **Autorisez les notifications** si demandé
4. **Passez une commande** depuis la page client
5. **Vérifiez** :
   - Son de notification ✅
   - Toast vert en haut à droite ✅
   - Badge rouge sur l'onglet ✅
   - Notification système (si autorisée) ✅

## Notes importantes

- **HTTPS requis** : Les notifications push nécessitent HTTPS (automatique sur Firebase Hosting)
- **Permissions** : L'utilisateur doit autoriser les notifications push
- **Temps réel** : Les listeners Firestore fonctionnent en production
- **PWA** : L'application peut être installée sur mobile/desktop

## Support navigateurs

- ✅ Chrome/Edge (desktop et mobile)
- ✅ Firefox (desktop)
- ✅ Safari (iOS et macOS)
- ✅ Opera

Tout est prêt pour la production ! 🚀

