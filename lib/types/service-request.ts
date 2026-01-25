/**
 * Types pour les notifications de service (Appel serveur, addition)
 */

export type ServiceRequestType = "server" | "bill";

export interface ServiceRequest {
  id: string;
  restaurantId: string;
  tableId: string;
  tableNumber: number;
  type: ServiceRequestType;
  status: "pending" | "handled";
  createdAt: string;
  updatedAt: string;
}
