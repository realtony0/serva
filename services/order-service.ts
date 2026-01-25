/**
 * Service pour gérer les commandes
 */

import { setDocument } from "@/lib/firestore";
import { Order } from "@/lib/types/order";
import { CartItem } from "@/lib/types/cart";

const COLLECTIONS = {
  ORDERS: "orders",
} as const;

/**
 * Valide les données d'une commande avant création
 */
function validateOrderData(
  restaurantId: string,
  tableId: string,
  items: CartItem[]
): void {
  if (!restaurantId || restaurantId.trim() === "") {
    throw new Error("L'ID du restaurant est requis");
  }

  if (!tableId || tableId.trim() === "") {
    throw new Error("L'ID de la table est requis");
  }

  if (!items || items.length === 0) {
    throw new Error("Le panier ne peut pas être vide");
  }

  // Vérifier que tous les items ont les champs requis
  for (const item of items) {
    if (!item.productId || item.productId.trim() === "") {
      throw new Error("Un produit a un ID invalide");
    }
    if (!item.name || item.name.trim() === "") {
      throw new Error("Un produit a un nom invalide");
    }
    if (typeof item.price !== "number" || item.price < 0) {
      throw new Error("Un produit a un prix invalide");
    }
    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      throw new Error("Un produit a une quantité invalide");
    }
    if (!item.categoryId || item.categoryId.trim() === "") {
      throw new Error("Un produit a une catégorie invalide");
    }
    if (!item.typeId || item.typeId.trim() === "") {
      throw new Error("Un produit a un type invalide");
    }
  }
}

/**
 * Crée une nouvelle commande dans Firestore
 * 
 * @param restaurantId - ID du restaurant (depuis l'URL/QR code)
 * @param tableId - ID de la table (depuis l'URL/QR code)
 * @param items - Liste des articles du panier
 * @returns L'ID de la commande créée
 * @throws Error si les données sont invalides
 */
export async function createOrder(
  restaurantId: string,
  tableId: string,
  items: CartItem[]
): Promise<string> {
  // Valider les données avant création
  validateOrderData(restaurantId, tableId, items);

  // Générer un ID unique pour la commande
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Timestamp ISO pour createdAt et updatedAt
  const now = new Date().toISOString();
  
  // Calculer le total de la commande (incluant les options)
  // Note: Les prix des options doivent être calculés côté client avant l'envoi
  // Ici on utilise simplement le total calculé côté client
  const total = items.reduce((sum, item) => {
    let itemTotal = item.price * item.quantity;
    // Les options sont déjà incluses dans le prix si elles ont un prix > 0
    // Le total est calculé côté client dans getTotalPrice()
    return sum + itemTotal;
  }, 0);

  // Créer l'objet commande avec toutes les données requises
  const order: Order = {
    id: orderId,
    restaurantId: restaurantId.trim(),
    tableId: tableId.trim(),
    items: items.map(item => ({
      productId: item.productId.trim(),
      name: item.name.trim(),
      price: item.price,
      imageUrl: item.imageUrl?.trim() || "",
      quantity: item.quantity,
      categoryId: item.categoryId.trim(),
      typeId: item.typeId.trim(),
      selectedSides: item.selectedSides || [],
      selectedSauces: item.selectedSauces || [],
      sideNames: item.sideNames || [],
      sauceNames: item.sauceNames || [],
    })),
    total: Math.round(total * 100) / 100, // Arrondir à 2 décimales
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  // Sauvegarder dans Firestore
  await setDocument(COLLECTIONS.ORDERS, orderId, order);
  
  return orderId;
}

