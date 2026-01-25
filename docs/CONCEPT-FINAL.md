# Concept SERVA - Version Finale

## 🎯 Problème résolu

Dans beaucoup de restaurants :
- Les serveurs sont débordés
- Les clients attendent pour commander
- Les erreurs de commande sont fréquentes
- La cuisine reçoit les infos en retard

## ✅ Solution SERVA

SERVA permet au client de commander directement depuis son téléphone, sans serveur, grâce à un **QR code unique par table**.

## 🔄 COMMENT ÇA MARCHE

### 1️⃣ Côté restaurant

1. **Le restaurant crée son compte** sur SERVA (via admin)
2. **Il ajoute son menu** :
   - Catégories (Plats, Boissons, Desserts)
   - Types (Cocktail, Mocktail, Soda, etc.)
   - Produits avec nom, prix, image, description
3. **Il définit le nombre de tables** (ex: 10, 20, 30)
4. **SERVA génère automatiquement un QR code pour chaque table**
5. **Le restaurant imprime les QR codes** et les place sur chaque table

### 2️⃣ Côté client

1. Le client s'assoit à une table
2. Il **scanne le QR code** posé sur la table
3. Une page s'ouvre sur son téléphone :
   - Il voit le menu du restaurant
   - Il choisit ses plats et boissons
   - Il ajoute au panier
   - Il envoie la commande
4. **Aucune inscription, aucune application à télécharger**

### 3️⃣ Côté cuisine

1. Dès que le client commande :
   - La cuisine reçoit la commande **instantanément**
   - La commande affiche :
     - Le numéro de table
     - Les plats et quantités
     - Le total
2. La cuisine met le statut :
   - **"En préparation"**
   - **"Prêt"**

### 4️⃣ Retour client

Le client voit en temps réel :
- ✅ "Commande envoyée"
- 🔄 "En préparation"
- ✅ "Commande prête" (avec notification sonore)

## 🧩 Points clés

- ✅ SERVA n'est **PAS** une app de livraison
- ✅ SERVA n'est **PAS** une app de paiement (pour l'instant)
- ✅ SERVA est un **outil interne pour restaurants**
- ✅ Basé sur **QR code + temps réel**
- ✅ Chaque commande est liée à :
  - Un **restaurant** (`restaurantId`)
  - Une **table** (`tableId` via QR code)

## 📱 Structure des URLs

### Page client (QR code)
```
/r/[restaurantId]/t/[tableId]
```

**Exemple** :
```
/r/restaurant_1234567890_abc123/t/table_restaurant_1234567890_abc123_1
```

- Chaque table a son propre QR code unique
- Le `tableId` est généré automatiquement lors de la création des tables

### Page cuisine
```
/dashboard/kitchen
```

- Filtre par restaurant via un sélecteur
- Affiche toutes les commandes du restaurant sélectionné

## 🗂️ Structure des données

### Restaurant (Firestore)
```typescript
{
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  numberOfTables: number;
  createdAt: string;
  updatedAt: string;
}
```

### Table (Firestore)
```typescript
{
  id: string; // table_restaurantId_1, table_restaurantId_2, etc.
  restaurantId: string;
  tableNumber: number; // 1, 2, 3, etc.
  qrCodeUrl: string; // URL complète pour le QR code
  createdAt: string;
  updatedAt: string;
}
```

### Commande (Firestore)
```typescript
{
  id: string;
  restaurantId: string; // ID du restaurant
  tableId: string; // ID de la table (depuis QR code)
  items: CartItem[];
  total: number;
  status: "pending" | "preparing" | "ready";
  createdAt: string;
  updatedAt: string;
}
```

## 🚀 Workflow complet

### Étape 1 : Création du restaurant
1. Admin se connecte sur `/login`
2. Va dans `/dashboard/restaurants`
3. Crée un nouveau restaurant avec :
   - Nom, description, logo
   - **Nombre de tables** (ex: 10)
4. SERVA génère automatiquement 10 tables avec QR codes

### Étape 2 : Configuration du menu
1. Admin va dans `/dashboard/menu`
2. Ajoute les catégories, types et produits
3. Active les produits à afficher

### Étape 3 : Génération des QR codes
1. Admin va dans `/dashboard/restaurants/[restaurantId]/qrcodes`
2. Voit tous les QR codes générés
3. Télécharge ou imprime les QR codes
4. Place un QR code sur chaque table

### Étape 4 : Client commande
1. Client scanne le QR code de sa table
2. Voit le menu et commande
3. Commande envoyée à Firestore avec `restaurantId` et `tableId`

### Étape 5 : Cuisine reçoit la commande
1. Cuisine va dans `/dashboard/kitchen`
2. Sélectionne le restaurant
3. Voit toutes les commandes en temps réel
4. Change le statut : En attente → En préparation → Prête

### Étape 6 : Client est notifié
1. Client voit "Commande prête" avec notification sonore
2. Peut récupérer sa commande

## 📊 Avantages

1. **Simplicité** : Pas besoin d'app, juste scanner un QR code
2. **Rapidité** : Commandes instantanées, pas d'attente
3. **Précision** : Moins d'erreurs de commande
4. **Temps réel** : Cuisine et client synchronisés
5. **Scalable** : Facile d'ajouter de nouveaux restaurants

## 🔒 Sécurité

- Chaque table voit uniquement son propre panier
- Les commandes sont isolées par `restaurantId` et `tableId`
- Les règles Firestore protègent les données
- Pas de données personnelles stockées côté client


