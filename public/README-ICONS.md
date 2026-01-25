# Icônes PWA requises

Pour que l'application PWA fonctionne correctement, vous devez ajouter deux icônes dans ce dossier :

## Fichiers requis

1. **icon-192x192.png** - 192x192 pixels
2. **icon-512x512.png** - 512x512 pixels

## Comment créer les icônes

### Option 1: Générateur en ligne
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

### Option 2: Créer manuellement
1. Créez une icône carrée (512x512 minimum)
2. Exportez en PNG avec les tailles suivantes :
   - 192x192 pixels → `icon-192x192.png`
   - 512x512 pixels → `icon-512x512.png`

### Option 3: ImageMagick
```bash
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 512x512 icon-512x512.png
```

## Spécifications

- Format: PNG
- Taille: 192x192 et 512x512 pixels
- Fond: Transparent ou couleur unie
- Style: Simple et reconnaissable même en petit format

Une fois les icônes ajoutées, l'application PWA sera complètement fonctionnelle !


