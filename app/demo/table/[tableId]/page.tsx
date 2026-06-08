"use client";

/**
 * Demo page — Le Bistro Demo
 * Hardcoded mock data, no Supabase needed.
 */

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Plus, Minus, X, ArrowRight } from "lucide-react";
import { useLanguage, LanguageToggle } from "@/components/LanguageProvider";

// ── Mock data ─────────────────────────────────────────────────────────────────

interface DemoItem {
  id: string;
  category: string;
  nameFr: string;
  nameEn: string;
  descFr: string;
  descEn: string;
  price: number;
  badge?: "popular" | "vegan";
  emoji: string;
}

const ITEMS: DemoItem[] = [
  // Entrées / Starters
  { id: "e1", category: "entrees", nameFr: "Soupe à l'oignon", nameEn: "French Onion Soup", descFr: "Bouillon de bœuf, croûtons gratinés, fromage fondu", descEn: "Beef broth, toasted croutons, melted cheese", price: 8500, badge: "popular", emoji: "🥣" },
  { id: "e2", category: "entrees", nameFr: "Salade niçoise", nameEn: "Niçoise Salad", descFr: "Thon, œufs, olives noires, tomates cerises", descEn: "Tuna, eggs, black olives, cherry tomatoes", price: 7500, badge: "vegan", emoji: "🥗" },
  { id: "e3", category: "entrees", nameFr: "Tartare de saumon", nameEn: "Salmon Tartare", descFr: "Saumon frais, avocat, citron vert, coriandre", descEn: "Fresh salmon, avocado, lime, coriander", price: 11000, emoji: "🐟" },
  { id: "e4", category: "entrees", nameFr: "Foie gras maison", nameEn: "House Foie Gras", descFr: "Mi-cuit, brioche toastée, chutney de figues", descEn: "Semi-cooked, toasted brioche, fig chutney", price: 14500, emoji: "🍞" },
  // Plats / Mains
  { id: "p1", category: "plats", nameFr: "Entrecôte grillée", nameEn: "Grilled Ribeye", descFr: "300g bœuf, sauce au poivre, frites maison", descEn: "300g beef, pepper sauce, homemade fries", price: 22000, badge: "popular", emoji: "🥩" },
  { id: "p2", category: "plats", nameFr: "Filet de cabillaud", nameEn: "Cod Fillet", descFr: "Rôti, risotto crémeux, légumes du marché", descEn: "Roasted, creamy risotto, market vegetables", price: 18500, emoji: "🐠" },
  { id: "p3", category: "plats", nameFr: "Poulet rôti", nameEn: "Roast Chicken", descFr: "Demi-poulet fermier, jus de rôti, purée maison", descEn: "Half farm chicken, roasting juices, mash", price: 16000, emoji: "🍗" },
  { id: "p4", category: "plats", nameFr: "Pâtes à la truffe", nameEn: "Truffle Pasta", descFr: "Tagliatelles maison, crème de truffe noire, parmesan", descEn: "Homemade tagliatelle, black truffle cream, parmesan", price: 19500, badge: "vegan", emoji: "🍝" },
  // Desserts
  { id: "d1", category: "desserts", nameFr: "Crème brûlée", nameEn: "Crème Brûlée", descFr: "Crème vanille, sucre caramélisé", descEn: "Vanilla cream, caramelized sugar", price: 6500, badge: "popular", emoji: "🍮" },
  { id: "d2", category: "desserts", nameFr: "Fondant chocolat", nameEn: "Chocolate Fondant", descFr: "Cœur coulant, glace vanille, coulis de framboise", descEn: "Molten center, vanilla ice cream, raspberry coulis", price: 7000, emoji: "🍫" },
  { id: "d3", category: "desserts", nameFr: "Tarte tatin", nameEn: "Tarte Tatin", descFr: "Pommes caramélisées, pâte feuilletée, crème fraîche", descEn: "Caramelized apples, puff pastry, crème fraîche", price: 6000, emoji: "🥧" },
  // Boissons / Drinks
  { id: "b1", category: "boissons", nameFr: "Eau minérale 50cl", nameEn: "Mineral Water 50cl", descFr: "Plate ou gazeuse", descEn: "Still or sparkling", price: 2500, emoji: "💧" },
  { id: "b2", category: "boissons", nameFr: "Jus d'orange pressé", nameEn: "Fresh Orange Juice", descFr: "Oranges pressées à la commande", descEn: "Freshly squeezed to order", price: 4500, emoji: "🍊" },
  { id: "b3", category: "boissons", nameFr: "Café / Espresso", nameEn: "Coffee / Espresso", descFr: "Arabica 100%, torréfaction artisanale", descEn: "100% Arabica, artisan roast", price: 2000, emoji: "☕" },
  { id: "b4", category: "boissons", nameFr: "Verre de vin maison", nameEn: "House Wine Glass", descFr: "Rouge, blanc ou rosé — Côtes du Rhône", descEn: "Red, white or rosé — Côtes du Rhône", price: 6500, emoji: "🍷" },
];

const CATEGORIES = [
  { id: "entrees", fr: "Entrées", en: "Starters" },
  { id: "plats", fr: "Plats", en: "Main Courses" },
  { id: "desserts", fr: "Desserts", en: "Desserts" },
  { id: "boissons", fr: "Boissons", en: "Drinks" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface CartEntry {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const { locale, t } = useLanguage();
  const fr = locale === "fr";

  const [category, setCategory] = useState("entrees");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [ordered, setOrdered] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (item: DemoItem) => {
    const name = fr ? item.nameFr : item.nameEn;
    setCart((prev) => {
      const ex = prev.find((c) => c.id === item.id);
      if (ex) return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { id: item.id, name, price: item.price, quantity: 1, emoji: item.emoji }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((c) => c.id === id ? { ...c, quantity: c.quantity + delta } : c);
      return updated.filter((c) => c.quantity > 0);
    });
  };

  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);
  const totalPrice = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const catItems = ITEMS.filter((i) => i.category === category);

  if (ordered) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {fr ? "Commande envoyée !" : "Order placed!"}
          </h1>
          <p className="text-slate-500 mb-8">
            {fr ? "Votre commande est en cours de préparation. Merci !" : "Your order is being prepared. Thank you!"}
          </p>
          <Link href="/signup" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl mb-3 transition-colors text-center">
            {fr ? "Créer mon compte gratuit" : "Create my free account"}
          </Link>
          <button onClick={() => { setOrdered(false); setCart([]); }} className="text-slate-400 hover:text-slate-600 text-sm underline">
            {fr ? "Nouvelle commande (démo)" : "New order (demo)"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Demo banner */}
      <div className="bg-indigo-600 text-white text-sm px-4 py-2.5 flex items-center justify-between gap-2">
        <span className="text-indigo-100">
          ✨ {fr ? "Ceci est une démo — Créez votre compte gratuit" : "This is a demo — Create your free account"}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <LanguageToggle />
          <Link href="/signup" className="bg-white text-indigo-700 font-semibold px-3 py-1 rounded-lg text-xs hover:bg-indigo-50 transition-colors flex items-center gap-1">
            {fr ? "S'inscrire" : "Sign up"} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Le Bistro Demo</h1>
            <p className="text-xs text-slate-400">{fr ? "Menu · Table 1" : "Menu · Table 1"}</p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {fr ? "Panier" : "Cart"}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {fr ? cat.fr : cat.en}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-3">
          {catItems.map((item) => {
            const name = fr ? item.nameFr : item.nameEn;
            const desc = fr ? item.descFr : item.descEn;
            const cartEntry = cart.find((c) => c.id === item.id);
            return (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
                <div className="text-4xl flex-shrink-0">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-slate-900 text-sm">{name}</h3>
                    {item.badge === "popular" && (
                      <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
                        {fr ? "Populaire" : "Popular"}
                      </span>
                    )}
                    {item.badge === "vegan" && (
                      <span className="text-[10px] font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">
                        🌱 {fr ? "Végé" : "Vegan"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">{desc}</p>
                  <p className="text-sm font-bold text-blue-600 mt-1">{item.price.toLocaleString("fr-FR")} FCFA</p>
                </div>
                {cartEntry ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{cartEntry.quantity}</span>
                    <button onClick={() => addToCart(item)} className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{fr ? "Ma commande" : "My order"}</h2>
              <button onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">{fr ? "Panier vide" : "Empty cart"}</p>
              ) : (
                cart.map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="text-2xl">{c.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                      <p className="text-xs text-slate-400">{(c.price * c.quantity).toLocaleString("fr-FR")} FCFA</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQty(c.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100">
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{c.quantity}</span>
                      <button onClick={() => updateQty(c.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="px-5 py-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500">{fr ? "Total" : "Total"}</span>
                  <span className="text-lg font-bold text-slate-900">{totalPrice.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <button
                  onClick={() => { setOrdered(true); setCartOpen(false); }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  {fr ? "Commander" : "Place order"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
