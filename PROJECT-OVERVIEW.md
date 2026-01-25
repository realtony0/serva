# SERVA - Vue d'ensemble du projet

## 🎯 Objectif
Plateforme SaaS de commande en ligne pour restaurants avec système de QR codes, gestion en temps réel et statistiques.

## 🏗️ Architecture

### Stack Technique
- **Next.js 14** (App Router) - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Firebase** - Backend (Firestore + Auth)
- **PWA** - Application Progressive Web App

### Structure des dossiers
```
serva/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Dashboard admin
│   ├── restaurant/        # Dashboard restaurant
│   ├── r/                 # Pages client (QR codes)
│   └── login/             # Pages de connexion
├── components/            # Composants React réutilisables
│   ├── auth/             # Composants d'authentification
│   ├── client/           # Composants client
│   ├── pwa/              # Composants PWA
│   └── ui/               # Composants UI de base
├── lib/                   # Utilitaires et helpers
│   ├── firebase.ts       # Configuration Firebase
│   ├── auth-context.tsx  # Context d'authentification
│   └── types/            # Types TypeScript
├── services/             # Services API et logique métier
│   ├── menu-service.ts
│   ├── order-service.ts
│   ├── restaurant-service.ts
│   └── statistics-service.ts
├── styles/               # Fichiers CSS globaux
└── public/               # Fichiers statiques
```

## 🔐 Système d'authentification

### Deux types d'utilisateurs
1. **Admin** (`/login`)
   - Gère tous les restaurants
   - Accès complet à toutes les fonctionnalités
   - Dashboard: `/dashboard`

2. **Restaurant** (`/restaurant/login`)
   - Accès limité à son propre restaurant
   - Dashboard: `/restaurant/dashboard/[restaurantId]`

## 📱 Flux utilisateur

### 1. Admin
```
Login → Dashboard → 
  ├─ Restaurants (CRUD)
  ├─ Menu (Gestion globale ou par restaurant)
  ├─ Cuisine (Voir toutes les commandes)
  └─ Statistiques (Globales ou par restaurant)
```

### 2. Restaurant
```
Login → Dashboard Restaurant →
  ├─ Commandes (Temps réel, notifications)
  ├─ QR Codes (Génération et téléchargement)
  ├─ Statistiques (Pour ce restaurant)
  └─ Menu (Gestion du menu du restaurant)
```

### 3. Client
```
Scan QR Code → Page Menu →
  ├─ Parcourir le menu
  ├─ Ajouter au panier
  ├─ Commander
  └─ Suivre le statut (Temps réel)
```

## 🗄️ Structure Firestore

### Collections principales
- `restaurants` - Informations des restaurants
- `tables` - Tables avec QR codes
- `menu_categories` - Catégories de menu
- `menu_types` - Types de menu
- `menu_products` - Produits
- `orders` - Commandes

### Sécurité
- Règles Firestore configurées
- Filtrage par `restaurantId` et `tableId`
- Clients: lecture menu + création commandes uniquement
- Admin/Restaurant: accès complet à leurs données

## 🎨 Styling

### Tailwind CSS
- Configuration dans `tailwind.config.ts`
- Styles globaux dans `styles/globals.css`
- Animations personnalisées (slide-down, fade-in, bounce-slow)
- Design mobile-first

### Composants UI
- `Button` - Bouton réutilisable avec variants
- Composants client avec gradients et animations
- Interface moderne et intuitive

## 🚀 Déploiement

### Build
```bash
npm run build
```

### Développement
```bash
npm run dev
```

### Variables d'environnement
Fichier `.env.local` requis avec les clés Firebase:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 📋 Fonctionnalités principales

### ✅ Implémentées
- Authentification (Admin + Restaurant)
- Gestion des restaurants
- Gestion des menus (catégories, types, produits)
- QR codes par table
- Commandes en temps réel
- Notifications (visuelles + sonores + push)
- Statistiques
- PWA
- Options produits (accompagnements, sauces)
- Filtrage par restaurant dans admin

### 🔄 Améliorations possibles
- Mode sombre
- Export PDF des statistiques
- Historique des commandes
- Gestion des paiements
- Multi-langue

## 🐛 Problèmes connus et solutions

### Problème: Pages ressemblent à du HTML brut
**Solution**: 
- Nettoyer le cache: `rm -rf .next`
- Rebuild: `npm run build`
- Vérifier que `styles/globals.css` est importé dans `app/layout.tsx`

### Problème: Tailwind ne s'applique pas
**Solution**:
- Vérifier `tailwind.config.ts` (content paths)
- Vérifier `postcss.config.js`
- Redémarrer le serveur de dev

## 📝 Notes pour le développeur

1. **Toujours utiliser TypeScript** - Types stricts activés
2. **Mobile-first** - Tous les composants doivent être responsive
3. **Temps réel** - Utiliser les listeners Firestore pour les mises à jour
4. **Sécurité** - Toujours vérifier les permissions dans les services
5. **Performance** - Utiliser `useMemo` et `useCallback` quand nécessaire
6. **Accessibilité** - Ajouter `aria-label` et gérer le focus clavier

## 🔗 Liens utiles

- Console Firebase: https://console.firebase.google.com/project/serva-9e195
- Documentation Next.js: https://nextjs.org/docs
- Documentation Tailwind: https://tailwindcss.com/docs
- Documentation Firebase: https://firebase.google.com/docs
