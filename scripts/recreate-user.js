/**
 * Script pour supprimer et recréer un utilisateur
 * Note: La suppression nécessite Firebase Admin SDK
 * Ce script va essayer de créer l'utilisateur (échouera si existe déjà)
 * puis tester la connexion
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } = require('firebase/auth');

require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function recreateUser() {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const email = 'kalskalssow@gmail.com';
    const password = 'ichyoboy';

    console.log('🔍 Test de connexion...');
    
    // Essayer de se connecter
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Connexion réussie avec les identifiants actuels!');
      console.log('UID:', userCredential.user.uid);
      console.log('Email:', userCredential.user.email);
      console.log('\n📝 Les identifiants sont corrects dans Firebase.');
      console.log('Si la connexion ne fonctionne pas dans l\'app, vérifiez:');
      console.log('1. Que les variables d\'environnement sont bien chargées');
      console.log('2. Que Firebase est bien initialisé côté client');
      console.log('3. La console du navigateur pour les erreurs');
      process.exit(0);
    } catch (signInError) {
      console.log('❌ Connexion échouée:', signInError.code);
      
      if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
        console.log('\n🔄 Création de l\'utilisateur...');
        try {
          const newUser = await createUserWithEmailAndPassword(auth, email, password);
          console.log('✅ Utilisateur créé avec succès!');
          console.log('UID:', newUser.user.uid);
          console.log('Email:', newUser.user.email);
          
          // Tester immédiatement la connexion
          console.log('\n🔍 Test de connexion immédiat...');
          const testLogin = await signInWithEmailAndPassword(auth, email, password);
          console.log('✅ Connexion test réussie!');
          process.exit(0);
        } catch (createError) {
          if (createError.code === 'auth/email-already-in-use') {
            console.log('ℹ️  L\'utilisateur existe déjà mais le mot de passe est incorrect.');
            console.log('💡 Solution: Réinitialisez le mot de passe depuis Firebase Console:');
            console.log('   Firebase Console > Authentication > Users > Reset password');
          } else {
            console.error('❌ Erreur lors de la création:', createError.message);
            console.error('Code:', createError.code);
          }
          process.exit(1);
        }
      } else {
        console.error('❌ Erreur inattendue:', signInError.message);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    process.exit(1);
  }
}

recreateUser();


