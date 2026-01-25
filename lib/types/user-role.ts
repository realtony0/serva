/**
 * Types pour les rôles utilisateurs
 */

export type UserRole = "admin" | "restaurant";

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  restaurantId?: string; // Si role = "restaurant", l'ID du restaurant associé
}


