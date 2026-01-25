"use client";

/**
 * Affichage du menu avec filtres par catégorie et type
 */

import { useState, useMemo } from "react";
import { Category, MenuType, Product } from "@/lib/types/menu";
import { Button } from "@/components/ui/Button";
import ProductOptionsModal from "./ProductOptionsModal";
import { getCategoryIcon } from "@/lib/utils/category-icons";

interface MenuDisplayProps {
  categories: Category[];
  types: MenuType[];
  products: Product[];
  onAddToCart: (product: Product, selectedSides?: string[], selectedSauces?: string[], sideNames?: string[], sauceNames?: string[]) => void;
  language?: "fr" | "en";
}

export default function MenuDisplay({
  categories,
  types,
  products,
  onAddToCart,
  language = "fr",
}: MenuDisplayProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");

  // Filtrer les types selon la catégorie sélectionnée
  const filteredTypes = useMemo(() => {
    if (!selectedCategoryId) return types;
    return types.filter((type) => type.categoryId === selectedCategoryId);
  }, [selectedCategoryId, types]);

  // Filtrer les produits selon les filtres
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategoryId) {
      filtered = filtered.filter(
        (product) => product.categoryId === selectedCategoryId
      );
    }

    if (selectedTypeId) {
      filtered = filtered.filter((product) => product.typeId === selectedTypeId);
    }

    return filtered;
  }, [selectedCategoryId, selectedTypeId, products]);

  // Grouper les produits par catégorie pour l'affichage
  const productsByCategory = useMemo(() => {
    const grouped: { [key: string]: Product[] } = {};

    filteredProducts.forEach((product) => {
      const category = categories.find((c) => c.id === product.categoryId);
      const categoryName = category?.name || "Autres";

      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });

    return grouped;
  }, [filteredProducts, categories]);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Inconnu";
  };

  const getTypeName = (typeId: string) => {
    return types.find((t) => t.id === typeId)?.name || "Inconnu";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Filtres */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategoryId("");
              setSelectedTypeId("");
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${
              !selectedCategoryId
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105"
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-105"
            }`}
          >
            ✨ Toutes
          </button>
          {categories.map((category) => {
            const icon = category.icon || getCategoryIcon(category.name);
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setSelectedTypeId("");
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm flex items-center gap-2 ${
                  selectedCategoryId === category.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-105"
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {selectedCategoryId && filteredTypes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTypeId("")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                !selectedTypeId
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tous
            </button>
            {filteredTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedTypeId(type.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedTypeId === type.id
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Liste des produits */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(productsByCategory).map(([categoryName, prods]) => {
            const category = categories.find(c => c.name === categoryName);
            const icon = category?.icon || getCategoryIcon(categoryName);
            return (
              <div key={categoryName} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"></div>
                  <span className="text-4xl">{icon}</span>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {categoryName}
                  </h2>
                  <div className="h-1 flex-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"></div>
                </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prods.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    typeName={getTypeName(product.typeId)}
                    onAddToCart={(selectedSides, selectedSauces, sideNames, sauceNames) => 
                      onAddToCart(product, selectedSides, selectedSauces, sideNames, sauceNames)
                    }
                    allProducts={products}
                    categories={categories}
                  />
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  typeName,
  onAddToCart,
  allProducts,
  categories,
}: {
  product: Product;
  typeName: string;
  onAddToCart: (selectedSides?: string[], selectedSauces?: string[], sideNames?: string[], sauceNames?: string[]) => void;
  allProducts: Product[];
  categories: Category[];
}) {
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Trouver les catégories d'accompagnements et sauces
  const accompagnementsCategory = categories.find(c => c.name.toLowerCase().includes('accompagnement'));
  const saucesCategory = categories.find(c => c.name.toLowerCase().includes('sauce'));

  // Filtrer les produits accompagnements et sauces disponibles
  const availableSides = allProducts.filter(p => 
    accompagnementsCategory && p.categoryId === accompagnementsCategory.id
  );
  const availableSauces = allProducts.filter(p => 
    saucesCategory && p.categoryId === saucesCategory.id
  );

  const handleAddClick = () => {
    // Vérifier si le produit doit avoir des options
    // Soit via hasOptions, soit si c'est une viande/poisson (pas un accompagnement/sauce)
    const isMeatOrFish = !accompagnementsCategory || product.categoryId !== accompagnementsCategory.id;
    const isNotSauce = !saucesCategory || product.categoryId !== saucesCategory.id;
    const shouldShowOptions = (product.hasOptions || (isMeatOrFish && isNotSauce)) && 
                              (availableSides.length > 0 || availableSauces.length > 0);

    if (shouldShowOptions) {
      setShowOptionsModal(true);
    } else {
      onAddToCart();
    }
  };

  const handleConfirmOptions = (selectedSides: string[], selectedSauces: string[], sideNames: string[], sauceNames: string[]) => {
    onAddToCart(selectedSides, selectedSauces, sideNames, sauceNames);
    setShowOptionsModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200">
        {product.imageUrl ? (
          <div className="relative aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <svg className="w-16 h-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )}
        <div className="p-5">
          <div className="mb-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </div>
            <p className="text-xs text-gray-500 font-medium">{typeName}</p>
          </div>
          {product.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
          {product.hasOptions && (
            <div className="mb-3 inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Options disponibles
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                {product.price.toLocaleString('fr-FR')}
              </span>
              <span className="text-sm text-gray-500 ml-1">FCFA</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddClick}
              className="ml-2 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg rounded-full px-5"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter
              </span>
            </Button>
          </div>
        </div>
      </div>

      {showOptionsModal && (
        <ProductOptionsModal
          product={product}
          availableSides={availableSides}
          availableSauces={availableSauces}
          isOpen={showOptionsModal}
          onClose={() => setShowOptionsModal(false)}
          onConfirm={handleConfirmOptions}
        />
      )}
    </>
  );
}

