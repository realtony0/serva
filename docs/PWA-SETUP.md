# Configuration PWA pour SERVA

## Fichiers créés

✅ **manifest.json** - Configuration de l'application PWA
✅ **sw.js** - Service Worker pour le cache et le mode offline
✅ **offline.html** - Page affichée quand l'utilisateur est hors ligne
✅ **lib/pwa-register.ts** - Script d'enregistrement du Service Worker
✅ **components/pwa/PWARegister.tsx** - Composant React pour l'enregistrement
✅ **components/pwa/InstallPrompt.tsx** - Prompt d'installation

## Icônes requises

Vous devez créer deux icônes et les placer dans le dossier `public/` :

1. **icon-192x192.png** - 192x192 pixels
2. **icon-512x512.png** - 512x512 pixels

### Génération des icônes

#### Option 1: Utiliser un générateur en ligne
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

#### Option 2: Créer manuellement
1. Créez une icône carrée (512x512 minimum)
2. Exportez en PNG avec les tailles suivantes :
   - 192x192 pixels → `public/icon-192x192.png`
   - 512x512 pixels → `public/icon-512x512.png`

#### Option 3: Utiliser ImageMagick (si installé)
```bash
# Convertir une image existante
convert logo.png -resize 192x192 public/icon-192x192.png
convert logo.png -resize 512x512 public/icon-512x512.png
```

## Fonctionnalités PWA

### ✅ Installation sur mobile
- L'application peut être installée sur iOS et Android
- Prompt d'installation automatique (si supporté)
- Icône sur l'écran d'accueil

### ✅ Mode offline
- Service Worker cache les pages principales
- Page offline.html affichée si pas de connexion
- Les requêtes Firebase/Firestore nécessitent une connexion

### ✅ Performance
- Cache des ressources statiques
- Chargement plus rapide après la première visite
- Mise à jour automatique du cache

## Test de l'installation

### Sur Chrome/Edge (Desktop)
1. Ouvrir l'application dans le navigateur
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Ou utiliser le prompt d'installation qui apparaît

### Sur Android (Chrome)
1. Ouvrir l'application dans Chrome
2. Menu (3 points) → "Ajouter à l'écran d'accueil"
3. L'application sera installée comme une app native

### Sur iOS (Safari)
1. Ouvrir l'application dans Safari
2. Partager → "Sur l'écran d'accueil"
3. L'application sera ajoutée à l'écran d'accueil

## Vérification

### Chrome DevTools
1. Ouvrir DevTools (F12)
2. Onglet "Application"
3. Vérifier :
   - Service Workers → doit être "activated"
   - Manifest → doit afficher les informations
   - Cache Storage → doit contenir les caches

### Lighthouse
1. Ouvrir DevTools → Lighthouse
2. Lancer un audit PWA
3. Vérifier que tous les critères sont remplis

## Notes importantes

- Le Service Worker ne cache PAS les requêtes Firebase/Firestore (nécessitent une connexion)
- Les mises à jour de l'app sont détectées automatiquement
- Le cache est nettoyé automatiquement lors des mises à jour
- Le mode offline fonctionne pour les pages statiques uniquement

## Dépannage

### Le Service Worker ne s'enregistre pas
- Vérifier que l'application est servie en HTTPS (ou localhost)
- Vérifier la console pour les erreurs
- Vérifier que `/sw.js` est accessible

### L'icône ne s'affiche pas
- Vérifier que les fichiers icon-192x192.png et icon-512x512.png existent
- Vérifier les chemins dans manifest.json
- Vider le cache du navigateur

### Le prompt d'installation n'apparaît pas
- Vérifier que l'app n'est pas déjà installée
- Vérifier que les critères PWA sont remplis (HTTPS, manifest, service worker)
- Certains navigateurs ne supportent pas le prompt automatique


