"use client";

/**
 * Page client pour SERVA
 * 
 * Accessible via QR code : /r/[restaurantId]/t/[tableId]
 * Affiche le menu du restaurant avec filtres et panier
 */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getRestaurantData,
  getActiveCategories,
  getActiveTypes,
  getActiveProducts,
} from "@/services/client-service";
import { createServiceRequest } from "@/services/service-request-service";
import { Restaurant } from "@/lib/types/restaurant";
import { Category, MenuType, Product } from "@/lib/types/menu";
import { CartItem } from "@/lib/types/cart";
import MenuDisplay from "@/components/client/MenuDisplay";
import Cart from "@/components/client/Cart";
import RestaurantHeader from "@/components/client/RestaurantHeader";
import OrderStatusNotification from "@/components/client/OrderStatusNotification";
import FeedbackModal from "@/components/client/FeedbackModal";
import { createNotification } from "@/services/notification-service";

export default function ClientPage() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  const tableId = params.tableId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<MenuType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);
  const [isRequestingBill, setIsRequestingBill] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [language, setLanguage] = useState<"fr" | "en">("fr");

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

  const addToCart = (
    product: Product,
    selectedSides?: string[],
    selectedSauces?: string[],
    sideNames?: string[],
    sauceNames?: string[]
  ) => {
    setCart((prevCart) => {
      // Créer une clé unique pour cet item avec ses options
      const itemKey = `${product.id}_${selectedSides?.join(',') || ''}_${selectedSauces?.join(',') || ''}`;
      
      const existingItem = prevCart.find(
        (item) => {
          const itemKeyExisting = `${item.productId}_${item.selectedSides?.join(',') || ''}_${item.selectedSauces?.join(',') || ''}`;
          return itemKeyExisting === itemKey;
        }
      );

      if (existingItem) {
        return prevCart.map((item) => {
          const itemKeyExisting = `${item.productId}_${item.selectedSides?.join(',') || ''}_${item.selectedSauces?.join(',') || ''}`;
          return itemKeyExisting === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
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
            selectedSides: selectedSides || [],
            selectedSauces: selectedSauces || [],
            sideNames: sideNames || [],
            sauceNames: sauceNames || [],
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
    return cart.reduce((total, item) => {
      // Prix de base du produit
      let itemTotal = item.price * item.quantity;
      
      // Ajouter le prix des accompagnements si disponibles
      if (item.selectedSides && item.selectedSides.length > 0) {
        const sidesProducts = products.filter(p => item.selectedSides?.includes(p.id));
        const sidesPrice = sidesProducts.reduce((sum, p) => sum + p.price, 0);
        itemTotal += sidesPrice * item.quantity;
      }
      
      // Ajouter le prix des sauces si disponibles
      if (item.selectedSauces && item.selectedSauces.length > 0) {
        const saucesProducts = products.filter(p => item.selectedSauces?.includes(p.id));
        const saucesPrice = saucesProducts.reduce((sum, p) => sum + p.price, 0);
        itemTotal += saucesPrice * item.quantity;
      }
      
      return total + itemTotal;
    }, 0);
  };

  const handleCallWaiter = async () => {
    try {
      setIsCallingWaiter(true);
      const tableNumber = parseInt(tableId.split('_').pop() || "0");
      await createServiceRequest(restaurantId, tableId, tableNumber, "server");
      alert("🛎️ Un serveur a été appelé. Il arrive bientôt !");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setIsCallingWaiter(false);
    }
  };

  const handleRequestBill = async () => {
    try {
      setIsRequestingBill(true);
      const tableNumber = parseInt(tableId.split('_').pop() || "0");
      await createServiceRequest(restaurantId, tableId, tableNumber, "bill");
      alert("🧾 Votre demande d'addition a été envoyée.");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setIsRequestingBill(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Chargement du menu...</p>
          <p className="text-gray-500 text-sm mt-2">Un instant, s&apos;il vous plaît</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-7xl mb-6 animate-bounce">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Erreur de chargement
          </h1>
          <p className="text-gray-600 mb-6">{error || "Restaurant non trouvé"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Notification de statut des commandes */}
      <OrderStatusNotification
        restaurantId={restaurantId}
        tableId={tableId}
      />

      {/* Header avec infos restaurant et table */}
      <RestaurantHeader
        restaurant={restaurant}
        tableId={tableId}
      />

      {/* Sélecteur de langue */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end">
        <div className="bg-white rounded-full shadow-sm border border-gray-200 p-1 flex gap-1">
          <button
            onClick={() => setLanguage("fr")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              language === "fr" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            FR
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              language === "en" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-3">
        <button
          onClick={handleCallWaiter}
          disabled={isCallingWaiter}
          className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-50"
        >
          <span>🛎️</span> {isCallingWaiter ? "Appel..." : "Appeler Serveur"}
        </button>
        <button
          onClick={handleRequestBill}
          disabled={isRequestingBill}
          className="flex-1 bg-white border-2 border-orange-500 text-orange-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-50"
        >
          <span>🧾</span> {isRequestingBill ? "Demande..." : "L'addition"}
        </button>
      </div>

      {/* Menu avec filtres */}
      <MenuDisplay
        categories={categories}
        types={types}
        products={products}
        onAddToCart={addToCart}
        language={language}
      />

      {/* Panier flottant */}
      <Cart
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
        total={getTotalPrice()}
        restaurantId={restaurantId}
        tableId={tableId}
      />

      {/* Bouton Feedback */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-20 right-4 bg-white text-gray-700 rounded-full p-3 shadow-lg border border-gray-200 active:scale-95 transition-all z-30"
      >
        ⭐ Avis
      </button>

      {showFeedbackModal && (
        <FeedbackModal
          restaurantId={restaurantId}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </div>
  );
}

