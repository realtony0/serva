/**
 * Types pour les avis clients
 */

export interface RestaurantFeedback {
  id: string;
  restaurantId: string;
  orderId?: string;
  rating: number; // 1 à 5
  comment: string;
  customerName?: string;
  createdAt: string;
}
