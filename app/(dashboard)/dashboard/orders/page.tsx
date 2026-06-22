"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  LayoutDashboard, UtensilsCrossed, QrCode, BarChart2, Settings, LogOut, Zap,
  Clock, X, ChevronRight, Bell, BellOff, ChefHat,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { Order, OrderStatus, OrderItem } from "@/lib/types";
import { Toast, useToast } from "@/components/Toast";

// ── Sidebar ───────────────────────────────────────────────────────────────────

const navLinks = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard" },
  { icon: UtensilsCrossed, label: "Menu", href: "/dashboard/menu" },
  { icon: QrCode, label: "Tables & QR", href: "/dashboard/tables" },
  { icon: BarChart2, label: "Commandes", href: "/dashboard/orders", active: true },
  { icon: ChefHat, label: "Cuisine", href: "/dashboard/kitchen" },
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

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_COLUMNS: OrderStatus[] = ["pending", "preparing", "ready", "delivered"];

const statusConfig: Record<OrderStatus, { label: string; header: string; card: string; badge: string }> = {
  pending:   { label: "En attente",       header: "bg-slate-100",  card: "border-slate-200", badge: "bg-slate-100 text-slate-700" },
  confirmed: { label: "Confirmée",        header: "bg-blue-50",    card: "border-blue-200",  badge: "bg-blue-50 text-blue-700" },
  preparing: { label: "En préparation",   header: "bg-orange-50",  card: "border-orange-200",badge: "bg-orange-50 text-orange-700" },
  ready:     { label: "Prête",            header: "bg-green-50",   card: "border-green-200", badge: "bg-green-50 text-green-700" },
  delivered: { label: "Servie",           header: "bg-slate-50",   card: "border-slate-100", badge: "bg-slate-50 text-slate-500" },
  cancelled: { label: "Annulée",          header: "bg-red-50",     card: "border-red-100",   badge: "bg-red-50 text-red-600" },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "preparing",
  preparing: "ready",
  ready: "delivered",
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: "Démarrer",
  preparing: "Prête",
  ready: "Servie",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  return `${Math.floor(diff / 3600)}h`;
}

// ── Order detail modal ────────────────────────────────────────────────────────

interface DetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

function DetailModal({ order, onClose, onStatusChange }: DetailModalProps) {
  const sc = statusConfig[order.status];
  const nextStatus = NEXT_STATUS[order.status];
  const nextLabel = NEXT_LABEL[order.status];

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Commande #{order.id.slice(-6).toUpperCase()}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{order.table_name ?? "Sans table"}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-4 ${sc.badge}`}>
          {sc.label}
        </span>

        {order.items && order.items.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Articles</h4>
            <div className="space-y-2">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">
                    {item.quantity}× {item.menu_item_name}
                  </span>
                  <span className="text-slate-900 font-medium">
                    {item.total_price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 pt-4 mb-4">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
            <span>Total</span>
            <span>{order.total.toFixed(2)} {order.currency}</span>
          </div>
        </div>

        {nextStatus && nextLabel && (
          <button
            onClick={() => { onStatusChange(order.id, nextStatus); onClose(); }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

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
    // ignore audio errors
  }
}

export default function OrdersPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const seenOrderIds = useRef<Set<string>>(new Set());
  const { toasts, addToast, dismissToast } = useToast();

  const fetchOrders = useCallback(async (restId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("restaurant_id", restId)
      .not("status", "in", "(cancelled)")
      .order("created_at", { ascending: false })
      .limit(100);
    setOrders((data as Order[]) ?? []);
  }, []);

  // Request browser notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
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

      // Realtime subscription
      const channel = supabase
        .channel("orders-realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurant.id}` },
          (payload) => {
            const newOrder = payload.new as Order;
            if (!seenOrderIds.current.has(newOrder.id)) {
              seenOrderIds.current.add(newOrder.id);
              if (notificationsEnabled) {
                playNotificationSound();
                if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                  new Notification(`Nouvelle commande — ${newOrder.table_name ?? "Table"}`, {
                    body: `Commande #${newOrder.id.slice(-6).toUpperCase()}`,
                    icon: "/favicon.ico",
                    tag: `order-${newOrder.id}`,
                  });
                }
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
  }, [fetchOrders, notificationsEnabled]);

  async function changeStatus(orderId: string, status: OrderStatus) {
    const supabase = createClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) { addToast("error", "Impossible de mettre à jour la commande."); return; }
    if (restaurantId) await fetchOrders(restaurantId);
  }

  const columns = STATUS_COLUMNS.map((status) => ({
    status,
    orders: orders.filter((o) => o.status === status),
  }));

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
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {selectedOrder && (
        <DetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={changeStatus}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Commandes</h1>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Mis à jour en temps réel
            </p>
          </div>
          <button
            onClick={() => {
              const next = !notificationsEnabled;
              setNotificationsEnabled(next);
              if (next && typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
                Notification.requestPermission();
              }
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              notificationsEnabled
                ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            Notifications {notificationsEnabled ? "activées" : "désactivées"}
          </button>
        </header>

        {orders.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-slate-400 text-base mb-1">
                Aucune commande pour l&apos;instant — les commandes apparaîtront ici en temps réel
              </p>
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        )}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-4 min-w-max h-full">
            {columns.map(({ status, orders: colOrders }) => {
              const sc = statusConfig[status];
              return (
                <div key={status} className="w-72 flex flex-col">
                  <div className={`px-4 py-2.5 rounded-t-xl border border-b-0 border-slate-200 ${sc.header}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">{sc.label}</span>
                      <span className="text-xs bg-white/70 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {colOrders.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-100/50 rounded-b-xl border border-slate-200 border-t-0 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {colOrders.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">Aucune commande</p>
                    ) : (
                      colOrders.map((order) => {
                        const nextStatus = NEXT_STATUS[order.status];
                        const nextLabel = NEXT_LABEL[order.status];
                        return (
                          <div
                            key={order.id}
                            className={`bg-white rounded-lg border ${sc.card} p-3 cursor-pointer hover:shadow-sm transition-shadow`}
                            onClick={() => setSelectedOrder(order)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  #{order.id.slice(-6).toUpperCase()}
                                </p>
                                <p className="text-xs text-slate-500">{order.table_name ?? "Sans table"}</p>
                              </div>
                              <p className="text-sm font-bold text-slate-900">
                                {order.total.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {timeAgo(order.created_at)}
                              </span>
                              <span>
                                {order.items?.length ?? 0} article{(order.items?.length ?? 0) > 1 ? "s" : ""}
                              </span>
                            </div>
                            {nextStatus && nextLabel && (
                              <button
                                onClick={(e) => { e.stopPropagation(); changeStatus(order.id, nextStatus); }}
                                className="w-full flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded-lg transition-colors"
                              >
                                {nextLabel}
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
