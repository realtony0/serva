"use client";

/**
 * Composant de notification pour le statut des commandes
 * 
 * Affiche un message quand une commande est prête
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [notifiedOrderIds, setNotifiedOrderIds] = useState<Set<string>>(
    new Set()
  );

  // Écouter les commandes de la table en temps réel
  useEffect(() => {
    if (!restaurantId || !tableId) return;

    let unsubscribe: (() => void) | null = null;
    
    try {
      unsubscribe = listenToTableOrders(
        (tableOrders) => {
          setOrders(tableOrders);
          
          // Filtrer les commandes prêtes qui n'ont pas encore été notifiées
          setNotifiedOrderIds((prevNotified) => {
            const newReadyOrders = tableOrders.filter(
              (order) =>
                order.status === "ready" && !prevNotified.has(order.id)
            );

            if (newReadyOrders.length > 0) {
              setReadyOrders(newReadyOrders);
              setShowNotification(true);

              // Ajouter les IDs aux commandes notifiées
              const newSet = new Set(prevNotified);
              newReadyOrders.forEach((order) => newSet.add(order.id));

              // Jouer un son de notification
              playNotificationSound();

              // Masquer automatiquement après 10 secondes
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

      // Son plus agréable pour une notification positive
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
      case "pending": return 1;
      case "preparing": return 2;
      case "ready": return 3;
      case "delivered": return 4;
      default: return 0;
    }
  };

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "Reçue";
      case "preparing": return "En cuisine";
      case "ready": return "Prête !";
      case "delivered": return "Servie";
      case "cancelled": return "Annulée";
      default: return status;
    }
  };

  const activeOrders = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled");

  return (
    <>
      {/* Barre de progression pour les commandes actives */}
      {activeOrders.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-4" role="region" aria-label="Suivi des commandes">
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4" aria-live="polite">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="animate-pulse" aria-hidden="true">🔥</span> Suivi de vos commandes ({activeOrders.length})
            </h4>
            <div className="space-y-6">
              {activeOrders.map(order => {
                const step = getStatusStep(order.status);
                return (
                  <div key={order.id} className="relative">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium text-blue-600">#{order.id.slice(-4)}</span>
                      <span className="text-xs font-bold text-gray-900">{getStatusLabel(order.status)}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${
                          order.status === "ready" ? "bg-green-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${(step / 3) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className={`text-[10px] ${step >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>Reçue</span>
                      <span className={`text-[10px] ${step >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>Cuisine</span>
                      <span className={`text-[10px] ${step >= 3 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>Prête</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast (existant) */}
      {showNotification && readyOrders.length > 0 && (
        <div
          className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-slide-down"
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-green-500 text-white rounded-lg shadow-2xl p-6 border-2 border-green-600">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Votre commande est prête !</h3>
                <p className="text-green-50 mb-3">
                  {readyOrders.length === 1
                    ? "Votre commande peut être récupérée."
                    : `${readyOrders.length} de vos commandes sont prêtes.`}
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="flex-shrink-0 text-white hover:text-green-100 transition-colors"
                aria-label="Fermer la notification"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

