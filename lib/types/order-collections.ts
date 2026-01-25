/**
 * Documentation de la collection Firestore pour les commandes
 */

/**
 * Collection: orders
 * 
 * Structure d'un document commande:
 * {
 *   id: string (ID unique de la commande)
 *   restaurantId: string (Référence au restaurant)
 *   tableId: string (Numéro de table)
 *   items: CartItem[] (Liste des articles commandés)
 *   total: number (Montant total en euros)
 *   status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
 *   createdAt: string (Date de création en ISO)
 *   updatedAt: string (Date de mise à jour en ISO)
 * }
 * 
 * Index recommandé:
 * - restaurantId (asc), createdAt (desc)
 * - restaurantId (asc), tableId (asc), createdAt (desc)
 * - status (asc), createdAt (desc)
 * 
 * Règles de sécurité Firestore recommandées:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /orders/{orderId} {
 *       // Les clients peuvent créer des commandes
 *       allow create: if true;
 *       // Les clients peuvent lire leurs propres commandes (par tableId)
 *       allow read: if true; // Ou restreindre par tableId si nécessaire
 *       // Seuls les admins peuvent modifier les commandes
 *       allow update, delete: if request.auth != null;
 *     }
 *   }
 * }
 */

export const ORDER_COLLECTIONS = {
  ORDERS: "orders",
} as const;


