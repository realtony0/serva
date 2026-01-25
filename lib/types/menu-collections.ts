/**
 * Documentation des collections Firestore pour le menu
 * 
 * Structure hiérarchique : Catégorie → Type → Produit
 */

/**
 * Collection: menu_categories
 * 
 * Structure d'un document catégorie:
 * {
 *   id: string
 *   name: string (ex: "Plats", "Boissons", "Desserts")
 *   description?: string
 *   order: number (pour l'ordre d'affichage)
 *   isActive: boolean
 *   createdAt: string (ISO)
 *   updatedAt: string (ISO)
 *   createdBy?: string (ID utilisateur)
 * }
 * 
 * Index recommandé:
 * - order (asc), createdAt (desc)
 */

/**
 * Collection: menu_types
 * 
 * Structure d'un document type:
 * {
 *   id: string
 *   name: string (ex: "cocktail", "mocktail", "soda")
 *   categoryId: string (référence à menu_categories)
 *   description?: string
 *   order: number
 *   isActive: boolean
 *   createdAt: string (ISO)
 *   updatedAt: string (ISO)
 *   createdBy?: string (ID utilisateur)
 * }
 * 
 * Index recommandé:
 * - categoryId (asc), order (asc)
 * - order (asc), createdAt (desc)
 */

/**
 * Collection: menu_products
 * 
 * Structure d'un document produit:
 * {
 *   id: string
 *   name: string
 *   description?: string
 *   price: number (en euros)
 *   imageUrl?: string (URL de l'image)
 *   categoryId: string (référence à menu_categories)
 *   typeId: string (référence à menu_types)
 *   isActive: boolean
 *   order: number
 *   createdAt: string (ISO)
 *   updatedAt: string (ISO)
 *   createdBy?: string (ID utilisateur)
 * }
 * 
 * Index recommandé:
 * - categoryId (asc), typeId (asc), order (asc)
 * - categoryId (asc), order (asc)
 * - typeId (asc), order (asc)
 * - order (asc), createdAt (desc)
 */

/**
 * Règles de sécurité Firestore recommandées:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Catégories
 *     match /menu_categories/{categoryId} {
 *       allow read: if true;
 *       allow create, update, delete: if request.auth != null;
 *     }
 *     
 *     // Types
 *     match /menu_types/{typeId} {
 *       allow read: if true;
 *       allow create, update, delete: if request.auth != null;
 *     }
 *     
 *     // Produits
 *     match /menu_products/{productId} {
 *       allow read: if true;
 *       allow create, update, delete: if request.auth != null;
 *     }
 *   }
 * }
 */

export const MENU_COLLECTIONS = {
  CATEGORIES: "menu_categories",
  TYPES: "menu_types",
  PRODUCTS: "menu_products",
} as const;


