/**
 * Types TypeScript pour le système de menu
 * 
 * Structure hiérarchique : Catégorie → Type → Produit
 */

export interface Category {
  id: string;
  name: string;
  nameEn?: string; // Nom en anglais
  description?: string;
  descriptionEn?: string; // Description en anglais
  order: number; // Pour l'ordre d'affichage
  isActive: boolean;
  restaurantId?: string; // ID du restaurant (optionnel pour compatibilité)
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  icon?: string; // Icône emoji pour la catégorie
}

export interface MenuType {
  id: string;
  name: string;
  categoryId: string; // Référence à la catégorie parente
  description?: string;
  order: number;
  isActive: boolean;
  restaurantId?: string; // ID du restaurant (optionnel pour compatibilité)
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string; // Nom en anglais
  description?: string;
  descriptionEn?: string; // Description en anglais
  price: number;
  imageUrl?: string;
  categoryId: string; // Référence à la catégorie
  typeId: string; // Référence au type
  isActive: boolean;
  order: number;
  restaurantId?: string; // ID du restaurant (optionnel pour compatibilité)
  stockStatus?: "in_stock" | "out_of_stock"; // Nouveau: statut du stock
  promoPrice?: number; // Nouveau: prix promotionnel
  isPromoActive?: boolean; // Nouveau: si la promo est active
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  // Options pour les produits (viandes, etc.)
  hasOptions?: boolean; // Si le produit nécessite le choix d'options
  availableSides?: string[]; // IDs des accompagnements disponibles
  availableSauces?: string[]; // IDs des sauces disponibles
  maxSides?: number; // Nombre maximum d'accompagnements (par défaut 3)
  maxSauces?: number; // Nombre maximum de sauces (par défaut 1)
}

// Types pour les formulaires
export interface CategoryFormData {
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface MenuTypeFormData {
  name: string;
  categoryId: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  typeId: string;
  isActive: boolean;
  order: number;
}

