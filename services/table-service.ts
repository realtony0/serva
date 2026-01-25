/**
 * Service pour gérer les tables dans Firestore
 * 
 * Gère la création et la récupération des tables pour chaque restaurant
 */

import {
  getCollection,
  getDocument,
  setDocument,
  deleteDocument,
  where,
  orderBy,
} from "@/lib/firestore";
import { Table } from "@/lib/types/table";

const COLLECTIONS = {
  TABLES: "tables",
} as const;

/**
 * Récupère toutes les tables d'un restaurant
 */
export async function getTablesByRestaurant(
  restaurantId: string
): Promise<Table[]> {
  const tables = await getCollection<Table>(
    COLLECTIONS.TABLES,
    where("restaurantId", "==", restaurantId),
    orderBy("tableNumber", "asc")
  );
  return tables;
}

/**
 * Récupère une table par son ID
 */
export async function getTableById(id: string): Promise<Table | null> {
  return getDocument<Table>(COLLECTIONS.TABLES, id);
}

/**
 * Crée plusieurs tables pour un restaurant
 * Génère automatiquement les QR codes pour chaque table
 */
export async function createTablesForRestaurant(
  restaurantId: string,
  numberOfTables: number,
  baseUrl: string = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
): Promise<Table[]> {
  const tables: Table[] = [];
  const now = new Date().toISOString();

  for (let i = 1; i <= numberOfTables; i++) {
    const tableId = `table_${restaurantId}_${i}`;
    const qrCodeUrl = `${baseUrl}/r/${restaurantId}/t/${tableId}`;

    const table: Table = {
      id: tableId,
      restaurantId,
      tableNumber: i,
      qrCodeUrl,
      createdAt: now,
      updatedAt: now,
    };

    await setDocument(COLLECTIONS.TABLES, tableId, table);
    tables.push(table);
  }

  return tables;
}

/**
 * Supprime toutes les tables d'un restaurant
 */
export async function deleteTablesByRestaurant(
  restaurantId: string
): Promise<void> {
  const tables = await getTablesByRestaurant(restaurantId);
  
  for (const table of tables) {
    await deleteDocument(COLLECTIONS.TABLES, table.id);
  }
}

/**
 * Supprime une table
 */
export async function deleteTable(id: string): Promise<void> {
  await deleteDocument(COLLECTIONS.TABLES, id);
}


