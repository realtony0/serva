# Modèles 3D des plats

Ce dossier contient les modèles 3D générés à partir des photos des plats.

## Format supporté
- `.glb` (recommandé - format binaire optimisé)
- `.gltf` (format texte avec fichiers séparés)

## Comment générer des modèles 3D

### Option 1 : Meshy.ai (Recommandé - Gratuit)
1. Allez sur https://www.meshy.ai/
2. Créez un compte gratuit
3. Uploadez votre photo de plat
4. Choisissez "Image to 3D"
5. Téléchargez le modèle en format `.glb`
6. Renommez-le selon le format : `plat1.glb`, `plat2.glb`, etc.
7. Placez-le dans ce dossier

### Option 2 : Luma AI (Gratuit)
1. Allez sur https://lumalabs.ai/
2. Créez un compte
3. Uploadez votre photo
4. Téléchargez le modèle `.glb`
5. Placez-le dans ce dossier

### Option 3 : Tripo3D (API)
- Utilisez le script `scripts/generate-3d-model.js` avec une clé API

## Nommage des fichiers
Les modèles doivent être nommés selon les images correspondantes :
- `plat1.glb` → correspond à `/dishes/plat1.jpeg`
- `plat2.glb` → correspond à `/dishes/plat2.jpeg`
- `plat3.glb` → correspond à `/dishes/plat3.jpeg`

## Structure attendue
```
public/models/
  ├── plat1.glb
  ├── plat2.glb
  ├── plat3.glb
  └── README.md
```
