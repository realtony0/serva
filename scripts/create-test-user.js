/**
 * Script pour créer un utilisateur de test dans Firebase Auth
 * 
 * Usage: node scripts/create-test-user.js
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

// Charger les variables d'environnement depuis .env.local
require('dotenv').config({ path: '.env.local' });

// Configuration Firebase depuis les variables d'environnement
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function createTestUser() {
  try {
    // Initialiser Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const email = 'kalskalssow@gmail.com';
    const password = 'ichyoboy';

    console.log('Création de l\'utilisateur de test...');
    console.log('Email:', email);

    // Créer l'utilisateur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    console.log('✅ Utilisateur créé avec succès!');
    console.log('UID:', userCredential.user.uid);
    console.log('Email:', userCredential.user.email);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  Cet utilisateur existe déjà dans Firebase.');
    } else if (error.code === 'auth/invalid-email') {
      console.log('❌ Email invalide.');
    } else if (error.code === 'auth/weak-password') {
      console.log('❌ Mot de passe trop faible.');
    }
    
    process.exit(1);
  }
}

createTestUser();

