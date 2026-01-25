/**
 * Service pour gérer le menu dans Firestore
 * 
 * Gère les catégories, types et produits
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
import {
  Category,
  MenuType,
  Product,
  CategoryFormData,
  MenuTypeFormData,
  ProductFormData,
} from "@/lib/types/menu";
import { getCurrentUser } from "@/lib/firebase-auth";

const COLLECTIONS = {
  CATEGORIES: "menu_categories",
  TYPES: "menu_types",
  PRODUCTS: "menu_products",
} as const;

// ==================== CATEGORIES ====================

export async function getAllCategories(): Promise<Category[]> {
  const categories = await getCollection<Category>(
    COLLECTIONS.CATEGORIES,
    orderBy("order", "asc")
  );
  return categories;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return getDocument<Category>(COLLECTIONS.CATEGORIES, id);
}

export async function createCategory(
  data: CategoryFormData & { restaurantId?: string }
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
    restaurantId: data.restaurantId,
    createdAt: now,
    updatedAt: now,
    createdBy: user?.uid || undefined,
  };

  await setDocument(COLLECTIONS.CATEGORIES, categoryId, category);
  return categoryId;
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>
): Promise<void> {
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await updateDocument(COLLECTIONS.CATEGORIES, id, updateData);
}

export async function deleteCategory(id: string): Promise<void> {
  // Vérifier s'il y a des types associés
  const types = await getTypesByCategory(id);
  if (types.length > 0) {
    throw new Error(
      "Impossible de supprimer cette catégorie car elle contient des types"
    );
  }
  await deleteDocument(COLLECTIONS.CATEGORIES, id);
}

// ==================== TYPES ====================

export async function getAllTypes(): Promise<MenuType[]> {
  return getCollection<MenuType>(
    COLLECTIONS.TYPES,
    orderBy("order", "asc")
  );
}

export async function getTypesByCategory(categoryId: string): Promise<MenuType[]> {
  return getCollection<MenuType>(
    COLLECTIONS.TYPES,
    where("categoryId", "==", categoryId)
  );
}

export async function getTypeById(id: string): Promise<MenuType | null> {
  return getDocument<MenuType>(COLLECTIONS.TYPES, id);
}

export async function createType(data: MenuTypeFormData): Promise<string> {
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
    restaurantId: (data as any).restaurantId,
    createdAt: now,
    updatedAt: now,
    createdBy: user?.uid || undefined,
  };

  await setDocument(COLLECTIONS.TYPES, typeId, menuType);
  return typeId;
}

export async function updateType(
  id: string,
  data: Partial<MenuTypeFormData & { restaurantId?: string }>
): Promise<void> {
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await updateDocument(COLLECTIONS.TYPES, id, updateData);
}

export async function deleteType(id: string): Promise<void> {
  // Vérifier s'il y a des produits associés
  const products = await getProductsByType(id);
  if (products.length > 0) {
    throw new Error(
      "Impossible de supprimer ce type car il contient des produits"
    );
  }
  await deleteDocument(COLLECTIONS.TYPES, id);
}

// ==================== PRODUCTS ====================

export async function getAllProducts(): Promise<Product[]> {
  return getCollection<Product>(
    COLLECTIONS.PRODUCTS,
    orderBy("createdAt", "desc")
  );
}

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  return getCollection<Product>(
    COLLECTIONS.PRODUCTS,
    where("categoryId", "==", categoryId)
  );
}

export async function getProductsByType(typeId: string): Promise<Product[]> {
  return getCollection<Product>(
    COLLECTIONS.PRODUCTS,
    where("typeId", "==", typeId)
  );
}

export async function getProductsByCategoryAndType(
  categoryId: string,
  typeId: string
): Promise<Product[]> {
  return getCollection<Product>(
    COLLECTIONS.PRODUCTS,
    where("categoryId", "==", categoryId),
    where("typeId", "==", typeId)
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  return getDocument<Product>(COLLECTIONS.PRODUCTS, id);
}

export async function createProduct(data: ProductFormData): Promise<string> {
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
    restaurantId: (data as any).restaurantId,
    stockStatus: "in_stock",
    createdAt: now,
    updatedAt: now,
    createdBy: user?.uid || undefined,
    // Options pour produits (viandes, etc.)
    hasOptions: (data as any).hasOptions,
    availableSides: (data as any).availableSides,
    availableSauces: (data as any).availableSauces,
    maxSides: (data as any).maxSides,
    maxSauces: (data as any).maxSauces,
  };

  await setDocument(COLLECTIONS.PRODUCTS, productId, product);
  return productId;
}

export async function updateProduct(
  id: string,
  data: Partial<ProductFormData & { restaurantId?: string; stockStatus?: "in_stock" | "out_of_stock" }>
): Promise<void> {
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await updateDocument(COLLECTIONS.PRODUCTS, id, updateData);
}

/**
 * Mettre à jour le statut du stock d'un produit
 */
export async function updateProductStock(
  id: string,
  status: "in_stock" | "out_of_stock"
): Promise<void> {
  await updateDocument(COLLECTIONS.PRODUCTS, id, {
    stockStatus: status,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDocument(COLLECTIONS.PRODUCTS, id);
}

