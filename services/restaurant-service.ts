/**
 * Service pour gérer les restaurants dans Firestore
 * 
 * Gère toutes les opérations CRUD sur la collection "restaurants"
 */

import {
  getCollection,
  getDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  where,
  orderBy,
} from "@/lib/firestore";
import { Restaurant, RestaurantFormData } from "@/lib/types/restaurant";
import { getCurrentUser } from "@/lib/firebase-auth";
import { COLLECTIONS } from "@/lib/types/firestore-collections";
import { validateId, validateName, validateUrl, sanitizeString } from "@/lib/validation";

const RESTAURANTS_COLLECTION = COLLECTIONS.RESTAURANTS;

/**
 * Récupère tous les restaurants
 * @returns Liste de tous les restaurants triés par date de création
 */
export async function getAllRestaurants(): Promise<Restaurant[]> {
  const restaurants = await getCollection<Restaurant>(
    RESTAURANTS_COLLECTION,
    orderBy("createdAt", "desc")
  );
  return restaurants;
}

/**
 * Récupère un restaurant par son ID
 * @param id - ID du restaurant
 * @returns Le restaurant ou null s'il n'existe pas
 */
export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  return getDocument<Restaurant>(RESTAURANTS_COLLECTION, id);
}

/**
 * Crée un nouveau restaurant
 * @param data - Données du restaurant
 * @returns L'ID du restaurant créé
 */
export async function createRestaurant(
  data: RestaurantFormData,
  ownerId?: string // ID de l'utilisateur propriétaire (optionnel)
): Promise<string> {
  // Validation des données
  const name = validateName(data.name, "Le nom du restaurant");
  const description = sanitizeString(data.description || "");
  const logoUrl = validateUrl(data.logoUrl, "L'URL du logo");

  const user = getCurrentUser();
  const restaurantId = `restaurant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const restaurant: Restaurant = {
    id: restaurantId,
    name,
    description,
    logoUrl,
    createdAt: now,
    updatedAt: now,
    createdBy: user?.uid || undefined,
    ownerId: ownerId || undefined,
    email: data.ownerEmail || undefined,
  };

  await setDocument(RESTAURANTS_COLLECTION, restaurantId, restaurant);
  return restaurantId;
}

/**
 * Met à jour un restaurant existant
 * @param id - ID du restaurant
 * @param data - Nouvelles données du restaurant
 */
export async function updateRestaurant(
  id: string,
  data: Partial<RestaurantFormData>
): Promise<void> {
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await updateDocument(RESTAURANTS_COLLECTION, id, updateData);
}

/**
 * Supprime un restaurant
 * @param id - ID du restaurant à supprimer
 */
export async function deleteRestaurant(id: string): Promise<void> {
  await deleteDocument(RESTAURANTS_COLLECTION, id);
}

