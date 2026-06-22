"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  LayoutDashboard, UtensilsCrossed, QrCode, BarChart2, Settings, LogOut, Zap,
  ChefHat, Maximize2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { Order, OrderStatus, OrderItem } from "@/lib/types";

// ── Sidebar ───────────────────────────────────────────────────────────────────

const navLinks = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard" },
  { icon: UtensilsCrossed, label: "Menu", href: "/dashboard/menu" },
  { icon: QrCode, label: "Tables & QR", href: "/dashboard/tables" },
  { icon: BarChart2, label: "Commandes", href: "/dashboard/orders" },
  { icon: ChefHat, label: "Cuisine", href: "/dashboard/kitchen", active: true },
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // ignore
  }
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  return `${Math.floor(diff / 3600)}h`;
}

// ── Card border by status ─────────────────────────────────────────────────────

function getCardStyle(status: OrderStatus): { border: string; badge: string; label: string } {
  switch (status) {
    case "pending":
      return { border: "border-yellow-400", badge: "bg-yellow-100 text-yellow-800", label: "En attente" };
    case "confirmed":
      return { border: "border-blue-400", badge: "bg-blue-100 text-blue-800", label: "Confirmée" };
    case "preparing":
      return { border: "border-orange-400", badge: "bg-orange-100 text-orange-800", label: "En préparation" };
    default:
      return { border: "border-gray-600", badge: "bg-gray-700 text-gray-200", label: status };
  }
}

// ── Order Card ─────────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: Order;
  onMarkReady: (id: string) => void;
}

function OrderCard({ order, onMarkReady }: OrderCardProps) {
  const style = getCardStyle(order.status);
  return (
    <div className={`bg-gray-900 border-2 ${style.border} rounded-xl p-5 flex flex-col gap-4`}>
      {/* Top */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-extrabold text-white leading-none">
            {order.table_name ?? "Sans table"}
          </p>
          <p className="text-sm text-gray-500 font-mono mt-1">
            #{order.id.slice(-6).toUpperCase()}
          </p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.badge}`}>
          {style.label}
        </span>
      </div>

      {/* Items */}
      <div className="flex-1 space-y-2 border-t border-gray-800 pt-3">
        {order.items && order.items.length > 0 ? (
          order.items.map((item: OrderItem) => (
            <div key={item.id} className="text-base text-white">
              <span className="font-bold text-yellow-300 text-lg">{item.quantity}×</span>{" "}
              {item.menu_item_name}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">Aucun article</p>
        )}
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          ⏱ {timeAgo(order.created_at)}
        </span>
        <button
          onClick={() => onMarkReady(order.id)}
          className="bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
        >
          ✓ Prête
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing"];

export default function KitchenPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const seenOrderIds = useRef<Set<string>>(new Set());

  // Clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const fetchOrders = useCallback(async (restId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("*, items:order_items(id, menu_item_id, menu_item_name, quantity, unit_price, total_price)")
      .eq("restaurant_id", restId)
      .in("status", ACTIVE_STATUSES)
      .order("created_at", { ascending: true });
    setOrders((data as Order[]) ?? []);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let channelRef: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("owner_id", user.id)
        .single();
      if (!restaurant) return;
      setRestaurantId(restaurant.id);
      await fetchOrders(restaurant.id);
      setLoading(false);

      const channel = supabase
        .channel("kitchen-realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurant.id}` },
          (payload) => {
            const newOrder = payload.new as Order;
            if (!seenOrderIds.current.has(newOrder.id)) {
              seenOrderIds.current.add(newOrder.id);
              playNotificationSound();
              if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                new Notification(`Nouvelle commande — ${newOrder.table_name ?? "Table"}`, {
                  body: `#${newOrder.id.slice(-6).toUpperCase()}`,
                  icon: "/favicon.ico",
                  tag: `kds-${newOrder.id}`,
                });
              }
            }
            fetchOrders(restaurant.id);
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurant.id}` },
          () => { fetchOrders(restaurant.id); }
        )
        .subscribe();

      channelRef = channel;
    }

    init();

    return () => {
      if (channelRef) supabase.removeChannel(channelRef);
    };
  }, [fetchOrders]);

  async function markReady(orderId: string) {
    const supabase = createClient();
    await supabase.from("orders").update({ status: "ready" }).eq("id", orderId);
    if (restaurantId) await fetchOrders(restaurantId);
  }

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-6 h-6 text-orange-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Cuisine — KDS</h1>
              <p className="text-xs text-gray-400">
                {orders.length} commande{orders.length !== 1 ? "s" : ""} active{orders.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-mono text-gray-200 tabular-nums">
              {currentTime.toLocaleTimeString("fr-FR")}
            </span>
            <button
              onClick={handleFullscreen}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
              Plein écran
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="text-center">
                <div className="text-7xl mb-4">🍳</div>
                <p className="text-3xl font-bold text-gray-400">Cuisine au calme</p>
                <p className="text-gray-600 mt-2 text-lg">Les nouvelles commandes apparaîtront ici</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} onMarkReady={markReady} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
