# Authentification Restaurant - Guide

Ce guide explique comment permettre aux restaurants de se connecter et de recevoir les commandes de leurs clients via les QR codes.

## Architecture

### Flux de connexion

1. **Création du restaurant** (par admin)
   - L'admin crée un restaurant dans `/dashboard/restaurants`
   - Optionnellement, il peut ajouter un email de propriétaire

2. **Association restaurant ↔ utilisateur**
   - Un utilisateur Firebase doit être créé pour le restaurant
   - Le restaurant doit être lié à cet utilisateur via `ownerId`

3. **Connexion restaurant**
   - Le restaurant se connecte sur `/restaurant/login`
   - Le système vérifie que l'utilisateur est propriétaire d'un restaurant
   - Redirection vers `/restaurant/dashboard/[restaurantId]`

4. **Réception des commandes**
   - Les commandes sont filtrées par `restaurantId` (depuis le QR code)
   - Le restaurant voit uniquement ses propres commandes
   - Les commandes sont mises à jour en temps réel

## Étapes de configuration

### 1. Créer un utilisateur pour le restaurant

```bash
node scripts/create-test-user.js
```

Ou créez manuellement dans Firebase Console > Authentication > Users.

### 2. Créer un restaurant (via admin)

1. Connectez-vous en tant qu'admin sur `/login`
2. Allez dans `/dashboard/restaurants`
3. Créez un nouveau restaurant
4. Notez l'ID du restaurant créé (visible dans la liste)

### 3. Lier le restaurant à l'utilisateur

**Option A : Via script (recommandé)**

```bash
# Récupérez l'UID de l'utilisateur depuis Firebase Console
# Puis exécutez :
node scripts/set-restaurant-owner.js <restaurantId> <userUid>
```

**Option B : Via Firebase Console**

1. Allez dans Firestore > `restaurants`
2. Trouvez le document du restaurant
3. Ajoutez le champ `ownerId` avec l'UID de l'utilisateur

### 4. Tester la connexion

1. Allez sur `/restaurant/login`
2. Connectez-vous avec l'email/mot de passe de l'utilisateur
3. Vous devriez être redirigé vers le dashboard du restaurant

## Structure des données

### Restaurant (Firestore)

```typescript
{
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  ownerId?: string; // UID de l'utilisateur propriétaire
  email?: string; // Email du propriétaire (pour référence)
  createdAt: string;
  updatedAt: string;
}
```

### Commande (Firestore)

```typescript
{
  id: string;
  restaurantId: string; // ID du restaurant (depuis QR code)
  tableId: string; // ID de la table (depuis QR code)
  items: CartItem[];
  total: number;
  status: "pending" | "preparing" | "ready";
  createdAt: string;
  updatedAt: string;
}
```

## Pages et routes

- `/restaurant/login` - Page de connexion pour les restaurants
- `/restaurant/dashboard/[restaurantId]` - Dashboard du restaurant (commandes filtrées)

## Filtrage des commandes

Les commandes sont automatiquement filtrées par `restaurantId` :

```typescript
// Dans restaurant/dashboard/[restaurantId]/page.tsx
listenToOrders((orders) => {
  const restaurantOrders = orders.filter(
    (order) => order.restaurantId === restaurantId
  );
  setOrders(restaurantOrders);
}, restaurantId);
```

## Scripts disponibles

### `set-restaurant-owner.js`

Lie un restaurant à un utilisateur via son UID.

```bash
node scripts/set-restaurant-owner.js <restaurantId> <userUid>
```

### `link-restaurant-to-user.js`

Lie un restaurant à un utilisateur via son email (met à jour le champ `email`).

```bash
node scripts/link-restaurant-to-user.js <restaurantId> <userEmail>
```

## Sécurité

- Les restaurants ne peuvent voir que leurs propres commandes (filtrées par `restaurantId`)
- L'authentification est gérée par Firebase Auth
- Les routes sont protégées par `ProtectedRoute`
- Les règles Firestore doivent être configurées (voir `firestore.rules`)

## Dépannage

### "Cet utilisateur n'est associé à aucun restaurant"

- Vérifiez que le champ `ownerId` est bien défini dans le document restaurant
- Vérifiez que l'UID correspond bien à l'utilisateur connecté
- Utilisez `set-restaurant-owner.js` pour lier le restaurant

### Les commandes n'apparaissent pas

- Vérifiez que les commandes ont bien le bon `restaurantId`
- Vérifiez que le `restaurantId` dans l'URL correspond au restaurant
- Vérifiez la console pour les erreurs Firestore

### Erreur de connexion

- Vérifiez que l'utilisateur existe dans Firebase Auth
- Vérifiez les variables d'environnement Firebase
- Vérifiez les logs de la console


