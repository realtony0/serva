/**
 * Firebase Analytics (optionnel)
 * 
 * Analytics est uniquement disponible côté client (navigateur)
 * Ne pas utiliser dans les Server Components
 */

"use client";

import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { firebaseApp } from "./firebase";

let analytics: Analytics | null = null;

/**
 * Initialise Firebase Analytics
 * Doit être appelé uniquement côté client
 * @returns Instance Analytics ou null si non supporté
 */
export async function initAnalytics(): Promise<Analytics | null> {
  // Vérifie que nous sommes côté client
  if (typeof window === "undefined") {
    return null;
  }

  // Vérifie que Analytics est supporté
  const supported = await isSupported();
  if (!supported) {
    console.warn("Firebase Analytics n'est pas supporté dans cet environnement");
    return null;
  }

  // Initialise Analytics si pas déjà fait
  if (!analytics && firebaseApp) {
    try {
      analytics = getAnalytics(firebaseApp);
    } catch (error) {
      console.error("Erreur lors de l'initialisation de Firebase Analytics:", error);
      return null;
    }
  }

  return analytics;
}

/**
 * Récupère l'instance Analytics
 * @returns Instance Analytics ou null
 */
export function getAnalyticsInstance(): Analytics | null {
  return analytics;
}


