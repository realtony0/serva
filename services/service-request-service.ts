/**
 * Service pour gérer les demandes de service (Appel serveur, addition)
 */

import {
  getCollection,
  setDocument,
  updateDocument,
  where,
  orderBy,
  onCollectionChange,
} from "@/lib/firestore";
import { ServiceRequest, ServiceRequestType } from "@/lib/types/service-request";

const COLLECTION = "service_requests";

/**
 * Créer une nouvelle demande de service
 */
export async function createServiceRequest(
  restaurantId: string,
  tableId: string,
  tableNumber: number,
  type: ServiceRequestType
): Promise<string> {
  const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const request: ServiceRequest = {
    id,
    restaurantId,
    tableId,
    tableNumber,
    type,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  await setDocument(COLLECTION, id, request);
  return id;
}

/**
 * Marquer une demande comme traitée
 */
export async function markRequestAsHandled(id: string): Promise<void> {
  await updateDocument(COLLECTION, id, {
    status: "handled",
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Écouter les demandes en temps réel pour un restaurant
 */
export function listenToServiceRequests(
  restaurantId: string,
  callback: (requests: ServiceRequest[]) => void
) {
  return onCollectionChange<ServiceRequest>(
    COLLECTION,
    (requests) => {
      callback(requests);
    },
    where("restaurantId", "==", restaurantId),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
}
