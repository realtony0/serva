/**
 * Documentation des collections Firestore
 * 
 * Ce fichier documente la structure des collections utilisées dans l'application
 */

/**
 * Collection: restaurants
 * 
 * Structure d'un document restaurant:
 * {
 *   id: string (ID unique du restaurant)
 *   name: string (Nom du restaurant)
 *   description: string (Description du restaurant)
 *   logoUrl: string (URL du logo)
 *   createdAt: string (Date de création en ISO format)
 *   updatedAt: string (Date de mise à jour en ISO format)
 *   createdBy?: string (ID de l'utilisateur qui a créé le restaurant)
 * }
 * 
 * Index recommandé:
 * - createdAt (desc) - Pour trier par date de création
 * 
 * Règles de sécurité Firestore recommandées:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Restaurants: lecture pour tous, écriture pour authentifiés
 *     match /restaurants/{restaurantId} {
 *       allow read: if true;
 *       allow create: if request.auth != null;
 *       allow update: if request.auth != null;
 *       allow delete: if request.auth != null;
 *     }
 *   }
 * }
 */

export const COLLECTIONS = {
  RESTAURANTS: "restaurants",
} as const;


