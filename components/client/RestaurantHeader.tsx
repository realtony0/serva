"use client";

/**
 * Header avec les informations du restaurant et de la table
 * Affiche le QR code scanné pour référence
 */

import { useState } from "react";
import { Restaurant } from "@/lib/types/restaurant";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  tableId: string;
}

export default function RestaurantHeader({
  restaurant,
  tableId,
}: RestaurantHeaderProps) {
  const [showQRInfo, setShowQRInfo] = useState(false);

  const tableNumber = tableId.split("_").pop() || tableId;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center gap-4">
          {restaurant.logoUrl && (
            <div className="relative">
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="h-16 w-16 rounded-xl object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-5 h-5 border-2 border-white"></div>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="text-sm text-blue-100 line-clamp-1">
                {restaurant.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center border border-white/30">
              <div className="text-xs text-blue-100 font-medium mb-1">Table</div>
              <div className="text-2xl font-bold text-white">#{tableNumber}</div>
            </div>
            <button
              onClick={() => setShowQRInfo(!showQRInfo)}
              className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 transition-all hover:scale-105"
              title="Informations QR code"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Info QR Code */}
        {showQRInfo && (
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white mb-1">
                  QR Code scanné
                </p>
                <p className="text-xs text-blue-100">
                  Restaurant: {restaurant.name} | Table: #{tableNumber}
                </p>
                <p className="text-xs text-blue-200 mt-1">
                  Cette page est unique à votre table
                </p>
              </div>
              <button
                onClick={() => setShowQRInfo(false)}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

