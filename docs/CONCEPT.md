# Concept SERVA - Explication

## Vue d'ensemble

SERVA est une application de commande en ligne pour restaurants où :
- **Chaque restaurant a UN code QR unique** qui mène à son menu
- Les **clients scannent le QR code** sur leur table et commandent
- La **cuisine du restaurant** voit les commandes en temps réel

## Flux utilisateur

### 1. Restaurant (Admin)
1. L'admin crée un restaurant dans `/dashboard/restaurants`
2. L'admin configure le menu dans `/dashboard/menu`
3. L'admin génère un **QR code unique** pour le restaurant avec l'URL : `/r/[restaurantId]`
4. Le QR code est imprimé et placé sur chaque table du restaurant

### 2. Client
1. Le client **scanne le QR code** sur sa table
2. Il arrive sur la page `/r/[restaurantId]`
3. Un numéro de table est **généré automatiquement** (ou peut être saisi manuellement)
4. Le client consulte le menu, ajoute des produits au panier
5. Le client clique sur **"Commander"**
6. La commande est envoyée à Firestore avec `restaurantId` et `tableId`

### 3. Cuisine
1. La cuisine accède à `/dashboard/kitchen` (connexion admin)
2. La cuisine **sélectionne le restaurant** dans le filtre
3. La cuisine voit **uniquement les commandes de ce restaurant**
4. La cuisine peut changer le statut : En attente → En préparation → Prête
5. Le client reçoit une notification quand sa commande est prête

## Structure des URLs

### Page client
```
/r/[restaurantId]
```
- **Exemple** : `/r/restaurant_1234567890_abc123`
- **Pas de tableId dans l'URL** : Le tableId est généré automatiquement ou saisi par le client

### Page cuisine
```
/dashboard/kitchen
```
- Filtre par restaurant via un sélecteur
- Affiche toutes les commandes du restaurant sélectionné

## Structure des données

### Commande (Firestore)
```typescript
{
  id: string;
  restaurantId: string; // ID du restaurant (depuis QR code)
  tableId: string; // Numéro de table (généré ou saisi)
  items: CartItem[];
  total: number;
  status: "pending" | "preparing" | "ready";
  createdAt: string;
  updatedAt: string;
}
```

### Restaurant (Firestore)
```typescript
{
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
}
```

## Génération des QR codes

### Pour chaque restaurant
1. Récupérez l'ID du restaurant depuis Firestore
2. Générez un QR code avec l'URL : `https://votre-domaine.com/r/[restaurantId]`
3. Imprimez le QR code et placez-le sur chaque table

### Exemple avec qrcode.js
```javascript
import QRCode from 'qrcode';

async function generateRestaurantQRCode(restaurantId) {
  const url = `https://votre-domaine.com/r/${restaurantId}`;
  const qrCodeDataURL = await QRCode.toDataURL(url);
  return qrCodeDataURL;
}
```

## Fonctionnalités

### Page client (`/r/[restaurantId]`)
- ✅ Affichage du menu du restaurant
- ✅ Filtrage par catégorie et type
- ✅ Panier avec gestion des quantités
- ✅ Génération automatique du numéro de table
- ✅ Possibilité de saisir manuellement le numéro de table
- ✅ Notification quand la commande est prête

### Page cuisine (`/dashboard/kitchen`)
- ✅ Sélecteur de restaurant
- ✅ Affichage des commandes en temps réel
- ✅ Filtrage par statut (En attente, En préparation, Prête)
- ✅ Tri par date ou par table
- ✅ Notifications visuelles et sonores pour nouvelles commandes
- ✅ Changement de statut des commandes

## Différences avec l'ancien concept

### ❌ Ancien concept (incorrect)
- URL : `/r/[restaurantId]/t/[tableId]` (tableId dans l'URL)
- Chaque table avait son propre QR code
- Système de connexion restaurant séparé

### ✅ Nouveau concept (correct)
- URL : `/r/[restaurantId]` (pas de tableId dans l'URL)
- **Un seul QR code par restaurant** (placé sur toutes les tables)
- Le tableId est généré automatiquement ou saisi par le client
- La cuisine filtre par restaurant via un sélecteur dans le dashboard admin

## Avantages du nouveau concept

1. **Simplicité** : Un seul QR code à générer et imprimer par restaurant
2. **Flexibilité** : Le client peut saisir son numéro de table ou utiliser celui généré
3. **Gestion centralisée** : La cuisine gère toutes les commandes depuis un seul dashboard
4. **Scalabilité** : Facile d'ajouter de nouveaux restaurants


