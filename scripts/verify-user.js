/**
 * Script pour vérifier et créer/réinitialiser un utilisateur
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function verifyAndCreateUser() {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const email = 'kalskalssow@gmail.com';
    const password = 'ichyoboy';

    console.log('Tentative de connexion pour vérifier...');
    
    // Essayer de se connecter d'abord
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Connexion réussie!');
      console.log('UID:', userCredential.user.uid);
      console.log('Email:', userCredential.user.email);
      process.exit(0);
    } catch (signInError) {
      console.log('❌ Connexion échouée:', signInError.code);
      
      if (signInError.code === 'auth/user-not-found') {
        console.log('Création de l\'utilisateur...');
        const newUser = await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ Utilisateur créé avec succès!');
        console.log('UID:', newUser.user.uid);
        process.exit(0);
      } else if (signInError.code === 'auth/wrong-password') {
        console.log('❌ Mot de passe incorrect. L\'utilisateur existe mais le mot de passe est différent.');
        console.log('Vous devez réinitialiser le mot de passe depuis Firebase Console.');
        process.exit(1);
      } else if (signInError.code === 'auth/invalid-credential') {
        console.log('❌ Identifiants invalides. Cela peut signifier:');
        console.log('   - L\'utilisateur n\'existe pas');
        console.log('   - Le mot de passe est incorrect');
        console.log('   - L\'email n\'est pas vérifié (si requis)');
        console.log('\nTentative de création...');
        try {
          const newUser = await createUserWithEmailAndPassword(auth, email, password);
          console.log('✅ Utilisateur créé avec succès!');
          console.log('UID:', newUser.user.uid);
          process.exit(0);
        } catch (createError) {
          if (createError.code === 'auth/email-already-in-use') {
            console.log('ℹ️  L\'utilisateur existe déjà. Le mot de passe doit être réinitialisé depuis Firebase Console.');
          } else {
            console.error('❌ Erreur lors de la création:', createError.message);
          }
          process.exit(1);
        }
      } else {
        console.error('❌ Erreur:', signInError.message);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    process.exit(1);
  }
}

verifyAndCreateUser();


