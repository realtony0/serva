"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard, UtensilsCrossed, QrCode, BarChart2, Settings, LogOut, Zap,
  Plus, Trash2, X, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { Table, TableStatus } from "@/lib/types";

// ── Sidebar ───────────────────────────────────────────────────────────────────

const navLinks = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard" },
  { icon: UtensilsCrossed, label: "Menu", href: "/dashboard/menu" },
  { icon: QrCode, label: "Tables & QR", href: "/dashboard/tables", active: true },
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

// ── Status badge ──────────────────────────────────────────────────────────────

const statusConfig: Record<TableStatus, { label: string; className: string }> = {
  available: { label: "Disponible", className: "bg-green-100 text-green-700" },
  occupied: { label: "Occupée", className: "bg-orange-100 text-orange-700" },
  reserved: { label: "Réservée", className: "bg-blue-100 text-blue-700" },
  closed: { label: "Fermée", className: "bg-slate-100 text-slate-500" },
};

// ── QR Modal ──────────────────────────────────────────────────────────────────

interface QrModalProps {
  table: Table;
  slug: string;
  onClose: () => void;
}

function QrModal({ table, slug, onClose }: QrModalProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const tableUrl = `${siteUrl}/${slug}/table/${table.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tableUrl)}`;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-sm p-6 text-center">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">QR Code — {table.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrUrl} alt={`QR ${table.name}`} className="w-48 h-48 mx-auto rounded-lg mb-4" />
        <p className="text-xs text-slate-500 break-all mb-4">{tableUrl}</p>
        <a
          href={qrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Télécharger / Ouvrir
        </a>
      </div>
    </div>
  );
}

// ── Add Table Modal ───────────────────────────────────────────────────────────

interface AddTableModalProps {
  restaurantId: string;
  onClose: () => void;
  onSaved: () => void;
}

function AddTableModal({ restaurantId, onClose, onSaved }: AddTableModalProps) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.from("tables").insert({
      restaurant_id: restaurantId,
      name,
      capacity: parseInt(capacity),
      status: "available" as TableStatus,
      qr_code_url: null,
      position_x: null,
      position_y: null,
    });
    if (err) { setError(err.message); setLoading(false); return; }
    setLoading(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-slate-900">Nouvelle table</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
            <input
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Table 1"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacité</label>
            <input
              type="number" min="1" max="50" required value={capacity} onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Création…" : "Créer la table"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TablesPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantSlug, setRestaurantSlug] = useState<string>("");
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [qrTable, setQrTable] = useState<Table | null>(null);

  const fetchTables = useCallback(async (restId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("tables")
      .select("*")
      .eq("restaurant_id", restId)
      .order("name", { ascending: true });
    setTables(data ?? []);
  }, []);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id, slug")
        .eq("owner_id", user.id)
        .single();
      if (!restaurant) return;
      setRestaurantId(restaurant.id);
      setRestaurantSlug(restaurant.slug);
      await fetchTables(restaurant.id);
      setLoading(false);
    }
    init();
  }, [fetchTables]);

  async function deleteTable(id: string) {
    if (!confirm("Supprimer cette table ?")) return;
    const supabase = createClient();
    await supabase.from("tables").delete().eq("id", id);
    if (restaurantId) await fetchTables(restaurantId);
  }

  async function updateStatus(id: string, status: TableStatus) {
    const supabase = createClient();
    await supabase.from("tables").update({ status }).eq("id", id);
    if (restaurantId) await fetchTables(restaurantId);
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

      {showAddModal && restaurantId && (
        <AddTableModal
          restaurantId={restaurantId}
          onClose={() => setShowAddModal(false)}
          onSaved={async () => {
            setShowAddModal(false);
            if (restaurantId) await fetchTables(restaurantId);
          }}
        />
      )}

      {qrTable && (
        <QrModal table={qrTable} slug={restaurantSlug} onClose={() => setQrTable(null)} />
      )}

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tables & QR</h1>
            <p className="text-sm text-slate-500 mt-0.5">Gérez vos tables et codes QR</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une table
          </button>
        </header>

        <main className="p-6">
          {tables.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <QrCode className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 text-sm mb-4">Aucune table configurée</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Créer une table
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tables.map((table) => {
                const sc = statusConfig[table.status];
                return (
                  <div key={table.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{table.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{table.capacity} places</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.className}`}>
                        {sc.label}
                      </span>
                    </div>

                    {/* Status select */}
                    <select
                      value={table.status}
                      onChange={(e) => updateStatus(table.id, e.target.value as TableStatus)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    >
                      <option value="available">Disponible</option>
                      <option value="occupied">Occupée</option>
                      <option value="reserved">Réservée</option>
                      <option value="closed">Fermée</option>
                    </select>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQrTable(table)}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        QR Code
                      </button>
                      <button
                        onClick={() => deleteTable(table.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg border border-slate-200 hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
