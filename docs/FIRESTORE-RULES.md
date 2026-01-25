# Règles de Sécurité Firestore pour SERVA

## Vue d'ensemble

Les règles Firestore définissent qui peut lire et écrire dans chaque collection. Elles sont essentielles pour la sécurité de l'application.

## Structure des Collections

### 1. `restaurants`
- **Lecture** : Publique (tous peuvent voir les restaurants)
- **Écriture** : Admins uniquement (authentifiés)

### 2. `menu_categories`
- **Lecture** : Publique (clients doivent voir les catégories)
- **Écriture** : Admins uniquement

### 3. `menu_types`
- **Lecture** : Publique (clients doivent voir les types)
- **Écriture** : Admins uniquement

### 4. `menu_products`
- **Lecture** : Publique (clients doivent voir les produits)
- **Écriture** : Admins uniquement

### 5. `orders` (Commandes)
- **Lecture** : 
  - Clients : Uniquement leurs commandes (filtrées par restaurantId + tableId)
  - Admins : Toutes les commandes
- **Création** : Tous (clients peuvent créer des commandes)
- **Mise à jour** : Admins uniquement (changer le statut)
- **Suppression** : Admins uniquement

## Sécurité par Table (QR Code)

### Principe
Chaque table a un QR code unique avec `restaurantId` et `tableId`. Les clients scannent ce QR code et accèdent à `/r/[restaurantId]/t/[tableId]`.

### Filtrage des Commandes

#### Côté Client
Les clients utilisent `listenToTableOrders(restaurantId, tableId)` qui filtre automatiquement :
```javascript
where("restaurantId", "==", restaurantId)
where("tableId", "==", tableId)
```

#### Côté Serveur (Règles Firestore)
Les règles Firestore ajoutent une couche de sécurité supplémentaire. Cependant, **Firestore ne peut pas vérifier le `tableId` côté serveur sans contexte utilisateur**.

### Options de Sécurité

#### Option 1: Lecture publique (actuelle)
```javascript
allow read: if resource.data != null;
```
- ✅ Simple à implémenter
- ✅ Fonctionne pour les clients non authentifiés
- ⚠️ Les clients peuvent théoriquement lire toutes les commandes (mais le filtre côté client limite l'accès)

#### Option 2: Authentification requise (plus stricte)
```javascript
allow read: if request.auth != null;
```
- ✅ Plus sécurisé
- ⚠️ Nécessite que les clients soient authentifiés
- ⚠️ Plus complexe à gérer

#### Option 3: Vérification par restaurantId (recommandé pour production)
Si vous voulez une sécurité maximale, vous pouvez :
1. Créer un système d'authentification pour les tables
2. Stocker le `tableId` dans le token d'authentification
3. Vérifier dans les règles :
```javascript
allow read: if request.auth != null 
  && request.auth.token.tableId == resource.data.tableId;
```

## Validation des Données

### Création de Commande
Les règles vérifient que :
- ✅ `restaurantId` et `tableId` sont présents et non vides
- ✅ `items` est un array non vide
- ✅ `total` est un nombre positif
- ✅ `status` initial est "pending"
- ✅ Les timestamps sont présents

### Mise à Jour de Commande
Les règles vérifient que :
- ✅ L'utilisateur est authentifié (admin)
- ✅ `restaurantId` et `tableId` ne peuvent pas être modifiés
- ✅ `updatedAt` est mis à jour

## Déploiement des Règles

### Via Firebase Console
1. Aller dans Firebase Console
2. Firestore Database → Rules
3. Copier le contenu de `firestore.rules`
4. Cliquer sur "Publier"

### Via Firebase CLI
```bash
# Installer Firebase CLI si nécessaire
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser Firebase (si pas déjà fait)
firebase init firestore

# Déployer les règles
firebase deploy --only firestore:rules
```

## Test des Règles

### Dans Firebase Console
1. Firestore Database → Rules
2. Utiliser le "Rules Playground" pour tester les règles
3. Simuler des requêtes de lecture/écriture

### Exemples de Tests

#### Test 1: Client crée une commande
```javascript
// Devrait réussir
create({
  restaurantId: "restaurant_123",
  tableId: "table-5",
  items: [...],
  total: 25.50,
  status: "pending",
  createdAt: "...",
  updatedAt: "..."
})
```

#### Test 2: Client lit une commande d'une autre table
```javascript
// Devrait échouer (si règles strictes)
// Mais avec les règles actuelles, cela fonctionnera
// car le filtre côté client empêche l'accès
```

#### Test 3: Admin met à jour le statut
```javascript
// Devrait réussir (si authentifié)
update({
  status: "ready",
  updatedAt: "..."
})
```

## Bonnes Pratiques

1. **Toujours valider côté client ET serveur**
   - Les règles Firestore sont la dernière ligne de défense
   - Ne jamais faire confiance uniquement au code client

2. **Tester régulièrement les règles**
   - Utiliser le Rules Playground
   - Tester les cas limites

3. **Documenter les changements**
   - Commenter pourquoi chaque règle existe
   - Documenter les cas d'usage

4. **Surveiller les accès**
   - Utiliser Firebase Audit Logs
   - Détecter les tentatives d'accès non autorisées

## Index Requis

Pour que les requêtes fonctionnent correctement, créez ces index dans Firestore :

### Collection: orders
1. `restaurantId` (asc) + `tableId` (asc) + `createdAt` (desc)
2. `restaurantId` (asc) + `createdAt` (desc)
3. `status` (asc) + `createdAt` (desc)

### Collection: menu_types
1. `categoryId` (asc) + `order` (asc)

### Collection: menu_products
1. `categoryId` (asc) + `typeId` (asc) + `order` (asc)
2. `categoryId` (asc) + `order` (asc)
3. `typeId` (asc) + `order` (asc)

Firebase vous proposera automatiquement de créer ces index si nécessaire.

## Notes Importantes

⚠️ **Les règles Firestore ne peuvent pas filtrer les résultats**
- Elles autorisent ou refusent l'accès à un document
- Le filtrage par `tableId` doit être fait côté client avec `where()`

✅ **Les règles ajoutent une couche de sécurité**
- Même si un client essaie d'accéder à une autre table, les règles peuvent bloquer
- La validation des données empêche les commandes invalides

🔒 **Pour une sécurité maximale**
- Considérez l'authentification des tables
- Utilisez des tokens personnalisés Firebase
- Implémentez un système de permissions plus granulaire


