# 🎬 SERVA - Vidéo de Démonstration avec Remotion

Ce projet inclut une vidéo de démonstration professionnelle créée avec Remotion pour présenter SERVA.

## 🚀 Utilisation

### 1. Lancer le Studio Remotion (pour prévisualiser)

```bash
npm run remotion
```

Cela ouvrira le studio Remotion dans votre navigateur où vous pourrez :
- Prévisualiser la vidéo
- Ajuster les paramètres
- Voir les animations en temps réel

### 2. Générer la vidéo finale

```bash
npm run remotion:render
```

La vidéo sera générée dans `out/video.mp4` (format MP4, 1920x1080, 60 secondes).

### 3. Générer un GIF animé (optionnel)

```bash
npm run remotion:gif
```

Le GIF sera généré dans `out/video.gif`.

## 📹 Structure de la Vidéo

La vidéo de 60 secondes comprend :

1. **Intro (5s)** - Présentation de SERVA avec animations
2. **Features (12s)** - Présentation des 4 fonctionnalités principales
3. **Client Demo (15s)** - Démonstration de l'expérience client (QR code, menu, commande)
4. **Kitchen Demo (12s)** - Dashboard cuisine avec notifications
5. **Stats Demo (10s)** - Statistiques en temps réel avec graphiques animés
6. **Outro (6s)** - Call-to-action final

## 🎨 Personnalisation

Vous pouvez modifier :
- Les couleurs dans chaque scène
- Les textes et descriptions
- Les durées dans `src/remotion/ServaVideo.tsx`
- Les animations dans chaque composant de scène

## 📦 Dépendances

- `@remotion/cli` - CLI Remotion
- `remotion` - Framework Remotion
- `@remotion/lottie` - Support Lottie (optionnel)
- `@remotion/paths` - Support SVG paths (optionnel)

## 🎬 Format de Sortie

- **Résolution** : 1920x1080 (Full HD)
- **FPS** : 30
- **Durée** : 60 secondes
- **Format** : MP4 (H.264)

## 💡 Astuces

- Utilisez le studio Remotion pour tester les changements rapidement
- Les animations utilisent des springs pour un rendu naturel
- Tous les composants sont réactifs et peuvent être modifiés facilement
