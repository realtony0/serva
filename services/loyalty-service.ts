/**
 * Service pour gérer la fidélité client
 */

import { setDocument, getDocument, updateDocument, increment } from "@/lib/firestore";
import { LoyaltyProfile } from "@/lib/types/loyalty";

const COLLECTION = "loyalty_profiles";

export async function getOrCreateLoyaltyProfile(
  restaurantId: string,
  fingerprint: string
): Promise<LoyaltyProfile> {
  const id = `${restaurantId}_${fingerprint}`;
  const profile = await getDocument<LoyaltyProfile>(COLLECTION, id);

  if (profile) return profile;

  const newProfile: LoyaltyProfile = {
    id,
    restaurantId,
    orderCount: 0,
    totalSpent: 0,
    lastOrderAt: new Date().toISOString(),
    points: 0,
  };

  await setDocument(COLLECTION, id, newProfile);
  return newProfile;
}

export async function updateLoyaltyAfterOrder(
  restaurantId: string,
  fingerprint: string,
  amount: number
): Promise<void> {
  const id = `${restaurantId}_${fingerprint}`;
  await updateDocument(COLLECTION, id, {
    orderCount: increment(1),
    totalSpent: increment(amount),
    points: increment(Math.floor(amount / 1000)), // 1 point par 1000 FCFA
    lastOrderAt: new Date().toISOString(),
  });
}
