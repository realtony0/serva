/**
 * Helpers pour Firebase Authentication
 * 
 * Fonctions utilitaires pour gérer l'authentification des utilisateurs
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Connexion avec email et mot de passe
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Promise avec les credentials de l'utilisateur
 */
export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!auth) {
    console.error("Firebase Auth n'est pas initialisé");
    throw new Error("Firebase Auth n'est pas initialisé. Vérifiez la configuration.");
  }
  
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Erreur de connexion Firebase:", error);
    console.error("Code d'erreur:", error.code);
    throw error;
  }
};

/**
 * Inscription d'un nouvel utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Promise avec les credentials de l'utilisateur
 */
export const signUp = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!auth) {
    throw new Error("Firebase Auth n'est pas initialisé");
  }
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Déconnexion de l'utilisateur actuel
 */
export const logout = async (): Promise<void> => {
  if (!auth) {
    throw new Error("Firebase Auth n'est pas initialisé");
  }
  return signOut(auth);
};

/**
 * Écoute les changements d'état d'authentification
 * Utile pour détecter quand un utilisateur se connecte ou se déconnecte
 * @param callback - Fonction appelée à chaque changement d'état
 * @returns Fonction pour désabonner l'écouteur
 */
export const onAuthChange = (
  callback: (user: User | null) => void
): (() => void) => {
  if (!auth) {
    throw new Error("Firebase Auth n'est pas initialisé");
  }
  return onAuthStateChanged(auth, callback);
};

/**
 * Récupère l'utilisateur actuellement connecté
 * @returns L'utilisateur actuel ou null si non connecté
 */
export const getCurrentUser = (): User | null => {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
};

