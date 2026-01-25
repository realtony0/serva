/**
 * Service pour gérer le menu d'un restaurant spécifique
 * 
 * Toutes les opérations sont filtrées par restaurantId
 */

import {
  getCollection,
  getDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  where,
  orderBy,
} from "@/lib/firestore";
import { getCurrentUser } from "@/lib/firebase-auth";
import {
  Category,
  MenuType,
  Product,
  CategoryFormData,
  MenuTypeFormData,
  ProductFormData,
} from "@/lib/types/menu";

const COLLECTIONS = {
  CATEGORIES: "menu_categories",
  TYPES: "menu_types",
  PRODUCTS: "menu_products",
} as const;

// ==================== CATEGORIES ====================

export async function getCategoriesByRestaurant(
  restaurantId: string
): Promise<Category[]> {
  const categories = await getCollection<Category>(
    COLLECTIONS.CATEGORIES,
    where("restaurantId", "==", restaurantId)
  );
  // Trier côté client pour éviter les problèmes d'index
  return categories.sort((a, b) => a.order - b.order);
}

export async function getCategoryByRestaurant(
  restaurantId: string,
  categoryId: string
): Promise<Category | null> {
  const category = await getDocument<Category>(COLLECTIONS.CATEGORIES, categoryId);
  if (category && category.restaurantId === restaurantId) {
    return category;
  }
  return null;
}

export async function createCategoryForRestaurant(
  restaurantId: string,
  data: CategoryFormData
): Promise<string> {
  const user = getCurrentUser();
  const categoryId = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const category: Category = {
    id: categoryId,
    name: data.name,
    description: data.description,
    order: data.order,
    isActive: data.isActive,
    restaurantId,
    createdAt: now,
    updatedAt: now,
    createdBy: user?.uid || undefined,
  };

  await setDocument(COLLECTIONS.CATEGORIES, categoryId, category);
  return categoryId;
}

export async function updateCategoryForRestaurant(
  restaurantId: string,
  id: string,
  data: Partial<CategoryFormData>
): Promise<void> {
  // Vérifier que la catégorie appartient au restaurant
  const category = await getCategoryByRestaurant(restaurantId, id);
  if (!category) {
    throw new Error("Catégorie non trouvée ou n'appartient pas à ce restaurant");
  }

  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await updateDocument(COLLECTIONS.CATEGORIES, id, updateData);
}

export async function deleteCategoryForRestaurant(
  restaurantId: string,
  id: string
): Promise<void> {
  // Vérifier que la catégorie appartient au restaurant
  const category = await getCategoryByRestaurant(restaurantId, id);
  if (!category) {
    throw new Error("Catégorie non trouvée ou n'appartient pas à ce restaurant");
  }

  await deleteDocument(COLLECTIONS.CATEGORIES, id);
}

// ==================== TYPES ====================

export async function getTypesByRestaurant(
  restaurantId: string
): Promise<MenuType[]> {
  const types = await getCollection<MenuType>(
    COLLECTIONS.TYPES,
    where("restaurantId", "==", restaurantId)
  );
  // Trier côté client
  return types.sort((a, b) => a.order - b.order);
}

export async function getTypesByCategoryAndRestaurant(
  restaurantId: string,
  categoryId: string
): Promise<MenuType[]> {
  const types = await getCollection<MenuType>(
    COLLECTIONS.TYPES,
    where("restaurantId", "==", restaurantId),
    where("categoryId", "==", categoryId)
  );
  // Trier côté client
  return types.sort((a, b) => a.order - b.order);
}

export async function createTypeForRestaurant(
  restaurantId: string,
  data: MenuTypeFormData
): Promise<string> {
  const user = getCurrentUser();
  const typeId = `type_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const menuType: MenuType = {
    id: typeId,
    name: data.name,
    categoryId: data.categoryId,
    description: data.description,
    order: data.order,
    isActive: data.isActive,
    restaurantId,
    createdAt: now,
    updatedAt: now,
    createdBy: user?.uid || undefined,
  };

  await setDocument(COLLECTIONS.TYPES, typeId, menuType);
  return typeId;
}

export async function updateTypeForRestaurant(
  restaurantId: string,
  id: string,
  data: Partial<MenuTypeFormData>
): Promise<void> {
  const type = await getDocument<MenuType>(COLLECTIONS.TYPES, id);
  if (!type || type.restaurantId !== restaurantId) {
    throw new Error("Type non trouvé ou n'appartient pas à ce restaurant");
  }

  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await updateDocument(COLLECTIONS.TYPES, id, updateData);
}

export async function deleteTypeForRestaurant(
  restaurantId: string,
  id: string
): Promise<void> {
  const type = await getDocument<MenuType>(COLLECTIONS.TYPES, id);
  if (!type || type.restaurantId !== restaurantId) {
    throw new Error("Type non trouvé ou n'appartient pas à ce restaurant");
  }

  await deleteDocument(COLLECTIONS.TYPES, id);
}

// ==================== PRODUCTS ====================

export async function getProductsByRestaurant(
  restaurantId: string
): Promise<Product[]> {
  return getCollection<Product>(
    COLLECTIONS.PRODUCTS,
    where("restaurantId", "==", restaurantId),
    orderBy("createdAt", "desc")
  );
}

export async function getProductsByCategoryAndRestaurant(
  restaurantId: string,
  categoryId: string
): Promise<Product[]> {
  return getCollection<Product>(
    COLLECTIONS.PRODUCTS,
    where("restaurantId", "==", restaurantId),
    where("categoryId", "==", categoryId)
  );
}

export async function getProductsByCategoryTypeAndRestaurant(
  restaurantId: string,
  categoryId: string,
  typeId: string
): Promise<Product[]> {
  return getCollection<Product>(
    COLLECTIONS.PRODUCTS,
    where("restaurantId", "==", restaurantId),
    where("categoryId", "==", categoryId),
    where("typeId", "==", typeId)
  );
}

export async function createProductForRestaurant(
  restaurantId: string,
  data: ProductFormData
): Promise<string> {
  const user = getCurrentUser();
  const productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const product: Product = {
    id: productId,
    name: data.name,
    description: data.description,
    price: data.price,
    imageUrl: data.imageUrl,
    categoryId: data.categoryId,
    typeId: data.typeId,
    isActive: data.isActive,
    order: data.order,
    restaurantId,
    createdAt: now,
    updatedAt: now,
    createdBy: user?.uid || undefined,
  };

  await setDocument(COLLECTIONS.PRODUCTS, productId, product);
  return productId;
}

export async function updateProductForRestaurant(
  restaurantId: string,
  id: string,
  data: Partial<ProductFormData>
): Promise<void> {
  const product = await getDocument<Product>(COLLECTIONS.PRODUCTS, id);
  if (!product || product.restaurantId !== restaurantId) {
    throw new Error("Produit non trouvé ou n'appartient pas à ce restaurant");
  }

  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await updateDocument(COLLECTIONS.PRODUCTS, id, updateData);
}

export async function deleteProductForRestaurant(
  restaurantId: string,
  id: string
): Promise<void> {
  const product = await getDocument<Product>(COLLECTIONS.PRODUCTS, id);
  if (!product || product.restaurantId !== restaurantId) {
    throw new Error("Produit non trouvé ou n'appartient pas à ce restaurant");
  }

  await updateDocument(COLLECTIONS.PRODUCTS, id, { isActive: false });
}

