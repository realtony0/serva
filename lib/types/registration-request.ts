/**
 * Types pour les demandes d'inscription restaurant
 */

export type RegistrationStatus = "pending" | "approved" | "rejected";

export interface RegistrationRequest {
  id: string;
  /** Nom du restaurant */
  restaurantName: string;
  /** Description du restaurant */
  description: string;
  /** Ville / quartier */
  city: string;
  /** Nom complet du propriétaire */
  ownerName: string;
  /** Email de contact */
  email: string;
  /** Numéro de téléphone */
  phone: string;
  /** Nombre de tables estimé */
  estimatedTables: number;
  /** Message optionnel */
  message: string;
  /** Statut de la demande */
  status: RegistrationStatus;
  /** Date de création */
  createdAt: string;
  /** Date de mise à jour */
  updatedAt: string;
  /** Note admin (interne) */
  adminNote?: string;
}

export interface RegistrationFormData {
  restaurantName: string;
  description: string;
  city: string;
  ownerName: string;
  email: string;
  phone: string;
  estimatedTables: number;
  message: string;
}
