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
} from "lucide-react";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

// ── Sidebar ───────────────────────────────────────────────────────────────────

const navLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
  { icon: UtensilsCrossed, label: "Menu", href: "/dashboard/menu", active: false },
  { icon: QrCode, label: "Tables & QR", href: "/dashboard/tables", active: false },
  { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics", active: false },
  { icon: Settings, label: "Settings", href: "/dashboard/settings", active: false },
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
          Sign out
        </button>
      </div>
    </aside>
  );
}

// ── Stats cards ───────────────────────────────────────────────────────────────

const stats = [
  {
    label: "Today's Orders",
    value: "142",
    delta: "+12% vs yesterday",
    positive: true,
    icon: ShoppingBag,
    color: "blue",
  },
  {
    label: "Revenue",
    value: "$3,840",
    delta: "+8% vs yesterday",
    positive: true,
    icon: DollarSign,
    color: "green",
  },
  {
    label: "Active Tables",
    value: "18 / 24",
    delta: "6 available",
    positive: null,
    icon: Table2,
    color: "orange",
  },
  {
    label: "Avg Order Value",
    value: "$27.04",
    delta: "+3% vs last week",
    positive: true,
    icon: TrendingUp,
    color: "purple",
  },
];

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-700", icon: "text-green-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", icon: "text-orange-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", icon: "text-purple-600" },
};

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const c = colorMap[stat.color];
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg}`}>
                <Icon className={`w-4.5 h-4.5 ${c.icon}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
            <p
              className={`text-xs font-medium ${
                stat.positive === true
                  ? "text-green-600"
                  : stat.positive === false
                  ? "text-red-500"
                  : "text-slate-500"
              }`}
            >
              {stat.delta}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── Recent orders table ───────────────────────────────────────────────────────

const recentOrders = [
  {
    id: "#ORD-1021",
    table: "Table 4",
    items: "Burger, Fries, Coke",
    status: "preparing",
    amount: "$24.50",
    time: "2 min ago",
  },
  {
    id: "#ORD-1020",
    table: "Table 9",
    items: "Caesar Salad, Pasta",
    status: "ready",
    amount: "$32.00",
    time: "8 min ago",
  },
  {
    id: "#ORD-1019",
    table: "Table 12",
    items: "Steak, Wine, Tiramisu",
    status: "delivered",
    amount: "$87.00",
    time: "15 min ago",
  },
  {
    id: "#ORD-1018",
    table: "Table 2",
    items: "Margherita, Garlic Bread",
    status: "pending",
    amount: "$19.90",
    time: "18 min ago",
  },
  {
    id: "#ORD-1017",
    table: "Table 7",
    items: "Sushi Platter x2",
    status: "confirmed",
    amount: "$64.00",
    time: "22 min ago",
  },
];

type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

const statusStyles: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-slate-100 text-slate-700" },
  confirmed: { label: "Confirmed", className: "bg-blue-50 text-blue-700" },
  preparing: { label: "Preparing", className: "bg-orange-50 text-orange-700" },
  ready: { label: "Ready", className: "bg-green-50 text-green-700" },
  delivered: { label: "Delivered", className: "bg-slate-50 text-slate-500" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-600" },
};

function RecentOrders() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
          <p className="text-xs text-slate-500 mt-0.5">Live updates</p>
        </div>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Order
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Table
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                Items
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentOrders.map((order) => {
              const s = statusStyles[order.status as OrderStatus];
              return (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {order.id}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {order.time}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {order.table}
                    </p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-sm text-slate-500 truncate max-w-[200px]">
                      {order.items}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.className}`}
                    >
                      {s.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {order.amount}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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

  const displayName =
    user.user_metadata?.restaurant_name ??
    user.email?.split("@")[0] ??
    "Restaurant";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Welcome back,{" "}
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

        {/* Content */}
        <main className="p-6 space-y-6">
          <StatsGrid />
          <RecentOrders />
        </main>
      </div>
    </div>
  );
}
