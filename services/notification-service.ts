/**
 * Service pour les notifications et appels serveur
 */

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export type NotificationType = "call_waiter" | "request_bill" | "new_order";

export interface RestaurantNotification {
  id: string;
  restaurantId: string;
  tableId: string;
  type: NotificationType;
  status: "unread" | "read" | "archived";
  message: string;
  createdAt: any;
}

const COLLECTION = "notifications";

/**
 * Créer une notification (Appel serveur ou Addition)
 */
export async function createNotification(
  restaurantId: string,
  tableId: string,
  type: NotificationType,
  message: string
) {
  if (!db) throw new Error("Firestore non initialisé");

  return await addDoc(collection(db, COLLECTION), {
    restaurantId,
    tableId,
    type,
    status: "unread",
    message,
    createdAt: serverTimestamp(),
  });
}

/**
 * Écouter les notifications d'un restaurant
 */
export function listenToNotifications(
  restaurantId: string,
  callback: (notifications: RestaurantNotification[]) => void
) {
  if (!db) throw new Error("Firestore non initialisé");

  const q = query(
    collection(db, COLLECTION),
    where("restaurantId", "==", restaurantId),
    where("status", "==", "unread"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notifications: RestaurantNotification[] = [];
    snapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() } as RestaurantNotification);
    });
    callback(notifications);
  });
}

/**
 * Marquer une notification comme lue
 */
export async function markNotificationAsRead(notificationId: string) {
  if (!db) throw new Error("Firestore non initialisé");
  const ref = doc(db, COLLECTION, notificationId);
  return await updateDoc(ref, { status: "read" });
}
