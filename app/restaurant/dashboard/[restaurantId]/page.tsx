"use client";

/**
 * Dashboard Restaurant Complet
 * 
 * Affiche :
 * - Commandes en temps réel
 * - QR Codes (génération et téléchargement)
 * - Statistiques
 * - Menu (gestion)
 */

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import {
  listenToOrders,
  markAsPreparing,
  markAsReady,
} from "@/services/kitchen-service";
import { getRestaurantById } from "@/services/restaurant-auth-service";
import {
  getTablesByRestaurant,
  createTablesForRestaurant,
  deleteTable,
} from "@/services/table-service";
import { calculateStatistics } from "@/services/statistics-service";
import {
  listenToServiceRequests,
  markRequestAsHandled,
} from "@/services/service-request-service";
import { Order } from "@/lib/types/order";
import { Restaurant } from "@/lib/types/restaurant";
import { Table } from "@/lib/types/table";
import { ServiceRequest } from "@/lib/types/service-request";
import { Statistics } from "@/services/statistics-service";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { 
  listenToNotifications, 
  markNotificationAsRead, 
  RestaurantNotification 
} from "@/services/notification-service";

type Tab = "orders" | "qrcodes" | "statistics" | "menu" | "notifications";

function RestaurantDashboardContent() {
  const params = useParams();
  const router = useRouter();
  const { user, restaurantUser, signOut } = useAuth();
  const restaurantId = params.restaurantId as string;

  // Restriction d'accès basée sur le rôle
  const canManageMenu = !restaurantUser || ["owner", "manager"].includes(restaurantUser.role);
  const canSeeStats = !restaurantUser || ["owner", "manager"].includes(restaurantUser.role);
  const isKitchenOnly = restaurantUser?.role === "kitchen";
  const isWaiterOnly = restaurantUser?.role === "waiter";

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "preparing" | "ready"
  >("all");
  const [loadingStats, setLoadingStats] = useState(false);
  const [numberOfTables, setNumberOfTables] = useState(10);
  const [generatingTables, setGeneratingTables] = useState(false);
  const [deletingTableId, setDeletingTableId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<RestaurantNotification[]>([]);
  
  // Notifications
  const seenOrderIds = useRef<Set<string>>(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  // Charger les données du restaurant
  useEffect(() => {
    if (restaurantId) {
      loadRestaurant();
      loadTables();
    }
  }, [restaurantId]);

  // Charger les statistiques quand on change d'onglet
  useEffect(() => {
    if (activeTab === "statistics" && restaurantId && !statistics) {
      loadStatistics();
    }
  }, [activeTab, restaurantId]);

  // Réinitialiser le compteur de nouvelles commandes quand on ouvre l'onglet Commandes
  useEffect(() => {
    if (activeTab === "orders" && newOrdersCount > 0) {
      setNewOrdersCount(0);
    }
  }, [activeTab]);

  // Écouter les notifications (Appels serveur, etc.)
  useEffect(() => {
    if (!restaurantId) return;
    
    const unsubscribe = listenToNotifications(restaurantId, (newNotifs) => {
      // Détecter les nouvelles notifications pour le son
      if (newNotifs.length > notifications.length) {
        playNotificationSound();
      }
      setNotifications(newNotifs);
    });
    
    return () => unsubscribe();
  }, [restaurantId, notifications.length]);

  // Écouter les commandes de ce restaurant uniquement avec notifications
  useEffect(() => {
    if (!restaurantId) return;

    let unsubscribe: (() => void) | null = null;

    try {
      unsubscribe = listenToOrders(
        (newOrders) => {
          const restaurantOrders = newOrders.filter(
            (order) => order.restaurantId === restaurantId
          );
          
          // Détecter les nouvelles commandes (pending uniquement)
          const previousSeenIds = seenOrderIds.current;
          const newPendingOrders = restaurantOrders.filter(
            (order) =>
              order.status === "pending" &&
              !previousSeenIds.has(order.id)
          );
          
          // Si nouvelles commandes, déclencher notification
          if (newPendingOrders.length > 0) {
            setNewOrdersCount((prev) => prev + newPendingOrders.length);
            
            // Jouer le son de notification
            playNotificationSound();
            
            // Afficher notification visuelle
            const count = newPendingOrders.length;
            const message = count === 1 
              ? "Nouvelle commande reçue !" 
              : `${count} nouvelles commandes reçues !`;
            setNotificationMessage(message);
            setShowNotification(true);
            
            // Masquer automatiquement après 5 secondes
            setTimeout(() => {
              setShowNotification(false);
            }, 5000);
            
            // Notification push PWA si disponible
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(message, {
                body: `Table${count > 1 ? 's' : ''}: ${newPendingOrders.map(o => o.tableId.split('_').pop()).join(', ')}`,
                icon: "/icon-192x192.png",
                badge: "/icon-192x192.png",
                tag: "new-order",
                requireInteraction: false,
              });
            }
          }
          
          // Mettre à jour les IDs vus
          restaurantOrders.forEach((order) => seenOrderIds.current.add(order.id));
          
          setOrders(restaurantOrders);
          setLoading(false);
        },
        restaurantId
      );
    } catch (err: any) {
      setError("Erreur lors du chargement: " + err.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [restaurantId]);

  // Écouter les demandes de service (appel serveur, addition)
  useEffect(() => {
    if (!restaurantId) return;

    const unsubscribe = listenToServiceRequests(restaurantId, (requests) => {
      // Détecter les nouvelles demandes pour notification sonore
      if (requests.length > serviceRequests.length) {
        playNotificationSound();
      }
      setServiceRequests(requests);
    });

    return () => unsubscribe();
  }, [restaurantId, serviceRequests.length]);

  // Demander la permission pour les notifications push au chargement
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notifications push activées");
        }
      });
    }
  }, []);

  // Fonction pour jouer le son de notification
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Son plus agréable pour restaurant
      oscillator.frequency.value = 600;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.4
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (err) {
      console.error("Erreur lors de la lecture du son:", err);
    }
  };

  const loadRestaurant = async () => {
    try {
      const data = await getRestaurantById(restaurantId);
      if (!data) {
        setError("Restaurant non trouvé");
        return;
      }
      setRestaurant(data);
    } catch (err: any) {
      setError("Erreur: " + err.message);
    }
  };

  const loadTables = async () => {
    try {
      const data = await getTablesByRestaurant(restaurantId);
      setTables(data);
    } catch (err: any) {
      console.error("Erreur lors du chargement des tables:", err);
    }
  };

  const loadStatistics = async () => {
    try {
      setLoadingStats(true);
      const stats = await calculateStatistics(restaurantId);
      setStatistics(stats);
    } catch (err: any) {
      console.error("Erreur lors du chargement des statistiques:", err);
    } finally {
      setLoadingStats(false);
    }
  };

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

  const handleHandleRequest = async (requestId: string) => {
    try {
      await markRequestAsHandled(requestId);
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/restaurant/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const downloadQRCode = (table: Table) => {
    const svg = document.getElementById(`qrcode-${table.id}`)?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${restaurant?.name}-Table-${table.tableNumber}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const printAllQRCodes = () => {
    window.print();
  };

  const exportToCSV = () => {
    if (orders.length === 0) return;

    const headers = ["ID", "Table", "Date", "Statut", "Total (FCFA)"];
    const rows = orders.map((o) => [
      o.id,
      o.tableId.split("_").pop(),
      new Date(o.createdAt).toLocaleString("fr-FR"),
      o.status,
      o.total,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ventes-${restaurant?.name}-${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTicket = (order: Order) => {
    const ticketWindow = window.open("", "_blank", "width=300,height=600");
    if (!ticketWindow) return;

    const itemsHtml = order.items
      .map(
        (item) => `
      <div style="display: flex; justify-between; font-size: 12px; margin-bottom: 4px;">
        <span>${item.quantity}x ${item.name}</span>
        <span>${(item.price * item.quantity).toLocaleString("fr-FR")}</span>
      </div>
      ${item.sideNames?.length ? `<div style="font-size: 10px; margin-left: 10px;">- ${item.sideNames.join(", ")}</div>` : ""}
      ${item.sauceNames?.length ? `<div style="font-size: 10px; margin-left: 10px;">- ${item.sauceNames.join(", ")}</div>` : ""}
    `
      )
      .join("");

    ticketWindow.document.write(`
      <html>
        <body style="font-family: monospace; padding: 20px; width: 250px;">
          <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
            <h2 style="margin: 0;">${restaurant?.name}</h2>
            <p style="font-size: 12px; margin: 5px 0;">Bon de commande</p>
          </div>
          <div style="margin-bottom: 10px; font-size: 12px;">
            <p>Table: ${order.tableId.split("_").pop()}</p>
            <p>Date: ${new Date(order.createdAt).toLocaleString("fr-FR")}</p>
            <p>ID: #${order.id.slice(-6)}</p>
          </div>
          <div style="border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
            ${itemsHtml}
          </div>
          <div style="text-align: right; font-weight: bold;">
            TOTAL: ${order.total.toLocaleString("fr-FR")} FCFA
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 10px;">
            Merci de votre commande !
          </div>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `);
    ticketWindow.document.close();
  };

  const handleGenerateTables = async () => {
    if (numberOfTables <= 0 || numberOfTables > 100) {
      alert("Le nombre de tables doit être entre 1 et 100");
      return;
    }

    try {
      setGeneratingTables(true);
      const baseUrl = window.location.origin;
      await createTablesForRestaurant(restaurantId, numberOfTables, baseUrl);
      await loadTables();
      setSuccess(`${numberOfTables} tables créées avec succès !`);
      setNumberOfTables(10);
    } catch (err: any) {
      setError("Erreur lors de la création: " + err.message);
    } finally {
      setGeneratingTables(false);
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    if (!confirm("Supprimer cette table et son QR code ?")) return;

    try {
      setDeletingTableId(tableId);
      await deleteTable(tableId);
      await loadTables();
      setSuccess("Table supprimée avec succès !");
    } catch (err: any) {
      setError("Erreur lors de la suppression: " + err.message);
    } finally {
      setDeletingTableId(null);
    }
  };

  // Filtrer et trier les commandes
  const filteredOrders = orders
    .filter((order) => {
      if (filterStatus === "all") return true;
      return order.status === filterStatus;
    })
    .sort((a, b) => {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "ready":
        return "bg-green-100 text-green-800 border-green-300";
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
      default:
        return status;
    }
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (error || !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Restaurant non trouvé"}
          </h1>
          <Button variant="primary" onClick={() => router.push("/restaurant/login")}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
              <span className="text-sm text-gray-500">
                {user?.email}
              </span>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: "orders", label: "📦 Commandes", count: orders.length, badge: newOrdersCount > 0 ? newOrdersCount : undefined },
              { id: "notifications", label: "🔔 Appels", count: notifications.length },
              { id: "qrcodes", label: "📱 QR Codes", count: tables.length },
              { id: "statistics", label: "📊 Statistiques" },
              { id: "menu", label: "🍽️ Menu" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
                {tab.badge && tab.badge > 0 && (
                  <span className="ml-2 bg-red-500 text-white py-0.5 px-2 rounded-full text-xs font-bold animate-pulse">
                    {tab.badge} nouveau{tab.badge > 1 ? 'x' : ''}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Demandes de service (Appel serveur / Addition) */}
        {serviceRequests.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceRequests.map((req) => (
              <div
                key={req.id}
                className={`p-4 rounded-xl shadow-lg border-2 animate-bounce-slow ${
                  req.type === "server"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">
                    {req.type === "server" ? "🛎️" : "🧾"}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {req.type === "server" ? "Appel Serveur" : "Demande Addition"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Table {req.tableNumber}
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleHandleRequest(req.id)}
                >
                  J&apos;y vais !
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Notification de nouvelle commande */}
        {showNotification && (
          <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-2xl p-4 animate-slide-down max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{notificationMessage}</p>
                <p className="text-sm text-green-100">Vérifiez l&apos;onglet Commandes</p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-white hover:text-green-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        )}
        {/* Onglet Commandes */}
        {activeTab === "orders" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Commandes
                {newOrdersCount > 0 && (
                  <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 animate-pulse">
                    {newOrdersCount} nouvelle{newOrdersCount > 1 ? 's' : ''}
                  </span>
                )}
              </h2>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "all" | "pending" | "preparing" | "ready"
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="all">Toutes</option>
                <option value="pending">En attente</option>
                <option value="preparing">En préparation</option>
                <option value="ready">Prêtes</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow">
                <p className="text-gray-500">Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Table {order.tableId.split("_").pop()}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm"
                        >
                          <div className="flex-1">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            {/* Afficher les options choisies */}
                            {item.sideNames && item.sideNames.length > 0 && (
                              <p className="text-xs text-gray-600 ml-2">
                                🍽️ {item.sideNames.join(', ')}
                              </p>
                            )}
                            {item.sauceNames && item.sauceNames.length > 0 && (
                              <p className="text-xs text-gray-600 ml-2">
                                🧂 {item.sauceNames.join(', ')}
                              </p>
                            )}
                          </div>
                          <span className="font-medium">
                            {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-lg font-bold">
                        Total: {order.total.toLocaleString("fr-FR")} FCFA
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintTicket(order)}
                        >
                          🖨️ Ticket
                        </Button>
                        {order.status === "pending" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "preparing")}
                          >
                            En préparation
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "ready")}
                          >
                            Prête
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Onglet Notifications */}
        {activeTab === "notifications" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Appels Table & Services</h2>
            {notifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">Aucun appel en attente</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-6 rounded-xl shadow-md border-l-4 bg-white ${
                    notif.type === 'call_waiter' ? 'border-blue-500' : 'border-orange-500'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-3xl">
                        {notif.type === 'call_waiter' ? '🛎️' : '🧾'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleTimeString() : 'À l\'instant'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Table {notif.tableId.split('_').pop()}
                    </h3>
                    <p className="text-gray-600 mb-6">{notif.message}</p>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => handleMarkNotifRead(notif.id)}
                    >
                      J&apos;y vais !
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Onglet QR Codes */}
        {activeTab === "qrcodes" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">QR Codes</h2>
              <div className="flex gap-2">
                {tables.length > 0 && (
                  <Button variant="primary" onClick={printAllQRCodes}>
                    🖨️ Imprimer tous
                  </Button>
                )}
              </div>
            </div>

            {/* Formulaire de création de tables */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Créer de nouvelles tables
              </h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de tables
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={numberOfTables}
                    onChange={(e) => setNumberOfTables(parseInt(e.target.value) || 0)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleGenerateTables}
                  disabled={generatingTables}
                >
                  {generatingTables ? "Génération..." : "Générer les QR codes"}
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                SERVA générera automatiquement un QR code unique pour chaque table
              </p>
            </div>

            {tables.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow">
                <p className="text-gray-500 mb-4">
                  Aucune table configurée. Créez des tables pour générer les QR codes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print:grid-cols-4">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="bg-white rounded-lg shadow p-6 print:shadow-none relative"
                  >
                    <button
                      onClick={() => handleDeleteTable(table.id)}
                      disabled={deletingTableId === table.id}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                      title="Supprimer"
                    >
                      {deletingTableId === table.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Table {table.tableNumber}
                      </h3>
                      <div id={`qrcode-${table.id}`} className="flex justify-center mb-4">
                        <QRCodeSVG
                          value={table.qrCodeUrl}
                          size={200}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <p className="text-xs text-gray-500 break-all mb-4">
                        {table.qrCodeUrl}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadQRCode(table)}
                        className="w-full"
                      >
                        📥 Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Onglet Statistiques */}
        {activeTab === "statistics" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                📥 Exporter CSV
              </Button>
            </div>

            {loadingStats ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : statistics ? (
              <div className="space-y-6">
                {/* Stats du jour */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Commandes du jour
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {statistics.totalOrdersToday}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Chiffre d&apos;affaires
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {statistics.totalRevenueToday.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Temps moyen préparation
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {statistics.averagePreparationTime > 0
                        ? `${Math.round(statistics.averagePreparationTime / 60000)} min`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Produits les plus commandés */}
                {statistics.mostOrderedProducts.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Produits les plus commandés
                    </h3>
                    <div className="space-y-2">
                      {statistics.mostOrderedProducts.slice(0, 10).map((product, idx) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between py-2 border-b"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400">#{idx + 1}</span>
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{product.quantity} commandes</p>
                            <p className="text-sm text-gray-500">
                              {product.revenue.toLocaleString("fr-FR")} FCFA
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commandes par table */}
                {statistics.ordersByTable.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Commandes par table (aujourd&apos;hui)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {statistics.ordersByTable.map((table) => (
                        <div
                          key={table.tableId}
                          className="border rounded-lg p-4"
                        >
                          <p className="font-semibold">
                            Table {table.tableId.split("_").pop()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {table.count} commande(s)
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {table.revenue.toLocaleString("fr-FR")} FCFA
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg bg-white p-12 text-center shadow">
                <p className="text-gray-500">Aucune statistique disponible</p>
              </div>
            )}
          </div>
        )}

        {/* Onglet Menu */}
        {activeTab === "menu" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
              <Link href={`/restaurant/dashboard/${restaurantId}/menu`}>
                <Button variant="primary">Gérer le menu</Button>
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">
                Gérez vos catégories, types et produits depuis la page de gestion du menu.
              </p>
              <Link href={`/restaurant/dashboard/${restaurantId}/menu`}>
                <Button variant="primary">Accéder à la gestion du menu</Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Styles pour l'impression */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          header,
          button,
          .no-print {
            display: none !important;
          }
          .print\\:grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

export default function RestaurantDashboardPage() {
  return (
    <ProtectedRoute>
      <RestaurantDashboardContent />
    </ProtectedRoute>
  );
}
