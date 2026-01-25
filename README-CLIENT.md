# Page Client SERVA

## Vue d'ensemble

La page client permet aux clients de consulter le menu d'un restaurant et de passer des commandes via un QR code unique par table.

## URL Structure

```
/r/[restaurantId]
```

Exemple :
```
/r/restaurant_1234567890_abc123
```

**Note** : Le `tableId` n'est plus dans l'URL. Il est généré automatiquement ou saisi par le client.

## Fonctionnalités

### 1. Chargement des données
- Charge automatiquement les informations du restaurant
- Charge toutes les catégories, types et produits actifs depuis Firestore
- Affiche uniquement les produits actifs (`isActive: true`)

### 2. Filtrage
- Filtrage par catégorie (ex: Plats, Boissons, Desserts)
- Filtrage par type (ex: Cocktail, Mocktail, Soda)
- Les types sont filtrés automatiquement selon la catégorie sélectionnée

### 3. Panier
- Ajout de produits au panier avec quantité
- Modification des quantités directement depuis le panier
- Suppression d'articles
- Calcul automatique du total
- Sauvegarde automatique dans `localStorage` (unique par restaurant/table)

### 4. Commande
- Envoi de la commande vers Firestore
- Chaque commande est associée à un `restaurantId` et `tableId`
- Statut initial : `pending`
- Numéro de commande unique généré

### 5. Interface
- Design mobile-first et responsive
- Panier flottant accessible depuis n'importe où
- Affichage des informations du QR code scanné
- Navigation intuitive

## Génération de QR Codes

**Chaque restaurant a UN seul QR code** qui mène à son menu.

Pour générer le QR code d'un restaurant, utilisez l'URL suivante :

```
https://votre-domaine.com/r/[restaurantId]
```

### Exemple avec un générateur QR

1. Récupérez l'ID du restaurant depuis Firestore
2. Générez le QR code avec l'URL : `https://votre-domaine.com/r/[restaurantId]`
3. Imprimez le QR code et placez-le sur chaque table du restaurant
4. **Un seul QR code par restaurant** (pas besoin d'un QR code par table)

### Code JavaScript pour générer les QR codes

```javascript
// Exemple avec qrcode.js
import QRCode from 'qrcode';

async function generateQRCode(restaurantId, tableId) {
  const url = `https://votre-domaine.com/r/${restaurantId}/t/${tableId}`;
  const qrCodeDataURL = await QRCode.toDataURL(url);
  return qrCodeDataURL;
}
```

## Structure des données

### Panier (localStorage)
```javascript
{
  "cart_restaurantId_tableId": [
    {
      "productId": "product_123",
      "name": "Pizza Margherita",
      "price": 12.50,
      "imageUrl": "https://...",
      "quantity": 2,
      "categoryId": "category_123",
      "typeId": "type_123"
    }
  ]
}
```

### Commande (Firestore)
```javascript
{
  "id": "order_1234567890_abc123",
  "restaurantId": "restaurant_123",
  "tableId": "table-5",
  "items": [...],
  "total": 25.00,
  "status": "pending",
  "createdAt": "2024-01-08T10:30:00.000Z",
  "updatedAt": "2024-01-08T10:30:00.000Z"
}
```

## Sécurité

- Chaque table voit uniquement son propre panier (isolé par `restaurantId` et `tableId`)
- Les commandes sont sauvegardées dans Firestore avec ces identifiants
- Les règles Firestore doivent être configurées pour permettre la création de commandes

## Personnalisation

### Modifier les couleurs
Les couleurs principales sont définies dans les composants avec Tailwind CSS :
- Bleu : `bg-blue-600`, `text-blue-600`
- Vert : `bg-green-600`, `text-green-600`
- Rouge : `bg-red-600`, `text-red-600`

### Ajouter des fonctionnalités
- Notifications en temps réel (Firestore listeners)
- Historique des commandes
- Suivi du statut de la commande
- Paiement en ligne

