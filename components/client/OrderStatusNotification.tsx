"use client";

/**
 * Composant de suivi en temps réel des commandes actives
 *
 * Affiche uniquement les commandes en cours (pending, preparing, ready)
 * Pas d'historique - les commandes delivered/cancelled sont ignorées
 */

import { useState, useEffect } from "react";
import { Order } from "@/lib/types/order";
import { listenToTableOrders } from "@/services/kitchen-service";

interface OrderStatusNotificationProps {
  restaurantId: string;
  tableId: string;
}

export default function OrderStatusNotification({
  restaurantId,
  tableId,
}: OrderStatusNotificationProps) {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [notifiedOrderIds, setNotifiedOrderIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!restaurantId || !tableId) return;

    let unsubscribe: (() => void) | null = null;

    try {
      unsubscribe = listenToTableOrders(
        (tableOrders) => {
          // Ne garder QUE les commandes actives - pas d'historique
          const active = tableOrders.filter(
            (o) => o.status !== "delivered" && o.status !== "cancelled"
          );
          setActiveOrders(active);

          // Detecter les nouvelles commandes prêtes
          setNotifiedOrderIds((prevNotified) => {
            const newReadyOrders = tableOrders.filter(
              (order) =>
                order.status === "ready" && !prevNotified.has(order.id)
            );

            if (newReadyOrders.length > 0) {
              setReadyOrders(newReadyOrders);
              setShowNotification(true);

              const newSet = new Set(prevNotified);
              newReadyOrders.forEach((order) => newSet.add(order.id));

              playNotificationSound();

              setTimeout(() => {
                setShowNotification(false);
              }, 10000);

              return newSet;
            }

            return prevNotified;
          });
        },
        restaurantId,
        tableId
      );
    } catch (error) {
      console.error("Erreur lors de l'écoute des commandes:", error);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [restaurantId, tableId]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 600;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.8
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (err) {
      console.error("Erreur lors de la lecture du son:", err);
    }
  };

  const getStatusStep = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return 1;
      case "preparing":
        return 2;
      case "ready":
        return 3;
      default:
        return 0;
    }
  };

  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return { label: "Commande recue", color: "text-blue-600", bg: "bg-blue-100", icon: "📝" };
      case "preparing":
        return { label: "En preparation", color: "text-orange-600", bg: "bg-orange-100", icon: "👨‍🍳" };
      case "ready":
        return { label: "Prete !", color: "text-green-600", bg: "bg-green-100", icon: "✅" };
      default:
        return { label: status, color: "text-gray-600", bg: "bg-gray-100", icon: "📋" };
    }
  };

  if (activeOrders.length === 0) return null;

  return (
    <>
      {/* Suivi des commandes actives */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="animate-pulse">🔔</span> Suivi de vos commandes
          </h4>
          <div className="space-y-5">
            {activeOrders.map((order) => {
              const step = getStatusStep(order.status);
              const config = getStatusConfig(order.status);
              return (
                <div key={order.id} className="relative">
                  {/* Status badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500">
                      Commande #{order.id.slice(-4)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.color} ${config.bg}`}
                    >
                      <span>{config.icon}</span>
                      {config.label}
                    </span>
                  </div>

                  {/* Barre de progression */}
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out rounded-full ${
                        order.status === "ready"
                          ? "bg-gradient-to-r from-green-400 to-green-500"
                          : order.status === "preparing"
                          ? "bg-gradient-to-r from-orange-400 to-orange-500"
                          : "bg-gradient-to-r from-blue-400 to-blue-500"
                      }`}
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>

                  {/* Etapes */}
                  <div className="flex justify-between mt-2">
                    <div className="flex flex-col items-start">
                      <span
                        className={`text-xs font-semibold ${
                          step >= 1 ? "text-blue-600" : "text-gray-300"
                        }`}
                      >
                        📝 Recue
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-xs font-semibold ${
                          step >= 2 ? "text-orange-600" : "text-gray-300"
                        }`}
                      >
                        👨‍🍳 Cuisine
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs font-semibold ${
                          step >= 3 ? "text-green-600" : "text-gray-300"
                        }`}
                      >
                        ✅ Prete
                      </span>
                    </div>
                  </div>

                  {/* Articles de la commande */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {order.items.map((item: any, idx: number) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast notification quand commande prete */}
      {showNotification && readyOrders.length > 0 && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl p-5 border border-green-400">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
                  🎉
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">
                  Votre commande est prete !
                </h3>
                <p className="text-green-100 text-sm">
                  {readyOrders.length === 1
                    ? "Votre commande peut etre recuperee."
                    : `${readyOrders.length} commandes sont pretes.`}
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
