/**
 * Service pour le client
 * 
 * Charge les données du restaurant et du menu
 */

import { getDocument } from "@/lib/firestore";
import { Restaurant } from "@/lib/types/restaurant";
import {
  getAllCategories,
  getAllTypes,
  getAllProducts,
  getTypesByCategory,
} from "@/services/menu-service";
import {
  getCategoriesByRestaurant,
  getTypesByRestaurant,
  getProductsByRestaurant,
  getTypesByCategoryAndRestaurant,
} from "@/services/restaurant-menu-service";
import { Category, MenuType, Product } from "@/lib/types/menu";

/**
 * Charge les données complètes d'un restaurant
 */
export async function getRestaurantData(
  restaurantId: string
): Promise<Restaurant | null> {
  return getDocument<Restaurant>("restaurants", restaurantId);
}

/**
 * Charge toutes les catégories actives d'un restaurant
 */
export async function getActiveCategories(restaurantId?: string): Promise<Category[]> {
  if (restaurantId) {
    const categories = await getCategoriesByRestaurant(restaurantId);
    return categories.filter((cat) => cat.isActive);
  }
  // Fallback pour compatibilité (menu global)
  const categories = await getAllCategories();
  return categories.filter((cat) => cat.isActive);
}

/**
 * Charge tous les types actifs d'un restaurant
 */
export async function getActiveTypes(restaurantId?: string): Promise<MenuType[]> {
  if (restaurantId) {
    const types = await getTypesByRestaurant(restaurantId);
    return types.filter((type) => type.isActive);
  }
  // Fallback pour compatibilité (menu global)
  const types = await getAllTypes();
  return types.filter((type) => type.isActive);
}

/**
 * Charge tous les produits actifs d'un restaurant
 */
export async function getActiveProducts(restaurantId?: string): Promise<Product[]> {
  if (restaurantId) {
    const products = await getProductsByRestaurant(restaurantId);
    return products.filter((product) => product.isActive);
  }
  // Fallback pour compatibilité (menu global)
  const products = await getAllProducts();
  return products.filter((product) => product.isActive);
}

/**
 * Charge les types actifs d'une catégorie d'un restaurant
 */
export async function getActiveTypesByCategory(
  categoryId: string,
  restaurantId?: string
): Promise<MenuType[]> {
  if (restaurantId) {
    const types = await getTypesByCategoryAndRestaurant(restaurantId, categoryId);
    return types.filter((type) => type.isActive);
  }
  // Fallback pour compatibilité (menu global)
  const types = await getTypesByCategory(categoryId);
  return types.filter((type) => type.isActive);
}

