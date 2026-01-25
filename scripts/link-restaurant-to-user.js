/**
 * Script pour lier un restaurant à un utilisateur
 * 
 * Usage: node scripts/link-restaurant-to-user.js <restaurantId> <userEmail>
 * 
 * Ce script permet d'associer un restaurant existant à un utilisateur Firebase
 * pour que l'utilisateur puisse se connecter et voir les commandes de son restaurant
 */

const { initializeApp } = require('firebase/app');
const { getAuth, getUserByEmail } = require('firebase/auth');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');

require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function linkRestaurantToUser(restaurantId, userEmail) {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    console.log('🔍 Recherche de l\'utilisateur:', userEmail);
    
    // Note: Firebase Admin SDK serait nécessaire pour rechercher par email
    // Pour l'instant, on va juste mettre à jour le restaurant avec l'email
    // L'utilisateur devra se connecter avec cet email
    
    const restaurantRef = doc(db, 'restaurants', restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
      console.error('❌ Restaurant non trouvé:', restaurantId);
      process.exit(1);
    }

    const restaurantData = restaurantSnap.data();
    console.log('✅ Restaurant trouvé:', restaurantData.name);

    // Mettre à jour le restaurant avec l'email
    await updateDoc(restaurantRef, {
      email: userEmail,
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ Restaurant mis à jour avec l\'email:', userEmail);
    console.log('\n📝 Instructions:');
    console.log('1. L\'utilisateur doit se connecter avec:', userEmail);
    console.log('2. Après connexion, le restaurant sera automatiquement associé');
    console.log('3. Ou utilisez le script set-restaurant-owner.js avec l\'UID de l\'utilisateur');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Récupérer les arguments
const restaurantId = process.argv[2];
const userEmail = process.argv[3];

if (!restaurantId || !userEmail) {
  console.log('Usage: node scripts/link-restaurant-to-user.js <restaurantId> <userEmail>');
  console.log('\nExemple:');
  console.log('node scripts/link-restaurant-to-user.js restaurant_1234567890_abc123 kalskalssow@gmail.com');
  process.exit(1);
}

linkRestaurantToUser(restaurantId, userEmail);


