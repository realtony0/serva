/**
 * Service pour gérer les avis clients
 */

import { setDocument, getCollection, where, orderBy } from "@/lib/firestore";
import { RestaurantFeedback } from "@/lib/types/feedback";
import { validateId, validateRating, sanitizeString, truncate } from "@/lib/validation";

const COLLECTION = "feedbacks";

export async function createFeedback(data: Omit<RestaurantFeedback, "id" | "createdAt">): Promise<string> {
  // Validation des données
  validateId(data.restaurantId, "L'ID du restaurant");
  validateRating(data.rating);
  const comment = data.comment ? truncate(sanitizeString(data.comment), 1000) : "";

  const id = `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const feedback: RestaurantFeedback = {
    ...data,
    comment,
    id,
    createdAt: now,
  };

  await setDocument(COLLECTION, id, feedback);
  return id;
}

export async function getRestaurantFeedbacks(restaurantId: string): Promise<RestaurantFeedback[]> {
  return getCollection<RestaurantFeedback>(
    COLLECTION,
    where("restaurantId", "==", restaurantId),
    orderBy("createdAt", "desc")
  );
}
