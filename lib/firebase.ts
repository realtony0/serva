/**
 * Configuration Firebase pour Next.js
 * 
 * Ce fichier initialise Firebase de manière sécurisée en utilisant les variables d'environnement.
 * Les clés API Firebase sont publiques par nature, mais nous utilisons les variables d'environnement
 * pour une meilleure organisation et pour éviter de les commiter dans le code.
 * 
 * IMPORTANT : Les règles de sécurité Firestore et les restrictions d'API doivent être configurées
 * dans la console Firebase pour protéger vos données.
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Configuration Firebase depuis les variables d'environnement
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Debug: Vérifier les variables d'environnement côté client
if (typeof window !== "undefined") {
  console.log("🔍 Configuration Firebase côté client:");
  console.log("API Key:", firebaseConfig.apiKey ? "✅ Présent" : "❌ Manquant");
  console.log("Auth Domain:", firebaseConfig.authDomain || "❌ Manquant");
  console.log("Project ID:", firebaseConfig.projectId || "❌ Manquant");
}

/**
 * Initialise Firebase App de manière singleton
 * Évite les réinitialisations multiples (important pour Next.js avec SSR)
 * Fonctionne côté client et serveur
 */
let app: FirebaseApp | undefined;

if (!getApps().length) {
  // Vérification que toutes les variables d'environnement sont présentes
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId
  ) {
    if (typeof window !== "undefined") {
      // Affiche l'erreur uniquement côté client pour éviter les logs serveur
      console.error(
        "⚠️ Configuration Firebase incomplète. Vérifiez vos variables d'environnement."
      );
    }
  } else {
    app = initializeApp(firebaseConfig);
    if (typeof window !== "undefined") {
      console.log("✅ Firebase initialisé avec succès");
      console.log("Project ID:", firebaseConfig.projectId);
    }
  }
} else {
  // Récupère l'instance existante si elle existe déjà
  app = getApps()[0];
}

/**
 * Instance Firebase Auth
 * Utilisée pour l'authentification des utilisateurs (connexion, inscription, etc.)
 */
export const auth: Auth | null = app ? getAuth(app) : null;

if (typeof window !== "undefined" && auth) {
  console.log("✅ Firebase Auth initialisé");
} else if (typeof window !== "undefined") {
  console.warn("⚠️ Firebase Auth n'est pas initialisé");
}

/**
 * Instance Firestore
 * Base de données NoSQL pour stocker et synchroniser les données
 */
export const db: Firestore | null = app ? getFirestore(app) : null;

/**
 * Instance Firebase App (exportée pour usage avancé si nécessaire)
 */
export const firebaseApp = app;

/**
 * Vérifie si Firebase est correctement initialisé
 * Utile pour les vérifications avant d'utiliser les services
 */
export const isFirebaseInitialized = (): boolean => {
  return app !== undefined && auth !== null && db !== null;
};

// Export par défaut de l'instance app
export default app;

