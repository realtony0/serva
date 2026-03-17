"use client";

/**
 * Page de gestion des restaurants
 * 
 * Permet de créer, lister et gérer les restaurants
 * Les données sont sauvegardées dans Firestore
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedAdminRoute } from "@/components/auth/ProtectedAdminRoute";
import { Button } from "@/components/ui/Button";
import {
  getAllRestaurants,
  createRestaurant,
  deleteRestaurant,
} from "@/services/restaurant-service";
import { Restaurant, RestaurantFormData } from "@/lib/types/restaurant";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmModal";
import Link from "next/link";

function RestaurantsContent() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatingForId, setGeneratingForId] = useState<string | null>(null);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  // Formulaire
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    description: "",
    logoUrl: "",
    ownerEmail: "",
    numberOfTables: 0,
  });

  // Charger les restaurants au montage
  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getAllRestaurants();
      setRestaurants(data);
    } catch (err: any) {
      setError("Erreur lors du chargement des restaurants: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error("Le nom du restaurant est requis");
      }
      if (!formData.description.trim()) {
        throw new Error("La description est requise");
      }
      if (formData.logoUrl && !isValidUrl(formData.logoUrl)) {
        throw new Error("L'URL du logo n'est pas valide");
      }

      const restaurantId = await createRestaurant(formData);
      
      // Créer les tables pour ce restaurant
      if (formData.numberOfTables && formData.numberOfTables > 0) {
        const { createTablesForRestaurant } = await import("@/services/table-service");
        const baseUrl = window.location.origin;
        await createTablesForRestaurant(restaurantId, formData.numberOfTables, baseUrl);
      }
      
      setSuccess("Restaurant créé avec succès ! Les QR codes ont été générés.");
      setFormData({ name: "", description: "", logoUrl: "", ownerEmail: "", numberOfTables: 0 });
      setShowForm(false);
      await loadRestaurants(); // Recharger la liste
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du restaurant");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateQRCodes = async (restaurantId: string, numberOfTables: number) => {
    if (numberOfTables <= 0) {
      showToast("Ce restaurant n'a pas de tables configurees.", "error");
      return;
    }

    try {
      setGeneratingForId(restaurantId);
      const { createTablesForRestaurant } = await import("@/services/table-service");
      const { getBaseUrl } = await import("@/lib/utils/url");
      const baseUrl = getBaseUrl();
      await createTablesForRestaurant(restaurantId, numberOfTables, baseUrl);
      setSuccess("QR codes générés avec succès !");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError("Erreur lors de la génération: " + err.message);
    } finally {
      setGeneratingForId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({ message: "Etes-vous sur de vouloir supprimer ce restaurant ?" });
    if (!ok) return;

    try {
      await deleteRestaurant(id);
      setSuccess("Restaurant supprimé avec succès !");
      await loadRestaurants(); // Recharger la liste
    } catch (err: any) {
      setError("Erreur lors de la suppression: " + err.message);
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  ← Retour
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion des Restaurants
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Bouton pour afficher/masquer le formulaire */}
        <div className="mb-6">
          <Button
            variant={showForm ? "secondary" : "primary"}
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setSuccess("");
            }}
          >
            {showForm ? "Annuler" : "+ Ajouter un restaurant"}
          </Button>
        </div>

        {/* Formulaire de création */}
        {showForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Nouveau Restaurant
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nom du restaurant *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                  placeholder="Ex: Le Gourmet Parisien"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                  placeholder="Décrivez le restaurant..."
                />
              </div>

              <div>
                <label
                  htmlFor="logoUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  URL du logo
                </label>
                <input
                  id="logoUrl"
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                  placeholder="https://example.com/logo.png"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL complète vers l&apos;image du logo
                </p>
              </div>

              <div>
                <label
                  htmlFor="numberOfTables"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre de tables *
                </label>
                <input
                  id="numberOfTables"
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formData.numberOfTables || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfTables: parseInt(e.target.value) || 0 })
                  }
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                  placeholder="10"
                />
                <p className="mt-1 text-xs text-gray-500">
                  SERVA générera automatiquement un QR code unique pour chaque table
                </p>
              </div>

              <div>
                <label
                  htmlFor="ownerEmail"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email du propriétaire (optionnel)
                </label>
                <input
                  id="ownerEmail"
                  type="email"
                  value={formData.ownerEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerEmail: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                  placeholder="restaurant@example.com"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email de l&apos;utilisateur qui pourra se connecter pour gérer ce restaurant.
                  Utilisez le script <code className="bg-gray-100 px-1 rounded">set-restaurant-owner.js</code> pour lier avec l&apos;UID.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="min-w-[120px]"
                >
                  {submitting ? "Création..." : "Créer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: "", description: "", logoUrl: "", ownerEmail: "", numberOfTables: 0 });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des restaurants */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Liste des Restaurants ({restaurants.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow">
              <p className="text-gray-500">
                Aucun restaurant pour le moment. Créez-en un pour commencer !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    {restaurant.logoUrl && (
                      <img
                        src={restaurant.logoUrl}
                        alt={restaurant.name}
                        className="h-16 w-16 rounded-lg object-cover mb-4"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <button
                      onClick={() => handleDelete(restaurant.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Supprimer"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {restaurant.description}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    Créé le{" "}
                    {new Date(restaurant.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/restaurants/${restaurant.id}/qrcodes`} className="flex-1">
                        <Button variant="primary" size="sm" className="w-full">
                          📱 Voir
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleGenerateQRCodes(restaurant.id, (restaurant as any).numberOfTables)}
                        disabled={generatingForId === restaurant.id}
                      >
                        {generatingForId === restaurant.id ? "..." : "🔄 Générer"}
                      </Button>
                    </div>
                    {restaurant.ownerId && (
                      <>
                        <Link href={`/restaurant/dashboard/${restaurant.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Dashboard restaurant
                          </Button>
                        </Link>
                        <p className="text-xs text-gray-500 mt-2">
                          Restaurant lié à un utilisateur
                        </p>
                      </>
                    )}
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

export default function RestaurantsPage() {
  return (
    <ProtectedAdminRoute>
      <RestaurantsContent />
    </ProtectedAdminRoute>
  );
}

