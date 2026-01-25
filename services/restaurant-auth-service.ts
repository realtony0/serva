/**
 * Service pour l'authentification des restaurants
 * 
 * Permet aux restaurants de se connecter et d'accéder à leurs données
 */

import { getDocument, getCollection, where } from "@/lib/firestore";
import { Restaurant } from "@/lib/types/restaurant";
import { UserProfile } from "@/lib/types/user-role";

const COLLECTIONS = {
  RESTAURANTS: "restaurants",
  USER_PROFILES: "user_profiles",
} as const;

/**
 * Récupère le restaurant associé à un utilisateur
 */
export async function getRestaurantByOwnerId(
  ownerId: string
): Promise<Restaurant | null> {
  const restaurants = await getCollection<Restaurant>(
    COLLECTIONS.RESTAURANTS,
    where("ownerId", "==", ownerId)
  );

  return restaurants.length > 0 ? restaurants[0] : null;
}

/**
 * Récupère le restaurant par son ID
 */
export async function getRestaurantById(
  restaurantId: string
): Promise<Restaurant | null> {
  return getDocument<Restaurant>(COLLECTIONS.RESTAURANTS, restaurantId);
}

/**
 * Récupère le profil utilisateur
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return getDocument<UserProfile>(COLLECTIONS.USER_PROFILES, uid);
}

/**
 * Crée ou met à jour le profil utilisateur
 */
export async function setUserProfile(profile: UserProfile): Promise<void> {
  const { setDocument } = await import("@/lib/firestore");
  await setDocument(COLLECTIONS.USER_PROFILES, profile.uid, profile);
}

/**
 * Vérifie si un utilisateur est propriétaire d'un restaurant
 */
export async function isRestaurantOwner(
  userId: string,
  restaurantId: string
): Promise<boolean> {
  const restaurant = await getRestaurantById(restaurantId);
  return restaurant?.ownerId === userId;
}


