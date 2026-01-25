# Architecture SERVA - Explication

## Vue d'ensemble

SERVA fonctionne actuellement avec **un seul compte admin** qui gère tous les restaurants.

## 1. Connexion Admin (Dashboard SaaS)

### Qui se connecte ?
- **Vous** (l'administrateur de la plateforme)
- Un seul compte admin pour gérer toute l'application

### Où se connecter ?
- **URL** : http://localhost:3000/login
- **Identifiants** : Email + mot de passe (Firebase Auth)

### Que peut-on faire après connexion ?
- **Dashboard** (`/dashboard`) : Vue d'ensemble
- **Restaurants** (`/dashboard/restaurants`) : Créer/gérer les restaurants
- **Menu** (`/dashboard/menu`) : Gérer les menus (catégories, types, produits)
- **Cuisine** (`/dashboard/kitchen`) : Voir et gérer les commandes
- **Statistiques** (`/dashboard/statistics`) : Voir les stats

## 2. Accès des Restaurants

### Architecture actuelle
**Les restaurants N'ONT PAS de connexion séparée.**

Actuellement :
- Un seul admin gère TOUS les restaurants
- Les restaurants sont créés depuis le dashboard admin
- Chaque restaurant a un `restaurantId` unique

### Comment les restaurants accèdent-ils à leurs données ?

**Option A : Via le Dashboard Admin (actuel)**
- L'admin se connecte
- L'admin gère tous les restaurants depuis `/dashboard/restaurants`
- L'admin gère tous les menus depuis `/dashboard/menu`
- L'admin voit toutes les commandes depuis `/dashboard/kitchen`

**Option B : Système multi-tenant (à implémenter)**
Si vous voulez que chaque restaurant ait son propre espace :
- Créer une page `/restaurant/login`
- Chaque restaurant a son propre compte Firebase
- Filtrer les données par `restaurantId` dans le dashboard restaurant
- Chaque restaurant ne voit que ses propres données

## 3. Accès des Clients (Clients des restaurants)

### Comment accèdent-ils ?
- **Via QR code** : `/r/[restaurantId]/t/[tableId]`
- **Pas de connexion requise**
- Chaque table a un QR code unique

### Exemple
- Restaurant "Le Gourmet" → `restaurantId = "restaurant_123"`
- Table 5 → `tableId = "table-5"`
- QR code → `http://localhost:3000/r/restaurant_123/t/table-5`

## Schéma de l'architecture actuelle

```
┌─────────────────────────────────────────┐
│         ADMIN (Vous)                     │
│  Connexion: /login                       │
│  Dashboard: /dashboard                   │
│  - Gère TOUS les restaurants             │
│  - Gère TOUS les menus                   │
│  - Voit TOUTES les commandes             │
└─────────────────────────────────────────┘
           │
           ├─── Crée/gère ───┐
           │                 │
           ▼                 ▼
    ┌─────────────┐    ┌─────────────┐
    │ Restaurant 1│    │ Restaurant 2│
    │ (restaurant_│    │ (restaurant_│
    │   123)      │    │   456)      │
    └─────────────┘    └─────────────┘
           │                 │
           │ QR codes        │ QR codes
           ▼                 ▼
    ┌─────────────┐    ┌─────────────┐
    │  Clients    │    │  Clients    │
    │  Table 1-10 │    │  Table 1-10 │
    │  (pas de    │    │  (pas de    │
    │  connexion) │    │  connexion) │
    └─────────────┘    └─────────────┘
```

## Options pour les restaurants

### Option 1 : Garder l'architecture actuelle (recommandé pour début)
- ✅ Simple
- ✅ Un seul compte à gérer
- ✅ Parfait si vous gérez quelques restaurants
- ❌ Tous les restaurants partagent le même dashboard

### Option 2 : Ajouter un système de connexion par restaurant
- ✅ Chaque restaurant a son propre espace
- ✅ Isolation des données
- ✅ Plus professionnel pour un SaaS multi-tenant
- ❌ Plus complexe à implémenter

## Recommandation

Pour l'instant, l'architecture actuelle est parfaite si :
- Vous gérez quelques restaurants
- Vous êtes l'admin principal
- Vous voulez une solution simple

Si vous voulez que chaque restaurant ait son propre espace de connexion, je peux créer :
- `/restaurant/login` - Connexion pour les restaurants
- `/restaurant/dashboard` - Dashboard filtré par restaurant
- Système de rôles (admin vs restaurant)

Dites-moi ce que vous préférez !


