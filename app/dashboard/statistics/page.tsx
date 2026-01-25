"use client";

/**
 * Page Statistiques pour SERVA
 * 
 * Affiche les statistiques des commandes :
 * - Nombre de commandes du jour
 * - Produits les plus commandés
 * - Temps moyen de préparation
 * - Commandes par table
 */

import { useState, useEffect } from "react";
import { ProtectedAdminRoute } from "@/components/auth/ProtectedAdminRoute";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  calculateStatistics,
  Statistics,
} from "@/services/statistics-service";
import { getAllRestaurants } from "@/services/restaurant-service";
import { Restaurant } from "@/lib/types/restaurant";

function StatisticsContent() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

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

  useEffect(() => {
    loadStatistics();
  }, [selectedRestaurantId]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError("");
      const restaurantId = selectedRestaurantId !== "all" ? selectedRestaurantId : undefined;
      const stats = await calculateStatistics(restaurantId);
      setStatistics(stats);
      setLastUpdate(new Date());
    } catch (err: any) {
      setError("Erreur lors du chargement: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de chargement
          </h1>
          <p className="text-gray-600 mb-4">{error || "Données non disponibles"}</p>
          <Button variant="primary" onClick={loadStatistics}>
            Réessayer
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
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  ← Retour
                </Button>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Statistiques
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={loadStatistics}>
              🔄 Actualiser
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Info de mise à jour */}
        <div className="mb-6 text-sm text-gray-500">
          Dernière mise à jour : {lastUpdate.toLocaleTimeString("fr-FR")}
        </div>

        {/* Cartes principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Commandes du jour */}
          <StatCard
            title="Commandes du jour"
            value={statistics.totalOrdersToday}
            icon="📦"
            color="blue"
          />

          {/* Chiffre d&apos;affaires du jour */}
          <StatCard
            title="Chiffre d&apos;affaires"
            value={`${statistics.totalRevenueToday.toLocaleString('fr-FR')} FCFA`}
            icon="💰"
            color="green"
          />

          {/* Temps moyen de préparation */}
          <StatCard
            title="Temps moyen"
            value={formatTime(statistics.averagePreparationTime)}
            icon="⏱️"
            color="orange"
          />
        </div>

        {/* Commandes par statut */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Commandes par statut (aujourd&apos;hui)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <StatusCard
              status="En attente"
              count={statistics.ordersByStatus.pending}
              color="yellow"
            />
            <StatusCard
              status="En préparation"
              count={statistics.ordersByStatus.preparing}
              color="blue"
            />
            <StatusCard
              status="Prêtes"
              count={statistics.ordersByStatus.ready}
              color="green"
            />
            <StatusCard
              status="Livrées"
              count={statistics.ordersByStatus.delivered}
              color="gray"
            />
            <StatusCard
              status="Annulées"
              count={statistics.ordersByStatus.cancelled}
              color="red"
            />
          </div>
        </div>

        {/* Produits les plus commandés */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Produits les plus commandés
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chiffre d&apos;affaires
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statistics.mostOrderedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        Aucun produit commandé
                      </td>
                    </tr>
                  ) : (
                    statistics.mostOrderedProducts.map((product, index) => (
                      <tr key={product.productId} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              #{index + 1}
                            </span>
                            <span className="text-sm text-gray-900">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700 font-semibold">
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700 font-semibold">
                            {product.revenue.toLocaleString('fr-FR')} FCFA
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Commandes par table */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Commandes par table (aujourd&apos;hui)
          </h2>
          {statistics.ordersByTable.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Aucune commande aujourd&apos;hui</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {statistics.ordersByTable.map((table) => (
                <div
                  key={table.tableId}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🪑</span>
                      <h3 className="text-lg font-bold text-gray-900">
                        Table #{table.tableId}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Commandes:</span>
                      <span className="font-semibold text-gray-900">
                        {table.count}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold text-blue-600">
                        {table.revenue.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: string;
  color: "blue" | "green" | "orange" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  status,
  count,
  color,
}: {
  status: string;
  count: number;
  color: "yellow" | "blue" | "green" | "gray" | "red";
}) {
  const colorClasses = {
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
    blue: "bg-blue-100 text-blue-800 border-blue-300",
    green: "bg-green-100 text-green-800 border-green-300",
    gray: "bg-gray-100 text-gray-800 border-gray-300",
    red: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div
      className={`rounded-lg p-4 border-2 text-center ${colorClasses[color]}`}
    >
      <p className="text-sm font-medium mb-1">{status}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
}

export default function StatisticsPage() {
  return (
    <ProtectedAdminRoute>
      <StatisticsContent />
    </ProtectedAdminRoute>
  );
}

