import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  ShoppingBag,
  Table2,
  DollarSign,
  Clock,
  ChevronRight,
  Zap,
  ChefHat,
} from "lucide-react";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import type { OrderStatus } from "@/lib/types";

// ── Sidebar ───────────────────────────────────────────────────────────────────

const navLinks = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard", active: true },
  { icon: UtensilsCrossed, label: "Menu", href: "/dashboard/menu", active: false },
  { icon: QrCode, label: "Tables & QR", href: "/dashboard/tables", active: false },
  { icon: BarChart2, label: "Commandes", href: "/dashboard/orders", active: false },
  { icon: ChefHat, label: "Cuisine", href: "/dashboard/kitchen", active: false },
  { icon: Settings, label: "Réglages", href: "/dashboard/settings", active: false },
];

function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 min-h-screen shrink-0">
      <div className="px-6 py-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Serva
          </span>
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
                item.active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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

// ── Stats cards ───────────────────────────────────────────────────────────────

const colorMap: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600" },
  green: { bg: "bg-green-50", icon: "text-green-600" },
  orange: { bg: "bg-orange-50", icon: "text-orange-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600" },
};

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  positive: boolean | null;
  icon: React.ElementType;
  color: string;
}

function StatCard({ label, value, delta, positive, icon: Icon, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg}`}>
          <Icon className={`w-4 h-4 ${c.icon}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p
        className={`text-xs font-medium ${
          positive === true
            ? "text-green-600"
            : positive === false
            ? "text-red-500"
            : "text-slate-500"
        }`}
      >
        {delta}
      </p>
    </div>
  );
}

// ── Recent orders table ───────────────────────────────────────────────────────

const statusStyles: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-slate-100 text-slate-700" },
  confirmed: { label: "Confirmée", className: "bg-blue-50 text-blue-700" },
  preparing: { label: "En préparation", className: "bg-orange-50 text-orange-700" },
  ready: { label: "Prête", className: "bg-green-50 text-green-700" },
  delivered: { label: "Servie", className: "bg-slate-50 text-slate-500" },
  cancelled: { label: "Annulée", className: "bg-red-50 text-red-600" },
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  return `${Math.floor(diff / 3600)}h`;
}

interface RecentOrderRow {
  id: string;
  table_name: string | null;
  status: string;
  total: number;
  currency: string;
  created_at: string;
}

function RecentOrders({ orders }: { orders: RecentOrderRow[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Commandes récentes</h2>
          <p className="text-xs text-slate-500 mt-0.5">10 dernières commandes</p>
        </div>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Tout voir
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10">Aucune commande pour l&apos;instant.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Table
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => {
                const s = statusStyles[order.status as OrderStatus] ?? statusStyles.pending;
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(order.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {order.table_name ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {order.total.toFixed(2)} {order.currency}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name, currency")
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) {
    redirect("/dashboard/onboarding");
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: todayOrders } = await supabase
    .from("orders")
    .select("id, total, status")
    .eq("restaurant_id", restaurant.id)
    .gte("created_at", todayStart.toISOString());

  const orderCount = todayOrders?.length ?? 0;
  const revenue = todayOrders?.reduce((sum, o) => sum + (o.total ?? 0), 0) ?? 0;
  const avgOrder = orderCount > 0 ? revenue / orderCount : 0;

  const { data: allTables } = await supabase
    .from("tables")
    .select("id, status")
    .eq("restaurant_id", restaurant.id);

  const totalTables = allTables?.length ?? 0;
  const occupiedTables = allTables?.filter((t) => t.status === "occupied").length ?? 0;

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, table_name, status, total, currency, created_at")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const displayName = restaurant.name ?? user.email?.split("@")[0] ?? "Restaurant";
  const currency = restaurant.currency ?? "CAD";

  const statsData: StatCardProps[] = [
    {
      label: "Commandes du jour",
      value: String(orderCount),
      delta: orderCount === 0 ? "Aucune commande" : `${orderCount} commande${orderCount > 1 ? "s" : ""}`,
      positive: null,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      label: "Recette du jour",
      value: `${revenue.toFixed(2)} ${currency}`,
      delta: orderCount === 0 ? "Aucune recette" : `${orderCount} commande${orderCount > 1 ? "s" : ""}`,
      positive: null,
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Tables actives",
      value: totalTables === 0 ? "—" : `${occupiedTables} / ${totalTables}`,
      delta: totalTables === 0 ? "Aucune table" : `${totalTables - occupiedTables} disponible${totalTables - occupiedTables !== 1 ? "s" : ""}`,
      positive: null,
      icon: Table2,
      color: "orange",
    },
    {
      label: "Panier moyen",
      value: orderCount === 0 ? "—" : `${avgOrder.toFixed(2)} ${currency}`,
      delta: "Aujourd'hui",
      positive: null,
      icon: TrendingUp,
      color: "purple",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tableau de bord</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Bon retour,{" "}
              <span className="font-medium text-slate-700">{displayName}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {displayName[0].toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <RecentOrders orders={recentOrders ?? []} />
        </main>
      </div>
    </div>
  );
}
