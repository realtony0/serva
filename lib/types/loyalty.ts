/**
 * Types pour la fidélité client
 */

export interface LoyaltyProfile {
  id: string; // Browser fingerprint or email
  restaurantId: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  points: number;
}

export interface LoyaltyReward {
  id: string;
  restaurantId: string;
  name: string;
  pointsRequired: number;
  discountPercent?: number;
  freeProductId?: string;
  isActive: boolean;
}
