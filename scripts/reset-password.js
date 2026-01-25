/**
 * Script pour réinitialiser le mot de passe d'un utilisateur
 * Note: Ce script nécessite Firebase Admin SDK pour réinitialiser le mot de passe
 * Pour l'instant, utilisez Firebase Console > Authentication > Users > Reset password
 */

const { initializeApp } = require('firebase/app');
const { getAuth, sendPasswordResetEmail } = require('firebase/auth');

require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function sendPasswordReset() {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const email = 'kalskalssow@gmail.com';

    console.log('Envoi de l\'email de réinitialisation...');
    await sendPasswordResetEmail(auth, email);
    
    console.log('✅ Email de réinitialisation envoyé à:', email);
    console.log('Vérifiez votre boîte mail pour réinitialiser le mot de passe.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  }
}

sendPasswordReset();


