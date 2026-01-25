/**
 * Service pour gérer les utilisateurs des restaurants
 */

import { setDocument, getDocument, getCollection, where } from "@/lib/firestore";
import { RestaurantUser, RestaurantRole } from "@/lib/types/restaurant-user";

const COLLECTION = "restaurant_users";

export async function createRestaurantUser(data: Omit<RestaurantUser, "createdAt">): Promise<void> {
  await setDocument(COLLECTION, data.uid, {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

export async function getRestaurantUser(uid: string): Promise<RestaurantUser | null> {
  return getDocument<RestaurantUser>(COLLECTION, uid);
}

export async function getRestaurantUsers(restaurantId: string): Promise<RestaurantUser[]> {
  return getCollection<RestaurantUser>(
    COLLECTION,
    where("restaurantId", "==", restaurantId)
  );
}
