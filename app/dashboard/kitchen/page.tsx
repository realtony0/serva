"use client";

/**
 * Page Cuisine pour SERVA
 * 
 * Affiche les commandes en temps réel avec possibilité de changer le statut
 * Notifications visuelles et sonores pour nouvelles commandes
 */

import { useState, useEffect, useRef } from "react";
import { ProtectedAdminRoute } from "@/components/auth/ProtectedAdminRoute";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  listenToOrders,
  markAsPreparing,
  markAsReady,
} from "@/services/kitchen-service";
import { getAllRestaurants } from "@/services/restaurant-service";
import { Order } from "@/lib/types/order";
import { Restaurant } from "@/lib/types/restaurant";

function KitchenContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "preparing" | "ready"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "table">("date");
  
  // Référence pour suivre les commandes déjà vues (pour notifications)
  const seenOrderIds = useRef<Set<string>>(new Set());
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Charger les restaurants
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error("Erreur lors du chargement des restaurants:", err);
      }
    };
    loadRestaurants();
  }, []);

  // Charger les commandes en temps réel
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    try {
      setLoading(true);
      
      // Écouter les commandes en temps réel (filtrées par restaurant si sélectionné)
      unsubscribe = listenToOrders((newOrders) => {
        // Filtrer par restaurant si sélectionné
        let filteredOrders = newOrders;
        if (selectedRestaurantId !== "all") {
          filteredOrders = newOrders.filter(
            (order) => order.restaurantId === selectedRestaurantId
          );
        }

        // Détecter les nouvelles commandes
        const newOrderIds = new Set(filteredOrders.map((o) => o.id));
        const previousSeenIds = seenOrderIds.current;
        
        // Compter les nouvelles commandes (pending uniquement)
        const newPendingOrders = filteredOrders.filter(
          (order) =>
            order.status === "pending" &&
            !previousSeenIds.has(order.id)
        );
        
        if (newPendingOrders.length > 0) {
          setNewOrdersCount((prev) => prev + newPendingOrders.length);
          
          // Jouer le son de notification
          playNotificationSound();
          
          // Notification visuelle
          showNotification(newPendingOrders.length);
        }
        
        // Mettre à jour les IDs vus
        filteredOrders.forEach((order) => seenOrderIds.current.add(order.id));
        
        setOrders(filteredOrders);
        setLoading(false);
      }, selectedRestaurantId !== "all" ? selectedRestaurantId : undefined);
    } catch (err: any) {
      setError("Erreur lors du chargement: " + err.message);
      setLoading(false);
    }

    // Nettoyage
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedRestaurantId]);

  // Filtrer et trier les commandes
  const filteredAndSortedOrders = orders
    .filter((order) => {
      // Filtrer par restaurant
      if (selectedRestaurantId !== "all" && order.restaurantId !== selectedRestaurantId) {
        return false;
      }
      // Filtrer par statut
      if (filterStatus === "all") return true;
      return order.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        // Trier par table
        const tableA = a.tableId.toLowerCase();
        const tableB = b.tableId.toLowerCase();
        if (tableA !== tableB) {
          return tableA.localeCompare(tableB);
        }
        // Si même table, trier par date
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });

  const handleStatusChange = async (
    orderId: string,
    newStatus: "preparing" | "ready"
  ) => {
    try {
      if (newStatus === "preparing") {
        await markAsPreparing(orderId);
      } else {
        await markAsReady(orderId);
      }
    } catch (err: any) {
      alert("Erreur lors de la mise à jour: " + err.message);
    }
  };

  const playNotificationSound = () => {
    try {
      // Créer un son de notification simple
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (err) {
      console.error("Erreur lors de la lecture du son:", err);
    }
  };

  const showNotification = (count: number) => {
    // Notification toast simple
    const message = count === 1 
      ? "Nouvelle commande !" 
      : `${count} nouvelles commandes !`;
    
    // Créer un élément de notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce";
    notification.textContent = message;
    document.body.appendChild(notification);

    // Retirer après 3 secondes
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const clearNewOrdersCount = () => {
    setNewOrdersCount(0);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "ready":
        return "bg-green-100 text-green-800 border-green-300";
      case "delivered":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "preparing":
        return "En préparation";
      case "ready":
        return "Prête";
      case "delivered":
        return "Livrée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  ← Retour
                </Button>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Cuisine
              </h1>
              {newOrdersCount > 0 && (
                <button
                  onClick={clearNewOrdersCount}
                  className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse"
                >
                  {newOrdersCount} nouvelle(s)
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtres et tri */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Restaurant:
              </label>
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
              >
                <option value="all">Tous les restaurants</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Statut:
              </label>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "all" | "pending" | "preparing" | "ready"
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes</option>
                <option value="pending">En attente</option>
                <option value="preparing">En préparation</option>
                <option value="ready">Prêtes</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Trier par:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "table")}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="table">Table</option>
              </select>
            </div>

            <div className="ml-auto text-sm text-gray-600">
              {filteredAndSortedOrders.length} commande(s)
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-gray-500">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAndSortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function OrderCard({
  order,
  onStatusChange,
  getStatusColor,
  getStatusLabel,
}: {
  order: Order;
  onStatusChange: (orderId: string, status: "preparing" | "ready") => void;
  getStatusColor: (status: Order["status"]) => string;
  getStatusLabel: (status: Order["status"]) => string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusClick = async (status: "preparing" | "ready") => {
    setIsUpdating(true);
    try {
      await onStatusChange(order.id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const orderDate = new Date(order.createdAt);
  const timeAgo = getTimeAgo(orderDate);

  return (
    <div
      className={`rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow border-l-4 ${
        order.status === "pending"
          ? "border-yellow-500"
          : order.status === "preparing"
          ? "border-blue-500"
          : "border-green-500"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">
              Table #{order.tableId}
            </h3>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Restaurant: {order.restaurantId.substring(0, 20)}...
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {orderDate.toLocaleString("fr-FR")} ({timeAgo})
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {order.total.toLocaleString('fr-FR')} FCFA
          </div>
          <div className="text-xs text-gray-500">{totalItems} article(s)</div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-4 space-y-2 max-h-48 overflow-y-auto">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 rounded p-2"
          >
            <div className="flex items-center gap-2 flex-1">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                {/* Afficher les options choisies */}
                {item.sideNames && item.sideNames.length > 0 && (
                  <p className="text-xs text-gray-600">
                    🍽️ {item.sideNames.join(', ')}
                  </p>
                )}
                {item.sauceNames && item.sauceNames.length > 0 && (
                  <p className="text-xs text-gray-600">
                    🧂 {item.sauceNames.join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {item.price.toLocaleString('fr-FR')} FCFA × {item.quantity}
                </p>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        {order.status === "pending" && (
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => handleStatusClick("preparing")}
            disabled={isUpdating}
          >
            {isUpdating ? "..." : "En préparation"}
          </Button>
        )}
        {order.status === "preparing" && (
          <Button
            variant="primary"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => handleStatusClick("ready")}
            disabled={isUpdating}
          >
            {isUpdating ? "..." : "Prête"}
          </Button>
        )}
        {order.status === "ready" && (
          <div className="flex-1 text-center text-sm text-green-600 font-semibold">
            ✓ Commande prête
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} jour(s)`;
}

export default function KitchenPage() {
  return (
    <ProtectedAdminRoute>
      <KitchenContent />
    </ProtectedAdminRoute>
  );
}

