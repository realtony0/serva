import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests pour le service de commandes
 *
 * On mock Firestore pour tester uniquement la logique de validation
 * et de construction des données de commande.
 */

// Mock Firestore
vi.mock("@/lib/firestore", () => ({
  setDocument: vi.fn().mockResolvedValue(undefined),
}));

import { createOrder } from "@/services/order-service";
import { setDocument } from "@/lib/firestore";
import { CartItem } from "@/lib/types/cart";

const mockSetDocument = vi.mocked(setDocument);

function makeCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    productId: "prod_1",
    name: "Poulet braisé",
    price: 3500,
    imageUrl: "https://example.com/img.jpg",
    quantity: 2,
    categoryId: "cat_1",
    typeId: "type_1",
    selectedSides: [],
    selectedSauces: [],
    sideNames: [],
    sauceNames: [],
    ...overrides,
  };
}

beforeEach(() => {
  mockSetDocument.mockClear();
});

describe("createOrder", () => {
  it("crée une commande valide et retourne un orderId", async () => {
    const items = [makeCartItem()];
    const orderId = await createOrder("rest_1", "table_1", items);

    expect(orderId).toMatch(/^order_/);
    expect(mockSetDocument).toHaveBeenCalledOnce();

    const [collection, id, data] = mockSetDocument.mock.calls[0];
    expect(collection).toBe("orders");
    expect(id).toBe(orderId);
    expect(data).toMatchObject({
      restaurantId: "rest_1",
      tableId: "table_1",
      status: "pending",
      total: 7000, // 3500 * 2
    });
    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe("Poulet braisé");
  });

  it("accepte plusieurs articles", async () => {
    const items = [
      makeCartItem({ productId: "p1", price: 1000, quantity: 1 }),
      makeCartItem({ productId: "p2", price: 2000, quantity: 3 }),
    ];
    const orderId = await createOrder("rest_1", "table_1", items);

    const [, , data] = mockSetDocument.mock.calls[0];
    expect(data.total).toBe(7000); // 1000 + 6000
    expect(data.items).toHaveLength(2);
  });

  it("rejette un restaurantId vide", async () => {
    await expect(createOrder("", "table_1", [makeCartItem()])).rejects.toThrow(
      "restaurant"
    );
  });

  it("rejette un tableId vide", async () => {
    await expect(createOrder("rest_1", "", [makeCartItem()])).rejects.toThrow(
      "table"
    );
  });

  it("rejette un panier vide", async () => {
    await expect(createOrder("rest_1", "table_1", [])).rejects.toThrow(
      "panier"
    );
  });

  it("rejette un article avec un prix négatif", async () => {
    const items = [makeCartItem({ price: -100 })];
    await expect(createOrder("rest_1", "table_1", items)).rejects.toThrow(
      "prix"
    );
  });

  it("rejette un article avec une quantité de 0", async () => {
    const items = [makeCartItem({ quantity: 0 })];
    await expect(createOrder("rest_1", "table_1", items)).rejects.toThrow(
      "quantité"
    );
  });

  it("rejette un article sans nom", async () => {
    const items = [makeCartItem({ name: "" })];
    await expect(createOrder("rest_1", "table_1", items)).rejects.toThrow(
      "nom"
    );
  });

  it("rejette plus de 50 articles", async () => {
    const items = Array.from({ length: 51 }, (_, i) =>
      makeCartItem({ productId: `p_${i}` })
    );
    await expect(createOrder("rest_1", "table_1", items)).rejects.toThrow(
      "50"
    );
  });

  it("trim les IDs dans les données", async () => {
    const items = [makeCartItem()];
    await createOrder("  rest_1  ", "  table_1  ", items);

    const [, , data] = mockSetDocument.mock.calls[0];
    expect(data.restaurantId).toBe("rest_1");
    expect(data.tableId).toBe("table_1");
  });
});
