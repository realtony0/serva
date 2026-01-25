/**
 * Types TypeScript pour les restaurants
 */

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy?: string; // ID de l'utilisateur qui a créé le restaurant
  ownerId?: string; // ID de l'utilisateur propriétaire du restaurant (pour connexion)
  email?: string; // Email du restaurant (pour connexion)
}

export interface RestaurantFormData {
  name: string;
  description: string;
  logoUrl: string;
  ownerEmail?: string; // Email du propriétaire (optionnel, pour lier le restaurant)
  numberOfTables?: number; // Nombre de tables du restaurant
}

