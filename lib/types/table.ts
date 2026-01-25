/**
 * Types TypeScript pour les tables
 */

export interface Table {
  id: string;
  restaurantId: string;
  tableNumber: number; // Numéro de la table (1, 2, 3, etc.)
  qrCodeUrl: string; // URL complète pour le QR code
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TableFormData {
  restaurantId: string;
  numberOfTables: number;
}


