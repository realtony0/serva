/**
 * Types pour les rôles d'utilisateurs par restaurant
 */

export type RestaurantRole = "owner" | "manager" | "kitchen" | "waiter";

export interface RestaurantUser {
  uid: string;
  restaurantId: string;
  role: RestaurantRole;
  email: string;
  name?: string;
  createdAt: string;
}
