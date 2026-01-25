"use client";

/**
 * Modal pour choisir les options (accompagnements et sauces) d'un produit
 */

import { useState, useEffect } from "react";
import { Product } from "@/lib/types/menu";
import { Button } from "@/components/ui/Button";

interface ProductOptionsModalProps {
  product: Product;
  availableSides: Product[]; // Liste des produits accompagnements
  availableSauces: Product[]; // Liste des produits sauces
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedSides: string[], selectedSauces: string[], sideNames: string[], sauceNames: string[]) => void;
}

export default function ProductOptionsModal({
  product,
  availableSides,
  availableSauces,
  isOpen,
  onClose,
  onConfirm,
}: ProductOptionsModalProps) {
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);

  const maxSides = product.maxSides || 3;
  const maxSauces = product.maxSauces || 1;

  // Réinitialiser les sélections quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setSelectedSides([]);
      setSelectedSauces([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSideToggle = (sideId: string) => {
    if (selectedSides.includes(sideId)) {
      setSelectedSides(selectedSides.filter((id) => id !== sideId));
    } else {
      if (selectedSides.length < maxSides) {
        setSelectedSides([...selectedSides, sideId]);
      } else {
        alert(`Vous pouvez sélectionner au maximum ${maxSides} accompagnement(s)`);
      }
    }
  };

  const handleSauceToggle = (sauceId: string) => {
    if (selectedSauces.includes(sauceId)) {
      setSelectedSauces(selectedSauces.filter((id) => id !== sauceId));
    } else {
      if (selectedSauces.length < maxSauces) {
        setSelectedSauces([...selectedSauces, sauceId]);
      } else {
        alert(`Vous pouvez sélectionner au maximum ${maxSauces} sauce(s)`);
      }
    }
  };

  const handleConfirm = () => {
    const sideNames = selectedSides.map(
      (id) => availableSides.find((s) => s.id === id)?.name || ""
    );
    const sauceNames = selectedSauces.map(
      (id) => availableSauces.find((s) => s.id === id)?.name || ""
    );
    onConfirm(selectedSides, selectedSauces, sideNames, sauceNames);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Accompagnements */}
          {availableSides.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Accompagnements
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (max {maxSides})
                </span>
              </h3>
              <div className="space-y-2">
                {availableSides.map((side) => (
                  <label
                    key={side.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSides.includes(side.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSides.includes(side.id)}
                      onChange={() => handleSideToggle(side.id)}
                      className="mr-3 w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {side.name}
                      </span>
                      {/* Afficher le prix uniquement si > 0 (ex: Gratin dauphinois) */}
                      {side.price > 0 && (
                        <span className="text-sm font-semibold text-blue-600 ml-2">
                          +{side.price.toLocaleString("fr-FR")} FCFA
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sauces */}
          {availableSauces.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sauces
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (max {maxSauces})
                </span>
              </h3>
              <div className="space-y-2">
                {availableSauces.map((sauce) => (
                  <label
                    key={sauce.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSauces.includes(sauce.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSauces.includes(sauce.id)}
                      onChange={() => handleSauceToggle(sauce.id)}
                      className="mr-3 w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {sauce.name}
                      </span>
                      {/* Les sauces sont toutes gratuites, pas besoin d'afficher le prix */}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Message si aucune option */}
          {availableSides.length === 0 && availableSauces.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucune option disponible pour ce produit
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            className="flex-1"
          >
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
}

