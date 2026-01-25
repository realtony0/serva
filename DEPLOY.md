# Guide de déploiement SERVA

## ✅ Déjà fait

- ✅ Build de l'application réussi
- ✅ Règles Firestore déployées
- ✅ Index Firestore déployés

## 🚀 Déploiement de l'application

### Option 1 : Vercel (Recommandé pour Next.js)

Vercel est la plateforme recommandée pour Next.js car elle offre un support natif pour Next.js App Router.

1. **Installer Vercel CLI** (si pas déjà installé) :
   ```bash
   npm i -g vercel
   ```

2. **Déployer** :
   ```bash
   vercel
   ```

3. **Déployer en production** :
   ```bash
   vercel --prod
   ```

### Option 2 : Firebase Functions + Hosting

Pour déployer sur Firebase, il faut configurer Firebase Functions pour Next.js.

1. **Installer les dépendances Firebase Functions** :
   ```bash
   npm install firebase-functions firebase-admin
   ```

2. **Créer `functions/package.json`** et configurer Firebase Functions pour Next.js

3. **Déployer** :
   ```bash
   firebase deploy --only functions,hosting
   ```

### Option 3 : Autres plateformes

- **Netlify** : Supporte Next.js avec configuration automatique
- **Railway** : Supporte Next.js avec Docker
- **Render** : Supporte Next.js avec configuration simple

## 📝 Notes

- Les variables d'environnement doivent être configurées sur la plateforme de déploiement
- Les règles Firestore sont déjà déployées sur Firebase
- Les index Firestore sont déjà déployés sur Firebase

## 🔗 Liens utiles

- Console Firebase : https://console.firebase.google.com/project/serva-9e195/overview
- Documentation Next.js : https://nextjs.org/docs/deployment

