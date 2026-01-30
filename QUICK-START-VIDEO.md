# 🎬 Guide Rapide - Générer la Vidéo SERVA

## 🚀 Étapes Rapides

### 1. Lancer le Studio (Prévisualisation)
```bash
npm run remotion
```
Ouvre le studio Remotion dans votre navigateur pour voir la vidéo en temps réel.

### 2. Générer la Vidéo Finale
```bash
npm run remotion:render
```
Génère `out/video.mp4` (1920x1080, 60 secondes, format MP4).

### 3. Générer un GIF (Optionnel)
```bash
npm run remotion:gif
```
Génère `out/video.gif` pour les réseaux sociaux.

## 📹 Contenu de la Vidéo

✅ **Intro** - Présentation animée de SERVA  
✅ **Features** - 4 fonctionnalités principales avec animations  
✅ **Client Demo** - Expérience client complète (QR → Menu → Commande)  
✅ **Kitchen Demo** - Dashboard cuisine avec notifications  
✅ **Stats Demo** - Statistiques animées avec graphiques  
✅ **Outro** - Call-to-action final

## 🎨 Personnalisation

Tous les fichiers sont dans `src/remotion/Scenes/` :
- `Intro.tsx` - Page d'accueil
- `Features.tsx` - Fonctionnalités
- `ClientDemo.tsx` - Démo client
- `KitchenDemo.tsx` - Démo cuisine
- `StatsDemo.tsx` - Statistiques
- `Outro.tsx` - Fin de vidéo

Modifiez les couleurs, textes, durées directement dans ces fichiers !

## ⚡ Astuces

- Le studio Remotion permet de voir les changements en temps réel
- Les animations utilisent des "springs" pour un rendu naturel
- Durée totale : 60 secondes (modifiable dans `config.ts`)

## 🎬 Format de Sortie

- **Résolution** : 1920x1080 (Full HD)
- **FPS** : 30
- **Codec** : H.264
- **Durée** : 60 secondes
