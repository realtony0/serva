"use client";

/**
 * Panier flottant pour mobile
 * Affiche les articles, permet de modifier les quantités et passer commande
 */

import { useState } from "react";
import { CartItem } from "@/lib/types/cart";
import { Button } from "@/components/ui/Button";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  total: number;
  restaurantId: string;
  tableId: string;
}

export default function Cart({
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
  total,
  restaurantId,
  tableId,
}: CartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    // Vérifier que restaurantId et tableId sont présents
    if (!restaurantId || !tableId) {
      alert("❌ Erreur : Informations de table manquantes. Veuillez scanner le QR code à nouveau.");
      return;
    }

    // Confirmation avant envoi avec détails
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const confirmed = confirm(
      `Confirmer la commande ?\n\n` +
      `📋 Restaurant: ${restaurantId.substring(0, 20)}...\n` +
      `🪑 Table: ${tableId}\n` +
      `📦 Articles: ${itemCount}\n` +
      `💰 Total: ${total.toLocaleString('fr-FR')} FCFA\n\n` +
      `La commande sera envoyée au restaurant.`
    );

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      // Importer et créer la commande
      const { createOrder } = await import("@/services/order-service");
      
      // Créer la commande dans Firestore
      const orderId = await createOrder(restaurantId, tableId, items);
      
      // Message de succès avec toutes les informations
      const successMessage = 
        `✅ Commande envoyée avec succès !\n\n` +
        `📋 Numéro de commande:\n${orderId}\n\n` +
        `🪑 Table: ${tableId}\n` +
        `📦 Articles: ${itemCount}\n` +
        `💰 Total: ${total.toLocaleString('fr-FR')} FCFA\n\n` +
        `Votre commande est en cours de préparation.\n` +
        `Vous serez notifié lorsqu'elle sera prête.`;
      
      alert(successMessage);
      
      // Vider le panier après commande réussie
      onClear();
      setIsOpen(false);
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de la commande:", error);
      
      // Message d'erreur détaillé
      const errorMessage = 
        `❌ Erreur lors de l'envoi de la commande\n\n` +
        `${error.message || "Erreur inconnue"}\n\n` +
        `Veuillez réessayer ou contacter le service.`;
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Bouton panier flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-5 shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 z-30 flex items-center gap-2 active:scale-95 group"
        aria-label="Ouvrir le panier"
      >
        <svg
          className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-lg animate-bounce border-2 border-white">
            {items.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panier slide-up */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Mon Panier
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {items.reduce((sum, item) => sum + item.quantity, 0)} article(s)
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              aria-label="Fermer le panier"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-gray-500">Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={item.productId}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer avec total et bouton commander */}
          {items.length > 0 && (
            <div className="border-t bg-gray-50 p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Articles</span>
                  <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClear}
                  disabled={isSubmitting}
                >
                  Vider
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 font-bold text-lg py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all rounded-xl"
                  onClick={handleCheckout}
                  disabled={isSubmitting || items.length === 0}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Commander
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  const subtotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border-2 border-gray-200 shadow-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 border-2 border-gray-200">
          <svg
            className="w-10 h-10 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-base truncate mb-1">{item.name}</h3>
        {/* Afficher les options choisies */}
        {item.sideNames && item.sideNames.length > 0 && (
          <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
            <span className="text-blue-500">🍽️</span>
            <span>{item.sideNames.join(', ')}</span>
          </p>
        )}
        {item.sauceNames && item.sauceNames.length > 0 && (
          <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
            <span className="text-orange-500">🧂</span>
            <span>{item.sauceNames.join(', ')}</span>
          </p>
        )}
        <p className="text-xs text-gray-500 mb-2">
          {item.price.toLocaleString('fr-FR')} FCFA × {item.quantity}
        </p>
        <p className="text-lg font-bold text-blue-600">
          {subtotal.toLocaleString('fr-FR')} FCFA
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl p-1.5 shadow-sm">
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg transition-all active:scale-95 hover:scale-110"
            aria-label="Diminuer la quantité"
          >
            −
          </button>
          <span className="w-12 text-center font-bold text-gray-900 text-lg">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="w-9 h-9 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-lg transition-all active:scale-95 hover:scale-110"
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>
        <button
          onClick={() => onRemove(item.productId)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2 transition-all active:scale-95"
          aria-label="Supprimer"
          title="Supprimer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

