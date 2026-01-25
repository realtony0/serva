# Flux de Commande SERVA

## Vue d'ensemble

Quand un client clique sur "Commander", une commande est créée dans Firestore avec toutes les données nécessaires.

## Processus de Commande

### 1. Clic sur "Commander"

Le client clique sur le bouton "Commander" dans le panier.

### 2. Validations

Avant d'envoyer la commande, plusieurs validations sont effectuées :

- ✅ Vérification que le panier n'est pas vide
- ✅ Vérification que `restaurantId` est présent (depuis l'URL)
- ✅ Vérification que `tableId` est présent (depuis l'URL)
- ✅ Validation de chaque article du panier :
  - ID produit valide
  - Nom produit valide
  - Prix valide (nombre positif)
  - Quantité valide (nombre positif)
  - Catégorie valide
  - Type valide

### 3. Confirmation

Une boîte de dialogue demande confirmation avec :
- Restaurant ID
- Numéro de table
- Nombre d'articles
- Total de la commande

### 4. Création dans Firestore

Si la confirmation est validée, la commande est créée avec :

```javascript
{
  id: "order_1234567890_abc123",        // ID unique généré
  restaurantId: "restaurant_123",        // Depuis l'URL/QR code
  tableId: "table-5",                    // Depuis l'URL/QR code
  items: [                               // Articles du panier
    {
      productId: "product_123",
      name: "Pizza Margherita",
      price: 12.50,
      imageUrl: "https://...",
      quantity: 2,
      categoryId: "category_123",
      typeId: "type_123"
    }
  ],
  total: 25.00,                          // Total calculé
  status: "pending",                      // Statut initial
  createdAt: "2024-01-08T10:30:00.000Z", // Timestamp ISO
  updatedAt: "2024-01-08T10:30:00.000Z" // Timestamp ISO
}
```

### 5. Message de Succès

Un message de confirmation s'affiche avec :
- ✅ Indication de succès
- 📋 Numéro de commande complet
- 🪑 Numéro de table
- 📦 Nombre d'articles
- 💰 Total de la commande
- Message informatif

### 6. Nettoyage

Après succès :
- Le panier est vidé automatiquement
- Le panier se ferme
- Le localStorage est nettoyé

## Gestion des Erreurs

Si une erreur survient :
- ❌ Message d'erreur détaillé
- Le panier reste intact (non vidé)
- L'utilisateur peut réessayer

## Structure Firestore

### Collection: `orders`

Chaque document contient :
- `id` : ID unique de la commande
- `restaurantId` : Référence au restaurant
- `tableId` : Numéro de table
- `items` : Tableau des articles commandés
- `total` : Montant total (arrondi à 2 décimales)
- `status` : Statut de la commande ("pending" par défaut)
- `createdAt` : Date de création (ISO string)
- `updatedAt` : Date de mise à jour (ISO string)

## Exemple de Commande

```javascript
// URL scannée
/r/restaurant_1234567890_abc123/t/table-5

// Panier
[
  {
    productId: "product_123",
    name: "Pizza Margherita",
    price: 12.50,
    quantity: 2,
    categoryId: "category_123",
    typeId: "type_123"
  },
  {
    productId: "product_456",
    name: "Coca-Cola",
    price: 3.50,
    quantity: 1,
    categoryId: "category_456",
    typeId: "type_456"
  }
]

// Commande créée
{
  id: "order_1704715200000_xyz789",
  restaurantId: "restaurant_1234567890_abc123",
  tableId: "table-5",
  items: [...],
  total: 28.50,
  status: "pending",
  createdAt: "2024-01-08T10:30:00.000Z",
  updatedAt: "2024-01-08T10:30:00.000Z"
}
```

## Sécurité

- ✅ Validation complète des données avant envoi
- ✅ Vérification de l'intégrité des articles
- ✅ Isolation par restaurant et table
- ✅ Gestion des erreurs robuste

## Prochaines Étapes

1. **Notifications en temps réel** : Utiliser Firestore listeners pour notifier le client quand le statut change
2. **Historique des commandes** : Afficher les commandes précédentes de la table
3. **Suivi de statut** : Afficher le statut actuel de la commande (pending → preparing → ready)
4. **Paiement** : Intégrer un système de paiement en ligne


