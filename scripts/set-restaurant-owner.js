/**
 * Script pour définir le propriétaire d'un restaurant
 * 
 * Usage: node scripts/set-restaurant-owner.js <restaurantId> <userUid>
 */

const { initializeApp } = require('firebase/app');
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

async function setRestaurantOwner(restaurantId, userUid) {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('🔍 Recherche du restaurant:', restaurantId);
    
    const restaurantRef = doc(db, 'restaurants', restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
      console.error('❌ Restaurant non trouvé:', restaurantId);
      process.exit(1);
    }

    const restaurantData = restaurantSnap.data();
    console.log('✅ Restaurant trouvé:', restaurantData.name);

    // Mettre à jour le restaurant avec l'ownerId
    await updateDoc(restaurantRef, {
      ownerId: userUid,
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ Restaurant associé à l\'utilisateur:', userUid);
    console.log('\n📝 L\'utilisateur peut maintenant:');
    console.log('1. Se connecter sur /restaurant/login');
    console.log('2. Accéder à son dashboard: /restaurant/dashboard/' + restaurantId);
    console.log('3. Voir uniquement les commandes de son restaurant');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Récupérer les arguments
const restaurantId = process.argv[2];
const userUid = process.argv[3];

if (!restaurantId || !userUid) {
  console.log('Usage: node scripts/set-restaurant-owner.js <restaurantId> <userUid>');
  console.log('\nExemple:');
  console.log('node scripts/set-restaurant-owner.js restaurant_1234567890_abc123 svu2uwMsK9NqTSU1bmceEHUUTHq2');
  process.exit(1);
}

setRestaurantOwner(restaurantId, userUid);


