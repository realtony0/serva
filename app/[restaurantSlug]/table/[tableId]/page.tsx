"use client";

import { use, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Leaf,
  Flame,
  CheckCircle2,
  Clock,
  Bell,
  Loader2,
} from "lucide-react";

// ── Mock data (will be replaced with real Supabase fetch) ─────────────────────

const restaurant = {
  name: "The Grand Bistro",
  description: "Fine casual dining in the heart of the city",
};

const categories = [
  { id: "starters", name: "Starters" },
  { id: "mains", name: "Mains" },
  { id: "desserts", name: "Desserts" },
  { id: "drinks", name: "Drinks" },
];

type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  badge?: "popular" | "vegan" | "spicy";
};

const menuItems: MenuItem[] = [
  { id: "s1", categoryId: "starters", name: "Caesar Salad", description: "Romaine lettuce, house-made Caesar dressing, croutons, Parmesan", price: 12.9, badge: "popular" },
  { id: "s2", categoryId: "starters", name: "Bruschetta al Pomodoro", description: "Toasted sourdough, heirloom tomatoes, fresh basil, olive oil", price: 10.5, badge: "vegan" },
  { id: "s3", categoryId: "starters", name: "Spicy Chicken Wings", description: "Crispy wings tossed in house hot sauce, blue-cheese dip", price: 14.0, badge: "spicy" },
  { id: "m1", categoryId: "mains", name: "Grilled Ribeye Steak", description: "12 oz dry-aged ribeye, garlic mashed potatoes, seasonal vegetables", price: 42.0, badge: "popular" },
  { id: "m2", categoryId: "mains", name: "Wild Mushroom Pasta", description: "Tagliatelle, wild mushrooms, truffle oil, Pecorino Romano", price: 22.5, badge: "vegan" },
  { id: "m3", categoryId: "mains", name: "Pan-Seared Salmon", description: "Atlantic salmon, lemon beurre blanc, asparagus, new potatoes", price: 29.0 },
  { id: "m4", categoryId: "mains", name: "Spicy Lamb Tagine", description: "Slow-cooked lamb, preserved lemon, couscous, harissa", price: 34.0, badge: "spicy" },
  { id: "d1", categoryId: "desserts", name: "Tiramisu", description: "Classic Italian, espresso-soaked ladyfingers, mascarpone cream", price: 9.5, badge: "popular" },
  { id: "d2", categoryId: "desserts", name: "Dark Chocolate Fondant", description: "Warm chocolate cake, molten centre, vanilla ice cream", price: 11.0 },
  { id: "dr1", categoryId: "drinks", name: "Sparkling Water", description: "500 ml, San Pellegrino", price: 4.0 },
  { id: "dr2", categoryId: "drinks", name: "House Red Wine", description: "Glass of our curated house red", price: 9.5 },
  { id: "dr3", categoryId: "drinks", name: "Fresh Lemonade", description: "Hand-squeezed, mint, lightly sweetened", price: 5.5, badge: "vegan" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderState = "idle" | "sending" | "confirmed";

// ── Badge ─────────────────────────────────────────────────────────────────────

function Badge({ type }: { type: "popular" | "vegan" | "spicy" }) {
  if (type === "popular")
    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Popular</span>;
  if (type === "vegan")
    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full"><Leaf className="w-2.5 h-2.5" /> Vegan</span>;
  if (type === "spicy")
    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full"><Flame className="w-2.5 h-2.5" /> Spicy</span>;
  return null;
}

// ── Menu item card ────────────────────────────────────────────────────────────

function MenuCard({ item, quantity, onAdd, onRemove }: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const emoji = item.categoryId === "drinks" ? "🥤" : item.categoryId === "desserts" ? "🍰" : "🍽️";
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center text-2xl select-none">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <h3 className="text-sm font-semibold text-slate-900 leading-snug">{item.name}</h3>
            {item.badge && <Badge type={item.badge} />}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-base font-bold text-slate-900">${item.price.toFixed(2)}</p>
        {quantity === 0 ? (
          <button onClick={onAdd} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={onRemove} className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              <Minus className="w-3.5 h-3.5 text-slate-700" />
            </button>
            <span className="text-sm font-bold text-slate-900 w-5 text-center">{quantity}</span>
            <button onClick={onAdd} className="w-7 h-7 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Cart drawer ───────────────────────────────────────────────────────────────

function CartDrawer({ items, onClose, onAdd, onRemove, tableId, onPlaceOrder, orderState }: {
  items: CartItem[];
  onClose: () => void;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  tableId: string;
  onPlaceOrder: (notes: string) => void;
  orderState: OrderState;
}) {
  const [notes, setNotes] = useState("");
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  // Order confirmed state
  if (orderState === "confirmed") {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 z-40" />
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Order placed!</h2>
          <p className="text-slate-500 text-sm mb-1">Your order is being prepared.</p>
          <p className="text-slate-500 text-sm mb-6">
            <Clock className="w-3.5 h-3.5 inline mr-1" />
            The kitchen received it instantly.
          </p>
          <p className="text-xs text-blue-600 font-medium">Table {tableId}</p>
          <button onClick={onClose} className="mt-6 w-full bg-blue-600 text-white rounded-xl py-3 font-semibold text-sm hover:bg-blue-700 transition-colors">
            Continue browsing
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Your order · {itemCount} {itemCount === 1 ? "item" : "items"}</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {items.map((item) => (
            <div key={item.menuItemId} className="flex items-center gap-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                <p className="text-xs text-slate-500">${item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => onRemove(item.menuItemId)} className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">
                  <Minus className="w-3 h-3 text-slate-700" />
                </button>
                <span className="text-sm font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                <button onClick={() => onAdd(item.menuItemId)} className="w-6 h-6 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-900 w-14 text-right shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Notes field */}
        <div className="px-5 pt-3 pb-1">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special requests or allergies…"
            rows={2}
            className="w-full text-sm text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div className="px-5 py-4 border-t border-slate-100">
          <div className="flex justify-between text-base font-bold text-slate-900 mb-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => onPlaceOrder(notes)}
            disabled={orderState === "sending"}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm py-4 rounded-xl transition-colors"
          >
            {orderState === "sending" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Sending to kitchen…</>
            ) : (
              <>Send order to kitchen</>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 mt-2">
            Table {tableId} · A server will bring your order
          </p>
        </div>
      </div>
    </>
  );
}

// ── Waiter call button ────────────────────────────────────────────────────────

function CallWaiterButton({ tableId }: { tableId: string }) {
  const [called, setCalled] = useState(false);

  function handleCall() {
    setCalled(true);
    setTimeout(() => setCalled(false), 5000);
  }

  return (
    <button
      onClick={handleCall}
      className={`fixed bottom-6 right-4 z-30 flex items-center gap-2 text-xs font-semibold px-3 py-2.5 rounded-xl shadow-lg transition-all ${
        called
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
      }`}
    >
      <Bell className={`w-3.5 h-3.5 ${called ? "text-green-600" : "text-slate-500"}`} />
      {called ? "Waiter notified!" : "Call waiter"}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TableMenuPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string; tableId: string }>;
}) {
  const { tableId } = use(params);
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderState, setOrderState] = useState<OrderState>("idle");

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  function getQuantity(itemId: string) {
    return cart.find((c) => c.menuItemId === itemId)?.quantity ?? 0;
  }

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) return prev.map((c) => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  }

  function removeFromCart(itemId: string) {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === itemId);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((c) => c.menuItemId !== itemId);
      return prev.map((c) => c.menuItemId === itemId ? { ...c, quantity: c.quantity - 1 } : c);
    });
  }

  async function placeOrder(notes: string) {
    setOrderState("sending");
    // TODO: POST to /api/orders with cart + tableId when anon key is configured
    await new Promise((r) => setTimeout(r, 1200));
    setOrderState("confirmed");
    setCart([]);
  }

  function handleCartClose() {
    setCartOpen(false);
    if (orderState === "confirmed") setOrderState("idle");
  }

  const visibleItems = menuItems.filter((item) => item.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-lg font-bold text-slate-900">{restaurant.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{restaurant.description}</p>
          <p className="text-xs font-semibold text-blue-600 mt-1">Table {tableId}</p>
        </div>

        {/* Category tabs */}
        <div className="max-w-lg mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="max-w-lg mx-auto px-4 py-5">
        <div className="grid grid-cols-1 gap-3">
          {visibleItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              quantity={getQuantity(item.id)}
              onAdd={() => addToCart(item)}
              onRemove={() => removeFromCart(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Waiter call button */}
      {totalItems === 0 && <CallWaiterButton tableId={tableId} />}

      {/* Floating cart button */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-40 px-4">
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] max-w-sm w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-blue-600 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span>View order</span>
            </div>
            <span>${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={handleCartClose}
          onAdd={(id) => { const item = menuItems.find((m) => m.id === id); if (item) addToCart(item); }}
          onRemove={removeFromCart}
          tableId={tableId}
          onPlaceOrder={placeOrder}
          orderState={orderState}
        />
      )}
    </div>
  );
}
