/**
 * Service pour les statistiques
 * 
 * Récupère et calcule les statistiques des commandes
 */

import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { Order } from "@/lib/types/order";

const COLLECTIONS = {
  ORDERS: "orders",
} as const;

/**
 * Récupère toutes les commandes d'aujourd'hui
 */
export async function getTodayOrders(restaurantId?: string): Promise<Order[]> {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  
  // Note: Firestore nécessite un index composite pour les requêtes avec where + orderBy
  // Récupérer toutes les commandes et filtrer côté client pour éviter les problèmes d'index
  let q = query(ordersRef, orderBy("createdAt", "desc"));
  
  if (restaurantId) {
    q = query(
      ordersRef,
      where("restaurantId", "==", restaurantId),
      orderBy("createdAt", "desc")
    );
  }

  const snapshot = await getDocs(q);
  const orders: Order[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const order = {
      id: doc.id,
      ...data,
    } as Order;
    
    // Filtrer les commandes d'aujourd'hui côté client
    const orderDate = new Date(order.createdAt);
    if (orderDate >= today) {
      orders.push(order);
    }
  });

  return orders;
}

/**
 * Récupère toutes les commandes (pour statistiques globales)
 */
export async function getAllOrdersForStats(
  restaurantId?: string
): Promise<Order[]> {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  let q = query(ordersRef, orderBy("createdAt", "desc"));

  if (restaurantId) {
    q = query(
      ordersRef,
      where("restaurantId", "==", restaurantId),
      orderBy("createdAt", "desc")
    );
  }

  const snapshot = await getDocs(q);
  const orders: Order[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    orders.push({
      id: doc.id,
      ...data,
    } as Order);
  });

  return orders;
}

/**
 * Calcule les statistiques des commandes
 */
export interface Statistics {
  totalOrdersToday: number;
  totalRevenueToday: number;
  averagePreparationTime: number; // en minutes
  mostOrderedProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  ordersByTable: Array<{
    tableId: string;
    count: number;
    revenue: number;
  }>;
  ordersByStatus: {
    pending: number;
    preparing: number;
    ready: number;
    delivered: number;
    cancelled: number;
  };
}

export async function calculateStatistics(
  restaurantId?: string
): Promise<Statistics> {
  const todayOrders = await getTodayOrders(restaurantId);
  const allOrders = await getAllOrdersForStats(restaurantId);

  // Statistiques du jour
  const totalOrdersToday = todayOrders.length;
  const totalRevenueToday = todayOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  // Produits les plus commandés (toutes commandes)
  const productMap = new Map<
    string,
    { name: string; quantity: number; revenue: number }
  >();

  allOrders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = productMap.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        productMap.set(item.productId, {
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        });
      }
    });
  });

  const mostOrderedProducts = Array.from(productMap.entries())
    .map(([productId, data]) => ({
      productId,
      ...data,
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10); // Top 10

  // Temps moyen de préparation (commandes terminées)
  const completedOrders = allOrders.filter(
    (order) => order.status === "ready" || order.status === "delivered"
  );

  let totalPreparationTime = 0;
  let validOrdersCount = 0;

  completedOrders.forEach((order) => {
    const createdAt = new Date(order.createdAt);
    const updatedAt = new Date(order.updatedAt);
    const preparationTime = updatedAt.getTime() - createdAt.getTime();
    
    // Ignorer les temps négatifs ou trop longs (probablement des erreurs)
    if (preparationTime > 0 && preparationTime < 24 * 60 * 60 * 1000) {
      totalPreparationTime += preparationTime;
      validOrdersCount++;
    }
  });

  const averagePreparationTime =
    validOrdersCount > 0
      ? Math.round(totalPreparationTime / validOrdersCount / 60000) // Convertir en minutes
      : 0;

  // Commandes par table (du jour)
  const tableMap = new Map<string, { count: number; revenue: number }>();

  todayOrders.forEach((order) => {
    const existing = tableMap.get(order.tableId);
    if (existing) {
      existing.count++;
      existing.revenue += order.total;
    } else {
      tableMap.set(order.tableId, {
        count: 1,
        revenue: order.total,
      });
    }
  });

  const ordersByTable = Array.from(tableMap.entries())
    .map(([tableId, data]) => ({
      tableId,
      ...data,
    }))
    .sort((a, b) => b.count - a.count);

  // Commandes par statut (du jour)
  const ordersByStatus = {
    pending: todayOrders.filter((o) => o.status === "pending").length,
    preparing: todayOrders.filter((o) => o.status === "preparing").length,
    ready: todayOrders.filter((o) => o.status === "ready").length,
    delivered: todayOrders.filter((o) => o.status === "delivered").length,
    cancelled: todayOrders.filter((o) => o.status === "cancelled").length,
  };

  return {
    totalOrdersToday,
    totalRevenueToday,
    averagePreparationTime,
    mostOrderedProducts,
    ordersByTable,
    ordersByStatus,
  };
}

