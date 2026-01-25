"use client";

/**
 * Page client pour SERVA
 * 
 * Accessible via QR code : /r/[restaurantId]
 * Le client peut saisir son numéro de table ou il est généré automatiquement
 * Affiche le menu du restaurant avec filtres et panier
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getRestaurantData,
  getActiveCategories,
  getActiveTypes,
  getActiveProducts,
} from "@/services/client-service";
import { Restaurant } from "@/lib/types/restaurant";
import { Category, MenuType, Product } from "@/lib/types/menu";
import { CartItem } from "@/lib/types/cart";
import MenuDisplay from "@/components/client/MenuDisplay";
import Cart from "@/components/client/Cart";
import RestaurantHeader from "@/components/client/RestaurantHeader";
import OrderStatusNotification from "@/components/client/OrderStatusNotification";

export default function ClientPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<MenuType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tableId, setTableId] = useState<string>("");
  const [showTableInput, setShowTableInput] = useState(true);

  // Générer ou récupérer le tableId
  useEffect(() => {
    if (restaurantId) {
      // Vérifier si un tableId est déjà en localStorage pour ce restaurant
      const savedTableId = localStorage.getItem(`tableId_${restaurantId}`);
      
      if (savedTableId) {
        setTableId(savedTableId);
        setShowTableInput(false);
      } else {
        // Générer un tableId unique basé sur timestamp et random
        const generatedTableId = `table_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        setTableId(generatedTableId);
        localStorage.setItem(`tableId_${restaurantId}`, generatedTableId);
        setShowTableInput(false);
      }
    }
  }, [restaurantId]);

  // Charger les données au montage
  useEffect(() => {
    if (restaurantId && tableId) {
      loadData();
      loadCart();
    }
  }, [restaurantId, tableId]);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (restaurantId && tableId) {
      saveCart();
    }
  }, [cart, restaurantId, tableId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [restaurantData, cats, typs, prods] = await Promise.all([
        getRestaurantData(restaurantId),
        getActiveCategories(restaurantId),
        getActiveTypes(restaurantId),
        getActiveProducts(restaurantId),
      ]);

      if (!restaurantData) {
        setError("Restaurant non trouvé");
        return;
      }

      setRestaurant(restaurantData);
      setCategories(cats);
      setTypes(typs);
      setProducts(prods);
    } catch (err: any) {
      setError("Erreur lors du chargement: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    try {
      const cartKey = `cart_${restaurantId}_${tableId}`;
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error("Erreur lors du chargement du panier:", err);
    }
  };

  const saveCart = () => {
    try {
      const cartKey = `cart_${restaurantId}_${tableId}`;
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (err) {
      console.error("Erreur lors de la sauvegarde du panier:", err);
    }
  };

  const handleTableIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableId.trim()) {
      localStorage.setItem(`tableId_${restaurantId}`, tableId.trim());
      setShowTableInput(false);
      loadCart(); // Recharger le panier avec le nouveau tableId
    }
  };

  const handleChangeTable = () => {
    localStorage.removeItem(`tableId_${restaurantId}`);
    setTableId("");
    setCart([]);
    setShowTableInput(true);
  };

  const addToCart = (product: Product) => {
    if (!tableId) {
      alert("Veuillez d'abord saisir votre numéro de table");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
            categoryId: product.categoryId,
            typeId: product.typeId,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const clearCart = () => {
    if (confirm("Voulez-vous vider le panier ?")) {
      setCart([]);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du menu...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de chargement
          </h1>
          <p className="text-gray-600">{error || "Restaurant non trouvé"}</p>
        </div>
      </div>
    );
  }

  // Afficher le formulaire de saisie du numéro de table si nécessaire
  if (showTableInput) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            {restaurant.logoUrl && (
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="h-20 w-20 rounded-lg object-cover mx-auto mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {restaurant.name}
            </h1>
            <p className="text-gray-600 text-sm">{restaurant.description}</p>
          </div>

          <form onSubmit={handleTableIdSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="tableId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Numéro de table (optionnel)
              </label>
              <input
                id="tableId"
                type="text"
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                placeholder="Ex: Table 5, ou laissez vide pour générer automatiquement"
              />
              <p className="mt-1 text-xs text-gray-500">
                Si vous laissez vide, un numéro sera généré automatiquement
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-blue-700 transition-colors"
            >
              Accéder au menu
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Notification de statut des commandes */}
      {tableId && (
        <OrderStatusNotification
          restaurantId={restaurantId}
          tableId={tableId}
        />
      )}

      {/* Header avec infos restaurant et table */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {restaurant.logoUrl && (
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="h-10 w-10 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {restaurant.name}
                </h1>
                <p className="text-xs text-gray-600">Table: {tableId}</p>
              </div>
            </div>
            <button
              onClick={handleChangeTable}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Changer de table
            </button>
          </div>
        </div>
      </div>

      {/* Menu avec filtres */}
      <MenuDisplay
        categories={categories}
        types={types}
        products={products}
        onAddToCart={addToCart}
      />

      {/* Panier flottant */}
      {tableId && (
        <Cart
          items={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onClear={clearCart}
          total={getTotalPrice()}
          restaurantId={restaurantId}
          tableId={tableId}
        />
      )}
    </div>
  );
}

