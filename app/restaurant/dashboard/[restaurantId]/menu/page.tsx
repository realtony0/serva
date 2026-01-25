"use client";

/**
 * Page de gestion du menu pour le restaurant
 * 
 * Permet de gérer catégories, types et produits
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getRestaurantById } from "@/services/restaurant-auth-service";
import {
  getCategoriesByRestaurant,
  getTypesByRestaurant,
  getProductsByRestaurant,
  createCategoryForRestaurant,
  createTypeForRestaurant,
  createProductForRestaurant,
  updateCategoryForRestaurant,
  updateTypeForRestaurant,
  updateProductForRestaurant,
  deleteCategoryForRestaurant,
  deleteTypeForRestaurant,
  deleteProductForRestaurant,
  getTypesByCategoryAndRestaurant,
} from "@/services/restaurant-menu-service";
import { Restaurant } from "@/lib/types/restaurant";
import {
  Category,
  MenuType,
  Product,
  CategoryFormData,
  MenuTypeFormData,
  ProductFormData,
} from "@/lib/types/menu";

type ActiveTab = "categories" | "types" | "products";

function RestaurantMenuContent() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<MenuType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Formulaires
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingType, setEditingType] = useState<MenuType | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: "",
    description: "",
    order: 0,
    isActive: true,
  });

  const [typeForm, setTypeForm] = useState<MenuTypeFormData>({
    name: "",
    categoryId: "",
    description: "",
    order: 0,
    isActive: true,
  });

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    categoryId: "",
    typeId: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    if (restaurantId) {
      loadRestaurant();
      loadAllData();
    }
  }, [restaurantId]);

  const loadRestaurant = async () => {
    try {
      const data = await getRestaurantById(restaurantId);
      if (!data) {
        setError("Restaurant non trouvé");
        return;
      }
      setRestaurant(data);
    } catch (err: any) {
      setError("Erreur lors du chargement du restaurant: " + err.message);
    }
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError("");
      const [cats, typs, prods] = await Promise.all([
        getCategoriesByRestaurant(restaurantId),
        getTypesByRestaurant(restaurantId),
        getProductsByRestaurant(restaurantId),
      ]);
      setCategories(cats);
      setTypes(typs);
      setProducts(prods);
    } catch (err: any) {
      console.error("Erreur lors du chargement:", err);
      setError("Erreur lors du chargement: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // États de chargement
  const [submittingCategory, setSubmittingCategory] = useState(false);
  const [submittingType, setSubmittingType] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deletingTypeId, setDeletingTypeId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Handlers pour catégories

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmittingCategory(true);

    try {
      if (editingCategory) {
        await updateCategoryForRestaurant(restaurantId, editingCategory.id, categoryForm);
        setSuccess("Catégorie mise à jour !");
      } else {
        await createCategoryForRestaurant(restaurantId, categoryForm);
        setSuccess("Catégorie créée !");
      }
      await loadAllData();
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryForm({ name: "", description: "", order: 0, isActive: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      setDeletingCategoryId(id);
      await deleteCategoryForRestaurant(restaurantId, id);
      await loadAllData();
      setSuccess("Catégorie supprimée !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingCategoryId(null);
    }
  };

  // Handlers pour types
  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmittingType(true);

    try {
      if (editingType) {
        await updateTypeForRestaurant(restaurantId, editingType.id, typeForm);
        setSuccess("Type mis à jour !");
      } else {
        await createTypeForRestaurant(restaurantId, typeForm);
        setSuccess("Type créé !");
      }
      await loadAllData();
      setShowTypeForm(false);
      setEditingType(null);
      setTypeForm({ name: "", categoryId: "", description: "", order: 0, isActive: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingType(false);
    }
  };

  const handleDeleteType = async (id: string) => {
    if (!confirm("Supprimer ce type ?")) return;
    try {
      setDeletingTypeId(id);
      await deleteTypeForRestaurant(restaurantId, id);
      await loadAllData();
      setSuccess("Type supprimé !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingTypeId(null);
    }
  };

  // Handlers pour produits
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmittingProduct(true);

    try {
      if (editingProduct) {
        await updateProductForRestaurant(restaurantId, editingProduct.id, productForm);
        setSuccess("Produit mis à jour !");
      } else {
        await createProductForRestaurant(restaurantId, productForm);
        setSuccess("Produit créé !");
      }
      await loadAllData();
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        categoryId: "",
        typeId: "",
        isActive: true,
        order: 0,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Désactiver ce produit ?")) return;
    try {
      setDeletingProductId(id);
      await deleteProductForRestaurant(restaurantId, id);
      await loadAllData();
      setSuccess("Produit désactivé !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingProductId(null);
    }
  };

  if (error && !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Restaurant non trouvé"}
          </h1>
          <Link href={`/restaurant/dashboard/${restaurantId}`}>
            <Button variant="primary">Retour</Button>
          </Link>
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
              <Link href={`/restaurant/dashboard/${restaurantId}`}>
                <Button variant="outline" size="sm">
                  ← Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gestion du Menu</h1>
                {restaurant && (
                  <p className="text-sm text-gray-500">{restaurant.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Messages */}
        {error && error !== "Restaurant non trouvé" && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              ✕ Fermer
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-medium text-green-800">{success}</p>
            <button
              onClick={() => setSuccess("")}
              className="mt-2 text-sm text-green-600 hover:text-green-800"
            >
              ✕ Fermer
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b">
          <nav className="flex space-x-8">
            {[
              { id: "categories", label: "Catégories", count: categories.length },
              { id: "types", label: "Types", count: types.length },
              { id: "products", label: "Produits", count: products.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu selon l'onglet */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Onglet Catégories */}
            {activeTab === "categories" && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Catégories</h2>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: "", description: "", order: 0, isActive: true });
                      setShowCategoryForm(true);
                    }}
                  >
                    + Ajouter
                  </Button>
                </div>

                {showCategoryForm && (
                  <div className="mb-6 bg-white rounded-lg shadow p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingCategory ? "Modifier" : "Nouvelle"} Catégorie
                    </h3>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryForm.name}
                          onChange={(e) =>
                            setCategoryForm({ ...categoryForm, name: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={categoryForm.description}
                          onChange={(e) =>
                            setCategoryForm({ ...categoryForm, description: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ordre
                          </label>
                          <input
                            type="number"
                            value={categoryForm.order}
                            onChange={(e) =>
                              setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={categoryForm.isActive}
                              onChange={(e) =>
                                setCategoryForm({ ...categoryForm, isActive: e.target.checked })
                              }
                              className="rounded"
                            />
                            <span className="text-sm">Active</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          variant="primary"
                          disabled={submittingCategory}
                          className="min-w-[120px]"
                        >
                          {submittingCategory ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Envoi...
                            </span>
                          ) : (
                            editingCategory ? "Modifier" : "Créer"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowCategoryForm(false);
                            setEditingCategory(null);
                            setCategoryForm({ name: "", description: "", order: 0, isActive: true });
                          }}
                          disabled={submittingCategory}
                        >
                          Annuler
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{cat.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setCategoryForm({
                                name: cat.name,
                                description: cat.description || "",
                                order: cat.order,
                                isActive: cat.isActive,
                              });
                              setShowCategoryForm(true);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors disabled:opacity-50"
                            title="Modifier"
                            disabled={deletingCategoryId === cat.id}
                          >
                            {deletingCategoryId === cat.id ? (
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              "✏️"
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
                            title="Supprimer"
                            disabled={deletingCategoryId === cat.id}
                          >
                            {deletingCategoryId === cat.id ? (
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              "🗑️"
                            )}
                          </button>
                        </div>
                      </div>
                      {cat.description && (
                        <p className="text-sm text-gray-600 mb-2">{cat.description}</p>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${cat.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Types */}
            {activeTab === "types" && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Types</h2>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setEditingType(null);
                      setTypeForm({ name: "", categoryId: "", description: "", order: 0, isActive: true });
                      setShowTypeForm(true);
                    }}
                  >
                    + Ajouter
                  </Button>
                </div>

                {showTypeForm && (
                  <div className="mb-6 bg-white rounded-lg shadow p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingType ? "Modifier" : "Nouveau"} Type
                    </h3>
                    <form onSubmit={handleTypeSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie *
                        </label>
                        <select
                          required
                          value={typeForm.categoryId}
                          onChange={(e) =>
                            setTypeForm({ ...typeForm, categoryId: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories
                            .filter((c) => c.isActive)
                            .map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          required
                          value={typeForm.name}
                          onChange={(e) =>
                            setTypeForm({ ...typeForm, name: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={typeForm.description}
                          onChange={(e) =>
                            setTypeForm({ ...typeForm, description: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ordre
                          </label>
                          <input
                            type="number"
                            value={typeForm.order}
                            onChange={(e) =>
                              setTypeForm({ ...typeForm, order: parseInt(e.target.value) || 0 })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={typeForm.isActive}
                              onChange={(e) =>
                                setTypeForm({ ...typeForm, isActive: e.target.checked })
                              }
                              className="rounded"
                            />
                            <span className="text-sm">Active</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          variant="primary"
                          disabled={submittingType}
                          className="min-w-[120px]"
                        >
                          {submittingType ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Envoi...
                            </span>
                          ) : (
                            editingType ? "Modifier" : "Créer"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowTypeForm(false);
                            setEditingType(null);
                            setTypeForm({ name: "", categoryId: "", description: "", order: 0, isActive: true });
                          }}
                          disabled={submittingType}
                        >
                          Annuler
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {categories
                    .filter((c) => c.isActive)
                    .map((cat) => {
                      const categoryTypes = types.filter(
                        (t) => t.categoryId === cat.id
                      );
                      return (
                        <div key={cat.id} className="bg-white rounded-lg shadow p-4">
                          <h3 className="font-semibold mb-3">{cat.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {categoryTypes.map((type) => (
                              <div
                                key={type.id}
                                className="border rounded-lg p-3 flex justify-between items-start hover:bg-gray-50 transition-colors"
                              >
                                <div>
                                  <p className="font-medium">{type.name}</p>
                                  {type.description && (
                                    <p className="text-sm text-gray-600">{type.description}</p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingType(type);
                                      setTypeForm({
                                        name: type.name,
                                        categoryId: type.categoryId,
                                        description: type.description || "",
                                        order: type.order,
                                        isActive: type.isActive,
                                      });
                                      setShowTypeForm(true);
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors disabled:opacity-50"
                                    title="Modifier"
                                    disabled={deletingTypeId === type.id}
                                  >
                                    {deletingTypeId === type.id ? (
                                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    ) : (
                                      "✏️"
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteType(type.id)}
                                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
                                    title="Supprimer"
                                    disabled={deletingTypeId === type.id}
                                  >
                                    {deletingTypeId === type.id ? (
                                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    ) : (
                                      "🗑️"
                                    )}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Onglet Produits */}
            {activeTab === "products" && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Produits</h2>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: "",
                        description: "",
                        price: 0,
                        imageUrl: "",
                        categoryId: "",
                        typeId: "",
                        isActive: true,
                        order: 0,
                      });
                      setShowProductForm(true);
                    }}
                  >
                    + Ajouter
                  </Button>
                </div>

                {showProductForm && (
                  <div className="mb-6 bg-white rounded-lg shadow p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingProduct ? "Modifier" : "Nouveau"} Produit
                    </h3>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom *
                          </label>
                          <input
                            type="text"
                            required
                            value={productForm.name}
                            onChange={(e) =>
                              setProductForm({ ...productForm, name: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix (FCFA) *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) =>
                              setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm({ ...productForm, description: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL Image
                        </label>
                        <input
                          type="url"
                          value={productForm.imageUrl}
                          onChange={(e) =>
                            setProductForm({ ...productForm, imageUrl: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catégorie *
                          </label>
                          <select
                            required
                            value={productForm.categoryId}
                            onChange={(e) => {
                              setProductForm({ ...productForm, categoryId: e.target.value, typeId: "" });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          >
                            <option value="">Sélectionner</option>
                            {categories
                              .filter((c) => c.isActive)
                              .map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type *
                          </label>
                          <select
                            required
                            value={productForm.typeId}
                            onChange={(e) =>
                              setProductForm({ ...productForm, typeId: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                            disabled={!productForm.categoryId}
                          >
                            <option value="">Sélectionner</option>
                            {types
                              .filter(
                                (t) =>
                                  t.categoryId === productForm.categoryId && t.isActive
                              )
                              .map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ordre
                          </label>
                          <input
                            type="number"
                            value={productForm.order}
                            onChange={(e) =>
                              setProductForm({ ...productForm, order: parseInt(e.target.value) || 0 })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={productForm.isActive}
                              onChange={(e) =>
                                setProductForm({ ...productForm, isActive: e.target.checked })
                              }
                              className="rounded"
                            />
                            <span className="text-sm">Active</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          variant="primary"
                          disabled={submittingProduct}
                          className="min-w-[120px]"
                        >
                          {submittingProduct ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Envoi...
                            </span>
                          ) : (
                            editingProduct ? "Modifier" : "Créer"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                            setProductForm({
                              name: "",
                              description: "",
                              price: 0,
                              imageUrl: "",
                              categoryId: "",
                              typeId: "",
                              isActive: true,
                              order: 0,
                            });
                          }}
                          disabled={submittingProduct}
                        >
                          Annuler
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products
                    .filter((p) => p.isActive)
                    .map((product) => {
                      const category = categories.find((c) => c.id === product.categoryId);
                      const type = types.find((t) => t.id === product.typeId);
                      return (
                        <div key={product.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          )}
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-gray-600">
                                {category?.name} - {type?.name}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductForm({
                                    name: product.name,
                                    description: product.description || "",
                                    price: product.price,
                                    imageUrl: product.imageUrl || "",
                                    categoryId: product.categoryId,
                                    typeId: product.typeId,
                                    isActive: product.isActive,
                                    order: product.order,
                                  });
                                  setShowProductForm(true);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors disabled:opacity-50"
                                title="Modifier"
                                disabled={deletingProductId === product.id}
                              >
                                {deletingProductId === product.id ? (
                                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  "✏️"
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
                                title="Supprimer"
                                disabled={deletingProductId === product.id}
                              >
                                {deletingProductId === product.id ? (
                                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  "🗑️"
                                )}
                              </button>
                            </div>
                          </div>
                          {product.description && (
                            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          )}
                          <p className="text-lg font-bold text-blue-600">
                            {product.price.toLocaleString("fr-FR")} FCFA
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function RestaurantMenuPage() {
  return (
    <ProtectedRoute>
      <RestaurantMenuContent />
    </ProtectedRoute>
  );
}

