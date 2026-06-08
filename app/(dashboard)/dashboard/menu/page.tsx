"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard, UtensilsCrossed, QrCode, BarChart2, Settings, LogOut, Zap,
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { Category, MenuItem } from "@/lib/types";

// ── Sidebar ───────────────────────────────────────────────────────────────────

const navLinks = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard" },
  { icon: UtensilsCrossed, label: "Menu", href: "/dashboard/menu", active: true },
  { icon: QrCode, label: "Tables & QR", href: "/dashboard/tables" },
  { icon: BarChart2, label: "Commandes", href: "/dashboard/orders" },
  { icon: Settings, label: "Réglages", href: "/dashboard/settings" },
];

function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 min-h-screen shrink-0">
      <div className="px-6 py-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Serva</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-slate-100">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full">
          <LogOut className="w-4 h-4 shrink-0" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

// ── Category Modal ─────────────────────────────────────────────────────────────

interface CategoryModalProps {
  restaurantId: string;
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

function CategoryModal({ restaurantId, category, onClose, onSaved }: CategoryModalProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    if (category) {
      const { error: err } = await supabase
        .from("categories")
        .update({ name })
        .eq("id", category.id);
      if (err) { setError(err.message); setLoading(false); return; }
    } else {
      const { error: err } = await supabase.from("categories").insert({
        restaurant_id: restaurantId,
        name,
        sort_order: 0,
        is_active: true,
      });
      if (err) { setError(err.message); setLoading(false); return; }
    }
    setLoading(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-slate-900">
            {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Entrées"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Item Modal ─────────────────────────────────────────────────────────────────

interface ItemModalProps {
  restaurantId: string;
  categoryId: string;
  item: MenuItem | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY_ITEM = {
  name: "", description: "", price: "", image_url: "", is_available: true, allergens: "",
};

function ItemModal({ restaurantId, categoryId, item, onClose, onSaved }: ItemModalProps) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: item?.price?.toString() ?? "",
    image_url: item?.image_url ?? "",
    is_available: item?.is_available ?? true,
    allergens: item?.allergens?.join(", ") ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  void EMPTY_ITEM;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const allergens = form.allergens
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      image_url: form.image_url || null,
      is_available: form.is_available,
      allergens,
      restaurant_id: restaurantId,
      category_id: categoryId,
      sort_order: 0,
      is_featured: false,
      option_groups: [],
    };
    if (item) {
      const { error: err } = await supabase.from("menu_items").update(payload).eq("id", item.id);
      if (err) { setError(err.message); setLoading(false); return; }
    } else {
      const { error: err } = await supabase.from("menu_items").insert(payload);
      if (err) { setError(err.message); setLoading(false); return; }
    }
    setLoading(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-slate-900">
            {item ? "Modifier l'article" : "Nouvel article"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom *</label>
            <input
              name="name" type="text" required value={form.name} onChange={handleChange}
              placeholder="Burger Classic"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} rows={2}
              placeholder="Description courte…"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Prix *</label>
            <input
              name="price" type="number" step="0.01" min="0" required value={form.price} onChange={handleChange}
              placeholder="12.99"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">URL image</label>
            <input
              name="image_url" type="url" value={form.image_url} onChange={handleChange}
              placeholder="https://…"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Allergènes (séparés par virgule)</label>
            <input
              name="allergens" type="text" value={form.allergens} onChange={handleChange}
              placeholder="gluten, lactose, noix"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, is_available: !p.is_available }))}
              className={`transition-colors ${form.is_available ? "text-blue-600" : "text-slate-400"}`}
            >
              {form.is_available ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
            <span className="text-sm text-slate-700">
              {form.is_available ? "Disponible" : "Indisponible"}
            </span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const fetchCategories = useCallback(async (restId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restId)
      .order("sort_order", { ascending: true });
    setCategories(data ?? []);
    if (data && data.length > 0 && !selectedCategory) {
      setSelectedCategory(data[0]);
    }
  }, [selectedCategory]);

  const fetchItems = useCallback(async (categoryId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });
    setItems(data ?? []);
  }, []);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("owner_id", user.id)
        .single();
      if (!restaurant) return;
      setRestaurantId(restaurant.id);
      await fetchCategories(restaurant.id);
      setLoading(false);
    }
    init();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchItems(selectedCategory.id);
    } else {
      setItems([]);
    }
  }, [selectedCategory, fetchItems]);

  async function deleteCategory(cat: Category) {
    if (!confirm(`Supprimer la catégorie "${cat.name}" ?`)) return;
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", cat.id);
    if (restaurantId) await fetchCategories(restaurantId);
    if (selectedCategory?.id === cat.id) setSelectedCategory(null);
  }

  async function deleteItem(itemId: string) {
    if (!confirm("Supprimer cet article ?")) return;
    const supabase = createClient();
    await supabase.from("menu_items").delete().eq("id", itemId);
    if (selectedCategory) await fetchItems(selectedCategory.id);
  }

  async function toggleItem(item: MenuItem) {
    const supabase = createClient();
    await supabase.from("menu_items").update({ is_available: !item.is_available }).eq("id", item.id);
    if (selectedCategory) await fetchItems(selectedCategory.id);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      {/* Category modal */}
      {showCategoryModal && restaurantId && (
        <CategoryModal
          restaurantId={restaurantId}
          category={editingCategory}
          onClose={() => { setShowCategoryModal(false); setEditingCategory(null); }}
          onSaved={async () => {
            setShowCategoryModal(false);
            setEditingCategory(null);
            if (restaurantId) await fetchCategories(restaurantId);
          }}
        />
      )}

      {/* Item modal */}
      {showItemModal && restaurantId && selectedCategory && (
        <ItemModal
          restaurantId={restaurantId}
          categoryId={selectedCategory.id}
          item={editingItem}
          onClose={() => { setShowItemModal(false); setEditingItem(null); }}
          onSaved={async () => {
            setShowItemModal(false);
            setEditingItem(null);
            if (selectedCategory) await fetchItems(selectedCategory.id);
          }}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <h1 className="text-xl font-bold text-slate-900">Menu</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gérez vos catégories et articles</p>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - categories */}
          <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Catégories</span>
              <button
                onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }}
                className="text-blue-600 hover:text-blue-700 p-1 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {categories.length === 0 ? (
                <p className="text-xs text-slate-400 px-4 py-3">Aucune catégorie</p>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer group transition-colors ${
                      selectedCategory?.id === cat.id ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedCategory?.id === cat.id ? "text-blue-600" : "text-slate-300"}`} />
                      <span className={`text-sm truncate ${selectedCategory?.id === cat.id ? "text-blue-700 font-medium" : "text-slate-700"}`}>
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingCategory(cat); setShowCategoryModal(true); }}
                        className="text-slate-400 hover:text-blue-600 p-0.5"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteCategory(cat); }}
                        className="text-slate-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </nav>
          </div>

          {/* Main area - items */}
          <div className="flex-1 overflow-y-auto p-6">
            {!selectedCategory ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <UtensilsCrossed className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm">Sélectionnez ou créez une catégorie</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">{selectedCategory.name}</h2>
                  <button
                    onClick={() => { setEditingItem(null); setShowItemModal(true); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un article
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-slate-400 text-sm">Aucun article dans cette catégorie</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Photo */}
                        <div className="h-32 bg-slate-100 flex items-center justify-center overflow-hidden">
                          {item.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <UtensilsCrossed className="w-8 h-8 text-slate-300" />
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-slate-900 leading-tight">{item.name}</h3>
                            <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                              {item.price.toFixed(2)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => toggleItem(item)}
                              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                                item.is_available ? "text-green-600" : "text-slate-400"
                              }`}
                            >
                              {item.is_available
                                ? <ToggleRight className="w-5 h-5" />
                                : <ToggleLeft className="w-5 h-5" />}
                              {item.is_available ? "Disponible" : "Indisponible"}
                            </button>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { setEditingItem(item); setShowItemModal(true); }}
                                className="text-slate-400 hover:text-blue-600 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
