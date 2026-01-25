/**
 * Types pour le panier client
 */

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  categoryId: string;
  typeId: string;
  // Options choisies par le client
  selectedSides?: string[]; // IDs des accompagnements choisis
  selectedSauces?: string[]; // IDs des sauces choisies
  sideNames?: string[]; // Noms des accompagnements (pour affichage)
  sauceNames?: string[]; // Noms des sauces (pour affichage)
}

export interface Cart {
  restaurantId: string;
  tableId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}


