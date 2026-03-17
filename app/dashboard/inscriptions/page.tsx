"use client";

/**
 * Page admin — Gestion des demandes d'inscription restaurant
 */

import { useState, useEffect } from "react";
import { ProtectedAdminRoute } from "@/components/auth/ProtectedAdminRoute";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmModal";
import Link from "next/link";
import {
  getAllRegistrationRequests,
  updateRegistrationStatus,
} from "@/services/registration-service";
import {
  RegistrationRequest,
  RegistrationStatus,
} from "@/lib/types/registration-request";

function InscriptionsContent() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RegistrationStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllRegistrationRequests();
      setRequests(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Erreur : ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: RegistrationStatus
  ) => {
    const label = newStatus === "approved" ? "approuver" : "rejeter";
    const ok = await confirm(`Voulez-vous ${label} cette demande ?`, {
      confirmText: newStatus === "approved" ? "Approuver" : "Rejeter",
      variant: newStatus === "rejected" ? "danger" : "default",
    });
    if (!ok) return;

    try {
      setUpdatingId(id);
      await updateRegistrationStatus(id, newStatus);
      toast.success(
        newStatus === "approved"
          ? "Demande approuvée !"
          : "Demande rejetée."
      );
      await loadRequests();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Erreur : ${message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const statusCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const statusBadge = (status: RegistrationStatus) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      pending: "En attente",
      approved: "Approuvée",
      rejected: "Rejetée",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  &larr; Retour
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Demandes d&apos;inscription
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={loadRequests}>
              Actualiser
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as const).map((s) => {
            const labels = {
              all: "Toutes",
              pending: "En attente",
              approved: "Approuvées",
              rejected: "Rejetées",
            };
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === s
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {labels[s]} ({statusCounts[s]})
              </button>
            );
          })}
        </div>

        {/* Liste */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-gray-500">Aucune demande pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {req.restaurantName}
                      </h3>
                      {statusBadge(req.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {req.description || "Pas de description"}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      <div>
                        <span className="text-gray-500">Propri&eacute;taire :</span>{" "}
                        <span className="font-medium text-gray-900">
                          {req.ownerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email :</span>{" "}
                        <a
                          href={`mailto:${req.email}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {req.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-gray-500">T&eacute;l&eacute;phone :</span>{" "}
                        <a
                          href={`tel:${req.phone}`}
                          className="font-medium text-gray-900"
                        >
                          {req.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-gray-500">Ville :</span>{" "}
                        <span className="font-medium text-gray-900">
                          {req.city}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Tables :</span>{" "}
                        <span className="font-medium text-gray-900">
                          {req.estimatedTables}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Date :</span>{" "}
                        <span className="font-medium text-gray-900">
                          {new Date(req.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {req.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 italic">
                          &laquo; {req.message} &raquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {req.status === "pending" && (
                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={updatingId === req.id}
                        onClick={() => handleStatusChange(req.id, "approved")}
                      >
                        {updatingId === req.id ? "..." : "Approuver"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updatingId === req.id}
                        onClick={() => handleStatusChange(req.id, "rejected")}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function InscriptionsPage() {
  return (
    <ProtectedAdminRoute>
      <InscriptionsContent />
    </ProtectedAdminRoute>
  );
}
