/**
 * Types pour les commandes
 */

import { CartItem } from "./cart";

export interface Order {
  id: string;
  restaurantId: string;
  tableId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}


