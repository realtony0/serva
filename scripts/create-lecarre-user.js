/**
 * Script pour créer un utilisateur pour le restaurant "Le Carré"
 * et le lier au restaurant
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function createLeCarreUser() {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const email = 'lecarre@restaurant.com';
    const password = 'ichyoboy';
    const restaurantId = 'restaurant_lecarre_1767909416291';

    console.log('🚀 Création de l\'utilisateur pour Le Carré...\n');

    // Créer l'utilisateur
    let user;
    try {
      user = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Utilisateur créé avec succès!');
      console.log(`   UID: ${user.user.uid}`);
      console.log(`   Email: ${user.user.email}\n`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  L\'utilisateur existe déjà.');
        console.log('   Récupération de l\'utilisateur existant...\n');
        // On ne peut pas récupérer l'utilisateur directement, mais on peut continuer
        // L'utilisateur devra se connecter manuellement pour obtenir son UID
        console.log('❌ Impossible de récupérer l\'UID automatiquement.');
        console.log('   Veuillez vous connecter manuellement et noter l\'UID,');
        console.log('   puis exécutez: node scripts/link-lecarre-user.js <UID>\n');
        process.exit(1);
      } else {
        throw error;
      }
    }

    const userId = user.user.uid;

    // Vérifier que le restaurant existe
    const restaurantRef = doc(db, 'restaurants', restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
      console.log(`❌ Restaurant ${restaurantId} non trouvé!`);
      process.exit(1);
    }

    // Lier le restaurant à l'utilisateur
    const restaurantData = restaurantSnap.data();
    await setDoc(restaurantRef, {
      ...restaurantData,
      ownerId: userId,
      email: email,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log('✅ Restaurant lié à l\'utilisateur!');
    console.log(`\n📋 Résumé:`);
    console.log(`   Restaurant ID: ${restaurantId}`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Email: ${email}`);
    console.log(`\n🔗 Connexion restaurant:`);
    console.log(`   http://localhost:3000/restaurant/login`);
    console.log(`\n🔗 Dashboard restaurant:`);
    console.log(`   http://localhost:3000/restaurant/dashboard/${restaurantId}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  }
}

createLeCarreUser();


