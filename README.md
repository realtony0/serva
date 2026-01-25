# Serva - SaaS Platform

Application SaaS moderne construite avec Next.js, TypeScript et Tailwind CSS.

## 🚀 Technologies

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**
- **Firebase** (Firestore & Authentication)

## 📁 Structure du projet

```
serva/
├── app/              # App Router de Next.js
│   ├── layout.tsx    # Layout racine
│   └── page.tsx      # Page d'accueil
├── components/       # Composants React réutilisables
│   └── ui/          # Composants UI de base
├── lib/             # Utilitaires et helpers
├── services/        # Services API et logique métier
├── styles/         # Fichiers CSS globaux
└── public/         # Fichiers statiques
```

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Configurer Firebase
# 1. Créez un projet Firebase sur https://console.firebase.google.com
# 2. Copiez env.example en .env.local
# 3. Remplissez les variables d'environnement avec vos clés Firebase
cp env.example .env.local

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🔥 Configuration Firebase

Le projet inclut Firebase avec Firestore et Authentication. 

### Fichiers de configuration

- `lib/firebase.ts` - Configuration principale Firebase (sécurisée)
- `lib/firebase-auth.ts` - Helpers pour l'authentification
- `lib/firestore.ts` - Helpers pour Firestore

### Variables d'environnement requises

Copiez `env.example` en `.env.local` et remplissez les valeurs depuis votre console Firebase :

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Important** : Configurez les règles de sécurité Firestore dans la console Firebase pour protéger vos données.

## 📝 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run start` - Lance le serveur de production
- `npm run lint` - Lance ESLint

## 🎨 Configuration

- **TypeScript** : Configuration dans `tsconfig.json`
- **Tailwind CSS** : Configuration dans `tailwind.config.ts`
- **Next.js** : Configuration dans `next.config.js`

## 📦 Dépendances principales

- `next` - Framework React
- `react` & `react-dom` - Bibliothèque React
- `tailwindcss` - Framework CSS
- `typescript` - Typage statique
- `firebase` - Backend as a Service (Firestore & Auth)

## 🔧 Développement

Le projet est structuré pour une application SaaS avec :

- **app/** : Routes et pages de l'application
- **components/** : Composants réutilisables
- **lib/** : Fonctions utilitaires
- **services/** : Services API et logique métier
- **styles/** : Styles globaux et Tailwind

