"use client";

/**
 * Page de génération et affichage des QR codes pour un restaurant
 * 
 * Affiche tous les QR codes des tables du restaurant
 * Permet de télécharger ou imprimer les QR codes
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedAdminRoute } from "@/components/auth/ProtectedAdminRoute";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  getTablesByRestaurant,
  createTablesForRestaurant,
} from "@/services/table-service";
import { getRestaurantById } from "@/services/restaurant-service";
import { Table } from "@/lib/types/table";
import { Restaurant } from "@/lib/types/restaurant";
import { QRCodeSVG } from "qrcode.react";

function QRCodePageContent() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [numberOfTables, setNumberOfTables] = useState(10);

  useEffect(() => {
    if (restaurantId) {
      loadData();
    }
  }, [restaurantId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [restaurantData, tablesData] = await Promise.all([
        getRestaurantById(restaurantId),
        getTablesByRestaurant(restaurantId),
      ]);

      if (!restaurantData) {
        setError("Restaurant non trouvé");
        return;
      }

      setRestaurant(restaurantData);
      setTables(tablesData);
    } catch (err: any) {
      setError("Erreur lors du chargement: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTables = async () => {
    if (numberOfTables <= 0 || numberOfTables > 100) {
      alert("Le nombre de tables doit être entre 1 et 100");
      return;
    }

    try {
      setGenerating(true);
      const baseUrl = window.location.origin;
      await createTablesForRestaurant(restaurantId, numberOfTables, baseUrl);
      await loadData(); // Recharger les tables
      alert(`${numberOfTables} tables créées avec succès !`);
    } catch (err: any) {
      alert("Erreur lors de la création: " + err.message);
    } finally {
      setGenerating(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Restaurant non trouvé"}
          </h1>
          <Button variant="primary" onClick={() => router.push("/dashboard/restaurants")}>
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
              <Link href="/dashboard/restaurants">
                <Button variant="outline" size="sm">
                  ← Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  QR Codes - {restaurant.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {tables.length} table(s) configurée(s)
                </p>
              </div>
            </div>
            {tables.length > 0 && (
              <Button variant="primary" onClick={printAllQRCodes}>
                🖨️ Imprimer tous
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Génération de tables */}
        {tables.length === 0 && (
          <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Créer les tables pour ce restaurant
            </h2>
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
                disabled={generating}
              >
                {generating ? "Génération..." : "Générer les QR codes"}
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              SERVA générera automatiquement un QR code unique pour chaque table
            </p>
          </div>
        )}

        {/* Liste des QR codes */}
        {tables.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print:grid-cols-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className="bg-white rounded-lg shadow p-6 print:shadow-none"
              >
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
        ) : (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-gray-500">
              Aucune table configurée. Créez les tables pour générer les QR codes.
            </p>
          </div>
        )}

        {/* Instructions */}
        {tables.length > 0 && (
          <div className="mt-8 rounded-lg bg-yellow-50 border border-yellow-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📋 Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Téléchargez ou imprimez les QR codes</li>
              <li>Placez un QR code sur chaque table du restaurant</li>
              <li>Les clients scannent le QR code pour accéder au menu et commander</li>
              <li>La cuisine voit les commandes en temps réel dans le dashboard</li>
            </ol>
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

export default function QRCodePage() {
  return (
    <ProtectedAdminRoute>
      <QRCodePageContent />
    </ProtectedAdminRoute>
  );
}

