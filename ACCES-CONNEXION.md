# 🔐 Accès et Identifiants de Connexion

## 👨‍💼 ADMIN

### Identifiants
- **Email:** `kalskalssow@gmail.com`
- **Mot de passe:** `ichyoboy`

### URLs d'accès
- **Page de connexion:** `http://localhost:3000/login`
- **Dashboard admin:** `http://localhost:3000/dashboard`

### Permissions
- Accès complet à tous les restaurants
- Gestion des menus (tous les restaurants)
- Vue de toutes les commandes
- Statistiques globales
- Gestion des utilisateurs

---

## 🍽️ RESTAURANT (Le Carré)

### Identifiants
- **Email:** `lecarre@restaurant.com`
- **Mot de passe:** `ichyoboy`
- **Restaurant ID:** `restaurant_lecarre_1767909416291`

### URLs d'accès
- **Page de connexion:** `http://localhost:3000/restaurant/login`
- **Dashboard restaurant:** `http://localhost:3000/restaurant/dashboard/restaurant_lecarre_1767909416291`
- **Menu client (table 1):** `http://localhost:3001/r/restaurant_lecarre_1767909416291/t/table_restaurant_lecarre_1767909416291_1`

### Permissions
- Accès uniquement à son restaurant (Le Carré)
- Gestion du menu de son restaurant
- Vue des commandes de son restaurant uniquement
- Statistiques de son restaurant
- Génération de QR codes pour ses tables

---

## 📋 Informations supplémentaires

### Restaurant Le Carré
- **Nom:** Le Carré – Sénégal
- **ID:** `restaurant_lecarre_1767909416291`
- **Menu:** Déjà créé avec catégories, types et produits

### Scripts disponibles
Pour créer/réinitialiser les utilisateurs :
```bash
# Créer l'utilisateur admin
node scripts/create-test-user.js

# Créer l'utilisateur restaurant Le Carré
node scripts/create-lecarre-user.js

# Vérifier un utilisateur
node scripts/verify-user.js
```

### Notes importantes
- Les mots de passe sont identiques pour faciliter les tests
- Pour la production, changez les mots de passe via Firebase Console
- L'utilisateur restaurant doit être lié au restaurant via `ownerId` dans Firestore

---

## 🚀 Démarrage rapide

1. **Lancer le serveur:**
   ```bash
   npm run dev
   ```

2. **Se connecter en admin:**
   - Aller sur `http://localhost:3000/login`
   - Email: `kalskalssow@gmail.com`
   - Mot de passe: `ichyoboy`

3. **Se connecter en restaurant:**
   - Aller sur `http://localhost:3000/restaurant/login`
   - Email: `lecarre@restaurant.com`
   - Mot de passe: `ichyoboy`

---

## 🔒 Sécurité

⚠️ **Ces identifiants sont pour le développement uniquement !**

Pour la production :
1. Changez tous les mots de passe
2. Activez la vérification d'email dans Firebase
3. Configurez les règles Firestore strictes
4. Utilisez des mots de passe forts
