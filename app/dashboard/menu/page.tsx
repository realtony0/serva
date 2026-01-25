"use client";

/**
 * Page de gestion du menu
 * 
 * Permet de gérer les catégories, types et produits
 * Interface mobile-first avec filtrage
 */

import { useState, useEffect } from "react";
import { ProtectedAdminRoute } from "@/components/auth/ProtectedAdminRoute";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  getAllCategories,
  getAllTypes,
  getAllProducts,
  getTypesByCategory,
  getProductsByCategory,
  getProductsByCategoryAndType,
  createCategory,
  createType,
  createProduct,
  updateCategory,
  updateType,
  updateProduct,
  updateProductStock,
  deleteCategory,
  deleteType,
  deleteProduct,
} from "@/services/menu-service";
import { getAllRestaurants } from "@/services/restaurant-service";
import {
  Category,
  MenuType,
  Product,
  CategoryFormData,
  MenuTypeFormData,
  ProductFormData,
} from "@/lib/types/menu";
import { Restaurant } from "@/lib/types/restaurant";

type ActiveTab = "categories" | "types" | "products";

function MenuContent() {
  // État principal
  const [activeTab, setActiveTab] = useState<ActiveTab>("categories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sélection de restaurant
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("all");

  // Données
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<MenuType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Filtres
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");

  // Formulaires
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingItem, setEditingItem] = useState<
    Category | MenuType | Product | null
  >(null);

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

  // Charger toutes les données
  useEffect(() => {
    loadAllData();
  }, [selectedRestaurantId]);

  // Recharger les types quand la catégorie change
  useEffect(() => {
    if (selectedCategoryId) {
      loadTypesByCategory(selectedCategoryId);
    } else {
      loadAllTypes();
    }
  }, [selectedCategoryId]);

  // Recharger les produits quand les filtres changent
  useEffect(() => {
    if (selectedCategoryId && selectedTypeId) {
      loadProductsByFilters(selectedCategoryId, selectedTypeId);
    } else if (selectedCategoryId) {
      loadProductsByCategory(selectedCategoryId);
    } else {
      loadAllProducts();
    }
  }, [selectedCategoryId, selectedTypeId]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [cats, typs, prods] = await Promise.all([
        getAllCategories(),
        getAllTypes(),
        getAllProducts(),
      ]);
      
      // Filtrer par restaurant si sélectionné
      let filteredCats = cats;
      let filteredTypes = typs;
      let filteredProds = prods;
      
      if (selectedRestaurantId !== "all") {
        filteredCats = cats.filter(c => c.restaurantId === selectedRestaurantId);
        filteredTypes = typs.filter(t => t.restaurantId === selectedRestaurantId);
        filteredProds = prods.filter(p => p.restaurantId === selectedRestaurantId);
      }
      
      setCategories(filteredCats);
      setTypes(filteredTypes);
      setProducts(filteredProds);
    } catch (err: any) {
      setError("Erreur lors du chargement: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAllTypes = async () => {
    try {
      const data = await getAllTypes();
      setTypes(data);
    } catch (err: any) {
      setError("Erreur lors du chargement des types: " + err.message);
    }
  };

  const loadTypesByCategory = async (categoryId: string) => {
    try {
      const data = await getTypesByCategory(categoryId);
      setTypes(data);
    } catch (err: any) {
      setError("Erreur lors du chargement des types: " + err.message);
    }
  };

  const loadAllProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err: any) {
      setError("Erreur lors du chargement des produits: " + err.message);
    }
  };

  const loadProductsByCategory = async (categoryId: string) => {
    try {
      const data = await getProductsByCategory(categoryId);
      setProducts(data);
    } catch (err: any) {
      setError("Erreur lors du chargement des produits: " + err.message);
    }
  };

  const loadProductsByFilters = async (
    categoryId: string,
    typeId: string
  ) => {
    try {
      const data = await getProductsByCategoryAndType(categoryId, typeId);
      setProducts(data);
    } catch (err: any) {
      setError("Erreur lors du chargement des produits: " + err.message);
    }
  };

  // Handlers pour catégories
  const handleCategorySubmit = async (data: CategoryFormData) => {
    try {
      setError("");
      // Ajouter restaurantId si un restaurant est sélectionné
      const dataWithRestaurant = selectedRestaurantId !== "all" 
        ? { ...data, restaurantId: selectedRestaurantId }
        : data;
      
      if (editingItem) {
        await updateCategory(editingItem.id, dataWithRestaurant);
        setSuccess("Catégorie mise à jour avec succès !");
      } else {
        await createCategory(dataWithRestaurant);
        setSuccess("Catégorie créée avec succès !");
      }
      setShowCategoryForm(false);
      setEditingItem(null);
      await loadAllData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      return;
    }
    try {
      await deleteCategory(id);
      setSuccess("Catégorie supprimée avec succès !");
      await loadAllData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
    }
  };

  // Handlers pour types
  const handleTypeSubmit = async (data: MenuTypeFormData) => {
    try {
      setError("");
      // Ajouter restaurantId si un restaurant est sélectionné
      const dataWithRestaurant = selectedRestaurantId !== "all" 
        ? { ...data, restaurantId: selectedRestaurantId }
        : data;
      
      if (editingItem) {
        await updateType(editingItem.id, dataWithRestaurant);
        setSuccess("Type mis à jour avec succès !");
      } else {
        await createType(dataWithRestaurant);
        setSuccess("Type créé avec succès !");
      }
      setShowTypeForm(false);
      setEditingItem(null);
      await loadAllData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleTypeDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce type ?")) {
      return;
    }
    try {
      await deleteType(id);
      setSuccess("Type supprimé avec succès !");
      await loadAllData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
    }
  };

  // Handlers pour produits
  const handleProductSubmit = async (data: ProductFormData) => {
    try {
      setError("");
      // Ajouter restaurantId si un restaurant est sélectionné
      const dataWithRestaurant = selectedRestaurantId !== "all" 
        ? { ...data, restaurantId: selectedRestaurantId }
        : data;
      
      if (editingItem) {
        await updateProduct(editingItem.id, dataWithRestaurant);
        setSuccess("Produit mis à jour avec succès !");
      } else {
        await createProduct(dataWithRestaurant);
        setSuccess("Produit créé avec succès !");
      }
      setShowProductForm(false);
      setEditingItem(null);
      await loadAllData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleProductDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }
    try {
      await deleteProduct(id);
      setSuccess("Produit supprimé avec succès !");
      await loadAllData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
    }
  };

  const handleToggleStock = async (id: string, currentStatus?: string) => {
    try {
      const newStatus = currentStatus === "out_of_stock" ? "in_stock" : "out_of_stock";
      await updateProductStock(id, newStatus);
      setSuccess("Statut du stock mis à jour !");
      await loadAllData();
    } catch (err: any) {
      setError("Erreur stock: " + err.message);
    }
  };

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || "Inconnu";
  };

  const getTypeName = (id: string) => {
    return types.find((t) => t.id === id)?.name || "Inconnu";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  ← Retour
                </Button>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Gestion du Menu
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        )}

        {/* Sélecteur de restaurant */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Restaurant:
            </label>
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les restaurants</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
            {selectedRestaurantId !== "all" && (
              <Link href={`/restaurant/dashboard/${selectedRestaurantId}`}>
                <Button variant="outline" size="sm">
                  Voir le dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Tabs Navigation - Mobile First */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab("categories");
                  setSelectedCategoryId("");
                  setSelectedTypeId("");
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "categories"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Catégories ({categories.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab("types");
                  setSelectedTypeId("");
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "types"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Types ({types.length})
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "products"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Produits ({products.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === "categories" && (
              <CategoriesSection
                categories={categories}
                onAdd={() => {
                  setEditingItem(null);
                  setShowCategoryForm(true);
                }}
                onEdit={(cat: Category) => {
                  setEditingItem(cat);
                  setShowCategoryForm(true);
                }}
                onDelete={handleCategoryDelete}
                showForm={showCategoryForm}
                editingItem={editingItem as Category | null}
                onSubmit={handleCategorySubmit}
                onClose={() => {
                  setShowCategoryForm(false);
                  setEditingItem(null);
                }}
              />
            )}

            {activeTab === "types" && (
              <TypesSection
                types={types}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryFilterChange={setSelectedCategoryId}
                onAdd={() => {
                  setEditingItem(null);
                  setShowTypeForm(true);
                }}
                onEdit={(type: MenuType) => {
                  setEditingItem(type);
                  setShowTypeForm(true);
                }}
                onDelete={handleTypeDelete}
                showForm={showTypeForm}
                editingItem={editingItem as MenuType | null}
                onSubmit={handleTypeSubmit}
                onClose={() => {
                  setShowTypeForm(false);
                  setEditingItem(null);
                }}
              />
            )}

            {activeTab === "products" && (
              <ProductsSection
                products={products}
                categories={categories}
                types={types}
                selectedCategoryId={selectedCategoryId}
                selectedTypeId={selectedTypeId}
                onCategoryFilterChange={(id: string) => {
                  setSelectedCategoryId(id);
                  setSelectedTypeId(""); // Reset type when category changes
                }}
                onTypeFilterChange={(id: string) => setSelectedTypeId(id)}
                onAdd={() => {
                  setEditingItem(null);
                  setShowProductForm(true);
                }}
                onEdit={(product: Product) => {
                  setEditingItem(product);
                  setShowProductForm(true);
                }}
                onDelete={handleProductDelete}
                showForm={showProductForm}
                editingItem={editingItem as Product | null}
                onSubmit={handleProductSubmit}
                onClose={() => {
                  setShowProductForm(false);
                  setEditingItem(null);
                }}
                getCategoryName={getCategoryName}
                getTypeName={getTypeName}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Composants pour chaque section
function CategoriesSection({
  categories,
  onAdd,
  onEdit,
  onDelete,
  showForm,
  editingItem,
  onSubmit,
  onClose,
}: any) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    order: categories.length + 1,
    isActive: true,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description || "",
        order: editingItem.order,
        isActive: editingItem.isActive,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        order: categories.length + 1,
        isActive: true,
      });
    }
  }, [editingItem, categories.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Catégories</h2>
        <Button variant="primary" size="sm" onClick={onAdd}>
          + Ajouter
        </Button>
      </div>

      {showForm && (
        <CategoryForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={onClose}
          isEditing={!!editingItem}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat: Category) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {categories.length === 0 && (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">Aucune catégorie pour le moment.</p>
        </div>
      )}
    </div>
  );
}

function TypesSection({
  types,
  categories,
  selectedCategoryId,
  onCategoryFilterChange,
  onAdd,
  onEdit,
  onDelete,
  showForm,
  editingItem,
  onSubmit,
  onClose,
}: any) {
  const [formData, setFormData] = useState<MenuTypeFormData>({
    name: "",
    categoryId: selectedCategoryId || "",
    description: "",
    order: types.length + 1,
    isActive: true,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        categoryId: editingItem.categoryId,
        description: editingItem.description || "",
        order: editingItem.order,
        isActive: editingItem.isActive,
      });
    } else {
      setFormData({
        name: "",
        categoryId: selectedCategoryId || "",
        description: "",
        order: types.length + 1,
        isActive: true,
      });
    }
  }, [editingItem, selectedCategoryId, types.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Types</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={selectedCategoryId}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="flex-1 sm:flex-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat: Category) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Button variant="primary" size="sm" onClick={onAdd}>
            + Ajouter
          </Button>
        </div>
      </div>

      {showForm && (
        <TypeForm
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          onSubmit={handleSubmit}
          onClose={onClose}
          isEditing={!!editingItem}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((type: MenuType) => (
          <TypeCard
            key={type.id}
            type={type}
            categoryName={categories.find((c: Category) => c.id === type.categoryId)?.name || "Inconnu"}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {types.length === 0 && (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">Aucun type pour le moment.</p>
        </div>
      )}
    </div>
  );
}

function ProductsSection({
  products,
  categories,
  types,
  selectedCategoryId,
  selectedTypeId,
  onCategoryFilterChange,
  onTypeFilterChange,
  onAdd,
  onEdit,
  onDelete,
  showForm,
  editingItem,
  onSubmit,
  onClose,
  getCategoryName,
  getTypeName,
}: any) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    categoryId: selectedCategoryId || "",
    typeId: selectedTypeId || "",
    isActive: true,
    order: products.length + 1,
  });

  const filteredTypes = selectedCategoryId
    ? types.filter((t: MenuType) => t.categoryId === selectedCategoryId)
    : types;

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description || "",
        price: editingItem.price,
        imageUrl: editingItem.imageUrl || "",
        categoryId: editingItem.categoryId,
        typeId: editingItem.typeId,
        isActive: editingItem.isActive,
        order: editingItem.order,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        categoryId: selectedCategoryId || "",
        typeId: selectedTypeId || "",
        isActive: true,
        order: products.length + 1,
      });
    }
  }, [editingItem, selectedCategoryId, selectedTypeId, products.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Produits</h2>
          <Button variant="primary" size="sm" onClick={onAdd}>
            + Ajouter
          </Button>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedCategoryId}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat: Category) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={selectedTypeId}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedCategoryId}
          >
            <option value="">Tous les types</option>
            {filteredTypes.map((type: MenuType) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          types={filteredTypes}
          onSubmit={handleSubmit}
          onClose={onClose}
          isEditing={!!editingItem}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            categoryName={getCategoryName(product.categoryId)}
            typeName={getTypeName(product.typeId)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">Aucun produit pour le moment.</p>
        </div>
      )}
    </div>
  );
}

// Composants de cartes
function CategoryCard({ category, onEdit, onDelete }: any) {
  return (
    <div className="rounded-lg bg-white p-4 shadow hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{category.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(category)}
            className="text-blue-600 hover:text-blue-800"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="text-red-600 hover:text-red-800"
          >
            🗑️
          </button>
        </div>
      </div>
      {category.description && (
        <p className="text-sm text-gray-600 mb-2">{category.description}</p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Ordre: {category.order}</span>
        <span className={`px-2 py-1 rounded ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {category.isActive ? "Actif" : "Inactif"}
        </span>
      </div>
    </div>
  );
}

function TypeCard({ type, categoryName, onEdit, onDelete }: any) {
  return (
    <div className="rounded-lg bg-white p-4 shadow hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{type.name}</h3>
          <p className="text-xs text-gray-500">Catégorie: {categoryName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(type)}
            className="text-blue-600 hover:text-blue-800"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(type.id)}
            className="text-red-600 hover:text-red-800"
          >
            🗑️
          </button>
        </div>
      </div>
      {type.description && (
        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Ordre: {type.order}</span>
        <span className={`px-2 py-1 rounded ${type.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {type.isActive ? "Actif" : "Inactif"}
        </span>
      </div>
    </div>
  );
}

function ProductCard({ product, categoryName, typeName, onEdit, onDelete }: any) {
  return (
    <div className="rounded-lg bg-white p-4 shadow hover:shadow-lg transition-shadow">
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
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-xs text-gray-500">{categoryName} → {typeName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-800"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-800"
          >
            🗑️
          </button>
        </div>
      </div>
      {product.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">
          {product.price.toLocaleString('fr-FR')} FCFA
        </span>
        <span className={`px-2 py-1 rounded text-xs ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {product.isActive ? "Actif" : "Inactif"}
        </span>
      </div>
    </div>
  );
}

// Composants de formulaires
function CategoryForm({ formData, setFormData, onSubmit, onClose, isEditing }: any) {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? "Modifier la catégorie" : "Nouvelle catégorie"}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center pt-8">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Actif</span>
            </label>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            {isEditing ? "Modifier" : "Créer"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}

function TypeForm({ formData, setFormData, categories, onSubmit, onClose, isEditing }: any) {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? "Modifier le type" : "Nouveau type"}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat: Category) => (
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center pt-8">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Actif</span>
            </label>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            {isEditing ? "Modifier" : "Créer"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}

function ProductForm({ formData, setFormData, categories, types, onSubmit, onClose, isEditing }: any) {
  const filteredTypes = formData.categoryId
    ? types.filter((t: MenuType) => t.categoryId === formData.categoryId)
    : types;

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? "Modifier le produit" : "Nouveau produit"}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) => {
              setFormData({ ...formData, categoryId: e.target.value, typeId: "" });
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat: Category) => (
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
            value={formData.typeId}
            onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
            disabled={!formData.categoryId}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Sélectionner un type</option>
            {filteredTypes.map((type: MenuType) => (
              <option key={type.id} value={type.id}>
                {type.name}
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix (FCFA) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de l&apos;image
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Actif</span>
          </label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            {isEditing ? "Modifier" : "Créer"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function MenuPage() {
  return (
    <ProtectedAdminRoute>
      <MenuContent />
    </ProtectedAdminRoute>
  );
}

