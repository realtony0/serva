/**
 * Service pour la gestion de la cuisine
 * 
 * Écoute les commandes en temps réel et permet de changer leur statut
 */

import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { Order } from "@/lib/types/order";

const COLLECTIONS = {
  ORDERS: "orders",
} as const;

/**
 * Écoute les commandes en temps réel
 * @param callback - Fonction appelée à chaque changement
 * @param restaurantId - Filtrer par restaurant (optionnel)
 * @returns Fonction pour désabonner l'écouteur
 */
export function listenToOrders(
  callback: (orders: Order[]) => void,
  restaurantId?: string
): () => void {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  
  // Construire la requête
  let q = query(
    ordersRef,
    orderBy("createdAt", "desc")
  );

  // Filtrer par restaurant si fourni
  if (restaurantId) {
    q = query(
      ordersRef,
      where("restaurantId", "==", restaurantId),
      orderBy("createdAt", "desc")
    );
  }

  // Écouter les changements en temps réel
  const unsubscribe = onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
        } as Order);
      });
      callback(orders);
    },
    (error) => {
      console.error("Erreur lors de l'écoute des commandes:", error);
      callback([]);
    }
  );

  return unsubscribe;
}

/**
 * Écoute les commandes d'une table spécifique en temps réel
 * @param callback - Fonction appelée à chaque changement
 * @param restaurantId - ID du restaurant (requis)
 * @param tableId - ID de la table (requis)
 * @returns Fonction pour désabonner l'écouteur
 */
export function listenToTableOrders(
  callback: (orders: Order[]) => void,
  restaurantId: string,
  tableId: string
): () => void {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  if (!restaurantId || !tableId) {
    throw new Error("restaurantId et tableId sont requis");
  }

  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  
  // Filtrer par restaurant ET table
  const q = query(
    ordersRef,
    where("restaurantId", "==", restaurantId),
    where("tableId", "==", tableId),
    orderBy("createdAt", "desc")
  );

  // Écouter les changements en temps réel
  const unsubscribe = onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
        } as Order);
      });
      callback(orders);
    },
    (error) => {
      console.error("Erreur lors de l'écoute des commandes de la table:", error);
      callback([]);
    }
  );

  return unsubscribe;
}

/**
 * Récupère toutes les commandes (une seule fois)
 */
export async function getAllOrders(restaurantId?: string): Promise<Order[]> {
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
 * Met à jour le statut d'une commande
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Marque une commande comme "en préparation"
 */
export async function markAsPreparing(orderId: string): Promise<void> {
  await updateOrderStatus(orderId, "preparing");
}

/**
 * Marque une commande comme "prête"
 */
export async function markAsReady(orderId: string): Promise<void> {
  await updateOrderStatus(orderId, "ready");
}

